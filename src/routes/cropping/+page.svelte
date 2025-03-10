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

    let croppingCam: Camera | undefined;
    let videoStreamSource: string = "";

    onMount(async ()=>{
        croppingCam = get(Cameras)[cam as TrackerPosition];

        ETVRController.pushCameraAddr(croppingCam);
        videoStreamSource = await ETVRController.getTrackingCameraStream(croppingCam.position, CameraStreamType.Raw)
    });

    function onFinishCropping(finalBox: Box) {
        ETVRController.pushCrop(cam as TrackerPosition, finalBox);
    }
</script>

<Cropper {onFinishCropping} imageSrc={videoStreamSource}/>