interface OSCSettings {
    address: string;
    mirror_eyes: boolean;
    sync_blink: boolean;
    enable_sending: boolean;
    sending_port: number;
    enable_receiving: boolean;
    receiver_port: number;
    vrchat_native_tracking: boolean;
    endpoints: {
        eyes_y: string;
        left_eye_x: string;
        right_eye_x: string;
        recenter: string;
        sync_blink: string;
        recalibrate: string;
        left_eye_blink: string;
        right_eye_blink: string;
    };
}

interface AlgorithmSettings {
    algorithm_order: string[];
    blob: {
        threshold: number;
        minsize: number;
        maxsize: number;
    };
    leap: {
        blink_threshold: number;
    };
    hsf: {
        skip_autoradius: boolean;
        skip_blink_detection: boolean;
        blink_stat_frames: number;
        default_step: [number, number];
    };
}

interface CameraSettings {
    capture_source: string;
    rotation: number;
    threshold: number;
    focal_length: number;
    flip_x_axis: boolean;
    flip_y_axis: boolean;
    roi_x: number;
    roi_y: number;
    roi_w: number;
    roi_h: number;
}

export interface Tracker {
    enabled: boolean;
    name: string;
    uuid: string;
    tracker_position: string;
    algorithm: AlgorithmSettings;
    camera: CameraSettings;
}

export interface ETVRConfig {
    version: number;
    debug: boolean;
    affinity_mask: string;
    osc: OSCSettings;
    trackers: Tracker[];
}
