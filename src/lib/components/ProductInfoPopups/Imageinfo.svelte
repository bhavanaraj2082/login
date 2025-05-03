<script>
  import Icon from "@iconify/svelte";
  import { PUBLIC_IMAGE_URL } from "$env/static/public";
  export let data;
  let product = data.records;
  export let ImageclosePopup;
  let isZoomed = false;
  let offsetX = 50;
  let offsetY = 50;
  let container = null;

  function toggleZoom(event) {
    isZoomed = !isZoomed;
    if (isZoomed) {
      updateZoomPosition(event);
    }
  }

  function updateZoomPosition(event) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    offsetX = x;
    offsetY = y;
  }
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
    on:click={ImageclosePopup}
  >
    <div
      class="w-[50vw] h-[90vh] bg-white rounded-md shadow-md p-4 relative overflow-hidden"
      on:click|stopPropagation
    >
      <div class="flex justify-end">
        <button
          on:click={ImageclosePopup}
          class="hover:bg-red-100 text-white rounded font-bold transition-colors duration-300"
        >
          <Icon
            icon="mdi:close"
            class="text-2xl font-bold text-red-600 border rounded hover:p-px"
          />
        </button>
      </div>

      <div class="flex justify-center items-center w-full h-full">
        <div
          class="relative w-full h-full cursor-pointer"
          bind:this={container}
          on:mousemove={updateZoomPosition}
          on:click={toggleZoom}
        >
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img
            src="{PUBLIC_IMAGE_URL}/{product?.imageSrc}"
            alt="Product Image"
            class="w-full h-full pb-6 object-contain transition-transform duration-300"
            class:cursor-zoom-in={!isZoomed}
            class:cursor-zoom-out={isZoomed}
            style="transform: scale({isZoomed ? 2 : 1}); transform-origin: {offsetX}% {offsetY}%;"
            onerror="this.src='/fallback.jpg'"
          />
        </div>
      </div>
    </div>
  </div>
{/each}
