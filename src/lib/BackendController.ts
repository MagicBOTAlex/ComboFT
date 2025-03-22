import { ETApi} from "./ET_API";
import { Logger } from "./Logger";
import type { Box } from "./structs/Box";
import type { Camera } from "./structs/Camera";
import { CameraStreamType, getStreamTypeAPIName } from "./structs/CameraStreamType";
import type { ET_Algorithms } from "./structs/ET_Api/ET_Algorithms";
import { BackendStatus } from "./structs/BackendStatus";
import type { ET_Config } from "./structs/ET_Api/ET_Config";
import type { ET_Tracker, ET_Tracker as TrackerConfig } from "./structs/ET_Api/ET_Tracker";
import type { ET_TrackerConfigOutput } from "./structs/ET_Api/ET_TrackerConfigOutput";
import  { TrackerPosition } from "./structs/TrackerPosition";
import { writable, type Writable} from 'svelte/store';
import { PB_API } from "./PB_API";
import { PB_Controller } from "./PB_Controller";
import { BackendTarget } from "./structs/BackendTarget";

export class BackendController {
    ET_Status: BackendStatus = BackendStatus.Stopped;
    ET_Api: ETApi; // Oh shit, TS supports this (props)? I love it!!!
    ET_Config: ET_Config |undefined;
    ET_UUIDs: Partial<Record<TrackerPosition, string | undefined>> = {}; // I Really hate this UUID system. We're never going to have that many cameras!!! Other things will break down long before.
    store: Writable<BackendController> | any;

    PB_Api: PB_API;
    babbleController: PB_Controller;

    constructor(ET_url: string, PB_url: string) {
        this.ET_Api = new ETApi(ET_url);
        this.store = writable(this);
        
        this.PB_Api = new PB_API(PB_url);
        this.babbleController = new PB_Controller(this.PB_Api);
        
        this.initialize();
    }

    private async initialize() {
        try {
            await this.ET_Api.loadConfig();
            await this.getConfig(true);
            setInterval(this.checkStatus.bind(this), 5000);
        } catch (error) {
            Logger.log('error', 'Initialization failed', error);
        }
    }

    async start() {
        // Temp
        setTimeout(() => {
            if (this.ET_Config) {
                this.ET_Config.osc.sending_port = 8889;
                this.ET_Config.osc.receiver_port = 9455;
                this.pushConfig();
            }
        }, 6000);
        this.ET_Api.startETVR();

        this.babbleController.start();
    }

    async Stop() {
        const shutdownInterval = setInterval(async () => {
            if (this.ET_Status === BackendStatus.Running) {
                await this.ET_Api.stopETVR();
                await this.checkStatus();
            } else {
                clearInterval(shutdownInterval);
            }
        }, 500);

        this.babbleController.stop();
    }

    async quit() { // Not used
        await this.ET_Api.shutdownETVR(); 
        this.ET_Status = BackendStatus.Quit;
        this.store.set(this);

        this.babbleController.stop();
    }

    async getConfig(forceUpdate: boolean = false) {
        if (!this.ET_Config || forceUpdate) {
            this.ET_Config = await this.ET_Api.getConfig();
            this.store.set(this);
        }
        return this.ET_Config;
    }

    // Runs to check current status
    // Default ETVR to keep old code support. This is a one man show after all
    public async checkStatus(target: BackendTarget = BackendTarget.ETVR): Promise<BackendStatus> {
        if (target == BackendTarget.ETVR) {
            try {
                const newStatus = await this.ET_Api.getETVRStatus();
                const newStatusEnum = newStatus ? BackendStatus.Running : BackendStatus.Stopped;
                
                if (newStatusEnum !== this.ET_Status) {
                    Logger.log('info', `ETVR ${newStatus ? 'now running...' : 'stopped.'}`);
                    this.ET_Status = newStatusEnum;
                    this.store.set(this);
                }
    
                return newStatusEnum;
            } catch (error) {
                Logger.log('error', 'Status check failed', error);
            }
        } else {
            return await this.babbleController.getStatus();
        }
        
        return BackendStatus.Stopped;
    }

    private async ensureTrackerUuid(position: TrackerPosition): Promise<string> {
        if (!this.ET_UUIDs[position]) {
            const trackerConf = await this.getTrackingCameraConfig(position);
            if (!trackerConf?.uuid) {
                Logger.log('error', `Failed to get UUID for position ${position}`);
                throw new Error(`Missing UUID for ${position}`);
            }
            this.ET_UUIDs[position] = trackerConf.uuid;
        }
        return this.ET_UUIDs[position]!;
    }

