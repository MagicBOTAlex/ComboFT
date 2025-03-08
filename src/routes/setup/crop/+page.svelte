<script lang="ts">
    import {fly, slide} from "svelte/transition";
    import Tabs from "../comps/tabs.svelte";
    import CameraConTest from "../../../lib/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraConnectionType";
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
                <CameraConTest connectionType={CameraConnectionType.Cropping}/>
                <CameraConTest connectionType={CameraConnectionType.Cropping}/>
                <CameraConTest connectionType={CameraConnectionType.Cropping}/>
            </div>
            <div class="py-4"></div>
            <div class="p-4 overflow-hidden">
                <a href="/tracking" class="btn btn-primary w-full">Looks good 2.0 👍</a>
            </div>
        </div>
    </div>
</div>