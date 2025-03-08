<script lang="ts">
    import {fly, slide} from "svelte/transition";

    export let eye: string;
    export let selectedSourceType: string | undefined = undefined;
    export let selectedCameraAddress: string | undefined = undefined; // Heavily depends on source type. Unselect by default, maybe TODO: Remember
</script>

<div class="grid place-content-center w-full">
    <div class="flex flex-col place-content-center">
        <div class="pb-2">{eye} camera:</div>
        <select bind:value={selectedSourceType} on:change={()=>{selectedCameraAddress = undefined}} class="select select-primary text-base-content w-32">
            <option selected disabled>Pick</option>
            <option value="none">None</option>
            <option value="http">HTTP</option>
            <option value="serial">Serial/USB</option>
            <option value="system">System</option>
            <option value="udp">UDP</option>
        </select>
    </div>
    
    {#if selectedSourceType && selectedSourceType == "serial"}
    <div class="flex flex-col place-content-center w-32 overflow-hidden" transition:slide={{ duration: 500 }}>
        <div class="py-4"></div>
        <div class="pb-2">Select Serial port:</div>
        <select bind:value={selectedCameraAddress} class="select select-primary text-base-content">
            <option selected disabled>Pick</option>
            <option value="com1">COM1</option>
            <option value="com2">COM1</option>
            <option value="com3">COM1</option>
            <option value="com4">COM1</option>
            <option value="com5">COM1</option>
        </select>
    </div>
    {/if}

    {#if selectedSourceType && selectedSourceType == "system"}
    <div class="flex flex-col place-content-center w-32 overflow-hidden" transition:slide={{ duration: 500 }}>
        <div class="py-4"></div>
        <div class="pb-2">Select system device:</div>
        <select bind:value={selectedCameraAddress} class="select select-primary text-base-content">
            <option selected disabled>Pick</option>
            <option value="balls">DroidCam Source 1</option>
            <option value="balls">DroidCam Source 3</option>
            <option value="balls">Deprived Devs camera idk</option>
        </select>
    </div>
    {/if}

    {#if selectedSourceType && selectedSourceType == "http"}
    <div class="flex flex-col place-content-center w-32 overflow-hidden" transition:slide={{ duration: 500 }}>
        <div class="py-4"></div>
        <div class="pb-2">Enter URL:</div>
        <input type="text" class="input" on:keydown={(e) => {
            const target = e.target as HTMLInputElement;
            if (e.key === "Enter") {
                target.blur();
            }
        }}>
        
    </div>
    {/if}

</div>