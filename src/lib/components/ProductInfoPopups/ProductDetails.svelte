<script>
  import { addItemToCart, cart, guestCart } from "$lib/stores/cart.js";
  import { sendMessage } from "$lib/utils.js";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import Properties from "./Properties.svelte";
  import Imageinfo from "./Imageinfo.svelte";
  import Icon from "@iconify/svelte";
  import { cartState } from "$lib/stores/cartStores.js";
  import { authedUser } from "$lib/stores/mainStores.js";
  import Variants from "$lib/components/ProductInfoPopups/Variants.svelte";
  import Description from "$lib/components/ProductInfoPopups/Description.svelte";
  import { toast, Toaster } from "svelte-sonner";
  export let data;
  export let isauthedUser;
  export let isFavorite;
  // console.log(isFavorite, "isFavorite");
  // console.log(authedUser, "authedUser");
  // console.log(data.records, "data");

  let showDropdown = false;
  let showSharePopup = false;
  let showModal = false;
  let showImagePopup = false;
  let showQuoteModal = false;
  let productQuote = null;
  let showTooltip = false;
  let screenWidth = 0;
  let isLoggedIn = $authedUser?.id ? true : false;
  let form5;
  let isLoading = false;
  let emailSent = false;
  let verificationMessage = "";
  let ProfileEmailVerified = false;
  let isOtpVerified = false;
  let displayMessage = "";
  let enteredOtp = "";

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

  function handleInput() {
    enteredOtp = enteredOtp.trim();
  }

  const handleResendemailOtp = () => {
    form5.requestSubmit();
  };

  function toggleTooltip() {
    showTooltip = !showTooltip;
  }
  function toggleQuoteModal(selectedProduct) {
    showQuoteModal = !showQuoteModal;
    productQuote = selectedProduct;
  }

  let product = data.records;
  let showToast = false;
  let productURL = "";
  let showPopup = false;
  let stockStatus = "";
  let stockAvailability = "";
  let stockType = "";
  let stockUnAvailability = "";
  let cartNotification = "";
  let notificationTimeout;
  $: isLiked = isFavorite;
  let favoriteNotification = "";
  let favoriteStatus = "";
  let authedEmail = isauthedUser.email;
  let email = "";
  let password = "";
  let loginSuccessmsg = "";
  let loginSuccesstype = "";
  let showLikedPopup = false;
  let successMessage = "";
  let errorMessage = "";
  let orderMultiple = 1;
  let quantity = 1; 

  // console.log(data.records,"data.records");
  
  // Reactive block to update orderMultiple and quantity only when data changes
  $: {
    if (data.records.length > 0 && quantity === 1) {
      orderMultiple = data.records[0].orderMultiple;
      quantity = orderMultiple;  // Only update if quantity is still 1 (initial value)
    } else if (data.records.length === 0) {
      quantity = 1;  // Reset to 1 if no data records
    }
  }

  let minPrice = Infinity;
  let maxPrice = -Infinity;

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
      minPrice = Infinity;
      maxPrice = -Infinity;

      data.records.forEach((record, recordIndex) => {
        // console.log(
        //   ` Processing record ${recordIndex} with ${record?.variants?.length || 0} variants`,
        //   record
        // );

        if (record?.variants && Array.isArray(record.variants)) {
          record.variants.forEach((variant, variantIndex) => {
            // console.log(`Processing variant ${variantIndex}`, variant);

            if (variant?.pricing && typeof variant.pricing === "object") {
              // console.log(`Found pricing object:`, variant.pricing);

              let priceValue = Number(variant.pricing.INR);

              if (!isNaN(priceValue) && priceValue > 0) {
                minPrice = Math.min(minPrice, priceValue);
                maxPrice = Math.max(maxPrice, priceValue);
              }
            } else {
              console.warn(
                `variant.pricing is missing or not an object for variant ${variantIndex}`
              );
            }
          });
        }
      });

      if (minPrice === Infinity) minPrice = "--";
      if (maxPrice === -Infinity) maxPrice = "--";
    }
    //   console.log(`Final minPrice: ${minPrice}, maxPrice: ${maxPrice}`);
  }

