<script>
  import { createEventDispatcher } from 'svelte';
  let selectedProduct = null;
  const dispatch = createEventDispatcher();

  // Handle clicking on a product (mock functionality)
  function handleProductClick(product) {
      selectedProduct = product;
  }

  // Dispatch form submission (UI-only for Storybook)
  function submitForm(product) {
      console.log('Submitting product:', product);
  }
</script>

<!-- UI for product list -->
{#if !selectedProduct}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      <!-- Example Products (Replace with actual rendering logic in the app, but not in Storybook) -->
      <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'TRC', description: 'Explore our vast range of research tools and analytical standards.' })}>
        <img src="/trc-image.jpg" alt="TRC Banner" class="w-28 h-28 ml-10 m-4">
          <h2 class="text-xl font-semibold mb-2">TRC</h2>
          <p class="text-gray-600">Explore our vast range of research tools and analytical standards.</p>
          <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Shop Now</button>
      </div>

      <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'Mikromol', description: 'More than 5,000 reference standards for pharmaceutical quality control.' })}>
        <img src="/mikromol-image.jpg" alt="Mikromol Banner" class="w-28 h-28 ml-10 m-4">
          <h2 class="text-xl font-semibold mb-2">Mikromol</h2>
          <p class="text-gray-600">More than 5,000 reference standards for pharmaceutical quality control.</p>
          <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Shop Now</button>
      </div>

      <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'Dr. Ehrenstorfer', description: 'Supporting your needs for high quality reference materials for food and environmental analysis.' })}>
        <img src="/ehrenstorfer-image.jpg" alt="ehrenstorfer Banner" class="w-28 h-28 ml-10 m-4">
          <h2 class="text-xl font-semibold mb-2">Dr. Ehrenstorfer</h2>
          <p class="text-gray-600">Supporting your needs for high quality reference materials for food and environmental analysis.</p>
          <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Shop Now</button>
      </div>

      <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'AXIO Proficiency Testing', description: 'Buy proficiency testing quickly and easily on our webshop.' })}>
        <img src="/axio-image.jpg" alt="AXIO Banner" class="w-28 h-28 ml-10 m-4">
        <h2 class="text-xl font-semibold mb-2">AXIO Proficiency Testing</h2>
        <p class="text-gray-600">Buy proficiency testing quickly and easily on our webshop.</p>
        <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Shop Now</button>
    </div>

    <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'LGC Industrial', description: 'Bringing together VHG, ARMI|MBH, and Paragon Scientific to deliver The Material Difference.' })}>
      <img src="/lgc-image.jpg" alt="LGC Banner" class="w-28 h-28 ml-10 m-4">
      <h2 class="text-xl font-semibold mb-2">LGC Industrial</h2>
      <p class="text-gray-600">Bringing together VHG, ARMI|MBH, and Paragon Scientific to deliver The Material Difference</p>
      <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Shop Now</button>
  </div>

  <div class="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition duration-300 hover:shadow-xl" on:click={() => handleProductClick({ name: 'Custom Requests', description: 'Need something specific? Use our new custom solution request form.' })}>
    <img src="/custom-requests-image.jpg" alt="Custom Requests Banner" class="w-28 h-28 ml-10 m-4">
    <h2 class="text-xl font-semibold mb-2">Custom Requests</h2>
    <p class="text-gray-600">Need something specific? Use our new custom solution request form.</p>
    <button class="mt-4 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded">Enquire Now</button>
</div>
      
  </div>
{:else}
  <!-- UI for selected product details -->
  <div class="max-w-2xl mx-auto p-6 bg-gray-100 rounded shadow-lg">
    
      <h1 class="text-3xl font-bold mb-4">{selectedProduct.name}</h1>
      <p class="text-gray-700 mb-6">{selectedProduct.description}</p>
      
      <!-- Form for submitting product (only UI for Storybook testing) -->
      <form on:submit|preventDefault={() => submitForm(selectedProduct)}>
      </form>
      
      <button class="mt-6 bg-primary-400 hover:bg-primary-400 text-white py-2 px-4 rounded" on:click={() => selectedProduct = null}>Back to Products</button>
  </div>
{/if}


