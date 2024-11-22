<script>
  export let data;
  let product = data.records;
  // console.log("showDetailsPopup",data);
</script>

{#each data.records as product}
{#if product.properties && Object.keys(product.properties).length > 0}
<div class="max-w-full md:flex lg:flex bg-white shadow-sm rounded-lg m-10">
<div class="p-8 w-full">
  <div class="container mx-auto">
    <button type="button" class="w-full text-left pb-4">
      <h2 class="text-2xl font-bold text-primary-400">Properties</h2>
    </button>
  </div>
  <div class="transition-all duration-300">
    <div>
      <div>
        <div class="container mx-auto">
          <div class="flex max-md:block gap-4">
            <div class="col-span-1 w-3/4">
              <!-- Property List -->
              {#each Object.entries(product.properties) as [key, value]}
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-1 border-b border-gray-300">
                <div><h3 class="text-base font-semibold">{key}</h3></div>
                <div class="col-span-2">
                  <p class="text-sm">{value}</p>
                </div>
              </div>
              {/each}
            </div>
            
            <div class="col-span-1 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-md:mt-5 ml-5">
              <h2 class="text-primary-400 font-semibold text-lg">About This Item</h2>
              <!-- Property List -->
              {#each Object.entries(product.filteredProductData).filter(([key, value]) => key !== "Synonym(S)") as [key, value]}                
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                <div class="w-full"><h3 class="text-sm font-medium break-words">{key}</h3></div>
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
  </div>
</div>
</div>
{/if}
{/each}