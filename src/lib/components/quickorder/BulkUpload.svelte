<script>
    import { onMount } from 'svelte';
  import Icon from "@iconify/svelte";
  import {enhance} from "$app/forms"
  import { authedUser } from '$lib/stores/mainStores.js';
  import { cartState } from '$lib/stores/cartStores.js';

  let uploadedRows=[];
  
  
  
   
  
  
  
  import * as XLSX from "xlsx";
  
  export let data;
  let email = '';
  let products = data?.data || [];  
  // console.log("**************************");
  console.log("i am quick",products.length);
  
  let stockStatus = '';
  
  let rawFileData = "";
  
  let fileError = "";
  
  let cartNotification = '';
  let notificationTimeout;
  
  
  
  let rows = [
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: '' }
    ];
  
  let validationMessages = [];
  
  
  
  let userLoggedIn = false;
  $: {
      const user = $authedUser;
      userLoggedIn = user && user.email;
      email = user?.email || '';
  }
  
  function handleTextChange(event) {
    rawFileData = event.target.value;
    cleanRawData(); 
    validateProductNumbers();
  }
  function validateProductNumbers() {
    const rows = rawFileData.split("\n");
    const validationResults = [];
  
    for (let row of rows) {
      const columns = row.split(",");
      const productNumberAndSize = columns[0]?.trim(); // Example: "4296889-25G"
      const quantity = columns[1] ? parseInt(columns[1].trim(), 10) : 1; // Default quantity to 1
  
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
        // Normalize sizes for comparison (remove spaces)
        const normalizedSizes = product.priceSize?.map((ps) => ps.size.replace(/\s+/g, ""));
        const normalizedUploadedSize = uploadedSize ? uploadedSize.replace(/\s+/g, "") : null;
  
        if (normalizedSizes?.includes(normalizedUploadedSize)) {
          // Check stock availability
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
      const productNumber = sku.split('-')[0].trim();  
      console.log('Searching for product with SKU:', productNumber);
      return products.find(product => String(product.productNumber).trim() === productNumber);
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
  
  
  
  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }
  
  
  
  function handleFileInputChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
          handleFileUpload(files[0]);
      }
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
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];  
          
          
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
        console.log('Updated cart saved to localStorage:', currentCart);
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
        window.location.href = '/cart';  
        uploadedRows = [];
        validationMessages = [];
        rawFileData = "";
        stockStatus = '';
    }, 3000);
  }
  
  
  </script>
  
  
  
  
  <form action="?/uploadFile" method="POST" enctype="multipart/form-data">
      <div class="w-full lg:px-5">
        <p class="text-2s md:text-xs font-medium py-1.5">
          Type or paste product SKU (product number and pack size), quantity, promo code, and reference number separated by commas*.
          Enter separate products on new lines.
        </p>
    
        <section class="w-full mx-auto md:flex items-center gap-5">
          <div class="md:w-3/5 h-72 border-1 bg-white rounded overflow-hidden overflow-y-scroll p-5">
            {#if rawFileData}
              <textarea 
                class="w-full h-full p-2 border border-gray-300 rounded"
                bind:value={rawFileData} 
                on:input={handleTextChange}
                placeholder="Edit the CSV content here..."
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
            <div class="flex justify-center bg-white items-center h-12 border-1 rounded">
              <a class="flex items-center gap-2 text-sm font-medium text-primary-500" href="/quick_order_template.csv" download>
                <Icon icon="pajamas:download" class="text-lg" /> Download Template 
              </a>
            </div>
    
            <div
              class="w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border-1 border-dashed"
            >
              <Icon icon="uil:upload" class="text-3xl text-primary-500 -ml-4" />
              <p class="text-xs">Drag and Drop your CSV or XLS file to upload or</p>
              <label for="bulkupload" class="text-xs mr-3">
                <span class="font-medium text-primary-600">Choose File</span>
                <input
                  id="bulkupload"
                  class="hidden"
                  type="file"
                  accept=".xlsx, .xls, .csv,.txt"
                  name="file"
                  on:change={handleFileInputChange}
                />
              </label>
            </div>
          </section>
        </section>
    
        <p class="text-2s md:text-xs font-medium py-1.5">
          *Promo codes and references numbers cannot be used when requesting quotes.
        </p>
    
        {#if validationMessages.length > 0}
          <ul class="mt-3">
            {#each validationMessages as { productNumber, message, isValid }}
              <li class={isValid ? "text-green-500" : "text-red-500"}>{productNumber}: {message}</li>
            {/each}
          </ul>
        {/if}
    
        <div class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54">
          <button 
            type="submit"
            class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center ml-auto">
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
    </form>
    