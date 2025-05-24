<script>
  import { cart, guestCart } from "$lib/stores/cart.js";
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import { onMount, afterUpdate } from "svelte";
  import * as XLSX from "xlsx";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  export let data;
  import { fade } from "svelte/transition";
  let editedLines = new Set();
  let originalLineContent = [];
  let textEditedAfterValidation = false;
  let showValidateButton = false;
  $: console.log($cart);
  let validationMessages = [];
  let isLoggedIn = $authedUser?.id ? true : false;
  let duplicateEntries = [];
  let rawFileData = "";
  let fileError = "";
  let cartNotification = "";
  let formElement;
  let validatedProducts = [];
  let cartloading = false;
  let isLoading = false;
  let form2;
  let selectedFileName = "";
  let isEditing = true;
  let isValidated = false;
  let invalidProductLines = [];
  function checkForDuplicates(fileContent) {
    if (!fileContent) return { duplicates: [], uniqueLines: [] };

    const lines = fileContent.split("\n").filter((line) => line.trim());
    const seenEntries = new Map();

    const duplicates = [];
    const uniqueLines = [];

    lines.forEach((line, index) => {
      const [productInfo, quantity] = line
        .split(",")
        .map((item) => item.trim());
      if (productInfo && quantity) {
        if (seenEntries.has(productInfo)) {
          duplicates.push({
            line: index + 1,
            content: line,
            productInfo,
            originalIndex: seenEntries.get(productInfo).index,
          });
        } else {
          seenEntries.set(productInfo, { index, line });
          uniqueLines.push(line);
        }
      }
    });

    return { duplicates, uniqueLines };
  }

  function removeDuplicateEntry(productInfo, event) {
    if (!productInfo) return;

    const lines = rawFileData.split("\n").filter((line) => line.trim());
    const seenProducts = new Map();
    const deduplicatedLines = lines.filter((line) => {
      const [currentProductInfo] = line.split(",").map((item) => item.trim());
      if (currentProductInfo === productInfo) {
        if (seenProducts.has(productInfo)) {
          return false;
        }
        seenProducts.set(productInfo, true);
      }
      return true;
    });

    rawFileData = deduplicatedLines.join("\n");

    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;

    if (isValidated) {
      invalidProductLines = mapInvalidProductsToLines();
    }
    toast.success(`Removed duplicate entry for ${productInfo}`);
    if (duplicateEntries.length === 0) {
      submitFileData();
    }
  }
  function removeInvalidProduct(lineIndex) {
    const lines = rawFileData.split("\n");
    const lineContent = lines[lineIndex];
    const [productInfo] = lineContent.split(",").map((item) => item.trim());
    lines.splice(lineIndex, 1);
    rawFileData = lines.join("\n");
    validationMessages = validationMessages.filter(
      (message) =>
        !productInfo.includes(message.productNumber) || message.isValid,
    );
    invalidProductLines = mapInvalidProductsToLines();

    if (!rawFileData.trim()) {
      toast.success(
        "All invalid items removed. Please add valid product number and size to add to cart.",
      );
      isValidated = false;
    } else {
      const hasRemainingInvalidProducts = validationMessages.some(
        (message) => !message.isValid,
      );
      if (hasRemainingInvalidProducts) {
        toast.success("Invalid product removed.");
      } else {
        toast.success("All invalid products removed. You can now add to cart.");
      }
    }

    if (validationMessages.length === 0) {
      isValidated = false;
    }
  }

  function removeAllInvalidProducts() {
    const invalidProductNumbers = validationMessages
      .filter((message) => !message.isValid)
      .map((message) => message.productNumber);

    if (invalidProductNumbers.length === 0) {
      toast.info("No invalid products to remove.");
      return;
    }
    let lines = rawFileData.split("\n");
    const linesToRemove = [];
    lines.forEach((line, index) => {
      const [productInfo] = line.split(",").map((item) => item.trim());
      const containsInvalidProduct = invalidProductNumbers.some(
        (invalidProduct) => productInfo.includes(invalidProduct),
      );

      if (containsInvalidProduct) {
        linesToRemove.push(index);
      }
    });
    linesToRemove.reverse().forEach((lineIndex) => {
      lines.splice(lineIndex, 1);
    });
    rawFileData = lines.join("\n");
    validationMessages = validationMessages.filter(
      (message) => message.isValid,
    );

    invalidProductLines = mapInvalidProductsToLines();
    if (!rawFileData.trim()) {
      toast.success(
        "All invalid items removed. Please add valid product number and size to add to cart.",
      );
      isValidated = false;
    } else {
      toast.success("All invalid products removed. You can now add to cart.");
    }
    if (validationMessages.length === 0) {
      isValidated = false;
    }
  }
  let formatError = false;

  function handleTextChange(event) {
    const newText = event.target.value;
    const newLines = newText.split("\n");
    const oldLines = rawFileData.split("\n");
    if (isValidated && originalLineContent.length === 0) {
      originalLineContent = [...oldLines];
    }
    if (isValidated) {
      const newEditedLines = new Set();
      for (
        let i = 0;
        i < Math.max(newLines.length, originalLineContent.length);
        i++
      ) {
        const newLine = i < newLines.length ? newLines[i] : "";
        const originalLine =
          i < originalLineContent.length ? originalLineContent[i] : "";

        if (newLine !== originalLine) {
          newEditedLines.add(Number(i));
          // console.log(`Line ${i} was edited: "${originalLine}" → "${newLine}"`);
        }
      }
      editedLines = newEditedLines;
      // console.log("Updated editedLines:", Array.from(editedLines));
      textEditedAfterValidation = editedLines.size > 0;
      showValidateButton = editedLines.size > 0;
    }

    rawFileData = newText;
    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;

    formatError = false;
    fileError = "";

    if (!rawFileData.trim()) {
      return;
    }

    const lines = newLines.filter((line) => line.trim());
    if (lines.length > 100) {
      formatError = true;
      cartloading = false;
      fileError =
        "Error(s) found in product input:\n* Bulk upload limited to 100 items at a time";
      return;
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(",");

      if (parts.length === 0 || !parts[0].trim()) {
        formatError = true;
        cartloading = false;
        fileError = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        toast.error(fileError);
        break;
      }
      if (
        parts.length > 1 &&
        parts[1].trim() &&
        isNaN(Number(parts[1].trim()))
      ) {
        formatError = true;
        cartloading = false;
        fileError = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        toast.error(fileError);
        break;
      }
      // if (parts.length > 1 && parts[1].trim()) {
      //   const quantity = Number(parts[1].trim());
      //   if (!isNaN(quantity) && quantity > 999) {
      //     formatError = true;
      //     cartloading = false;
      //     fileError = `Quantity at line ${i + 1} must not be greater than 999.`;
      //     toast.error(fileError);
      //     break;
      //   }
      // }
    }
  }
  function handleValidateClick() {
    editedLines = new Set();
    originalLineContent = [];

    showValidateButton = false;
    textEditedAfterValidation = false;
    editedLines = new Set();
    submitFileData();
  }

  function handleFileInputChange(event) {
    fileError = "";
    formatError = false;
    let file;

    if (event.dataTransfer) {
      file = event.dataTransfer.files[0];
    } else {
      file = event.target.files[0];
    }

    if (!file) {
      fileError = "No file selected.";
      return;
    }
    //File size///
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      fileError = "File size exceeds the 5MB limit.";
      if (fileInput) fileInput.value = "";
      return;
    }

    const fileType = file.name.split(".").pop().toLowerCase();
    selectedFileName = file.name;
    isEditing = true;

    const reader = new FileReader();

    reader.onerror = () => {
      fileError = "Error reading the file. Please try again.";
    };
    //script file remove///
    const processFileData = (content) => {
      fileError = "";
      formatError = false;
      if (content.toLowerCase().includes("<script")) {
        fileError =
          "File contains potentially malicious script tags and was rejected.";
        toast.error(
          "Security warning: File contains script tags and cannot be processed.",
        );
        if (fileInput) fileInput.value = "";
        return;
      }
      const lines = content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const parts = line.split(",").map((p) => p.trim());
          if (parts.length >= 2 && !isNaN(+parts[1])) {
            const quantity = Math.min(Number(parts[1]), 999);
            return `${parts[0]},${quantity}`;
          } else if (
            parts.length === 1 ||
            (parts.length === 2 && isNaN(+parts[1]))
          ) {
            return `${parts[0]},1`;
          }
          return line;
        });

      rawFileData = lines.join("\n");

      const { duplicates } = checkForDuplicates(rawFileData);
      duplicateEntries = duplicates;

      if (duplicates.length > 0) {
        toast.error(
          `Found ${duplicates.length} duplicate entries. Please review and remove them.`,
        );
      } else {
        submitFileData();
      }
    };
    if (["xlsx", "xls"].includes(fileType)) {
      if (typeof XLSX === "undefined") {
        fileError = "Excel support requires SheetJS. Use CSV instead.";
        return;
      }

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });
          let processedData = jsonData
            .filter((row) => row.length > 0 && row[0])
            .map((row) => {
              const productCode = String(row[0]).trim();
              let quantity =
                row.length > 1 && row[1] ? String(row[1]).trim() : "1";
              if (!isNaN(Number(quantity)) && Number(quantity) > 999) {
                quantity = "999";
              }

              return `${productCode},${quantity}`;
            })
            .join("\n");

          processFileData(processedData);
        } catch (err) {
          fileError = "Error processing Excel file.";
          console.error(err);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        processFileData(e.target.result);
      };

      reader.readAsText(file);
    }
  }

  function submitFileData() {
    if (!rawFileData.trim()) {
      toast.error("Please enter product data before submitting");
      cartloading = false;
      return;
    }

    const lines = rawFileData.split("\n").filter((line) => line.trim());
    let formatError = false;
    let errorMessage = "";
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(",");

      if (parts.length === 0 || !parts[0].trim()) {
        formatError = true;
        errorMessage = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        break;
      }
      if (
        parts.length > 1 &&
        parts[1].trim() &&
        isNaN(Number(parts[1].trim()))
      ) {
        formatError = true;
        errorMessage = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        break;
      }
      if (parts.length > 1 && parts[1].trim()) {
        let quantity = Number(parts[1].trim());
        if (!isNaN(quantity)) {
          quantity = Math.min(quantity, 999);
          processedLines.push(`${parts[0]},${quantity}`);
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(`${parts[0]},1`);
      }
    }

    if (formatError) {
      fileError = errorMessage;
      toast.error(errorMessage);
      return;
    }
    rawFileData = processedLines.join("\n");
    const updatedFile = new File(
      [rawFileData],
      selectedFileName || "upload.csv",
      { type: "text/csv" },
    );

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(updatedFile);

    const fileInput =
      document.getElementById("bulkupload") ||
      document.querySelector('input[type="file"]');

    if (fileInput) {
      fileInput.files = dataTransfer.files;
      const form = fileInput.closest("form");
      if (form) {
        textEditedAfterValidation = false;
        showValidateButton = false;
        setTimeout(() => {
          form.requestSubmit();
        }, 100);
      } else {
        console.error("Form not found");
      }
    } else {
      console.error("File input element not found");
    }
  }

  function removeAllDuplicates(event) {
    if (duplicateEntries.length === 0) return;

    const lines = rawFileData.split("\n").filter((line) => line.trim());
    const uniqueProductInfos = new Set();
    const deduplicatedLines = [];

    lines.forEach((line) => {
      const [productInfo] = line.split(",").map((item) => item.trim());
      if (!uniqueProductInfos.has(productInfo)) {
        uniqueProductInfos.add(productInfo);
        deduplicatedLines.push(line);
      }
    });

    rawFileData = deduplicatedLines.join("\n");
    duplicateEntries = [];
    toast.success(`Removed all duplicate entries`);
    submitFileData();
  }
  function validateAndSubmitData() {
    if (!rawFileData.trim()) {
      toast.error("Please enter product data before submitting");
      return;
    }

    const lines =
      rawFileData.split("\n").filter((line) => line.trim()) ||
      textareaElement.split("\n").filter((line) => line.trim());
    const trimmedLines = lines.map((line) => {
      const [productInfo, quantity] = line
        .split(",")
        .map((item) => item.trim());
      return `${productInfo},${quantity || 1}`;
    });
    rawFileData = trimmedLines.join("\n");

    const { duplicates } = checkForDuplicates(rawFileData);
    if (duplicates.length > 0) {
      toast.error(
        `Found ${duplicates.length} duplicate entries. Please review and remove them.`,
      );
      return;
    }

    const file = new File([rawFileData], "manual-entry.csv", {
      type: "text/csv",
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileInput = document.getElementById("bulkupload");
    if (fileInput) {
      fileInput.files = dataTransfer.files;
    }

    if (formElement) {
      formElement.requestSubmit();
    }
  }

  function processProduct(product) {
    const {
      id,
      image,
      productName,
      productNumber,
      description,
      pricing,
      stock,
    } = product;
    if (Array.isArray(pricing) && pricing.length > 0) {
      pricing.forEach((priceInfo) => {
        const { break: size, price } = priceInfo;
      });
    }
  }

  function prepareValidatedProductsForCart() {
    const productsToAdd = [];

    if (!validatedProducts || validatedProducts.length === 0) {
      console.error("Error: No validated products available");
      toast.error("No valid items to add to cart");
      return productsToAdd;
    }

    const validProducts = validatedProducts.filter(
      (product) => product.isValid === true,
    );

    if (validProducts.length === 0) {
      console.error("Error: No valid products found after filtering");
      toast.error("No valid products found after validation");
      return productsToAdd;
    }

    validProducts.forEach((product) => {
      try {
        if (
          (product.message ===
            "Stock is sufficient for all uploaded quantities" ||
            product.message === "SKU is valid") &&
          product.productNumber
        ) {
          if (!product.productId) {
            console.error(
              `Error: Missing productId for ${product.productNumber}`,
            );
            return;
          }
          if (!product.distributer) {
            console.error(
              `Error: Missing distributer for ${product.productNumber}`,
            );
            return;
          }

          if (!product.manufacturer) {
            console.error(
              `Error: Missing manufacturer for ${product.productNumber}`,
            );
            return;
          }
          if (!product.quantity) {
            console.error(
              `Error: Missing quantity for ${product.productNumber}`,
            );
            return;
          }

          if (!product.stockId) {
            console.error(
              `Error: Missing stockId for ${product.productNumber}`,
            );
            return;
          }

          const rowQuantity = parseInt(product.quantity, 10) || 0;
          const productStock = parseInt(product.stock, 10) || 0;
          const backOrder = Math.max(rowQuantity - productStock, 0);

          const newProduct = {
            productId: product.productId,
            manufacturerId: product.manufacturer,
            distributerId: product.distributer ? product.distributer : null,
            stockId: product.stockId,
            productName: product.productName,
            partNumber: product.productNumber,
            quantity: product.quantity || 1,
            backOrder: backOrder,
            stock: product.stock,
          };

          productsToAdd.push(newProduct);
          // console.log(`Prepared product ${newProduct.partNumber} for cart addition`);
        } else {
          console.error(
            `Product ${product.productNumber || "Unknown"} did not pass validation:`,
          );
          console.error(`- Stock message: ${product.message || "Missing"}`);
          console.error(`- Product number exists: ${!!product.productNumber}`);
          console.error(`- Product name exists: ${!!product.productName}`);
          console.error(`- Stock value: ${product.stock}`);
        }
      } catch (err) {
        console.error(
          `Error processing product ${product.productNumber || "Unknown"}:`,
          err,
        );
      }
    });

    if (productsToAdd.length === 0) {
      toast.error("No valid items could be added to cart");
    }

    return productsToAdd;
  }
  function attemptAddToCart() {
    if (textEditedAfterValidation) {
      toast.warning(
        "Content has changed. Please validate before adding to cart.",
      );
      return;
    }

    if (!isValidated || duplicateEntries.length > 0) {
      submitFileData();
      return;
    }

    const validProducts = validatedProducts.filter(
      (product) => product.isValid === true,
    );

    if (validProducts.length === 0) {
      toast.error(
        "No valid products to add to cart. Please remove invalid products and try again.",
      );
      return;
    }

    if (data?.authedUser && data?.authedUser?.id) {
      const cartForm = document.getElementById("cartForm");
      if (cartForm) cartForm.requestSubmit();
    } else {
      handleLocalStorage();
      submitAlternateForm();
    }
  }
  async function submitAlternateForm() {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("totalCompsChemi", storedCart.length);
    syncLocalStorageToStore();
  }

  function handleDataCart() {
    return async ({ result }) => {
      console.log("result from page server for cart data", result);

      const totalComps = result?.data?.cartData?.cartItems.length;
      console.log("totalComps", totalComps);
      localStorage.setItem("totalCompsChemi", totalComps);
      syncLocalStorageToStore();
    };
  }

  function syncLocalStorageToStore() {
    if (typeof window !== "undefined") {
      const storedTotalComps = localStorage.getItem("totalCompsChemi");
      if (storedTotalComps) {
        cartTotalComps.set(Number(storedTotalComps));
      }
    }
  }

  function handleLocalStorage() {
    try {
      cartloading = true;
      const productsToAdd = prepareValidatedProductsForCart();

      if (productsToAdd.length === 0) {
        cartloading = false;
        toast.error("No valid items to add to cart");
        return;
      }

      const simplifiedCartItems = productsToAdd
        .map((item) => {
          if (!item.productId || !item.manufacturerId || !item.stockId) {
            console.error(
              "Error: Missing required fields for cart item:",
              item,
            );
            return null;
          }

          return {
            productId: item.productId,
            manufacturerId: item.manufacturerId,
            stockId: item.stockId,
            distributerId: item.distributerId,
            quantity: item.quantity || 1,
            backOrder: item.backOrder,
            productName: item.productName,
            partNumber: item.partNumber,
            stock: item.stock,
          };
        })
        .filter((item) => item !== null);

      if (simplifiedCartItems.length === 0) {
        cartloading = false;
        toast.error("No valid items could be processed for cart");
        return;
      }
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = [...existingCart];
      simplifiedCartItems.forEach((newItem) => {
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) =>
            cartItem.productId === newItem.productId &&
            cartItem.stockId === newItem.stockId &&
            cartItem.manufacturerId === newItem.manufacturerId,
        );

        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex].quantity = newItem.quantity;
          updatedCart[existingItemIndex].backOrder = newItem.backOrder;
        } else {
          updatedCart.push(newItem);
        }
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem("totalCompsChemi", updatedCart.length);

      const productsAddedCount = simplifiedCartItems.length;
      toast.success(
        `${productsAddedCount} valid ${productsAddedCount === 1 ? "item" : "items"} saved to cart.`,
      );

      cartloading = false;
      isLoading = true;
      setTimeout(() => {
        window.location.href = "/cart";
      }, 2000);
    } catch (err) {
      cartloading = false;
      console.error("Error saving to localStorage:", err);
      toast.error("Failed to save items to cart: " + err.message);
    }
  }
  function mapInvalidProductsToLines() {}

  let fileInput;
  let dropzone;
  function triggerUpload() {
    fileInput.click();
  }
  function handleDrop(event) {
    event.preventDefault();
    if (dropzone) {
      dropzone.classList.remove("bg-primary-100", "text-primary-600");
    }

    const file = event.dataTransfer.files[0];
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        fileError = "File size exceeds the 5MB limit.";
        return;
      }
      const mockEvent = {
        dataTransfer: event.dataTransfer,
      };
      handleFileInputChange(mockEvent);
    }
  }
  function handleDragOver(event) {
    event.preventDefault();
    dropzone.classList.add("bg-primary-100", "text-primary-600");
  }

  function handleDragLeave() {
    dropzone.classList.remove("bg-primary-100", "text-primary-600");
  }
  let scrollContainer;
  let textareaElement;
  let overlayElement;
  let lineHeight = 24;
  let scrollTop = 0;
  let viewportHeight = 0;
  function handleScroll() {
    if (textareaElement) {
      scrollTop = textareaElement.scrollTop;
    }
  }
  onMount(() => {
    cartloading = false;
    isLoading = false;
    rawFileData = "";
    validationMessages = "";
    calculateLineHeight();

    if (textareaElement) {
      viewportHeight = textareaElement.clientHeight;
    }
    handleScroll();
  });

  afterUpdate(() => {
    if (isValidated) {
      calculateLineHeight();
    }

    if (textareaElement) {
      viewportHeight = textareaElement.clientHeight;
    }
  });
  function calculateLineHeight() {
    if (textareaElement) {
      const style = window.getComputedStyle(textareaElement);
      const computedLineHeight = style.lineHeight;

      if (computedLineHeight !== "normal") {
        lineHeight = parseInt(computedLineHeight, 10);
      } else {
        const fontSize = parseInt(style.fontSize, 10);
        lineHeight = Math.floor(fontSize * 1.2);
      }
    }
  }

  // $: {
  //   console.log("REACTIVE: editedLines changed:", Array.from(editedLines));
  // }
  // Add these functions to your component's script section

  function handleOverlayScroll(event) {
    // Prevent default scrolling on the overlay
    event.preventDefault();

    // Calculate scroll delta
    const delta = event.deltaY;

    // Apply scroll to the textarea
    if (textareaElement) {
      const currentScrollTop = textareaElement.scrollTop;
      const maxScrollTop =
        textareaElement.scrollHeight - textareaElement.clientHeight;
      const newScrollTop = Math.max(
        0,
        Math.min(maxScrollTop, currentScrollTop + delta),
      );

      textareaElement.scrollTop = newScrollTop;

      // Update our scroll tracking
      scrollTop = newScrollTop;
    }
  }

  function handleOverlayTouch(event) {
    // For touch devices, we need to handle touch events
    if (event.type === "touchstart") {
      touchStartY = event.touches[0].clientY;
    } else if (event.type === "touchmove") {
      event.preventDefault();

      const touchY = event.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchStartY = touchY;

      if (textareaElement) {
        const currentScrollTop = textareaElement.scrollTop;
        const maxScrollTop =
          textareaElement.scrollHeight - textareaElement.clientHeight;
        const newScrollTop = Math.max(
          0,
          Math.min(maxScrollTop, currentScrollTop + delta),
        );

        textareaElement.scrollTop = newScrollTop;
        scrollTop = newScrollTop;
      }
    }
  }
  let touchStartY = 0;
