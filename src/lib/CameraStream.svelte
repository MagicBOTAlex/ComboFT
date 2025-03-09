<script lang="ts">
    import { CameraConnectionType } from "./CameraConnectionType";
    import { TrackerPosition } from "./structs/TrackerPosition";
    import { get } from "svelte/store";
    import { Cameras, ETVRController } from "@src/store";
    import { onMount } from "svelte";
    import { CameraStreamType } from "./structs/CameraStreamType";
    import type { Camera } from "./structs/Camera";

    export let camera: Camera;
    export let cameraRotation: number = 0;

    let videoStreamSource: string = "";

    onMount(async ()=> {
        ETVRController.pushCameraAddr(camera!);
        videoStreamSource = await ETVRController.getTrackingCameraStream(camera.position, CameraStreamType.Raw)
    });

    // This is sooo ass, but this is only going to be used during front-end
</script>

<img src="{videoStreamSource}" class="object-contain" style="transform: rotate({cameraRotation}deg);" alt="cam stream">