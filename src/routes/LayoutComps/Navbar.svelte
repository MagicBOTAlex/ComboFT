<script lang="ts">
    import ETVRIcon from "@images/EyeTrackVR/ETVR_Logo.jpg";
    import GithubMark from "@images/Brands/GithubMark.svelte";
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore a11y_missing_attribute -->
<div {...$$restProps } class="navbar bg-base-100 shadow-sm">
    <div class="flex-none">
        <button class="btn btn-square btn-ghost">
            <img src="{ETVRIcon}" style="transform: scaleX(-100%);" alt="ETVR">
        </button>
    </div>
    <div class="flex-1">
        <a class="btn btn-ghost text-xl">EyeTrackVR</a>
    </div>
    <div class="flex-none lg:hidden">
        <a href="https://github.com/MagicBOTAlex/TauriLearning" target="_blank">
            <div class="w-6 h-6 object-contain fill-base-content">
                <GithubMark/>
            </div>
        </a>
    </div>
    <div class="px-1"></div>
    <div class="flex-none lg:hidden">
        <label for="SideDrawer" class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
        </label>
    </div>
</div>