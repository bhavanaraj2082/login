<script>
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";
  import { enhance, applyAction } from "$app/forms";
  import { currencyState } from "$lib/stores/mainStores.js";
  import { cartState } from "$lib/stores/cartStores.js";
  import Bulkupload from "./Bulkupload.svelte";
  import { toast } from "svelte-sonner";
  let uploadedRows = [];
  let showSavedCarts = false;
  // console.log(currencyState, "currencyState");
  export let data;
  let cartPopupItems;
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  let isLoadingPhone = false;
  let showCartPopupdetail = false;

  let submitting = false;
  let isEmailVerified = false;
  let cartloading = false;
  let loadingotp = false;
  let loadingPhone = false;
  let isLoading = false;
  let ProfileEmailVerified;
  let authedUserEmailVerified = data?.profile?.isEmailVerified;
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
  let selectedProductIndex = null;

  let showDetailsModal = false;
  let fileError = "";
  let cartNotification = "";
  let notificationTimeout;
  let productNumbers = "";
  let inputValue = "";
  let isCartPopupVisible = false;
  let cartPopupItem = null;
  let cartPopupOverlay;

  const showCartPopup = (cartItems) => {
    cartPopupItems = Array.isArray(cartItems) ? [...cartItems] : [cartItems];
    isCartPopupVisible = true;
  };
  function showCartPopupdetails(cartItem) {
    cartPopupItems = [cartItem];
    isCartPopupVisible = true;
  }

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

  let email = data?.authedUser?.email || "";

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
    let value = event.target.value.trim();
    rows[index].sku = value;
    searchQuery = value;

    if (value.length > 2) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const form = document.querySelector(`#form-${index}`);
        if (form) {
          form.requestSubmit();
        }

        rows[index].filteredProducts = filterProducts(value);
      }, 300);
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
    console.log(product,"product");
    
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

  function hideCartPopup() {
    isCartPopupVisible = false;
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
  let cartRowIndexToBeCleared = null;

  let cartItemsValue = "";

  function updateCartItemsValue() {
    cartItemsValue = JSON.stringify([prepareCartItem()]);
    console.log("Updated cartItemsValue:", cartItemsValue);
  }
  function closeCartPopup(event) {
    event.stopPropagation();

    const cartPopup = document.getElementById("cart-popup");
    // console.log("Closing cart popup for index:", cartRowIndexToBeCleared);

    cartPopup.style.display = "none";
    clearSelectedRow(cartRowIndexToBeCleared);
    cartRowIndexToBeCleared = null;
  }
  function clearSelectedRow(index) {
    if (
      index !== undefined &&
      index !== null &&
      index >= 0 &&
      index < rows.length
    ) {
      console.log("Clearing row at index:", index);
      rows[index] = {
        sku: "",
        size: "",
        quantity: 1,
        error: "",
        filteredProducts: [],
        selectedSize: "",
        selectedProduct: null,
      };
      rows = [...rows];
    } else {
      // console.log("Index is undefined, cannot clear product.");
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
          productId: validProduct.id,
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
      const simplifiedCartItems = cartItems.map((item) => ({
        productId: item.productId,
        manufacturerId: item.manufacturerId,
        stockId: item.stockId,
        distributorId: item.distributerId,

        quantity: item.quantity,
        backOrder: item.backOrder,
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

  const showDetails = (index, product) => {
    selectedProduct = product;
    selectedProductIndex = index;
    showDetailsModal = true;
    console.log("Selected Product:", selectedProduct);
    console.log("Selected Product Index:", selectedProductIndex);
    updateCartItemsValue();
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
  function increaseQuantity() {
    if (selectedProduct && selectedProduct.quantity < 9999) {
      selectedProduct = {
        ...selectedProduct,
        quantity: selectedProduct.quantity + 1,
      };

      if (selectedProductIndex !== undefined && selectedProductIndex !== null) {
        const updatedRows = [...rows];
        if (updatedRows[selectedProductIndex]) {
          updatedRows[selectedProductIndex] = {
            ...updatedRows[selectedProductIndex],
            quantity: selectedProduct.quantity,
          };
          rows = updatedRows;
        }
      }
      updateCartItemsValue();
    }
  }

  function decreaseQuantity() {
    if (selectedProduct && selectedProduct.quantity > 1) {
      selectedProduct = {
        ...selectedProduct,
        quantity: selectedProduct.quantity - 1,
      };
      if (selectedProductIndex !== undefined && selectedProductIndex !== null) {
        const updatedRows = [...rows];
        if (updatedRows[selectedProductIndex]) {
          updatedRows[selectedProductIndex] = {
            ...updatedRows[selectedProductIndex],
            quantity: selectedProduct.quantity,
          };
          rows = updatedRows;
        }
      }
      updateCartItemsValue();
    }
  }

  $: {
    rows.forEach((row, index) => {
      row.filteredProducts = filterProducts(row.sku);
    });
  }
  function formatPrice(price, quantity = 1) {
    if (price === undefined || price === null) return "";

    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    const numQuantity =
      typeof quantity === "string" ? parseFloat(quantity) : quantity;
    if (isNaN(numPrice) || isNaN(numQuantity)) return "";
    const total = numPrice * numQuantity;
    return total.toFixed(2);
  }

  function hideDetails() {
    showDetailsModal = false;
    // selectProduct = null;
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

  let showCartMessage = false;
  let showQuoteModal = false;
  let productQuote = {};

  // function toggleQuoteModal(selectedProduct) {
  //   console.log(selectProduct,"selectedProduct");
    
  //   showQuoteModal = !showQuoteModal;
  //   productQuote = selectedProduct;
  // }
  function toggleQuoteModal(index, selectedProduct) {
  console.log("Index:", index);  
  console.log("Selected Product:", selectedProduct);  

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
        console.log(result, "result");

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
  const closeCartPopDetails = (index) => {
    const cartPopup = document.getElementById("cart-popup-details");
    if (cartPopup) {
      cartPopup.style.display = "none";
    }
    clearSelectedProductcart(index);
  };

  const clearSelectedProductcart = (index) => {
    if (typeof index === "undefined") {
      console.error("Index is undefined, cannot clear product.");
      return;
    }
    console.log("Rows:", rows);
    console.log("Index:", index);

    if (rows && index >= 0 && index < rows.length) {
      rows[index].sku = "";
      rows[index].size = "";
      rows[index].filteredProducts = [];
      rows[index].error = "";
      rows[index].quantity = 1;
      if (selectedProducts && selectedProducts[index]) {
        selectedProducts[index].quantity = 1;
      }

      console.log(`Row at index ${index} after reset:`, rows[index]);
    }
    selectedProduct = null;
    console.log("Selected Product after reset:", selectedProduct);
  };
  let currency = "inr";

  let form;

  function prepareCartItem() {
    const productToAdd = products.find(
      (p) => p.productNumber === selectedProduct.productNumber,
    );
    const currentIndex = selectedProductIndex;
    console.log(currentIndex, "currentIndex");

    if (!productToAdd) {
      toast.error(`Product ${selectedProduct.productNumber} not found`);
      return null;
    }

    const size = selectedProduct.size || "default";
    const Price = selectedProduct.price || 0;
    const quantity =
      selectedProduct.quantity > 0 ? selectedProduct.quantity : 1;

    return {
      id: productToAdd.id,
      description: productToAdd.prodDesc,
      productName: productToAdd.productName,
      image: productToAdd.image,
      productNumber: productToAdd.productNumber,
      manufacturerId: productToAdd.manufacturer,
      distributerId: productToAdd.distributer,
      stockId: productToAdd.stockId,
      stock: productToAdd.stock,
      productId: productToAdd.id,
      usdPrice: selectedProduct.usdPrice,
      inrPrice: selectedProduct.inrPrice,
      size: size,

      backOrder: Math.max(quantity - productToAdd.stock) || 0,
      quantity: quantity,
      rowIndex: currentIndex,
    };
  }
  function handleLocalCart() {
    const cartItem = prepareCartItem();
    const currentIndex = selectedProductIndex;
    console.log(currentIndex, "currentIndex");
    if (!cartItem) return;

    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    const simplifiedCartItem = {
      productId: cartItem.productId,
      manufacturerId: cartItem.manufacturerId,
      stockId: cartItem.stockId,
      distributorId: cartItem.distributerId,
      quantity: cartItem.quantity,
      backOrder: cartItem.backOrder,
    };

    const existingItemIndex = currentCart.findIndex(
      (item) => item.productId === cartItem.productId,
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity = cartItem.quantity;
      currentCart[existingItemIndex].backOrder = cartItem.backOrder;
      toast.success(`Product added to the cart`);
      showCartPopupdetails(cartItem);
    } else {
      currentCart.push(simplifiedCartItem);
      toast.success(`Product added to the cart`);
      showCartPopupdetails(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    cartRowIndexToBeCleared = currentIndex;
    showCartPopupdetails(cartItem);
    // showCartPopup(cartItem);

    setTimeout(() => {
      clearSelectedProductcart(cartRowIndexToBeCleared);
    }, 1000);

    showCartMessage = true;
  }

  let manualEntriesForm;


  function prepareManualEntriesToCart() {
    const validRows = rows.filter((row) => {
      return row.sku.trim() !== "" && row.selectedSize;
    });

    if (validRows.length === 0) {
      toast.error("No valid items to add to cart");
      return [];
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
          cartloading = false;
          return null;
        }

        const sizePriceInfo = validProduct.pricing?.find(
          (item) =>
            item.break.trim().toLowerCase() ===
            row.selectedSize.trim().toLowerCase(),
        );

        if (!sizePriceInfo) {
          toast.error(
            `Product ${validProduct.productNumber} cannot be added to cart because size ${row.selectedSize} is invalid`,
          );
          cartloading = false;
          return null;
        }

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
          productNumber: validProduct.productNumber,
          manufacturerId: validProduct.manufacturer,
          distributerId: validProduct.distributer,
          stockId: validProduct.stockId,
          stock: validProduct.stock,
          productId: validProduct.id,
          priceSize: {
            price: sizePriceInfo.price,
            size: row.selectedSize,
          },
                   usdPrice:
            validProduct.pricing.find((p) => p.break === row.selectedSize)
              ?.usd || "N/A",
          inrPrice:
            validProduct.pricing.find((p) => p.break === row.selectedSize)
              ?.inr || "N/A",
          size: row.selectedSize,
          backOrder: Math.max(row.quantity - validProduct.stock),
          quantity: quantity || row.quantity > 0 ? row.quantity : 1,
        };
      })
      .filter(Boolean);
    if (cartItems.length === 0) {
      return;
    }

    return cartItems;
  }

  function resetRows() {
    rows = rows.map(() => ({
      sku: "",
      size: "",
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: "",
    }));
  }

  // function handleLocalManualEntries() {
  //   const cartItems = prepareManualEntriesToCart();
  //   if (cartItems.length === 0) return;
  //   let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  //   const simplifiedCartItems = cartItems.map((item) => ({
  //     productId: item.productId,
  //     manufacturerId: item.manufacturerId,
  //     stockId: item.stockId,
  //     distributorId: item.distributerId,
  //     quantity: item.quantity,
  //     backOrder: item.backOrder,
  //   }));
  //   const existingItemIndex = currentCart.findIndex(
  //   (item) => item.productId === cartItems.productId,
  // );
  // console.log(existingItemIndex,"existingItemIndex");

  // if (existingItemIndex > -1) {
  //   currentCart[existingItemIndex].quantity = cartItems.quantity;
  //   currentCart[existingItemIndex].backOrder = cartItems.backOrder;
  //   toast.success(`Product added to the cart`);
  //   showCartPopup(cartItems);

  // } else {
  //   currentCart.push(simplifiedCartItems);
  //   toast.success(`Product added to the cart`);
  //   showCartPopup(cartItems);
  // }

  // localStorage.setItem("cart", JSON.stringify(currentCart));
  // showCartPopup(cartItems);

  // setTimeout(() => {
  //     resetRows();
  //           }, 1000);
  //   showCartMessage = true;

  //   cartloading = false;
  // }

  function handleLocalManualEntries() {
    const cartItems = prepareManualEntriesToCart();
    if (cartItems.length === 0) return;

    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    for (const item of cartItems) {
      const simplifiedItem = {
        productId: item.productId,
        manufacturerId: item.manufacturerId,
        stockId: item.stockId,
        distributorId: item.distributerId,
        quantity: item.quantity,
        backOrder: item.backOrder,
      };

      const existingItemIndex = currentCart.findIndex(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItemIndex > -1) {
        // Update existing item
        currentCart[existingItemIndex].quantity = item.quantity;
        currentCart[existingItemIndex].backOrder = item.backOrder;
      } else {
        // Add new item
        currentCart.push(simplifiedItem);
      }
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    toast.success(`Product added to the cart`);
    if (typeof showCartPopup === "function") {
      showCartPopup(cartItems);
    } else {
      console.error("showCartPopup is not a function:", showCartPopup);
    }

    setTimeout(() => {
      resetRows();
    }, 1000);

    showCartMessage = true;
    cartloading = false;
  }
  function handleManualEntriesSubmit() {
    cartloading = true;
    const cartItems = prepareManualEntriesToCart();
    if (cartItems.length === 0) {
      cartloading = false;
      return;
    }
    if (manualEntriesForm) {
      const input = manualEntriesForm.querySelector('input[name="cartItems"]');
      input.value = JSON.stringify(cartItems);
      manualEntriesForm.requestSubmit();
    }
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
  let popupQuantity = 1;
  // function handlePopupInput(event) {
  //   const value = parseInt(event.target.value, 3);
  //   if (isNaN(value)) {
  //     popupQuantity = 1;
  //   } else {
  //     if (value < 1) {
  //       popupQuantity = 1;
  //     } else if (value > 999) {
  //       popupQuantity = 999;
  //     } else {
  //       popupQuantity = value;
  //     }
  //   }
  //   selectedProduct.quantity = popupQuantity;
  // }
  function handlePopupInput(event) {
    // Ensure we're using base 10 for parsing
    const value = parseInt(event.target.value, 10);

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
    selectedProduct.quantity = popupQuantity;
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
          <!-- <a href="/login"> -->
          <a href="/signin">
            <span class="hover:text-primary-600 text-primary-400">
              Sign In
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
                                    selectProduct(result, index,size)}
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
on:change={() => selectProduct(result, index, { break: null })}
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
                             on:change={() => selectProduct(result, index, { break: null })}
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
                  <!-- <input
                  type="text"
                  min="1"
                  bind:value={row.quantity}
                  class="w-3/4 sm:ml-1 ml-3 grow text-center border-1 border-gray-200 rounded bg-white font-medium h-10 outline-none py-2 hover:border-primary-400 focus:border-primary-400 focus:ring-0"
                  on:input={(e) => {
                    row.quantity = Math.max(1, Math.min(999, parseInt(e.target.value) || 1));
                    handlePopupInput(e);
                  }}
                  aria-label="Quantity"
                  max="999"
                /> -->
                  <input
                    type="text"
                    min="1"
                    maxlength="3"
                    bind:value={row.quantity}
                    class="w-3/4 sm:ml-1 ml-3 grow text-center border-1 border-gray-200 rounded bg-white font-medium h-10 outline-none py-2 hover:border-primary-400 focus:border-primary-400 focus:ring-0"
                    on:focus={(e) => {
                      const currentValue = e.target.value;

                      e.target.value = "";
                      setTimeout(() => {
                        e.target.select();
                      }, 10);
                    }}
                    on:blur={(e) => {
                      if (!e.target.value || e.target.value === "0") {
                        e.target.value = "1";
                        row.quantity = 1;
                        handlePopupInput({ target: { value: "1" } });
                      }
                    }}
                    on:input={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      if (e.target.value.length > 4) {
                        e.target.value = e.target.value.slice(0, 4);
                      }

                      if (e.target.value.startsWith("0")) {
                        e.target.value = "1";
                      }
                      const parsedValue = parseInt(e.target.value, 10) || 1;
                      row.quantity = Math.max(1, Math.min(999, parsedValue));
                      handlePopupInput(e);
                    }}
                    aria-label="Quantity"
                    max="999"
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
            {#if row.selectedProduct && !loadingState[index]}
              <div
                class="w-full ml-5 gap-4 items-start flex flex-col md:flex-row lg:flex-row xl:flex-row"
              >
                <span class="font-semibold text-sm">
                  {row.selectedProduct.productName}
                </span>
                <span>
                  Size: {row.selectedSize || "No Size Available"}
                </span>
                <span>
                  {#if row.selectedProduct.pricing?.[0]?.usd || row.selectedProduct.pricing?.[0]?.inr}
                    {#if $currencyState === "usd"}
                      $ {row.selectedProduct.pricing[0]?.usd}
                    {:else}
                      ₹ {row.selectedProduct.pricing[0]?.inr}
                    {/if}
                  {:else}
                    <button
                      on:click={() => toggleQuoteModal(index,row.selectedProduct)}
                      class="text-primary-400 hover:underline"
                    >
                      Request a Quote
                    </button>
                  {/if}
                </span>

                {#if row.selectedProduct.pricing?.[0]?.usd || row.selectedProduct.pricing?.[0]?.inr}
                  <span>
                    1 Estimated to ship on {estimatedShipDate}
                  </span>

                  <button
                    class="text-primary-400 rounded"
                    on:click={() => {
                      const usdPrice = row.selectedProduct.pricing[0].usd;
                      const inrPrice = row.selectedProduct.pricing[0].inr;

                      showDetails(index, {
                        productName: row.selectedProduct.productName,
                        productNumber: row.selectedProduct.productNumber,
                        size: row.selectedSize,
                        usdPrice: usdPrice,
                        inrPrice: inrPrice,
                        quantity: row.quantity,
                      });
                    }}
                  >
                    Details
                  </button>
                {/if}

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="text-red-500 cursor-pointer hover:scale-105"
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

          {#if data?.authedUser && data?.authedUser?.id}
            <form
              method="POST"
              action="?/addToCart"
              bind:this={manualEntriesForm}
              use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === "success") {
                    const resultData = result.data;
                    console.log(resultData, "resultData");

                    if (resultData && resultData.success === true) {
                      if ($authedUser.id) {
                        submitForm();
                      } else {
                        submitAlternateForm();
                      }

                      toast.success(
                        resultData[2] || "Items added to cart successfully",
                      );
                      setTimeout(() => {
                        resetRows();
                      }, 1000);

                      showCartPopup(prepareManualEntriesToCart());
                    } else {
                      toast.error(
                        resultData.message || "Failed to add item to cart",
                      );
                    }
                  } else {
                    toast.error("Failed to add items to cart");
                  }

                  cartloading = false;
                };
              }}
            >
              <input type="hidden" name="cartItems" value="" />

              <button
                type="button"
                on:click={handleManualEntriesSubmit}
                class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
              >
                {#if cartloading}
                  <span>Adding...</span>
                {:else}
                  <Icon icon="ic:round-shopping-cart" class="text-2xl" />
                  <span>Add to Cart</span>
                {/if}
              </button>
            </form>
          {:else}
            <button
              on:click={() => {
                cartloading = true;
                handleLocalManualEntries();
              }}
              class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
            >
              {#if cartloading}
                <span>Adding...</span>
              {:else}
                <Icon icon="ic:round-shopping-cart" class="text-2xl" />
                <span>Add to Cart</span>
              {/if}
            </button>
          {/if}
        </div>
      </div>

      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id="cart-popup-details"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        style="display: {showCartPopupdetail ? 'flex' : 'none'}"
        on:click={closeCartPopDetails}
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative"
          on:click|stopPropagation
        >
          <button
            on:click={closeCartPopDetails}
            class="absolute top-4 right-4 text-primary-500 hover:scale-105"
          >
            <span class="text-xl font-semibold text-primary-500 hover:scale-105"
              >✖</span
            >
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
      </div>
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
      class="fixed !ml-0 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-5"
      on:click|self={hideDetails}
    >
      <div
        class="bg-white p-8 rounded-lg relative shadow-lg max-w-lg w-full sm:w-auto mx-4 sm:mx-0"
        on:click|self={hideDetails}
      >
        <button
          class="absolute top-2 right-2 hover:scale-105 text-primary-500 font-semibold transition duration-300 ease-in-out"
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
              class="w-16 h-10 text-center p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-400"
              on:input={() => {
                if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
                if (selectedProduct.quantity > 9999)
                  selectedProduct.quantity = 9999;
                if (
                  selectedProductIndex !== undefined &&
                  selectedProductIndex !== null
                ) {
                  const updatedRows = [...rows];
                  if (updatedRows[selectedProductIndex]) {
                    updatedRows[selectedProductIndex] = {
                      ...updatedRows[selectedProductIndex],
                      quantity: selectedProduct.quantity,
                    };
                    rows = updatedRows;
                  }
                }
                updateCartItemsValue();
              }}
            />

            <button
              class="flex justify-center items-center w-10 h-10 bg-white text-primary-500 rounded-lg border border-gray-300 hover:bg-primary-50 transition"
              on:click|preventDefault={increaseQuantity}
            >
              <Icon icon="ic:round-plus" class="text-xl" />
            </button>
            <button
              type="submit"
              class="flex justify-center text-sm items-center w-36 h-10 text-white bg-primary-400 rounded hover:bg-primary-500 transition"
            >
              <Icon icon="tabler:calendar-check" class="text-lg" />
              <span class="text-sm">Check Availability</span>
            </button>
          </div>
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
        </form>

        {#if data?.authedUser && data?.authedUser?.id}
          <form
            method="POST"
            action="?/addToCart"
            bind:this={form}
            use:enhance={() => {
              return async ({ result }) => {
                console.log(result, "result");

                if (result.type === "success") {
                  const resultData = result.data;
                  console.log(resultData, "resultData");

                  if (resultData && resultData.success === true) {
                    const cartItem = prepareCartItem();
                    console.log(cartItem, "cartItem");

                    toast.success(`Product added to the cart!`);
                    cartRowIndexToBeCleared = cartItem.rowIndex;
                    console.log(
                      cartRowIndexToBeCleared,
                      "cartRowIndexToBeCleared",
                    );
                    hideDetails();
                    showCartPopupdetails(cartItem);
                    setTimeout(() => {
                      clearSelectedProductcart(cartRowIndexToBeCleared);
                    }, 1000);

                    // showCartPopup(prepareCartItem());
                    showCartMessage = true;
                    // hideDetails();
                  } else {
                    toast.error(
                      resultData.message || "Failed to add item to cart",
                    );
                  }
                } else {
                  toast.error("Failed to add item to cart");
                }
              };
            }}
          >
            <input type="hidden" name="cartItems" value={cartItemsValue} />

            <!-- <button
          class="mt-6 w-full sm:w-auto p-3 text-white bg-primary-500 rounded flex items-center justify-center gap-2 hover:bg-primary-600 transition"
          type="submit"
        >
          Add to Cart
        </button> -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-primary-400 text-white py-3 px-4 rounded-md flex items-center space-x-1"
              >
                <Icon icon="ic:round-shopping-cart" class="text-xl" /><span
                  class="text-sm">Add To Cart</span
                >
              </button>
            </div>
          </form>
        {:else}
          <div class=" flex ml-20 justify-center">
            <button
              on:click={handleLocalCart}
              class="bg-primary-400 text-white py-3 px-4 rounded-md flex items-center space-x-1"
            >
              <Icon icon="ic:round-shopping-cart" class="text-xl" /><span
                class="text-sm">Add To Cart</span
              >
            </button>
          </div>
        {/if}
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="bg-white rounded-lg w-full md:w-2/5 max-h-full overflow-y-auto p-4 md:p-6 m-4 md:m-0"
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
                  console.log("result", result);
                  if (result.data?.status === 200) {
                    ProfileEmailVerified = result.data.isEmailVerified;
                    if (authedUserEmailVerified === true) {
                      ProfileEmailVerified = true;
                    }

                    verificationMessage = result.data.message;

                    if (
                      verificationMessage.includes(
                        "Verification email sent successfully. Please check your inbox.",
                      )
                    ) {
                      displayMessage = "Please check your inbox.";
                      emailSent = true;
                      enteredOtp = "";
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
                    <Icon
                      icon="line-md:loading-alt-loop"
                      class="w-4 h-4 mr-1"
                    />
                    Verifying...
                  </span>
                {:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data?.isEmailVerified !== true}
                  <button
                    type="submit"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
                    disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                      email,
                    ) || email.split("@")[1].includes("gamil")}
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
                      <Icon
                        icon="fluent:mail-all-read-16-filled"
                        class="w-4  h-4 mr-1"
                      />
                      Check your inbox
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
                    loadingotp = false;
                    if (result.status === 200) {
                      if (result.data.status === 200) {
                        const verifiedMessage = result.data.message;
                        toast.success(verifiedMessage);

                        isOtpVerified = result.data.isEmailVerified;
                        enteredOtpemail = "";
                        isOtpVerified = true;
                        ProfileEmailVerified = true;
                        console.log(isOtpVerified, "isOtpVerified");
                      } else {
                        const errorMessage =
                          result.data.message || "An unknown error occurred!";
                        toast.error(errorMessage);
                      }
                    } else {
                      const errorMessage =
                        result.data.message ||
                        "Request failed. Please try again.";
                      toast.error(errorMessage);
                    }
                  };
                }}
                on:submit={() => {
                  loadingotp = true;
                }}
              >
                <div class="relative w-full">
                  <input
                    type="hidden"
                    name="email"
                    id="email"
                    bind:value={email}
                  />
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
<!-- Cart Popup with multiple items support -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${!isCartPopupVisible ? "hidden" : ""}`}
  bind:this={cartPopupOverlay}
  transition:fade={{ duration: 200 }}
  on:click={hideCartPopup}
>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
    <!-- Popup Header -->
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Added to Cart</h3>
      <button
        class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        on:click={hideCartPopup}
      >
        &times;
      </button>
    </div>

    <!-- Popup Content -->
    <div class="p-4">
      {#if cartPopupItems && cartPopupItems.length > 0}
        <div class="space-y-4">
          <!-- Display up to 3 items -->
          {#each cartPopupItems.slice(0, 3) as item, i}
            <div
              class="flex items-center py-2 {i !== 0
                ? 'border-t border-gray-100'
                : ''}"
            >
              <!-- Product Image -->
              <div
                class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-3 overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  class="max-w-full max-h-full object-contain"
                />
              </div>

              <!-- Product Details -->
              <div class="flex-1">
                <p class="text-xs text-gray-600">
                  Product Number: {item.productNumber}
                </p>
                <p class="text-sm font-semibold text-gray-800">
                  {item.productName}
                </p>
                <div class="flex justify-between mt-1">
                  <p class="text-xs text-gray-700">Qty: {item.quantity}</p>
                  <!-- <p class="text-sm font-medium text-gray-900">${item.price}</p> -->
                  {#if item.usdPrice !== undefined && item.inrPrice !== undefined}
                    <div class="mt-2">
                      <p class="text-sm text-gray-800 font-medium">
                        {#if $currencyState === "usd"}
                          Total Price: ${formatPrice(
                            item.usdPrice,
                            item.quantity,
                          )}
                          <!-- USD Price -->
                        {:else}
                          Total Price: ₹{formatPrice(
                            item.inrPrice,
                            item.quantity,
                          )}
                          <!-- INR Price -->
                        {/if}
                      </p>
                    </div>
                  {/if}
                </div>
                <p class="text-xs text-gray-700">Size: {item.size}</p>
              </div>
            </div>
          {/each}

          <!-- Summary message if more than 3 items -->
          {#if cartPopupItems.length > 3}
            <div class="text-center py-2 border-t border-gray-200">
              <p class="text-sm text-gray-600 font-medium">
                {cartPopupItems.length} items have been added to your cart
              </p>
            </div>
          {:else}
            <div class="text-center py-2 border-t border-gray-200">
              <p class="text-sm text-gray-600 font-medium">
                {cartPopupItems.length}
                {cartPopupItems.length === 1 ? "item" : "items"} added to your cart
              </p>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Popup Actions -->
    <div class="flex justify-between p-4 border-t border-gray-200">
      <button
        on:click={hideCartPopup}
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${!isCartPopupVisible ? "hidden" : ""}`}
  bind:this={cartPopupOverlay}
  transition:fade={{ duration: 200 }}
  on:click={hideCartPopup}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
    on:click|stopPropagation
  >
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Added to Cart</h3>
      <button
        class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        on:click={hideCartPopup}
      >
        &times;
      </button>
    </div>

    <div class="p-1">
      {#if cartPopupItems && cartPopupItems.length > 0}
        <div class="space-y-4">
          {#each cartPopupItems.slice(0, 3) as item, i}
            <div
              class="flex items-center py- {i !== 0
                ? 'border-t border-gray-100'
                : ''}"
            >
              <div
                class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-3 overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  class="max-w-full max-h-full object-contain"
                />
              </div>

              <div class="flex-1 p-3">
                <p class="text-xs text-gray-600">
                  Product Number: {item.productNumber}
                </p>
                <p class="text-sm font-semibold text-gray-800 mt-1">
                  {item.productName}
                </p>

                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-700">Qty: {item.quantity}</p>

                  {#if item.usdPrice !== undefined && item.inrPrice !== undefined}
                    <div class="mt-2">
                      <p class="text-sm text-gray-800 font-medium">
                        {#if $currencyState === "usd"}
                          Total Price: ${formatPrice(
                            item.usdPrice,
                            item.quantity,
                          )}
                          <!-- USD Price -->
                        {:else}
                          Total Price: ₹{formatPrice(
                            item.inrPrice,
                            item.quantity,
                          )}
                          <!-- INR Price -->
                        {/if}
                      </p>
                    </div>
                  {/if}
                </div>
                <p class="text-xs text-gray-700">Size: {item.size}</p>
              </div>
            </div>
          {/each}

          <!-- Summary message if more than 3 items -->
          {#if cartPopupItems.length > 3}
            <div class="text-center py-2 border-t border-gray-200">
              <p class="text-sm text-gray-600 font-medium">
                {cartPopupItems.length} items have been added to your cart
              </p>
            </div>
          {:else}
            <div class="text-center py-2 border-t border-gray-200">
              <p class="text-sm text-gray-600 font-medium">
                {cartPopupItems.length}
                {cartPopupItems.length === 1 ? "item" : "items"} added to your cart
              </p>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="flex justify-between p-4 border-t border-gray-200">
      <button
        on:click={hideCartPopup}
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
