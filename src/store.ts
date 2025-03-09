import { writable, type Writable } from 'svelte/store';
import { ETVR_Controller } from './lib/ETVR_Controller';
import { TrackingCamera } from './lib/structs/TrackingCamera';
import type { Camera } from './lib/structs/Camera';

export const Cameras = writable<Record<TrackingCamera, Partial<Camera>>>({
    [TrackingCamera.Left]: {},
    [TrackingCamera.Right]: {},
    [TrackingCamera.Babble]: {},
});


const ETVRCon = new ETVR_Controller("http://127.0.0.1:8000");
export const ETVRController = ETVRCon.store