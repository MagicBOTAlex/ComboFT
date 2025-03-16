<script>
    import { Cameras } from "@src/store";
    import { get } from "svelte/store";
    import { ZoomIn } from "lucide-svelte";
    import EtvrControls from "./ETVRControls.svelte";
    import { CameraStreamType } from "@src/lib/structs/CameraStreamType";
    import DetailedCameraConnection from "@src/lib/CameraSvelteComponents/DetailedCameraConnection.svelte";
</script>

<div class="flex flex-col h-full w-full">
    <div class="overflow-x-auto px-4">
        <div class="min-w-max mx-auto">
            <div class="grid grid-flow-col auto-cols-min gap-4 p-4 justify-center">
            {#each Object.values(get(Cameras)) as camera}
            {#if camera.isEnabled}
            <DetailedCameraConnection {camera}></DetailedCameraConnection>
            {/if}
            {/each}
            </div>
        </div>
    </div>
    <div class="w-full min-h-64 border-t-4 border-base-300">
        <EtvrControls/>
    </div>
</div>
