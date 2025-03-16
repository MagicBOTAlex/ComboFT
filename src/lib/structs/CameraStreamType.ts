export enum CameraStreamType {
    Raw = "Raw",
    Cropped = "Cropped",
    Algorithmed = "Algorithmed"
}

export function getStreamTypeAPIName(streamType: CameraStreamType): string{
    switch (streamType) {
        case CameraStreamType.Raw:
            return "camera";
        case CameraStreamType.Cropped:
        case CameraStreamType.Algorithmed:
            return "algorithm";
        default:
            console.warn("Stream type not supported: " + streamType);
            return "";
    }
}