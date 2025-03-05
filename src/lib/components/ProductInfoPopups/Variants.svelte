<script>
  export let record;
  // console.log("=-==>>",record)
  const allVariants = record.variants;
  const allManufacturer = record.manufacturer;

  // function getMinMaxPrices(pricing) {
  //   if (!pricing || !pricing.length) return { minPrice: 'N/A', maxPrice: 'N/A' };

  //   const prices = pricing.map(p => p.INR).filter(price => typeof price === 'number');
  //   if (!prices.length) return { minPrice: 'N/A', maxPrice: 'N/A' };

  //   return {
  //     minPrice: Math.min(...prices),
  //     maxPrice: Math.max(...prices)
  //   };
  // }

  function getMinMaxPrices(pricing) {
    if (!pricing) {
      console.warn("Warning: Pricing data is undefined or null!", pricing);
      return { minPrice: "--", maxPrice: "--" };
    }
    let prices = [];
    if (Array.isArray(pricing)) {
      // If pricing is an array, extract INR values
      prices = pricing
        .map((p) => p.INR)
        .filter((price) => typeof price === "number" && !isNaN(price));
    } else if (typeof pricing === "object" && pricing.INR !== undefined) {
      // If pricing is a single object, extract INR directly
      prices = [pricing.INR];
    }
    if (prices.length === 0) {
      console.warn("No valid INR prices found in pricing data!", pricing);
      return { minPrice: "--", maxPrice: "--" };
    }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    // console.log(`Min Price: ${minPrice}, Max Price: ${maxPrice}`);
    return { minPrice, maxPrice };
  }
</script>

<div id="productVariants"
  class="md:w-11/12 max-w-7xl bg-white mx-auto shadow-sm border border-gray-200 rounded-lg m-10"