</script>

<div class="text-black text-sm md:ml-2 mb-1">
  *Upload a file containing product data (e.g., PV4384-each of 1,1). Each
  product should be on a new line.*
</div>
<form
  method="POST"
  action="/?/getCartValue"
  bind:this={form2}
  use:enhance={handleDataCart}
>
  <input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>
<form
  bind:this={formElement}
  method="POST"
  action="?/uploadFile"
  enctype="multipart/form-data"
  use:enhance={() => {
    isLoading = true;
    textEditedAfterValidation = false;
    showValidateButton = false;
    let lines = rawFileData.trim().split("\n");

    const firstLine = lines[0].trim().toLowerCase();
    if (firstLine === "sku,quantity" || firstLine === "sku,1") {
      lines = lines.slice(1);
    }

    let formatError = false;
    let errorMessage = "";
    if (lines.length > 100) {
      formatError = true;
      errorMessage =
        "Error(s) found in product input:\n* Bulk upload limited to 100 items at a time";
      // toast.error(errorMessage);
      fileError = errorMessage;
      isLoading = false;
      return { cancel: true }; // Cancel form submission
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(",");

      if (parts.length === 0 || !parts[0]?.trim()) {
        formatError = true;
        cartloading = false;
        errorMessage = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        break;
      }

      if (
        parts.length > 1 &&
        parts[1]?.trim() &&
        isNaN(Number(parts[1].trim()))
      ) {
        formatError = true;
        cartloading = false;
        errorMessage = `Invalid format at line ${i + 1}. Each line should have a product number-size.`;
        break;
      }
      if (parts.length > 1 && parts[1]?.trim()) {
        const quantity = Number(parts[1].trim());
        if (!isNaN(quantity) && quantity > 999) {
          cartloading = false;
          formatError = true;
          errorMessage = `Quantity at line ${i + 1} must not be greater than 999.`;
          break;
        }
      }
    }

    if (formatError) {
      toast.error(errorMessage);
      fileError = errorMessage;
      isLoading = false;
      return { cancel: true };
    }

    // Continue with processing if format is valid
    const processedLines = lines.map((line) => {
      const parts = line.includes(",") ? line.split(",") : line.split(/\s+/);
      const productNumberAndSize = parts[0]?.trim();
      let quantity = parts[1]?.trim();
      if (!quantity && productNumberAndSize) {
        quantity = "1";
        return `${productNumberAndSize},${quantity}`;
      }

      return line.trim();
    });

    rawFileData = processedLines.join("\n");
    return async ({ result }) => {
      const { duplicates } = checkForDuplicates(rawFileData);

      if (duplicates.length > 0) {
        toast.error("Please remove duplicate entries before submitting");
        isLoading = false;
        return;
      }

      let products = result.data;
      products.forEach((product) => {
        if (!product.quantity || product.quantity === undefined) {
          product.quantity = 1;
        }
        processProduct(product);
      });

      validatedProducts = products;
      isLoading = false;
      isValidated = true;
      textEditedAfterValidation = false;
      showValidateButton = false;

      if (result.data && Array.isArray(result.data)) {
        validationMessages = result.data.map((item) => ({
          productNumber: item.productNumber || "Unknown",
          isValid: item.isValid,
          message: item.message || "Unknown message",
        }));

        const hasInvalidProducts = validationMessages.some(
          (message) => !message.isValid,
        );
        console.log(validationMessages, "validationMessages");
        if (hasInvalidProducts) {
          invalidProductLines = mapInvalidProductsToLines();
          toast.warning(
            "Some products are invalid. Please review before adding to cart.",
          );
          cartloading = false;
        } else if (validatedProducts.length > 0) {
          setTimeout(() => {
            if (data?.authedUser && data?.authedUser?.id) {
              const cartForm = document.getElementById("cartForm");
              if (cartForm) cartForm.requestSubmit();
            } else {
              submitAlternateForm();
              handleLocalStorage();
            }
          }, 100);
        }
      }
    };
  }}
