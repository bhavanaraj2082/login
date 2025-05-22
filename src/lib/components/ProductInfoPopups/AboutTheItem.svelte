<script>
  export let data;
</script>

{#each data.records as product}
  {#if product.filteredProductData && Object.keys(product.filteredProductData).length > 0}
    <div class="border-t border-gray-300 mt-8"></div>
    <div class="w-full mt-3">
      <h3 class="text-base font-bold text-heading pb-1">About This Item</h3>
      <div class="transition-all duration-300">
        <div class="flex max-md:block gap-4">
          <div class="col-span-1 w-full">
            {#each Object.entries(product.filteredProductData).filter(([key]) => key !== "Synonym(s)" && key !== "CAS Number") as [key, value]}
              <div class="grid grid-cols-[130px_1fr] gap-x-2 py-0.5 w-full">
                <h4 class="text-sm font-medium text-gray-800 break-words">
                  {key}
                </h4>
                <p class="text-sm">{value}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
{/each}
