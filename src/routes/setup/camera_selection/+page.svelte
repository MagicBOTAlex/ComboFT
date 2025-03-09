<script lang="ts">
    import {fly, scale, slide} from "svelte/transition";
    import CameraSelection from "./comps/CameraSourceSelection.svelte";
    import Tabs from "../comps/tabs.svelte";
    import { TrackingCamera } from "../../../lib/structs/TrackingCamera";

    

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
                <CameraSelection position={TrackingCamera.Left}/>
                <div class="divider divider-horizontal px-0 m-2"></div>
                <CameraSelection position={TrackingCamera.Right}/>
                {#if enableBabble}
                <div class="divider divider-horizontal px-0 m-2"></div>
                <CameraSelection position={TrackingCamera.Babble}/>
                {/if}
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden" >
                <a href="/setup/testing_con" class="btn btn-primary w-full">Next</a>
            </div>
        </div>
    </div>
</div>