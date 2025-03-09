<script lang="ts">
    import { invoke } from "@tauri-apps/api/core";
    import { pyInvoke } from "tauri-plugin-pytauri-api";

    let testButton: HTMLElement;

    interface Greeting {
        message: string;
    }

    async function greet() {
        const pyGreeting = await pyInvoke<Greeting>("greet", {
                name: "Test",
            });
        testButton.innerText = pyGreeting.message;
    }
</script>

<div class="prose grid place-items-center h-full">
    <div>
        <h1 class="text-xl font-bold">Welcome to EyeTrackVR</h1>
        <div class="py-1"></div> 
        <p>We need to configure some settings before we can continue</p>
        
        <div class="py-4"></div>
        <div class="flex justify-end">
            <a href="/setup" class="btn btn-primary">Let's go!</a>
            <button id="test-python-btn" class="btn btn-primary" bind:this={testButton} on:click={greet}>Test python</button>
        </div>
    </div>
</div>
