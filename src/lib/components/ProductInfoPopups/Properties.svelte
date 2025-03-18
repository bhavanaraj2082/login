<script>
  export let data;
</script>

{#each data.records as product}
  {#if product.properties && Object.keys(product.properties).length > 0}
    <div
      class="md:w-11/12 max-w-7xl lg:flex mx-auto bg-white shadow rounded my-8"
    >
      <div class="p-4 w-full">
        <button type="button" class="w-full text-left pb-2">
          <h2 class="text-xl font-bold text-heading">Properties</h2>
        </button>
        <div class="transition-all duration-300">
          <div class="flex max-md:block gap-4">
            <div class="col-span-1 w-full">
              {#each Object.entries(product.properties) as [key, value]}
                <div
                  class="grid grid-cols-1 sm:grid-cols-3 sm:p-2 border-b border-gray-300"
                >
                  <div>
                    <h3 class="sm:text-sm text-sm break-words max-sm:pt-1 font-semibold">
                      {key}
                    </h3>
                  </div>
                  <div class="col-span-2">
                    <p class="sm:text-sm text-xs break-words max-sm:py-1">{value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      {#if product.filteredProductData && Object.keys(product.filteredProductData).length > 0}
        <div class="p-4 w-full lg:w-2/5">
          <button type="button" class="w-full text-left pb-2">
            <h2 class="text-xl font-bold text-heading">About This Item</h2>
          </button>
          <div class="transition-all duration-300">
            <div class="flex max-md:block gap-4">
              <div class="col-span-1 w-full">
                {#each Object.entries(product.filteredProductData).filter(([key, value]) => key !== "Synonym(S)") as [key, value]}
                  <div class="grid grid-cols-1 sm:grid-cols-2 p-1">
                    <div class="w-full">
                      <h3 class="text-sm font-semibold break-words">{key}</h3>
                    </div>
                    <div class="w-full">
                      <p class="text-sm break-words">{value}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
{/each}
