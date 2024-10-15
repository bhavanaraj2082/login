<script>
    import { onMount } from 'svelte';
    import { getProductInfo } from '$lib/server/actions.js';
  
    export let productId;
    export let subProductId;
    let productInfo = { name: '', description: '' };
  
    onMount(async () => {
      productInfo = await getProductInfo(productId, subProductId);
    });
  </script>
  
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-6">{productInfo.name}</h1>
    <div class="flex">
      <img src="/image-placeholder.png" alt={productInfo.name} class="h-64 w-64 mr-6 object-cover">
      <div>
        <p class="text-lg">{productInfo.description}</p>
      </div>
    </div>
  </div>
  