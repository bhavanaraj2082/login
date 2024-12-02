<script>
import Bulkupload from './Bulkupload.svelte';
import { onMount } from 'svelte';
  import Icon from "@iconify/svelte";
  import {enhance} from "$app/forms"
  import { authedUser } from '$lib/stores/filter.js';
  import { cartState } from '$lib/stores/cartStores.js';
  import {convertUsdToInr} from '$lib/stores/priceconversion.js'
  let uploadedRows=[];
  
  const convertPriceToInr = (usdPrice) => {
      return convertUsdToInr(usdPrice); 
    };
  const isPriceInUsd = (price) => {
      return price.startsWith('$');
    };
  
    const parseUsdPrice = (price) => {
      return parseFloat(price.replace('$', '').replace(',', '')); 
    };
  
  import * as XLSX from "xlsx";
  let stockAvailability ="";
    let stockUnAvailability = "";
    let stockType = "";
  export let data;
  let email = '';
  let products="";
  // console.log("**************************");
//   console.log("i am quick",products.length);
  let selectedProduct = null;
  let stockStatus = '';
  let searchQuery = "";
  let rawFileData = "";
  let toggle=false;
  let showSavedCarts=false;
  let showRecentOrders=false;
  let showLists=false;
  let showquotes=false;
  let showDetailsModal=false;
  let fileError = "";
  let quantity=1;
  let cartNotification = '';
  let notificationTimeout;
  let productNumbers='';
  let inputValue = '';
  let rows = [
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' }
    ];
  let recentOrders = []; 
  let validationMessages = [];
  let showCartMessage = false;
  let userLoggedIn = false;
  $: {
      const user = $authedUser;
      userLoggedIn = user && user.email;
      email = user?.email || '';
    //   console.log('Logged-in user email:', email);  // Log the email here
  }
  function checkAvailability() {
    if (!selectedProduct) {
      stockStatus = "No product selected.";
      return;
    }
  
    const productStock = products.find(product => product.productNumber === selectedProduct.productNumber);
    
    if (productStock) {
      if (productStock.stockQuantity > 0) {
        stockStatus = "In Stock"; 
      } else {
        stockStatus = "Out of Stock"; 
      }
    } else {
      stockStatus = "In Stock"; 
    }
  }
  function handleTextChange(event) {
    rawFileData = event.target.value;
    cleanRawData(); 
    validateProductNumbers();
  }


  function handleInput(event, sku, index) {
      inputValue = event.target.value;
  }
 function validateProductNumbers() {
    const rows = rawFileData.split("\n");
    const validationResults = [];
  
    for (let row of rows) {
      const columns = row.split(",");
      const productNumberAndSize = columns[0]?.trim(); 
      const quantity = columns[1] ? parseInt(columns[1].trim(), 10) : 1; 
  
      if (!productNumberAndSize) {
        validationResults.push({
          productNumber: "Unknown",
          message: "Invalid input format",
          isValid: false,
        });
        continue;
      }
  
      const [productNumber, uploadedSize] = productNumberAndSize.split("-");
      const product = products.find((p) => p.productNumber === productNumber);
  
      if (product) {
        const normalizedSizes = product.priceSize?.map((ps) => ps.size.replace(/\s+/g, ""));
        const normalizedUploadedSize = uploadedSize ? uploadedSize.replace(/\s+/g, "") : null;
  
        if (normalizedSizes?.includes(normalizedUploadedSize)) {
          if (product.stockQuantity >= quantity) {
            validationResults.push({
              productNumber: productNumberAndSize,
              message: `Valid (${quantity} unit${quantity > 1 ? "s" : ""})`,
              isValid: true,
            });
          } else {
            validationResults.push({
              productNumber: productNumberAndSize,
              message: `Insufficient stock. Only ${product.stockQuantity} unit${product.stockQuantity > 1 ? "s" : ""} available.`,
              isValid: false,
            });
          }
        } else if (uploadedSize) {
          validationResults.push({
            productNumber: productNumberAndSize,
            message: "Valid product number but size is invalid",
            isValid: false,
          });
        } else {
          validationResults.push({
            productNumber: productNumber,
            message: "Valid product number but size is missing",
            isValid: false,
          });
        }
      } else {
        validationResults.push({
          productNumber: productNumberAndSize,
          message: "Invalid product number",
          isValid: false,
        });
      }
    }
  
    validationMessages = validationResults;
  }
  
  
  
  function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
  }
  
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  let estimatedShipDate = formatDate(currentDate);
  
  


