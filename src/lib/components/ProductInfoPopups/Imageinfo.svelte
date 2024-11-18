<script>
    export let data;
    let product = data.records;
    console.log("ImageclosePopup",data);
    export let ImageclosePopup;
</script>



{#each data.records as product}
<div
  class="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 lg:p-8 overflow-y-auto bg-neutral-500 bg-opacity-30"
>
  <div
    class="max-w-full md:max-w-2xl lg:max-w-4xl w-full bg-white rounded-md shadow-md p-4 md:p-6 lg:p-8"
  >
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-sm md:text-base lg:text-xl font-semibold text-primary-400 uppercase"
      >
        Product Image
      </h2>
      <button
        on:click={ImageclosePopup}
        class="text-primary-400 p-2 rounded-md"
      >
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>

    <div
      class="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start"
    >
      <div class="w-full md:w-3/4 lg:w-1/3 h-auto">
        <img
          src={product.imageSrc}
          alt="Product Image"
          class="w-full h-auto object-cover rounded-md"
        />
      </div>

      <div
        class="space-y-2 md:space-y-3 lg:space-y-4 w-full lg:w-2/3"
      >
        <h2
          class="text-sm md:text-base lg:text-xl font-semibold text-gray-800"
        >
          {product.productName}
        </h2>
        <p class="text-xs md:text-sm lg:text-base text-gray-600">
          {product.prodDesc}
        </p>
      </div>
    </div>
  </div>
</div>
{/each}