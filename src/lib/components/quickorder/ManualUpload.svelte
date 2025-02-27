<script>
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import { enhance, applyAction } from "$app/forms";
  import { cartState } from "$lib/stores/cartStores.js";
  import Bulkupload from "./Bulkupload.svelte";
  import { toast } from "svelte-sonner";
  let uploadedRows = [];
  let showSavedCarts = false;

  export let data;
  console.log("daa", data);
  console.log(data?.authedUser?.email,"i am email")
  
  let isLoadingPhone = false;
  let submitting = false;
  let isEmailVerified = false;
  let cartloading = false;
  let loadingotp = false;
  let loadingPhone = false;
  let isLoading = false;
  let ProfileEmailVerified;
  let authedUserEmailVerified = data?.profile?.isEmailVerified;
  // console.log(data,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

  // console.log("authedUserEmailVerified",authedUserEmailVerified);

  let verificationMessage = "";
  let emailSent = false;
  let displayMessage = "";
  let enteredOtp = "";
  let enteredOtpemail = "";
  let isOtpVerified = false;
  let isOtpPhoneVerified = false;
  let form3;
  let errors = {};
  let products = [];
  let loadingState = {};

  let selectedProduct = null;
  let stockStatus = "";
  let errorMessage;
  let successMessage;
  let loading = false;
  let searchQuery = "";
  let rawFileData = "";
  let toggle = false;
  let showLists = false;
  let showquotes = false;

  let showDetailsModal = false;
  let fileError = "";
  let cartNotification = "";
  let notificationTimeout;
  let productNumbers = "";
  let inputValue = "";
  let rows = [
    {
      sku: "",
      size: "",
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: "",
      selectedProduct: null,
    },
    {
      sku: "",
      size: "",
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: "",
      selectedProduct: null,
    },
    {
      sku: "",
      size: "",
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: "",
      selectedProduct: null,
    },
  ];
  let validationMessages = [];

  let userLoggedIn = false;
  if (data?.authedUser && data?.authedUser?.email) {
    userLoggedIn = true;
  }

  // let email = userLoggedIn ? data.authedUser.email : "";
  let email = data?.authedUser?.email||"";

  function checkAvailability() {
    if (!selectedProduct) {
      stockStatus = "";
      return;
    }

    const productStock = products.find(
      (product) => product.productNumber === selectedProduct.productNumber,
    );
  }

  function filterProducts(query) {
    if (!Array.isArray(products)) {
      console.log(products);

      return [];
    }

    return products.filter(
      (product) =>
        product.productNumber && product.productNumber.includes(query),
    );
  }
  let debounceTimeout;

  function handleInput(event, sku, index) {
    const value = event.target.value;
    searchQuery = value;

    if (value.length > 2) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const form = document.querySelector(`#form-${index}`);
        if (form) {
          form.requestSubmit();
        }
      }, 300);
      rows[index].filteredProducts = filterProducts(value);
    } else {
      rows[index].filteredProducts = [];
    }
  }

  function formatDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  }

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  let estimatedShipDate = formatDate(currentDate);

  function handleProductFilter(sku, index) {
    rows[index].filteredProducts = [];
    searchQuery = sku.trim().toLowerCase();

    if (searchQuery === "") {
      rows[index].error = "";
      return;
    }

    const matchedProducts = products.filter((product) =>
      product.productNumber.toString().toLowerCase().includes(searchQuery),
    );

    rows[index].filteredProducts = matchedProducts;

    if (matchedProducts.length === 0) {
      rows[index].error = "Invalid product number";
    } else {
      rows[index].error = "";
    }
  }
  function clearSelectedProduct(index) {
    rows[index].sku = "";
    rows[index].size = "";
    rows[index].filteredProducts = [];
    rows[index].error = "";

    selectedProduct = null;
  }

  let selectedProducts = {}; 
  function selectProduct(product, index, size) {
    console.log("Starting selectProduct for index:", index);
    console.log("Previous selectedProducts:", selectedProducts);
    const currentQuantity = selectedProducts[index]?.quantity || 1;
    rows[index] = {
      ...rows[index],
      sku: `${product.productNumber} - ${size.break}`,
      size: size.break,
      filteredProducts: [],
      selectedSize: size.break,
      quantity: rows[index].quantity,
      selectedProduct: product,
    };
    selectedProducts[index] = {
      ...product,
      quantity: currentQuantity,
      size: size.break,
    };

    checkAvailability();
  }

  function clearSearch(index) {
    rows[index].sku = "";
    rows[index].filteredProducts = [];
    rows[index].error = "";
  }

  function incrementQuantity(index) {
    if (rows[index].quantity < 9999) {
      rows[index].quantity += 1;
    }
  }

  function decrementQuantity(index) {
    if (rows[index].quantity > 1) {
      rows[index].quantity -= 1;
    }
  }

  let cartSummary = {};

  // function showCartPopup(cartItems) {
  //   const cartPopup = document.getElementById("cart-popup");
  //   const cartItemsList = document.getElementById("cart-items-list");

  //   cartItemsList.innerHTML = "";

  //   const cartItemCount = cartItems.length;
  //   if (cartItemCount > 3) {
  //     cartItems.slice(0, 3).forEach((item, index) => {
  //       cartItemsList.innerHTML += `
  //               <div class="flex items-center gap-4 py-2">
  //                   <div class="font-medium">${index + 1}</div> 
                    
  //                   <img src="${item.image}" alt="${item.productName}" class="w-16 h-16 object-cover rounded-md" />

  //                   <div class="flex flex-col ml-4">
  //                       <p class="font-medium">${item.productName}</p>
  //                       <p>Quantity: ${item.quantity}</p>
  //                       <p>Total Price: ₹${(item.quantity * item.priceSize.price).toFixed(2)}</p>
  //                   </div>
  //               </div>
  //           `;
  //     });
  //     cartItemsList.innerHTML += `
  //           <div class="text-center mt-4">
  //               <p>You have ${cartItemCount} items in your cart. <a href="/cart" class="text-orange-500">See all your items</a></p>
  //           </div>
  //       `;
  //   } else {
  //     cartItems.forEach((item, index) => {
  //       cartItemsList.innerHTML += `
  //               <div class="flex items-center gap-4 py-2">
  //                   <div class="font-medium">${index + 1}</div> 
                    
  //                   <img src="${item.image}" alt="${item.productName}" class="w-16 h-16 object-cover rounded-md" />

  //                   <div class="flex flex-col ml-4">
  //                       <p class="font-medium">${item.productName}</p>
  //                       <p>Quantity: ${item.quantity}</p>
  //                       <p>Total Price: ₹${(item.quantity * item.priceSize.price).toFixed(2)}</p>
  //                   </div>
  //               </div>
  //               <hr class="my-2" />
  //           `;
  //     });
  //   }
  //   cartPopup.style.display = "flex";
  // }

  function closeCartPopup(event) {
    event.stopPropagation();

    const cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = "none";
  }

  function hideCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = "none";
  }

  function viewCart() {
    window.location.href = "/cart";
  }

  function continueShopping() {
    hideCartPopup();
  }
  $: {
    if (products && products.length > 0) {
      console.log("Products loaded:", products.length);
      console.log(
        "Sample product numbers:",
        products.slice(0, 5).map((p) => p.productNumber),
      );
    }
  }





  
  async function addManualEntriesToCart() {
    cartloading = true;
    const validRows = rows.filter((row) => {
      return row.sku.trim() !== "" && row.selectedSize;
    });

    if (validRows.length === 0) {
      cartloading = false;
      toast.error("No valid items to add to cart");
      return;
    }

    const cartItems = validRows
      .map((row) => {
        const productNumber = row.sku.split(" -")[0].trim();
        const validProduct = products.find(
          (p) =>
            String(p.productNumber).trim().toLowerCase() ===
            productNumber.toLowerCase(),
        );

        if (!validProduct) {
          toast.error(`Product ${productNumber} not found`);
          return null;
        }

        const sizePriceInfo = validProduct.pricing?.find(
          (item) =>
            item.break.trim().toLowerCase() ===
            row.selectedSize.trim().toLowerCase(),
        );

        if (!sizePriceInfo) {
          toast.error(
            `Size ${row.selectedSize} not available for ${productNumber}`,
          );
          return null;
        }
        const quantity =
          selectedProduct &&
          selectedProduct.productNumber === validProduct.productNumber
            ? selectedProduct.quantity
            : row.quantity > 0
              ? row.quantity
              : 1;

        return {
          id: validProduct.id,
          image: validProduct.image,
          productName: validProduct.productName,
          manufacturerId: validProduct.manufacturer,
          distributerId: validProduct.distributer,
          stockId: validProduct.stockId,
          stock: validProduct.stock,
          productId:validProduct.id,
          priceSize: {
            price: sizePriceInfo.price,
            size: row.selectedSize,
          },
          backOrder: Math.max(row.quantity - validProduct.stock),
          quantity: quantity || row.quantity > 0 ? row.quantity : 1,
        };
      })
      .filter(Boolean);

    if (cartItems.length === 0) {
      return;
    }

    const authedUser = data?.authedUser;

    if (authedUser && authedUser?.id) {
      const form = new FormData();
      form.append("cartItems", JSON.stringify(cartItems));
      cartloading = true;

      try {
        const response = await fetch("?/addToCart", {
          method: "POST",
          body: form,
        });

        const result = await response.json();
        cartloading = false;

        const resultData = JSON.parse(result.data);

        if (resultData && resultData[0]?.success === 1) {
          toast.success(resultData[2] || "Items added to cart successfully");
          rows = rows.map((row) => ({
            sku: "",
            size: "",
            quantity: 1,

            error: "",
            filteredProducts: [],
            selectedSize: "",
          }));

          // showCartPopup(cartItems);
        } else {
          toast.error(resultData[1] || "Failed to add items to cart");
          cartloading = false;
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add items to cart");
        cartloading = false;
      }
    } else {
      const simplifiedCartItems = cartItems.map(item => ({
      productId: item.productId,
      stockId: item.stockId,
      manufacturerId: item.manufacturerId,
      distributerId: item.distributerId,
      quantity: item.quantity,
      backOrder: item.backOrder

    }));
    rows = rows.map((row) => ({
            sku: "",
            size: "",
            quantity: 1,

            error: "",
            filteredProducts: [],
            selectedSize: "",
          }));
    localStorage.setItem("cart", JSON.stringify(simplifiedCartItems));
    toast.success("Items added to cart successfully.");
    // showCartPopup(cartItems);
    cartloading = false;
    }
  }

  function cart() {
    if (userLoggedIn) {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    }
  }
  onMount(() => {
    if (userLoggedIn) {
      cart();
    }
  });

  // function showDetails() {
  //   selectedProduct = { ...selectedProduct, quantity: 1 };
  //   showDetailsModal = true;
  // }

  const showDetails = (product) => {
    selectedProduct = product;
    showDetailsModal = true;
    console.log("Selected Product:", selectedProduct);
  };
  function addRows() {
    const newRows = Array(3).fill({
      sku: "",
      size: "",
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: null,
    });

    rows = [...rows, ...newRows.map((row) => ({ ...row }))];
  }
  function decreaseQuantity() {
    if (selectedProduct && selectedProduct.quantity > 1) {
      selectedProduct = {
        ...selectedProduct,
        quantity: selectedProduct.quantity - 1,
      };
      const rowIndex = rows.findIndex(
        (row) =>
          row.selectedProduct?.productNumber === selectedProduct.productNumber,
      );
      if (rowIndex !== -1) {
        rows[rowIndex] = {
          ...rows[rowIndex],
          quantity: selectedProduct.quantity,
        };
      }
    }
  }

  $: {
    rows.forEach((row, index) => {
      row.filteredProducts = filterProducts(row.sku);
    });
  }

  function hideDetails() {
    showDetailsModal = false;
    selectProduct = null;
  }

  function findProductBySku(sku) {
    const normalizedSku = sku.trim().toLowerCase();
    const lastHyphenIndex = normalizedSku.lastIndexOf("-");
    const productNumber =
      lastHyphenIndex !== -1
        ? normalizedSku.substring(0, lastHyphenIndex).trim()
        : normalizedSku;
    const size =
      lastHyphenIndex !== -1
        ? normalizedSku.substring(lastHyphenIndex + 1).trim()
        : "";

    let product = products.find(
      (product) =>
        String(product.productNumber).trim().toLowerCase() === productNumber,
    );
    if (product) {
      const sizePriceInfo = product.pricing?.find(
        (item) => item.break.toLowerCase() === size.toLowerCase(),
      );

      if (!sizePriceInfo) {
        return null;
      }
      return product;
    } else {
      return null;
    }
  }



  function increaseQuantity() {
    if (selectedProduct && selectedProduct.quantity < 9999) {
      selectedProduct = {
        ...selectedProduct,
        quantity: selectedProduct.quantity + 1,
      };
      const rowIndex = rows.findIndex(
        (row) =>
          row.selectedProduct?.productNumber === selectedProduct.productNumber,
      );
      if (rowIndex !== -1) {
        rows[rowIndex] = {
          ...rows[rowIndex],
          quantity: selectedProduct.quantity,
        };
      }
    }
  }
  let showCartMessage = false;
  let showQuoteModal = false;
  let productQuote = {};

  function toggleQuoteModal(selectedProduct) {
    showQuoteModal = !showQuoteModal;
    productQuote = selectedProduct;
  }
  const handleResendOtpemail = () => {
    if (!loadingotp) {
      form3.requestSubmit();
      // startTimer();
    }
  };
  let units = "";
  let firstName = "";
  let lastName = "";
  let organisation = "";
  let phone = "";
  let futherdetails = "";
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

    if (!futherdetails.trim()) {
      formErrors.futherdetails = "Further details are required.";
    } else if (/[\d]/.test(futherdetails)) {
      formErrors.futherdetails = "Further details cannot contain numbers.";
    } else if (/(<script.*?>.*?<\/script>|<.*?>)/gi.test(futherdetails)) {
      formErrors.futherdetails =
        "Further details should not contain HTML or script tags.";
    } else {
      delete formErrors.futherdetails;
    }

    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      formErrors.phone =
        "Enter a valid phone number with country code (e.g. +919876543210)";
    }

    if (!email.trim()) {
      formErrors.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      formErrors.email = "Please enter a valid email.";
    } else {
      delete formErrors.email;
    }

    return Object.keys(formErrors).length === 0;
  }

  const enhanceForm = (index) => {
    const requestStartTime = Date.now();
    loadingState[index] = true;
    const loadingStartTime = Date.now();
    return async ({ result }) => {


      let processingEndTime = 0;
      if (Array.isArray(result.data)) {
        products = [...products, ...result.data];
      }

      if (result && result.data) {
        if (result.data.length === 0) {
          toast.error("No Components found");
        } else {
          productNumbers = result.data.map((record) => record.productNumber);
        }
      } else {
        productNumbers = [];
        toast.error("No Components found");
      }

      const loadingEndTime = Date.now();
      loadingState[index] = false;

      const loadingDuration = (loadingEndTime - loadingStartTime) / 1000;

      processingEndTime = Date.now();
      const totalRequestDuration =
        (processingEndTime - requestStartTime) / 1000;

      rows.forEach((row, rowIndex) => {
        row.filteredProducts = filterProducts(row.sku);
      });
    };
  };
