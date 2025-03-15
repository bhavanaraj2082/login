<script>
  import { addItemToCart, cart, guestCart } from "$lib/stores/cart.js";
  import { sendMessage } from "$lib/utils.js";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import Imageinfo from "./Imageinfo.svelte";
  import Icon from "@iconify/svelte";
  import { currencyState } from "$lib/stores/mainStores.js";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  import Variants from "$lib/components/ProductInfoPopups/Variants.svelte";
  import ShowQuoteModal from "./showQuoteModal.svelte";
  import SideCart from "./sideCart.svelte";
  import LikedPopup from "./LikedPopup.svelte";
  import { toast, Toaster } from "svelte-sonner";
  import ShowCartPopup from "./showCartPopup.svelte";
  export let data;
  export let isauthedUser;
  export let isFavorite;
  let form;
  let showDropdown = false;
  let showImagePopup = false;
  let showQuoteModal = false;
  let productQuote = null;
  let showTooltip = false;
  let screenWidth = 0;
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

  const updateWidth = () => {
    screenWidth = window.innerWidth;
  };

  onMount(() => {
    screenWidth = window.innerWidth;
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  });

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

    if (!isLoggedIn) {
      addItemToCart(cartItem);
      // toast.success("Product added to cart");
      guestCartFetch();
      return;
    }

    const formdata = new FormData();
    formdata.append("items", JSON.stringify(cartItem));
    sendMessage("?/addtocart", formdata, async (result) => {
      // console.log("result",result);
      if (result.success) {
        await submitForm();
      }
      // toast.success(result.message);
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
    class="md:w-11/12 max-w-7xl md:flex lg:flex mx-auto bg-white shadow-md border border-gray-200 rounded-lg m-10"
  >
    <div
      class="p-3 flex space-x-4 justify-between flex-col lg:flex-row m-3
      {(product?.variants && product?.variants.length > 0) ||
      product?.priceSize?.length === 0
        ? 'lg:w-full'
        : 'lg:w-10/12'}"
    >
      <div class="flex flex-col space-y-4 lg:w-[30%] mt-3">
        <div
          class="mb-3 flex justify-center items-center xl:block relative group"
        >
          <button
            on:click={toggleImagePopup}
            class="border border-gray-300 rounded-md p-3 max-lg:border-none relative"
          >
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
              src={product.imageSrc}
              alt="Product Image"
              class="w-60 h-60 object-contain"
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
        <div class="w-full mb-4">
          <button
            class="w-full text-left bg-white text-gray-900 font-medium p-2 pl-0"
          >
            Documents
          </button>
          <div class="w-full rounded-lg space-y-1">
            <!-- {#if showDropdown} -->
            <div class="text-primary-400 text-sm text-left cursor-pointer">
              <a href={product?.safetyDatasheet} target="_blank">
                <Icon icon="ic:round-download" class="text-md inline" />SDS
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
      </div>

      <div
        class="flex flex-col space-y-4 w-full lg:w-3/4 max-[991px]:mt-5 max-[991px]:!ml-0"
      >
        <div class="flex items-center justify-between space-x-4">
          <span class="text-primary-400 font-semibold"
            >{product.productNumber}</span
          >
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
                <input type="hidden" name="productId" value={product.productId} />
                <input type="hidden" name="manufacturerId" value={product?.manufacturer?._id} />
                <input type="hidden" name="authedEmail" value={authedEmail} />
                <input type="hidden" name="stockId" value={selectedStockId} />
                <input type="hidden" name="distributorId" value={product?.distributorId} />
                <input type="hidden" name="quantity" value={product?.orderMultiple || 1} />
                <input type="hidden" name="stock" value={product?.stockQuantity} />
                {#if authedEmail}
                  <button type="submit" class="p-2" on:click={toggleLike}>
                    <Icon
                      icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
                      class="text-2xl text-primary-400"
                    />
                  </button>
                {:else}
                  <button type="submit" class="p-2" on:click={toggleLikedPopup}>
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
        <h1 class="text-gray-800 font-semibold text-[22px] !mt-0">
          {product?.productName}
        </h1>
        {#if product?.manufacturer?.name && product?.manufacturer?.name !== ""}
          <p class="text-gray-700 font-semibold text-sm !mt-1 mb-1">
            Manufacturer: <span class="font-normal"
              >{product.manufacturer.name}</span
            >
          </p>
        {/if}
        {#if product?.CAS && product?.CAS !== ""}
          <p class="text-gray-500 text-sm !mt-1 mb-1">
            CAS Number: <span class="font-bold">{product?.CAS}</span>
          </p>
        {/if}
        {#if product.prodDesc !== ""}
          <p class="text-gray-500 text-sm !mt-1">
            {product.prodDesc}
          </p>
        {/if}
        <!-- Product Returnable Section -->
        {#if !product?.returnPolicy}
          <!-- <div class="flex items-center gap-1 text-green-500 font-medium text-xs mt-2">
            <Icon icon="material-symbols:verified" class="text-base text-green-600" />
            <span>Returns Accepted</span>
          </div>
        {:else} -->
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

        {#if product.productSynonym}
          <div class="flex justify-between !mt-3">
            <p class="text-gray-900 text-sm font-semibold text-start">
              Synonym(S): <span class="text-gray-500 font-normal"
                >{product.productSynonym}</span
              >
            </p>
          </div>
        {/if}
        <!-- {#if product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && ((variant.pricing.INR && variant.pricing.INR > 0) || (variant.pricing.USD && variant.pricing.USD > 0)))} -->
        {#if product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant?.pricing && variant.pricing.length > 0 && variant.pricing.some((pricingItem) => (pricingItem.INR && Number(pricingItem.INR) > 0) || (pricingItem.USD && Number(pricingItem.USD) > 0)))}
          <div class="flex justify-between !mt-3">
            <p class="text-gray-900 text-lg font-semibold text-start">
              {#if $currencyState === "usd"}
                $ {minPrice.USD.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} - $ {maxPrice.USD.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {:else}
                ₹ {minPrice.INR.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} - ₹ {maxPrice.INR.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {/if}
            </p>
          </div>
        {/if}
        {#if screenWidth >= 640 && !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
          <div class="">
            <h2 class="bg-white font-semibold text-left">SELECT A SIZE</h2>
            <div
              class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-gray-700 text-left border-b border-gray-300"
            >
              <div class="p-2">Pack Size</div>
              <div class="p-2">SKU</div>
              <div class="p-2">Availability</div>
              <div class="p-2">Price</div>
            </div>
            {#each product?.priceSize as priceItem, i}
              <div class="w-full mt-1">
                <button
                  type="button"
                  class={`w-full grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 cursor-pointer transition-transform border border-gray-300 rounded-sm ${index === i ? "border md:border-l-6 lg:border bg-primary-50" : "border-none"}`}
                  on:click={() => handleThumbnailClick(i, product)}
                >
                  <div class="col-span-1 p-2 text-left">
                    {priceItem?.break}
                  </div>
                  <div class="col-span-1 p-2 text-left">
                    {product?.productNumber}-{priceItem?.break}
                  </div>
                  <div
                    class="col-span-1 p-2 flex items-center justify-center space-x-1 sm:space-x-2"
                  >
                    <span class="text-left">
                      {#if product?.stockQuantity > 0}
                        Available <Icon
                          icon="ix:success-filled"
                          class="text-base text-green-500 inline font-bold"
                        />
                      {:else}
                        Out of stock <Icon
                          icon="ix:error-filled"
                          class="text-base text-red-500 font-bold inline"
                        />
                      {/if}
                    </span>
                  </div>
                  <div class="col-span-1 p-2 text-left">
                    {#if $currencyState === "usd"}
                      $ {(priceItem.USD ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    {:else}
                      ₹ {(priceItem.INR ?? 0).toLocaleString("en-IN", {
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

        {#if screenWidth < 640}
          <h2 class="bg-white font-semibold text-left">SELECT A SIZE</h2>
          <div class="grid grid-cols-3 !mt-1 gap-2 max-[350px]:grid-cols-2">
            {#each product?.priceSize as priceItem, i}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class={`border border-gray-300 rounded w-28  p-2 shadow-sm hover:shadow-sm  cursor-pointer ${index === i ? "border-1 border-primary-500 bg-primary-50" : "border-1 border-gray-300"}`}
                on:click={() => handleThumbnailClick(i, product)}
              >
                <div class="text-lg font-bold text-gray-800">
                  {priceItem?.break}
                </div>
                <div class="text-sm text-gray-700">
                  {#if $currencyState === "usd"}
                    $ {(priceItem.USD ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  {:else}
                    ₹ {(priceItem.INR ?? 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
        {#if !((product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && Object.keys(variant.pricing).length > 0)) || product?.priceSize?.length > 0)}
          <div>
            <p class="text-gray-700 text-sm">
              The price for this product is unavailable. Please request a quote
            </p>
            <button
              on:click={() => toggleQuoteModal(product)}
              class="bg-primary-500 py-2 px-3 hover:bg-primary-500 rounded text-sm text-white mt-2"
              >Request Quote</button
            >
          </div>
        {/if}
      </div>
    </div>
    {#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
      <SideCart
        {data}
        {quantity}
        {index}
        {cartTogglePopup}
        {toggleTooltip}
        {updateQuantity}
        {addToCart}
        {increaseQuantity}
        {showTooltip}
        {togglePopup}
        {showPopup}
        {decreaseQuantity}
      />
    {/if}
  </div>
  {#if showCartPopup}
    <ShowCartPopup {data} {cartTogglePopup} {quantity} {index} />
  {/if}

  {#if authedEmail === "" || !authedEmail}
    {#if showLikedPopup}
      <LikedPopup {data} {toggleLikedPopup} />
    {/if}
  {/if}
{/each}
{#if showQuoteModal}
  <ShowQuoteModal {data} {toggleQuoteModal} {form5} {productQuote} />
{/if}
{#each data.records as record}
  {#if record?.variants && record?.variants?.length > 0}
    <Variants {record} {data}/>
  {/if}
{/each}
<Toaster position="bottom-right" richColors />
