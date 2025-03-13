<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { cartState } from "$lib/stores/cartStores.js";
  import { toast, Toaster } from "svelte-sonner";
  import { invalidate } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { currencyState, cartTotalComps } from "$lib/stores/mainStores.js";
  import { addItemToCart, cart, guestCart } from "$lib/stores/cart.js";
  import { authedUser } from "$lib/stores/mainStores.js";
  import { sendMessage } from "$lib/utils.js";
  export let relatedProducts;
  // console.log("relatedProducts",relatedProducts);
  import { enhance } from "$app/forms";
  $: displayPrice =
    $currencyState === "usd"
      ? selectedProduct.priceUSD
      : selectedProduct.priceINR;
  $: currencySymbol = $currencyState === "usd" ? "$" : "₹";

  const productsData = relatedProducts;
  let isLoggedIn = $authedUser?.id ? true : false;
  let showCartPopup = false;
  let RelatedProductData = productsData.map((product) => {
    return {
      productId: product._id,
      prodDesc: product.prodDesc,
      productName: product.productName,
      priceSize:
        Array.isArray(product.stockPriceSize) &&
        product.stockPriceSize.length > 0
          ? product.stockPriceSize.map((size) => ({
              size: size.break || "N/A",
              priceINR: size.inr || 0,
              priceUSD: size.usd || 0,
              offer: size.offer || "0",
            }))
          : [],
      image: product.imageSrc,
      manufacturer: product.manufacturerInfo[0]?.name,
      manufacturerId: product.manufacturerInfo[0]?._id,
      distributorId: product.stockInfo?.[0]?.distributor || "",
      stockInfo: Array.isArray(product.stockInfo) ? product.stockInfo : [],
      stockId:
        Array.isArray(product.stockInfo) && product.stockInfo.length > 0
          ? product.stockInfo.map((stock) => stock._id)
          : [],
      stock: product.stockQuantity,
      category: product.categoryInfo[0]?.urlName,
      subCategory: product.subCategoryInfo[0]?.urlName,
      subsubCategory: product.subsubCategoryInfo[0]?.urlName,
      productUrl: product.productUrl,
      productNumber: product.productNumber,
      variants: Array.isArray(product.variants) ? product.variants : [],
    };
  });

  // console.log(RelatedProductData,"RelatedProductData from svelte");

  let currentIndex = 0;
  let logosPerSlide = 4;
  let totalSlides = Math.ceil(RelatedProductData.length / logosPerSlide);

  // function prevSlide() {
  //   currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  // }

  // function nextSlide() {
  //   currentIndex = (currentIndex + 1) % totalSlides;
  // }
// Modify these two functions
function prevSlide() {
  if (currentIndex > 0) {
    currentIndex = (currentIndex - 1) % totalSlides;
  }
}

