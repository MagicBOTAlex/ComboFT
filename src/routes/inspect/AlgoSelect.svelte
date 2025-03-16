<script lang="ts">
    import { ET_Algorithm as ET_Algorithm } from "@src/lib/structs/ET_Algorithm";
    import { ArrowDownAZ, GripVertical, Settings, X } from "lucide-svelte";
    import { onMount, tick, type Snippet } from "svelte";
    import BlobSettings from "./AlgoSettingsContent/BlobSettings.svelte";
    import HsfSettings from "./AlgoSettingsContent/HsfSettings.svelte";
    import RansacSettings from "./AlgoSettingsContent/RansacSettings.svelte";
    import AlgoSettingsModal from "./AlgoSettingsModal.svelte";

    let list: HTMLUListElement;
    let draggedItem: HTMLLIElement | null = null;

    let algos = [
        ET_Algorithm.LEAP,
        ET_Algorithm.BLOB,
        ET_Algorithm.HSRAC,
        ET_Algorithm.RANSAC,
        ET_Algorithm.HSF,
        ET_Algorithm.AHSF
    ];

    const algoSettingsSnippits: Record<ET_Algorithm, Snippet | undefined> = {
        [ET_Algorithm.LEAP]: undefined,
        [ET_Algorithm.BLOB]: BlobSettings_snip,
        [ET_Algorithm.HSRAC]: undefined,
        [ET_Algorithm.RANSAC]: HsfSettings_snip,
        [ET_Algorithm.HSF]: RansacSettings_snip,
        [ET_Algorithm.AHSF]: undefined
    };


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

    onMount(() => {
        // Attach event listeners to all <li> elements.
        list.querySelectorAll("li").forEach((item: Element) => {
            const li = item as HTMLLIElement;
            li.draggable = true;
            li.addEventListener("dragstart", (e: DragEvent) => {
                draggedItem = li;
                li.classList.add("dragging", "opacity-50", "scale-105");
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = "move";
                    // Some browsers require data to be set for drop to work.
                    e.dataTransfer.setData("text/plain", "");
                }
            });

            li.addEventListener("dragend", () => {
                if (draggedItem) {
                    draggedItem.classList.remove(
                        "dragging",
                        "opacity-50",
                        "scale-105",
                    );
                }
                draggedItem = null;
            });
        });

        // Attach listeners to the list container.
        list.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "move";
            }
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
        });

        list.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
        });
    });

    let selectedAlgoSettings: ET_Algorithm | undefined = undefined;
    let showSettingsModal = false;
    async function openAlgoSettings(algo: ET_Algorithm){
        await tick();
        selectedAlgoSettings = algo;
        showSettingsModal= true;
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



    <div class="row-span-full row-start-2">
        {#each algos as algo}
        <div>
            <div>{algo}</div>
        </div>
        {/each}
    </div>
    <div class="row-span-full row-start-2">
        <ul bind:this={list} class="flex flex-col w-full gap-2">
            {#each algos as algo}
            <li class="w-full flex cursor-pointer rounded-lg border border-base-300 transition-transform duration-300">
                <div class="border-r border-base-300 text-base-300">
                    <GripVertical/>
                </div>
                <div class="pl-2 w-full">
                    <div class="text-base-content opacity-80">{algo}</div>
                </div>
                <div class="flex">
                    <button class="p-0 btn-ghost cursor-pointer"><X class="p-0.5"/></button>
                    <div class="-ml-1.5"></div>
                    <button class="p-0 btn-ghost {algoSettingsSnippits[algo]? "cursor-pointer": "opacity-30"}"
                    on:click={()=>{openAlgoSettings(algo)}}>
                        <Settings class="p-1 opacity-80"/>
                    </button>
                </div>
            </li>
            {/each}
        </ul>
    </div>
</div>

{#if selectedAlgoSettings && algoSettingsSnippits[selectedAlgoSettings]}
<AlgoSettingsModal title={selectedAlgoSettings + " settings"} bind:show={showSettingsModal} modalContents={algoSettingsSnippits[selectedAlgoSettings]}/>
{/if}