<script>
  import { addItemToCart } from "$lib/stores/cart.js";
  import { sendMessage } from "$lib/utils.js";
  import { invalidate } from "$app/navigation";
  import { enhance } from "$app/forms";
  import Imageinfo from "./Imageinfo.svelte";
  import Icon from "@iconify/svelte";
  import { currencyState } from "$lib/stores/mainStores.js";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  import Variants from "$lib/components/ProductInfoPopups/Variants.svelte";
  import ShowQuoteModal from "./showQuoteModal.svelte";
  import SideCart from "./sideCart.svelte";
  import LikedPopup from "./LikedPopup.svelte";
  import { toast, Toaster } from "svelte-sonner";
  export let data;
  export let isauthedUser;
  export let isFavorite;
  export let profile;
  let form;
  let showImagePopup = false;
  let showQuoteModal = false;
  let productQuote = null;
  let showTooltip = false;
  let isLoggedIn = $authedUser?.id ? true : false;
  let form5;
  let showPopup = false;
  let showCartPopup = false;
  $: isLiked = isFavorite;
  let authedEmail = isauthedUser.email;
  let showLikedPopup = false;
  let orderMultiple = null;
  let quantity = 1;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let copyToastIndex = null;
  let copyToastID = false;
  let addedQuantity = 1;
  const productName = data.records.map((prodName) => prodName.productName);

  function toggleTooltip() {
    showTooltip = !showTooltip;
  }
  function toggleQuoteModal(selectedProduct) {
    showQuoteModal = !showQuoteModal;
    productQuote = selectedProduct;
  }

  $: {
    if (data.records.length > 0 && quantity === 1) {
      orderMultiple = data.records[0].orderMultiple;
      quantity = orderMultiple;
    } else if (data.records.length === 0) {
      quantity = null;
    }
  }

  $: {
    if (
      !data?.records ||
      !Array.isArray(data.records) ||
      data.records.length === 0
    ) {
      console.warn("No records found!");
      minPrice = "N/A";
      maxPrice = "N/A";
    } else {
      minPrice = { INR: Infinity, USD: Infinity };
      maxPrice = { INR: -Infinity, USD: -Infinity };

      data.records.forEach((record, recordIndex) => {
        if (record?.variants && Array.isArray(record.variants)) {
          record.variants.forEach((variant, variantIndex) => {
            if (
              variant?.pricing &&
              Array.isArray(variant.pricing) &&
              variant.pricing.length > 0
            ) {
              const pricingData = variant.pricing[0];
              let priceINR = Number(pricingData.INR);
              if (!isNaN(priceINR) && priceINR > 0) {
                minPrice.INR = Math.min(minPrice.INR, priceINR);
                maxPrice.INR = Math.max(maxPrice.INR, priceINR);
              } else {
                console.warn(
                  `Record ${recordIndex}, Variant ${variantIndex}: Invalid INR value:`,
                  pricingData.INR
                );
              }

              let priceUSD = Number(pricingData.USD);
              if (!isNaN(priceUSD) && priceUSD > 0) {
                minPrice.USD = Math.min(minPrice.USD, priceUSD);
                maxPrice.USD = Math.max(maxPrice.USD, priceUSD);
              } else {
                console.warn(
                  `Record ${recordIndex}, Variant ${variantIndex}: Invalid USD value:`,
                  pricingData.USD
                );
              }
            } else {
              console.warn(
                `Record ${recordIndex}, Variant ${variantIndex}: Pricing data missing or incorrect.`
              );
            }
          });
        }
      });

      // console.log(`Final minPrice (INR): ${minPrice.INR}, maxPrice (INR): ${maxPrice.INR}`);
      // console.log(`Final minPrice (USD): ${minPrice.USD}, maxPrice (USD): ${maxPrice.USD}`);
    }

    if (minPrice.INR === Infinity) minPrice.INR = "--";
    if (maxPrice.INR === -Infinity) maxPrice.INR = "--";
    if (minPrice.USD === Infinity) minPrice.USD = "--";
    if (maxPrice.USD === -Infinity) maxPrice.USD = "--";
  }

  let productStock = data.records;
  let index = 0;
  let selectedStockId = productStock?.[0]?.stockId?.[0] || "NA";

  function handleThumbnailClick(selectedIndex, product) {
    index = selectedIndex ?? 0;
    selectedStockId =
      product?.stockId?.[index] || product?.stockId?.[0] || "NA";
    // console.log("Updated Index:", index);
    // console.log("Updated Stock ID:", selectedStockId);
  }

  function togglePopup() {
    showPopup = !showPopup;
  }

  function cartTogglePopup() {
    showCartPopup = !showCartPopup;
  }

  function toggleLike() {
    isFavorite = !isFavorite;
  }

  const updateQuantity = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      quantity = null;
    } else if (value > 999) {
      quantity = 999;
    } else {
      quantity = value;
    }
  };

  const increaseQuantity = () => {
    if (quantity === null) {
      quantity = 1;
    } else if (quantity + orderMultiple <= 999) {
      quantity += orderMultiple;
    } else {
      quantity = 999;
    }
  };

  const decreaseQuantity = () => {
    if (quantity === null || quantity - orderMultiple < 1) {
      quantity = 1;
    } else {
      quantity -= orderMultiple;
    }
  };

  function toggleImagePopup() {
    showImagePopup = !showImagePopup;
  }

  function toggleLikedPopup() {
    showLikedPopup = !showLikedPopup;
  }

  const guestCartFetch = () => {
    const storedTotalComps = JSON.parse(localStorage.getItem("cart"));
    localStorage.setItem("totalCompsChemi", storedTotalComps.length);
    syncLocalStorageToStore();
  };

  export function addToCart(product) {
    const backOrder = quantity > product.stock ? quantity - product.stock : 0;
    const cartItem = {
      productId: product.productId,
      manufacturerId: product.manufacturer._id,
      distributorId: product.distributorId,
      stockId: selectedStockId || "NA",
      quantity: quantity,
      backOrder,
    };
    addedQuantity = quantity;

    if (!isLoggedIn) {
      addItemToCart(cartItem);
      guestCartFetch();
      quantity = 1;
      return;
    }

    const formdata = new FormData();
    formdata.append("items", JSON.stringify(cartItem));
    sendMessage("?/addtocart", formdata, async (result) => {
      if (result.success) {
        await submitForm();
        quantity = 1;
      }
      invalidate("/");
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

  function copyProductNumber(productNumber, index) {
    if (!productNumber) return;

    navigator.clipboard
      .writeText(productNumber)
      .then(() => {
        copyToastIndex = index;
        setTimeout(() => {
          copyToastIndex = null;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }

  function copyProductID(productNumber) {
    if (!productNumber) return;

    navigator.clipboard
      .writeText(productNumber)
      .then(() => {
        copyToastID = true;
        setTimeout(() => {
          copyToastID = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
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
{#each data.records as product}
  <div
    class="md:w-11/12 max-w-7xl md:flex lg:flex mx-auto bg-white shadow rounded w-full p-6 space-x-4"
  >
    <div
      class="flex space-x-4 justify-between flex-col lg:flex-row md:w-full
      {(product?.variants && product?.variants.length > 0) ||
      product?.priceSize?.length === 0
        ? 'lg:w-full'
        : 'lg:w-10/12'}"
    >
      <div class="flex flex-col space-y-4 lg:w-[28%]">
        <div class="flex justify-center items-center relative group mt-[7px]">
          <button
            on:click={toggleImagePopup}
            class="border border-gray-200 rounded-md p-1.5 max-lg:border-none relative"
          >
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
              src={`https://img.partskeys.com/chemikart/imgs/prod/${product?.imageSrc}`}
              alt="Product Image"
              class="w-56 h-56 object-contain"
              onerror="this.src='https://img.partskeys.com/chemikart/imgs/prod/default.jpg-250.jpg'"
            />
            <div
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-max px-3 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
            >
              Click to view larger image
              <div
                class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-600"
              ></div>
            </div>
          </button>
          {#if showImagePopup}
            <Imageinfo {data} ImageclosePopup={toggleImagePopup} />
          {/if}
        </div>
        {#if product?.safetyDatasheet}
          <div class="w-full !mt-5">
            <button
              class="w-full text-left bg-white text-gray-900 font-medium p-2 pl-0"
            >
              Documents
            </button>
            <div class="rounded-lg space-y-1">
              <!-- {#if showDropdown} -->
              <div class="text-primary-400 text-sm text-left cursor-pointer">
                <a href={product?.safetyDatasheet} target="_blank">
                  <Icon
                    icon="ic:round-download"
                    class="text-lg font-bold inline"
                  />SDS
                </a>
              </div>
              <!-- <div class="text-primary-400 text-sm text-left cursor-pointer">
            <a href="/" target="_blank"
            ><i class="fa-solid fa-sheet-plastic mr-1"></i>Specifications
            Sheet</a
            >
          </div> -->
              <!-- {/if} -->
            </div>
          </div>
        {/if}
      </div>

      <div
        class="flex flex-col w-full lg:w-3/4 max-[991px]:mt-5 max-[991px]:!ml-0"
      >
        <!-- <div class="flex flex-col space-y-4 w-full lg:w-3/4"> -->
        <div class="flex justify-between space-x-4 relative">
          <div class="relative">
            {#if copyToastID}
              <div
                class="absolute -top-6 left-0 bg-gray-500 text-white py-1 px-2 rounded text-xs"
              >
                Copied!
              </div>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
              class="text-primary-400 font-bold text-sm cursor-pointer hover:bg-blue-100 p-1 rounded-sm"
              on:click={() => copyProductID(product?.productNumber)}
            >
              {product?.productNumber}
            </span>
          </div>
          {#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
            <div class="flex items-center gap-x-2">
              <form
                method="POST"
                action="?/favorite"
                use:enhance={() => {
                  return async ({ result }) => {
                    let status = "";
                    console.log(result);
                    status = result.type;
                    if (result.data.success) {
                      toast.success(result.data.message);
                    } else {
                      // toast.error(result.data.message);
                    }
                  };
                }}
              >
                <input
                  type="hidden"
                  name="productId"
                  value={product.productId}
                />
                <input
                  type="hidden"
                  name="manufacturerId"
                  value={product?.manufacturer?._id}
                />
                <input type="hidden" name="authedEmail" value={authedEmail} />
                <input type="hidden" name="stockId" value={selectedStockId} />
                <input
                  type="hidden"
                  name="distributorId"
                  value={product?.distributorId}
                />
                <input
                  type="hidden"
                  name="quantity"
                  value={product?.orderMultiple || 1}
                />
                <input
                  type="hidden"
                  name="stock"
                  value={product?.stockQuantity}
                />
                {#if authedEmail}
                  <button class="mt-0.5" type="submit" on:click={toggleLike}>
                    <Icon
                      icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
                      class="text-2xl text-primary-400"
                    />
                  </button>
                {:else}
                  <button class="mt-0.5" type="submit" on:click={toggleLikedPopup}>
                    <Icon
                      icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
                      class="text-2xl text-primary-400"
                    />
                  </button>
                {/if}
              </form>
            </div>
          {/if}
        </div>
        <div class="space-y-2">
          <h1
            class="text-heading font-semibold md:text-xl text-base !mt-0 leading-tight"
          >
            {product?.productName}
          </h1>

          {#if product?.manufacturer?.name && product?.manufacturer?.name !== ""}
            <p class="text-gray-800 font-medium text-sm leading-relaxed">
              Manufacturer: <span class="font-normal"
                >{product.manufacturer?.name}</span
              >
            </p>
          {/if}

          {#if product?.CAS && product?.CAS !== ""}
            <p class="text-gray-800 font-medium text-sm leading-relaxed">
              CAS Number: <span class="font-normal">{product?.CAS}</span>
            </p>
          {/if}

          {#if product?.prodDesc && product.prodDesc !== ""}
            <p class="text-gray-500 text-sm leading-relaxed">
              {product?.prodDesc}
            </p>
          {/if}

          {#if !product?.returnPolicy}
            <div
              class="flex items-center gap-2 text-red-500 font-medium text-sm mt-2"
            >
              <Icon
                icon="clarity:shopping-cart-solid-badged"
                class="text-xl font-medium text-red-600"
              />
              <span>Non-Returnable</span>
            </div>
          {/if}

          <!-- {#if !authedEmail}
            <div
              class="p-2 bg-green-100 rounded-sm text-heading font-medium text-xs text-center !mt-6"
            >
              <a href="/signin">
                <span class="text-primary-500 font-bold cursor-pointer">
                  SignIn
                </span>
              </a> to View Organizational & Contract Pricing
            </div>
          {/if} -->
        </div>

        {#if product.productSynonym}
          <div class="flex justify-between !mt-3">
            <p class="text-gray-900 text-sm font-semibold text-start">
              Synonym(S): <span class="text-gray-500 font-normal"
                >{product?.productSynonym}</span
              >
            </p>
          </div>
        {/if}
        <!-- {#if product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && ((variant.pricing.INR && variant.pricing.INR > 0) || (variant.pricing.USD && variant.pricing.USD > 0)))} -->
        {#if product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant?.pricing && variant.pricing.length > 0 && variant.pricing.some((pricingItem) => (pricingItem.INR && Number(pricingItem.INR) > 0) || (pricingItem.USD && Number(pricingItem.USD) > 0)))}
          <div class="flex justify-between {!authedEmail ? '!mt-6' : '!mt-3'} ">
            <p class="text-gray-900 text-lg font-semibold text-start">
              {#if $currencyState === "usd"}
                $ {(Number(minPrice.USD) || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} - $ {(Number(maxPrice.USD) || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {:else}
                ₹ {(Number(minPrice.INR) || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} - ₹ {(Number(maxPrice.INR) || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {/if}
            </p>
          </div>
        {/if}
        {#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
          <div class="!mt-6 max-[640px]:hidden block">
            <h2 class="bg-white text-heading font-bold text-left">
              Select a Size
            </h2>
            <div
              class="grid grid-cols-[1fr_2fr_1fr_1fr] gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm sm:font-semibold font-medium text-gray-700 text-left border-b border-gray-300"
            >
              <div class="px-1 pl-0 py-2 whitespace-nowrap">Pack Size</div>
              <div class="px-1 py-2">SKU</div>
              <div class="px-1 py-2">Availability</div>
              <div class="py-2 px-1">Price</div>
            </div>
            {#each product?.priceSize as priceItem, i}
              <div class="w-full mt-2">
                <button
                  type="button"
                  class={`w-full grid grid-cols-[1fr_2fr_1fr_1fr] gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600 cursor-pointer transition-transform border border-gray-100 rounded-sm ${index === i ? "border md:border-l-6 lg:border bg-primary-100 border-gray-200" : "border-none"}`}
                  on:click={() => handleThumbnailClick(i, product)}
                >
                  <div class="px-1 py-2 pl-1 text-left">
                    {priceItem?.break}
                  </div>

                  <div class="px-1 py-2 text-left relative">
                    {#if copyToastIndex === i}
                      <div
                        class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-1 px-2 rounded text-xs"
                      >
                        Copied!
                      </div>
                    {/if}

                    {#if product?.sku[i]}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-no-static-element-interactions -->
                      <span
                        on:click={() => {
                          handleThumbnailClick(i, product);
                          copyProductNumber(product.sku[i], i);
                        }}
                        class="hover:bg-blue-200 p-0.5 cursor-pointer rounded-sm block sm:inline break-all"
                      >
                        {product.sku[i]}
                      </span>
                    {/if}
                  </div>
                  <div class="px-1 py-2 text-left">
                    {#if product?.stockQuantity > 0}
                      In Stock
                      <Icon
                        icon="ix:success-filled"
                        class="text-base text-green-500 inline font-bold mb-1"
                      />
                    {:else}
                      Out of stock
                      <Icon
                        icon="ix:error-filled"
                        class="text-base text-red-500 font-bold inline mb-1"
                      />
                    {/if}
                  </div>
                  <div
                    class="px-1.5 py-2 text-left whitespace-nowrap overflow-hidden"
                  >
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
                  </div>
                </button>
              </div>
            {/each}
          </div>
        {/if}
        <div class="max-[640px]:block hidden">
          <h2
            class="bg-white font-bold text-heading text-base text-left max-md:mt-6"
          >
            Select a Size
          </h2>
          <div class="grid grid-cols-3 !mt-1 gap-2 max-[350px]:grid-cols-2">
            {#each product?.priceSize as priceItem, i}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class={`border border-gray-300 rounded w-28  p-2 shadow-sm hover:shadow-sm  cursor-pointer ${index === i ? "border-1 border-primary-500 bg-primary-50" : "border-1 border-gray-300"}`}
                on:click={() => handleThumbnailClick(i, product)}
              >
                <div class="lg:text-lg text-base font-bold text-gray-800">
                  {priceItem?.break}
                </div>
                <div class="text-sm text-gray-700">
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
                </div>
              </div>
            {/each}
          </div>
        </div>
        {#if !((product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && Object.keys(variant.pricing).length > 0)) || product?.priceSize?.length > 0)}
          <div>
            <p class="text-gray-700 text-sm {!authedEmail ? 'mt-6' : ''}">
              The price for this product is unavailable. Please request a quote
            </p>
            <button
              on:click={() => toggleQuoteModal(product)}
              class="bg-primary-500 py-2 px-3 hover:bg-primary-500 rounded text-sm text-white mt-2"
            >
              Request Quote
            </button>
          </div>
        {/if}
      </div>
    </div>
    {#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
      <SideCart
        {data}
        {quantity}
        {orderMultiple}
        {addedQuantity}
        {index}
        {cartTogglePopup}
        {toggleTooltip}
        {updateQuantity}
        {addToCart}
        {increaseQuantity}
        {showTooltip}
        {togglePopup}
        {showPopup}
        {showCartPopup}
        {decreaseQuantity}
      />
    {/if}
  </div>
  {#if authedEmail === "" || !authedEmail}
    {#if showLikedPopup}
      <LikedPopup {data} {toggleLikedPopup} />
    {/if}
  {/if}
{/each}
{#if showQuoteModal}
  <ShowQuoteModal
    {profile}
    {productName}
    {toggleQuoteModal}
    {form5}
    {productQuote}
  />
{/if}
{#each data.records as record}
  {#if record?.variants && record?.variants?.length > 0}
    <Variants {record} {productName} />
  {/if}
{/each}
<Toaster position="bottom-right" richColors />
