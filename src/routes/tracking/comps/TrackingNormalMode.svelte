<script>
    import { Cameras } from "@src/store";
    import CameraConnection from "@src/lib/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraConnectionType";
    import { get } from "svelte/store";
    import { ZoomIn } from "lucide-svelte";
    import EtvrControls from "./ETVRControls.svelte";
</script>

<div class="flex flex-col h-full w-full justify-center place-items-center gap-4">
    <div class="flex justify-center w-full gap-4 mt-auto">
        {#each Object.values(get(Cameras)) as camera}
        {#if camera.isEnabled}
        <CameraConnection camera={camera}>
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
    
    <div class="mt-auto w-full h-64 border-t-4 border-base-300">
        <EtvrControls/>
    </div>
</div>