<script lang="ts">
    import { page } from '$app/state';
    import CameraStream from '@src/lib/CameraSvelteComponents/CameraStream.svelte';
    import type { Camera } from '@src/lib/structs/Camera';
    import { CroppingSender } from '@src/lib/structs/CroppingSender';
    import type { TrackerPosition } from '@src/lib/structs/TrackerPosition';
    import { Cameras } from '@src/store';
    import { ChevronLeft, Crop } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import SelectableCameraStream from './SelectableCameraStream.svelte';
    import {SettingsTab} from "./SettingsTab";
    import AlgoSelect from './AlgoSelect.svelte';
    
    $: params = new URLSearchParams(page.url.search);
    $: camParam = params.get('cam');

    let selectedSettingsTab: SettingsTab = SettingsTab.Algorithem;

    function setSettingTabs(tab: SettingsTab){
        setTimeout(() => {
            selectedSettingsTab = tab;
        }, 10);
    }

    let camera: Camera | undefined = undefined;
    onMount(async ()=>{
        camera = get(Cameras)[camParam as TrackerPosition];
    });
</script>

<div class="w-full h-full">
    <div class="grid grid-cols-2 w-full h-full">
        <div class="w-full max-h-full flex flex-col p-4">
            <div class="text-2xl font-bold">Currently inspecting <span class="text-secondary">{camera?.position}</span></div>
            
            <div class="tabs tabs-border w-full">
                {#each Object.values(SettingsTab) as settingType}
                <button class="tab {selectedSettingsTab === settingType ? "tab-active":""}" on:click={()=>{setSettingTabs(settingType as SettingsTab)}}>{settingType}</button>
                {/each}
            </div>
            
            <div class="py-4">
                {#if selectedSettingsTab == SettingsTab.Calibration}
                <div class="flex gap-4">
                    <button on:click={()=>{alert("Not implimented (yet)")}} class="btn btn-soft">Calibrate</button>
                    <button on:click={()=>{alert("Not implimented (yet)")}} class="btn btn-soft">Center eyes</button>
                </div>
                {:else if selectedSettingsTab == SettingsTab.Algorithem}
                <div class="flex gap-4">
                    <AlgoSelect/>
                </div>
                {/if}
            </div>

            <div class="flex mt-auto justify-between"> 
                <a href="/tracking" class="btn btn-primary pl-2"><ChevronLeft/> Back</a>
                <a href="/cropping?cam={camera?.position}&sender={CroppingSender.Inspector}" class="btn btn-secondary p-2"><Crop/></a>
            </div>
        </div>

        <SelectableCameraStream bind:camera={camera}/>
    </div>
</div>