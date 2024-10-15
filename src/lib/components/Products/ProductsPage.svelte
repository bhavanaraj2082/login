<script>
    import { onMount } from 'svelte';
    import { getProducts } from '$lib/server/actions.js';
    import { createEventDispatcher } from 'svelte';
  
    let products = [];
    const dispatch = createEventDispatcher();
  
    onMount(async () => {
      products = await getProducts();
    });
  
    function viewSubProducts(productId) {
      dispatch('viewSubProducts', { productId });
    }
  </script>
  
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-6">Products</h1>
    <div class="grid grid-cols-3 gap-6">
      {#each products as product}
        <div class="border rounded-lg p-4 bg-white shadow">
          <img src="/image-placeholder.png" alt={product.name} class="mb-4 h-32 w-full object-cover">
          <h2 class="text-2xl font-semibold mb-2">{product.name}</h2>
          <button
            on:click={() => viewSubProducts(product.id)}
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            View Sub-Products
          </button>
        </div>
      {/each}
    </div>
  </div>
  