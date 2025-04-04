<script>
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import * as XLSX from "xlsx";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  export let data;
  import { fade } from "svelte/transition";
  let validationMessages = [];
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
    const finalLines = deduplicatedLines.map((line) => {
      const [productInfo, quantity] = line
        .split(",")
        .map((item) => item.trim());
      return `${productInfo},${quantity}`;
    });
    rawFileData = finalLines.join("\n");
    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;
    if (isValidated) {
      invalidProductLines = mapInvalidProductsToLines();
    }
    toast.success(`Removed duplicate entry for ${productInfo}`);
    const formData = new FormData(event.target.closest("form"));

    const deduplicatedFile = new File([rawFileData], "updated.csv", {
      type: "text/csv",
    });

    formData.set("file", deduplicatedFile);

    if (duplicateEntries.length === 0) {
      const form = event.target.closest("form");
      if (form) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(deduplicatedFile);
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.files = dataTransfer.files;
        }

        form.requestSubmit();
      }
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

  function handleTextChange(event) {
    rawFileData = event.target.value;
    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;
    isValidated = false;
    invalidProductLines = [];
  }

  function validateCartInput() {
    const validProducts = validatedProducts.filter(
      (product) => product.isValid,
    );
    return validProducts.length > 0;
  }
  function handleFileInputChange(event) {
    const file = event.target.files[0];

    if (!file) {
      fileError = "No file selected.";
      return;
    }

    const fileType = file.name.split(".").pop().toLowerCase();
    selectedFileName = file.name;
    isEditing = true;

    const reader = new FileReader();

    reader.onerror = () => {
      fileError = "Error reading the file. Please try again.";
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
          let csvData = XLSX.utils.sheet_to_csv(worksheet);

          const transformed = csvData
            .split("\n")
            .filter((l) => l.trim())
            .map((line) => {
              const parts = line.split(",").map((p) => p.trim());
              if (parts.length === 1 || (parts.length === 2 && isNaN(+parts[1]))) {
                return `${parts[0]},1`;
              }
              return line;
            });

          rawFileData = transformed.join("\n");

          // handle duplicates here
        } catch (err) {
          fileError = "Error processing Excel file.";
          console.error(err);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const parts = line.split(",").map((p) => p.trim());
            if (parts.length === 1 || (parts.length === 2 && isNaN(+parts[1]))) {
              return `${parts[0]},1`;
            }
            return line;
          });

        rawFileData = lines.join("\n");

        // handle duplicates here
      };

      reader.readAsText(file);
    }
  }
  // function handleFileInputChange(event) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const fileType = file.name.split(".").pop().toLowerCase();
  //     selectedFileName = file.name;
  //     isValidated = false;
  //     invalidProductLines = [];

  //     if (fileType === "xlsx" || fileType === "xls") {
  //       fileError = "";

  //       if (typeof XLSX !== "undefined") {
  //         const reader = new FileReader();
  //         reader.onload = function (e) {
  //           try {
  //             const data = new Uint8Array(e.target.result);
  //             const workbook = XLSX.read(data, { type: "array" });
  //             const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  //             let csvData = XLSX.utils.sheet_to_csv(worksheet);
  //             const lines = csvData.split("\n").filter((line) => line.trim());
  //             const transformedLines = lines.map((line) => {
  //               const parts = line.split(",").map((part) => part.trim());
  //               if (parts.length === 1) {
  //                 return `${parts[0]},1`;
  //               }
  //               if (
  //                 parts.length === 2 &&
  //                 (!parts[1] || isNaN(parseInt(parts[1])))
  //               ) {
  //                 return `${parts[0]},1`;
  //               }

  //               return line;
  //             });

  //             rawFileData = transformedLines.join("\n");
  //             isEditing = true;
  //             const csvFile = new File(
  //               [rawFileData],
  //               file.name.replace(/\.xlsx$|\.xls$/i, ".csv"),
  //               {
  //                 type: "text/csv",
  //               },
  //             );

  //             const dataTransfer = new DataTransfer();
  //             dataTransfer.items.add(csvFile);

  //             const fileInput = document.getElementById("bulkupload");
  //             if (fileInput) {
  //               fileInput.files = dataTransfer.files;
  //             }

  //             const { duplicates } = checkForDuplicates(rawFileData);
  //             duplicateEntries = duplicates;

  //             if (duplicates.length > 0) {
  //               toast.error(
  //                 `Found ${duplicates.length} duplicate entries. Please review and remove them.`,
  //               );
  //             } else {
  //               // Auto-submit the form if no duplicates
  //               setTimeout(() => {
  //                 if (formElement) {
  //                   formElement.requestSubmit();
  //                 }
  //               }, 100);
  //             }
  //           } catch (error) {
  //             console.error("Excel processing error:", error);
  //             fileError =
  //               "Error processing Excel file. Please check file format.";
  //           }
  //         };
  //         reader.onerror = function () {
  //           fileError = "Error reading the file. Please try again.";
  //         };
  //         reader.readAsArrayBuffer(file);
  //       } else {
  //         fileError =
  //           "Excel file support requires the SheetJS library. Please use CSV format instead.";
  //       }
  //     } else {
  //       const reader = new FileReader();
  //       reader.onload = function (e) {
  //         let fileContent = e.target.result;
  //         fileError = "";
  //         isEditing = true;
  //         const lines = fileContent.split("\n").filter((line) => line.trim());
  //         const trimmedLines = lines.map((line) => {
  //           const parts = line.split(",").map((item) => item.trim());

  //           // If only SKU-size is present, add quantity 1
  //           if (parts.length === 1) {
  //             return `${parts[0]},1`;
  //           }
  //           if (
  //             parts.length === 2 &&
  //             (!parts[1] || isNaN(parseInt(parts[1])))
  //           ) {
  //             return `${parts[0]},1`;
  //           }

  //           return line;
  //         });

  //         rawFileData = trimmedLines.join("\n");
  //         const trimmedFile = new File([rawFileData], file.name, {
  //           type: "text/csv",
  //         });
  //         const dataTransfer = new DataTransfer();
  //         dataTransfer.items.add(trimmedFile);
  //         const fileInput = document.getElementById("bulkupload");
  //         if (fileInput) {
  //           fileInput.files = dataTransfer.files;
  //         }

  //         const { duplicates } = checkForDuplicates(rawFileData);
  //         duplicateEntries = duplicates;

  //         if (duplicates.length > 0) {
  //           toast.error(
  //             `Found ${duplicates.length} duplicate entries. Please review and remove them.`,
  //           );
  //         } else {
  //           // Auto-submit the form if no duplicates
  //           setTimeout(() => {
  //             if (formElement) {
  //               formElement.requestSubmit();
  //             }
  //           }, 100);
  //         }
  //       };
  //       reader.onerror = function () {
  //         fileError = "Error reading the file. Please try again.";
  //       };
  //       reader.readAsText(file);
  //     }
  //   } else {
  //     fileError = "No file selected.";
  //   }
  // }

  // New function to remove all duplicates at once
  function removeAllDuplicates(event) {
    if (duplicateEntries.length === 0) return;

    const lines = rawFileData.split("\n").filter((line) => line.trim());
    const uniqueProductInfos = new Set();
    const deduplicatedLines = [];

    // Keep only the first occurrence of each product
    lines.forEach((line) => {
      const [productInfo] = line.split(",").map((item) => item.trim());
      if (!uniqueProductInfos.has(productInfo)) {
        uniqueProductInfos.add(productInfo);
        deduplicatedLines.push(line);
      }
    });

    // Update file data with deduplicated content
    rawFileData = deduplicatedLines.join("\n");

    // Create new file with deduplicated content
    const deduplicatedFile = new File([rawFileData], "deduplicated.csv", {
      type: "text/csv",
    });

    // Update file input with new deduplicated file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(deduplicatedFile);
    const fileInput = document.getElementById("bulkupload");
    if (fileInput) {
      fileInput.files = dataTransfer.files;
    }

    // Clear duplicate entries list
    duplicateEntries = [];

    // Show success message
    toast.success(`Removed all duplicate entries`);

    // Automatically submit the form for validation
    if (formElement) {
      setTimeout(() => {
        formElement.requestSubmit();
      }, 100);
    }
  }
  function validateAndSubmitData() {
    if (!rawFileData.trim()) {
      toast.error("Please enter product data before submitting");
      return;
    }

    const lines = rawFileData.split("\n").filter((line) => line.trim());
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
      toast.error("No valid items to add to cart");
      return productsToAdd;
    }
    const validProducts = validatedProducts.filter(
      (product) => product.isValid === true,
    );

    validProducts.forEach((product) => {
      if (
        product.stockMessage ===
          "Stock is sufficient for all uploaded quantities" ||
        (product.productNumber &&
          product.productName &&
          product.pricing &&
          product.pricing[0] &&
          product.pricing[0].break &&
          product.stock > 0)
      ) {
        console.log(`Product ${product.productName} passed validation check`);

        const sizePriceInfo = product.pricing[0];
        const size = sizePriceInfo.break;
        const price = sizePriceInfo.price;
        const rowQuantity = parseInt(product.quantity, 10) || 0;
        const productStock = parseInt(product.stock, 10) || 0;
        const backOrder = Math.max(rowQuantity - productStock, 0);

        const newProduct = {
          id: product.id,
          manufacturerId: product.manufacturer,
          distributerId: product.distributer ? product.distributer : null,
          stockId: product.stockId,
          productName: product.productName,
          image: product.image,
          partNumber: product.productNumber,
          description: product.prodDesc,
          priceSize: {
            price: price,
            size: size,
          },
          quantity: product.quantity || 1,
          backOrder: backOrder,
          stock: product.stock,
        };

        productsToAdd.push(newProduct);
        console.log(
          `Prepared product ${newProduct.productName} for cart addition`,
        );
      } else {
        console.log(`Product ${product.productName} did not pass validation.`);
      }
    });

    console.log(`Prepared ${productsToAdd.length} products for cart`);
    return productsToAdd;
  }

  function attemptAddToCart() {
    if (!isValidated || duplicateEntries.length > 0) {
      validateAndSubmitData();
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
    const storedTotalComps = JSON.parse(localStorage.getItem("cart"));
    localStorage.setItem("totalCompsChemi", storedTotalComps.length);
    syncLocalStorageToStore();
  }
  function handleDataCart() {
    return async ({ result }) => {
      console.log("result from page server for carat data", result);

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
      const simplifiedCartItems = productsToAdd.map((item) => ({
        productId: item.id,
        manufacturerId: item.manufacturerId,
        stockId: item.stockId,
        distributorId: item.distributerId,
        quantity: item.quantity || 1,
        backOrder: item.backOrder,
      }));

      if (productsToAdd.length === 0) {
        cartloading = false;
        toast.error("No valid items to add to cart");
        return;
      }

      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [...existingCart];

      // Merge quantities for existing products
      simplifiedCartItems.forEach((newItem) => {
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) =>
            cartItem.productId === newItem.productId &&
            cartItem.stockId === newItem.stockId &&
            cartItem.manufacturerId === newItem.manufacturerId,
        );

        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          updatedCart[existingItemIndex].backOrder += newItem.backOrder;
        } else {
          updatedCart.push(newItem);
        }
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      const productsAddedCount = productsToAdd.length;
      toast.success(
        `${productsAddedCount} valid ${productsAddedCount === 1 ? "item" : "items"} saved to cart.`,
      );

      cartloading = false;
      setTimeout(() => {
        window.location.href = "/cart";
      }, 2000);
    } catch (err) {
      cartloading = false;
      console.error("Error saving to localStorage:", err);
      toast.error("Failed to save items to cart");
    }
  }
  function mapInvalidProductsToLines() {
    if (!isValidated || !validationMessages.length) return [];

    const lines = rawFileData.split("\n");
    const mappedInvalidLines = [];
    validationMessages.forEach((message) => {
      if (!message.isValid) {
        const lineIndex = lines.findIndex((line) => {
          const [productInfo] = line.split(",").map((item) => item.trim());
          return productInfo.includes(message.productNumber);
        });

        if (lineIndex !== -1) {
          mappedInvalidLines.push({
            index: lineIndex,
            line: lineIndex + 1,
            content: lines[lineIndex],
            productNumber: message.productNumber,
            message: message.message,
          });
        }
      }
    });

    return mappedInvalidLines;
  }
  // Add a scroll event listener to the textarea
  function initScrollListener() {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.addEventListener("scroll", updateValidationMessagePositions);
    }
  }

  // Function to update positions of validation messages
  function updateValidationMessagePositions() {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const container = textarea.parentElement;
    const scrollTop = textarea.scrollTop;

    // Use a more accurate line height calculation
    // Calculate actual line height based on textarea height and number of lines
    const lines = textarea.value.split("\n");
    const lineHeight = textarea.clientHeight / (lines.length || 1);

    // Get all validation message elements
    const validationElements = container.querySelectorAll(
      '[class*="absolute right-7"]',
    );

    validationElements.forEach((element) => {
      const productNumber = element.dataset.productNumber;
      if (!productNumber) return;

      // Find the line index for this product
      const lineIndex = lines.findIndex((line) => line.includes(productNumber));

      if (lineIndex !== -1) {
        // Calculate position based on actual textarea properties
        const linePosition = lineIndex * lineHeight;
        const adjustedPosition = linePosition - scrollTop + 12; // Add small offset for alignment

        // Only show if the message is within the visible area
        if (
          adjustedPosition >= 0 &&
          adjustedPosition <= textarea.clientHeight - 20
        ) {
          element.style.display = "flex";
          element.style.top = `${adjustedPosition}px`; // Use pixels for more precise positioning
        } else {
          element.style.display = "none";
        }
      }
    });
  }
  let fileInput;
  let dropzone;
  function triggerUpload() {
    fileInput.click();
  }

  function handleDrop(event) {
    event.preventDefault();
    dropzone.classList.remove("bg-primary-100", "text-primary-600");

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileInputChange({ target: { files: [file] } });
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    dropzone.classList.add("bg-primary-100", "text-primary-600");
  }

  function handleDragLeave() {
    dropzone.classList.remove("bg-primary-100", "text-primary-600");
  }