</script>

<div class="w-11/12 mx-auto py-5 px-2 md:flex md:space-x-8 max-w-7xl">
  <div class="md:w-full">
    <h1 class="font-bold text-lg md:text-2xl">Quick Order</h1>

    {#if !userLoggedIn}
      <div class="flex justify-normal md:justify-end">
        <div
          class="flex items-center gap-2 w-72 text-xs rounded-md p-3 border border-primary-100 shadow-sm bg-white shadow-primary-100 my-1"
        >
          <Icon
            icon="mingcute:warning-line"
            class="text-primary-500 text-4xl shrink-0"
          />
          <a href="/login"
            ><span class="hover:text-primary-600 text-primary-400"
              >Sign in
            </span> to import items from your recent orders and quotes.</a
          >
        </div>
      </div>
    {/if}

    <div class="my-4 lg:ml-4">
      <button
        on:click={() => (toggle = false)}
        class="px-5 py-2 text-sm font-semibold {toggle
          ? 'bg-primary-200'
          : 'bg-white border-b-2 border-primary-500 text-primary-500'}"
      >
        Manual Entry
      </button>
      <button
        on:click={() => (toggle = true)}
        class="px-5 py-2 text-sm font-semibold {toggle
          ? 'bg-white border-b-2 border-primary-500 text-primary-500'
          : 'bg-primary-200'}"
      >
        Bulk Upload
      </button>
    </div>

    <!-- svelte-ignore empty-block -->
    {#if toggle}
      <Bulkupload {data} />
    {:else}
      <div class="text-black text-sm md:ml-5">
        *Enter the product SKU (product number and pack size) and quantity for
        each item you would like to order.
      </div>
      <div class="mx-auto">
        {#each rows as row, index}
          <div class="flex w-full">
            <form
              class="w-1/2 sm:w-2/3 p-0 sm:p-4"
              id="form-{index}"
              action="?/quicksearch"
              method="POST"
              use:enhance={() => enhanceForm(index)}
            >
              <div class="flex sm:w-full items-center relative">
                <input
                  type="text"
                  name="quickSearch"
                  bind:value={row.sku}
                  placeholder="Product SKU-Size"
                  on:input={(event) => handleInput(event, row.sku, index)}
                  class="w-full hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 rounded px-2 items-center text-sm border-1 border-gray-200 transition duration-200"
                />

                {#if loadingState[index]}
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
                  >
                    <Icon
                      icon="line-md:loading-alt-loop"
                      class="w-4 h-4 mr-1 animate-spin"
                    />
                    Loading...
                  </span>
                {/if}

                {#if row.sku.length >= 2 && row.filteredProducts.length > 0}
                  <div
                    class="absolute top-full w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10"
                  >
                    <button
                      class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
                      on:click={() => clearSearch(index)}
                    >
                      <Icon icon="cuida:x-outline" class="w-5 h-5" />
                    </button>

                    {#each row.filteredProducts as result}
                      <div
                        class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer"
                      >
                        <div class="space-y-1 mt-2">
                          {#if result.pricing?.length > 0}
                            {#each result.pricing as size}
                              {#if size.break !== "N/A"}
                                <div class="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    class="form-radio rounded text-primary-600 sm:text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    id="size-{size.break}"
                                    name="size-{result.productNumber}"
                                    value={size.break}
                                    bind:group={row.selectedSize}
                                    checked={row.selectedSize ===
                                      `${result.productNumber}-${size.break}`}
                                    on:change={() =>
                                      selectProduct(result, index, size)}
                                  />
                                  <label for="size-{size.break}"
                                    >{result.productNumber} - {size.break}</label
                                  >
                                </div>
                              {/if}
                            {/each}
                          {:else}
                            <div class="flex items-center gap-2">
                              <input
                                type="radio"
                                class="form-radio rounded text-primary-600 mr-2 sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                                id="product-{result.productNumber}"
                                name="size-{result.productNumber}"
                                value={result.productNumber}
                                bind:group={row.selectedSize}
                                checked={row.selectedSize ===
                                  result.productNumber}
                                on:change={() =>
                                  selectProduct(result, index, { size: null })}
                              />
                              <label for="product-{result.productNumber}"
                                >{result.productNumber}</label
                              >
                            </div>
                          {/if}

                          {#if result.pricing?.every((size) => size.break === "N/A")}
                            <div class="flex items-center gap-2">
                              <input
                                type="radio"
                                class="form-radio rounded text-primary-600 sm:text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                                id="product-{result.productNumber}"
                                name="size-{result.productNumber}"
                                value={result.productNumber}
                                bind:group={row.selectedSize}
                                checked={row.selectedSize ===
                                  result.productNumber}
                                on:change={() =>
                                  selectProduct(result, index, { size: null })}
                              />
                              <label for="product-{result.productNumber}"
                                >{result.productNumber}</label
                              >
                            </div>

                            <div class="text-primary-600 mt-2">
                              Request a Quote
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </form>

            <div class="w-1/2 sm:w-1/3 ml-1 sm:p-4">
              <div class="flex">
                <div class="w-1/4">
                  <button
                    class="outline-none"
                    on:click={() => decrementQuantity(index)}
                    aria-label="Decrease Quantity"
                  >
                    <Icon
                      icon="ic:round-minus"
                      class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2"
                    />
                  </button>
                </div>
                <div class="w-1/2">
                  <input
                    type="text"
                    min="1"
                    bind:value={row.quantity}
                    class="w-3/4 sm:ml-1 ml-3 grow text-center border-1 border-gray-200 rounded bg-white font-medium h-10 outline-none py-2 hover:border-primary-400 focus:border-primary-400 focus:ring-0"
                    on:input={() =>
                      (row.quantity = Math.max(
                        1,
                        Math.min(9999, row.quantity),
                      ))}
                    aria-label="Quantity"
                    readonly
                  />
                </div>
                <div class="w-1/4">
                  <button
                    class="outline-none"
                    on:click={() => incrementQuantity(index)}
                    aria-label="Increase Quantity"
                  >
                    <Icon
                      icon="ic:round-plus"
                      class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2"
                    />
                  </button>
                </div>
              </div>

              {#if row.selectedSize === null && row.sku.trim() !== ""}
                <span class="text-red-500 font-medium"
                  >Cannot be added to the cart</span
                >
              {:else}{/if}
            </div>
          </div>

          {#if cartNotification}
            <div
              class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50"
            >
              {cartNotification}
            </div>
          {/if}

          {#if row.error}
            <div class="text-red-500 ml-5 text-medium mt-2">
              {row.error}
            </div>
          {/if}
          {#if row.sku}
            <!-- <div class="mb-2">
            {row.sku.substring(0, row.sku.lastIndexOf("-")).trim()}
          </div> -->

            {#if row.selectedProduct}
              <div
                class="w-full ml-5 gap-4 items-start flex flex-col md:flex-row lg:flex-row xl:flex-row"
              >
                <!-- Product Name -->
                <span class="font-semibold text-sm">
                  {row.selectedProduct.productName}
                </span>

                <!-- Size -->
                <span>
                  Size: {row.selectedSize || "No Size Available"}
                </span>

                <!-- Price or Quote Request -->
                <span>
                  {#if row.selectedProduct.pricing?.[0]?.price}
                    ₹{row.selectedProduct.pricing[0].price}
                  {:else}
                    <button
                      on:click={() => toggleQuoteModal(row.selectedProduct)}
                      class="text-primary-400 hover:underline"
                    >
                      Request a Quote
                    </button>
                  {/if}
                </span>
                <span>
                  1 Estimated to ship on {estimatedShipDate}
                </span>

                <!-- Details Button -->
                <button
                  class=" text-primary-400 rounded"
                  on:click={() =>
                    showDetails({
                      productName: row.selectedProduct.productName,
                      productNumber: row.selectedProduct.productNumber,
                      quantity: row.quantity || 1,
                    })}
                >
                  Details
                </button>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class=" text-red-500 cursor-pointer hover:scale-105"
                  on:click={() => clearSelectedProduct(index)}
                >
                  <Icon icon="mdi:close-circle" class="w-6 h-6" />
                </div>
              </div>
              <hr />
            {/if}
          {/if}
        {/each}
        <div
          class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54"
        >
          <button on:click={addRows} class="text-primary-500 text-md mt-6 ml-5">
            + Add More</button
          >

          <button
            on:click={addManualEntriesToCart}
             class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
          >
            {#if cartloading}
              <span>Adding...</span>
            {:else}
              <Icon icon="ic:round-shopping-cart" class="text-2xl" />
              <span>Add to Cart</span>
            {/if}
          </button>
        </div>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- <div
        id="cart-popup"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        style="display: none;"
        on:click={closeCartPopup}
      >
     
        <div
          class="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative"
          on:click|stopPropagation
        >
          <button
            on:click={closeCartPopup}
            class="absolute top-4 right-4 text-primary-500 hover:scale-105"
          >
            <span
              class="text-xl font-semibold text-primary-500 hover:scale-105"
            >
              ✖
            </span>
          </button>

          <div class="flex flex-col items-center">
            <h3 class="text-xl font-semibold mb-4">Items Added to Cart</h3>
            <div id="cart-items-list" class="mb-4"></div>
            <div class="flex justify-end gap-5 mt-6 pt-3 border-t">
              <button
                on:click={continueShopping}
                class="bg-primary-500 text-white px-5 py-1.5 rounded font-normal hover:bg-primary-600 transition-all ease-in-out duration-300 shadow-sm"
              >
                Continue Shopping
              </button>
              <a href="/cart">
                <button
                  on:click={viewCart}
                  class="text-primary-600 px-5 py-1.5 rounded font-normal flex gap-2 border-1 border-primary-600 hover:bg-primary-600 hover:text-white transition-all ease-in-out duration-300 shadow-sm"
                >
                  View Cart
                  <Icon icon="mdi:cart" width="20" height="20" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div> -->
    {/if}
  </div>

  <!-- {#if userLoggedIn}
    <div
      class="w-full sm:w-full md:w-1/4 lg:w-1/4 h-1/2 ml-0 sm:ml-0 mt-8 md:mt-24 bg-gray-50 border rounded-lg border-gray-400 p-4"
    >
      <h2 class="font-semibold text-xl mb-2">
        Hello,
      </h2>

      <div class="mb-2">
        <div class="flex items-center space-x-2">
          <h3 class="font-semibold text-lg">Saved Carts</h3>
          <button
            class="text-primary-500"
            on:click={() => (showSavedCarts = !showSavedCarts)}
          >
            <Icon
              icon={showSavedCarts
                ? "iconamoon:arrow-up-2-duotone"
                : "iconamoon:arrow-down-2-duotone"}
              class="text-3xl"
            />
          </button>
        </div>

        {#if showSavedCarts}
          {#if cart.length > 0}
            <ul>
              {#if cart.length <= 3}
                {#each cart as cartItem}
                  <li class="text-sm mt-2 text-gray-700">
                    {cartItem.name} ({cartItem.quantity} items)
                  </li>
                {/each}
              {:else}
                <li class="mt-1">
                  <button class="text-primary-400 font-semibold">
                    You have {cart.length} items
                  </button>
                </li>
                <li>
                  <a
                    href="/cart"
                    class="text-primary-400 hover:underline font-semibold"
                    >See your items</a
                  >
                </li>
              {/if}
            </ul>
          {:else}
            <p class="text-sm text-gray-500">No saved carts found.</p>
          {/if}
        {/if}
      </div>

      <div class="flex items-center space-x-2">
        <h3 class="font-semibold text-lg">Lists</h3>
        <button
          class="text-primary-500"
          on:click={() => (showLists = !showLists)}
        >
          <Icon
            icon={showLists
              ? "iconamoon:arrow-up-2-duotone"
              : "iconamoon:arrow-down-2-duotone"}
            class="text-3xl"
          />
        </button>
      </div>
      {#if showLists}
        <a href="/lists" class="text-gray-500">See Lists# </a>
      {/if}
      <div class="flex items-center space-x-2 mt-2">
        <h3 class="font-semibold text-lg">Quotes</h3>
        <button
          class="text-primary-500"
          on:click={() => (showquotes = !showquotes)}
        >
          <Icon
            icon={showquotes
              ? "iconamoon:arrow-up-2-duotone"
              : "iconamoon:arrow-down-2-duotone"}
            class="text-3xl"
          />
        </button>
      </div>
      {#if showquotes}
        <a href="/quotes" class="text-gray-500">See Quotes # </a>
      {/if}
    </div>
  {/if} -->

  {#if showDetailsModal && selectedProduct}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="fixed inset-0 !ml-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      on:click|self={hideDetails}
    >
      <div
        class="bg-white p-8 rounded-lg relative shadow-lg max-w-lg mx-4"
        on:click|self={hideDetails}
      >
        <button
          class=" absolute top-2 right-2 hover:scale-105 text-primary-500 font-semibold transition duration-300 ease-in-out"
          on:click={hideDetails}
          aria-label="Close"
        >
          ✖
        </button>

        <h3 class="text-2xl font-semibold mb-4 text-gray-800">
          {selectedProduct.productName} - {selectedProduct.productNumber}
        </h3>
        <p class="text-sm text-gray-600 mb-5">
          Enter quantity to check availability and estimated ship date.
        </p>

        <form
          method="POST"
          action="?/quickcheck"
          use:enhance={() => {
            return async ({ result }) => {
              stockStatus = result.data.record.message;
            };
          }}
        >
          <div class="flex items-center gap-4 mb-6">
            <input
              type="hidden"
              name="ProductId"
              value={selectedProduct.productNumber}
            />

            <button
              class="flex justify-center items-center w-10 h-10 bg-white text-primary-500 rounded-lg border border-gray-300 hover:bg-primary-50 transition"
              on:click|preventDefault={decreaseQuantity}
            >
              <Icon icon="ic:round-minus" class="text-xl" />
            </button>

            <input
              type="text"
              name="quantity"
              bind:value={selectedProduct.quantity}
              class="w-16 h-10 text-center p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
              on:input={() => {
                if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
                if (selectedProduct.quantity > 9999)
                  selectedProduct.quantity = 9999;
              }}
            />

            <button
              class="flex justify-center items-center w-10 h-10 bg-white text-primary-500 rounded-lg border border-gray-300 hover:bg-primary-50 transition"
              on:click|preventDefault={increaseQuantity}
            >
              <Icon icon="ic:round-plus" class="text-xl" />
            </button>

            <button
              class="flex justify-center text-sm items-center w-36 h-10 text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition"
              type="submit"
            >
              Check Availability
            </button>
          </div>
        </form>

        <p class="mt-4 text-sm text-gray-600 flex items-center">
          <span class="ml-2">{stockStatus}</span>
        </p>

        {#if selectedProduct.stockType === "success"}
          <div class="mt-4 text-sm text-green-600">
            <p>{selectedProduct.stockAvailability}</p>
          </div>
        {:else if selectedProduct.stockType === "error"}
          <div class="mt-4 text-sm text-red-600">
            <p>{selectedProduct.stockAvailability}</p>
          </div>
        {/if}

        <button
          class="mt-6 w-full sm:w-auto p-3 text-white bg-primary-500 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition"
          on:click={() => {
            addManualEntriesToCart(rows, products);
            showCartMessage = true;
            hideDetails();
          }}
        >
          <Icon icon="ic:round-shopping-cart" class="text-2xl" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  {/if}

  {#if showQuoteModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class=" !ml-0 fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      on:click={() => (showQuoteModal = false)}
    >
    <div
    class="bg-white rounded-lg w-full md:w-2/5 max-h-full overflow-y-auto p-4 md:p-6  m-4 md:m-0"
    on:click|stopPropagation
  >
        <h2 class="text-xl font-semibold mb-4 text-primary-400">
          Request a Quote
        </h2>
        <form
          method="POST"
          action="?/createQuote"
          use:enhance={(event) => {
            submitting = true;
            if (!validateForm()) {
              submitting = false;
              toast.error("Please fix the errors before submitting.");
              event.preventDefault();
              return;
            }
            if (!ProfileEmailVerified && !authedUserEmailVerified) {
    submitting = false;
    toast.error("Please verify your email to proceed.");
    event.preventDefault(); 
    return;
  }

            return async ({ result }) => {
              // console.log(result, "result");
              submitting = false;
              if (result.status === 200) {
                toast.success("Submitted the quotes successfully!");
                errorMessage = "";
                setTimeout(() => {
                  location.reload();
                }, 2000);
              } else {
                successMessage = "";
                toast.error("Error creating Quote");
                submitting = false;
              }

              await applyAction(result);
            };
          }}
        >
          {#if productQuote}
            <div class="mb-4">
              <p><strong>Product Name:</strong> {productQuote.productName}</p>
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
              class="w-full px-4 py-2 border border-gray-300 hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 rounded-md mt-1"
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
            <label
              for="Firstname"
              class="block text-sm font-medium text-gray-700">First Name</label
            >
            <input
              type="text"
              name="Firstname"
              bind:value={firstName}
              class="w-full px-4 py-2 borderhover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
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
            <label
              for="lastname"
              class="block text-sm font-medium text-gray-700">Last Name</label
            >
            <input
              type="text"
              name="lastname"
              bind:value={lastName}
              class="w-full px-4 py-2 border hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
              placeholder="Last Name"
              on:input={() => {
                if (!lastName.trim()) {
                  formErrors.lastName = "Last name is required.";
                } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
                  formErrors.lastName =
                    "Last name should contain only letters.";
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
              class="block text-sm font-medium text-gray-700"
              >Organisation</label
            >
            <input
              type="text"
              name="organisation"
              bind:value={organisation}
              class="w-full px-4 py-2 border hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
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
              class="w-full px-4 py-2 border hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
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
            <form
            action="?/verifyemail"
            bind:this={form3}
            method="POST"
            use:enhance={({}) => {
              return async ({ result }) => {
                isLoading = false;
                console.log('result', result);
                if (result.data?.status === 200) {
                  ProfileEmailVerified = result.data.isEmailVerified;
                  if (authedUserEmailVerified === true) {
                    ProfileEmailVerified = true;
                  }

                  verificationMessage = result.data.message;

                  if (
                    verificationMessage.includes(
                      'Verification email sent successfully. Please check your inbox.'
                    )
                  ) {
                    displayMessage = 'Please check your inbox.';
                    emailSent = true;
                    enteredOtp = '';
                    isOtpVerified = false;
                  } else {
                    displayMessage = verificationMessage;
                    emailSent = false;
                    isOtpVerified = false;
                  }

                  toast.success(verificationMessage);
                } else {
                  toast.error(result.data.message);
                  ProfileEmailVerified = result.data.isEmailVerified;
                  emailSent = false;
                }
              };
            }}
            class="flex w-full items-center"
            on:submit={() => {
              isLoading = true;
            }}
          >
          <div class="relative w-full">
            <input
              type="email"
              name="email"
              bind:value={email}
              class="w-full px-4 py-2 border hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
              placeholder="Your email"
              on:input={() => {
                if (!email.trim()) {
                  formErrors.email = "Email is required.";
                } else if (
                  !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                    email,
                  )
                ) {
                  formErrors.email = "Please enter a valid email address.";
                } else {
                  formErrors.email = "";
                }
                ProfileEmailVerified = false;
															emailSent = false;
															authedUserEmailVerified = false;
              }}
            />
            {#if isLoading}
            <span
              class="absolute right-2 top-1/2 mt- transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
            >
              <Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1" />
              Verifying...
            </span>
          {:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data?.isEmailVerified !== true}
            <button
              type="submit"
               class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
              disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                email
              ) || email.split('@')[1].includes('gamil')}
            >
              Verify
            </button>
          {:else if emailSent}
            <span
              class="absolute right-2 mt- top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
            >
              {#if isOtpVerified}
                Verified
                <Icon
                  icon="material-symbols:verified-rounded"
                  class="w-4 h-4 mt-2 ml-1"
                />
              {:else}
                <Icon icon="fluent:mail-all-read-16-filled" class="w-4  h-4 mr-1" />
                Check your inbox
              {/if}
            </span>
          {:else}
            <span
              class="absolute right-2  top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
            >
              Verified
              <Icon icon="material-symbols:verified-rounded" class="w-4 h-4 ml-1" />
            </span>
          {/if}
          </div>
            </form>
            {#if formErrors.email}
              <p class="text-red-500 text-xs">{formErrors.email}</p>
            {/if}
            {#if emailSent && isOtpVerified === false}
            <br />
            <form
              action="?/verifyOtpEmail"
              method="POST"
              use:enhance={() => {
                return async ({ result }) => {
                  // console.log(result);
                  loadingotp = false;
                  if (result.status === 200) {
                    if (result.data.status === 200) {
                      const verifiedMessage = result.data.message;
                      toast.success(verifiedMessage);

                      isOtpVerified = result.data.isEmailVerified;
                      enteredOtpemail = '';
                      isOtpVerified = true;
                      ProfileEmailVerified = true;
                      console.log(isOtpVerified, 'isOtpVerified');
                    } else {
                      const errorMessage =
                        result.data.message || 'An unknown error occurred!';
                      toast.error(errorMessage);
                    }
                  } else {
                    const errorMessage =
                      result.data.message || 'Request failed. Please try again.';
                    toast.error(errorMessage);
                  }
                };
              }}
              on:submit={() => {
                loadingotp = true;
              }}
            >
              <div class="relative w-full">
                <input type="hidden" name="email" id="email" bind:value={email} />
                <input
                  type="text"
                  name="enteredOtp"
                  bind:value={enteredOtpemail}
                  placeholder="Enter 6-digit OTP"
                  class="w-full placeholder:text-xs text-sm px-2 py-2 rounded bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
                  on:input={() => {
                    enteredOtpemail = enteredOtpemail.trim();
                  }}
                />
                <button
                  type="submit"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-600 font-bold text-2s py-1 rounded hover:underline"
                  disabled={loadingotp}
                >
                  <!-- {loadingotp ? 'Verifying...' : 'Verify'} -->
                  {#if loadingotp}
                    <span
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
                    >
                      <Icon
                        icon="line-md:loading-alt-loop"
                        class="w-4 h-4 mr-1 animate-spin"
                      />
                      Verifying...
                    </span>
                  {:else}
                    Verify
                  {/if}
                </button>
              </div>
              <div class="flex justify-end text-sm">
                <p class="mt-px text-2s text-right text-gray-600">
                  Didn't receive the code?
                  <button
                    type="button"
                    on:click={handleResendOtpemail}
                    disabled={loadingotp}
                    class="text-medium text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get a new code
                  </button>
                </p>
              </div>

            </form>
          {/if}
          </div>
          <div class="mb-4">
            <label
              for="futherdetails"
              class="block text-sm font-medium text-gray-700">Message</label
            >
            <textarea
              class="w-full px-4 py-2 border hover:border-primary-500 h-10 focus:border-primary-400 focus:outline-none focus:ring-0 border-gray-300 rounded-md mt-1"
              placeholder="Your message"
              name="futherdetails"
              bind:value={futherdetails}
              on:input={() => {
                formErrors.futherdetails = "";

                if (!futherdetails.trim()) {
                  formErrors.futherdetails = "Further details are required.";
                } else if (!/^[A-Za-z0-9\s]+$/.test(futherdetails)) {
                  formErrors.futherdetails =
                    "Further details should contain only letters, numbers, and spaces.";
                } else if (
                  /(<script.*?>.*?<\/script>|<.*?>)/gi.test(futherdetails)
                ) {
                  formErrors.futherdetails =
                    "Further details should not contain HTML or script tags.";
                } else {
                  formErrors.futherdetails = "";
                }
              }}
            ></textarea>
            {#if formErrors.futherdetails}
              <p class="text-red-500 text-xs">{formErrors.futherdetails}</p>
            {/if}
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
              {#if submitting}
                Submitting...
              {:else}
                Submit
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