function nextSlide() {
  if (currentIndex < totalSlides - 1) {
    currentIndex = (currentIndex + 1) % totalSlides;
  }
}
  function cartTogglePopup() {
    showCartPopup = !showCartPopup;
  }

  function updateLogosPerSlide() {
    if (window.innerWidth < 640) {
      logosPerSlide = 1;
    } else if (window.innerWidth < 768) {
      logosPerSlide = 2;
    } else if (window.innerWidth < 1024) {
      logosPerSlide = 3;
    } else {
      logosPerSlide = 4;
    }

    totalSlides = Math.ceil(RelatedProductData.length / logosPerSlide);
    currentIndex = Math.min(currentIndex, totalSlides - 1);
  }

  onMount(() => {
    updateLogosPerSlide();
    window.addEventListener("resize", updateLogosPerSlide);

    return () => {
      window.removeEventListener("resize", updateLogosPerSlide);
    };
  });

  let selectedProduct = {};
  let selectedPrice;
  let selectedStockId;
  let selectedVariants;
  let selectedPriceIndex = 0;
  let showModal = false;

  function openModal(product) {
    console.log("Product Data in openModal:", product);
    selectedProduct = {
      productId: product.productId || product._id,
      brand: product.brand,
      description: product.description,
      name: product.productName || product.name,
      image: product.imageSrc || product.image,
      partNumber: product.partNumber,
      priceSize: product.priceSize,
      // quantity: product.quantity || 1,
      stock: product.stock,
      category: product.category,
      subCategory: product.subCategory,
      manufacturerId:
        product.manufacturerId || product.manufacturerInfo?.[0]?._id,
      distributorId:
        product.distributorId || product.stockInfo?.[0]?.distributor || "",
      stockId: Array.isArray(product.stockId) ? product.stockId : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
    };

    selectedPriceIndex = 0;
    selectedPrice = selectedProduct.priceSize[selectedPriceIndex];
    selectedStockId = selectedProduct.stockId[selectedPriceIndex] || "NA";
    selectedVariants = selectedProduct.variants[selectedPriceIndex] || "NA";
    popupQuantity = 1;
    showModal = true;

    // console.log("Selected Product Data after openModal:", selectedProduct);
    // console.log("Selected Price:", selectedPrice);
    // console.log("Selected Stock ID:", selectedStockId);
  }

  function closeModal() {
    showModal = false;
  }

  // function selectPrice(index, size) {
  //   selectedPrice = selectedProduct.priceSize[index];
  //   selectedPriceIndex = index;
  //   selectedStockId = selectedProduct.stockId[index] || "NA";

  //   // console.log("Selected Price:", selectedPrice);
  //   // console.log("Updated Stock ID:", selectedStockId);
  // }

  // console.log('Selected Product:', selectedProduct);
  //       console.log('Variants:', selectedProduct?.variants);
  //       console.log('Price Size:', selectedProduct?.priceSize);
  let popupQuantity = 1;

  function decrementPopupQuantity() {
    if (popupQuantity > 1) {
      popupQuantity--;
      selectedProduct.quantity = popupQuantity;
    }
  }

  function incrementPopupQuantity() {
    if (popupQuantity < 999) {
      popupQuantity++;
      selectedProduct.quantity = popupQuantity;
    }
  }

  function selectPrice(index, size) {
    selectedPrice = {
      ...selectedProduct.priceSize[index],
      index: index,
    };
    selectedPriceIndex = index;
    selectedStockId = selectedProduct.stockId[index] || "NA";
  }

  // function handlePopupInput(event) {
  //   let value = event.target.value;

  //   // Remove non-numeric characters
  //   value = value.replace(/\D/g, "");

  //   // Convert to integer
  //   value = parseInt(value, 10);

  //   // Ensure value is within limits
  //   if (isNaN(value) || value < 1) {
  //     popupQuantity = null;
  //   } else if (value > 999) {
  //     popupQuantity = 999;
  //   } else {
  //     popupQuantity = value;
  //   }

  //   // Update input field value to prevent invalid entries
  //   event.target.value = popupQuantity;

  //   selectedProduct.quantity = popupQuantity;
  // }

  function handlePopupInput(event) { 
  const value = parseInt(event.target.value, 10); 

  // Allow empty value during typing
  if (event.target.value === "") {
    popupQuantity = "";
    return;
  }

  if (isNaN(value)) { 
    popupQuantity = 1; 
  } else { 
    if (value < 1) { 
      popupQuantity = 1; 
    } else if (value > 999) { 
      popupQuantity = 999; 
    } else { 
      popupQuantity = value; 
    } 
  } 
}

  const guestCartFetch = () => {
    const formdata = new FormData();
    formdata.append("guestCart", JSON.stringify($guestCart));
    sendMessage("/cart?/guestCart", formdata, async (result) => {
      cart.set(result.cart);
    });
  };

  export function addToCart(product, index) {
    // console.log("Product Data:", product);

    if (
      !product ||
      !Array.isArray(product.priceSize) ||
      product.priceSize.length === 0
    ) {
      console.error("Invalid product data or missing priceSize.");
      return;
    }
    const selectedPrice = product.priceSize[index] || product.priceSize[0];
    const selectedStockId =
      Array.isArray(product.stockId) && product.stockId.length > index
        ? product.stockId[index]
        : "NA";

    const backOrder =
      popupQuantity > product.stock ? popupQuantity - product.stock : 0;
    const cartItem = {
      productId: product.productId,
      manufacturerId: product.manufacturerId,
      distributorId: product.distributorId,
      stockId: selectedStockId,
      quantity: popupQuantity,
      backOrder,
      // price: selectedPrice.price || 0,
      // size: selectedPrice.size || "N/A",
    };

    if (!isLoggedIn) {
      addItemToCart(cartItem);
      submitAlternateForm();
      closeModal();
      // toast.success("Product added to cart");
      // setTimeout(() => {
      //   closeModal();
      // }, 1000);
      guestCartFetch();
      return;
    }

    const formdata = new FormData();
    formdata.append("items", JSON.stringify(cartItem));
    sendMessage("?/addtocart", formdata, async (result) => {
      submitForm();
      // toast.success(result.message);
      closeModal();
      // setTimeout(() => {
      //   closeModal();
      // }, 1000);
      invalidate("/");
    });

    // console.log("Final Cart Item Sent:", cartItem);
  }
  let form2;
  async function submitForm() {
    form2.requestSubmit();
  }
  async function submitAlternateForm() {
    // submitGuestForm.requestSubmit();
    const storedTotalComps = JSON.parse(localStorage.getItem("cart"));
    localStorage.setItem("totalCompsChemi", storedTotalComps.length);
    syncLocalStorageToStore();
  }
  function syncLocalStorageToStore() {
    // Check if we are in the browser
    if (typeof window !== "undefined") {
      const storedTotalComps = localStorage.getItem("totalCompsChemi");
      if (storedTotalComps) {
        cartTotalComps.set(Number(storedTotalComps));
      }
    }
  }
  function handleDataCart() {
    return async ({ result }) => {
      // console.log("result from page server for carat data",result);

      const totalComps = result?.data?.cartData?.cartItems.length;
      // console.log("totalComps",totalComps);
      localStorage.setItem("totalCompsChemi", totalComps);
      syncLocalStorageToStore();
    };
  }
