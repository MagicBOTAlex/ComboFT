import { writable, type Writable } from 'svelte/store';
import { ETVR_Controller } from './lib/ETVR_Controller';

const ETVRCon = new ETVR_Controller("http://127.0.0.1:8000");
export const ETVRController = ETVRCon.store