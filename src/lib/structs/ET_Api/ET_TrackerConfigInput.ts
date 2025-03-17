import type { ET_CalibrationData } from "./ET_CalibrationData";

// These names are stupid...
export interface ET_TrackerConfigInput {
  enabled?: boolean;
  name?: string;
  uuid?: string;
  tracker_position?: any;
  algorithm?: any;
  camera?: any;
  calibrationData?: ET_CalibrationData;
}
