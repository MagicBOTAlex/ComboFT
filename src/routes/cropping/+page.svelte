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
    import type { ROIBox } from '@src/lib/structs/Box';
    import { goto } from '$app/navigation';

    $: params = new URLSearchParams(page.url.search);
    $: cam = params.get('cam'); // Raw URL param (string)
    $: sender = params.get('sender');

    let cropSet: boolean = false;
    let croppingCam: Camera | undefined;
    let finalBox: ROIBox | undefined;

    onMount(async ()=>{
        croppingCam = get(Cameras)[cam as TrackerPosition];
        if (croppingCam.position != TrackerPosition.Babble){
            BackController.resetRotation(croppingCam);
        }
    });

    function onFinishCropping(box: ROIBox) {
        finalBox = box;
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

    async function onConfirm(){
        goto(sender + "?cam=" + croppingCam?.position);
        if (finalBox)
            await BackController.pushCrop(cam as TrackerPosition, finalBox);
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
                <Cropper {onFinishCropping} cam={croppingCam!}/>
            </div>
        </div>
        <div class="mt-10">
            <button on:click={onConfirm} class="btn btn-primary {cropSet?"": "btn-disabled"} w-full">Done</button>
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