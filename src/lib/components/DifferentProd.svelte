<script>
  import { onMount } from 'svelte';

  export let data;
  let qualityLevels = {};
  let formCounts = {};
  let phCounts = {};
  let priceCounts = {};
  let biologicalSourceCounts = {};
  let currentIndex = 0;
  let logosPerSlide = 4;
  let totalSlides = Math.ceil((data && data.records ? data.records.length : 0) / logosPerSlide);

  let showDifference = false; // Default to unchecked

  function calculateQualityLevels() {
    qualityLevels = {};
    formCounts = {};
    phCounts = {};
    priceCounts = {};
    biologicalSourceCounts = {};
    if (data && data.records) {
      data.records.forEach(record => {
        const level = record.qualityLevel;
        const form = record.form;
        const ph = record.ph;
        const price = record.priceSize[0].price;
        const biologicalSource = record.BiologicalSource;
        if (level) qualityLevels[level] = (qualityLevels[level] || 0) + 1;
        if (form) formCounts[form] = (formCounts[form] || 0) + 1;
        if (ph) phCounts[ph] = (phCounts[ph] || 0) + 1;
        if (price) priceCounts[price] = (priceCounts[price] || 0) + 1;
        if (biologicalSource) biologicalSourceCounts[biologicalSource] = (biologicalSourceCounts[biologicalSource] || 0) + 1;
      });
    }
  }

  function toggleDifference() {
    showDifference = !showDifference;
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
  }

  function updateLogosPerSlide() {
    if (window.innerWidth < 640) logosPerSlide = 1;
    else if (window.innerWidth < 768) logosPerSlide = 2;
    else if (window.innerWidth < 1024) logosPerSlide = 3;
    else logosPerSlide = 4;
    totalSlides = Math.ceil((data && data.records ? data.records.length : 0) / logosPerSlide);
    currentIndex = Math.min(currentIndex, totalSlides - 1);
  }

  function truncateName(name, maxLength = 50) {
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  }

  onMount(() => {
    showDifference = false; // Reset toggle state on mount
    calculateQualityLevels();
    updateLogosPerSlide();
    window.addEventListener('resize', updateLogosPerSlide);
    return () => window.removeEventListener('resize', updateLogosPerSlide);
  });
</script>

<div class="container mx-auto max-w-screen-lg bg-white mt-10">
  <div class="flex justify-between items-center mb-4">
    <div class="text-md font-semibold">Compare Similar Items</div>
    <div class="flex items-center space-x-2">
      <div class="text-md font-semibold">Show Difference</div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          id="toggleDifference"
          checked={showDifference}
          on:change={toggleDifference}
        />
        <div class="w-10 h-5 border-2 border-primary-500 rounded-full peer-checked:bg-primary-500 transition-colors duration-300"></div>
        <div class="dot absolute left-1 top-1 bg-primary-500 w-3 h-3 rounded-full transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-white"></div>
      </label>
    </div>
  </div>
  <div class="relative mt-1">
    <div class="flex items-center">
      <button on:click={prevSlide} class="text-primary-500 rounded-full p-2 transition">‹‹</button>
      <div class="overflow-x-auto flex-1 scrollbar-hide">
        <div
          class="flex transition-transform duration-300"
          style={`transform: translateX(-${(currentIndex * 100) / logosPerSlide}%)`}
        >
          {#if data && data.records}
            {#each data.records as { productNumber, productName, imageSrc, qualityLevel, form, ph, priceSize, BiologicalSource }}
              <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
                <div class="flex flex-col w-full">
                  <div class="flex items-center p-2">
                    <img src={imageSrc} alt={productName} class="w-20 h-20 object-cover ml-1 rounded" />
                    <div class="ml-2 text-left flex-1">
                      <p class="font-semibold text-xs w-full md:w-auto">{productNumber}</p>
                      <p class="text-gray-800 mr-1 py-2 text-xs font-semibold w-full md:w-auto">{truncateName(productName, 50)}</p>
                    </div>
                  </div>
                  <button 
                    class="w-11/12 max-w-xs text-orange-500 ml-3 py-2 rounded border border-orange-500 hover:bg-orange-500 hover:text-white transition p-2 mb-4"
                  >
                    View Price & Availability
                  </button>
                  <div class={`flex justify-between items-center w-full mt-5 ${showDifference && qualityLevels[qualityLevel] === 1 ? 'bg-blue-100' : 'bg-white'}`}>
                    <span class="font-semibold text-xs ml-3 mb-1">Quality Level:</span>
                    <p class="font-normal text-xs mr-3 mb-1">{qualityLevel}</p>
                  </div>
                  <hr class="border-t-2 mr-3 ml-3">
                  <div class={`flex justify-between items-center w-full mt-5 ${showDifference && formCounts[form] === 1 ? 'bg-blue-100' : 'bg-white'}`}>
                    <span class="font-semibold text-xs ml-3 mb-1">Form:</span>
                    <p class="font-normal text-xs mr-3 mb-1">{form}</p>
                  </div>  
                  <hr class="border-t-2 mr-3 ml-3">
                  <div class={`flex justify-between items-center w-full mt-5 ${showDifference && phCounts[ph] === 1 ? 'bg-blue-100' : 'bg-white'}`}>
                    <span class="font-semibold text-xs ml-3 mb-1">PH:</span>
                    <p class="font-normal text-xs mr-3 mb-1">{ph}</p>
                  </div>
                  <hr class="border-t-2 mr-3 ml-3">
                  <div class={`flex justify-between items-center w-full mt-5 ${showDifference && priceCounts[priceSize[0].price] === 1 ? 'bg-blue-100' : 'bg-white'}`}>
                    <span class="font-semibold text-xs ml-3 mb-1">Price:</span>
                    <p class="font-normal text-xs mr-3 mb-1">{priceSize[0].price}</p>
                  </div>
                  <hr class="border-t-2 mr-3 ml-3">
                  <div class={`flex justify-between items-center w-full mt-5 ${showDifference && biologicalSourceCounts[BiologicalSource] > 1 ? 'bg-blue-100' : 'bg-white'}`}>
                    <span class="font-semibold text-xs ml-3 mb-1">Biological Source:</span>
                    <p class="font-normal text-xs mr-3 mb-1">{BiologicalSource}</p>
                  </div> 
                  <hr class="border-t-2 mr-3 ml-3 mb-10">
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <button on:click={nextSlide} class="text-primary-500 rounded-full p-2 transition">››</button>
    </div>
  </div>
</div>