    // Here comes the powerful stuff by making this class:
    // Returns the Stream URL
    public async getTrackingCameraStream(position: TrackerPosition, streamType: CameraStreamType): Promise<string> {
        if (position != TrackerPosition.Babble)
        {
            try {
                const uuid = await this.ensureTrackerUuid(position);
                const streamAPIName = getStreamTypeAPIName(streamType);
                return `${this.ET_Api.baseURL}/etvr/feed/${uuid}/${streamAPIName}`;
            } catch (error) {
                Logger.log('error', 'Failed to get camera stream URL', error);
                return "";
            }
        } else {
            switch (streamType){
                case CameraStreamType.Raw:
                    return this.PB_Api.getRawCameraFeed()

                case CameraStreamType.Cropped:
                    return this.PB_Api.getCroppedCameraFeed()

                case CameraStreamType.Algorithmed:
                    return this.PB_Api.getProcessedCameraFeed()
            }
        }
    }

    public async getETVRName(position: TrackerPosition): Promise<string> {
        const names = {
            [TrackerPosition.Left]: "left_eye",
            [TrackerPosition.Right]: "right_eye",
            [TrackerPosition.Babble]: "mouth",
        };
        
        if (!(position in names)) {
            throw new Error("Invalid tracking position");
        }
        return names[position];
    }

    public async getTrackingCameraConfig(position: TrackerPosition): Promise<TrackerConfig | undefined> {
        try {
            if (!this.ET_Config) await this.getConfig();
            const trackerName = await this.getETVRName(position);
            return this.ET_Config?.trackers.find(
                t => t.tracker_position === trackerName
            );
        } catch (error) {
            Logger.log("warn", "No tracker found", error);
            return undefined;
        }
    }

    async pushConfig() {
        try {
            if (!this.ET_Config) await this.getConfig();
            if (this.ET_Config) {
                await this.ET_Api.updateConfig(this.ET_Config);
                await this.ET_Api.saveConfig();
                await this.getConfig(true); // Refresh local config
            }
        } catch (error) {
            Logger.log('error', 'Failed to push config', error);
        }
    }

    public async pushCameraAddr(cam: Camera) {
        if (cam.position != TrackerPosition.Babble){
            try {
                if (!cam.position) return;
                const uuid = await this.ensureTrackerUuid(cam.position);
                await this.ET_Api.updateTracker(uuid, {
                    camera: { capture_source: cam.addr }
                });
            } catch (error) {
                Logger.log('error', 'Failed to push camera address', error);
            }
        } else {
            this.babbleController.updateConfig({
                "cam": {
                    "capture_source": cam.addr
                }
            });
        }
    }

    public async pushCrop(position: TrackerPosition, croppingBox: Box) {
        if (position != TrackerPosition.Babble) {
            try {
                const uuid = await this.ensureTrackerUuid(position);
                const update = croppingBox.isValid() ? {
                    roi_x: croppingBox.x,
                    roi_y: croppingBox.y,
                    roi_w: croppingBox.w,
                    roi_h: croppingBox.h
                } : {
                    roi_x: null,
                    roi_y: null,
                    roi_w: null,
                    roi_h: null
                };
    
                await this.ET_Api.updateTracker(uuid, {
                    camera: update
                });
            } catch (error) {
                Logger.log('error', 'Failed to push crop', error);
            }
        } else {
            try {
                const update = croppingBox.isValid() ? {
                    roi_window_x: croppingBox.x,
                    roi_window_y: croppingBox.y,
                    roi_window_w: croppingBox.w,
                    roi_window_h: croppingBox.h
                } : {
                    roi_window_x: null,
                    roi_window_y: null,
                    roi_window_w: null,
                    roi_window_h: null
                };
    
                this.babbleController.updateConfig({
                    "cam": {
                        ...update
                    }
                });
            } catch (error) {
                Logger.log('error', 'Failed to push crop', error);
            }
        }
    }

    public async getCameraAlgorithems(cam: Camera): Promise<ET_Algorithms[] | undefined> {
        try {
            const uuid = await this.ensureTrackerUuid(cam.position);
            const tracker = await this.ET_Api.getTracker(uuid);
            return tracker?.algorithm?.algorithm_order;
        } catch (error) {
            Logger.log('error', 'Failed to get algorithms', error);
            return undefined;
        }
    }

    // Pushes the algorithems and their order to the back-end config
    public async pushCameraAlgorithems(cam: Camera, algoList: ET_Algorithms[]) {
        try {
            const uuid = await this.ensureTrackerUuid(cam.position);
            await this.ET_Api.updateTracker(uuid, {
                algorithm: { algorithm_order: algoList }
            });
        } catch (error) {
            Logger.log('error', 'Failed to push algorithms', error);
        }
    }

    public async startCalibration(position: TrackerPosition) {
        try {
            if (position != TrackerPosition.Babble){
                const uuid = await this.ensureTrackerUuid(position);
                await this.ET_Api.updateTracker(uuid, {
                    calibrationData: { min_x: Math.random() * 11 - 100 }
                });
            } else {
                await this.PB_Api.startCalibration();
            }
        } catch (error) {
            Logger.log('error', 'Calibration failed to start', error);
        }
    }
}