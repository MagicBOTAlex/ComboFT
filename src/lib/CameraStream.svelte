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

    let videoStreamSource: string = "";
    let timestamp: number = 0;
    let imageElement: HTMLImageElement;


    const interval = setInterval(reloadStream, 3000);

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
    });

    function reloadStream(){
        timestamp = new Date().getTime();
    }

    onMount(async ()=> {
        ETVRController.pushCameraAddr(camera!);
        videoStreamSource = await ETVRController.getTrackingCameraStream(camera.position, CameraStreamType.Raw)
    });

    // This is sooo ass, but this is only going to be used during front-end
</script>

<img bind:this={imageElement} src="{videoStreamSource + "?t=" + timestamp}" class="object-contain" style="transform: rotate({cameraRotation}deg);" alt="cam stream">