<script lang="ts">
    import CameraConnection from "../../lib/CameraConnection.svelte";
    import TrackingInspectMode from "./comps/TrackingInspectMode.svelte";
    import TrackingNormalMode from "./comps/TrackingNormalMode.svelte";

    let inspectMode: boolean = true;
</script>

{#if !inspectMode}
<TrackingNormalMode/>
{:else}
<TrackingInspectMode/>
{/if}