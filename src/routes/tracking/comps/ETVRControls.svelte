<script lang="ts">
    import { ETVRStatus } from "@src/lib/structs/ETVRBackendStatus";
    import { ETVRController } from "@src/store";
    import { onDestroy } from "svelte";

    let backendStatus: ETVRStatus = ETVRStatus.Stopped; // Used to force reload this page
    const interval = setInterval(forceReload, 1000);

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
    });

    function forceReload(){
        backendStatus = ETVRController.status;
    }
</script>


<div class="flex flex-col h-full w-full">
    <div class="flex flex-col p-8">
        <div class="text-xl font-bold">Control panel</div>
        <div class="text-xs">
            <span class="opacity-50">Backend status: </span>
            {#if backendStatus == ETVRStatus.Running}
            <span class="text-success">running...</span>
            {:else}
            <span class="text-error">STOPPED</span>
            {/if}
        </div>
    </div>
</div>