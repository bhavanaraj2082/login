<script>
  import { onMount } from 'svelte';
    import Icon from "@iconify/svelte";
    import {enhance} from "$app/forms"
    import { authedUser } from '$lib/stores/filter.js';
    import { cartState } from '$lib/stores/cartStores.js';
    import Bulkupload from './Bulkupload.svelte';
    import {toast} from 'svelte-sonner'
    let uploadedRows=[];
    let showSavedCarts=false;
    let email = '';
    let products=[];
    // console.log("**************************");
  //   console.log("i am quick",products.length);
    let selectedProduct = null;
    let stockStatus = '';
    let searchQuery = "";
    let rawFileData = "";
    let toggle=false;
    let showLists=false;
    let showquotes=false;
  
    let showDetailsModal=false;
    let fileError = "";
    let cartNotification = '';
    let notificationTimeout;
    let productNumbers='';
    let inputValue = '';
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
    function checkAvailability() {
      if (!selectedProduct) {
        stockStatus = "No product selected.";
        return;
      }
    
      const productStock = products.find(product => product.productNumber === selectedProduct.productNumber);
    }

    function filterProducts(query) {
  if (!Array.isArray(products)) {
      return []; 
  }
  
  return products.filter(product => 
      product.productNumber && product.productNumber.includes(query)
  );
}
let debounceTimeout;
function handleInput(event, sku, index) {
  const value = event.target.value;
  searchQuery = value;
  if (value.length >= 2) {
    clearTimeout(debounceTimeout);
        if (value.length >= 2) { 
            debounceTimeout = setTimeout(() => {
                document.querySelector("form").requestSubmit();
            }, 1); 
      rows[index].filteredProducts = filterProducts(value);
  } else {
      rows[index].filteredProducts = []; 
  }

}
}
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
    }
    
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    let estimatedShipDate = formatDate(currentDate);
    
    
  
  
  function findProductBySku(sku) {
      const normalizedSku = sku.trim().toLowerCase();
      const lastHyphenIndex = normalizedSku.lastIndexOf('-');
      const productNumber = lastHyphenIndex !== -1 ? normalizedSku.substring(0, lastHyphenIndex).trim() : normalizedSku;
      const size = lastHyphenIndex !== -1 ? normalizedSku.substring(lastHyphenIndex + 1).trim() : '';

  
      let product = products.find(product => 
          String(product.productNumber).trim().toLowerCase() === productNumber
      );
      if (product) {
          const sizePriceInfo = product.pricing?.find(item => item.break.toLowerCase() === size.toLowerCase());
          
          if (!sizePriceInfo) {
              return null; 
          }
          return product;
      } else {
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
  sku: `${product.productNumber} - ${size.break}`,
  size: size.break,
  filteredProducts: [],  
  selectedSize: size.break,
  quantity: rows[index].quantity, 
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
        // console.log(`Processing SKU: ${sku}`);
        const product = findProductBySku(sku);
        // console.log("Found product:", product);
  
        if (product) {
            const selectedSize = row.selectedSize || product.pricing?.[0]?.break; 
            const sizePriceInfo = product.pricing?.find(item => item.break === selectedSize);

            if (!sizePriceInfo) {
                return null;
            }
    
            return {
                description: product.prodDesc,
                id: product.id,
                name: product.productName,
                image: product.image,
                partNumber: product.productNumber,
                priceSize: {
                    price: sizePriceInfo.price,
                    size: selectedSize,
                },
                quantity: row.quantity > 0 ? row.quantity : 1,
                stock: product.stock, 
            };
        } else {
            return null;
        }
    }).filter(item => item !== null); 
  
    if (newCartItems.length === 0) {
        return;
    }
  
    try {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  newCartItems.forEach(newItem => {
            const existingItem = currentCart.find(item =>
                item.partNumber === newItem.partNumber &&
                item.priceSize.break === newItem.priceSize.break
            );
  
            if (existingItem) {
                // console.log(`Updating quantity for: ${newItem.partNumber}`);
                existingItem.quantity += newItem.quantity;
            } else {
                // console.log(`Adding new item to cart: ${newItem.partNumber}`);
                currentCart.push(newItem);
            }
        });
  
        localStorage.setItem('cart', JSON.stringify(currentCart));
        cartState.set(currentCart);
        toast.success(" Items Added to  cart.");
  
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
    
    function addRows() {
  const newRows = Array(3).fill({
      sku: "",
      size: '',
      quantity: 1,
      error: "",
      filteredProducts: [],
      selectedSize: null, 
  });

  rows = [
      ...rows,
      ...newRows.map(row => ({ ...row })), 
  ];
}
    function decreaseQuantity() {
    if (selectedProduct && selectedProduct.quantity > 1) {
        selectedProduct.quantity -= 1;
      }
    }
    
    $: {
  rows.forEach((row, index) => {
      row.filteredProducts = filterProducts(row.sku);
  });
}



function hideDetails() {
      showDetailsModal = false;
  }

  function addToCart(rowsToProcess) {
    const validRows = rowsToProcess.filter(row => row.sku.trim() !== '');
    const newCartItems = validRows.map(row => {
        const sku = row.sku.trim();
        const product = findProductBySku(sku);
  
        if (product) {
            const selectedSize = row.selectedSize || product.pricing?.[0]?.break; 
            const sizePriceInfo = product.pricing?.find(item => item.break === selectedSize);
  
            if (!sizePriceInfo) {
                console.warn(`No size/price info for size: ${selectedSize}. Skipping product.`);
                return null;
            }
  
            return {
                description: product.prodDesc,
                id: product.id,
                name: product.productName,
                image: product.image,
                partNumber: product.productNumber,
                priceSize: {
                    price: sizePriceInfo.price,
                    size: selectedSize,
                },
                quantity: row.quantity > 0 ? row.quantity : 1,
                stock: product.stock,
            };
        } else {
          
            return null;
        }
    }).filter(item => item !== null);
  
    if (newCartItems.length === 0) {
        return;
    }
  
    try {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  
        newCartItems.forEach(newItem => {
            const existingItem = currentCart.find(item =>
                item.partNumber === newItem.partNumber &&
                item.priceSize.break === newItem.priceSize.break
            );
  
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                currentCart.push(newItem);
            }
        });
  
  
        localStorage.setItem('cart', JSON.stringify(currentCart));

        cartState.set(currentCart);
     
        toast.success(" Items Added to  cart.");
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
  function increaseQuantity() {
    if (selectedProduct && selectedProduct.quantity < 9999) {
      selectedProduct.quantity += 1;
    }
   }
    let showCartMessage = false;

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

        <!-- svelte-ignore empty-block -->
        {#if toggle}
        <Bulkupload />


        {:else}
      <div class="mx-auto ">
        {#each rows as row, index}   
        <div class="flex w-full">
          <form class="w-1/2 sm:w-2/3 p-0 sm:p-4"
          
            action="?/quicksearch" 
            method="POST" 
            use:enhance={() => {
              return async ({ result }) => {
                  products = result.data;
                  //console.log("i am manual",products);
        if (result && result.data) {
          productNumbers = result.data.map(record => record.productNumber);
          } else {
            productNumbers = [];
          }
        
                  rows.forEach((row, index) => {
                      row.filteredProducts = filterProducts(row.sku); 
                  });
              };
          }}
          >
            
        <div class="flex sm:w-full items-center relative ">
      <input
            type="text"
            name="quickSearch"
            bind:value={row.sku}
            placeholder="Product SKU"
            on:input={(event) => handleInput(event, row.sku, index)} 
        
            class="w-full hover:border-primary-500 h-10  focus:border-primary-400 focus:outline-none focus:ring-0 rounded px-2 items-center   text-sm border-1 border-gray-200 transition duration-200"
          />
        
          
          
           {#if row.sku.length >= 2 && row.filteredProducts.length > 0}
            <div class="absolute top-full w-full  max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10">
              <button
                class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
                on:click={() => clearSearch(index)}
              >
                <Icon icon="cuida:x-outline" class="w-5 h-5" />
              </button> 
        
        
              
             
              {#each row.filteredProducts as result}
        
                <div class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer">
                  <div class="space-y-1 mt-2">
                    {#if result.pricing?.length > 0}
                      {#each result.pricing as size}
                        <div class="flex items-center gap-2">
                          <input
                            type="radio"
                            class="form-radio rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            id="size-{size.break}"
                            name="size-{result.productNumber}"
                            value={size.break}
                            bind:group={row.selectedSize}
                            checked={row.selectedSize === `${result.productNumber}-${size.break}`}
                            on:change={() => selectProduct(result, index, size)}
                          />
                          <label for="size-{size.break}">{result.productNumber} - {size.break}</label>
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
        </div>
        </form>
          <div class="w-1/2 sm:w-1/3 ml-1 sm:p-4 ">
          <div class="flex">
          <div class="w-1/4">
            <button
            class="outline-none"
            on:click={() => decrementQuantity(index)}
            aria-label="Decrease Quantity"
          >
            <Icon icon="ic:round-minus" class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2" />
          </button>
          </div>
          <div class="w-1/2">
        
                          <input
                  type="text"
                  min="1"
                  bind:value={row.quantity}
                  class="w-3/4 sm:ml-1 ml-3  grow text-center border-1 border-gray-200 rounded bg-white font-medium h-10 outline-none py-2 hover:border-primary-400 focus:border-primary-400 focus:ring-0"
                  on:input={() => row.quantity = Math.max(1, Math.min(9999, row.quantity))}
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
            <Icon icon="ic:round-plus" class="text-lg border-1 rounded bg-white text-primary-500 lg:w-12 w-10 h-10 p-2" />
          </button>
          </div>
          </div>
          
        {#if row.selectedSize === null && row.sku.trim() !== ""}
             
                <span class="text-red-500 font-medium">Cannot be added to the cart</span>
              {:else}

              
              {/if}
            
          </div>
        </div>

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
    <span>Size: {selectedProduct.pricing?.[0]?.break || 'No Size Available'}</span>
    <span>
      {#if selectedProduct.pricing?.[0]?.price}
        ₹{selectedProduct.pricing[0].price} 
      {:else}
        <a href="/quotes" class="text-primary-400 hover:underline">Request a Quote</a>
      {/if}
    </span>
    
 <span>
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
              class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-400 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center " >
              <Icon icon="ic:round-shopping-cart" class="text-2xl" />
              <span>Add to Cart</span>
            
          </button>
      </div>
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
        <div class="bg-white p-6 rounded-lg relative">
          <button
            class="absolute top-2 right-2 text-primary-500 hover:text-primary-700"
            on:click={hideDetails}
            aria-label="Close"
          >
            <Icon icon="cuida:x-outline" class="w-5 h-5" />
          </button>
      
          <h3 class="text-lg font-semibold mb-5 w-80">
            {selectedProduct.productName} - {selectedProduct.productNumber}
          </h3>
          <p class="my-2 mb-4">Enter quantity to check availability and estimated ship date.</p>
      
          <form
            method="POST"
            action="?/quickcheck"
            use:enhance={() => {
              return async ({ result }) => {

                // console.log(result);
                stockStatus=result.data.record.message;
                // console.log(stockStatus);
                
              };
            }}
          >
            <div class="flex items-center mt-2 gap-5">
              <input type="hidden" name="ProductId" value={selectedProduct.productNumber} />    
              <button
                class="flex justify-center items-center w-12 h-9 bg-white text-primary-500 rounded border border-gray-300"
                on:click={decreaseQuantity}
              >
                <Icon icon="ic:round-minus" class="text-lg" />
              </button>
      
              <input
                type="text"
                name="quantity"
                bind:value={selectedProduct.quantity}
                class="w-20 h-9 text-center p-2 border border-gray-300 rounded"
                on:input={() => {
                  if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
                  if (selectedProduct.quantity > 9999) selectedProduct.quantity = 9999;
                }}
              />
      
              <button
                class="flex justify-center items-center w-12 h-9 bg-white text-primary-500 rounded border border-gray-300"
                on:click={increaseQuantity}
              >
                <Icon icon="ic:round-plus" class="text-lg" />
              </button>
      
              <button
                class="flex justify-center text-sm items-center w-32 h-9 text-white bg-primary-400 rounded"
                type="submit"
              >
                Check Availability
              </button>
            </div>
          </form>
      
          <p class="mt-6 flex items-center">
       
            <span class="ml-2 text-sm" >{stockStatus}</span>
          </p>
          
      
          {#if selectedProduct.stockType === 'success'}
          <div class="mt-6 space-y-2 text-sm">
            <div class="flex items-center space-x-2">
           
              <p>{selectedProduct.stockAvailability}</p>
            </div>
          
          </div>
          {:else if selectedProduct.stockType === 'error'}
          <div class="mt-6 space-y-2 text-sm">
            <div class="flex items-center space-x-2">
              <p>{selectedProduct.stockAvailability}</p>
            </div>
          </div>
          {/if}
      
        
          <button
              class=" lg:ml-60 p-2  w-40 h-9 text-white bg-primary-400 rounded flex items-center gap-2"
              on:click={() => {
              addToCart(rows, products);  
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
        

      </div>


