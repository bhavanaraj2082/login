<script>
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  // import { cartState } from '$lib/stores/cart.js';
  import {toast } from 'svelte-sonner'

  let validationMessages = [];
  let rawFileData = "";
  let fileError = "";

  let cartNotification='';

  let finalproducts="";

  function handleTextChange(event) {
    rawFileData = event.target.value;
  }

  // function handleFileInputChange(event) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       rawFileData = e.target.result;  
  //     };

  //     reader.onerror = function () {
  //       fileError = 'Error reading the file. Please try again.';
  //     };

  //     reader.readAsText(file); 
  //   } else {
  //     fileError = 'No file selected.';
  //   }
  // }


  function handleFileInputChange(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      rawFileData = e.target.result; // Store the file data
      fileError = ""; // Clear any previous error

      // Automatically submit the form after file is processed
      const form = event.target.closest("form");
      if (form) {
        form.requestSubmit();
      }
    };

    reader.onerror = function () {
      fileError = "Error reading the file. Please try again.";
    };

    reader.readAsText(file); // Read the file content
  } else {
    fileError = "No file selected.";
  }
}


// function addToCart(product) {
//     try {
//         let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
//         if (product.stockMessage === "Stock is sufficient for all uploaded quantities") {
//         } else {
          
//             const isValidProduct = product &&
//                 product.productNumber && 
//                 product.productName && 
//                 product.pricing && product.pricing[0] && 
//                 product.pricing[0].break && 
//                 product.stock > 0; 
//             if (!isValidProduct) {
//                 return; 
//             }
//         }
//         const existingProductIndex = currentCart.findIndex(item => item.productNumber === product.productNumber);
        
//         if (existingProductIndex >= 0) {
//             currentCart[existingProductIndex].quantity += 1; 
//         } else {
//             const newProduct = { ...product, quantity: 1 }; 
//             currentCart.push(newProduct);
//         }
//         localStorage.setItem('cart', JSON.stringify(currentCart));
//         cartState.set(currentCart);
//         toast.success("Items added to cart.");

//     } catch (err) {
        
//         console.error('Error saving to localStorage:', err);
//     }
// }


function addToCart(product) {
    try {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (product.stockMessage === "Stock is sufficient for all uploaded quantities") {
            // No action needed, proceed to adding item to cart
        } else {
            const isValidProduct = product &&
                product.productNumber && 
                product.productName && 
                product.pricing && product.pricing[0] && 
                product.pricing[0].break && 
                product.stock > 0; 
                
            if (!isValidProduct) {
                return; 
            }
        }

        const existingProductIndex = currentCart.findIndex(item => item.productNumber === product.productNumber);
        
        if (existingProductIndex >= 0) {
            currentCart[existingProductIndex].quantity += 1; 
        } else {
            const newProduct = { ...product, quantity: 1 }; 
            currentCart.push(newProduct);
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        cartState.set(currentCart);
        

        setTimeout(() => {
            toast.success("Items added to cart.");
        }, 2000); 

    } catch (err) {
        console.error('Error saving to localStorage:', err);
    }
}





function processProduct(product) {
  const { id, image, productName, productNumber, description, pricing, stock } = product;
if (Array.isArray(pricing) && pricing.length > 0) {
    pricing.forEach(priceInfo => {
      
      const { break: size,price } = priceInfo;
    });
  } 
}
</script>
<form
  method="POST"
  action="?/uploadFile"
  enctype="multipart/form-data"
  use:enhance={() => {
    return async ({ result }) => {
      // console.log("Form submission result:", result.data);
      let products = result.data;
      products.forEach(product => {
      processProduct(product);
      addToCart(product);
      finalproducts=products
    });  
  


    
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
<section class="w-full mx-auto md:flex items-center gap-5">

    <div class="md:w-3/5 h-72 border bg-white rounded overflow-hidden overflow-y-scroll p-5">
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
      <div class="flex justify-center bg-white items-center h-12 border rounded">
        <a
          class="flex items-center gap-2 text-sm font-medium text-primary-500"
          href="/quick_order_template.csv"
          download
        >
          <Icon icon="pajamas:download" class="text-lg" /> Download Template
        </a>
      </div>
<div class="w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border border-dashed">
        <Icon icon="uil:upload" class="text-7xl text-primary-500 -ml-4" />
        <p class="text-sm">Drag and Drop your CSV or XLS file to upload or</p>
      
        <!-- This label will trigger the file input when the user clicks anywhere on the div -->
        <label for="bulkupload" class="w-full h-full cursor-pointer flex flex-col justify-center items-center">
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
      
   
   
    </section>
  </section>

  {#if validationMessages.length > 0}
  <ul class="mt-3">
    {#each validationMessages as message}
      <li>
        <p class={message.isValid ? "text-green-500" : "text-red-500"}>
          Product: {message.productNumber} - {message.isValid ? "Valid" : "Invalid"} - {message.message}
        </p>
      </li>
    {/each}
  </ul>
  {/if}
</form>
<div class="flex justify-end">
  <button
    class="lg:ml-60 p-2 w-40 mt-4 h-9 text-white bg-primary-400 hover:bg-primary-600 rounded flex items-center gap-2"
    on:click={addToCart}
  >
  <Icon icon="ic:round-shopping-cart" class="text-2xl" />
    <span>Add to Cart</span>

  </button>
</div>
{#if cartNotification}
<div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
    {cartNotification}
</div>
{/if}
