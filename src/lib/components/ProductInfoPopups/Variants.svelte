<script>
  import { currencyState } from "$lib/stores/mainStores.js";
  import ShowQuoteModal from "./showQuoteModal.svelte";
  import { PUBLIC_IMAGE_URL } from "$env/static/public";
  import Icon from "@iconify/svelte";
  import { addItemToCart } from "$lib/stores/cart.js";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  import { sendMessage } from "$lib/utils.js";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-sonner";

  export let record;
  export let productName;
  let isLoggedIn = $authedUser?.id ? true : false;
  let showQuoteModal = false;
  let productQuote = null;
  let form5;
  let form;
  const allVariants = record.variants;
  // console.log(allVariants, "allVariants");

  let selectedProductId = null;
  function togglePricing(productId) {
    selectedProductId = selectedProductId === productId ? null : productId;
  }

  const pricingQuantities = writable({});

  onMount(() => {
    allVariants.forEach((variant) => {
      pricingQuantities.update((quantities) => {
        if (!quantities[variant._id]) {
          quantities[variant._id] = variant.pricing.map(() => "");
        }
        return quantities;
      });
    });
  });

  function validateRowQuantity(event, variantId, index) {
    let val = event.target.value.replace(/[^0-9]/g, "");
    if (val.startsWith("0")) val = val.slice(1);
    pricingQuantities.update((q) => {
      q[variantId][index] = val ? Math.min(parseInt(val), 999) : "";
      return q;
    });
  }

  function increaseRowQuantity(variantId, index) {
    pricingQuantities.update((q) => {
      const current = parseInt(q[variantId][index] || "0", 10);
      if (current < 999) q[variantId][index] = current + 1;
      return q;
    });
  }

  function decreaseRowQuantity(variantId, index) {
    pricingQuantities.update((q) => {
      const current = parseInt(q[variantId][index] || "1", 10);
      q[variantId][index] = current > 1 ? current - 1 : 1;
      return q;
    });
  }

  function addToCart(variant, quantityArray) {
    const selectedQuantities = quantityArray
      .map((qty, i) => ({
        priceItem: variant.pricing[i],
        quantity: parseInt(qty || "0", 10),
        index: i,
      }))
      .filter((item) => item.quantity > 0);

    if (selectedQuantities.length === 0) {
      toast.error("Please enter quantity for at least one size");
      return;
    }

    let isSuccess = false;
    let isError = false;
    let pendingRequests = 0;

    selectedQuantities.forEach((item) => {
      const backOrder =
        item.quantity > variant.stock ? item.quantity - variant.stock : 0;
      const cartItem = {
        productId: variant.productId || variant._id,
        manufacturerId: variant.manufacturerId || "",
        distributorId: variant.distributorId || "",
        stockId: item.priceItem.stockId || "NA",
        quantity: item.quantity,
        backOrder,
      };

      if (!isLoggedIn) {
        addItemToCart(cartItem);
        const cartData = localStorage.getItem("cart");
        const updatedCart = cartData ? JSON.parse(cartData) : [];
        localStorage.setItem("totalCompsChemi", updatedCart.length);
        syncLocalStorageToStore();
        isSuccess = true;
      } else {
        pendingRequests++;
        const formData = new FormData();
        formData.append("items", JSON.stringify(cartItem));

        sendMessage("?/addtocart", formData, async (result) => {
          pendingRequests--;
          if (result.success) {
            isSuccess = true;
            await submitForm();
            invalidate("/");
          } else {
            isError = true;
          }

          // Only show toast once all async calls are done
          if (pendingRequests === 0) {
            if (isSuccess && !isError) {
              toast.success(
                selectedQuantities.length === 1
                  ? "Product added to cart"
                  : "Products added to cart"
              );
            } else {
              toast.error("Error while adding products to cart");
            }
          }
        });
      }
    });

    // For guest users (no async), show toast directly
    if (!isLoggedIn) {
      toast.success(
        selectedQuantities.length === 1
          ? "Product added to cart"
          : "Products added to cart"
      );
    }

    // 🔄 Reset input quantities
    pricingQuantities.update((q) => {
      q[variant._id] = variant.pricing.map(() => "");
      return q;
    });
  }

  function handleData() {
    return async ({ result }) => {
      const totalComps = result?.data?.cartData?.cartItems.length;
      localStorage.setItem("totalCompsChemi", totalComps);
      syncLocalStorageToStore();
    };
  }

  function syncLocalStorageToStore() {
    const storedTotalComps = localStorage.getItem("totalCompsChemi");

    if (storedTotalComps) {
      cartTotalComps.set(Number(storedTotalComps));
    }
  }

  async function submitForm() {
    form.requestSubmit();
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

  const DOTS = "...";
  const VISIBLE_PAGES = 5;
  let currentPage = writable(1);
  const rowsPerPage = 10;

  $: totalPages = Math.ceil(allVariants.length / rowsPerPage);
  $: paginatedVariants = getPaginatedData(
    allVariants,
    $currentPage,
    rowsPerPage
  );
  $: pageNumbers = getPageRange($currentPage, allVariants.length);

  function getPageRange(current, totalItems) {
    const range = [];
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    if (totalPages <= VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    let start = Math.max(2, current - Math.floor(VISIBLE_PAGES / 2));
    let end = Math.min(totalPages - 1, start + VISIBLE_PAGES - 3);

    if (current > totalPages - 2) {
      start = totalPages - VISIBLE_PAGES + 1;
      end = totalPages - 1;
    }
    if (current <= 2) {
      start = 2;
      end = Math.min(VISIBLE_PAGES - 1, totalPages - 1);
    }

    if (start > 2) {
      range.push(DOTS);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push(DOTS);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }

  function getPaginatedData(items, currentPageNum, itemsPerPageNum) {
    const startIndex = (currentPageNum - 1) * itemsPerPageNum;
    const endIndex = startIndex + itemsPerPageNum;
    return items.slice(startIndex, endIndex);
  }

  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages && page !== $currentPage) {
      currentPage.set(page);
    }
  }
</script>

<form
  method="POST"
  action="/?/getCartValue"
  bind:this={form}
  use:enhance={handleData}
>
  <input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>

<div
  id="productVariants"
  class="md:w-11/12 max-w-7xl bg-white mx-auto shadow-sm border border-gray-200 rounded-md m-10"
>
  <h1 class="w-full text-left text-xl text-heading font-bold p-3 uppercase">
    Other Options
  </h1>

  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-primary-50">
          <tr>
            <th scope="col" class="py-3 px-6">Image</th>
            <th scope="col" class="py-3 px-6">Product Name</th>
            <th scope="col" class="py-3 px-6">Manufacturer</th>
            <th scope="col" class="py-3 px-6">Price Range</th>
            <th scope="col" class="py-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedVariants as variant (variant._id)}
            {@const { minPriceINR, maxPriceINR, minPriceUSD, maxPriceUSD } =
              getMinMaxPrices(variant.pricing)}
            <tr
              class={selectedProductId === variant._id
                ? "bg-white cursor-pointer"
                : "bg-white border-b hover:bg-gray-50 cursor-pointer"}
              on:click={() => {
                // Optional: handle row click
              }}
            >
              <td class="py-1 px-2">
                <a href={variant.productNumber}>
                  <img
                    src="{PUBLIC_IMAGE_URL}/{variant?.imageSrc}"
                    alt={variant.productNumber}
                    class="w-20 h-20 object-contain"
                    onerror="this.src='/fallback.jpg'"
                  />
                </a>
              </td>
              <td class="relative py-1 px-2 text-primary-500 text-sm cursor-pointer group">
                <a 
                  href={variant.productNumber}
                  class="block whitespace-normal break-words w-60 relative z-0"
                >
                  {variant.productName.split(" ").slice(0, 5).join(" ")}{variant.productName.split(" ").length > 5 ? '...' : ''}
                  
                  {#if variant.productName.split(" ").length > 5}
                    <div class="absolute inset-0 z-10 hidden group-hover:flex items-center justify-center bg-white bg-opacity-95 h-fit text-gray-700 text-xs px-2 py-2 rounded shadow-md break-words text-left select-text">
                      {variant.productName}
                    </div>
                  {/if}
                </a>
              </td>
              <td class="py-1 px-2">{variant.manufacturerName}</td>
              <td class="py-1 px-2">
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
                      })}
                      - $ {(Number(maxPriceUSD) || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
                    })}
                    - ₹ {(Number(maxPriceINR) || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                {/if}
              </td>

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
                        class="absolute left-1/2 top-full -translate-x-1/2 w-3 h-3 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"
                      ></div>
                    </div>
                  </div>
                {:else}
                  <button
                    on:click={() => togglePricing(variant._id)}
                    class="text-primary-500 hover:text-primary-600 font-medium inline"
                  >
                    {selectedProductId === variant._id
                      ? "Hide Pricing"
                      : "View Pricing"}
                    <Icon
                      class="inline text-xl"
                      icon={selectedProductId === variant._id
                        ? "material-symbols:keyboard-arrow-up-rounded"
                        : "material-symbols:keyboard-arrow-down-rounded"}
                    />
                  </button>
                {/if}
              </td>
            </tr>
            {#if selectedProductId === variant._id}
              <tr class="bg-blue-50 border-b">
                <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                  >Pack Size</th
                >
                <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                  >Product Number</th
                >
                <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                  >Price</th
                >
                <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                  >Availability</th
                >
                <th class="py-3 px-6 text-gray-800 text-sm font-semibold"
                  >Quantity</th
                >
              </tr>
              {#each variant.pricing as priceItem, i}
                <tr class="bg-blue-50">
                  <td class="py-1 px-6 font-medium">{priceItem.break}</td>
                  <td class="py-1 px-6 font-medium"
                    >{variant.productNumber}</td
                  >
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
                  <td class="py-3 px-6 font-medium">
                    <div
                      class="flex items-center border border-gray-300 justify-between w-full space-x-1 rounded-md"
                    >
                      <button
                        on:click={() => decreaseRowQuantity(variant._id, i)}
                        class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
                      >
                        <Icon icon="ic:round-minus" class="text-lg" />
                      </button>

                      <input
                        type="text"
                        bind:value={$pricingQuantities[variant._id][i]}
                        on:input={(e) => validateRowQuantity(e, variant._id, i)}
                        class="w-10 h-6 p-0 text-center border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent bg-transparent"
                      />

                      <button
                        on:click={() => increaseRowQuantity(variant._id, i)}
                        class="w-full text-lg text-primary-400 font-medium h-8 flex items-center justify-center"
                      >
                        <Icon icon="ic:round-plus" class="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
              <!-- Add to Cart Button, moved outside the loop -->
              <tr class="bg-blue-50 border-b cursor-pointer">
                <td colspan="5" class="py-2 px-6">
                  <div class="flex justify-end">
                    <button
                      on:click={() =>
                        addToCart(variant, $pricingQuantities[variant._id])}
                      class={`text-white border flex justify-center items-center rounded-md py-1.5 font-medium px-2 
    ${
      $pricingQuantities[variant._id]?.some((q) => parseInt(q || "0") > 0)
        ? " bg-primary-400 text-white cursor-pointer"
        : "bg-primary-400 hover:bg-primary-300 text-white cursor-not-allowed"
    }
  `}
                      disabled={!$pricingQuantities[variant._id]?.some(
                        (q) => parseInt(q || "0") > 0
                      )}
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

    {#if totalPages > 1}
    <div class="flex items-center justify-center gap-2 flex-wrap my-6">
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        on:click={() => handlePageChange(1)}
        disabled={$currentPage === 1}
        aria-label="First page"
      >
        <Icon icon="charm:chevrons-left" class="w-4 h-4" />
      </button>

      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        on:click={() => handlePageChange($currentPage - 1)}
        disabled={$currentPage === 1}
        aria-label="Previous page"
      >
        <Icon icon="charm:chevron-left" class="w-4 h-4" />
      </button>

      {#each pageNumbers as page}
        {#if page === DOTS}
          <span class="px-2 text-gray-500 text-sm font-medium">{DOTS}</span>
        {:else}
          <button
            class={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm shadow-sm border transition-all duration-200 transform ${
              page === $currentPage
                ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-primary-500 hover:text-white active:scale-110"
            }`}
            on:click={() => handlePageChange(page)}
            disabled={page === $currentPage}
            aria-label="Go to page {page}"
            aria-current={page === $currentPage ? "page" : undefined}
          >
            {page}
          </button>
        {/if}
      {/each}

      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        on:click={() => handlePageChange($currentPage + 1)}
        disabled={$currentPage === totalPages}
        aria-label="Next page"
      >
        <Icon icon="charm:chevron-right" class="w-4 h-4" />
      </button>

      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        on:click={() => handlePageChange(totalPages)}
        disabled={$currentPage === totalPages}
        aria-label="Last page"
      >
        <Icon icon="charm:chevrons-right" class="w-4 h-4" />
      </button>
    </div>
    {/if}
  </div>
</div>
{#if showQuoteModal}
  <ShowQuoteModal {productName} {toggleQuoteModal} {form5} {productQuote} />
{/if}
<Toaster position="bottom-right" richColors />
