<script>
  import { currencyState } from "$lib/stores/mainStores.js"; 

  export let record;
  const allVariants = record.variants;
  const allManufacturer = record.manufacturer;
  function getMinMaxPrices(pricing) {
    if (!pricing) {
      // console.warn("Warning: Pricing data is undefined or null!", pricing);
      return { minPriceINR: "--", maxPriceINR: "--", minPriceUSD: "--", maxPriceUSD: "--" };
    }

    let pricesINR = [];
    let pricesUSD = [];

    if (Array.isArray(pricing)) {
      pricing.forEach((p) => {
        if (typeof p.INR === "string") p.INR = parseFloat(p.INR); 
        if (typeof p.USD === "string") p.USD = parseFloat(p.USD); 

        if (typeof p.INR === "number" && !isNaN(p.INR)) pricesINR.push(p.INR);
        if (typeof p.USD === "number" && !isNaN(p.USD)) pricesUSD.push(p.USD);
      });
    } else if (typeof pricing === "object") {
      if (typeof pricing.INR === "string") pricing.INR = parseFloat(pricing.INR); 
      if (typeof pricing.USD === "string") pricing.USD = parseFloat(pricing.USD); 

      if (typeof pricing.INR === "number" && !isNaN(pricing.INR)) pricesINR.push(pricing.INR);
      if (typeof pricing.USD === "number" && !isNaN(pricing.USD)) pricesUSD.push(pricing.USD);
    }

    const minPriceINR = pricesINR.length > 0 ? Math.min(...pricesINR) : "--";
    const maxPriceINR = pricesINR.length > 0 ? Math.max(...pricesINR) : "--";
    const minPriceUSD = pricesUSD.length > 0 ? Math.min(...pricesUSD) : "--";
    const maxPriceUSD = pricesUSD.length > 0 ? Math.max(...pricesUSD) : "--";

    return { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD };
  }
</script>

<div id="productVariants" class="md:w-11/12 max-w-7xl bg-white mx-auto shadow-sm border border-gray-200 rounded-lg m-10">
  <h1 class="w-full text-left text-2xl text-primary-400 font-bold p-3">Products</h1>

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
            {@const { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD } = getMinMaxPrices(variant.pricing)}
            <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer" 
            on:click={() => window.location.href = variant.productNumber}>
              <td class="py-4 px-6">
                <a href={variant.productNumber}>
                  <img src={variant.imageSrc} alt={variant.productNumber} class="w-20" />
                </a>
              </td>
              <td class="py-4 px-6 text-primary-400 font-medium cursor-pointer">
                {variant.productNumber}
              </td>
              <td class="py-4 px-6">{allManufacturer.name}</td>
              <td class="py-4 px-6">
                <span>
                  {#if $currencyState === 'usd'}
                    {#if minPriceUSD === maxPriceUSD}
                      <span class="font-semibold text-black">
                        $ {minPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    {:else}
                      <span class="font-semibold text-black">
                        $ {minPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - 
                        $ {maxPriceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    {/if}
                  {:else}
                    {#if minPriceINR === maxPriceINR}
                      <span class="font-semibold text-black">
                        ₹ {minPriceINR.toLocaleString("en-IN")}
                      </span>
                    {:else}
                      <span class="font-semibold text-black">
                        ₹ {minPriceINR.toLocaleString("en-IN")} - ₹ {maxPriceINR.toLocaleString("en-IN")}
                      </span>
                    {/if}
                  {/if}
                </span>
              </td>
              <td class="py-4 px-6 text-center sm:py-3 sm:px-4">
                <a href={variant.productNumber} class="bg-primary-400 text-white py-2 px-4 rounded hover:bg-primary-500 text-sm md:text-base block sm:inline-block">
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