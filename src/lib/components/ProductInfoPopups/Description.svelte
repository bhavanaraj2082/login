<script>
  export let data;
</script>

{#each data.records as product}
  {#if product.description && ((Array.isArray(product.description) && product.description.length > 0) || (typeof product.description === "object" && Object.keys(product.description).length > 0))}
    <div
      class="md:w-11/12 max-w-7xl p-4 mx-auto text-justify bg-white shadow-md border border-gray-200 rounded-md m-10"
      id="des">
      <h3 class="text-xl font-bold text-heading mb-3">Description</h3>

      <!-- Check if description is an array -->
      {#if Array.isArray(product.description)}
        <!-- If it's an array, display as a bulleted list -->
        <ul class="list-disc pl-6">
          {#each product.description as item}
            <li class="text-gray-700 text-sm mt-2">{item}</li>
          {/each}
        </ul>

        <!-- Else, assume description is an object -->
      {:else}
        <!-- If it's an object, display key-value pairs -->
        <ul>
          {#each Object.entries(product.description) as [key, value]}
            <li class="text-gray-700 text-sm mt-2">
              <strong class="text-sm font-bold">{key}:</strong>
              {value}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
{/each}
