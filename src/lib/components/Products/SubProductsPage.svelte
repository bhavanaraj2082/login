<script>
    import { onMount } from 'svelte';
    import { getSubProducts } from '$lib/server/actions.js';
    import { createEventDispatcher } from 'svelte';
  
    export let productId;
    let subProducts = [];
    const dispatch = createEventDispatcher();
  
    onMount(async () => {
      subProducts = await getSubProducts(productId);
    });
  
    function viewProductInfo(subProductId) {
      dispatch('viewProductInfo', { productId, subProductId });
    }
  </script>
  
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-6">Sub-Products</h1>
    <div class="grid grid-cols-3 gap-6">
      {#each subProducts as subProduct}
        <div class="border rounded-lg p-4 bg-white shadow">
          <img src="/image-placeholder.png" alt={subProduct.name} class="mb-4 h-32 w-full object-cover">
          <h2 class="text-2xl font-semibold mb-2">{subProduct.name}</h2>
          <button
            on:click={() => viewProductInfo(subProduct.id)}
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            View Product Info
          </button>
        </div>
      {/each}
    </div>
  </div>
  