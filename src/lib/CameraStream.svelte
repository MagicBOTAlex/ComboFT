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
    export let imageElement: HTMLImageElement | undefined = undefined;
    export let mousedown: ((e: MouseEvent) => void) | undefined = undefined;
    export let mousemove: ((e: MouseEvent) => void) | undefined = undefined;
    export let mouseup: ((e: MouseEvent) => void) | undefined = undefined;
    export let mouseleave: ((e: MouseEvent) => void) | undefined = undefined;

    let videoStreamSource: string = "";
    let timestamp: number = 0;
    let loading: boolean = true;


    const interval = setInterval(reloadStream, 500); // Probs a better way like using js to get blobs. but works for now
    function reloadStream(){
        // console.log(imageElement!.naturalHeight);
        if (imageElement!.naturalHeight <= 0){
            // Not loaded
            timestamp = new Date().getTime();
            loading = true;
        } else {
            // Image loaded
            loading = false;
        }
    }

    onMount(async ()=> {
        // ETVRController.pushCameraAddr(camera);
        videoStreamSource = await ETVRController.getTrackingCameraStream(camera.position, streamType)
        timestamp = new Date().getTime(); // Prevents loading anything cached
    });

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
        imageElement!.src = "";
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex justify-center place-items-center w-full h-full {loading?"":""}">
    <div class="{loading?"w-16 h-16 loading loading-spinner bg-base-300":"hidden"}"></div>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img bind:this={imageElement} src="{videoStreamSource + "?t=" + timestamp}" class="w-full h-full object-contain {loading?"hidden":""}" style="transform: rotate({cameraRotation}deg);" alt="cam stream"
    on:mousedown={(e)=>{if(mousedown){mousedown(e)}}}
    on:mousemove={(e)=>{if(mousemove){mousemove(e)}}}
    on:mouseup={(e)=>{if(mouseup){mouseup(e)}}}
    on:mouseleave={(e)=>{if(mouseleave){mouseleave(e)}}}
    on:loadeddata={()=>{
        loading = true; // If loaded, then it was cached. Which is not good
        timestamp = new Date().getTime();
    }}/>
</div>