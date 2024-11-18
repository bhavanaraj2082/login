<script>
  import Icon from "@iconify/svelte";
  import {enhance} from "$app/forms"
  import { authedUser } from '$lib/stores/mainStores.js';

  import * as XLSX from "xlsx";
  let stockAvailability ="";
        let stockUnAvailability = "";
        let stockType = "";
  export let data;
  let email = '';
  let products = data?.data || [];  
 // console.log("**************************");
  //console.log("i am quick",products);



  
  
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
  
  let currentDate = new Date();
  let estimatedShipDate = formatDate(currentDate);

  let rows = [
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null },
        { sku: "", size: '', quantity: 1, error: "", filteredProducts: [], selectedSize: null }
    ];
  let recentOrders = []; 
  let validationMessages = [];
  let showCartMessage = false;

  
  let userLoggedIn = false;
  $: {
      const user = $authedUser;
      userLoggedIn = user && user.email;
      email = user?.email || '';
  }
  function checkAvailability() {
    if (!selectedProduct) {
      stockStatus = "No product selected.";
      return;
    }

    const productStock = products.find(product => product.productNumber === selectedProduct.productNumber);
    
    if (productStock) {
      if (productStock.stockQuantity > 0) {
        stockStatus = "In Stock"; // Product is in stock
      } else {
        stockStatus = "Out of Stock"; // Product is out of stock
      }
    } else {
      stockStatus = "In Stock"; // Default message if no stock data is found
    }
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
      const productNumber = columns[0].trim(); 
 
      const product = products.find(p => p.productNumber === productNumber);
      
      if (product) {
        validationResults.push({
          productNumber,
          message: "Valid",
          isValid: true
        });
      } else {
        validationResults.push({
          productNumber,
          message: "Invalid product number",
          isValid: false
        });
      }
    }


    validationMessages = validationResults;
  }
  function formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-IN', options);
  }

  currentDate.setDate(currentDate.getDate() + 7); 

  function findProductBySku(sku) {
      const productNumber = sku.split('-')[0].trim();  
      console.log('Searching for product with SKU:', productNumber);
      return products.find(product => String(product.productNumber).trim() === productNumber);
  }


  function handleProductFilter(sku, index) {
      rows[index].filteredProducts = [];
      searchQuery = sku.trim();

      if (searchQuery === '') {
          rows[index].error = "";
          return;
      }
      const searchQueryNumber = Number(searchQuery);
      const matchedProducts = products.filter(product =>
          product.productNumber.toString().includes(searchQuery)
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
      rows[index].sku = `${product.productNumber} - ${size.size}`;
      rows[index].size = size.size;
      rows[index].filteredProducts = [];
      rows[index].selectedSize = size.size;
      selectedProduct = product;
      rows[index].quantity = 1;
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


  function addToCart(rows, products) {
   
      let validRows = rows.filter(row => row.sku.trim() !== '');
      
      let addCart = validRows.map((row) => {
          let sku = row.sku.trim();
          if (!sku) {
              return null;
          }

          let product = findProductBySku(sku);

          if (product) {
              return {
                  productNumber: product.productNumber,
                  productName: product.productName,
                  priceSize: product.priceSize,
                  quantity: row.quantity > 0 ? row.quantity : 1,
              };
          } else {
              console.log(`No matching product found for SKU: ${sku}`);
              return null;
          }
      }).filter(item => item !== null);

   
      if (addCart.length === 0) {
          //console.log('No valid products to add to the cart.');
          return;
      }


  

      try {
          let currentCart = JSON.parse(localStorage.getItem("cartProducts")) || [];
        //  console.log('Current Cart:', currentCart);

       
          addCart.forEach(newItem => {
              let existingItem = currentCart.find(item => item.productNumber === newItem.productNumber);
              if (existingItem) {
                  existingItem.quantity += newItem.quantity; 
              } else {
                  currentCart.push(newItem); 
              }
          });

          
          localStorage.setItem("cartProducts", JSON.stringify(currentCart));
         // console.log('Updated Cart:', currentCart);


          cartProducts = currentCart;

      } catch (err) {
          console.error("Error saving to localStorage:", err);
      }

     
      showCartMessage = true;
  
      setTimeout(() => {
          showCartMessage = false;
      }, 3000); 
  }

 
  function cartProducts() {
      if (userLoggedIn) {
          cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
      }
  }

  import { onMount } from 'svelte';
  onMount(() => {
      if (userLoggedIn) {
          cartProducts();
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
      let newRows = rows.slice(0, 5).map(row => ({
          quantity: row.quantity,
          error: row.error,
      }));
      rows = [...rows, ...newRows];
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

 
  rows = rowsData.map((line, index) => {
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

  // Increment quantity function
  function increaseQuantity() {
    if (selectedProduct && selectedProduct.quantity < 9999) {
      selectedProduct.quantity += 1;
    }
  }

</script>




<main class="w-full mx-auto py-5 md:flex md:space-x-8 xl:max-w-7xl">
 
  <div class="md:w-full">
      <h1 class="font-bold text-lg md:text-2xl">Quick Order</h1>

   
      {#if !userLoggedIn}
          <div class="flex justify-normal md:justify-end">
              <div class="flex items-center gap-2 w-72 text-xs rounded-md p-3 border border-primary-100 shadow-sm bg-white shadow-primary-100 my-1">
                  <Icon icon="mingcute:warning-line" class="text-primary-500 text-4xl shrink-0" />
                  <a href="/signin">Sign in to import items from your recent orders and quotes.</a>
              </div>
          </div>
      {/if}

   
      <div class="my-4 ml-4">
          <button on:click={() => (toggle = false)} class="px-5 py-2 text-sm font-semibold {toggle ? 'bg-primary-200' : 'bg-white border-b-2 border-primary-500 text-primary-500'}">
              Manual Entry
          </button>
          <button on:click={() => (toggle = true)} class="px-5 py-2 text-sm font-semibold {toggle ? 'bg-white border-b-2 border-primary-500 text-primary-500' : 'bg-primary-200'}">
              Bulk Upload
          </button>
      </div>

   
      {#if toggle}
   <div class="w-full px-5">
          
          
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
                    <p>7987565,1</p>
                    <p>657890,5</p>
                    <p>345678,3</p>
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
          
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  on:drop={handleDrop}
                  on:dragover={(event) => event.preventDefault()} 
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
                <li class={isValid ? "text-green-500" : "text-red-500"}>
                  {productNumber}: {message}
                </li>
              {/each}
            </ul>
          {/if}

       
          <div class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54">
            <!-- Move button to the right -->
            <button 
                on:click={() => addToCart(rows, products)} 
                class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center ml-auto">
                <span>Add to Cart</span>
                <Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
            </button>
        </div>
            
    
       
            
        {#if showCartMessage}
        <div class="text-primary-500 text-center mt-2">Products added to cart!</div>
    {/if}
    </div>
  {:else}
      <div class="space-y-2 px-5 ">
          {#each rows as row, index}
          <div class="flex sm:w-full gap-2 items-center relative ">
          <input
              type="text"
              bind:value={row.sku}
              placeholder="Product SKU"
              on:input={() => handleProductFilter(row.sku, index)}
              class="p-2 border rounded w-full focus:outline-primary-400 "
            />
            {#if searchQuery && row.filteredProducts.length > 0}
            <div class="absolute top-full w-full mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10">
              <button
                class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
                on:click={() => clearSearch(index)}
              >
                <Icon icon="cuida:x-outline" class="w-5 h-5" />
              </button>
      
              {#each row.filteredProducts as result (result.productNumber)}
                <div class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer">
                  <div class="space-y-1 mt-2">
                    {#each result.priceSize as size}
                      <div class="flex items-center gap-2">
                        <input
                          type="radio"
                          id="size-{size.size}"
                          name="size-{result.productNumber}"
                          value={size.size}
                          bind:group={row.selectedSize}
                          checked={row.selectedSize === size.size}
                          on:change={() => selectProduct(result, index, size)}
                        />
                        <label for="size-{size.size}">{result.productNumber} - ({size.size})</label>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
      
      
            
            {#if row.error}
              <div class="text-red-500 text-xs mt-2">
                {row.error}
              </div>
            {/if}
      
         
            <div class="w-full md:w-72 mt-3 md:mt-0 flex items-center gap-2">
              <input
                type="number"
                min="1"
                bind:value={row.quantity}
                class="w-2/3 grow text-center border-1 rounded bg-white font-medium h-10 outline-none py-2"
                on:input={() => row.quantity = Math.max(1, Math.min(9999, row.quantity))}
              />
              <button class="outline-none" on:click={() => incrementQuantity(index)}>
                <Icon icon="ic:round-plus" class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2" />
              </button>
              <button class="outline-none" on:click={() => decrementQuantity(index)}>
                <Icon icon="ic:round-minus" class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2" />
              </button>
            </div>
          </div>
      

       
 
  {#if selectedProduct && selectedProduct.productNumber === row.sku.split('-')[0].trim()}
  <div class="w-full mt-3 flex gap-4 items-center hidden md:flex lg:flex xl:flex">
    <span class="font-semibold">{selectedProduct.productName}</span>
    <span>Size: {selectedProduct.priceSize?.[0]?.size || 'No Size Available'}</span>
    <span>Price: {selectedProduct.priceSize?.[0]?.price}</span>
    <button class="p-2 text-primary-400 rounded" on:click={showDetails}>
      Details
    </button>
    <div
      class="p-2 text-red-500 cursor-pointer hover:text-red-700"
      on:click={() => clearSelectedProduct(index)}
    >
      <Icon icon="mdi:close-circle" class="w-6 h-6" />
    </div>
  </div>
  

  
{/if}
              {/each}
      
      
      
          <div class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54">
              <button on:click={addRows} class="text-primary-500 text-md mt-6"> + Add More</button>
              
              <button 
                  on:click={() => addToCart(rows, products)} 
                  class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center " >
                  <span>Add to Cart</span>
                  <Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
              </button>
          </div>
      
         
          {#if showCartMessage}
              <div class="text-primary-500 text-center mt-2">Products added to cart!</div>
          {/if}
      </div>
      
      
      {/if}
  </div>

  {#if userLoggedIn}
      
      <div class="w-full sm:w-full md:w-1/4 lg:w-1/4 h-1/2 ml-0 sm:ml-0 mt-8 md:mt-24 bg-gray-50 border rounded-lg border-gray-400 p-4 ">

          <h2 class="font-semibold text-xl mb-2">Hello, {email}</h2>
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
                  {#if cartProducts.length > 0}
                      <ul>
                          {#each cartProducts as cart}
                              <li class="text-sm mt-2 text-gray-700">
                                  {cart.productName} ({cart.quantity} items)
                              </li>
                          {/each}
                      </ul>
                  {:else}
                      <p class="text-sm text-gray-500">No saved carts found.</p>
                  {/if}
              {/if}
          </div>
          <div class="mb-2">
             
              <div class="flex items-center space-x-2">
                  <h3 class="font-semibold text-lg">Recent Orders</h3>
                  <button 
                      class="text-primary-500"
                      on:click={() => showRecentOrders = !showRecentOrders}>
                      <Icon 
                          icon={showRecentOrders ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} 
                          class="text-3xl" 
                      />
                  </button>
              </div>
          
             
              {#if showRecentOrders}
                  {#if recentOrders.length > 0}
                      <ul>
                          {#each recentOrders as order}
                              <li class="text-sm text-gray-700">
                                  Order Number: {order.orderNumber} - {order.productName}
                              </li>
                          {/each}
                      </ul>
                  {:else}
                      <p class="text-sm text-gray-500">No results found.</p>
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
     <a href="/lists" class="text-gray-500 " >See Quotes # </a>
  {/if}
          
      </div>
  
  {/if}
  
  
  
  {#if showDetailsModal && selectedProduct}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center !ml-0 z-50">
    <div class="bg-white p-6 rounded-lg w-1/2  relative">
    
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        on:click={hideDetails}
        aria-label="Close"
      >
        <Icon icon="cuida:x-outline" class="w-5 h-5" />
      </button>
    
      <h3 class="text-xl font-semibold">{selectedProduct.productName} - {selectedProduct.productNumber}</h3>
      <p class="mt-2">Enter quantity to check availability and estimated ship date.</p>
        <form method="POST" action="?/quickcheck" 
        use:enhance={() => {
          return async({ result }) => {
          let status='';
                  console.log(result); 
                  status = result.type;
        console.log("success/error type:",status); 
        console.log("success/error message:result.data.message=",result.data.record.message);
        console.log("success/error message:result.data.message=",result.data.record.stock);
        stockStatus = result.data.record.stock;
        stockAvailability = result.data.record.message;
        stockUnAvailability = result.data.record.message1;
        stockType = result.data.record.type;
          }; 
      }}
        >
            <div class="flex items-center gap-2">
              <input type="hidden" name="ProductId" value={selectedProduct.id} />
              <button 
              class="p-2 text-white  rounded"
              on:click={decreaseQuantity}
            >
            <Icon icon="ic:round-minus" class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2" />
            </button>
            
            <input
              type="text"
              name="quantity"
              bind:value={selectedProduct.quantity}
              class="w-20 text-center p-2 border rounded"
              on:input={() => {
                if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
                if (selectedProduct.quantity > 9999) selectedProduct.quantity = 9999;
              }}
            />
            
            <button 
              class="outline-none" 
              on:click={increaseQuantity}
            >
              <Icon icon="ic:round-plus" class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2" />
            </button>
              <button 
                class="mt-3 p-2 text-white bg-primary-500 rounded"
                on:click={() => {
                  checkAvailability(); 
                }}
              >
                Check Availability
              </button>
            </div>
        </form>
      <p class="mt-2">
        Estimated to ship on {estimatedShipDate} for quantity {selectedProduct.quantity} from Bangalore Non-Bonded Warehouse
      </p>

      {#if stockType === 'success'}
      <div class="mt-6 space-y-2 text-sm">
        <div class="flex items-center space-x-2">
          <i class="fa-regular fa-check-circle text-primary-400"></i>
          <p>{stockAvailability}</p>
        </div>
        {#if stockUnAvailability !== ''}
        <div class="flex items-center space-x-2">
          <i class="fa-regular fa-check-circle text-primary-400"></i>
          <p>{stockUnAvailability}</p>
        </div>
        {/if}
      </div>
      
      {:else if stockType === 'error'}
      <div class="mt-6 space-y-2 text-sm">
        <div class="flex items-center space-x-2">
          <i class="fa-regular fa-xmark-circle text-primary-400"></i>
          <p>{stockAvailability}</p>
        </div>
      </div>
      {/if}

    
      <button
        class="mt-3 p-2 text-white bg-primary-500 rounded"
        on:click={() => {
          addToCart(rows, products);  
          showCartMessage = true;     
          hideDetails();              
        }}
      >
        Add to Cart
      </button>
    </div>
  </div>
{/if}

</main>