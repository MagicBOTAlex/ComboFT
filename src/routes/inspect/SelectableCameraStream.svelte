<script lang="ts">
    import CameraStream from "@src/lib/CameraSvelteComponents/CameraStream.svelte";
    import type { Camera } from "@src/lib/structs/Camera";
    import { CameraStreamType } from "@src/lib/structs/CameraStreamType";
    import { Cameras } from "@src/store";
    import { onMount } from "svelte";

    export let camera: Camera | undefined = undefined;
    export let selectedStreamType: CameraStreamType = CameraStreamType.Cropped;

    let forceReload = false;
    function setStreamType(streamType: CameraStreamType) {
        selectedStreamType = streamType;
        // Store the chosen stream type in localStorage
        localStorage.setItem('LastInpectStreamType', streamType);

        // Small trick to force the CameraStream component to reload
        forceReload = true;
        setTimeout(() => {
            forceReload = false;
        }, 10);
    }

    onMount(async ()=>{
        // Restore the stream type if stored
        const storedStreamType = localStorage.getItem('LastInpectStreamType') as CameraStreamType;
        if (storedStreamType && Object.values(CameraStreamType).includes(storedStreamType)) {
            selectedStreamType = storedStreamType;
        }
    });
</script>

<div class="h-full border-l-2 border-base-200">
    <div class="tabs tabs-border">
        {#each Object.keys(CameraStreamType) as streamType}
        <button class="tab {selectedStreamType == streamType ? "tab-active":""}" on:click={()=>{setStreamType(streamType as CameraStreamType)}}>{streamType}</button>
        {/each}
    </div>
    <div class="w-full h-full bg-grid flex justify-center place-content-center">
        <div class="object-contain">
            {#if !forceReload}
            <CameraStream bind:camera={camera} bind:streamType={selectedStreamType}/>
            {/if}
        </div>
    </div>
</div>

<style>
    .bg-grid {
        background:
            linear-gradient(-90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            #f2f2f2;
        background-size:
            4px 4px,
            4px 4px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px,
            80px 80px;
        background-color: var(--color-base-100);
    }
</style>