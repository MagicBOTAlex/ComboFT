<script>
    import "../style.css";
    import DrawerContents from "./LayoutComps/DrawerContents.svelte";
    import Navbar from "./LayoutComps/Navbar.svelte";
</script>

<Navbar style="height: 10vh;"/>
<div class="drawer drawer-end lg:drawer-open overflow-hidden" style="height: 89vh;">
    <input id="SideDrawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center w-full h-full">
        <!-- Page content here -->

        <main class="main">
            <slot />
        </main>

    </div>
    <div class="drawer-side w-full">
        <label
            for="SideDrawer"
            aria-label="close sidebar"
            class="drawer-overlay"
        ></label>
        <DrawerContents/>
    </div>
</div>

