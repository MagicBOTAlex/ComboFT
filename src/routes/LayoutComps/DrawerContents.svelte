<script lang="ts">
    import DeprivedDevsLogo from "@images/Brands/DeprivedDevsLogo.svelte";
    import { X } from "lucide-svelte";
    import ETVRIcon from "@images/EyeTrackVR/ETVR_Logo.jpg";

    import { openUrl } from '@tauri-apps/plugin-opener';
</script>

<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-0">
    <!-- Sidebar content here -->
    <li><a href="/setup">Setup</a></li>
    <li><a href="/tracking">Tracking</a></li>
    <li><a href="/Settings">Settings</a></li>

    <div class="w-full pb-6 mt-auto">
        <div class="flex place-items-center w-full justify-center">
            <button on:click={()=>{openUrl("https://Deprived.dev/")}} class="w-20 h-20 overflow-hidden cursor-pointer">
                <div class="mt-auto w-65 h-30 fill-base-content">
                    <DeprivedDevsLogo/>
                </div>
            </button>
            <div>
                <X class="fill-base-content"/>
            </div>
            <button on:click={()=>{openUrl("https://Deprived.dev/")}} class="w-20 h-20 cursor-pointer">
                <img src="{ETVRIcon}" alt="ETVR">
            </button>
        </div>

        <div class="w-full text-center text-base-300">Yeah, I need an SVG</div>
        <div class="w-full text-center text-base-300">Designed by BOTAlex</div>
    </div>
</ul>