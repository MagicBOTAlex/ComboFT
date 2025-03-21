import { PB_API } from "./PB_API";
import { exists, readTextFile, writeTextFile, BaseDirectory, readDir  } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentDir, updateJsonProp } from "./RustInvoker";
import * as path from '@tauri-apps/api/path';


export class PB_Controller {
    private backendUrl: string;
    private PB_Api: PB_API;
    
    constructor(url: string) {
        this.backendUrl = url;
        this.PB_Api = new PB_API(url);

        this.initConfig();
    }

    async test(){
        await updateJsonProp(await this.getConfigPath(), {"version": 3});
    }

    async initConfig(){
        let result = await exists(await this.getConfigPath());
        if (!result){
            this.loadDefaultConfig();
        }
    }

    async getConfigPath(): Promise<string> {
        return await path.join(await getCurrentDir(), '../PB-Backend/BabbleApp/babble_settings.json');
    }

    async getDefaultConfigPath(): Promise<string> {
        return await path.join(await getCurrentDir(), '../PB-Backend/BabbleApp/default.json');
    }

    async loadDefaultConfig(){
        let defaultConfigJson = await readTextFile(await this.getDefaultConfigPath());
        await writeTextFile(await this.getConfigPath(), defaultConfigJson);
    }

    // Pass from api
    async getRawCameraFeed() {await this.PB_Api.getRawCameraFeed()};
    async getCroppedCameraFeed() {await this.PB_Api.getCroppedCameraFeed()};
    async getProcessedCameraFeed() {await this.PB_Api.getProcessedCameraFeed()}; 
    async startCalibration(caliSamples?: number) {await this.PB_Api.startCalibration(caliSamples)};
    async getCalibrationStatus() {await this.PB_Api.getCalibrationStatus()};
    async setCalibrationUsage(targetState: number) {await this.PB_Api.setCalibrationUsage(targetState)};

    
}