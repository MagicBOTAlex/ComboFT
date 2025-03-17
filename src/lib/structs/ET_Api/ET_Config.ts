import type { ET_OSCSettings } from "./ET_OSCSettings";
import type { ET_Tracker } from "./ET_Tracker";

export interface ET_Config {
    version: number;
    debug: boolean;
    affinity_mask: string;
    osc: ET_OSCSettings;
    trackers: ET_Tracker[];
}
