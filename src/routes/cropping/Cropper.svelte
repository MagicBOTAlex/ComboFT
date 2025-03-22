<script lang="ts">
  import CameraStream from "@src/lib/CameraSvelteComponents/CameraStream.svelte";
  import { ROIBox } from "@src/lib/structs/Box";
  import type { Camera } from "@src/lib/structs/Camera";
  import { Maximize2 } from "lucide-svelte";
  import { onMount } from "svelte";

  export let onFinishCropping: (finalBox: ROIBox) => void | undefined;
  export let cam: Camera;
  
  // DOM elements
  let container: HTMLDivElement;
  let square: HTMLDivElement;
  let handle: HTMLDivElement;
  let image: HTMLImageElement;

  // Rotation state
  let isDragging = false;
  let startAngle = 0;
  let currentRotation = 0;

  // Selection state
  let selectionBox = { x: 0, y: 0, width: 0, height: 0 };
  let startX = 0;
  let startY = 0;
  let finalSelectionBox: { x: number; y: number; width: number; height: number } | null = null;
  let isSelecting = false;
  let hasMoved = false;
  let imageOffsetX = 0;
  let imageOffsetY = 0;

  const handleMouseDown = (event: MouseEvent) => {
      if (event.target === handle) return;
      event.preventDefault();
      isSelecting = true;
      hasMoved = false;

      const containerRect = container.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      
      // Calculate image position relative to container
      imageOffsetX = imageRect.left - containerRect.left;
      imageOffsetY = imageRect.top - containerRect.top;

      // Convert mouse position to image coordinates
      const mouseX = event.clientX - containerRect.left - imageOffsetX;
      const mouseY = event.clientY - containerRect.top - imageOffsetY;

      startX = mouseX;
      startY = mouseY;
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

      const containerRect = container.getBoundingClientRect();
      const currentX = event.clientX - containerRect.left - imageOffsetX;
      const currentY = event.clientY - containerRect.top - imageOffsetY;

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

      const imageRect = image.getBoundingClientRect();
      const scaleX = image.naturalWidth / imageRect.width;
      const scaleY = image.naturalHeight / imageRect.height;

      // Convert radians to degrees and log with degree symbol
      const currentRotationDeg = (getCurrentRotation() * (180 / Math.PI));
      const mappedRotation = (-currentRotationDeg + 360) % 360;
      console.log(mappedRotation);

      const finalBox = new ROIBox(
          Math.round(selectionBox.x * scaleX),
          Math.round(selectionBox.y * scaleY),
          Math.round(selectionBox.width * scaleX),
          Math.round(selectionBox.height * scaleY),
          Math.round(mappedRotation)
      );

      onFinishCropping?.(finalBox);
      finalSelectionBox = { ...selectionBox };
      isSelecting = false;
  };

  // Rotation functions remain the same
  function getCurrentRotation(): number {
      const transform = window.getComputedStyle(square).getPropertyValue('transform');
      if (transform === 'none') return 0;
      const values = transform.match(/matrix\((.+)\)/)?.[1].split(', ');
      return values ? Math.atan2(parseFloat(values[1]), parseFloat(values[0])) : 0;
  }

  function rotationGrab(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    isDragging = true;
    handle.classList.replace('cursor-grab', 'cursor-grabbing');

    const rect = square.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    
    currentRotation = getCurrentRotation();
    startAngle = currentRotation - mouseAngle;
  }

  function rotationMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    const rect = square.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const degrees = (mouseAngle + startAngle) * (180 / Math.PI);
    square.style.transform = `rotate(${degrees}deg)`;
    // const currentRotationDeg = (getCurrentRotation() * (180 / Math.PI));
    // const mappedRotation = (currentRotationDeg + 360) % 360;
    // console.log(mappedRotation);
  }

  function rotationUngrab() {
      isDragging = false;
      handle.classList.replace('cursor-grabbing', 'cursor-grab');
  }

  onMount(() => {
      image.ondragstart = () => false;
  });
</script>

<svelte:window
  on:mousemove={rotationMouseMove}
  on:mouseup={rotationUngrab}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative inline-block w-full h-full select-none"
  bind:this={container}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
>
  <div class="w-full h-full grid place-items-center p-10">
      <div
          bind:this={square}
          class="relative w-60 h-60 transform origin-center overflow-visible"
          style="transform: rotate(0deg)"
      >
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <CameraStream camera={cam} bind:imageElement={image} />

          <div class="absolute left-1/2 -translate-x-1/2 top-full w-px h-[0.5cm] border border-dashed border-secondary"></div>
            <div
              bind:this={handle}
              class="absolute left-1/2 -translate-x-1/2 top-full mt-[0.5cm]
                    w-6 h-6 bg-none rounded-full cursor-grab z-10
                    flex items-center justify-center"
              on:mousedown={rotationGrab}
            >
              <Maximize2 class="rotate-45 w-4 h-4 text-secondary" />
            </div>
          <div
              bind:this={handle}
              class="absolute left-1/2 -translate-x-1/2 top-full mt-[0.5cm]
                    w-6 h-6 border border-secondary rounded-full cursor-grab z-10"
              on:mousedown={rotationGrab}>
          </div>
      </div>
  </div>

  {#if isSelecting && hasMoved}
      <div
          class="absolute border-2 border-dashed border-red-500 bg-red-500/20 pointer-events-none"
          style="
              left: {selectionBox.x + imageOffsetX}px;
              top: {selectionBox.y + imageOffsetY}px;
              width: {selectionBox.width}px;
              height: {selectionBox.height}px;
          "
      ></div>
  {/if}

  {#if finalSelectionBox}
      <div
          class="absolute border-2 border-blue-500 pointer-events-none"
          style="
              left: {finalSelectionBox.x + imageOffsetX}px;
              top: {finalSelectionBox.y + imageOffsetY}px;
              width: {finalSelectionBox.width}px;
              height: {finalSelectionBox.height}px;
          "
      ></div>
  {/if}
</div>