<script lang="ts">
    // TODO: Use svelte stores
    export let enabled: string[];
</script>

<div role="tablist" class="tabs tabs-border h-0">
    <a role="tab" href="/setup/camera_selection" class="tab {enabled[0]}">Camera Sources</a>
    <a role="tab" href="/setup/testing_con" class="tab {enabled[1]}">Testing connectivity</a>
    <a role="tab" href="/setup/crop" class="tab {enabled[2]}">Cropping</a>
</div>