function findProductBySku(sku) {
    // Normalize the SKU by trimming and converting to lowercase
    const normalizedSku = sku.trim().toLowerCase();
    console.log('Searching for product with SKU:', normalizedSku);

    // Split the SKU at the last hyphen
    const lastHyphenIndex = normalizedSku.lastIndexOf('-');
    const productNumber = lastHyphenIndex !== -1 ? normalizedSku.substring(0, lastHyphenIndex).trim() : normalizedSku;
    const size = lastHyphenIndex !== -1 ? normalizedSku.substring(lastHyphenIndex + 1).trim() : '';

    console.log('Extracted Product Number:', productNumber);
    console.log('Extracted Size:', size);

    // Attempt to find the product by the product number
    let product = products.find(product => 
        String(product.productNumber).trim().toLowerCase() === productNumber
    );

    // If the product is found, check if the size matches
    if (product) {
        // Check if the size matches the product's size options
        const sizePriceInfo = product.priceSize?.find(item => item.size.toLowerCase() === size.toLowerCase());
        
        if (!sizePriceInfo) {
            console.warn(`No matching size found for product number: ${productNumber} with size: ${size}`);
            return null; // or handle as needed (e.g., return a default product or throw an error)
        }
        
        // If size matches, return the product
        return product;
    } else {
        console.log(`No matching product found for SKU: ${sku}`);
        return null;
    }
}
  function handleProductFilter(sku, index) {
    rows[index].filteredProducts = [];
    searchQuery = sku.trim().toLowerCase(); 
  
    if (searchQuery === '') {
        rows[index].error = "";
        return;
    }

    const matchedProducts = products.filter(product =>
        product.productNumber.toString().toLowerCase().includes(searchQuery) 
    );
  
    rows[index].filteredProducts = matchedProducts;
  
    if (matchedProducts.length === 0) {
        rows[index].error = "Invalid product number";
    } else {
        rows[index].error = "";
    }
}
function clearSelectedProduct(index) {
  rows[index].sku = '';
  rows[index].size = '';
  rows[index].filteredProducts = [];
  rows[index].error = '';
  
  
  selectedProduct = null;
  }
  function selectProduct(product, index, size) {
      rows[index] = {
          ...rows[index],
          sku: `${product.productNumber} - ${size.size}`,
          size: size.size,
          filteredProducts: [],
          selectedSize: size.size,
          quantity: Math.max(1, rows[index].quantity), 
      };
  
      selectedProduct = product;
      checkAvailability();
  }
  function clearSearch(index) {
      rows[index].sku = '';
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



function addManualEntriesToCart() {
    const validRows = rows.filter(row => row.sku.trim() !== ''); 
    const newCartItems = validRows.map(row => {
        const sku = row.sku.trim();
        console.log(`Processing SKU: ${sku}`);
        const product = findProductBySku(sku);
  
        if (product) {
            const selectedSize = row.selectedSize || product.priceSize?.[0]?.size; // Default to the first size if none selected
            const sizePriceInfo = product.priceSize?.find(item => item.size === selectedSize);
  
            if (!sizePriceInfo) {
                console.warn(`No size/price info for size: ${selectedSize}. Skipping product.`);
                return null;
            }

            return {
                description: product.prodDesc,
                id: product.id,
                name: product.productName,
                image: product.imageSrc,
                partNumber: product.productNumber,
                priceSize: {
                    price: sizePriceInfo.price,
                    size: selectedSize,
                },
                quantity: row.quantity > 0 ? row.quantity : 1,
                stock: product.stockQuantity,
            };
        } else {
            console.log(`No matching product found for SKU: ${sku}`);
            return null;
        }
    }).filter(item => item !== null); 

    if (newCartItems.length === 0) {
        console.log('No valid products to add to the cart.');
        return;
    }

    try {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Current cart from localStorage:', currentCart);

        newCartItems.forEach(newItem => {
            const existingItem = currentCart.find(item =>
                item.partNumber === newItem.partNumber &&
                item.priceSize.size === newItem.priceSize.size
            );

            if (existingItem) {
                console.log(`Updating quantity for: ${newItem.partNumber}`);
                existingItem.quantity += newItem.quantity;
            } else {
                console.log(`Adding new item to cart: ${newItem.partNumber}`);
                currentCart.push(newItem);
            }
        });

        localStorage.setItem('cart', JSON.stringify(currentCart));
        cartState.set(currentCart);
        
        // Update the notification message
        const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0); // Total quantity of items
        cartNotification = `You have ${totalItems} item(s) in your cart.`;

    } catch (err) {
        console.error('Error saving to localStorage:', err);
    }

   
    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        cartNotification = ''; 
        window.location.href = '/cart';  

    }, 3000);  

   
    setTimeout(() => {
        rows = [
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null }
        ];
    }, 4000);  
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
  
  
  function showDetails() {
      selectedProduct = { ...selectedProduct, quantity: 1 };
      showDetailsModal = true;
  }
  
  
  function hideDetails() {
      showDetailsModal = false;
  }
  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }
 
  function addRows() {
      rows = [
          ...rows,
          ...Array(3).fill({
              sku: "",
              size: '',
              quantity: 1,
              error: "",
              filteredProducts: [],
              selectedSize: null,
          }),
      ];
  }
  async function handleFileUpload(selectedFile) {
  const file = selectedFile;
  fileError = "";  
  rawFileData = "";  
  
  if (!file) {
      fileError = "No file selected.";
      console.error("No file selected.");
      return;
  }
  
  
  const validFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'text/plain'];
  if (!validFileTypes.includes(file.type)) {
      fileError = "Invalid file type. Please upload a CSV, XLS, .txt, or XLSX file.";
      console.error("Invalid file type:", file.type);
      return;
  }
  
  const reader = new FileReader();
  reader.onload = async (e) => {
      try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];  // Get the first sheet
          
          
          rawFileData = XLSX.utils.sheet_to_csv(worksheet);
          
          if (!rawFileData.trim()) {
              fileError = "File is empty or incorrectly formatted.";
              console.error("File is empty or incorrectly formatted.");
              return;
          }
  
          cleanRawData();
          validateProductNumbers();  
      } catch (err) {
          fileError = "Error parsing the file.";
          console.error("Error parsing the file:", err);
      }
  };
  
  reader.onerror = (err) => {
      fileError = "Error reading the file.";
      console.error("Error reading the file:", err);
  };
  
  reader.readAsArrayBuffer(file);  
  }
  function cleanRawData() {
  
  const rowsData = rawFileData.trim().split('\n');
  
  
  uploadedRows = rowsData.map((line, index) => {
      const [sku, quantity] = line.split(',').map(item => item.trim());
      return {
          sku: sku || "", 
          quantity: quantity ? parseInt(quantity, 10) : 1, 
          error: "", 
          filteredProducts: [], 
          selectedSize: null,
      };
  });
  validateProductNumbers();
  }
  function decreaseQuantity() {
  if (selectedProduct && selectedProduct.quantity > 1) {
      selectedProduct.quantity -= 1;
    }
  }
  
  
  function increaseQuantity() {
    if (selectedProduct && selectedProduct.quantity < 9999) {
      selectedProduct.quantity += 1;
    }
  }
  
  
 
  
  function addToCart(rowsToProcess) {
    const validRows = rowsToProcess.filter(row => row.sku.trim() !== '');
    const newCartItems = validRows.map(row => {
        const sku = row.sku.trim();
        console.log(`Processing SKU: ${sku}`);
        const product = findProductBySku(sku);
  
        if (product) {
            const selectedSize = row.size || product.priceSize?.[0]?.size; 
            const sizePriceInfo = product.priceSize?.find(item => item.size === selectedSize);
  
            if (!sizePriceInfo) {
                console.warn(`No size/price info for size: ${selectedSize}. Skipping product.`);
                return null;
            }
  
            return {
                description: product.prodDesc,
                id: product.id,
                name: product.productName,
                image: product.imageSrc,
                partNumber: product.productNumber,
                priceSize: {
                    price: sizePriceInfo.price,
                    size: selectedSize,
                },
                quantity: row.quantity > 0 ? row.quantity : 1,
                stock: product.stockQuantity,
            };
        } else {
            console.log(`No matching product found for SKU: ${sku}`);
            return null;
        }
    }).filter(item => item !== null);
  
    if (newCartItems.length === 0) {
        console.log('No valid products to add to the cart.');
        return;
    }
  
    try {
        // Retrieve the current cart from localStorage or initialize an empty array
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Current cart from localStorage:', currentCart);
  
        newCartItems.forEach(newItem => {
            const existingItem = currentCart.find(item =>
                item.partNumber === newItem.partNumber &&
                item.priceSize.size === newItem.priceSize.size
            );
  
            if (existingItem) {
                // Update quantity if the product already exists
                console.log(`Updating quantity for: ${newItem.partNumber}`);
                existingItem.quantity += newItem.quantity;
            } else {
                // Add new item if it does not already exist
                console.log(`Adding new item to cart: ${newItem.partNumber}`);
                currentCart.push(newItem);
            }
        });
  
        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(currentCart));
        console.log('Updated cart saved to localStorage:', currentCart);
  
        // Update the `cartState` store (if using a reactive store)
        cartState.set(currentCart);
        const totalItems = currentCart.length;
        cartNotification = `You have ${totalItems} item(s) in your cart.`;
    } catch (err) {
        console.error('Error saving to localStorage:', err);
    }
  

    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        cartNotification = '';
  
      
        rows = [
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
            { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null }
        ];
        uploadedRows = [];
        validationMessages = [];
        rawFileData = "";
        stockStatus = '';
    }, 3000);
  }
  
  
  </script>
  


  <div class="w-11/12 mx-auto py-5 px-2 md:flex md:space-x-8 max-w-7xl">

    <div class="md:w-full">
        <h1 class="font-bold text-lg md:text-2xl">Quick Order</h1>
    
     
        {#if !userLoggedIn}
            <div class="flex justify-normal md:justify-end">
                <div class="flex items-center gap-2 w-72 text-xs rounded-md p-3 border border-primary-100 shadow-sm bg-white shadow-primary-100 my-1">
                    <Icon icon="mingcute:warning-line" class="text-primary-500 text-4xl shrink-0" />
                    <a href="/login"><span class="hover:text-primary-600 text-primary-400">Sign in  </span> to import items from your recent orders and quotes.</a>
                </div>
            </div>
        {/if}
    
     
        <div class="my-4 lg:ml-4">
            <button on:click={() => (toggle = false)} class="px-5 py-2 text-sm font-semibold {toggle ? 'bg-primary-200' : 'bg-white border-b-2 border-primary-500 text-primary-500'}">
                Manual Entry
            </button>
            <button on:click={() => (toggle = true)} class="px-5 py-2 text-sm font-semibold {toggle ? 'bg-white border-b-2 border-primary-500 text-primary-500' : 'bg-primary-200'}">
                Bulk Upload
            </button>
        </div>

        {#if toggle}
        <Bulkupload {data} />


        {:else}
    <div class="space-y-2 lg:px-5 ">
      {#each rows as row, index}   
       <form 
      action="?/quicksearch" 
      method="POST" 
      use:enhance={() => {
          return async ({ result }) => {
          //   console.log(result);
          //   console.log(result.data);
            products=result.data;
            console.log(products);
            
            productNumbers = result.data.map(record => record.productNumber);          
          };
          }}
    >
      
  <div class="flex sm:w-full gap-2 items-center relative ">


    
    <input
      type="text"
      name="quickSearch"
      bind:value={row.sku}
      placeholder="Enter at least 2 characters"
      on:input={(event) => handleInput(event, row.sku, index)} 
  
      class="hover:border-primary-500 h-10 mt-2 focus:border-primary-400 focus:outline-none focus:ring-0 mb-2 rounded p-2 items-center ml-4 w-10/12 text-sm border-1 border-gray-200 transition duration-200"
    />
    {#each products as product}
    <option value={product.productNumber}>{product.productNumber}</option>
  {/each}
    
    {#if searchQuery && row.filteredProducts.length > 0}
      <div class="absolute top-full w-full mt-1 ml-4 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10">
        <button
          class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
          on:click={() => clearSearch(index)}
        >
          <Icon icon="cuida:x-outline" class="w-5 h-5" />
        </button> 


        
        {#each row.filteredProducts as result (result.productNumber)}
          <div class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer">
            <div class="space-y-1 mt-2">
              {#if result.priceSize?.length > 0}
                {#each result.priceSize as size}
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      class="form-radio rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      id="size-{size.size}"
                      name="size-{result.productNumber}"
                      value={size.size}
                      bind:group={row.selectedSize}
                      checked={row.selectedSize === `${result.productNumber}-${size.size}`}
                      on:change={() => selectProduct(result, index, size)}
                    />
                    <label for="size-{size.size}">{result.productNumber} - {size.size}</label>
                  </div>
                {/each}
              {:else}
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    class="form-radio rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    id="product-{result.productNumber}"
                    name="size-{result.productNumber}"
                    value={result.productNumber}
                    bind:group={row.selectedSize}
                    checked={row.selectedSize === result.productNumber}
                    on:change={() => selectProduct(result, index, { size: null })}
                  />
                  <label for="product-{result.productNumber}">{result.productNumber}</label>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  <div class="w-full md:w-72 md:mt-0 flex items-center gap-2">
   
      {#if row.selectedSize === null}
     
        <span class="text-red-500 font-medium">Cannot be added to the cart</span>
      {:else}
        <input
          type="number"
          min="1"
          bind:value={row.quantity}
          class="w-2/3 grow text-center border-1 border-gray-200 rounded bg-white font-medium h-10 outline-none py-2 hover:border-primary-400 focus:border-primary-400 focus:ring-0"
          on:input={() => row.quantity = Math.max(1, Math.min(9999, row.quantity))}
          aria-label="Quantity"
        />
        

        <button
          class="outline-none"
          on:click={() => incrementQuantity(index)}
          aria-label="Increase Quantity"
        >
          <Icon icon="ic:round-plus" class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2" />
        </button>
        <button
          class="outline-none"
          on:click={() => decrementQuantity(index)}
          aria-label="Decrease Quantity"
        >
          <Icon icon="ic:round-minus" class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2" />
        </button>
      {/if}
    </div>
  </div>
</form>
    
        {#if cartNotification}
        <div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
            {cartNotification}
        </div>
      {/if}
     
         
      {#if row.error}
      <div class="text-red-500 ml-5 text-medium mt-2">
        {row.error}
      </div>
    {/if}

      {#if selectedProduct && selectedProduct.productNumber === row.sku.substring(0, row.sku.lastIndexOf('-')).trim()}
    <div class="w-full mt-3 flex  ml-5 gap-4 items-center hidden md:flex lg:flex xl:flex">
  <span class="font-semibold">{selectedProduct.productName}</span>
  <span>Size: {selectedProduct.priceSize?.[0]?.size || 'No Size Available'}</span>
<span>
    {#if selectedProduct.priceSize?.[0]?.price}
      {#if isPriceInUsd(selectedProduct.priceSize[0].price)}
        ₹{convertPriceToInr(parseUsdPrice(selectedProduct.priceSize[0].price))}
      {:else}
        {selectedProduct.priceSize[0].price}
      {/if}
    {:else}
      <a href="/quotes" class="text-primary-400 hover:underline">Request a Quote</a>
    {/if}
  </span> <span>
      1 Estimated to ship on {estimatedShipDate} 
  </span>
  <button class="p-2 text-primary-400 rounded" on:click={showDetails}>
    Details
  </button>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="p-2 text-red-500 cursor-pointer hover:text-red-700"
    on:click={() => clearSelectedProduct(index)}
  >
    <Icon icon="mdi:close-circle" class="w-6 h-6" />
  </div>
</div>
<hr/>
{/if}
    {/each}
    <div class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54">
            <button on:click={addRows} class="text-primary-500 text-md mt-6 ml-5"> + Add More</button>
            
            <button 
                on:click={addManualEntriesToCart} 
                class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center " >
                <span>Add to Cart</span>
                <Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
            </button>
        </div>
    
       
        {#if cartNotification}
        <div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
            {cartNotification}
        </div>
      {/if}
    </div>
    
    
    {/if}
    </div>


    {#if userLoggedIn}
    
    <div class="w-full sm:w-full md:w-1/4 lg:w-1/4 h-1/2 ml-0 sm:ml-0 mt-8 md:mt-24 bg-gray-50 border rounded-lg border-gray-400 p-4 ">

        <h2 class="font-semibold text-xl mb-2">
            Hello, {email.split('@')[0].replace(/\d+/g, '')}
          </h2>
          
        <div class="mb-2">
     
            <div class="flex items-center space-x-2">
                <h3 class="font-semibold text-lg">Saved Carts</h3>
                <button 
                    class="text-primary-500"
                    on:click={() => showSavedCarts = !showSavedCarts}>
                    <Icon 
                        icon={showSavedCarts ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} 
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
                              You have {cart.reduce((sum, item) => sum + item.quantity, 0)} items 
                            </button>
                          </li>
                          <li>
                            <a href="/cart" class="text-primary-400  hover:underline font-semibold">See your items</a>
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
                on:click={() => showLists = !showLists}>
                <Icon 
                    icon={showLists ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} 
                    class="text-3xl" 
                />
            </button>
          
        </div>
        {#if showLists}
       <a href="/lists" class="text-gray-500 ">See Lists# </a>
    {/if}
    <div class="flex items-center space-x-2 mt-2">
        <h3 class="font-semibold text-lg">Quotes</h3>
        <button 
            class="text-primary-500"
            on:click={() => showquotes = !showquotes}>
            <Icon 
                icon={showquotes ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} 
                class="text-3xl" 
            />
        </button>
      
    </div>
    {#if showquotes}
   <a href="/quotes" class="text-gray-500 " >See Quotes # </a>
{/if}
        
    </div>

{/if}



{#if showDetailsModal && selectedProduct}
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center !ml-0 z-50">
  <div class="bg-white p-6 rounded-lg w-1/2 relative">
    <button
      class="absolute top-2 right-2 text-primary-500 hover:text-primary-700"
      on:click={hideDetails}
      aria-label="Close"
    >
      <Icon icon="cuida:x-outline" class="w-5 h-5" />
    </button>

    <h3 class="text-xl font-semibold">
      {selectedProduct.productName} - {selectedProduct.productNumber}
    </h3>
    <p class="mt-2">Enter quantity to check availability and estimated ship date.</p>

    <form
      method="POST"
      action="?/quickcheck"
      use:enhance={() => {
        return async ({ result }) => {
          if (!selectedProduct) return;
          selectedProduct.stockStatus = result.data.record.stock;
          selectedProduct.stockAvailability = result.data.record.message;
          selectedProduct.stockUnAvailability = result.data.record.message1;
          selectedProduct.stockType = result.data.record.type;

          console.log("Updated Product Data:", selectedProduct);
        };
      }}
    >
      <div class="flex items-center mt-2 gap-5">
        <input type="hidden" name="ProductId" value={selectedProduct.productNumber} />

       
        <button
          class="flex justify-center items-center w-12 h-12 bg-white text-primary-500 rounded border border-gray-300"
          on:click={decreaseQuantity}
        >
          <Icon icon="ic:round-minus" class="text-lg" />
        </button>

        <input
          type="text"
          name="quantity"
          bind:value={selectedProduct.quantity}
          class="w-20 h-12 text-center p-2 border border-gray-300 rounded"
          on:input={() => {
            if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
            if (selectedProduct.quantity > 9999) selectedProduct.quantity = 9999;
          }}
        />

        <button
          class="flex justify-center items-center w-12 h-12 bg-white text-primary-500 rounded border border-gray-300"
          on:click={increaseQuantity}
        >
          <Icon icon="ic:round-plus" class="text-lg" />
        </button>

        <button
          class="flex justify-center items-center w-40 h-12 text-white bg-primary-500 rounded"
          type="submit"
        >
          Check Availability
        </button>
      </div>
    </form>

    <p class="mt-2">
      Estimated to ship on {estimatedShipDate || "N/A"} for quantity {selectedProduct.quantity} from Bangalore Non-Bonded Warehouse
    </p>

    {#if selectedProduct.stockType === 'success'}
    <div class="mt-6 space-y-2 text-sm">
      <div class="flex items-center space-x-2">
        <i class="fa-regular fa-check-circle text-primary-400"></i>
        <p>{selectedProduct.stockAvailability}</p>
      </div>
      <!-- {#if selectedProduct.stockUnAvailability !== ''}
        <div class="flex items-center space-x-2">
          <i class="fa-regular fa-check-circle text-primary-400"></i>
          <p>{selectedProduct.stockUnAvailability}</p>
        </div>
      {/if} -->
    </div>
    {:else if selectedProduct.stockType === 'error'}
    <div class="mt-6 space-y-2 text-sm">
      <div class="flex items-center space-x-2">
        <i class="fa-regular fa-xmark-circle text-primary-400"></i>
        <p>{selectedProduct.stockAvailability}</p>
      </div>
    </div>
    {/if}

  
    <button
        class="mt-3 p-2 text-white bg-primary-500 rounded flex items-center gap-2"
        on:click={() => {
        addToCart(rows, products);  
        showCartMessage = true;     
        hideDetails();              
        }}
        >
        <span>Add to Cart</span>
      <Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
      </button>
  </div>
</div>
{/if}
</div>
