<script>
  export let data;
  import Icon from "@iconify/svelte";
  let currentIndex = 0; 
  const totalSlides = data.records.length; 
  let scrollContainer; 
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    scrollContainer.scrollLeft -= scrollContainer.offsetWidth; 
  }
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    scrollContainer.scrollLeft += scrollContainer.offsetWidth; 
  }
  let showDifference = false;
  function getUniqueValues(property) {
    const uniqueValues = new Set();
    data.records.forEach((product) => {
      product.relatedProducts.forEach((relatedProduct) => {
        const value = relatedProduct.properties && relatedProduct.properties[property];
        if (value && value !== '-') {
          uniqueValues.add(value);
        }
      });
    });
    return uniqueValues;
  }
  function isUnique(value, property) {
    if (!value || value === '-') return false; 
    let count = 0;
    data.records.forEach((product) => {
      product.relatedProducts.forEach((relatedProduct) => {
        const propValue = relatedProduct.properties && relatedProduct.properties[property];
        if (propValue === value) {
          count++;
        }
      });
    });
    return count === 1; 
  }
  function toggleDifference(event) {
    showDifference = event.target.checked;
  }
  let uniqueValuesMap = {};
  const properties = [
    'pH',
    'Purity',
    'Concentration',
    'Form',
    'Packaging Type',
    'Product Line',
    'Ligand Type',
  ];
  properties.forEach((property) => {
    uniqueValuesMap[property] = getUniqueValues(property);
  });
</script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet" />
<style>
  .scroll-container {
    scroll-behavior: smooth;
  }
</style>
<div class="mx-0 lg:mx-10 mb-10">
  <div class="flex justify-between items-center mb-4">
    <div class="font-bold text-primary-500 ml-9 lg:ml-0">Compare Similar Items</div>
    <div class="flex items-center space-x-2 mr-9 lg:mr-0">
      <div class="font-bold text-primary-500">Show Difference</div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          id="toggleDifference"
          checked={showDifference}
          on:change={toggleDifference}
        />
        <div class="w-10 h-5 border-2 border-primary-500 rounded-full peer-checked:bg-primary-500 transition-colors duration-300"></div>
        <div
          class="dot absolute left-1 top-1 bg-primary-500 w-3 h-3 rounded-full transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-white"
        ></div>
      </label>
    </div>
  </div>
  <div
    class="relative mt-1 overflow-x-auto scroll-container"
    bind:this={scrollContainer}
  >
    <div class="flex space-x-4">
      {#each data.records as product}
        {#each product.relatedProducts as relatedProduct}
          <div class="rounded-lg shadow-sm bg-white flex-shrink-0 w-[283px]">
            <ul>
              {#each properties as property}
                <li
                  class={`flex justify-between items-center mb-2 ${
                    showDifference &&
                    relatedProduct.properties &&
                    relatedProduct.properties[property] &&
                    relatedProduct.properties[property] !== '-' &&
                    isUnique(relatedProduct.properties[property], property)
                      ? 'bg-primary-200'
                      : 'bg-white'
                  }`}
                >
                  <span class="font-semibold text-sm text-black">{property}:</span>
                  <span class="text-sm text-black">
                    {relatedProduct.properties && relatedProduct.properties[property]
                      ? relatedProduct.properties[property]
                      : "-"}
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {/each}
    </div>
  </div>
  <div class="flex justify-between mb-2 lg:hidden mx-10">
    <button on:click={prevSlide} class="text-primary-500">
      <Icon class="text-3xl" icon="ion:chevron-back" />
    </button>
    <button on:click={nextSlide} class="text-primary-500">
      <Icon class="text-4xl" icon="ion:chevron-forward" />
    </button>
  </div>
</div>