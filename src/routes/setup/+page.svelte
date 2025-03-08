<script lang="ts">
    import {fly, slide} from "svelte/transition";
    import CameraSelection from "./comps/CameraSourceSelection.svelte";
</script>

<div role="tablist" class="tabs tabs-border h-0">
    <a role="tab" class="tab tab-active">Camera Sources</a>
    <a role="tab" class="tab">Testing connectivity</a>
    <a role="tab" class="tab">Cropping</a>
</div>
<div class="w-full h-full flex flex-col justify-center">
    <div class="flex justify-center">
        <div class="w-full px-56">
            <div class="px-4">
                <div class="font-bold text-2xl">Camera source</div>
                <div>Please select type of camera source</div>
            </div>
            <div class="divider"></div>
            <div class="flex justify-evenly">
                <CameraSelection eye="Left"/>
                <div class="divider divider-horizontal px-0 m-2"></div>
                <CameraSelection eye="Right"/>
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden" transition:slide={{ duration: 500 }}>
                <button class="btn btn-primary w-full">Next</button>
            </div>
        </div>
    </div>
</div>