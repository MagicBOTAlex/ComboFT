<script lang="ts">
    import { fly, slide } from "svelte/transition";
    import { TrackerPosition } from "../../../../lib/structs/TrackerPosition";
    import { Cameras } from "@src/store";
    import { CameraSourceType } from "@src/lib/structs/CameraSourceType";
    import { get } from "svelte/store";
    import { Camera } from "@src/lib/structs/Camera";
    import { onMount } from "svelte";

    export let position: TrackerPosition;
    export let selectedSourceType: string | undefined = undefined;
    export let selectedCameraAddress: string | undefined = undefined; // Heavily depends on source type. Unselect by default, maybe TODO: Remember. Update: May be I've implimented something different now

    let sourceTypeSelector: HTMLSelectElement;
    let systemCamSelector: HTMLSelectElement;
    let serialSelector: HTMLSelectElement;
    let httpInputValue: string;

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

    function updateCameraField(field: keyof Camera, value: any) {
        Cameras.update((store) => {
            if (!store[position]) return store; // Guard clause

            return {
                ...store,
                [position]: {
                    ...store[position],
                    [field]: value,
                },
            };
        });

        console.log(get(Cameras)[position]); // Debugging (optional)
    }

    function updateSourceType(sourceType: CameraSourceType) {
        updateCameraField("sourceType", sourceType);
        updateCameraField("isEnabled", sourceType != CameraSourceType.None);
    }

    function setAddr(addr: string) {
        updateCameraField("addr", addr);
    }

    function normalizeIP(ip: string): string {
        // Remove leading/trailing spaces
        ip = ip.trim();

        // Check if it already has a scheme (http:// or https://)
        if (!/^https?:\/\//.test(ip)) {
            ip = "http://" + ip;
        }

        // Remove any trailing slashes and append a single slash
        ip = ip.replace(/\/+$/, "") + "/";

        return ip;
    }

    function loadPrevConfig() {
        const prevConf = get(Cameras)[position]!;
        if (prevConf.sourceType) selectedSourceType = prevConf.sourceType;

        switch (prevConf.sourceType) {
            case CameraSourceType.HTTP:
                if (prevConf.addr) httpInputValue = prevConf.addr;
                break;
            default:
                break;
        }
    }

    onMount(() => {
        loadPrevConfig();
    });
</script>

<div class="grid place-content-center w-full">
    <div class="flex flex-col place-content-center">
        <div class="pb-2">{position} camera:</div>
        <select
            bind:value={selectedSourceType}
            on:change={onSourceChange}
            bind:this={sourceTypeSelector}
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
                bind:this={serialSelector}
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
                bind:this={systemCamSelector}
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
                bind:value={httpInputValue}
                on:keydown={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (e.key === "Enter") {
                        target.blur();
                    }
                    setAddr(normalizeIP(target.value));
                }}
                on:paste={(e) => {
                    const target = e.target as HTMLInputElement;
                    setTimeout(() => {
                        setAddr(normalizeIP(target.value));
                    }, 10);
                }}
            />
        </div>
    {/if}
</div>
