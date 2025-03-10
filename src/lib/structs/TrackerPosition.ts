export enum TrackerPosition {
    Left = "Left",
    Right = "Right",
    Babble = "Babble"
}

export function stringToTrackerPosition(value: string): TrackerPosition | null {
    if (Object.values(TrackerPosition).includes(value as TrackerPosition)) {
        return value as TrackerPosition;
    }
    return null; // Return null if the value doesn't match any enum member
}