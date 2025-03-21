import { writable, type Writable } from 'svelte/store';
import { BackendController } from './lib/BackendController';
import { PB_Controller } from './lib/PB_Controller';
import { TrackerPosition } from './lib/structs/TrackerPosition';
import { Camera } from './lib/structs/Camera';

// Function to load Cameras store from localStorage
export function loadCamerasFromLocalStorage(): Record<TrackerPosition, Camera> | null {
  if (typeof localStorage !== "undefined") {
    const storedData = localStorage.getItem("Cameras");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        // Ensure the object includes all required TrackerPosition keys
        const cameras: Record<TrackerPosition, Camera> = {
          [TrackerPosition.Left]: parsedData[TrackerPosition.Left] ?? TrackerPosition.Left,
          [TrackerPosition.Right]: parsedData[TrackerPosition.Right] ?? TrackerPosition.Right,
          [TrackerPosition.Babble]: parsedData[TrackerPosition.Babble] ?? TrackerPosition.Babble,
        };

        return cameras;
      } catch (error) {
        console.error("Error parsing Cameras from localStorage:", error);
      }
    }
  }
  return null;
}

// Function to save Cameras store to localStorage
export function saveCamerasToLocalStorage(cameras: Record<TrackerPosition, Camera>) {
  try {
    localStorage.setItem("Cameras", JSON.stringify(cameras));
  } catch (error) {
    console.error("Error saving Cameras to localStorage:", error);
  }
}

// Initialize store with saved data or default values
export const Cameras = writable<Record<TrackerPosition, Camera>>(
  loadCamerasFromLocalStorage() || {
    [TrackerPosition.Left]: new Camera(TrackerPosition.Left),
    [TrackerPosition.Right]: new Camera(TrackerPosition.Right),
    [TrackerPosition.Babble]: new Camera(TrackerPosition.Babble),
  }
);

// Automatically save whenever Cameras store changes
Cameras.subscribe(value => {
  saveCamerasToLocalStorage(value);
});



declare global {
  interface Document {
    BackendController?: BackendController;
    BabbleControler?: PB_Controller;
  }
}

export const BackController = new BackendController("http://127.0.0.1:8000");
window.document.BackendController = BackController;

export const BabbleControler = new PB_Controller("http://127.0.0.1:4422");
window.document.BabbleControler = BabbleControler;