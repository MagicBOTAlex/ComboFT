<script lang="ts">
    import { CameraConnectionType } from "./CameraConnectionType";
    import { TrackerPosition } from "./structs/TrackerPosition";
    import { get } from "svelte/store";
    import { Cameras, ETVRController } from "@src/store";
    import { onMount, onDestroy } from "svelte";
    import { CameraStreamType } from "./structs/CameraStreamType";
    import type { Camera } from "./structs/Camera";

    export let camera: Camera;
    export let cameraRotation: number = 0;
    export let streamType: CameraStreamType = CameraStreamType.Raw;

    let videoStreamSource: string = "";
    let timestamp: number = 0;
    let imageElement: HTMLImageElement;
    let loading: boolean = true;


    const interval = setInterval(reloadStream, 500); // Probs a better way like using js to get blobs. but works for now
    function reloadStream(){
        console.log(imageElement.naturalHeight);
        if (imageElement.naturalHeight < 100){
            // Not loaded
            timestamp = new Date().getTime();
            // loading = true;
        } else {
            // Image loaded
            loading = false;
        }
    }

    onMount(async ()=> {
        ETVRController.pushCameraAddr(camera);
        videoStreamSource = await ETVRController.getTrackingCameraStream(camera.position, streamType)
    });

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
        imageElement.src = "";
    });
</script>

<div class="grid place-content-center w-full h-full {loading?"":""}">
    <img bind:this={imageElement} src="{videoStreamSource + "?t=" + timestamp}" class="w-full h-full object-contain {loading?"loading loading-spinner w-3 h-3":""}" style="transform: rotate({cameraRotation}deg);" alt="cam stream">
</div>