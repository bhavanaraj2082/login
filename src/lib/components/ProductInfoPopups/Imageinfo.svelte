<script>
  import Icon from "@iconify/svelte";
  export let data;
  let product = data.records;
  // console.log("ImageclosePopup",data);
  export let ImageclosePopup;
  let isZoomed = false;

  function toggleZoom() {
    isZoomed = !isZoomed;
  }
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-neutral-500 bg-opacity-30"
    on:click={ImageclosePopup}
  >
    <div
      class="w-full md:max-w-lg bg-white rounded-md shadow-md p-4 relative"
      on:click|stopPropagation
    >
      <div class="flex justify-end">
        <button
          on:click={ImageclosePopup}
          class="text-primary-400 p-2 rounded-md"
        >
          <Icon
            icon="mdi:close"
            class="text-2xl font-bold text-primary-400 hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
          />
        </button>
      </div>

      <div class="flex justify-center items-center">
        <div class="w-full h-96 overflow-hidden" on:click={toggleZoom}>
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img
            src={product.imageSrc}
            alt="Product Image"
            class="w-full h-96 rounded-md transition-transform duration-300"
            class:scale-150={isZoomed}
            class:cursor-zoom-in={!isZoomed}
            class:cursor-zoom-out={isZoomed}
          />
        </div>
      </div>
    </div>
  </div>
{/each}
