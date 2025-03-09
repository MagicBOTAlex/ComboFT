<script lang="ts">
    import { fly, slide } from "svelte/transition";
    import { TrackingCamera } from "../../../../lib/structs/TrackingCamera";
    import { Cameras } from "@src/store";
    import { CameraSourceType } from "@src/lib/structs/CameraSourceType";
    import { get } from "svelte/store";

    export let position: TrackingCamera;
    export let selectedSourceType: string | undefined = undefined;
    export let selectedCameraAddress: string | undefined = undefined; // Heavily depends on source type. Unselect by default, maybe TODO: Remember. Update: May be I've implimented something different now

    function onSourceChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        selectedSourceType = target.value;

        switch (selectedSourceType) {
            case "none":
                console.log("No source selected.");
                updateSourceType(CameraSourceType.None);
                break;
            case "http":
                console.log("Using HTTP source.");
                updateSourceType(CameraSourceType.HTTP);
                break;
            case "serial":
                console.log("Using Serial/USB source.");
                updateSourceType(CameraSourceType.Serial);
                break;
            case "system":
                console.log("Using System source.");
                updateSourceType(CameraSourceType.System);
                break;
            case "udp":
                console.log("Using UDP source.");
                updateSourceType(CameraSourceType.UDP);
                break;

            default:
                updateSourceType(CameraSourceType.None);
                console.log("Unknown source selected.");
        }
    }

    function updateSourceType(sourceType: CameraSourceType) {
        const camerasValue = get(Cameras);
        if (!camerasValue[position]) return;

        camerasValue[position].sourceType = sourceType;
        Cameras.update((store) => {
            store[position] = camerasValue[position];
            return store;
        });
        console.log(get(Cameras)[position]);
    }
</script>

<div class="grid place-content-center w-full">
    <div class="flex flex-col place-content-center">
        <div class="pb-2">{position} camera:</div>
        <select
            bind:value={selectedSourceType}
            on:change={onSourceChange}
            class="select select-primary text-base-content w-32"
        >
            <option selected value="none">None</option>
            <option value="http">HTTP</option>
            <option value="serial">Serial/USB</option>
            <option value="system">System</option>
            <option value="udp">UDP</option>
        </select>
    </div>

    {#if selectedSourceType && selectedSourceType == "serial"}
        <div
            class="flex flex-col place-content-center w-32 overflow-hidden"
            transition:slide={{ duration: 500 }}
        >
            <div class="py-4"></div>
            <div class="pb-2">Select Serial port:</div>
            <select
                bind:value={selectedCameraAddress}
                class="select select-primary text-base-content"
            >
                <option selected disabled>Pick</option>
                <option value="com1">COM1</option>
                <option value="com2">COM1</option>
                <option value="com3">COM1</option>
                <option value="com4">COM1</option>
                <option value="com5">COM1</option>
            </select>
        </div>
    {/if}

    {#if selectedSourceType && selectedSourceType == "system"}
        <div
            class="flex flex-col place-content-center w-32 overflow-hidden"
            transition:slide={{ duration: 500 }}
        >
            <div class="py-4"></div>
            <div class="pb-2">Select system device:</div>
            <select
                bind:value={selectedCameraAddress}
                class="select select-primary text-base-content"
            >
                <option selected disabled>Pick</option>
                <option value="balls">DroidCam Source 1</option>
                <option value="balls">DroidCam Source 3</option>
                <option value="balls">Deprived Devs camera idk</option>
            </select>
        </div>
    {/if}

    {#if selectedSourceType && selectedSourceType == "http"}
        <div
            class="flex flex-col place-content-center w-32 overflow-hidden"
            transition:slide={{ duration: 500 }}
        >
            <div class="py-4"></div>
            <div class="pb-2">Enter URL:</div>
            <input
                type="text"
                class="input"
                on:keydown={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (e.key === "Enter") {
                        target.blur();
                    }
                }}
            />
        </div>
    {/if}
</div>
