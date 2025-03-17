<script lang="ts">
    import { BackendStatus } from "@src/lib/structs/BackendStatus";
    import { ETVRController } from "@src/store";
    import { onDestroy } from "svelte";

    let backendStatus: BackendStatus = BackendStatus.Stopped; // Used to force reload this page
    const interval = setInterval(forceReload, 1000);

    // Stop interval when component is destroyed
    onDestroy(() => {
        clearInterval(interval);
    });

    function forceReload(){
        backendStatus = ETVRController.ET_Status;
    }
</script>


<div class="flex flex-col h-full w-full p-8">
    <div class="flex flex-col">
        <div class="text-xl font-bold">Control panel</div>
        <div class="text-xs">
            <span class="opacity-50">Backend status: </span>
            {#if backendStatus == BackendStatus.Running}
            <span class="text-success">running...</span>
            {:else}
            <span class="text-error">STOPPED</span>
            {/if}
        </div>
    </div>
    <div class="p-4"></div>
    <div class="flex gap-4">
        <button on:click={()=>{alert("Not implimented (yet)")}} class="btn btn-soft">Calibrate</button>
        <button on:click={()=>{alert("Not implimented (yet)")}} class="btn btn-soft">Center eyes</button>
    </div>
</div>