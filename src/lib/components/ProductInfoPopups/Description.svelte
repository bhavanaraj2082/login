<script>
    export let data;
    let product = data.records;
</script>

{#each data.records as product}
{#if product.description && Object.keys(product.description).length > 0}
<div class="max-w-full bg-white shadow-sm rounded-lg m-7 !mt-0 p-5">
        <h3 class="text-2xl font-bold text-primary-400">Description</h3>
        {#each Object.entries(product.description) as [key, value]}
    <div class="">
            <h2 class="text-lg font-semibold mt-2">{key}</h2>
            <p class="text-gray-700 text-sm">
                {value}
            </p>
    </div>
    {/each}
  </div>
  {/if}
  {/each}

  <!-- {#each data.records as product}
  {#if product.filteredProductData && Object.keys(product.filteredProductData).length > 0}
  <div class="max-w-full bg-white shadow-sm rounded-lg m-7 !mt-0 p-5">
          <h3 class="text-2xl font-bold text-primary-400">Chemical Properties</h3>
          {#each Object.entries(product.filteredProductData) as [key, value]}
      <div class="">
              <h2 class="text-lg font-semibold mt-2">{key}</h2>
              <p class="text-gray-700 text-sm">
                  {value}
              </p>
      </div>
      {/each}
    </div>
    {/if}
    {/each} -->