>
  {#if isLoading}
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-500/40 backdrop-blur-sm"
      transition:fade={{ duration: 300 }}
    >
      <div class="flex flex-col items-center justify-center p-4">
        <div class="relative w-32 h-32">
          <Icon
            icon="eos-icons:bubble-loading"
            class="absolute inset-0 w-full h-full text-6xl text-primary-50 animate-spin-slow"
          />
          <!-- <div class="absolute inset-0 w-full h-full border-8 border-dashed border-primary-200 border-t-primary-600 rounded-full animate-spin-slow"></div> -->
          <div
            class="loader loader-large absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          ></div>
        </div>
        <div
          class="mt-4 text-white font-medium flex items-center animate-pulse"
        >
          <span class="animate-wave-1">L</span>
          <span class="animate-wave-2">o</span>
          <span class="animate-wave-3">a</span>
          <span class="animate-wave-4">d</span>
          <span class="animate-wave-5">i</span>
          <span class="animate-wave-6">n</span>
          <span class="animate-wave-7">g</span>
          <span class="animate-wave-8">.</span>
          <span class="animate-wave-9">.</span>
          <span class="animate-wave-10">.</span>
        </div>
      </div>
    </div>
  {/if}

  <section class="w-full mx-auto md:flex items-center gap-5">
    <div class="w-full overflow-hidden focus:ring-0 md:w-3/5">
      <div class="overflow-hidden" bind:this={scrollContainer}>
        <div class="relative">
          <textarea
            bind:value={rawFileData}
            on:input={handleTextChange}
            on:scroll={handleScroll}
            on:wheel={handleOverlayScroll}
            on:touchstart={handleOverlayTouch}
            on:touchmove={handleOverlayTouch}
            class="w-full placeholder:text-sm min-h-72 p-3 border border-primary-200 rounded-md focus:ring-0 focus:border-primary-400"
            bind:this={textareaElement}
            placeholder="Upload a file containing product data...
Example file content:
7987565-50G,1
657890-100G,5
345678-25G,3"
          ></textarea>
          {#if isValidated && rawFileData.trim()}
            <div
              class=" absolute mt-2 top-0 left-0 w-full h-full pointer-events-none"
              bind:this={overlayElement}
              style="transform: translateY({-scrollTop}px);"
            >
              {#each rawFileData.trim().split("\n") as line, lineIndex}
                {@const fullProductInfo = line.split(",")[0].trim()}
                {@const baseProductNumber = fullProductInfo
                  .split("-")[0]
                  .split(" ")[0]
                  .trim()}
                {@const validationMessage = validationMessages.find((msg) => {
                  if (msg.productNumber === fullProductInfo) return true;
                  if (msg.productNumber === baseProductNumber) return true;
                  return fullProductInfo.startsWith(msg.productNumber);
                })}

                {#if lineIndex * lineHeight >= scrollTop - lineHeight * 1 && lineIndex * lineHeight <= scrollTop + viewportHeight}
                  <div
                    class="flex items-center pointer-events-auto"
                    style="position: absolute; top: {2 +
                      lineIndex * lineHeight}px; right: 10px;"
                  >
                    <div class="validation-status">
                      {#if editedLines.has(lineIndex)}
                        <div class="validation-status edited-line">
                          <span class="text-amber-500 font-medium">
                            <Icon
                              icon="tabler:alert-triangle"
                              class="inline w-4 h-4 mr-1"
                            />
                            Changes need validation
                          </span>
                        </div>
                      {:else if validationMessage}
                        {#if validationMessage.isValid === true}
                          <div
                            class="flex items-center text-green-500 mt-2 bg-white bg-opacity-75 rounded px-1 mr-3"
                          >
                            <span class="text-xs mr-1">Valid</span>
                            <Icon icon="mdi:check-circle" class="text-base" />
                          </div>
                        {:else}
                          <div
                            class="flex items-center mt-2 text-red-500 bg-white bg-opacity-75 rounded px-1 mr-3"
                          >
                            <span class="text-xs mr-1"
                              >{validationMessage.message ||
                                "Invalid product"}</span
                            >
                            <button
                              type="button"
                              class="text-red-500 hover:text-red-700 pointer-events-auto"
                              title="Remove invalid product"
                              on:click={() => removeInvalidProduct(lineIndex)}
                            >
                              <Icon icon="mdi:close-circle" class="text-base" />
                            </button>
                          </div>
                        {/if}
                      {/if}
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      </div>
      {#if fileError && !selectedFileName}
        <div class="mt-2 p-2 text-sm text-red-500 bg-red-50 rounded">
          <div class="flex items-center">
            <Icon icon="mdi:alert-circle" class="mr-1" />
            {#if fileError.includes("Error(s) found in product input:")}
              <div class="whitespace-pre-line">{fileError}</div>
            {:else}
              {fileError}
            {/if}
          </div>
        </div>
      {/if}

      {#if fileError && selectedFileName}
        <div class="mt-2 p-2 text-sm text-red-500 bg-red-50 rounded">
          <div class="flex items-center">
            <Icon icon="mdi:alert-circle" class="mr-1" />
            {#if fileError.includes("Error(s) found in product input:")}
              <div class="whitespace-pre-line">{fileError}</div>
            {:else}
              {fileError}
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <section class="mt-3 md:mt-0 md:w-2/5">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="flex flex-col gap-3">
        <div
          class="flex justify-center bg-white items-center h-12 border rounded-md hover:bg-primary-200 hover:text-primary-600"
        >
          <button
            class="flex justify-center items-center h-12 hover:bg-primary-200 hover:text-primary-600 text-primary-500 text-sm font-medium gap-2"
            type="button"
            data-download-url="/quick_order_template.xls"
            onclick="this.querySelector('a').click()"
          >
            <!-- svelte-ignore a11y-missing-content -->
            <a href="/quick_order_template.xls" download style="display: none;"
            ></a>
            <i class="text-lg" data-icon="pajamas:download"></i> Download Template
          </button>
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={triggerUpload}
          bind:this={dropzone}
          class="w-full flex flex-col justify-center bg-white items-center rounded-md h-[210px] mt-2 space-y-2 py-6 border hover:bg-primary-100 hover:text-primary-600 cursor-pointer"
          on:drop={handleDrop}
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
        >
          <Icon icon="uil:upload" class="text-4xl text-primary-500 -ml-4" />
          <div
            class="flex flex-col items-center pointer-events-none text-primary-500"
          >
            <p class="text-sm font-medium text-center px-2">
              Upload or drag and drop your CSV or XLS file to upload
            </p>
          </div>

          <input
            bind:this={fileInput}
            type="file"
            name="file"
            accept=".xlsx, .xls, .csv, .txt"
            class="hidden"
            on:change={handleFileInputChange}
          />

          <button
            type="button"
            on:click={triggerUpload}
            hidden
            class="mt-2 text-primary-600 underline"
          >
            Click to select a file
          </button>
        </div>
        {#if selectedFileName && rawFileData.length !== 0}
          <p class="text-sm text-primary-500 mt-2">{selectedFileName}</p>
        {/if}
        {#if !selectedFileName && fileError}
          <p class="text-sm text-red-500 mt-2">{fileError}</p>
        {/if}
      </div>
    </section>
  </section>
  {#if duplicateEntries.length >= 2}
    <div class="mt-4">
      <button
        type="button"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        on:click={removeAllDuplicates}
      >
        Remove All Duplicates
      </button>
    </div>
  {/if}
  {#if duplicateEntries.length > 0}
    <div class="mt-4 p-4 bg-red-50 rounded-md">
      <h3 class="text-red-700 font-medium mb-2">Duplicate Entries Found:</h3>
      <ul class="space-y-2">
        {#each duplicateEntries as entry}
          <li class="flex items-center justify-between">
            <span class="text-red-600">
              Line {entry.line}: {entry.content}
            </span>

            <button
              type="button"
              class="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              on:click={(event) =>
                removeDuplicateEntry(entry.productInfo, event)}
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <!-- {#if validationMessages.length > 0 && isValidated} -->
  {#if validationMessages.length > 0 && isValidated && !textEditedAfterValidation}
    <div class="mt-4">
      {#if validationMessages.some((message) => !message.isValid)}
        <button
          type="button"
          class="bg-red-500 mb-4 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          on:click={removeAllInvalidProducts}
        >
          Remove All Invalid Products
        </button>
        <div class="p-4 bg-yellow-50 rounded-md">
          <h3 class="text-yellow-700 font-medium mb-2">Invalid Products:</h3>
          {#if validationMessages.filter((message) => !message.isValid).length < 10}
            <ul class="space-y-2">
              {#each validationMessages.filter((message) => !message.isValid) as message}
                <li class="flex items-center justify-between">
                  <span class="text-yellow-600">
                    Product: {message.productNumber} - {message.message}
                  </span>
                  <span class="text-yellow-600 font-medium"
                    >Cannot be added to cart</span
                  >
                </li>
              {/each}
            </ul>
          {/if}
          <p class="mt-3 text-sm text-yellow-600">
            Please remove invalid products using the <span
              ><Icon icon="mdi:close-circle" class="text-base inline" /></span
            > button in the text area or proceed with only valid products.
          </p>
        </div>
      {/if}

      {#if validationMessages.some((message) => message.isValid)}
        <div class="mt-3 p-4 bg-green-50 rounded-md">
          <h3 class="text-green-700 font-medium mb-2">
            Valid Products: {validationMessages.filter(
              (message) => message.isValid,
            ).length}
          </h3>
          <p class="text-sm text-green-600">
            These products are ready to be added to cart.
          </p>
        </div>
      {:else if validationMessages.length > 0 && isValidated && textEditedAfterValidation}
        <div class="mt-4 p-4 bg-yellow-50 rounded-md">
          <h3 class="text-yellow-700 font-medium mb-2">
            Content Changed After Validation
          </h3>
          <p class="text-sm text-yellow-600">
            You've edited the content after validation. Please validate again to
            ensure your changes are properly checked.
          </p>
        </div>
      {/if}
    </div>
  {/if}
</form>

<div class="flex justify-end gap-4">
  {#if showValidateButton}
    <button
      type="button"
      on:click={handleValidateClick}
      class="p-2 w-40 mt-4 mb-5 h-9 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition rounded-md flex items-center justify-center gap-2"
    >
      <Icon icon="mdi:check-circle" class="text-xl" />
      <span>Validate Again</span>
    </button>
  {/if}

  {#if data?.authedUser && data?.authedUser?.id && !showValidateButton && validationMessages.length !== 0}
    <form
      id="cartForm"
      method="POST"
      action="?/addToCart"
      use:enhance={({ formData }) => {
        if (formatError) {
          toast.error("Please fix format errors before adding to cart");
          return { cancel: true };
        }

        if (textEditedAfterValidation) {
          toast.warning(
            "Content has changed. Please validate before adding to cart.",
          );
          return { cancel: true };
        }

        cartloading = true;
        if (!isValidated || duplicateEntries.length > 0) {
          submitFileData();
          return { cancel: true };
        }

        let productsToAdd = prepareValidatedProductsForCart();

        if (productsToAdd.length === 0) {
          cartloading = false;
          toast.error("No valid items to add to cart");
          return { cancel: true };
        }

        if (!isLoggedIn) {
          localStorage.setItem("cart", JSON.stringify(productsToAdd));
          guestCart.set(productsToAdd);
          isLoading = true;
          setTimeout(() => {
            window.location.href = "/cart";
          }, 2000);
          return { cancel: true };
        }

        formData.set("cartItems", JSON.stringify(productsToAdd));

        return async ({ result }) => {
          cartloading = false;

          try {
            const resultData = result.data;

            if (resultData && resultData.success === true) {
              const productsAddedCount = productsToAdd.length;
              toast.success(
                `${productsAddedCount} ${productsAddedCount === 1 ? "item" : "items"} added to the cart.`,
              );
              isLoading = true;
              setTimeout(() => {
                window.location.href = "/cart";
              }, 2000);
            } else {
              throw new Error(resultData[1] || "Failed to add items to cart");
            }
          } catch (err) {
            console.error("Error processing cart response:", err);
            toast.error("Failed to add items to cart");
          }
        };
      }}
    >
      <button
        type="submit"
        disabled={cartloading ||
          textEditedAfterValidation ||
          (isValidated &&
            validatedProducts.length > 0 &&
            !validatedProducts.some((p) => p.isValid))}
        class={`lg:ml-60 mr-5 p-2 w-40 mt-4 h-9 mb-4 flex items-center text-xs   gap-1 sm:text-sm px-3 py-1 sm:p-1.5 sm:px-5 border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 rounded-md transition ease-in-out duration-300
          ${
            cartloading ||
            textEditedAfterValidation ||
            (isValidated &&
              validatedProducts.length > 0 &&
              !validatedProducts.some((p) => p.isValid))
              ? "opacity-50 cursor-not-allowed bg-white"
              : "hover:bg-primary-500 hover:text-white"
          }
        `}
      >
        {#if cartloading && !fileError && !formatError}
          <span>Adding...</span>
        {:else}
          <Icon icon="ic:round-shopping-cart" class="text-2xl" />
          <span>Add to Cart</span>
        {/if}
      </button>
    </form>
  {:else if !showValidateButton && validationMessages.length !== 0}
    <button
      class="  mb-5 lg:ml-60 mr-5 p-2 w-40 mt-4 h-9 flex items-center text-xs gap-1 sm:text-sm px-3 py-1 sm:p-1.5 sm:px-5 border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 rounded-md transition ease-in-out duration-300"
      on:click={attemptAddToCart}
      disabled={cartloading ||
        textEditedAfterValidation ||
        (isValidated &&
          validatedProducts.length > 0 &&
          !validatedProducts.some((p) => p.isValid))}
    >
      {#if cartloading && !fileError && !formatError}
        <span>Adding...</span>
      {:else}
        <Icon icon="ic:round-shopping-cart" class="text-2xl" />
        <span>Add to Cart</span>
      {/if}
    </button>
  {:else if showValidateButton === false}
    <button
      type="button"
      on:click={handleValidateClick}
      class="p-2 w-40 mt-4 mb-5 h-9 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition rounded-md flex items-center justify-center gap-2"
    >
      <Icon icon="mdi:check-circle" class="text-xl" />
      <span>Validate </span>
    </button>
  {/if}
</div>
{#if cartNotification}
  <div
    class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50"
  >
    {cartNotification}
  </div>
{/if}

<style>
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes progress-pulse {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes wave {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes loader-bubbles {
    0% {
      box-shadow:
        0 -10px var(--bubble-color, #ffffff),
        3px 0 var(--bubble-color, #ffffff),
        5px 0 var(--primary-color, #fe5939);
    }
    30% {
      box-shadow:
        3px -20px rgba(239, 223, 255, 0),
        5px -10px var(--bubble-color, #ffffff),
        5px 0 var(--primary-color, #fe5939);
    }
    60% {
      box-shadow:
        3px 0 rgba(239, 223, 255, 0),
        4px -20px rgba(239, 223, 255, 0),
        3px -10px var(--bubble-color, #ffffff);
    }
    61% {
      box-shadow:
        3px 0 var(--primary-color, #fe5939),
        4px -20px rgba(239, 223, 255, 0),
        3px -10px var(--bubble-color, #ffffff);
    }
    100% {
      box-shadow:
        0 -10px var(--primary-color, #fe5939),
        4px -20px rgba(239, 223, 255, 0),
        5px -20px rgba(239, 223, 255, 0);
    }
  }

  .loader {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    width: 10px;
    height: 20px;
    background: var(--primary-color, #fe5939);
  }

  .loader-large {
    width: 15px;
    height: 30px;
  }

  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
  }

  .loader:before {
    top: -8px;
    left: -13px;
    width: 0;
    height: 0;
    border: 18px solid transparent;
    border-bottom: 20px solid var(--primary-color, #fe5939);
    border-radius: 3px;
  }

  .loader-large:before {
    top: -12px;
    left: -20px;
    border: 27px solid transparent;
    border-bottom: 30px solid var(--primary-color, #fe5939);
    border-radius: 4px;
  }

  .loader:after {
    top: -1;
    left: -1;
    width: px;
    height: 4px;
    background: var(--bubble-color, #fe5939);
    border-radius: 50%;
    animation: loader-bubbles 1s linear infinite forwards;
  }

  .loader-large:after {
    width: 6px;
    height: 6px;
  }

  :global(.animate-shimmer) {
    background-size: 200% 100%;
    animation: shimmer 2s ease-in-out infinite;
  }

  :global(.animate-wave-1) {
    animation: wave 1s ease-in-out infinite;
  }
  :global(.animate-wave-2) {
    animation: wave 1s ease-in-out infinite 0.1s;
  }
  :global(.animate-wave-3) {
    animation: wave 1s ease-in-out infinite 0.2s;
  }
  :global(.animate-wave-4) {
    animation: wave 1s ease-in-out infinite 0.3s;
  }
  :global(.animate-wave-5) {
    animation: wave 1s ease-in-out infinite 0.4s;
  }
  :global(.animate-wave-6) {
    animation: wave 1s ease-in-out infinite 0.5s;
  }
  :global(.animate-wave-7) {
    animation: wave 1s ease-in-out infinite 0.6s;
  }
  :global(.animate-wave-8) {
    animation: wave 1s ease-in-out infinite 0.7s;
  }
  :global(.animate-wave-9) {
    animation: wave 1s ease-in-out infinite 0.8s;
  }
  :global(.animate-wave-10) {
    animation: wave 1s ease-in-out infinite 0.9s;
  }
</style>
