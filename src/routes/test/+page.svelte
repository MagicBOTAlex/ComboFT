<script lang="ts">
    import { onMount } from "svelte";
  
    let list: HTMLUListElement;
    let draggedItem: HTMLLIElement | null = null;
  
    // Record positions of all list items within the container.
    function recordPositions(container: HTMLUListElement): Map<HTMLLIElement, DOMRect> {
      const positions = new Map<HTMLLIElement, DOMRect>();
      container.querySelectorAll("li").forEach((child: Element) => {
        const li = child as HTMLLIElement;
        positions.set(li, li.getBoundingClientRect());
      });
      return positions;
    }
  
    // Animate list items (except the dragged one) from their old to new positions.
    function animateListReorder(container: HTMLUListElement, oldPositions: Map<HTMLLIElement, DOMRect>): void {
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
    function getDragAfterElement(container: HTMLUListElement, y: number): HTMLLIElement | null {
      const draggableElements = Array.from(container.querySelectorAll("li:not(.dragging)")) as HTMLLIElement[];
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
          }
          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY, element: null as HTMLLIElement | null }
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
            draggedItem.classList.remove("dragging", "opacity-50", "scale-105");
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
  </script>
  
  <svelte:head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reorderable List</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </svelte:head>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-5 shadow-md rounded-md w-64">
      <h2 class="text-lg font-semibold mb-3">Reorderable List</h2>
      <ul bind:this={list} class="border p-3 space-y-2 min-h-[150px]">
        <li class="p-2 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-300">
          Item 1
        </li>
        <li class="p-2 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-300">
          Item 2
        </li>
        <li class="p-2 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-300">
          Item 3
        </li>
        <li class="p-2 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-300">
          Item 4
        </li>
      </ul>
    </div>
  </div>
  