<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import DetailsPopup from './DetailsPopup.svelte';
  
    let quantity = 1;
    let showDropdown = false;
    let showSharePopup = false;
    let showModal = false;
    let showDetailsPopup = false;
    let showImagePopup = false;
    export let data;
    let product = data.records;
    let showToast = false;
    let productURL = '';
    let showPopup = false;
    let stockStatus = '';
    let stockAvailability = '';
    let stockType = '';
    let stockUnAvailability = '';
    let index = 0;
    let totalPrice = 0;
    let isLiked = false;
  
  function toggleLike() {
    isLiked = !isLiked;
  }
  
    function parsePrice(priceString) {
      return parseFloat(priceString.replace(/[₹,]/g, ""));
    }
  
    function calculateTotalPrice(selectedIndex) {
      const prod = product[selectedIndex]; 
      if (prod.priceSize && prod.priceSize[selectedIndex] && prod.priceSize[selectedIndex].price) {
        const unitPrice = parsePrice(prod.priceSize[selectedIndex].price);
        totalPrice = quantity * unitPrice;
      } else {
        console.error("Price data is unavailable or incorrect at the specified index.");
        totalPrice = 0; 
      }
    }
  
    function handleThumbnailClick(selectedIndex) {
      index = selectedIndex;
      calculateTotalPrice(selectedIndex); 
    }
  
    function togglePopup() {
      showPopup = !showPopup;
    }
  
    onMount(() => {
      productURL = window.location.href;
    });
  
    console.log("Products from load function:", product);
  
    product.forEach((prod, index) => {
      console.log(`Product ${index + 1} priceSize:`, prod.priceSize);
    });
  
    function toggleModal() {
      showModal = !showModal;
    }
  
    const toggleDropdown = () => {
      showDropdown = !showDropdown;
    };
  
    const increaseQuantity = () => {
      quantity++;
      calculateTotalPrice(index);
    };
  
    const decreaseQuantity = () => {
      if (quantity > 1) quantity--;
      calculateTotalPrice(index); 
    };
  
    function toggleSharePopup() {
      showSharePopup = !showSharePopup;
    }
  
    function toggleDetailsPopup() {
      showDetailsPopup = !showDetailsPopup;
    }
  
    function toggleImagePopup() {
      showImagePopup = !showImagePopup;
    }
  
    function copyToClipboard() {
      navigator.clipboard
        .writeText(productURL)
        .then(() => {
          showToast = true;
          setTimeout(() => {
            showToast = false;
          }, 2000); 
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
</script>

{#each data.records as product}
<div class="max-[991px]:block md:flex lg:flex bg-white shadow-lg rounded-lg m-14">
  <div class="bg-white shadow-sm rounded-sm p-3 flex space-x-4 justify-between items-center flex-col lg:flex-row m-3">
    <!-- Left Column (Image and Dropdown) -->
    <div class="flex flex-col space-y-4 lg:w-1/3">
      <div class="relative mb-3">
        <button>
          <img src="{product.imageSrc}" alt="Product Image" class="rounded-lg w-full lg:max-w-2/3">
        </button>
      </div>
      <h1 class="text-center text-primary-400 font-semibold !mt-0">All(1)</h1>
      <div class="relative w-full mb-4">
        <button on:click={toggleDropdown} class="w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-4 hover:bg-primary-400 hover:text-white">
          Documents <i class="fa-solid fa-angle-down"></i>
        </button>
        <div class="w-full mt-2 rounded-lg p-2 space-y-1">
          {#if showDropdown}
          <div
            class="text-primary-400 border border-primary-400 rounded-lg py-2 px-4 text-center hover:bg-primary-400 hover:text-white cursor-pointer"
          >
            <a href={product.safetyDatasheet} target="_blank">
              SDS <i class="fa-solid fa-download"></i></a
            >
          </div>
          <div
            class="text-primary-400 border border-primary-400 rounded-lg py-2 px-4 text-center hover:bg-primary-400 hover:text-white cursor-pointer"
          >
            <a href="/" target="_blank">Specifications Sheet</a><i
              class="fa-solid fa-sheet-plastic ml-1"
            ></i>
          </div>
           {/if}
        </div>
      </div>
    </div>
    
  
    <!-- Right Column (Product Details) -->
    <div class="flex flex-col space-y-4 w-full lg:w-3/4 max-[991px]:mt-5 max-[991px]:!ml-0">
      <div class="flex items-center justify-between">
        <span class="text-primary-400 font-semibold">{product.productNumber}</span>
        <div>
          <button on:click={toggleDetailsPopup} class="text-primary-400 font-semibold cursor-pointer">Details</button>
          {#if showDetailsPopup}
          <DetailsPopup {data} closePopup={toggleDetailsPopup} />  
          {/if}
        </div>
      </div>
      <h1 class="text-gray-800 font-semibold text-2xl">{product.productName}</h1>
      <div class="flex justify-between !mt-3">
        <p class="text-gray-900 text-sm font-semibold text-start">Synonym(S): <span class="text-gray-500 font-normal">{product.productSynonym}</span></p>
        <p><i class="fa-heart fa-regular text-primary-400 text-end"></i></p>
      </div>
      
<!-- Product Size and Price Table -->
<div class="p-2"> <!-- Outer padding around the box -->
  <h2 class="text-gray-800 font-semibold text-left">SELECT A SIZE</h2>

  <!-- Header Row -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-gray-700 mt-2 text-left border-b border-gray-300">
    <div class="p-2 ">Pack Size</div>
    <div class="p-2 ">SKU</div>
    <div class="p-2">Availability</div>
    <div class="p-2 ">Price</div>
  </div>

  <!-- Size Options (Buttons) -->
  {#each product.priceSize as priceItem, i}
  <div class="w-full mt-1">
    <!-- class={`w-full py-1 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 cursor-pointer transition-transform
        ${index === i ? 'border md:border-l-6 lg:border bg-primary-50' : 'border-none'}`} -->
    <button type="button" class={`w-full py-1 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 cursor-pointer transition-transform border border-gray-300  rounded-sm ${index === i ? 'border md:border-l-6 lg:border bg-primary-50' : 'border-none'}`} on:click={() => handleThumbnailClick(i)}>
      <div class="col-span-1 p-2 text-left">{priceItem.size}</div>
      <div class="col-span-1 p-2 text-left">{product.productNumber}-{priceItem.size}</div>
      <div class="col-span-1 p-2 flex items-center justify-center space-x-1 sm:space-x-2">
        <i class="fa-regular fa-circle-check text-primary-400"></i>
        <span class="text-left">Available</span>
      </div>
      <div class="col-span-1 p-2 text-left">{priceItem.price}</div>
    </button>
  </div>
  {/each}
</div>

    </div>
  </div>
  
  <!-- Cart Summary Section -->
  <div class="bg-white shadow-sm rounded-sm p-3 space-x-4 justify-between items-center flex-col lg:flex-row m-3 lg:w-1/3 md:w-3/6">
    <div class="flex flex-col w-full">
      <div class="text-gray-800">
        <div class="items-center justify-between border-dotted border-b-2 border-gray-300 pb-2">
          <div class="relative text-lg font-semibold">
            {product.productNumber}-{product.priceSize[index].size} <button class="ml-1 text-primary-400"><i class="fa-solid fa-circle-info"></i></button>
          </div>
          <span class="text-lg font-semibold">{product.priceSize[index].price}</span>
        </div>
      </div>
  
      <div class="border-dotted border-b-2 border-gray-300 pb-2 mb-2">
        <p class="text-gray-500 text-sm mt-1">Availability</p>
        <p class="text-sm"><i class="fa-regular fa-circle-check mr-1 text-primary-400"></i>Available</p>
        <div class="flex space-x-2 items-center mt-2">
          <button class="w-full text-sm font-semibold text-left text-primary-400">More Info</button>
          <button class="w-full text-sm font-semibold text-right text-primary-400">Share<i class="fa-regular fa-share-from-square ml-1"></i></button>
        </div>
      </div>
    </div>
  
    <div class="w-full !ml-0">
      <div class="flex items-center justify-between w-full space-x-4 mt-10">
        <button
          on:click={decreaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><i class="fa-solid fa-minus"></i></button
        >
        <span
          class="w-full text-center text-gray-800 border border-gray-300 rounded-sm p-1"
          >{quantity}</span
        >
        <button
          on:click={increaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><i class="fa-solid fa-plus"></i></button
        >
      </div>
      <div class="w-full mt-3">
        <button class="w-full border-2 border-primary-400 text-primary-400 py-3 rounded-md">
          Add to Cart
        </button>
        <button class="w-full text-white bg-primary-400 py-3 rounded-md mt-2">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</div>
{/each}