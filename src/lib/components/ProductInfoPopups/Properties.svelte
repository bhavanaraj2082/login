<script>
  export let data;
</script>

{#each data.records as product}
  {#if product.properties && Object.keys(product.properties).length > 0}
    <div class="md:w-11/12 max-w-7xl md:flex lg:flex mx-auto bg-white shadow-md rounded-md my-8">
      <div class="p-4 w-full">
        <div class="container mx-auto">
          <button type="button" class="w-full text-left pb-2">
            <h2 class="text-xl font-bold text-heading">Properties</h2>
          </button>
        </div>
        <div class="transition-all duration-300">
          <div class="container mx-auto">
            <div class="flex max-md:block gap-4">
              <div class="col-span-1 w-full">
                {#each Object.entries(product.properties) as [key, value]}
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:p-2 border-b border-gray-300">
                    <div>
                      <h3 class="sm:text-sm text-xs font-semibold">{key}</h3>
                    </div>
                    <div class="col-span-2">
                      <p class="sm:text-sm text-xs">{value}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
      {#if product.filteredProductData && Object.keys(product.filteredProductData).length > 0}
        <div class="p-4 max-md:w-full w-1/3">
          <div class="container mx-auto">
            <button type="button" class="w-full text-left pb-4">
              <h2 class="text-xl font-bold text-heading">About This Item</h2>
            </button>
          </div>
          <div class="transition-all duration-300">
            <div class="container mx-auto">
              <div class="flex max-md:block gap-4">
                <div class="col-span-1 w-full">
                  {#each Object.entries(product.filteredProductData).filter(([key, value]) => key !== "Synonym(S)") as [key, value]}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                      <div class="w-full">
                        <h3 class="text-sm font-medium break-words">{key}</h3>
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
        </div>
      {/if}
    </div>
  {/if}
{/each}