>
  <h1 class="w-full text-left text-2xl text-primary-400 font-bold p-3">
    Products
  </h1>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-primary-50">
          <tr>
            <th scope="col" class="py-3 px-6">Image</th>
            <th scope="col" class="py-3 px-6">Product Number</th>
            <th scope="col" class="py-3 px-6">Manufacturer</th>
            <th scope="col" class="py-3 px-6">Price Range</th>
            <th scope="col" class="py-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          {#each allVariants as variant}
            {@const { minPrice, maxPrice } = getMinMaxPrices(variant.pricing)}
            <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer" 
            on:click={() => window.location.href = variant.productNumber}>
              <td class="py-4 px-6">
                <a
                  href={variant.productNumber}
                >
                <img
                  src={variant.imageSrc}
                  alt={variant.productNumber}
                  class="w-28 h-28 object-contain"
                /></a>
              </td>
              <td class="py-4 px-6 text-primary-400 font-medium cursor-pointer">
                {variant.productNumber}
              </td>
              <td class="py-4 px-6">{allManufacturer.name}</td>
              <td class="py-4 px-6">
                <span>
                  {#if minPrice === maxPrice}
                    <span class="font-semibold text-black"
                      >₹ {minPrice.toLocaleString()}</span
                    >
                  {:else}
                    <span class="font-semibold text-black">
                      ₹ {minPrice.toLocaleString()} - ₹ {maxPrice.toLocaleString()}
                    </span>
                  {/if}
                </span>
              </td>
              <td class="py-4 px-6 text-center sm:py-3 sm:px-4">
                <a
                  href={variant.productNumber}
                  class="bg-primary-400 text-white py-2 px-3 text-xs md:text-sm rounded hover:bg-primary-500 lg:text-sm block sm:inline-block"
                >
                  View Product
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- <main class="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Product Variants</h1>
    
    {#each data.records[0].variants as variant}
      <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-6">
        <h2 class="text-3xl font-semibold text-gray-900 mb-4">{variant.productName}</h2>
        
        <img src={variant.imageSrc} alt={variant.productName} class="w-48 h-32 mb-6 rounded-lg" />
        
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Description</h3>
        <ul class="list-disc pl-5 text-gray-700">
          {#each variant.description as desc}
            <li>{desc}</li>
          {/each}
        </ul>
        
        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Price</h3>
        <ul class="list-disc pl-5 text-gray-700">
          {#each variant.priceSize as price}
            <li>{price.size}: <span class="font-medium text-gray-900">{price.price}</span></li>
          {/each}
        </ul>
        
        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Properties</h3>
        <ul class="text-gray-700 space-y-2">
          {#each Object.entries(variant.properties) as [key, value]}
            <li><span class="font-medium text-gray-900">{key}</span>: {value}</li>
          {/each}
        </ul>
        
        <div class="mt-6 text-gray-700">
          <p><strong class="font-medium text-gray-900">Manufacturer:</strong> {variant.manufacturerName}</p>
          <p><strong class="font-medium text-gray-900">Category:</strong> {variant.category}</p>
          <p><strong class="font-medium text-gray-900">Currency:</strong> {variant.currency}</p>
        </div>
      </div>
    {/each}
</main> -->

<!-- <div aria-label="Tabs" class="w-full flex space-x-0 overflow-x-auto rounded-t">
  <div class="inline-block w-full">
    <button
      class="w-full py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300 bg-white text-primary-500 font-bold hover:bg-white hover:text-primary-500 whitespace-nowrap"
    >
      Products
    </button>
    <div
      class="h-0.5 bg-primary-300 w-full transition-all duration-300 ease-in-out"
    ></div>
  </div>

  <div class="inline-block w-full">
    <button
      class="w-full py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300 bg-primary-100 text-black hover:bg-white hover:text-primary-500 whitespace-nowrap"
    >
      Specifications
    </button>
    <div
      class="h-0.5 bg-primary-300 w-0 transition-all duration-300 ease-in-out"
    ></div>
  </div>

  <div class="inline-block w-full">
    <div  class="w-full py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300 bg-primary-100 text-black hover:bg-white hover:text-primary-500 whitespace-nowrap block text-center">
    <a
      href="#des"
    >
      Description
    </a>
  </div>
    <div class="h-0.5 bg-primary-300 w-0 transition-all duration-300 ease-in-out"></div>
  </div>
  
</div> -->

<!-- <div class="max-w-full bg-white shadow-sm rounded-lg m-7 !mt-0 p-3">
    <h3 class="text-2xl font-bold text-primary-400" data-svelte-h="svelte-2y5xqz">
      Description
    </h3>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">0</h2>
      <p class="text-gray-700 text-sm">
        Description Invitrogen Molecular biology grade, 5 M Ammonium Acetate solution is supplied in one bottle containing 100 mL
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">1</h2>
      <p class="text-gray-700 text-sm">
        The solution is certified RNase-free, economical, and ready-to-use
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">2</h2>
      <p class="text-gray-700 text-sm">
        Due to the ubiquitous presence of RNases, manufacturing products for use with RNA is especially challenging
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">3</h2>
      <p class="text-gray-700 text-sm">
        Invitrogen's nuclease-free reagents and buffers are manufactured in facilities specifically designed to prevent the introduction of nucleases
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">4</h2>
      <p class="text-gray-700 text-sm">
        Highly sensitive RNase assays are performed at several different stages of the manufacturing process to ensure the highest quality
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">5</h2>
      <p class="text-gray-700 text-sm">
        These reagents are rigorously tested for contaminating nonspecific endonuclease, exonuclease, and RNase activity
      </p>
    </div>
  
    <div class="">
      <h2 class="text-lg font-semibold mt-2">6</h2>
      <p class="text-gray-700 text-sm">
        Order Info Shipping Condition: Room temperature
      </p>
    </div>
</div> -->

<!-- <div class="max-w-full shadow-sm rounded-lg m-7 !mt-0 p-4">
  <h3 class="text-2xl font-bold text-primary-400" data-svelte-h="svelte-2y5xqz">
    Specifications
  </h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div class=" p-3 rounded-lg">
      <table class="table-auto w-full">
        <tbody class="">
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Speed Range</td
            >
            <td class="text-sm text-gray-700 p-3">5 to 80 rpm</td>
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Holds</td
            >
            <td class="text-sm text-gray-700 p-3"
              >Tubes, Culture Tubes with Drum Carousel</td
            >
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Product Type</td
            >
            <td class="text-sm text-gray-700 p-3">Tube Carousel</td>
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Warranty and Service Offering</td
            >
            <td class="text-sm text-gray-700 p-3">2 Years</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="p-3 rounded-lg">
      <table class="table-auto w-full">
        <tbody class="">
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Speed Range</td
            >
            <td class="text-sm text-gray-700 p-3">5 to 80 rpm</td>
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Holds</td
            >
            <td class="text-sm text-gray-700 p-3"
              >Tubes, Culture Tubes with Drum Carousel</td
            >
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Product Type</td
            >
            <td class="text-sm text-gray-700 p-3">Tube Carousel</td>
          </tr>
          <tr class="border border-gray-400">
            <td class="text-sm bg-gray-200 p-3 text-gray-700 font-medium"
              >Warranty and Service Offering</td
            >
            <td class="text-sm text-gray-700 p-3">2 Years</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div> -->
