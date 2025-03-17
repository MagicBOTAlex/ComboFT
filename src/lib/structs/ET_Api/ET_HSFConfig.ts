// Configuration for the HSF algorithm

export interface ET_HSFConfig {
  skip_autoradius: boolean; // Default: false
  skip_blink_detection: boolean; // Default: false
  blink_stat_frames: number; // Default: 180
  default_step: [number, number]; // Default: [5,5]
}
