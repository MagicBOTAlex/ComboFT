<script lang="ts">
    import { CameraConnectionType } from "./CameraConnectionType";
    export let connectionType: CameraConnectionType = CameraConnectionType.Testing;

    // This is sooo ass, but this is only going to be used during front-end
</script>

{#if connectionType != CameraConnectionType.Streaming}
    {#if connectionType != CameraConnectionType.StreamingSmall}
    <div class="">
        <div class="bg-base-200 p-4 rounded-lg">
            <img src="" class="w-32 h-32 object-fit" alt="">
            {#if connectionType == CameraConnectionType.Testing}
            <div class="pt-2">Not connected</div>
            {:else if connectionType == CameraConnectionType.Cropping}
            <div class="py-1"></div>
            <button class="btn btn-primary w-full">Crop</button>
            {/if}
        </div>
    </div>
    {:else}
    <div class="w-full h-full">
        <div class="bg-base-200 p-4 rounded-lg">
            <div>
                <img src="" class="w-32 h-32 object-fit" alt="">
            </div>
        </div>
    </div>
    {/if}
{:else}
<div class="w-full h-full">
    <div class="bg-base-200 p-4 rounded-lg">
        <div>
            <img src="" class="w-48 h-48 object-fit" alt="">
        </div>
        <div class="pt-2">Not connected</div>
        <div class="py-1"></div>
    </div>
</div>
{/if}