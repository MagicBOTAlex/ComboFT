<script lang="ts">
    import { ET_Algorithms as ET_Algorithms } from "@src/lib/structs/ET_Api/ET_Algorithms";
    import { ArrowDownAZ, ArrowRight, GripVertical, Info, Plus, Settings, X } from "lucide-svelte";
    import { onMount, tick, type Snippet } from "svelte";
    import BlobSettings from "./AlgoSettingsContent/BlobSettings.svelte";
    import HsfSettings from "./AlgoSettingsContent/HsfSettings.svelte";
    import RansacSettings from "./AlgoSettingsContent/RansacSettings.svelte";
    import AlgoSettingsModal from "./AlgoSettingsModal.svelte";
    import { BackController } from "@src/store";
    import type { Camera } from "@src/lib/structs/Camera";

    export let camera: Camera | undefined;

    let list: HTMLUListElement;
    let draggedItem: HTMLLIElement | null = null;

    // Using 2 arrays. one to display, other to modify without svelte reload
    let loadingAlgos = true;
    let initialAlgos: ET_Algorithms[] | undefined = undefined; // What the algorithems the user has enabled right now];
    let modifiedAlgos: ET_Algorithms[] | undefined = initialAlgos; // What the algorithems the user will change to  

    const algoSettingsSnippits: Record<ET_Algorithms, Snippet | undefined> = {
        [ET_Algorithms.LEAP]: undefined,
        [ET_Algorithms.BLOB]: BlobSettings_snip,
        [ET_Algorithms.HSRAC]: undefined,
        [ET_Algorithms.RANSAC]: HsfSettings_snip,
        [ET_Algorithms.HSF]: RansacSettings_snip,
        [ET_Algorithms.AHSF]: undefined
    };

    async function updateAlgosArr(){
        let liAlgos = list.querySelectorAll("li");
        modifiedAlgos = [];
        for (let i = 0; i < liAlgos.length; i++) {
            const liAlgo = liAlgos[i];
            if (!liAlgo) continue;

            const dataAlgo: string = liAlgo.dataset.algo || '';
            modifiedAlgos.push(dataAlgo as ET_Algorithms);
        }
        // console.log(modifiedAlgos);
    }

    // Gets called when added, when removed, when re-ordered
    async function onAlgoUpdated(){
        await tick();
        updateAlgosArr();
        if (camera && modifiedAlgos)
            BackController.pushCameraAlgorithems(camera, modifiedAlgos);
    }


    // Record positions of all list items within the container.
    function recordPositions(
        container: HTMLUListElement,
    ): Map<HTMLLIElement, DOMRect> {
        const positions = new Map<HTMLLIElement, DOMRect>();
        container.querySelectorAll("li").forEach((child: Element) => {
            const li = child as HTMLLIElement;
            positions.set(li, li.getBoundingClientRect());
        });
        return positions;
    }

    // Animate list items (except the dragged one) from their old to new positions.
    function animateListReorder(
        container: HTMLUListElement,
        oldPositions: Map<HTMLLIElement, DOMRect>,
    ): void {
        container.querySelectorAll("li").forEach((child: Element) => {
            const li = child as HTMLLIElement;
            if (li.classList.contains("dragging")) return;
            const oldRect = oldPositions.get(li);
            if (!oldRect) return;
            const newRect = li.getBoundingClientRect();
            const deltaX = oldRect.left - newRect.left;
            const deltaY = oldRect.top - newRect.top;
            if (deltaX || deltaY) {
                li.style.transition = "none";
                li.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                // Force reflow.
                li.getBoundingClientRect();
                li.style.transition = "transform 300ms";
                li.style.transform = "";
            }
        });
    }

    // Return the <li> element after which the dragged item should be inserted.
    function getDragAfterElement(
        container: HTMLUListElement,
        y: number,
    ): HTMLLIElement | null {
        const draggableElements = Array.from(
            container.querySelectorAll("li:not(.dragging)"),
        ) as HTMLLIElement[];
        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset, element: child };
                }
                return closest;
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: null as HTMLLIElement | null,
            },
        ).element;
    }

    onMount(async () => {
        await tick();
        initialAlgos = await BackController.getCameraAlgorithems(camera!);
        modifiedAlgos = initialAlgos;

        loadingAlgos = false;
    });

    async function onDragEnd(){
        if (draggedItem) {
            draggedItem.classList.remove(
                "dragging",
                "opacity-50",
                "scale-105",
            );
        }
        draggedItem = null;
        onAlgoUpdated();
    }

    async function onDragOver(e: DragEvent) {
        e.preventDefault();
        const oldPositions = recordPositions(list);
        const afterElement = getDragAfterElement(list, e.clientY);
        if (draggedItem) {
            if (afterElement === null) {
                list.appendChild(draggedItem);
            } else {
                list.insertBefore(draggedItem, afterElement);
            }
        }
        animateListReorder(list, oldPositions);
    }

    async function onDragStart(e: DragEvent) {
        if (!e) return;

        const target = e.target as HTMLLIElement;
        if (!target) return;

        draggedItem = target;
        draggedItem.classList.add("dragging", "opacity-50", "scale-105");
    }

    let selectedAlgoSettings: ET_Algorithms | undefined = undefined;
    let showSettingsModal = false;
    async function openAlgoSettings(algo: ET_Algorithms){
        await tick();
        selectedAlgoSettings = algo;
        showSettingsModal= true;
    }

    async function addAlgoToList(algo: ET_Algorithms){
        if (modifiedAlgos?.indexOf(algo) != -1) return; // Algo already in list

        modifiedAlgos.push(algo);
        initialAlgos = modifiedAlgos;
        
        onAlgoUpdated();
    }

    async function removeAlgoFromList(algo: ET_Algorithms){
        // console.log("Removeing: " + algo);
        if (!modifiedAlgos) return;
        let index = modifiedAlgos.indexOf(algo);
        if (index == -1) return; // Algo not in list

        modifiedAlgos = modifiedAlgos.filter(x => x != algo);
        initialAlgos = modifiedAlgos;
        
        onAlgoUpdated();
    }
