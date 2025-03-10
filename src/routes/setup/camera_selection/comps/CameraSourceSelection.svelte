<script lang="ts">
    import { fly, slide } from "svelte/transition";
    import { TrackerPosition } from "../../../../lib/structs/TrackerPosition";
    import { Cameras } from "@src/store";
    import { CameraSourceType } from "@src/lib/structs/CameraSourceType";
    import { get } from "svelte/store";
    import { Camera } from "@src/lib/structs/Camera";
    import { onMount } from "svelte";
    import { invoke } from "@tauri-apps/api/core";

    export let position: TrackerPosition;
    export let selectedSourceType: string | undefined = undefined;
    let selectedCameraAddress: string | undefined = undefined;

    let sourceTypeSelector: HTMLSelectElement;
    let systemCamSelector: HTMLSelectElement;
    let serialSelector: HTMLSelectElement;
    let httpInputValue: string;

    let serialPorts: string[] = [];
    async function loadSerialPorts(){
        serialPorts = await invoke("get_list_of_serial");
        console.log("Serial ports detected: " + serialPorts);

        if (serialPorts.length == 1) {
            setAddr(serialPorts[0]);
        }
    }

    function onSourceChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        selectedSourceType = target.value;

        switch (selectedSourceType) {
            case "none":
                console.log("No source selected.");
                updateSourceType(CameraSourceType.None);
                setAddr("");
                break;
            case "http":
                console.log("Using HTTP source.");
                updateSourceType(CameraSourceType.HTTP);
                break;
            case "serial":
                console.log("Using Serial/USB source.");
                loadSerialPorts();
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
    }
    
    function setAddr(addr: string) {
        selectedCameraAddress = addr;
        updateCameraField("isEnabled", selectedSourceType != CameraSourceType.None && addr != "" && addr != undefined);
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
            case CameraSourceType.Serial:
                loadSerialPorts();
                if (prevConf.addr) selectedCameraAddress = prevConf.addr;
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
                on:select={()=> {setTimeout(() => {
                    setAddr(serialSelector.value);
                }, 10);}}
                bind:this={serialSelector}
                class="select select-primary text-base-content"
            >
            {#if serialPorts.length > 0}
                {#each serialPorts as port}
                     <option value="{port}">{port}</option>
                {/each}
            {:else}
            <option disabled value="">No serial detected</option>
            {/if}
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
                    setTimeout(() => {
                        setAddr(normalizeIP(target.value));
                    }, 10);
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
