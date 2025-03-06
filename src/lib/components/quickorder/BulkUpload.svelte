<script>
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  export let data;
  let validationMessages = [];
  let duplicateEntries = [];
  let rawFileData = "";
  let fileError = "";
  let cartNotification = "";
  let formElement;
  let validatedProducts = [];
  let cartloading = false;
  let requestsent = false;

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

  // function removeDuplicateEntry(productInfo, event) {
  //     // Get the current lines and create a map to track first occurrence
  //     const lines = rawFileData.split('\n').filter(line => line.trim());
  //     const seenProducts = new Map();

  //     // Keep only the first occurrence of each product
  //     const deduplicatedLines = lines.filter(line => {
  //       const [currentProductInfo] = line.split(',').map(item => item.trim());
  //       if (currentProductInfo === productInfo) {
  //         if (seenProducts.has(productInfo)) {
  //           return false; // Skip duplicates
  //         }
  //         seenProducts.set(productInfo, true); // Mark as seen
  //       }
  //       return true;
  //     });

  //     // Update the raw file data with deduplicated content
  //     rawFileData = deduplicatedLines.join('\n');

  //     // Recheck for any remaining duplicates
  //     const { duplicates } = checkForDuplicates(rawFileData);
  //     duplicateEntries = duplicates;

  //     toast.success(`Removed duplicate entry for ${productInfo}`);

  //     // Create a new FormData with the updated content
  //     const formData = new FormData(event.target.closest('form'));

  //     // Create a new File object with the deduplicated content
  //     const deduplicatedFile = new File([rawFileData], 'updated.csv', {
  //       type: 'text/csv'
  //     });

  //     formData.set('file', deduplicatedFile);

  //     // If no more duplicates, submit the form with deduplicated data
  //     if (duplicateEntries.length === 0) {
  //       const form = event.target.closest("form");
  //       if (form) {
  //         // Update the form's file input with the new deduplicated file
  //         const dataTransfer = new DataTransfer();
  //         dataTransfer.items.add(deduplicatedFile);
  //         const fileInput = form.querySelector('input[type="file"]');
  //         if (fileInput) {
  //           fileInput.files = dataTransfer.files;
  //         }

  //         form.requestSubmit();
  //       }
  //     }
  //   }
  function removeDuplicateEntry(productInfo, event) {
    // Get the current lines and create a map to track first occurrence
    const lines = rawFileData.split("\n").filter((line) => line.trim());
    const seenProducts = new Map();

    // Keep only the first occurrence of each product
    const deduplicatedLines = lines.filter((line) => {
      const [currentProductInfo] = line.split(",").map((item) => item.trim()); // Trim here
      if (currentProductInfo === productInfo) {
        if (seenProducts.has(productInfo)) {
          return false; // Skip duplicates
        }
        seenProducts.set(productInfo, true); // Mark as seen
      }
      return true;
    });

    // Now, trim the content for every line (ensure no extra spaces are left)
    const finalLines = deduplicatedLines.map((line) => {
      const [productInfo, quantity] = line
        .split(",")
        .map((item) => item.trim()); // Trim here
      return `${productInfo},${quantity}`;
    });

    // Update the raw file data with trimmed, deduplicated content
    rawFileData = finalLines.join("\n");

    // Recheck for any remaining duplicates (this will run after trimming)
    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;

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

  function handleTextChange(event) {
    rawFileData = event.target.value.trim();
    const { duplicates } = checkForDuplicates(rawFileData);
    duplicateEntries = duplicates;
  }

  let selectedFileName = ""; // To store the selected file name

  function handleFileInputChange(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        rawFileData = e.target.result;
        fileError = "";
        selectedFileName = file.name;
        const { duplicates } = checkForDuplicates(rawFileData);
        duplicateEntries = duplicates;

        if (duplicates.length > 0) {
          toast.error(
            `Found ${duplicates.length} duplicate entries. Please review and remove them.`,
          );
        } else {
          const form = event.target.closest("form");
          if (form) {
            form.requestSubmit();
          }
        }
      };

      reader.onerror = function () {
        fileError = "Error reading the file. Please try again.";
      };

      reader.readAsText(file);
    } else {
      fileError = "No file selected.";
    }
  }

  async function addValidatedProductsToCart() {
    cartloading = true;
    try {
      const authedUser = data.authedUser;
      let productsAddedCount = 0;
      const productsToAdd = [];

      validatedProducts.forEach((product) => {
        if (!product.isValid) {
          console.log(
            `Product ${product.productNumber} is not valid: ${product.message}`,
          );
          return;
        }

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
            quantity: product.quantity,
            backOrder: Math.max(product.quantity - product.stock),
            stock: product.stock,
          };

          productsToAdd.push(newProduct);
          productsAddedCount++;
          console.log(
            `Prepared product ${newProduct.productName} for cart addition`,
          );
        } else {
          console.log(
            `Product ${product.productName} did not pass validation.`,
          );
        }
      });

      if (productsAddedCount > 0) {
        if (!authedUser || !authedUser.id) {
          try {
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = [...existingCart, ...productsToAdd];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            cartloading = false;
            toast.success(
              `${productsAddedCount} ${productsAddedCount === 1 ? "item" : "items"} saved to cart.`,
            );
            setTimeout(() => {
              location.reload();
            }, 2000);
            return;
          } catch (err) {
            console.error("Error saving to localStorage:", err);
            cartloading = false;
            toast.error("Failed to save items to cart");
            return;
          }
        }
        const form = new FormData();
        form.append("cartItems", JSON.stringify(productsToAdd));

        try {
          const response = await fetch("?/addToCart", {
            method: "POST",
            body: form,
          });

          const textResponse = await response.text();
          const result = JSON.parse(textResponse);
          cartloading = false;
          const resultData = JSON.parse(result.data);

          if (resultData && resultData[0]?.success === 1) {
            toast.success(
              `${productsAddedCount} ${productsAddedCount === 1 ? "item" : "items"} added to the cart.`,
            );
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            throw new Error(resultData[1] || "Failed to add items to cart");
          }
        } catch (err) {
          console.error("Error adding to cart:", err);
          cartloading = false;
          toast.error("Failed to add items to cart");
          return;
        }
      } else {
        toast.error("No valid items to add to cart");
        cartloading = false;
        console.log("No valid products to add to cart");
      }
    } catch (err) {
      console.error("Error in cart management:", err);
      toast.error("Error adding items to cart.");
      cartloading = false;
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
    
    // Check if validatedProducts exists and has items
    if (!validatedProducts || validatedProducts.length === 0) {
      console.log("No validated products found");
      return productsToAdd;
    }
    
    validatedProducts.forEach((product) => {
      if (!product.isValid) {
        console.log(
          `Product ${product.productNumber} is not valid: ${product.message}`
        );
        return;
      }

      if (
        product.stockMessage === "Stock is sufficient for all uploaded quantities" ||
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
          quantity: product.quantity,
          backOrder: Math.max(product.quantity - product.stock),
          stock: product.stock,
        };

        productsToAdd.push(newProduct);
        console.log(
          `Prepared product ${newProduct.productName} for cart addition`
        );
      } else {
        console.log(
          `Product ${product.productName} did not pass validation.`
        );
      }
    });
    
    console.log(`Prepared ${productsToAdd.length} products for cart`);
    return productsToAdd;
  }
  
  // Handle local storage for non-authenticated users
  function handleLocalStorage() {
    try {
      cartloading = true;
      const productsToAdd = prepareValidatedProductsForCart();
      const simplifiedCartItems = productsToAdd.map((item) => ({
      productId: item.id,
      manufacturerId: item.manufacturerId,
      stockId: item.stockId,
      distributorId: item.distributerId,
      quantity: item.quantity,
      backOrder: item.backOrder,
    }));
      if (productsToAdd.length === 0) {
        cartloading = false;
        toast.error("No valid items to add to cart");
        return;
      }
      
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = [...existingCart, ...simplifiedCartItems];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      const productsAddedCount = productsToAdd.length;
      toast.success(
        `${productsAddedCount} ${productsAddedCount === 1 ? "item" : "items"} saved to cart.`
      );
      
      cartloading = false;
      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (err) {
      cartloading = false;
      console.error("Error saving to localStorage:", err);
      toast.error("Failed to save items to cart");
    }
  }
</script>

<div class="text-black text-sm md:ml-2 mb-1">
  *Kindly upload the file with the product number-size,quantity, without any
  headers.
</div>
<form
  bind:this={formElement}
  method="POST"
  action="?/uploadFile"
  enctype="multipart/form-data"
  use:enhance={() => {
    requestsent = true;

    return async ({ result }) => {
      const { duplicates } = checkForDuplicates(rawFileData);

      if (duplicates.length > 0) {
        toast.error("Please remove duplicate entries before submitting");
        return;
      }
      let products = result.data;
      products.forEach((product) => {
        processProduct(product);
      });

      validatedProducts = products;
      requestsent = false;

      if (result.data && Array.isArray(result.data)) {
        validationMessages = result.data.map((item) => ({
          productNumber: item.productNumber || "Unknown",
          isValid: item.isValid,
          message: item.message || "Unknown message",
        }));
      }
    };
  }}
>
  {#if requestsent}
    <div
      class="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="flex flex-col justify-center items-center">
        <!-- Spinner Circle -->
        <div class="relative">
          <div class="absolute rounded-full">
            <Icon
              icon="line-md:loading-alt-loop"
              class=" h-32 w-32  mr-1 border-8 border-t-8 border-orange-500 animate-spin"
            />
          </div>
          <!-- Icon with orange color -->
          <Icon
            icon="tabler:letter-c"
            width="128"
            height="128"
            class="text-orange-500 z-10"
          />
        </div>
      </div>
    </div>
  {/if}

  <section class="w-full mx-auto md:flex items-center gap-5">
    <div
      class="md:w-3/5 h-72 border bg-white rounded overflow-hidden overflow-y-scroll p-5"
    >
      {#if rawFileData}
        <textarea
          class="w-full h-full p-2 border border-gray-300 rounded"
          bind:value={rawFileData}
          on:input={handleTextChange}
          placeholder="Edit the CSV content here..."
          readonly
        ></textarea>
      {:else}
        <div class="text-gray-300 text-sm">
          <p>Example</p>
          <p>7987565-50G,1</p>
          <p>657890-100G,5</p>
          <p>345678-25G,3</p>
        </div>
      {/if}
      {#if fileError}
        <p class="text-red-500 text-sm mt-2">{fileError}</p>
      {/if}
    </div>

    <section class="mt-3 md:mt-0 md:w-2/5">
      <div
        class="flex justify-center bg-white items-center h-12 border rounded"
      >
        <a
          class="flex items-center gap-2 text-sm font-medium text-primary-500"
          href="/quick_order_template.csv"
          download
        >
          <Icon icon="pajamas:download" class="text-lg" /> Download Template
        </a>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border border-dashed"
        on:click={() => document.getElementById("bulkupload").click()}
      >
        <Icon icon="uil:upload" class="text-7xl text-primary-500 -ml-4" />
        <p class="text-sm">
          Drag and Drop your CSV or XLS file to upload or Choose file
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

      {#if selectedFileName}
        <p class="text-sm text-primary-500 mt-2">{selectedFileName}</p>
      {/if}
      {#if fileError}
        <p class="text-sm text-red-500 mt-2">{fileError}</p>
      {/if}
    </section>
  </section>
  {#if duplicateEntries.length > 0}
    <div class="mt-4 p-4 bg-red-50 rounded-md">
      <h3 class="text-red-700 font-medium mb-2">Duplicate Entries Found:</h3>
      <ul class="space-y-2">
        {#each duplicateEntries as entry}
          <li class="flex items-center justify-between">
            <span class="text-red-600">
              Line {entry.line}: {entry.content}
            </span>
            <!-- <button
            type="button"
            class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            on:click={() => removeDuplicateEntry(entry.productInfo)}
          >
            Remove
          </button> -->
            <button
              type="button"
              class="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
  {#if validationMessages.length > 0}
    <ul class="mt-3 text-sm">
      <!-- {#each validationMessages as message}
        <li>
          <p class={message.isValid ? "text-green-500" : "text-red-500"}>
            Product: {message.productNumber} - {message.isValid
              ? "Valid"
              : "Invalid"} - {message.message}
          </p>
        </li>
      {/each} -->
      {#each validationMessages.filter(message => !message.isValid) as message}
  <li>
    <p class="text-red-500">
      Product: {message.productNumber} - Invalid - {message.message}
    </p>
  </li>
{/each}

    </ul>
  {/if}
</form>
<!-- 
<div class="flex justify-end">
  <button
    class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
    on:click={addValidatedProductsToCart}
  >
    {#if cartloading}
      <span>Adding...</span>
    {:else}
      <Icon icon="ic:round-shopping-cart" class="text-2xl" />
      <span>Add to Cart</span>
    {/if}
  </button>
</div> -->

<div class="flex justify-end">
  {#if data?.authedUser && data?.authedUser?.id}
    <form
      method="POST"
      action="?/addToCart"
      use:enhance={({ formData, cancel }) => {
        cartloading = true;

        const productsToAdd = prepareValidatedProductsForCart();

        if (productsToAdd.length === 0) {
          cancel();
          cartloading = false;
          toast.error("No valid items to add to cart");
          return;
        }
        
        formData.set('cartItems', JSON.stringify(productsToAdd));
        
        return async ({ result }) => {
          cartloading = false;
          
          try {
            const resultData = result.data;
            
            if (resultData && resultData.success === true) {
              const productsAddedCount = productsToAdd.length;
              toast.success(
                `${productsAddedCount} ${productsAddedCount === 1 ? "item" : "items"} added to the cart.`
              );
              setTimeout(() => {
                location.reload();
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
        class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
        disabled={cartloading}
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
      class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
      on:click={handleLocalStorage}
      disabled={cartloading}
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