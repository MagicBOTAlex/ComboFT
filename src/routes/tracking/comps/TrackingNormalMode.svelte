<script>
    import { Cameras } from "@src/store";
    import CameraConnection from "@src/lib/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraConnectionType";
    import { get } from "svelte/store";
    import { ZoomIn } from "lucide-svelte";
    import EtvrControls from "./ETVRControls.svelte";
    import { CameraStreamType } from "@src/lib/structs/CameraStreamType";
</script>

<div class="flex flex-col h-full w-full">
    <div class="overflow-x-auto px-4">
        <div class="min-w-max mx-auto">
            <div class="grid grid-flow-col auto-cols-min gap-4 p-4 justify-center">
            {#each Object.values(get(Cameras)) as camera}
            {#if camera.isEnabled}
            <CameraConnection streamType={CameraStreamType.Algorithmed} camera={camera}>
                <div class="p-4">
                    
                    <div class="flex justify-between place-items-center">
                        <div class="border-l border-primary pl-2 border-dashed">
                            <div class="text-sm font-bold">{camera.position} camera</div>
                            <div class="text-xs">Source type: {camera.sourceType}</div>
                        </div>
                        <button class="btn btn-ghost btn-sm p-1"><ZoomIn/></button>
                    </div>
                </div>
            </CameraConnection>
            {/if}
            {/each}
            </div>
        </div>
    </div>
    <div class="w-full min-h-64 border-t-4 border-base-300">
        <EtvrControls/>
    </div>
</div>
