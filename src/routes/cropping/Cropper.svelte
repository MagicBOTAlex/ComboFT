<script lang="ts">
    import { Box } from "@src/lib/structs/Box";
    import { onMount } from "svelte";

    // TODO: Add pausing.

    export let imageSrc: string;
    export let onFinishCropping: (finalBox: Box) => void | undefined;

  
    let image: HTMLImageElement;
    let selectionBox = { x: 0, y: 0, width: 0, height: 0 };
    let finalSelectionBox: { x: number; y: number; width: number; height: number } | null = null;
    let isSelecting = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
  
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault(); // Prevent image dragging
      isSelecting = true;
      hasMoved = false;
      const rect = image.getBoundingClientRect();
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
      selectionBox = {
        x: startX,
        y: startY,
        width: 0,
        height: 0
      };
    };
  
    const handleMouseMove = (event: MouseEvent) => {
      if (!isSelecting) return;
  
      hasMoved = true;
      const rect = image.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
  
      // Calculate the top-left corner and the dimensions
      selectionBox = {
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY)
      };
    };
  
    const handleMouseUp = () => {
      if (!hasMoved || !isSelecting) {
        isSelecting = false;
        return;
      }
  
      // Save the final selection for the persistent blue border
      finalSelectionBox = { ...selectionBox };
      console.log("Selected Region:", selectionBox);
      if (onFinishCropping != undefined){
        let box = new Box(selectionBox.x,selectionBox.y,selectionBox.width,selectionBox.height);
        onFinishCropping(box);
      }

      isSelecting = false;
    };
  
    onMount(() => {
      // Prevents default image dragging behavior
      image.ondragstart = () => false;
    });
  </script>
  
  <div class="relative inline-block w-full h-full">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img
      bind:this={image}
      src="{imageSrc}"
      alt=""
      class="select-none pointer-events-auto w-full h-full"
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseUp}
    />
  
    {#if isSelecting && hasMoved}
      <div
        class="absolute border-2 border-dashed border-red-500 bg-red-500/20 pointer-events-none"
        style="
          left: {selectionBox.x}px;
          top: {selectionBox.y}px;
          width: {selectionBox.width}px;
          height: {selectionBox.height}px;
        "
      ></div>
    {/if}
  
    {#if finalSelectionBox}
      <div
        class="absolute border-2 border-blue-500 pointer-events-none"
        style="
          left: {finalSelectionBox.x}px;
          top: {finalSelectionBox.y}px;
          width: {finalSelectionBox.width}px;
          height: {finalSelectionBox.height}px;
        "
      ></div>
    {/if}
  </div>
  