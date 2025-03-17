import type { ET_AlgorithmConfig } from "./ET_AlgorithmConfig";
import type { ET_CalibrationData } from "./ET_CalibrationData";
import type { ET_CameraSettings } from "./ET_CameraSettings";


export interface ET_Tracker {
    enabled: boolean;
    name: string;
    uuid: string;
    tracker_position: string;
    algorithm: ET_AlgorithmConfig;
    camera: ET_CameraSettings;
    calibrationData: ET_CalibrationData;
}
