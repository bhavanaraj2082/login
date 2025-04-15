<script>
  import { currencyState } from "$lib/stores/mainStores.js";
  import ShowQuoteModal from "./showQuoteModal.svelte";
  import { PUBLIC_IMAGE_URL } from "$env/static/public";
  import Icon from "@iconify/svelte";
  import { addItemToCart } from "$lib/stores/cart.js";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  import { sendMessage } from "$lib/utils.js";

  export let record;
  export let productName;
  let quantity = 1;
  let isLoggedIn = $authedUser?.id ? true : false;
  let showQuoteModal = false;
  let productQuote = null;
  let form5;
  const allVariants = record.variants;
  // console.log(allVariants,"allVariants");

  let selectedProductId = null;
  function togglePricing(productId) {
    selectedProductId = selectedProductId === productId ? null : productId;
  }

  function increaseQuantity() {
    if (quantity < 999) quantity++;
  }

  function decreaseQuantity() {
    if (quantity > 1) quantity--;
  }

  function validateQuantity(event) {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");

    if (inputValue === "") {
      quantity = "";
      return;
    }

    if (inputValue.startsWith("0") && inputValue.length > 1) {
      inputValue = inputValue.slice(1);
    }

    let parsedValue = parseInt(inputValue, 10);
    quantity = parsedValue > 999 ? 999 : parsedValue;
  }

  function onBlurQuantity(event) {
    let inputValue = parseInt(event.target.value, 10);
    if (!inputValue || inputValue < 1) {
      quantity = 1;
    }
  }

  function addToCart(variant) {
    const selectedStockId = variant.stockId || "NA";
    const backOrder = quantity > variant.stock ? quantity - variant.stock : 0;

    const cartItem = {
      productId: variant.productId || variant._id,
      manufacturerId: variant.manufacturerId || "",
      distributorId: variant.distributorId || "",
      stockId: selectedStockId,
      quantity: quantity,
      backOrder,
    };

    if (!isLoggedIn) {
      addItemToCart(cartItem);
      quantity = 1;
      return;
    }

    const formData = new FormData();
    formData.append("items", JSON.stringify(cartItem));

    sendMessage("?/addtocart", formData, async (result) => {
      if (result.success) {
        quantity = 1;
        await submitForm();
        invalidate("/");
      }
    });
  }

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
  <h1 class="w-full text-left text-xl text-heading font-bold p-3 uppercase">
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
            {@const { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD } =
              getMinMaxPrices(variant.pricing)}
            <tr
              class={selectedProductId === variant._id
                ? "bg-white cursor-pointer"
                : "bg-white border-b hover:bg-gray-50 cursor-pointer"}
              on:click={() => {
                // window.location.href = variant.productNumber;
              }}
            >
              <td class="py-1 px-6">
                <a href={variant.productNumber}>
                  <img
                    src="{PUBLIC_IMAGE_URL}/{variant?.imageSrc}"
                    alt={variant.productNumber}
                    class="w-20 h-20 object-contain"
                    onerror="this.src='/fallback.jpg'"
                  />
                </a>
              </td>
              <td
                class="py-1 px-6 text-primary-400 hover:text-primary-500 font-medium cursor-pointer"
              >
                <a href={variant.productNumber}>
                  {variant.productNumber}
                </a>
              </td>
              <td class="py-1 px-6">{variant.manufacturerName}</td>
              <td class="py-1 px-6">
                <span>
                  {#if $currencyState === "usd"}
                    {#if minPriceUSD === maxPriceUSD && minPriceUSD !== "--"}
                      <span class="font-semibold text-black">
                        $ {(Number(minPriceUSD) || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    {:else if minPriceUSD === "--" && maxPriceUSD === "--"}
                      <span class="font-bold text-black px-8"> -- </span>
                    {:else}
                      <span class="font-semibold text-black">
                        $ {(Number(minPriceUSD) || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} - $ {(Number(maxPriceUSD) || 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    {/if}
                  {:else if minPriceINR === maxPriceINR && minPriceINR !== "--"}
                    <span class="font-semibold text-black">
                      ₹ {(Number(minPriceINR) || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  {:else if minPriceINR === "--" && maxPriceINR === "--"}
                    <span class="font-bold text-black px-8"> -- </span>
                  {:else}
                    <span class="font-semibold text-black">
                      ₹ {(Number(minPriceINR) || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} - ₹ {(Number(maxPriceINR) || 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
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
                  <!-- <a
                    href={variant.productNumber}
                    class="bg-primary-500 text-white py-2 px-3 rounded hover:bg-primary-600 text-sm block sm:inline-block"
                  >
                    View Product
                  </a> -->
                  <button
                    on:click={() => togglePricing(variant._id)}
                    class="text-primary-500 hover:text-primary-600 font-medium inline"
                  >
                    {selectedProductId === variant._id
                      ? "Hide Pricing"
                      : "View Pricing"}
                    {#if selectedProductId === variant._id}
                      <Icon
                        class="inline text-xl"
                        icon="material-symbols:keyboard-arrow-up-rounded"
                      />
                    {:else}
                      <Icon
                        class="inline text-xl"
                        icon="material-symbols:keyboard-arrow-down-rounded"
                      />
                    {/if}
                  </button>
                {/if}
              </td>
            </tr>
            {#if selectedProductId === variant._id}
              {#each variant.pricing as priceItem}
                <tr class="bg-blue-50 border-b">
                  <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                    >Pack Size</th
                  >
                  <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                    >SKU</th
                  >
                  <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                    >Availability</th
                  >
                  <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                    >Price</th
                  >
                  <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                    >Quantity</th
                  >
                </tr>
                <tr class="bg-blue-50">
                  <td class="py-1 px-6 font-medium">{priceItem.break}</td>
                  <td class="py-1 px-6 font-medium"
                    >{variant.productNumber}-{priceItem.break}</td
                  >
                  <td class="py-1 px-6 font-medium">
                    {#if variant.stock > 0}
                      In stock
                      <Icon
                        icon="ix:success-filled"
                        class="text-base text-green-500 inline font-bold mb-1"
                      />
                    {:else}
                      <Icon
                        icon="ix:error-filled"
                        class="text-base text-red-500 font-bold inline mb-1"
                      />
                      Out of stock
                    {/if}
                  </td>
                  <td class="py-1 px-6 font-medium">
                    {#if $currencyState === "usd"}
                      $ {(Number(priceItem.USD) || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    {:else}
                      ₹ {(Number(priceItem.INR) || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    {/if}
                  </td>
                  <td class="py-3 px-6 font-medium">
                    <div
                      class="flex items-center border border-gray-300 justify-between w-full space-x-1 rounded-md"
                    >
                      <button
                        on:click={decreaseQuantity}
                        class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
                      >
                        <Icon icon="ic:round-minus" class="text-2xl" />
                      </button>

                      <input
                        type="text"
                        bind:value={quantity}
                        min="1"
                        max="999"
                        maxlength="3"
                        on:input={validateQuantity}
                        on:blur={onBlurQuantity}
                        class="w-4 h-6 p-0 text-center border-none focus:border-none outline-none focus:outline-none appearance-none focus:ring-0 focus:ring-transparent bg-transparent"
                        aria-label="Quantity"
                      />

                      <button
                        on:click={increaseQuantity}
                        class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
                      >
                        <Icon icon="ic:round-plus" class="text-2xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
              <tr class="bg-blue-50 border-b cursor-pointer">
                <td colspan="5" class="py-2 px-6">
                  <div class="flex justify-end">
                    <button
                      on:click={() => addToCart(variant)}
                      class="text-white border flex justify-center items-center border-primary-400 rounded-md py-1.5 font-medium px-2 hover:bg-primary-400 bg-primary-400 hover:text-white {quantity <
                      1
                        ? 'cursor-not-allowed hover:opacity-65'
                        : ''}"
                      disabled={quantity < 1}
                    >
                      <Icon
                        icon="ic:round-shopping-cart"
                        class="inline text-xl mr-1"
                      />
                      Add To Cart
                    </button>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
{#if showQuoteModal}
  <ShowQuoteModal {productName} {toggleQuoteModal} {form5} {productQuote} />
{/if}
