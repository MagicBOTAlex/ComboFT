import { ETApi} from "./ET_API";
import { Logger } from "./Logger";
import type { Box } from "./structs/Box";
import type { Camera } from "./structs/Camera";
import { CameraStreamType, getStreamTypeAPIName } from "./structs/CameraStreamType";
import type { ET_Algorithms } from "./structs/ET_Api/ET_Algorithms";
import { BackendStatus } from "./structs/BackendStatus";
import type { ET_Config } from "./structs/ET_Api/ET_Config";
import type { ET_Tracker as TrackerConfig } from "./structs/ET_Api/ET_Tracker";
import type { ET_TrackerConfigOutput } from "./structs/ET_Api/ET_TrackerConfigOutput";
import  { TrackerPosition } from "./structs/TrackerPosition";
import { writable, type Writable} from 'svelte/store';

export class BackendController {
    ET_Status: BackendStatus = BackendStatus.Stopped;
    ET_Api: ETApi; // Oh shit, TS supports this? I love it!!!
    ET_Config: ET_Config |undefined;
    ET_UUIDs: Partial<Record<TrackerPosition, string | undefined>> = {}; // I Really hate this UUID system. We're never going to have that many cameras!!! Other things will break down long before.
    store: Writable<BackendController> | any;

    constructor(url: string) {
        this.ET_Api = new ETApi(url);
        this.ET_Api.loadConfig(); // Load old config by default
        this.getConfig(true);
        this.store = writable(this);


        setInterval(this.checkStatus.bind(this), 5000); // Update status every x
    }

    async start(){this.ET_Api.startETVR();}    
    async Stop(){this.ET_Api.stopETVR();
        const shutdownInterval = setInterval(() => {
            if (this.ET_Status == BackendStatus.Running) {
                this.ET_Api.stopETVR();
            } else {
                clearInterval(shutdownInterval);
            }
        }, 500);
    }
    async Reset(){this.ET_Api.restartETVR();}
    async quit(){this.ET_Api.shutdownETVR(); this.ET_Status = BackendStatus.Quit;}

    async getConfig(forceUpdate: boolean = false) {
        if (!this.ET_Config || forceUpdate) {
            this.ET_Config = await this.ET_Api.getConfig();
        }
        return this.ET_Config;
    }

    // Runs to check current status
    public async checkStatus(){ // No way!!! pulic too. This is just like C#
        let newStatus: boolean = await this.ET_Api.getETVRStatus();
        if (((newStatus) ? BackendStatus.Running : BackendStatus.Stopped) != this.ET_Status){
            Logger.log('info', (newStatus) ? "ETVR now running..." : "ETVR stopped.")
        }
        this.ET_Status = (newStatus) ? BackendStatus.Running : BackendStatus.Stopped;
    }

    // Here comes the powerful stuff by making this class:
    // Returns the Stream URL
    public async getTrackingCameraStream(trackingCam: TrackerPosition, streamType: CameraStreamType): Promise<string> {
        if (!this.ET_UUIDs[trackingCam]){
            let trackerConf = await this.getTrackingCameraConfig(trackingCam);
            if (!trackerConf) return "";
            this.ET_UUIDs[trackingCam] = trackerConf.uuid;
        }
        let streamAPIName = getStreamTypeAPIName(streamType);

        return `${this.ET_Api.baseURL}/etvr/feed/${this.ET_UUIDs[trackingCam]}/${streamAPIName}`;
    }

    public async getETVRName(position: TrackerPosition): Promise<string>{
        switch (position) {
            case TrackerPosition.Left:
                return "left_eye";
            case TrackerPosition.Right:
                return "right_eye";
            case TrackerPosition.Babble:
                return "mouth";
            default:
                throw new Error("Invalid tracking position");
        }
    }

