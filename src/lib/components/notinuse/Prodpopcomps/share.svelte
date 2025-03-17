<script>
    export let data;
    let product = data.records;
    console.log("showDetailsPopup",data);
    export let ShareclosePopup;
</script>



{#each data.records as product}
<div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
  <div class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4">
    <button
      on:click={ShareclosePopup}
      class="absolute top-3 right-3 text-primary-400"
    >
      <i class="fa-solid fa-xmark text-lg"></i>
    </button>

    <h2 class="text-sm font-semibold text-gray-600 mb-3">
      Share Product
    </h2>

    <div class="flex items-start space-x-4">
      <div class="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={product.imageSrc}
          alt="Product Image"
          class="w-full h-full object-cover"
        />
      </div>

      <div>
        <p class="text-lg font-semibold text-gray-800">
          {product.productNumber}
        </p>
        <p class="text-sm text-gray-600">{product.productName}</p>
      </div>
    </div>

    <div class="mt-4">
      <p
        class="text-sm md:text-base font-semibold text-gray-800 mb-1"
      >
        Direct Link
      </p>
      <div class="relative flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center">
        {#if showToast}
          <div class="absolute -top-8 transform -translate-x-1/2 left-1/2 bg-gray-800 text-white py-1 px-3 rounded text-xs sm:text-sm">
            Copied!
          </div>
        {/if}
      
        <input
          type="text"
          readonly
          bind:value={productURL}
          class="text-xs sm:text-sm md:text-base border border-primary-400 p-2 rounded-lg text-gray-600 outline-none flex-grow w-full"
        />
      
        <button
          on:click={copyToClipboard}
          class="text-primary-400 text-xs sm:text-sm md:text-base font-semibold border p-2 border-primary-400 rounded-lg flex items-center justify-center space-x-1 w-full sm:w-auto"
        >
          <i class="fa-regular fa-copy"></i>
          <span>Copy</span>
        </button>
      </div>
      
    </div>
  </div>
</div>
{/each}