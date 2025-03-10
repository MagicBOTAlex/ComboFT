<script lang="ts">
    import { CameraConnectionType } from "./CameraConnectionType";
    import { TrackerPosition } from "./structs/TrackerPosition";
    import { get } from "svelte/store";
    import { Cameras, ETVRController } from "@src/store";
    import { onMount } from "svelte";
    import { CameraStreamType } from "./structs/CameraStreamType";
    import CameraStream from "./CameraStream.svelte";
    import type { Camera } from "./structs/Camera";

    export let camera: Camera;
    export let cameraRotation: number = 0;
    export let streamType: CameraStreamType = CameraStreamType.Raw;


    onMount(async ()=> {

    });

    // This is sooo ass, but this is only going to be used during front-end
</script>

<div class="">
    <div class="bg-base-200 rounded-t-lg object-fit w-48 h-48 overflow-hidden shadow-xl">
        <CameraStream {streamType} {camera} />
    </div>
    <div class="bg-base-200 rounded-b-lg">
        <slot></slot>
    </div>
</div>