</script>

<form
  method="POST"
  action="/?/getCartValue"
  bind:this={form2}
  use:enhance={handleDataCart}
>
  <input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>
<div class="max-w-7xl mx-auto my-10">
  <h3 class="text-xl font-bold text-heading p-1 md:w-11/12 mx-auto">
    Related Products
  </h3>

  <div class="relative mt-1">
    <div class="flex items-center max-md:mx-0 mx-6">
      <!-- <button
        on:click={prevSlide}
        class="text-primary-500 p-1 pl-0.5 hover:bg-primary-100 hover:rounded-full"
      >
        <Icon class="text-2xl" icon="ion:chevron-back" />
      </button> -->
      <button
  on:click={prevSlide}
  class="text-primary-500 p-1 pl-0.5 hover:bg-primary-100 hover:rounded-full"
  style={`cursor: ${currentIndex === 0 ? 'not-allowed' : 'pointer'}; opacity: ${currentIndex === 0 ? '0.5' : '1'}`}
>
  <Icon class="text-2xl" icon="ion:chevron-back" />
</button>

      <div class="overflow-hidden flex-1">
        <div
          class="flex transition-transform duration-300"
          style={`transform: translateX(-${currentIndex * 100}%)`}
        >
          {#each RelatedProductData as product}
            <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
              <div
                class="flex flex-col w-full bg-white shadow-sm border rounded-lg overflow-hidden"
              >
                <div class="flex items-center p-3">
                  <a
                    href="/products/{product.category}/{product.subCategory}/{product.productNumber}"
                  >
                    <img
                      src={product.image}
                      alt="Img"
                      class="w-20 h-20 object-contain rounded-sm"
                    /></a
                  >
                  <div class="ml-2 text-left flex-1">
                    <h3 class="text-gray-600 text-xs font-semibold">
                      {product.manufacturer || "--"}
                    </h3>
                    <p class="font-bold text-sm text-primary-500">
                      <a
                        href="/products/{product.category}/{product.subCategory}/{product.productNumber}"
                        >{product.productNumber || "--"}</a
                      >
                    </p>
                    <p class="font-medium text-xs mt-2 overflow-hidden">
                      {product.prodDesc
                        ? product.prodDesc.slice(0, 35) + "..."
                        : "--"}
                    </p>
                  </div>
                </div>
                <div class="flex justify-center">
                  <button
                    on:click={() =>
                      openModal({
                        image: product.image,
                        brand: product.manufacturer,
                        partNumber: product.productNumber,
                        name: product.productName,
                        priceSize: product.priceSize,
                        description: product.prodDesc,
                        id: product.productId,
                        stock: product.stock,
                        quantity: product.quantity || 1,
                        category: product.category,
                        subCategory: product.subCategory,
                        subsubCategory: product.subsubCategory,
                        productId: product.productId,
                        manufacturerId: product.manufacturerId,
                        distributorId: product.distributorId,
                        stockId: product.stockId,
                        variants: product.variants,
                      })}
                    class="w-10/12 max-w-xs text-primary-500 py-1.5 rounded border border-primary-500 hover:bg-primary-500 hover:text-white transition px-1.5 mb-4"
                  >
                    View Price & Availability
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- <button
        on:click={nextSlide}
        class="text-primary-500 p-1 pr-0.5 hover:bg-primary-100 hover:rounded-full"
      >
        <Icon class="text-2xl" icon="ion:chevron-forward" />
      </button> -->
      <button
  on:click={nextSlide}
  class="text-primary-500 p-1 pr-0.5 hover:bg-primary-100 hover:rounded-full"
  style={`cursor: ${currentIndex === totalSlides - 1 ? 'not-allowed' : 'pointer'}; opacity: ${currentIndex === totalSlides - 1 ? '0.5' : '1'}`}
>
  <Icon class="text-2xl" icon="ion:chevron-forward" />
</button>

    </div>
    <div class="flex justify-center mt-4 relative">
      {#each Array(totalSlides).fill(0) as _, slideIndex}
        <button
          on:click={() => (currentIndex = slideIndex)}
          class={`w-1.5 h-1.5 rounded-full mx-1 bg-gray-400 hover:bg-gray-600 ${currentIndex === slideIndex ? "bg-primary-400" : ""}`}
        ></button>
      {/each}
    </div>
  </div>
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    on:click={() => (showModal = false)}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-5/12 relative"
      on:click|stopPropagation
    >
      <div class="mt-2 absolute right-6 top-1">
        <button
          on:click={closeModal}
          class="text-primary-500 hover:text-primary-500 hover:scale-110"
        >
          <Icon
            icon="ion:close"
            class="text-xl font-bold hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
          ></Icon>
        </button>
      </div>
      <div class="flex flex-row sm:flex-row gap-4 mb-3">
        <img
          src={selectedProduct.image}
          alt="ProductImage"
          class="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg border mx-auto sm:mx-0"
        />
        <div>
          <p class="text-xs font-semibold text-left">
            {selectedProduct.brand || "--"}
          </p>
          <p class="text-base font-semibold text-primary-500 text-left">
            <a
              href="/products/{selectedProduct.category}/{selectedProduct.subCategory}/{selectedProduct.partNumber}"
              >{selectedProduct.partNumber || "--"}</a
            >
          </p>
          <h2 class="text-lg font-medium text-left">
            {selectedProduct.name || "--"}
          </h2>
          <p class="text-sm text-left">
            {selectedProduct.description || "--"}
          </p>
        </div>
      </div>
      <hr class="my-4" />

      <div class="pl-2">
        {#if selectedProduct?.variants?.length > 0}
          {#if selectedProduct?.variants?.length > 0}
            <p class="text-gray-700 text-sm">
              Multiple variants of this product are available with different
              prices. View more details below.
            </p>

            <a
              href="/products/{selectedProduct.category}/{selectedProduct.subCategory}/{selectedProduct.partNumber}#productVariants"
            >
              <button
                on:click={closeModal}
                class="bg-primary-500 py-2 px-4 hover:bg-primary-600 text-sm rounded text-white mt-2"
              >
                View Products
              </button>
            </a>
          {/if}

          {#if selectedProduct?.variants?.length === 0}
            {#if selectedPrice}
              <div
                class="mt-5 flex gap-6 items-center justify-between sm:justify-start"
              >
                <p class="text-sm sm:text-lg ml-2">
                  Price: <span class="font-semibold text-md">
                    {#if $currencyState === "inr"}
                      ₹ {(selectedPrice?.priceINR ?? 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    {:else if $currencyState === "usd"}
                      $ {(selectedPrice?.priceUSD ?? 0).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    {/if}
                  </span>
                </p>
              </div>
            {/if}
          {/if}
        {:else if selectedProduct?.variants?.length === 0 && selectedProduct?.priceSize?.length === 0}
          <div>
            <p class="text-gray-700 text-sm">
              The price for this product is unavailable. Please request a quote
            </p>
            <a
              href="/products/{selectedProduct.category}/{selectedProduct.subCategory}/{selectedProduct.partNumber}"
            >
              <button
                class="bg-primary-500 py-2 px-4 hover:bg-primary-600 rounded text-sm text-white mt-2"
              >
                Request Quote
              </button>
            </a>
          </div>
        {:else}
          <div class="mt-4">
            <h1 class="font-semibold">Select Size</h1>
            <div class="flex gap-3 mt-3 flex-wrap mb-4">
              {#each selectedProduct.priceSize as { size }, index}
                <button
                  class="focus:bg-primary-400 hover:scale-105 focus:text-white border px-3 py-1 rounded-full {selectedPriceIndex ===
                  index
                    ? ' bg-primary-400 text-white'
                    : ''}"
                  on:click={() => selectPrice(index, size)}
                >
                  {size}
                </button>
              {/each}
            </div>

            {#if selectedPrice}
              <div
                class="mt-5 flex gap-6 items-center justify-between sm:justify-start mb-4"
              >
                <p class="text-sm sm:text-lg ml-2">
                  Price: <span class="font-semibold text-md">
                    {#if $currencyState === "usd"}
                      $ {(selectedPrice?.priceUSD ?? 0).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    {:else}
                      ₹ {(selectedPrice?.priceINR ?? 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    {/if}
                  </span>
                </p>
              </div>

              <form class="flex items-center gap-3">
                <div
                  class="border border-gray-300 rounded-md flex gap-2 justify-between items-center hover:shadow-lg hover:shadow-orange-100 w-full sm:w-36"
                >
                  <button
                    type="button"
                    class="pl-3 text-xl text-primary-500 hover:scale-110"
                    on:click={decrementPopupQuantity}
                  >
                    -
                  </button>
                  <!-- <input
                    type="number"
                    id="popupQuantity"
                    min="1"
                    max="999"
                    bind:value={popupQuantity}
                    on:input={handlePopupInput}
                    class="w-16 sm:w-20 h-9 text-center border-none focus:outline-none focus:ring-0"
                  /> -->


                  <input
                  type="text"
                  min="1"
                  maxlength="3"
                  bind:value={popupQuantity}
                  class="w-12 h-6 p-0 text-center border-0 focus:border-0 focus:outline-none focus:ring-0 rounded-md"
                  on:focus={(e) => {
                    setTimeout(() => {
                      e.target.select();
                    }, 10);
                  }}
                  on:input={(e) => { 
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); 
                    if (e.target.value.startsWith("0") && e.target.value.length > 1) { 
                      e.target.value = e.target.value.slice(1); 
                    } 
                    if (e.target.value === "") { 
                      popupQuantity = ""; 
                    } else {
                      const parsedValue = parseInt(e.target.value, 10); 
                      
                      if (parsedValue >= 1 && parsedValue <= 999) { 
                        popupQuantity = parsedValue; 
                      } else if (parsedValue > 999) {
                        popupQuantity = 999;
                        e.target.value = "999";
                      }
                    }
                  }} 
                  on:blur={(e) => { 
                    if (e.target.value === "" || e.target.value === "0") { 
                      popupQuantity = 1; 
                      e.target.value = "1"; 
                    } 
                  }}
                  aria-label="popupQuantity"
                  max="999"
                />
                  <button
                    type="button"
                    class="pr-3 text-xl text-primary-500 hover:scale-110"
                    on:click={incrementPopupQuantity}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  class="text-sm font-semibold py-2 px-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition {popupQuantity <
                  1
                    ? ' hover:opacity-65'
                    : ''}"
                  disabled={popupQuantity < 1}
                  on:click={() => {
                    addToCart(selectedProduct, selectedPriceIndex);
                    cartTogglePopup();
                  }}
                >
                <div class="flex items-center justify-center">
                  <Icon icon="ic:round-shopping-cart" class="text-2xl mr-2" />
                  <span>Add to Cart</span>
                </div>
                </button>
              </form>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
{#if showCartPopup}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
    on:click={() => {
      closeModal();
      showCartPopup = false;
    }}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg"
      on:click|stopPropagation
    >
      <div
        class="flex justify-between items-center mb-2 border-b-1 pb-3 s-gLNherB2qjnt"
      >
        <h2 class="text-lg font-semibold text-heading s-gLNherB2qjnt">
          Added to Cart
        </h2>
        <button on:click={cartTogglePopup} class="text-primary-400 font-bold">
          <Icon
            icon="mdi:close"
            class="text-2xl font-bold hover:bg-primary-400 hover:text-white hover:rounded-md hover:p-px"
          />
        </button>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex items-center mb-6 justify-around w-full">
          <img
            src={selectedProduct.image}
            alt="Img"
            class="w-24 h-24 object-contain p-1 mt-2 border rounded"
          />
          <div class="text-sm m-4">
            <p class="font-semibold text-primary-500">
              {selectedProduct.partNumber || "--"}
            </p>
            <p class="text-description">
              {selectedProduct.description || "--"}
            </p>
          </div>
        </div>
        <div
          class="flex justify-between items-center w-full bg-primary-50 p-2 rounded-md border border-gray-200"
        >
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Quantity</p>
            <p class="text-base font-semibold text-gray-800">
              {popupQuantity}
            </p>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Total Price</p>
            <div class="flex flex-col items-center gap-1 mt-1">
              <p class="text-base font-semibold text-gray-800">
                {#if $currencyState === "usd"}
                  $ {(
                    (selectedPrice?.priceUSD ?? 0) *
                    popupQuantity *
                    1.18
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {:else}
                  ₹ {(
                    (selectedPrice?.priceINR ?? 0) *
                    popupQuantity *
                    1.18
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {/if}
              </p>
              <p class="text-xs text-gray-500">with GST</p>
            </div>
          </div>

          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Base Price</p>
            <div class="flex flex-col items-center gap-1 mt-1">
              <p class="text-sm font-bold text-gray-500">
                {#if $currencyState === "usd"}
                  $ {(selectedPrice?.priceUSD ?? 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {:else}
                  ₹ {(selectedPrice?.priceINR ?? 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {/if}
              </p>
              <p class="text-xs text-gray-400">without GST</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-5 mt-6 pt-3 border-t-1">
        <button
          on:click={cartTogglePopup}
          class="bg-primary-400 text-white px-3 py-1.5 rounded font-normal hover:bg-primary-500 transition-all ease-in-out duration-300 shadow-sm"
        >
          Continue Shopping
        </button>
        <button
          class="text-primary-400 px-3 py-1.5 rounded font-normal flex gap-2 border-1 border-primary-400 hover:border-primary-500 hover:bg-primary-500 hover:text-white transition-all ease-in-out duration-300 shadow-sm"
          on:click={() => (window.location.href = "/cart")}
        >
          View Cart
          <Icon icon="ic:round-shopping-cart" class="text-2xl inline mr-1" />
        </button>
      </div>
    </div>
  </div>
{/if}
<Toaster position="bottom-right" richColors />
