import { ETVRApi} from "./ETVR_API";
import { Logger } from "./Logger";
import type { Box } from "./structs/Box";
import type { Camera } from "./structs/Camera";
import { CameraStreamType, getStreamTypeAPIName } from "./structs/CameraStreamType";
import { ETVRStatus } from "./structs/ETVRBackendStatus";
import type { ETVRConfig, Tracker as TrackerConfig } from "./structs/ETVRConfig";
import  { TrackerPosition } from "./structs/TrackerPosition";
import { writable, type Writable} from 'svelte/store';

export class ETVR_Controller {
    status: ETVRStatus = ETVRStatus.Stopped;
    api: ETVRApi; // Oh shit, TS supports this? I love it!!!
    config: ETVRConfig |undefined;
    UUIDs: Partial<Record<TrackerPosition, string | undefined>> = {};
    store: Writable<ETVR_Controller> | any;

    constructor(url: string) {
        this.api = new ETVRApi(url);
        this.api.loadConfig(); // Load old config by default
        this.getConfig(true);
        this.store = writable(this);
        


        setInterval(this.checkStatus.bind(this), 5000); // Update status every x
    }

    async start(){this.api.startETVR();}    
    async Stop(){this.api.stopETVR();
        const shutdownInterval = setInterval(() => {
            if (this.status == ETVRStatus.Running) {
                this.api.stopETVR();
            } else {
                clearInterval(shutdownInterval);
            }
        }, 500);
    }
    async Reset(){this.api.restartETVR();}
    async quit(){this.api.shutdownETVR(); this.status = ETVRStatus.Quit;}

    async getConfig(forceUpdate: boolean = false) {
        if (!this.config || forceUpdate) {
            this.config = await this.api.getConfig();
        }
        return this.config;
    }

    // Runs to check current status
    public async checkStatus(){ // No way!!! pulic too. This is just like C#
        let newStatus: boolean = await this.api.getETVRStatus();
        if (((newStatus) ? ETVRStatus.Running : ETVRStatus.Stopped) != this.status){
            Logger.log('info', (newStatus) ? "ETVR now running..." : "ETVR stopped.")
        }
        this.status = (newStatus) ? ETVRStatus.Running : ETVRStatus.Stopped;
    }

    // Here comes the powerful stuff by making this class:
    // Returns the Stream URL
    public async getTrackingCameraStream(trackingCam: TrackerPosition, streamType: CameraStreamType): Promise<string> {
        if (!this.UUIDs[trackingCam]){
            let trackerConf = await this.getTrackingCameraConfig(trackingCam);
            if (!trackerConf) return "";
            this.UUIDs[trackingCam] = trackerConf.uuid;
        }
        let streamAPIName = getStreamTypeAPIName(streamType);

        return `${this.api.baseURL}/etvr/feed/${this.UUIDs[trackingCam]}/${streamAPIName}`;
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
        if (!this.config) await this.getConfig();
        if (!this.config) return undefined;
        const trackers: TrackerConfig[]  = this.config.trackers;

        for (let I = 0; I < trackers.length; I++) {
            const tracker = trackers[I];
            if (tracker.tracker_position == await this.getETVRName(position))
                return tracker
        }

        Logger.log("warn", "No tracker found");

        return undefined;
    }

    async pushConfig(){
        if (!this.config) await this.getConfig();
        if (!this.config) return;
        this.api.updateConfig(this.config);
        this.api.saveConfig();
    }

    public async setTrackerCameraSource(trackingCam: TrackerPosition, addr: string){
        if (!this.UUIDs[trackingCam]) await this.getTrackingCameraStream(trackingCam, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad
        if (!this.UUIDs[trackingCam]) return;
        this.api.updateTracker(this.UUIDs[trackingCam], 
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

        if (!this.UUIDs[cam.position]) await this.getTrackingCameraStream(cam.position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad
        if (this.UUIDs[cam.position] == undefined) return;
        let uuid: string = this.UUIDs[cam.position]!;
        this.api.updateTracker(uuid, {
            "camera": {
                "capture_source": cam.addr
            }
        });
    }

    public async pushCrop(position: TrackerPosition, croppingBox: Box){
        // Third time using this chunk. This is really a TODO lol
        if (!this.UUIDs[position]) await this.getTrackingCameraStream(position, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad.
        if (this.UUIDs[position] == undefined) return;
        let uuid: string = this.UUIDs[position]!;
        if (croppingBox.isValid()){
            this.api.updateTracker(uuid, {
                "camera": {
                    "roi_x": croppingBox.x,
                    "roi_y": croppingBox.y,
                    "roi_w": croppingBox.w,
                    "roi_h": croppingBox.h
                }
            });
        } else {
            Logger.log('warn', "Invalid crop box detected. resetting crop");
            this.api.updateTracker(uuid, {
                "camera": {
                    "roi_x": null,
                    "roi_y": null,
                    "roi_w": null,
                    "roi_h": null
                }
            });
        }
    }
}