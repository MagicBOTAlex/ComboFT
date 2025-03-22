<script lang="ts">
    import { page } from '$app/state';
    import CameraStream from '@src/lib/CameraSvelteComponents/CameraStream.svelte';
    import { Camera } from '@src/lib/structs/Camera';
    import { stringToTrackerPosition, TrackerPosition } from '@src/lib/structs/TrackerPosition';
    import { Cameras, BackController } from '@src/store';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { CameraStreamType } from '@src/lib/structs/CameraStreamType';
    import { onDestroy } from 'svelte';
    import Cropper from './Cropper.svelte';
    import type { Box } from '@src/lib/structs/Box';

    $: params = new URLSearchParams(page.url.search);
    $: cam = params.get('cam'); // Raw URL param (string)
    $: sender = params.get('sender');

    let cropSet: boolean = false;

    let croppingCam: Camera | undefined;

    onMount(async ()=>{
        croppingCam = get(Cameras)[cam as TrackerPosition];
    });

    function onFinishCropping(finalBox: Box) {
        BackController.pushCrop(cam as TrackerPosition, finalBox);
        cropSet = true;
    }

    const interval = setInterval(reloadStream, 3000);
    let timestamp: number = 0; // Forces stream update

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
    });

    function reloadStream(){
        timestamp = new Date().getTime();
    }
</script>

<div class="grid h-full place-content-center">
    <div>
        <div>
            <div class="text-2xl font-bold">Cropping <span class="text-secondary">{cam} Camera</span></div>
            <div>Click and drag to select cropping area.</div>
        </div>
        <div class="divider -mx-20"></div>
        <div class="p-4 border border-base-200 bg-grid rounded-lg">
            <div class="w-full h-full">
                {#if croppingCam ||true}
                    <Cropper {onFinishCropping} camera={croppingCam}/>
                {/if}
            </div>
        </div>
        <div class="mt-10">
            <a href="{sender}?cam={croppingCam?.position}" class="btn btn-primary {cropSet?"": "btn-disabled"} w-full">Done</a>
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