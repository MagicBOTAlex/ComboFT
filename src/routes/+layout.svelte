<script>
    import { onMount } from "svelte";
    import "../style.css";
    import DrawerContents from "./LayoutComps/DrawerContents.svelte";
    import Navbar from "./LayoutComps/Navbar.svelte";
    import { BackController } from "../store";
</script>

<Navbar style="height: 10vh;"/>
<div class="w-full grid drawer-end lg:drawer-open max-xl:h-[89vh] overflow-hidden">
    <input id="SideDrawer" type="checkbox" class="drawer-toggle w-0" />
    <div class="drawer-content flex flex-col items-center justify-center w-full h-full">
        <!-- Page content here -->

        <main class="w-full h-full">
            <slot />
        </main>

    </div>
    <div class="drawer-side w-full lg:h-[89vh]">
        <label
            for="SideDrawer"
            aria-label="close sidebar"
            class="drawer-overlay"
        ></label>
        <DrawerContents/>
    </div>
</div>

