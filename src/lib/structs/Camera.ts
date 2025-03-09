import type { CameraSourceType } from "./CameraSourceType";
import type { TrackingCamera } from "./TrackingCamera";

export interface Camera {
    cameraPosition: TrackingCamera;
    isEnabled: boolean;
    streamUrl: string | undefined;
    UUID: string | undefined;

    addr: string;
    sourceType: CameraSourceType; 
}