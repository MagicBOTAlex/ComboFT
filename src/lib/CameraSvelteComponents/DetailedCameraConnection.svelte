<script lang="ts">
    import { ChevronLeftIcon, EllipsisVertical, LucideSettings, ZoomIn  } from "lucide-svelte";
    import type { Camera } from "../structs/Camera";
    import { CameraStreamType } from "../structs/CameraStreamType";
    import CameraConnection from "./CameraConnection.svelte";
    import { onMount, type Snippet } from "svelte";
    import type { ET_Algorithms } from "../structs/ET_Api/ET_Algorithms";
    import { BackController } from "@src/store";

    export let camera: Camera;

    export let isDrawerOpen: boolean = false;
    function toggleDrawer(){isDrawerOpen=!isDrawerOpen}

    const maxDisplayAlgos = 6;
    let algosCollapsed = true;

    let algos: ET_Algorithms[] | undefined= [];

    onMount(async ()=>{
        algos = await BackController.getCameraAlgorithems(camera);
    });
</script>

{#snippet detailsSnippet()}
    <div class="flex flex-col w-32 h-full">
        <div class="font-bold text-sm">Source type:</div>
        <div class="badge badge-soft badge-primary">{camera.sourceType.toUpperCase()}</div>

        <div class="font-bold text-sm pt-2">FPS:</div>
        <div>###</div>
        
        {#if algos}
        <div class="font-bold text-sm pt-2">Algorithem{algos.length > 1?"s":""}:</div>
        <div class="w-full h-full overflow-y-auto">
            <div class="flex flex-wrap h-16 gap-0.5">
                {#each algos as algo, i}
                {#if algosCollapsed}
                    {#if i < maxDisplayAlgos}
                    <div class="badge badge-sm">{algo}</div>
                    {:else if i == maxDisplayAlgos}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="badge badge-sm cursor-pointer" onclick={()=>{algosCollapsed = false}}><div class="text-info">...</div></div>
                    {/if}
                {:else}
                <div class="badge badge-sm">{algo}</div>
                {/if}
                {/each}
            </div>
        </div>
        {/if}
        


        <div class="flex mt-auto justify-end">
            <a href="/inspect?cam={camera.position}"><LucideSettings/></a>
        </div>
    </div>
{/snippet}

<CameraConnection streamType={CameraStreamType.Algorithmed} bind:isDrawerOpen={isDrawerOpen} drawer={detailsSnippet} camera={camera}>
    <div class="p-3">
        
        <div class="flex justify-between place-items-center">
            <div class="">
                <div class="text-sm font-bold">{camera.position} camera</div>
            </div>
            <button class="btn btn-ghost btn-circle btn-sm p-1" onclick={toggleDrawer}>
                {#if isDrawerOpen}
                <ChevronLeftIcon />
                {:else}
                <EllipsisVertical />
                {/if}
            </button>
        </div>
    </div>
</CameraConnection>