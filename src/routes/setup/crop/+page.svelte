<script lang="ts">
    import {fly, slide} from "svelte/transition";
    import Tabs from "../comps/tabs.svelte";
    import CameraConTest from "../../../lib/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraConnectionType";
    import CameraConnection from "../../../lib/CameraConnection.svelte";
    import { Cameras } from "@src/store";
    import { get } from "svelte/store";
    import { Crop } from "lucide-svelte";
</script>

<Tabs enabled={["", "", "tab-active"]}/>
<div class="w-full h-full flex flex-col justify-center">
    <div class="flex justify-center">
        <div class="w-full px-26">
            <div class="px-4">
                <div class="font-bold text-2xl">Cropping</div>
                <div>Time to crop around the eye for better detection</div>
            </div>
            <div class="divider"></div>
            <div class="flex justify-center w-full gap-4">
                {#each Object.values(get(Cameras)) as camera}
                {#if camera.isEnabled}
                <CameraConTest camera={camera}>
                    <div class="p-4 flex flex-col">
                        <div class="text-lg font-bold">{camera.position} camera</div>
                        <div class="py-2"></div>
                        <div class="flex justify-end">
                            <button class="btn btn-secondary btn-sm pr-1">Crop <Crop/></button>
                        </div>
                    </div>
                </CameraConTest>
                {/if}
                {/each}
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden">
                <a href="/tracking" class="btn btn-primary w-full">Looks good 2.0 👍</a>
            </div>
        </div>
    </div>
</div>