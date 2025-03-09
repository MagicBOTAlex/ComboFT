import { writable, type Writable } from 'svelte/store';
import { ETVR_Controller } from './lib/ETVR_Controller';
import { TrackerPosition } from './lib/structs/TrackerPosition';
import { Camera } from './lib/structs/Camera';

export const Cameras = writable<Record<TrackerPosition, Camera>>({
    [TrackerPosition.Left]: new Camera(TrackerPosition.Left),
    [TrackerPosition.Right]: new Camera(TrackerPosition.Right),
    [TrackerPosition.Babble]: new Camera(TrackerPosition.Babble),
});


export const ETVRController = new ETVR_Controller("http://127.0.0.1:8000");