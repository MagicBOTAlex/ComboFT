<script lang="ts">
    import { page } from '$app/state';
    import CameraStream from '@src/lib/CameraStream.svelte';
    import type { Camera } from '@src/lib/structs/Camera';
    import { stringToTrackerPosition, TrackerPosition } from '@src/lib/structs/TrackerPosition';
    import { Cameras, ETVRController } from '@src/store';
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
    let videoStreamSource: string = "";

    onMount(async ()=>{
        croppingCam = get(Cameras)[cam as TrackerPosition];

        ETVRController.pushCameraAddr(croppingCam);
        videoStreamSource = await ETVRController.getTrackingCameraStream(croppingCam.position, CameraStreamType.Raw)
    });

    function onFinishCropping(finalBox: Box) {
        ETVRController.pushCrop(cam as TrackerPosition, finalBox);
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
        <div class="p-4 bg-base-200 rounded-lg">
            <div class="w-80 h-80">
                <Cropper {onFinishCropping} imageSrc={videoStreamSource + "?t=" + timestamp}/>
            </div>
        </div>
        <div class="mt-10">
            <a href="{sender}" class="btn btn-primary {cropSet?"": "btn-disabled"} w-full">Done</a>
        </div>
    </div>
</div>