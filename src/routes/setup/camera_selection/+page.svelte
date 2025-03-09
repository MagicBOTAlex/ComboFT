<script lang="ts">
    import {fly, scale, slide} from "svelte/transition";
    import CameraSelection from "./comps/CameraSourceSelection.svelte";
    import Tabs from "../comps/tabs.svelte";
    import { TrackerPosition as TrackerPosition } from "../../../lib/structs/TrackerPosition";
    import { goto } from '$app/navigation';
    import { Cameras, ETVRController } from "@src/store";
    import { get } from "svelte/store";
    import { CameraStreamType } from "@src/lib/structs/CameraStreamType";
    import { Camera } from "lucide-svelte";
    import { onMount } from "svelte";

    async function onFinishClick(){
        const camera = get(Cameras)[TrackerPosition.Left];
        ETVRController.pushCameraAddr(camera!);
        // console.log( await ETVRController.getTrackingCameraStream(TrackerPosition.Left, CameraStreamType.Raw));
        ETVRController.start();

        goto('/setup/testing_con');
    }

    onMount(async () =>{
        
    });

    let enableBabble: boolean = false;
</script>

<Tabs enabled={["tab-active", "tab-disabled", "tab-disabled"]}/>
<div class="w-full h-full flex flex-col justify-center">
    <div class="flex justify-center">
        <div class="w-full px-56">
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
                <button on:click={onFinishClick} class="btn btn-primary w-full">Next</button>
            </div>
        </div>
    </div>
</div>