
export interface ET_CameraSettings {
    capture_source: string;
    rotation: number | null;
    threshold: number;
    focal_length: number;
    flip_x_axis: boolean;
    flip_y_axis: boolean;
    roi_x: number | null;
    roi_y: number | null;
    roi_w: number | null;
    roi_h: number | null;
}
