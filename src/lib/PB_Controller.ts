import { PB_API } from "./PB_API";
import { exists, readTextFile, writeTextFile, BaseDirectory, readDir  } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentDir, updateJsonProp } from "./RustInvoker";
import * as path from '@tauri-apps/api/path';
import { Child, Command } from '@tauri-apps/plugin-shell';
import { BackendStatus } from "./structs/BackendStatus";


export class PB_Controller {
    private backendUrl: string;
    private PB_Api: PB_API;

    private backendCommand: Command<string>;
    private backendSidecar: Child |undefined = undefined;
    
    constructor(PB_Api: PB_API) {
        this.PB_Api = PB_Api;
        this.backendUrl = PB_Api.baseUrl;
        this.backendCommand = Command.sidecar('../PB-Backend/dist/PB-Backend'); 
        this.backendCommand.on('error', error => console.error(`command error: "${error}"`));
        this.backendCommand.stdout.on('data', line => console.log(`command stdout: "${line}"`));
        this.backendCommand.stderr.on('data', line => console.log(`command stderr: "${line}"`));


        this.initConfig();
    }

    async test(){
        await updateJsonProp(await this.getConfigPath(), {"version": 3});
    }

    async start(){
        this.backendSidecar = await this.backendCommand.spawn();
    }

    async stop(){
        for (let I = 0; I < 3; I++) {
            await this.PB_Api.shutdown();
        }
    }

    async initConfig(){
        let result = await exists(await this.getConfigPath());
        if (!result){
            this.loadDefaultConfig();
        }
    }

    async getStatus(): Promise<BackendStatus>{
        let response = await this.PB_Api.getCalibrationStatus();
        if (response === "404")
            return BackendStatus.Stopped
        else
            return BackendStatus.Running
    }

    async updateConfig(json: Record<string, any>){
        await updateJsonProp(await this.getConfigPath(), json);
        await this.PB_Api.notifyBackendConfigChange();
    }

    async getConfigPath(): Promise<string> {
        return await path.join(await getCurrentDir(), 'babble_settings.json');
    }

    async getDefaultConfigPath(): Promise<string> {
        return await path.join(await getCurrentDir(), '../PB-Backend/BabbleApp/default.json'); // TODO: This only works durent dev enviorment
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