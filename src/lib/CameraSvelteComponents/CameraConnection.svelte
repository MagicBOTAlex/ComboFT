<script lang="ts">
    import { CameraConnectionType } from "./CameraConnectionType";
    import { TrackerPosition } from "../structs/TrackerPosition";
    import { get } from "svelte/store";
    import { Cameras, BackController } from "@src/store";
    import { onMount, type Snippet } from "svelte";
    import { CameraStreamType } from "../structs/CameraStreamType";
    import CameraStream from "./CameraStream.svelte";
    import type { Camera } from "../structs/Camera";
    import { render } from "svelte/server";
    import { slide } from "svelte/transition";

    export let camera: Camera;
    export let cameraRotation: number = 0;
    export let streamType: CameraStreamType = CameraStreamType.Raw;
    export let drawerOpen: boolean = false;
    export let children: Snippet | undefined = undefined;
    export let drawer: Snippet | undefined = undefined;
    export let isDrawerOpen: boolean = false;

    onMount(async ()=> {

    });

    // This is sooo ass, but this is only going to be used during front-end
</script>

<div class="rounded-t-lg flex">
    <div>
        <div class="relative grid place-items-center w-full rounded-t-lg border-2 border-b-0 border-base-200">
            <div class="relative w-48 h-48 rounded-t-lg bg-grid">
            </div>
            <div class="absolute top-0 bottom-0 object-fit overflow-hidden shadow-xl">
                <CameraStream {streamType} {camera} />
            </div>
        </div>
        <div class="bg-base-200 rounded-b-lg">
            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
    {#if isDrawerOpen}
    <div transition:slide={{duration: 500, axis:"x"}} class="p-4 pl-7 -ml-4 border border-l-0 rounded-r-lg border-base-200">
        {#if drawer}
            {@render drawer()}
        {/if}
    </div>
    {/if}
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