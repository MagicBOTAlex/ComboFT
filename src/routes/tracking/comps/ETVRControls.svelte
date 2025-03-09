<script>
    import { ETVRStatus } from "@src/lib/structs/ETVRBackendStatus";
    import { ETVRController } from "@src/store";

</script>


<div class="flex flex-col h-full w-full">
    <div class="flex flex-col p-8">
        <div class="text-xl font-bold">Control panel</div>
        <div class="text-xs">
            <span class="opacity-50">Backend status: </span>
            {#if ETVRController.status == ETVRStatus.Running}
            <span class="text-success">running...</span>
            {:else}
            <span class="text-error">STOPPED</span>
            {/if}
        </div>
    </div>
</div>