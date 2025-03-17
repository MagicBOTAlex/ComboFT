export interface ET_OSCSettings {
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