    public async getTrackingCameraConfig(position: TrackerPosition): Promise<TrackerConfig | undefined>{
        if (!this.ET_Config) await this.getConfig();
        if (!this.ET_Config) return undefined;
        const trackers: TrackerConfig[]  = this.ET_Config.trackers;

        for (let I = 0; I < trackers.length; I++) {
            const tracker = trackers[I];
            if (tracker.tracker_position == await this.getETVRName(position))
                return tracker
        }

        Logger.log("warn", "No tracker found");

        return undefined;
    }

    async pushConfig(){
        if (!this.ET_Config) await this.getConfig();
        if (!this.ET_Config) return;
        this.ET_Api.updateConfig(this.ET_Config);
        this.ET_Api.saveConfig();
    }

    public async setTrackerCameraSource(trackingCam: TrackerPosition, addr: string){
        if (!this.ET_UUIDs[trackingCam]) await this.getTrackingCameraStream(trackingCam, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad
        if (!this.ET_UUIDs[trackingCam]) return;
        this.ET_Api.updateTracker(this.ET_UUIDs[trackingCam], 
            {"camera": {
                "capture_source": addr
            }
        });
    }

    public async pushCameraAddr(cam: Camera){
        let trackerConf = await this.getTrackingCameraConfig(cam.position);
        if (!trackerConf) {
            Logger.log("error", "Returned with undefined");
        }
        
        // Should never return
        if (!cam.position) return;
        if (!trackerConf) return;

        if (!this.ET_UUIDs[cam.position]) await this.getTrackingCameraStream(cam.position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad
        if (this.ET_UUIDs[cam.position] == undefined) return;
        let uuid: string = this.ET_UUIDs[cam.position]!;
        this.ET_Api.updateTracker(uuid, {
            "camera": {
                "capture_source": cam.addr
            }
        });
    }

    public async pushCrop(position: TrackerPosition, croppingBox: Box){
        // Third time using this chunk. This is really a TODO lol
        if (!this.ET_UUIDs[position]) await this.getTrackingCameraStream(position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad.
        if (this.ET_UUIDs[position] == undefined) return;
        let uuid: string = this.ET_UUIDs[position]!;
        if (croppingBox.isValid()){
            this.ET_Api.updateTracker(uuid, {
                "camera": {
                    "roi_x": croppingBox.x,
                    "roi_y": croppingBox.y,
                    "roi_w": croppingBox.w,
                    "roi_h": croppingBox.h
                }
            });
        } else {
            Logger.log('warn', "Invalid crop box detected. resetting crop");
            this.ET_Api.updateTracker(uuid, {
                "camera": {
                    "roi_x": null,
                    "roi_y": null,
                    "roi_w": null,
                    "roi_h": null
                }
            });
        }
    }

    public async getCameraAlgorithems(cam: Camera): Promise<ET_Algorithms[] | undefined>{
        if (!this.ET_UUIDs[cam.position]) await this.getTrackingCameraStream(cam.position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad. (This should be called on start/connected for all cams. Ez ensure all UUID is never undefined)
        if (this.ET_UUIDs[cam.position] == undefined) return;

        let cameraTracker: ET_TrackerConfigOutput = await this.ET_Api.getTracker(this.ET_UUIDs[cam.position]!);
        if (!cameraTracker) return undefined;
        if (!cameraTracker.algorithm) return undefined;
        if (!cameraTracker.algorithm.algorithm_order || cameraTracker.algorithm.algorithm_order.length == 0) return undefined;

        return cameraTracker.algorithm.algorithm_order;
    }

    // Pushes the algorithems and their order to the back-end config
    public async pushCameraAlgorithems(cam: Camera, algoList: ET_Algorithms[]){
        if (!this.ET_UUIDs[cam.position]) await this.getTrackingCameraStream(cam.position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad. (This should be called on start/connected for all cams. Ez ensure all UUID is never undefined)
        if (this.ET_UUIDs[cam.position] == undefined) return; // Wooomp wooomp. using it again

        let uuid: string = this.ET_UUIDs[cam.position]!;
        this.ET_Api.updateTracker(uuid, {
            "algorithm": {
                "algorithm_order" : algoList
            }
        });
    }
}