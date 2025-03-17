<script>
    export let data;
    let product = data.records;
    console.log("showDetailsPopup",data);
    export let closePopup;
</script>

{#each data.records as product}
<div class="fixed inset-0 flex items-center justify-center z-50">
<div
  class="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-white rounded-md shadow-md max-h-[90vh] overflow-y-auto"
>
  <div class="">
    <div class="mt-4 flex justify-between items-center">
      <h2
        class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold uppercase"
      >
        Complete Details
      </h2>
      <button
        on:click={closePopup}
        class="text-primary-400 py-2 px-4 rounded-md"
      >
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>

    <div
      class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start"
    >
      <div class="flex-shrink-0">
        <img
          src={product.imageSrc}
          alt="Product Image"
          class="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
        />
      </div>

      <div class="space-y-2 md:space-y-3 lg:space-y-4">
        <h1
          class="lg:text-xl sm:text-xs font-bold text-primary-400 !mt-0"
        >
          {product.productNumber}
        </h1>
        <h2
          class="lg:text-xl sm:text-xs font-semibold text-gray-800 !mt-0"
        >
          {product.productName}
        </h2>
        <p class="lg:text-base sm:text-xs text-gray-600 !mt-0">
          {product.prodDesc}
        </p>
      </div>
    </div>

    <div
      class="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
    >
      {#each data.records as product}
        <div class="border border-gray-200 p-4 rounded-lg">
          <h3
            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
          >
            Properties
          </h3>
          {#each Object.entries(product.properties) as [key, value]}
            <p
              class="text-xs md:text-sm lg:text-sm text-gray-600"
            >
              <strong>{key}:</strong>
              {value}
            </p>
          {/each}
        </div>
      {/each}

      {#each data.records as product}
        <div class="border border-gray-200 p-4 rounded-lg">
          <h3
            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
          >
            Description
          </h3>
          {#each Object.entries(product.description) as [key, value]}
            <p
              class="text-xs md:text-sm lg:text-sm text-gray-600"
            >
              <strong>{key}:</strong>
              {value}
            </p>
          {/each}
        </div>
      {/each}

      {#each data.records as product}
        <div class="border border-gray-200 p-4 rounded-lg">
          <h3
            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
          >
            Usage and Safety
          </h3>
          {#each Object.entries(product.safetyInfo) as [key, value]}
            <p
              class="text-xs md:text-sm lg:text-sm text-gray-600"
            >
              <strong>{key}:</strong>
              {value}
            </p>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
</div>

<div class="fixed inset-0 bg-black opacity-50 z-40"></div>
{/each}