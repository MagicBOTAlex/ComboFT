<script lang="ts">
    import {fly, scale, slide} from "svelte/transition";
    import CameraSelection from "./comps/CameraSourceSelection.svelte";
    import Tabs from "../comps/tabs.svelte";
    import { TrackerPosition as TrackerPosition } from "../../../lib/structs/TrackerPosition";
    import { goto } from '$app/navigation';
    import { Cameras, BackController } from "@src/store";
    import { get } from "svelte/store";
    import { CameraStreamType } from "@src/lib/structs/CameraStreamType";
    import { Camera } from "lucide-svelte";
    import { onDestroy, onMount } from "svelte";
    import { invoke } from "@tauri-apps/api/core";
    import { BackendStatus } from "@src/lib/structs/BackendStatus";
    import EtvrControls from "@src/routes/tracking/comps/ETVRControls.svelte";
    import { BackendController } from "@src/lib/BackendController";

    let isLoading = false;

    async function onFinishClick(){
        const cameras_ = get(Cameras);
        Object.values(cameras_).map(async x=>{
            if (x.isEnabled)
                await BackController.pushCameraAddr(x!);
        });

        // Timeout to actually push config
        isLoading = true;
        setTimeout(() => {
            BackController.start();
            isLoading = false;
            goto('/setup/testing_con');
        }, 3000);
        // console.log( await ETVRController.getTrackingCameraStream(TrackerPosition.Left, CameraStreamType.Raw));
    }

    const forceReloadInterval = setInterval(forceReload, 3000);
    let isRunning: boolean = false; // Used to force reload this page

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(forceReloadInterval);
    });

    function forceReload(){
        isRunning = BackController.ET_Status == BackendStatus.Running;
        if (isRunning){
            BackController.Stop(); // I REALLY WANT IT TO STOP!!!
        }
    }


    onMount(async () =>{
        await BackController.checkStatus();
        forceReload();
        BackController.Stop();
    });

    let enableBabble: boolean = true;
</script>

<Tabs enabled={["tab-active", "tab-disabled", "tab-disabled"]}/>
<div class="w-full h-full flex flex-col justify-center">
    <div class="flex justify-center">
        <div class="flex flex-col w-full px-32">
            <div class="px-4">
                <div class="font-bold text-2xl">Camera source</div>
                <div class="flex justify-between">
                    <div>Please select type of camera source</div>
                    <input type="checkbox" class="checkbox checkbox-sm" bind:checked={enableBabble}>
                </div>
            </div>
            <div class="divider"></div>
            <div class="flex justify-evenly">
                <CameraSelection position={TrackerPosition.Left}/>
                <div class="divider divider-horizontal px-0 m-2"></div>
                <CameraSelection position={TrackerPosition.Right}/>
                {#if enableBabble}
                <div class="divider divider-horizontal px-0 m-2"></div>
                <CameraSelection position={TrackerPosition.Babble}/>
                {/if}
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden" >
                <button on:click={onFinishClick} class="btn btn-primary w-full {isRunning || isLoading ? "btn-disabled":""}">
                    {#if isRunning || isLoading}
                        <div class="flex">
                            {#if isRunning}
                            Waiting for ETVR to shutdown...
                            {:else if isLoading}
                            Waiting for backend startup...
                            {/if} 
                            <span class="loading loading-spinner loading-md ml-2"></span></div>
                    {:else}
                    Next
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>