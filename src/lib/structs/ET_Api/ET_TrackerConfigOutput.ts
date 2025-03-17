import type { ET_AlgorithmConfig } from "./ET_AlgorithmConfig";

export interface ET_TrackerConfigOutput {
  enabled: boolean;
  name: string;
  uuid: string;
  tracker_position: any;
  algorithm: ET_AlgorithmConfig;
  camera: any;
}
