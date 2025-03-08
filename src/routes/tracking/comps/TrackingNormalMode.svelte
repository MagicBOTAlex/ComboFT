<script>
    import CameraConnection from "../../../lib/CameraConnection.svelte";
    import { CameraConnectionType } from "../../../lib/CameraConnectionType";
</script>

<div class="flex h-full w-full justify-center place-items-center gap-4 py-16 px-16">
    <CameraConnection connectionType={CameraConnectionType.Streaming}/>
    <CameraConnection connectionType={CameraConnectionType.Streaming}/>
    <CameraConnection connectionType={CameraConnectionType.Streaming}/>
</div>