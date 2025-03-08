<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        goto("/setup/camera_selection");
    });
</script>


<div>
    Redirect
</div>