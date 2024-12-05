<script>
  export let data;

</script>

{#each data.records as product}
  {#if product.description && (
    (Array.isArray(product.description) && product.description.length > 0) || 
    (typeof product.description === 'object' && Object.keys(product.description).length > 0)
  )}
    <div class="max-w-full bg-white shadow-sm rounded-lg m-10 p-3" id="des">
      <h3 class="text-2xl font-bold text-primary-400">Description</h3>

      <!-- Check if description is an array -->
      {#if Array.isArray(product.description)}
        <!-- If it's an array, display as a bulleted list -->
        <ul class="list-disc pl-6">
          {#each product.description as item}
            <li class="text-gray-700 text-md mt-2">{item}</li>
          {/each}
        </ul>
      
      <!-- Else, assume description is an object -->
      {:else}
        <!-- If it's an object, display key-value pairs -->
        <ul>
          {#each Object.entries(product.description) as [key, value]}
            <li class="text-gray-700 text-md mt-2"><strong>{key}:</strong> {value}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
{/each}