</script>

<!-- <div class="text-black text-sm md:ml-2 mb-1">
  *Type or paste product number-size,quantity (e.g., PV4384-each of 1,1),
  separated by commas*. Enter separate products on new lines.
</div> -->
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
    const lines = rawFileData.trim().split("\n");
    const processedLines = lines.map((line) => {
      const parts = line.includes(",") ? line.split(",") : line.split(/\s+/);
      const productNumberAndSize = parts[0]?.trim();
      let quantity = parts[1]?.trim();
      if (!quantity && productNumberAndSize) {
        quantity = "1";
        return `${productNumberAndSize},${quantity}`;
      }

      return line;
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

      if (result.data && Array.isArray(result.data)) {
        validationMessages = result.data.map((item) => ({
          productNumber: item.productNumber || "Unknown",
          isValid: item.isValid,
          message: item.message || "Unknown message",
        }));
        const hasInvalidProducts = validationMessages.some(
          (message) => !message.isValid,
        );

        if (hasInvalidProducts) {
          invalidProductLines = mapInvalidProductsToLines();
          toast.warning(
            "Some products are invalid. Please review before adding to cart.",
          );
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
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-500/40 backdrop-blur-sm"
  transition:fade={{ duration: 300 }}>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="relative w-32 h-32">
      <Icon icon="eos-icons:bubble-loading" class="absolute inset-0 w-full h-full text-6xl text-primary-50 animate-spin-slow"/>
      <!-- <div class="absolute inset-0 w-full h-full border-8 border-dashed border-primary-200 border-t-primary-600 rounded-full animate-spin-slow"></div> -->
      <div class="loader loader-large absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
    </div>
    <div class="mt-4 text-white font-medium flex items-center animate-pulse">
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
    <div
      class="md:w-3/5 h-72 border bg-white rounded-md overflow-hidden p-5 relative"
    >
      <textarea
        class="w-full h-full p-2 border placeholder:text-sm placeholder:text-gray-400 border-gray-300 rounded-md focus:ring-0 focus:border-primary-500"
        bind:value={rawFileData}
        on:input={handleTextChange}
        readonly
        placeholder="Upload a file containing product data...
Example file content:
7987565-50G,1
657890-100G,5
345678-25G,3"
      ></textarea>
      {#if isValidated && validationMessages.length > 0}
        {#each validationMessages as message}
          {#if message.isValid}
            <div
              class="absolute right-7 text-green-500 flex items-center"
              style="top: calc(1.5rem + {rawFileData
                .split('\n')
                .findIndex((line) => line.includes(message.productNumber)) *
                1.5}rem)"
            >
              <span class="text-xs mr-2">Valid Product</span>
              <Icon icon="mdi:check-circle" class="text-lg" />
            </div>
          {:else}
            <div
              class="absolute right-7 text-red-500 flex items-center"
              style="top: calc(1.5rem + {rawFileData
                .split('\n')
                .findIndex((line) => line.includes(message.productNumber)) *
                1.5}rem)"
            >
              <span class="text-xs mr-2">{message.message}</span>
              <button
                type="button"
                class="text-red-500 hover:text-red-700"
                title="Remove invalid product"
                on:click={() =>
                  removeInvalidProduct(
                    rawFileData
                      .split("\n")
                      .findIndex((line) =>
                        line.includes(message.productNumber),
                      ),
                  )}
              >
                <Icon icon="mdi:close-circle" class="text-lg" />
              </button>
            </div>
          {/if}
        {/each}
      {/if}

      {#if fileError}
        <p class="text-red-500 text-sm mt-2">{fileError}</p>
      {/if}
    </div>

    <section class="mt-3 md:mt-0 md:w-2/5">
      <div class="flex flex-col gap-3">
        <div
          class="flex justify-center bg-white items-center h-12 border rounded-md hover:bg-primary-200 hover:text-primary-600"
        >
          <a
            class="flex items-center gap-2 text-sm font-medium text-primary-500"
            href="/quick_order_template.csv"
            download
          >
            <Icon icon="pajamas:download" class="text-lg " /> Download Template
          </a>
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- <div
          class="w-full flex flex-col justify-center bg-white items-center rounded-md h-[220px] mt-3 space-y-2 py-6 border border-dashed hover:bg-primary-100 hover:text-primary-600"
        >
          <Icon icon="uil:upload" class="text-5xl text-primary-500 -ml-4" />
          <p class="text-sm text-center px-2">
            Or drag and drop your CSV or XLS file to upload
          </p>

          <label
            for="bulkupload"
            class="w-full h-full cursor-pointer flex flex-col justify-center items-center"
          >
            <input
              type="file"
              id="bulkupload"
              name="file"
              accept=".xlsx, .xls, .csv, .txt"
              on:change={handleFileInputChange}
              class="hidden"
            />
          </label>
        </div>
      </div> -->
      <div
      on:click={triggerUpload}
      bind:this={dropzone}
      class="w-full flex flex-col justify-center bg-white items-center rounded-md h-[210px] mt-2 space-y-2 py-6 border border-dashed hover:bg-primary-100 hover:text-primary-600"
      on:drop={handleDrop}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
    >
    <Icon icon="uil:upload" class="text-4xl text-primary-500 -ml-4" />
      <div class="flex flex-col items-center pointer-events-none text-primary-500">

        <p class="text-sm font-medium text-center px-2">
          Or drag and drop your CSV or XLS file to upload
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
      {#if fileError}
        <p class="text-sm text-red-500 mt-2">{fileError}</p>
      {/if}
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
  {#if validationMessages.length > 0 && isValidated}
    <div class="mt-4">
      {#if validationMessages.some((message) => !message.isValid)}
        <!-- <div class="p-4 bg-yellow-50 rounded-md">
          <h3 class="text-yellow-700 font-medium mb-2">Invalid Products:</h3>
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
          <p class="mt-3 text-sm text-yellow-600">
            Please remove invalid products using the X button in the text area
            or proceed with only valid products.
          </p>
        </div> -->
        <div class="p-4 bg-yellow-50 rounded-md">
          <h3 class="text-yellow-700 font-medium mb-2">Invalid Products:</h3>
          <ul class="space-y-2">
            <li class="flex items-center">
              <Icon icon="mdi:close-circle" class="text-red-500 text-lg mr-2" />
              <span class="text-yellow-600"
                >Marked products cannot be added to the cart.
              </span>
            </li>
          </ul>
          <p class="mt-3 text-sm text-yellow-600">
            Please remove invalid products using the X button in the text area
            or proceed with only valid products.
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
      {/if}
    </div>
  {/if}
</form>

<div class="flex justify-end">
  {#if data?.authedUser && data?.authedUser?.id}
    <form
      id="cartForm"
      method="POST"
      action="?/addToCart"
      use:enhance={({ formData, cancel }) => {
        cartloading = true;

        const productsToAdd = prepareValidatedProductsForCart();

        if (productsToAdd.length === 0) {
          cartloading = false;
          toast.error("No valid items to add to cart");
          return cancel();
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
        type="button"
        class="lg:ml-60 mr-5 p-2 w-40 mt-4 mb-5 h-9 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition rounded-md flex items-center gap-2"
        on:click={attemptAddToCart}
        disabled={cartloading ||
          (isValidated &&
            validatedProducts.length > 0 &&
            !validatedProducts.some((p) => p.isValid))}
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
      class="lg:ml-60 mr-5 p-2 w-40 mt-4 mb-5 h-9 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition rounded-md flex items-center gap-2"
      on:click={attemptAddToCart}
      disabled={cartloading ||
        (isValidated &&
          validatedProducts.length > 0 &&
          !validatedProducts.some((p) => p.isValid))}
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
		0%, 100% {
			opacity: 0;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes wave {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	@keyframes loader-bubbles {
		0% {
			box-shadow: 0 -10px var(--bubble-color, #ffffff),
					3px 0 var(--bubble-color, #ffffff),
					5px 0 var(--primary-color, #fe5939);
		}
		30% {
			box-shadow: 3px -20px rgba(239,223,255,0),
					5px -10px var(--bubble-color, #ffffff),
					5px 0 var(--primary-color, #fe5939);
		}
		60% {
			box-shadow: 3px 0 rgba(239,223,255,0),
					4px -20px rgba(239,223,255,0),
					3px -10px var(--bubble-color, #ffffff);
		}
		61% {
			box-shadow: 3px 0 var(--primary-color, #fe5939),
					4px -20px rgba(239,223,255,0),
					3px -10px var(--bubble-color, #ffffff);
		}
		100% {
			box-shadow: 0 -10px var(--primary-color, #fe5939),
					4px -20px rgba(239,223,255,0),
					5px -20px rgba(239,223,255,0);
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
		content: '';
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

	:global(.animate-wave-1) { animation: wave 1s ease-in-out infinite; }
	:global(.animate-wave-2) { animation: wave 1s ease-in-out infinite 0.1s; }
	:global(.animate-wave-3) { animation: wave 1s ease-in-out infinite 0.2s; }
	:global(.animate-wave-4) { animation: wave 1s ease-in-out infinite 0.3s; }
	:global(.animate-wave-5) { animation: wave 1s ease-in-out infinite 0.4s; }
	:global(.animate-wave-6) { animation: wave 1s ease-in-out infinite 0.5s; }
	:global(.animate-wave-7) { animation: wave 1s ease-in-out infinite 0.6s; }
	:global(.animate-wave-8) { animation: wave 1s ease-in-out infinite 0.7s; }
	:global(.animate-wave-9) { animation: wave 1s ease-in-out infinite 0.8s; }
	:global(.animate-wave-10) { animation: wave 1s ease-in-out infinite 0.9s; }
</style>

