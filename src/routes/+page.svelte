<script lang="ts">
    import { BackController } from '@src/store';
    // FUCK YOU TAURI, fucking ass documentation. 
    // In one sentence: "...where name is either "app", "my-sidecar" or "sidecar" instead of "binaries/app" for instance."
    // A little further down, it says: "The string provided to Command.sidecar must match one of the strings defined in the externalBin configuration array."

    async function test1(){
        BackController.babbleController.start();
    }
    async function test2(){
        BackController.babbleController.stop();
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
            <button class="btn" on:click={()=>{test1()}}>start sidecar</button>
            <button class="btn" on:click={()=>{test2()}}>kill sidecar</button>
        </div>
    </div>
</div>