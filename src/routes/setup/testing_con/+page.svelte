<script lang="ts">
    import {fly, slide} from "svelte/transition";
    import Tabs from "../comps/tabs.svelte";
    import CameraConTest from "../../../lib/CameraConnection.svelte";
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
                <CameraConTest/>
                <CameraConTest/>
                <CameraConTest/>
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden">
                <a href="/setup/crop" class="btn btn-primary w-full">Looks good 👍</a>
            </div>
        </div>
    </div>
</div>