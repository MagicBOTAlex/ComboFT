import { ETVRApi} from "./ETVR_API";
import { Logger } from "./Logger";
import { CameraStreamType } from "./structs/CameraStreamType";
import { ETVRStatus } from "./structs/ETVRBackendStatus";
import type { ETVRConfig, Tracker as TrackerConfig } from "./structs/ETVRConfig";
import type { TrackingCamera } from "./structs/TrackingCamera";
import { writable, type Writable} from 'svelte/store';

export class ETVR_Controller {
    status: ETVRStatus = ETVRStatus.Stopped;
    api: ETVRApi; // Oh shit, TS supports this? I love it!!!
    config: ETVRConfig |undefined;
    UUIDs: Partial<Record<TrackingCamera, string | undefined>> = {};
    store: Writable<ETVR_Controller> | any;

    constructor(url: string) {
        this.api = new ETVRApi(url);
        this.api.loadConfig(); // Load old config by default
        this.getConfig(true);
        this.store = writable(this);
        


        setInterval(this.loop.bind(this), 250); // Update status every 0.25s
    }

    async start(){this.api.startETVR();}    
    async Stop(){this.api.stopETVR();}
    async Reset(){this.api.restartETVR();}
    async quit(){this.api.shutdownETVR(); this.status = ETVRStatus.Quit;}

    async getConfig(forceUpdate: boolean = false) {
        if (!this.config || forceUpdate) {
            this.config = await this.api.getConfig();
        }
        return this.config;
    }

    // Runs to check current status
    public async loop(){ // No way!!! pulic too. This is just like C#
        let newStatus: boolean = await this.api.getETVRStatus();
        if (((newStatus) ? ETVRStatus.Running : ETVRStatus.Stopped) != this.status){
            Logger.log('info', (newStatus) ? "ETVR now running..." : "ETVR stopped.")
        }
        this.status = (newStatus) ? ETVRStatus.Running : ETVRStatus.Stopped;
    }

    // Here comes the powerful stuff by making this class:
    // Returns the Stream URL
    public async getTrackingCameraStream(trackingCam: TrackingCamera, streamType: CameraStreamType): Promise<string> {
        if (this.UUIDs[trackingCam]){
            return this.UUIDs[trackingCam];
        }

        let trackerConf = await this.getTrackingCameraConfig(trackingCam);
        if (!trackerConf) return "";

        this.UUIDs[trackingCam] = trackerConf.uuid;
        return `${this.api.baseURL}/etvr/feed/${this.UUIDs[trackingCam]}/${streamType}`;
    }

    public async getTrackingCameraConfig(trackingCam: TrackingCamera): Promise<TrackerConfig | undefined>{
        if (!this.config) await this.getConfig();
        if (!this.config) return undefined;
        const trackers: TrackerConfig[]  = this.config.trackers;

        for (let I = 0; I < trackers.length; I++) {
            const tracker = trackers[I];
            if (tracker.name == trackingCam)
                return tracker
        }

        return undefined;
    }

    async pushConfig(){
        if (!this.config) await this.getConfig();
        if (!this.config) return;
        this.api.updateConfig(this.config);
        this.api.saveConfig();
    }

    public async setTrackerCameraSource(trackingCam: TrackingCamera, addr: string){
        if (!this.UUIDs[trackingCam]) await this.getTrackingCameraStream(trackingCam, CameraStreamType.Raw); // Gonna reuse this, but is slightly inefficient, TS gets mad
        if (!this.UUIDs[trackingCam]) return;
        this.api.updateTracker(this.UUIDs[trackingCam], 
            {"camera": {
                "capture_source": addr
            }
        });
    }
}