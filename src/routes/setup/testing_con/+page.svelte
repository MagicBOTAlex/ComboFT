<script lang="ts">
    import {fly, slide} from "svelte/transition";
    import Tabs from "../comps/tabs.svelte";
    import CameraConTest from "../../../lib/CameraConnection.svelte";
    import { TrackerPosition } from "@src/lib/structs/TrackerPosition";
    import { get } from "svelte/store";
    import { Cameras } from "@src/store";
</script>

<Tabs enabled={["", "tab-active", "tab-disabled"]}/>
<div class="w-full h-full flex flex-col justify-center">
    <div class="flex justify-center">
        <div class="w-full px-26">
            <div class="px-4">
                <div class="font-bold text-2xl">Testing connections</div>
                <div>Check if all is correctly connected. <br> Go back if not connected.</div>
            </div>
            <div class="divider"></div>
            <div class="flex justify-center w-full gap-4">
                {#each Object.values(get(Cameras)) as camera}
                {#if camera.isEnabled}
                <CameraConTest camera={camera}>
                    <div class="p-4">
                        <div class="text-lg font-bold">{camera.position} camera</div>
                        <div class="text-sm">Source type: {camera.sourceType}</div>
                    </div>
                </CameraConTest>
                {/if}
                {/each}
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden">
                <a href="/setup/crop" class="btn btn-primary w-full">Looks good 👍</a>
            </div>
        </div>
    </div>
</div>