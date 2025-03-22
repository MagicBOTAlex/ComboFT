<script lang="ts">
  // We'll reference our DOM elements:
  let square: HTMLDivElement;
  let handle: HTMLDivElement;

  let isDragging = false;
  let startAngle = 0;       
  let currentRotation = 0;  

  /**
   * Retrieves the current rotation (in radians) of the square from its CSS transform matrix.
   */
  function getCurrentRotation(): number {
    // If there's no transform applied yet, it's 0
    const transform = window.getComputedStyle(square).getPropertyValue('transform');
    if (transform === 'none') return 0;

    // Extract the matrix(...) values
    const matrixMatch = transform.match(/^matrix\((.+)\)$/);
    if (!matrixMatch) return 0;

    const values = matrixMatch[1].split(', ');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);

    // The rotation in radians is given by atan2(b, a)
    return Math.atan2(b, a);
  }

  /**
   * Called when the user presses the mouse button down on the circle handle.
   */
  function handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    isDragging = true;

    // Update the circle's cursor style
    handle.classList.remove('cursor-grab');
    handle.classList.add('cursor-grabbing');

    // Compute the center of the square
    const rect = square.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle from the square's center to the mouse pointer
    const mouseAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

    // Get the square's current rotation
    currentRotation = getCurrentRotation();

    // startAngle is the offset between the square's rotation and the mouse angle
    startAngle = currentRotation - mouseAngle;
  }

  /**
   * Called whenever the mouse moves anywhere in the window (while our component is loaded).
   */
  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;

    // Recompute the angle from the square’s center to the mouse
    const rect = square.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

    // Add offset, convert to degrees, update the square's rotation
    const newAngle = mouseAngle + startAngle;
    const degrees = newAngle * (180 / Math.PI);
    console.log(degrees);
    square.style.transform = `rotate(${degrees}deg)`;
  }

  /**
   * Called when the user releases the mouse button anywhere in the window.
   */
  function handleMouseUp() {
    isDragging = false;

    // Switch the handle's cursor style back
    handle.classList.remove('cursor-grabbing');
    handle.classList.add('cursor-grab');
  }
</script>

<!-- 
  Capture mousemove and mouseup globally using <svelte:window>. 
  This ensures we keep rotating even if the user drags outside the square.
-->
<svelte:window
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<!-- The square we want to rotate -->
<div class="w-full h-full grid place-items-center">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
  bind:this={square}
  class="relative w-40 h-40 bg-gray-700 transform origin-center overflow-visible"
>
    <!-- A thin line (2cm high) that starts at the bottom of the square -->
    <div
      class="absolute left-1/2 -translate-x-1/2 top-full w-px h-[2cm] bg-blue-500"
    ></div>

    <!-- The draggable circle handle, ~2cm below the square -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={handle}
      class="absolute left-1/2 -translate-x-1/2 top-full mt-[2cm]
            w-6 h-6 bg-blue-500 rounded-full cursor-grab z-10"
      on:mousedown={handleMouseDown}
    ></div>
  </div>
</div>