</script>

{#snippet BlobSettings_snip()}
<BlobSettings/>
{/snippet}
{#snippet HsfSettings_snip()}
<HsfSettings/>
{/snippet}
{#snippet RansacSettings_snip()}
<RansacSettings/>
{/snippet}

<div class="grid grid-cols-2 grid-rows-5 gap-4 w-full">
    <div class="row-start-1">
        <div class="border-l-2 border-dashed pl-2 border-base-300 text-lg font-semibold"><span class="w-full">Available</span> <br>Algorythems</div>
    </div>
    <div class="row-start-1">
        <h2 class="border-l-2 border-dashed border-base-300 flex justify-between pl-2 text-lg w-full font-semibold">
            <div>
                <span class="">Active</span> <br>Algorithems
            </div>
            <span class="flex text-base-300 text-sm mb-auto">Priority <ArrowDownAZ class="pl-1"/></span>
        </h2>
    </div>



    <div class="row-span-full row-start-2 gap-2 flex flex-col">
        {#each Object.values(ET_Algorithms) as algo}
        <div class="flex place-content-center bod">
            <div>{algo}</div>
            <div class="ml-auto"></div>
            <div class="tooltip" data-tip="hello">
                <button class="p-0"><Info class="p-1 text-info"/></button>
            </div>
            <button class="btn btn-soft btn-success btn-xs p-0 {loadingAlgos || !modifiedAlgos || modifiedAlgos.indexOf(algo as ET_Algorithms) != -1 ?"btn-disabled":""}"
            on:click={()=>{addAlgoToList(algo as ET_Algorithms);}}>
                <Plus/>
            </button>
        </div>
        {/each}
    </div>


    <div class="row-span-full row-start-2 p-2 pr-0 pl-4 border-l-2 border-base-200">
        <ul bind:this={list} class="flex flex-col w-full gap-2">
            {#if loadingAlgos || !initialAlgos}
            {#each Object.keys(ET_Algorithms) as i}
            <div class="skeleton h-8 w-full"></div>
            {/each}
            {:else}
            {#each initialAlgos as algo}
            <li class="w-full flex cursor-pointer rounded-lg border border-base-300 transition-transform duration-300"
            draggable="true"
            data-algo="{algo}"
            on:dragstart={onDragStart}
            on:dragover={onDragOver}
            on:dragend={onDragEnd}
            on:drop|preventDefault>
                <div class="border-r border-dashed border-base-300 text-base-300">
                    <GripVertical/>
                </div>
                <div class="pl-2 w-full">
                    <div class="text-base-content opacity-80">{algo}</div>
                </div>
                <div class="flex">
                    <button class="p-0 btn-ghost cursor-pointer hover:text-error transition-colors"
                    on:click={()=>{removeAlgoFromList(algo);}}>
                        <X class="p-0.5"/>
                    </button>
                    <div class="-ml-1.5"></div>
                    <button class="p-0 btn-ghost {algoSettingsSnippits[algo]? "cursor-pointer": "opacity-30"}"
                    on:click={()=>{openAlgoSettings(algo)}}>
                        <Settings class="p-1 opacity-80"/>
                    </button>
                </div>
            </li>
            {/each}
            {/if}
        </ul>
    </div>
</div>

{#if selectedAlgoSettings && algoSettingsSnippits[selectedAlgoSettings]}
<AlgoSettingsModal title={selectedAlgoSettings + " settings"} bind:show={showSettingsModal} modalContents={algoSettingsSnippits[selectedAlgoSettings]}/>
{/if}