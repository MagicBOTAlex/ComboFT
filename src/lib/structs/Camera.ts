import { CameraSourceType } from "./CameraSourceType";
import type { TrackerPosition } from "./TrackerPosition";

export class Camera {
    isEnabled: boolean = false;
    streamUrl: string | undefined = undefined;
    UUID: string | undefined = undefined;

    addr: string = "";
    sourceType: CameraSourceType = CameraSourceType.None; 

    public constructor(public position: TrackerPosition){
        
    }
}