import { writable, type Writable } from 'svelte/store';
import { ETVR_Controller } from './lib/ETVR_Controller';
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


export const ETVRController = new ETVR_Controller("http://127.0.0.1:8000");