let productStock = data.records;
let index = 0; 
let selectedStockId = productStock?.[0]?.stockId?.[0] || "NA"; 

function handleThumbnailClick(selectedIndex, product) {
  index = selectedIndex ?? 0;
  selectedStockId = product?.stockId?.[index] || product?.stockId?.[0] || "NA";
  // console.log("Updated Index:", index);
  // console.log("Updated Stock ID:", selectedStockId);
}

  function togglePopup() {
    showPopup = !showPopup;
  }

  function toggleLike() {
    isFavorite = !isFavorite; 
    // console.log("isFavorite changed:", isFavorite);
  }

  onMount(() => {
    productURL = window.location.href;
  });
  // console.log("Products from load function:", product);

  function toggleModal() {
    showModal = !showModal;
  }

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };
  const updateQuantity = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      quantity = 1;
    } else if (value > 999) {
      quantity = 999;
    } else {
      quantity = value;
    }
  };
  const increaseQuantity = () => {
    if (quantity + orderMultiple <= 999) {
      quantity += orderMultiple;
    } else {
      quantity = 999; 
    }
  };

  const decreaseQuantity = () => {
    if (quantity - orderMultiple >= 1) {
      quantity -= orderMultiple;
    } else {
      quantity = 1; 
    }
  };
  function toggleSharePopup() {
    showSharePopup = !showSharePopup;
  }

  function toggleImagePopup() {
    showImagePopup = !showImagePopup;
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(productURL)
      .then(() => {
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  function toggleLikedPopup() {
    showLikedPopup = !showLikedPopup;
  }

  const guestCartFetch = () => {
    const formdata = new FormData();
    formdata.append("guestCart", JSON.stringify($guestCart));
    sendMessage("/cart?/guestCart", formdata, async (result) => {
      cart.set(result.cart);
    });
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
    // price: product.priceSize[index]?.INR || 0, 
    // size: product.priceSize[index]?.break || "N/A", 
  };
  // console.log("Cart Item Before Adding:", cartItem); 

  if (!isLoggedIn) {
    addItemToCart(cartItem);
    toast.success("Product added to cart");
    guestCartFetch();
    return;
  }

  const formdata = new FormData();
  formdata.append("items", JSON.stringify(cartItem));
  sendMessage("?/addtocart", formdata, async (result) => {
    toast.success(result.message);
    invalidate("/");
  });
  // console.log("Final Cart Item Sent:", cartItem);
}


  let units = "";
  let firstName = "";
  let lastName = "";
  let organisation = "";
  let phone = "";
  let message = "";
  let formErrors = {};

  function validateForm() {
    formErrors = {};

    if (!units) {
      formErrors.units = "*Required";
    }

    if (!firstName.trim()) {
      formErrors.firstName = "First name is required.";
    } else if (/[\d]/.test(firstName)) {
      formErrors.firstName = "First name cannot contain numbers.";
    } else {
      delete formErrors.firstName;
    }

    if (!lastName.trim()) {
      formErrors.lastName = "Last name is required.";
    } else if (/[\d]/.test(lastName)) {
      formErrors.lastName = "Last name cannot contain numbers.";
    } else {
      delete formErrors.lastName;
    }

    if (!organisation.trim()) {
      formErrors.organisation = "Organisation name is required.";
    } else if (/[^a-zA-Z0-9\s]/.test(organisation)) {
      formErrors.organisation =
        "Organisation name cannot contain special characters.";
    } else {
      delete formErrors.organisation;
    }

    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      formErrors.phone =
        "Enter a valid phone number";
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      formErrors.email = "Enter a valid email address.";
    }

    if (!(isOtpVerified === true)) {
      toast.error("Please verify your email to proceed");
    }

    return Object.keys(formErrors).length === 0 && isOtpVerified === true;
  }
</script>

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
        <div class="mb-3 flex justify-center items-center xl:block">
          <button
          on:click={toggleImagePopup}
          class="border border-gray-300 rounded-md p-3 max-lg:border-none"
        >
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
            src={product.imageSrc}
            alt="Product Image"
            class="w-60 h-60 object-contain"
          />
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

      <!-- Right Column (Product Details) -->
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
                      toast.error(result.data.message);
                    }
                    favoriteNotification = result.data.message;
                    favoriteStatus = result.data.type;
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
                <!-- <input
				  type="hidden"
				  name="size"
				  value={product?.priceSize[index]?.break}
				/>
				<input
				  type="hidden"
				  name="productDesc"
				  value={product.prodDesc}
				/> -->
                <input
                  type="hidden"
                  name="productNumber"
                  value={product.productNumber}
                />
                <input
                  type="hidden"
                  name="distributorId"
                  value={product?.distributorId}
                />
                <input
                  type="hidden"
                  name="quantity"
                  value={product?.quantity || 1}
                />
                <input
                  type="hidden"
                  name="stock"
                  value={product?.stockQuantity}
                />

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
        {#if product?.returnPolicy === true}
          <p class="text-blue-500 text-sm font-normal !mt-1 mb-1">
            This product is Returnable.
          </p>
        {:else}
          <p class="text-blue-500 text-sm font-normal !mt-1 mb-1">
            This product is Not Returnable.
          </p>
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
        {#if product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && ((variant.pricing.INR && variant.pricing.INR > 0) || (variant.pricing.USD && variant.pricing.USD > 0)))}
          <div class="flex justify-between !mt-3">
            <p class="text-gray-900 text-lg font-semibold text-start">
              ₹ {minPrice.toLocaleString()} - ₹ {maxPrice.toLocaleString()}
            </p>
          </div>
        {/if}
        {#if screenWidth >= 640 && !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
          <div class="">
            <h2 class="bg-white font-semibold text-left">SELECT A SIZE</h2>
            <div
              class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-gray-700 mt-2 text-left border-b border-gray-300"
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
                    ₹ {priceItem.INR.toLocaleString("en-IN")}
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
                class={`border border-gray-300 rounded w-28 bg-white p-2 shadow-sm hover:shadow-sm  cursor-pointer ${index === i ? "border-1 border-primary-500" : "border border-gray-300"}`}
                on:click={() => handleThumbnailClick(i, product)}
              >
                <div class="text-lg font-bold text-gray-800">
                  {priceItem?.break}
                </div>
                <div class="text-sm text-gray-700">
                  ₹ {priceItem.INR.toLocaleString("en-IN")}
                </div>
              </div>
            {/each}
          </div>
        {/if}
        {#if !((product?.variants && product?.variants.length > 0 && product?.variants.some((variant) => variant.pricing && Object.keys(variant.pricing).length > 0)) || product?.priceSize?.length > 0)}
          <div>
            <p>Price not available for this product, request Quote</p>
            <button
              on:click={() => toggleQuoteModal(product)}
              class="bg-primary-500 py-2 px-4 hover:bg-primary-600 rounded text-white mt-2"
              >Request Quote</button
            >
          </div>
        {/if}
      </div>
    </div>
    {#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
      <div
        class="p-3 space-x-4 justify-between items-center flex-col lg:flex-row m-3 lg:w-3/12"
      >
        <div class="flex flex-col w-full">
          <div class="text-gray-800">
            <div
              class="items-center justify-between border-dotted border-b-2 border-gray-300 pb-2"
            >
              <div class="text-lg font-semibold relative">
                {product?.productNumber} - {product?.priceSize[index]?.break}
                <div class="relative inline-block tooltip-container">
                  <!-- Button to toggle tooltip -->
                  <button
                    on:click={toggleTooltip}
                    class="ml-1 text-primary-400"
                  >
                    <Icon icon="akar-icons:info-fill" class="text-md" />
                  </button>

                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  {#if showTooltip}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      class="absolute border border-primary-200 bottom-full left-1/2 transform -translate-x-1/2 bg-white text-black text-center w-56 text-sm rounded-md p-2 shadow-lg animate-fadeIn"
                    >
                      <button
                        on:click={() => (showTooltip = false)}
                        class="absolute top-1 right-2 text-black"
                      >
                        <Icon
                          icon="mdi:close"
                          class="absolute top-1 right-2 text-black text-sm font-bold"
                        />
                      </button>

                      <h2 class="font-semibold text-sm text-black text-left">
                        Product Information
                      </h2>
                      <p
                        class="text-xs font-normal text-gray-800 mt-1 text-left"
                      >
                        Foreign Trade Commodity Code: <span
                          class="text-gray-500 font-medium"
                          >{product?.productNumber}</span
                        >
                      </p>
                      <div
                        class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-gray-700 border-transparent border-t-primary-300"
                      ></div>
                    </div>
                  {/if}
                </div>
              </div>
              <span class="text-lg font-semibold">
                ₹ {product?.priceSize[index]?.INR.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div class="border-dotted border-b-2 border-gray-300 pb-2 mb-2">
            <p class="text-gray-800 font-semibold text-sm mt-4">Availability</p>
            <p class="text-sm">
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
            </p>
            <div class="flex space-x-2 items-center mt-2">
              <button
                on:click={togglePopup}
                class="w-full text-sm font-semibold text-left text-primary-400"
                >More Info</button
              >
              {#if showPopup}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !ml-0"
                  on:click={() => (showPopup = false)}
                >
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg"
                    on:click|stopPropagation
                  >
                    <button
                      on:click={togglePopup}
                      class="absolute top-4 right-4 text-primary-400 text-xl font-bold"
                    >
                      <Icon
                        icon="mdi:close"
                        class="text-xl font-bold hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
                      />
                    </button>

                    <h2 class="text-xl font-bold text-left">
                      Availability for {product?.productNumber}-{product
                        ?.priceSize[index]?.break}
                    </h2>
                    <p class="text-gray-500 text-left mt-2">
                      Enter quantity to check availability.
                    </p>

                    <form
                      method="POST"
                      action="?/checkavailabilityproduct"
                      use:enhance={() => {
                        return async ({ result }) => {
                          let status = "";
                          console.log(result);
                          status = result.type;
                          console.log("success/error type:", status);
                          console.log(
                            "success/error message:result.data.message=",
                            result.data.message
                          );
                          console.log(
                            "success/error message:result.data.message=",
                            result.data.stock
                          );
                          stockStatus = result.data.stock;
                          stockAvailability = result.data.message;
                          // stockUnAvailability = result.data.message1;
                          stockType = result.data.type;
                        };
                      }}
                    >
                      <div class="flex justify-between items-center mt-6">
                        <div class="flex items-center space-x-4">
                          <button
                            on:click={decreaseQuantity}
                            class="w-8 h-8 text-primary-400 flex items-center justify-center"
                          >
                            <Icon icon="ic:round-minus" class="text-2xl" />
                          </button>
                          <input
                            type="text"
                            name="quantity"
                            bind:value={quantity}
                            readonly
                            class="w-16 h-8 text-center border border-gray-300 rounded-md"
                          />
                          <input
                            type="hidden"
                            name="ProductId"
                            value={product.productNumber}
                          />
                          <button
                            on:click={increaseQuantity}
                            class="w-8 h-8 text-primary-400 flex items-center justify-center"
                          >
                            <Icon icon="ic:round-plus" class="text-2xl" />
                          </button>
                        </div>

                        <button
                          type="submit"
                          class="bg-primary-400 text-white p-2 rounded-lg flex items-center space-x-1"
                        >
                          <Icon
                            icon="tabler:calendar-check"
                            class="text-base"
                          />
                          <span class="text-sm">Check Availability</span>
                        </button>
                      </div>

                      {#if stockType === "success"}
                        <div class="mt-6 space-y-2 text-sm">
                          <div class="flex items-center space-x-2">
                            <Icon
                              icon="material-symbols:check-circle-outline"
                              class="text-sm text-primary-400"
                            />
                            <p>{stockAvailability}</p>
                          </div>
                          {#if stockUnAvailability !== ""}
                            <div class="flex items-center space-x-2">
                              <Icon
                                icon="material-symbols:check-circle-outline"
                                class="text-sm text-primary-400"
                              />
                              <p>{stockUnAvailability}</p>
                            </div>
                          {/if}
                        </div>
                      {:else if stockType === "error"}
                        <div class="mt-6 space-y-2 text-sm">
                          <div class="flex items-center space-x-2">
                            <Icon
                              icon="meteor-icons:circle-xmark"
                              class="text-sm text-primary-400"
                            />
                            <p>{stockAvailability}</p>
                          </div>
                        </div>
                      {/if}
                    </form>
                    <div class="mt-6 flex justify-end">
                      <button
                        on:click={() => addToCart(product, index)}
                        class="bg-primary-400 text-white py-2 px-4 rounded-lg flex items-center space-x-1"
                      >
                        <Icon
                          icon="ic:round-shopping-cart"
                          class="text-2xl"
                        />Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
              <button
                on:click={toggleSharePopup}
                class="w-full text-sm font-semibold text-right text-primary-400"
                >Share <Icon
                  icon="fluent:share-24-regular"
                  class="text-md inline"
                /></button
              >
              {#if showSharePopup}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 !m-0"
                  on:click={() => (showSharePopup = false)}
                >
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4"
                    on:click|stopPropagation
                  >
                    <button
                      on:click={toggleSharePopup}
                      class="absolute top-3 right-3 text-primary-400"
                    >
                      <Icon
                        icon="mdi:close"
                        class="text-xl text-primary-400 font-bold hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
                      />
                    </button>

                    <h2 class="text-base font-semibold text-primary-400 mb-3">
                      Share Product
                    </h2>

                    <div class="flex items-start space-x-4">
                      <div
                        class="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center"
                      >
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img
                          src={product.imageSrc}
                          alt="Product Image"
                          class="w-full h-full border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <p class="text-lg font-semibold text-primary-400">
                          {product.productNumber}
                        </p>
                        <p class="text-sm text-gray-600">
                          {product.productName}
                        </p>
                      </div>
                    </div>

                    <div class="mt-4">
                      <p
                        class="text-sm md:text-base font-semibold text-gray-800 mb-1"
                      >
                        Direct Link
                      </p>
                      <div
                        class="relative flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center"
                      >
                        {#if showToast}
                          <div
                            class="absolute -top-8 transform -translate-x-1/2 left-1/2 bg-gray-800 text-white py-1 px-3 rounded text-xs sm:text-sm"
                          >
                            Copied!
                          </div>
                        {/if}

                        <input
                          type="text"
                          readonly
                          bind:value={productURL}
                          class="text-xs sm:text-sm md:text-sm border border-primary-400 p-2 rounded-lg text-gray-600 outline-none flex-grow w-full"
                        />

                        <button
                          on:click={copyToClipboard}
                          class="text-primary-400 text-xs sm:text-sm md:text-sm font-semibold border p-2 border-primary-400 rounded-lg flex items-center justify-center space-x-1 w-full sm:w-auto"
                        >
                          <Icon icon="mingcute:copy-fill" class="text-md" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <div class="w-full !ml-0">
          {#if quantity > 0}
            <div class="mt-4 flex justify-between gap-3">
              <!-- Quantity Section -->
              <div class="flex flex-col text-heading">
                <p class="font-normal text-xs">Quantity</p>
                <p class="font-semibold text-sm">{quantity}</p>
              </div>

              <!-- Pricing Details -->
              <div class="flex flex-col text-heading">
                <p class="font-normal text-xs py-px">
                  Base Price:
                  <span class="font-medium text-xs">
                    ₹ {(
                      product?.priceSize[index]?.INR * quantity
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>

                <p
                  class="font-normal text-xs border-b-1 border-gray-400 border-dotted pb-px"
                >
                  GST (18%):
                  <span class="font-medium text-xs">
                    ₹ {(
                      product?.priceSize[index]?.INR *
                      0.18 *
                      quantity
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </p>

                <p class="font-normal text-xs">
                  Total Price:
                  <span class="font-semibold text-xs">
                    ₹ {(
                      product?.priceSize[index]?.INR *
                      1.18 *
                      quantity
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            </div>
          {/if}

          <div
            class="flex items-center border border-gray-300 rounded-sm justify-between w-full space-x-4 mt-6"
          >
            <button
              on:click={decreaseQuantity}
              class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
              ><Icon icon="ic:round-minus" class="text-2xl" /></button
            >
            <input
            type="text"
            class="w-full text-center border-none focus:outline-none focus:ring-0 p-1"
            bind:value={quantity}
            on:input={updateQuantity}
            min="1"
            max="999"
          />
        
            <button
              on:click={increaseQuantity}
              class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
              ><Icon icon="ic:round-plus" class="text-2xl" /></button
            >
          </div>
          <div class="w-full mt-3">
            <button
              on:click={() => addToCart(product, index)}
              class="w-full text-white border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 bg-primary-400 hover:text-white"
              ><Icon
                icon="ic:round-shopping-cart"
                class="text-2xl inline mr-1"
              />Add To Cart</button
            >
            <!-- <button class="mt-4 w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 hover:text-white">
			  <i class="fa-solid fa-code-pull-request mr-1"></i>Request For Bulk
				Order
			</button> -->
          </div>
        </div>
      </div>
    {/if}
  </div>
  {#if cartNotification}
    <div
      class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50"
    >
      {cartNotification}
    </div>
  {/if}

  {#if authedEmail === "" || !authedEmail}
    {#if showLikedPopup}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
        on:click={() => (showLikedPopup = false)}
      >
        <div
          class="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full relative"
          on:click|stopPropagation
        >
          <!-- Close Button -->
          <button
            on:click={toggleLikedPopup}
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <Icon
              icon="mdi:close"
              class="text-2xl font-bold text-primary-400 hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
            />
          </button>

          <!-- Title -->
          <h2 class="text-xl font-bold text-gray-900 text-center mb-6">
            Please Login or Register to Continue
          </h2>

          <!-- Login Button -->
          <div class="mx-16">
            <button
              class="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-sm text-white font-medium py-2.5 px-2 rounded-lg shadow-lg mb-4"
            >
              <a href="/login" class="block">Login</a>
            </button>

            <!-- Register Section -->
            <p class="text-center text-sm text-gray-500 mb-2">
              Don’t have an account?
            </p>
            <button
              class="w-full border border-primary-400 hover:bg-primary-500 hover:text-white text-primary-500 text-sm font-medium py-2 px-2 rounded-lg shadow-md mb-6"
            >
              <a href="/signup" class="block">Register</a>
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
{/each}
{#if showQuoteModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
    on:click={() => (showQuoteModal = false)}
  >
    <div
      class="bg-white rounded-lg p-6 w-2/5 h-5/6 overflow-y-auto"
      on:click|stopPropagation
    >
      <h2 class="text-xl font-semibold mb-4 text-primary-400">
        Request a Quote
      </h2>
      <!-- Form -->
      <form
        method="POST"
        action="?/createQuote"
        use:enhance={() => {
          return async ({ result, cancel }) => {
            if (!validateForm()) {
              // toast.error("Please fix the errors before submitting.");
              cancel();
            }
            if (result.status === 200) {
              toast.success("Submitted the quotes successfully!.");
              //   successMessage = 'Submitted the quotes successfully!.'
              errorMessage = "";
              location.reload();
            } else {
              successMessage = "";
              toast.error("Error creating Quote");
              //   errorMessage = 'Error creating Quote'
            }
            // showQuoteModal=false
            await applyAction(result);
          };
        }}
      >
        {#if product}
          <div class="mb-4">
            <p class="text-sm">
              <strong class="text-sm">Product Name:</strong>
              {productQuote.productName}
            </p>
          </div>
        {/if}
        <input
          type="text"
          hidden
          name="productName"
          value={productQuote.productName}
        />
        <input
          type="text"
          hidden
          name="productNumber"
          value={productQuote.productNumber}
        />
        <input type="text" hidden name="status" value="unread" />
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Units</label
          >
          <input
            type="number"
            min="1"
            max="999"
            name="units"
            bind:value={units}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="Units Required"
            on:input={() => {
              if (!units || units < 1 || units > 999) {
                formErrors.units = "Units must be between 1 and 999.";
              } else {
                formErrors.units = "";
              }
            }}
          />
          {#if formErrors.units}
            <p class="text-red-500 text-xs">{formErrors.units}</p>
          {/if}
        </div>
        <div class="mb-4">
          <label for="Firstname" class="block text-sm font-medium text-gray-700"
            >First Name</label
          >
          <input
            type="text"
            name="Firstname"
            bind:value={firstName}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="First Name"
            on:input={() => {
              if (!firstName.trim()) {
                formErrors.firstName = "First name is required.";
              } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
                formErrors.firstName =
                  "First name should contain only letters.";
              } else {
                formErrors.firstName = "";
              }
            }}
          />
          {#if formErrors.firstName}
            <p class="text-red-500 text-xs">{formErrors.firstName}</p>
          {/if}
        </div>
        <div class="mb-4">
          <label for="lastname" class="block text-sm font-medium text-gray-700"
            >Last Name</label
          >
          <input
            type="text"
            name="lastname"
            bind:value={lastName}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="Last Name"
            on:input={() => {
              if (!lastName.trim()) {
                formErrors.lastName = "Last name is required.";
              } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
                formErrors.lastName = "Last name should contain only letters.";
              } else {
                formErrors.lastName = "";
              }
            }}
          />
          {#if formErrors.lastName}
            <p class="text-red-500 text-xs">{formErrors.lastName}</p>
          {/if}
        </div>
        <div class="mb-4">
          <label
            for="organisation"
            class="block text-sm font-medium text-gray-700">Organisation</label
          >
          <input
            type="text"
            name="organisation"
            bind:value={organisation}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="Organisation Name"
            on:input={() => {
              if (!organisation.trim()) {
                formErrors.organisation = "Organisation name is required.";
              } else if (!/^[A-Za-z0-9\s]+$/.test(organisation)) {
                formErrors.organisation =
                  "Organisation name should not contain special characters.";
              } else {
                formErrors.organisation = "";
              }
            }}
          />
          {#if formErrors.organisation}
            <p class="text-red-500 text-xs">{formErrors.organisation}</p>
          {/if}
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700"
            >Phone Number</label
          >
          <input
            type="tel"
            name="phone"
            bind:value={phone}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="Phone Number"
            on:input={() => {
              if (!phone.trim()) {
                formErrors.phone = "Phone number is required.";
              } else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
                formErrors.phone = "Enter a valid phone number";
              } else {
                formErrors.phone = "";
              }
            }}
          />
          {#if formErrors.phone}
            <p class="text-red-500 text-xs">{formErrors.phone}</p>
          {/if}
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative">
            <form
              action="?/verifyemail"
              bind:this={form5}
              method="POST"
              use:enhance={({}) => {
                return async ({ result }) => {
                  console.log("result", result);

                  isLoading = false;
                  console.log(result);
                  if (result.data?.status === 200) {
                    toast.success(result.data.message);
                    ProfileEmailVerified = result.data.isEmailVerified;
                    verificationMessage = result.data.message;

                    if (
                      verificationMessage.includes(
                        "Verification email sent successfully. Please check your inbox."
                      )
                    ) {
                      displayMessage = "Please check your inbox.";
                      emailSent = true;
                      isOtpVerified = false;
                    } else {
                      displayMessage = verificationMessage;
                      emailSent = false;
                      isOtpVerified = true;
                    }
                  } else {
                    ProfileEmailVerified = result.data.isEmailVerified;
                    toast.error(result.data.message);
                    emailSent = false;
                  }
                };
              }}
              on:submit={() => {
                isLoading = true;
              }}
            >
              <input
                type="email"
                name="email"
                bind:value={email}
                class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                placeholder="Your email"
                on:input={() => {
                  if (!email.trim()) {
                    formErrors.email = "Email is required.";
                  } else if (
                    !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)
                  ) {
                    formErrors.email = "Enter a valid email address.";
                  } else {
                    formErrors.email = "";
                  }
                  ProfileEmailVerified = false;
                  emailSent = false;
                  isOtpVerified = false;
                }}
              />
              {#if isLoading}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
                >
                  <Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1" />
                  Sending...
                </span>
              {:else if !ProfileEmailVerified && !emailSent}
                <button
                  type="submit"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-500 font-semibold text-2s pl-2 py-1 rounded hover:underline disabled:cursor-not-allowed"
                  disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                    email
                  ) || email.split("@")[1].includes("gamil")}
                >
                  Verify
                </button>
              {:else if emailSent}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
                >
                  {#if isOtpVerified}
                    Verified
                    <Icon
                      icon="material-symbols:verified-rounded"
                      class="w-4 h-4 ml-1"
                    />
                  {:else}
                    <Icon
                      icon="fluent:mail-all-read-16-filled"
                      class="w-4 h-4 mr-1"
                    />
                    Check inbox
                  {/if}
                </span>
              {:else}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
                >
                  Verified
                  <Icon
                    icon="material-symbols:verified-rounded"
                    class="w-4 h-4 ml-1"
                  />
                </span>
              {/if}
            </form>
          </div>
          <input type="hidden" name="email" bind:value={email} />
          {#if formErrors.email}
            <p class="text-red-500 text-xs">{formErrors.email}</p>
          {/if}
        </div>

        {#if emailSent && isOtpVerified === false}
          <form
            action="?/verifyOtp"
            method="POST"
            use:enhance={() => {
              return async ({ result }) => {
                console.log(result);
                isOtpVerified = result.data.isEmailVerified;
                if (result.data?.status === 200) {
                  toast.success(result.data.message);
                  enteredOtp = "";
                  isOtpVerified = true;
                  ProfileEmailVerified = true;
                } else if (result.data?.status === 500) {
                  toast.error(result.data.message);
                }
                console.log(isOtpVerified, "isOtpVerified");
              };
            }}
          >
            <div class="relative w-full mb-4">
              <input type="hidden" name="email" bind:value={email} />
              <label
                for="enteredOtp"
                class="block text-sm font-medium text-gray-600"
                >Enter the Recieved 6-digit OTP</label
              >
              <input
                type="text"
                maxlength="6"
                name="enteredOtp"
                bind:value={enteredOtp}
                on:input={handleInput}
                placeholder="Enter 6-digit OTP"
                class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
				  focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
				  placeholder:text-sm h-10"
              />
              <button
                type="submit"
                class="absolute top-1/2 right-2 -translate-y-1/2 text-primary-500 font-bold text-2s py-1 rounded hover:underline"
              >
                Verify
              </button>

              <p class="mt-px text-2s text-right text-gray-600">
                Didn't receive the code?
                <button
                  type="button"
                  on:click={handleResendemailOtp}
                  class="text-primary-500 font-medium hover:underline"
                >
                  Get a new code
                </button>
              </p>
            </div>
          </form>
        {/if}

        <div class="mb-4">
          <label
            for="futherdetails"
            class="block text-sm font-medium text-gray-700">Message</label
          >
          <textarea
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="Your message"
            name="futherdetails"
          ></textarea>
        </div>
        {#if successMessage}
          <div class="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
        {/if}

        {#if errorMessage}
          <div class="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {errorMessage}
          </div>
        {/if}
        <div class="flex justify-between items-center mt-4">
          <button
            on:click={toggleQuoteModal}
            class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            ✖ Close
          </button>
          <button
            type="submit"
            class="bg-gradient-to-r from-primary-400 to-primary-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
      <!-- Close button -->
    </div>
  </div>
{/if}

<Properties {data} />

{#each data.records as record}
  {#if record?.variants && record?.variants?.length > 0}
    <Variants {record} />
  {/if}
{/each}
<Description {data} />
<Toaster position="bottom-right" richColors />

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out forwards;
  }
</style>
