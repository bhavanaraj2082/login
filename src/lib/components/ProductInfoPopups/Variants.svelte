<script>
  import { currencyState } from "$lib/stores/mainStores.js";
  import ShowQuoteModal from "./showQuoteModal.svelte";
  export let record;
  export let productName;
  let showQuoteModal = false;
  let productQuote = null;
  let form5;
  const allVariants = record.variants;
  const allManufacturer = record.manufacturer;
  function getMinMaxPrices(pricing) {
    if (!pricing) {
      // console.warn("Warning: Pricing data is undefined or null!", pricing);
      return {
        minPriceINR: "--",
        maxPriceINR: "--",
        minPriceUSD: "--",
        maxPriceUSD: "--",
      };
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
      if (typeof pricing.INR === "string")
        pricing.INR = parseFloat(pricing.INR);
      if (typeof pricing.USD === "string")
        pricing.USD = parseFloat(pricing.USD);

      if (typeof pricing.INR === "number" && !isNaN(pricing.INR))
        pricesINR.push(pricing.INR);
      if (typeof pricing.USD === "number" && !isNaN(pricing.USD))
        pricesUSD.push(pricing.USD);
    }

    const minPriceINR = pricesINR.length > 0 ? Math.min(...pricesINR) : "--";
    const maxPriceINR = pricesINR.length > 0 ? Math.max(...pricesINR) : "--";
    const minPriceUSD = pricesUSD.length > 0 ? Math.min(...pricesUSD) : "--";
    const maxPriceUSD = pricesUSD.length > 0 ? Math.max(...pricesUSD) : "--";

    return { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD };
  }

  function toggleQuoteModal(selectedProduct) {
    showQuoteModal = !showQuoteModal;
    productQuote = selectedProduct;
  }
</script>

<div
  id="productVariants"
  class="md:w-11/12 max-w-7xl bg-white mx-auto shadow-sm border border-gray-200 rounded-md m-10"
>
  <h1 class="w-full text-left text-xl text-heading font-bold p-3">Products</h1>

  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-primary-50">
          <tr>
            <th scope="col" class="py-3 px-6">Image</th>
            <th scope="col" class="py-3 px-6">Product Number</th>
            <th scope="col" class="py-3 px-6">Manufacturer</th>

            <!-- {#if allVariants.some((variant) => {
              const { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD } = getMinMaxPrices(variant.pricing);
              return minPriceINR !== "--" && maxPriceINR !== "--" && minPriceUSD !== "--" && maxPriceUSD !== "--";
            })} -->
            <th scope="col" class="py-3 px-6">Price Range</th>
            <!-- {/if} -->
            <th scope="col" class="py-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          {#each allVariants as variant}
            {@const { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD } =
              getMinMaxPrices(variant.pricing)}
            <tr
              class="bg-white border-b hover:bg-gray-50 cursor-pointer"
              on:click={() => {
                if (
                  minPriceINR !== "--" &&
                  maxPriceINR !== "--" &&
                  minPriceUSD !== "--" &&
                  maxPriceUSD !== "--"
                ) {
                  window.location.href = variant.productNumber;
                }
              }}
            >
              <td class="py-4 px-6">
                <a href={variant.productNumber}>
                  <img
                    src={variant.imageSrc}
                    alt={variant.productNumber}
                    class="w-20"
                  />
                </a>
              </td>
              <td class="py-4 px-6 text-primary-400 font-medium cursor-pointer">
                {variant.productNumber}
              </td>
              <td class="py-4 px-6">{allManufacturer.name}</td>
              <!-- {#if minPriceINR !== "--" && maxPriceINR !== "--" && minPriceUSD !== "--" && maxPriceUSD !== "--"} -->
              <td class="py-4 px-6">
                <span>
                  {#if $currencyState === "usd"}
                    {#if minPriceUSD === maxPriceUSD && minPriceUSD !== "--"}
                      <span class="font-semibold text-black">
                        $ {minPriceUSD.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    {:else if minPriceUSD === "--" && maxPriceUSD === "--"}
                      <span class="font-bold text-black px-8"> -- </span>
                    {:else}
                      <span class="font-semibold text-black">
                        $ {minPriceUSD.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} - $ {maxPriceUSD.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    {/if}
                  {:else if minPriceINR === maxPriceINR && minPriceINR !== "--"}
                    <span class="font-semibold text-black">
                      ₹ {minPriceINR.toLocaleString("en-IN")}
                    </span>
                  {:else if minPriceINR === "--" && maxPriceINR === "--"}
                    <span class="font-bold text-black px-8"> -- </span>
                  {:else}
                    <span class="font-semibold text-black">
                      ₹ {minPriceINR.toLocaleString("en-IN")} - ₹ {maxPriceINR.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  {/if}
                </span>
              </td>
              <!-- {/if} -->
              <td class="py-4 px-6 text-center sm:py-3 sm:px-4">
                {#if minPriceINR === "--" && maxPriceINR === "--"}
                  <div class="relative group inline-block">
                    <button
                      on:click={() => toggleQuoteModal(variant)}
                      class="bg-primary-500 text-white py-2 px-3 rounded hover:bg-primary-600 text-sm block sm:inline-block"
                    >
                      Request Quote
                    </button>
                    <div
                      class="absolute left-1/2 bottom-full border border-gray-300 mb-2.5 w-60 -translate-x-1/2 hidden group-hover:block bg-white text-heading text-xs px-3 py-2 rounded shadow-lg text-center"
                    >
                      This product's price is unavailable, click to request a
                      quote
                      <div
                        class="absolute left-1/2 top-full -translate-x-1/2 w-3 h-3
                      border-l-[8px] border-l-transparent
                      border-r-[8px] border-r-transparent
                      border-t-[8px] border-t-white"
                      ></div>
                    </div>
                  </div>
                {:else}
                  <a
                    href={variant.productNumber}
                    class="bg-primary-500 text-white py-2 px-3 rounded hover:bg-primary-600 text-sm block sm:inline-block"
                  >
                    View Product
                  </a>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
{#if showQuoteModal}
  <ShowQuoteModal {productName} {toggleQuoteModal} {form5} {productQuote} />
{/if}
