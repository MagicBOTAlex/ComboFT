<script lang="ts">
    import { X } from "lucide-svelte";
    import type { Snippet } from "svelte";

    export let show = false;
    export let title: string;
    export let modalContents: Snippet | undefined = undefined;
</script>

{#if show}
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <!-- Overlay -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="absolute inset-0 bg-black opacity-50"
            on:click={()=>{show=false}}
        ></div>
        <!-- Modal Content -->
        <div class="bg-base-100 min-h-48 min-w-64 rounded-lg shadow-lg p-6 relative z-10">
            <div>
                <div class="flex justify-between">
                    <div class="font-bold text-lg">{title}</div>
                    <div class="w-8"></div>
                    <button class="p-0 cursor-pointer btn-circle" on:click={()=>{show=false;}}><X/></button>
                </div>
                <div class="h-2"></div>
                <div>
                    {#if modalContents}
                    {@render modalContents()}
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
