<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import DetailsPopup from './DetailsPopup.svelte';
  import Properties from './Properties.svelte';
  import Imageinfo from './Imageinfo.svelte';
  import Icon from '@iconify/svelte';
  import { viewedCart } from '$lib/stores/alsoViewedProducts_Store.js';
  import {authedUser} from '$lib/stores/mainStores.js';

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
  let cartNotification = '';
  let notificationTimeout;
  let index = 0;
  let isLiked = false;
  let favoriteNotification = '';
  let favoriteStatus = '';
  $: isLoggedIn = !!$authedUser.email;
  let authedEmail= $authedUser.email;
  let email= '';
  let password= '';
  let loginSuccessmsg='';
  let loginSuccesstype='';
  let showLikedPopup = false;
  // console.log("Data Records:", data);

function handleThumbnailClick(selectedIndex) {
    index = selectedIndex;
}

function togglePopup() {
    showPopup = !showPopup;
  }

  function toggleLike() {
    isLiked = !isLiked;
  }


onMount(() => {
    productURL = window.location.href;
  });

  // console.log("Products from load function:", product);

function toggleModal() {
    showModal = !showModal;
  }

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const increaseQuantity = () => {
    quantity++;
  };

  const decreaseQuantity = () => {
    if (quantity > 1) quantity--;
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

  function toggleLikedPopup() {
    showLikedPopup = !showLikedPopup;
  }

  export function addToCart(product, index) {
  const cartProduct = {
    id: product.productId,
    name: product.productName,
    partNumber: product.productNumber,
    description: product.prodDesc,
    image: product.imageSrc,
    stock: product.stockQuantity,
    priceSize: {
      price: product.priceSize[index].price,
      size: product.priceSize[index].size,
    },
    quantity: quantity,
  };
  viewedCart.update((cart) => {
    const exactMatchIndex = cart.findIndex(
      (item) =>
        item.priceSize.size === cartProduct.priceSize.size &&
        item.priceSize.price === cartProduct.priceSize.price
    );
    if (exactMatchIndex !== -1) {
      const existingItem = cart[exactMatchIndex];
      if (existingItem.quantity !== cartProduct.quantity) {
        cart[exactMatchIndex].quantity = cartProduct.quantity;
        cartNotification = `Updated quantity for item  in your cart.`;
      } else {
        cartNotification = `The item is already in your cart with the same quantity.`;
      }
    } else {
      cart.push(cartProduct);
      const totalItems = cart.length; // Get the updated cart length
      cartNotification = `You have ${totalItems} item(s) in your cart.`;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  });
  if (notificationTimeout) clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    cartNotification = "";
  }, 3000);
}
</script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet"/>

{#each data.records as product}
<div class="max-[991px]:block md:flex lg:flex bg-white shadow-sm rounded-lg m-10">
  <div class="bg-white shadow-sm rounded-sm p-3 flex space-x-4 justify-between items-center flex-col lg:flex-row m-3">     
    <div class="flex flex-col space-y-4 lg:w-1/3">
      <div class="mb-3">
              <button on:click={toggleImagePopup}>
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img src="{product.imageSrc}" alt="Product Image" class="rounded-lg w-full lg:max-w-2/3">
              </button>
              {#if showImagePopup}
              <Imageinfo {data} ImageclosePopup={toggleImagePopup}/>
              {/if}
      </div>
      <div class="w-full mb-4">
        <button class="w-full text-left bg-white text-gray-900 font-medium p-2 pl-0">
          Documents 
        </button>
        <div class="w-full rounded-lg space-y-1">
          <!-- {#if showDropdown} -->
          <div
            class="text-primary-400 text-sm text-left cursor-pointer"
          >
            <a href={product.safetyDatasheet} target="_blank">
              <i class="fa-solid fa-download mr-1"></i>SDS </a
            >
          </div>
          <div
            class="text-primary-400 text-sm text-left cursor-pointer"
          >
            <a href="/" target="_blank"><i class="fa-solid fa-sheet-plastic mr-1"></i>Specifications Sheet</a>
          </div>
           <!-- {/if} -->
        </div>
      </div>
    </div>
    
    <!-- Right Column (Product Details) -->
    <div class="flex flex-col space-y-4 w-full lg:w-3/4 max-[991px]:mt-5 max-[991px]:!ml-0">
      <div class="flex items-center justify-between">
        <span class="text-primary-400 font-semibold">{product.productNumber}</span>
        <div class="flex">
          <!-- <button on:click={toggleDetailsPopup} class="text-primary-400 font-semibold cursor-pointer">Details</button> -->
              <button type="submit" class="btn btn-primary" on:click={toggleLikedPopup}>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <i class={`fa-heart ml-10 ${isLiked ? 'fa-solid text-orange-500' : 'fa-regular text-primary-400'} text-end`} on:click={toggleLike}></i>
              </button>
          {#if showDetailsPopup}
          <DetailsPopup {data} closePopup={toggleDetailsPopup} />  
          {/if}
        </div>
      </div>
      <h1 class="text-gray-800 font-semibold text-2xl">{product.productName}</h1>
      {#if product.prodDesc !== ''}
      <p class="text-gray-500 text-sm !mt-0">
        {product.prodDesc}
      </p>
      {/if}
      <div class="flex justify-between !mt-3">
        <p class="text-gray-900 text-sm font-semibold text-start">Synonym(S): <span class="text-gray-500 font-normal">{product.productSynonym}</span></p>
      </div>
      
<div class="p-2"> 
  <h2 class="text-gray-800 font-semibold text-left">SELECT A SIZE</h2>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-gray-700 mt-2 text-left border-b border-gray-300">
    <div class="p-2 ">Pack Size</div>
    <div class="p-2 ">SKU</div>
    <div class="p-2">Availability</div>
    <div class="p-2 ">Price</div>
  </div>
  {#each product.priceSize as priceItem, i}
  <div class="w-full mt-1">
    <button type="button" class={`w-full grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 cursor-pointer transition-transform border border-gray-300  rounded-sm ${index === i ? 'border md:border-l-6 lg:border bg-primary-50' : 'border-none'}`} on:click={() => handleThumbnailClick(i)}>
      <div class="col-span-1 p-2 text-left">{priceItem.size}</div>
      <div class="col-span-1 p-2 text-left">{product.productNumber}-{priceItem.size}</div>
      <div class="col-span-1 p-2 flex items-center justify-center space-x-1 sm:space-x-2">
        <span class="text-left">
          {#if product.stockQuantity > 0} 
          <i class="fa-regular fa-circle-check mr-1 text-primary-400">
          </i> Available 
          {:else} 
          <i class="fa-regular fa-circle-xmark mr-1 text-primary-400">
          </i> Out of stock {/if}</span>
      </div>
      <div class="col-span-1 p-2 text-left">{priceItem.price}</div>
    </button>
  </div>
  {/each}
</div>
</div>
</div>
  
  <div class="bg-white shadow-sm rounded-sm p-3 space-x-4 justify-between items-center flex-col lg:flex-row m-3 lg:w-1/4 md:w-3/6">
    <div class="flex flex-col w-full">
      <div class="text-gray-800">
        <div class="items-center justify-between border-dotted border-b-2 border-gray-300 pb-2">
          <div class="text-lg font-semibold relative">
            {product.productNumber}-{product.priceSize[index].size} <button on:click={toggleModal} class="ml-1 text-primary-400"><i class="fa-solid fa-circle-info"></i></button>
              {#if showModal}
                <div
                  class="absolute bottom-full mb-px left-0 bg-white p-2 rounded-lg shadow-lg w-52 border border-primary-400">
                  <button
                    on:click={toggleModal}
                    class="absolute top-2 right-2 text-gray-500 font-semibold"
                    ><i
                      class="fa-solid fa-xmark text-primary-400 font-semibold"
                    ></i>
                  </button>
                  <h2 class="text-sm font-medium">Product Information</h2>
                  <p class="text-xs text-gray-500 font-normal">
                    Foreign Trade Community Code: {product.productNumber}
                  </p>
                </div>
              {/if}
          </div>
          <span class="text-lg font-semibold">{product.priceSize[index].price}</span>
        </div>
      </div>
  
      <div class="border-dotted border-b-2 border-gray-300 pb-2 mb-2">
        <p class="text-gray-800 font-semibold text-sm mt-4">Availability</p>
        <p class="text-sm">
          {#if product.stockQuantity > 0} 
          <i class="fa-regular fa-circle-check mr-1 text-primary-400">
          </i> Available 
          {:else} 
          <i class="fa-regular fa-circle-xmark mr-1 text-primary-400">
          </i> Out of stock {/if}
        </p>
        <div class="flex space-x-2 items-center mt-2">
          <button on:click={togglePopup} class="w-full text-sm font-semibold text-left text-primary-400">More Info</button>
          {#if showPopup}
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !ml-0">
            <div class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg">
              <button
                on:click={togglePopup}
                class="absolute top-4 right-4 text-primary-400 text-xl font-bold"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>

              <h2 class="text-xl font-bold text-left">Availability for {product.productNumber}-{product.priceSize[index].size}</h2>
              <p class="text-gray-500 text-left mt-2">
                Enter quantity to check availability and estimated ship date. 
              </p>

              <form method="POST" action="?/checkavailabilityproduct" 
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
          <div class="flex justify-between items-center mt-6">
          <div class="flex items-center space-x-4">
            <button
              on:click={decreaseQuantity}
              class="w-8 h-8 text-primary-400 flex items-center justify-center"
            >
              <i class="fa-solid fa-minus"></i>
            </button>
            <input
              type="text"
              name="quantity"
              bind:value={quantity}
              readonly
              class="w-16 h-8 text-center border border-gray-300 rounded-md"
            />
          <input type="hidden" name="ProductId" value={product.productId} />
            <button
              on:click={increaseQuantity}
              class="w-8 h-8  text-primary-400  flex items-center justify-center"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <button type="submit" class="bg-primary-400 text-white p-2 rounded-lg flex items-center space-x-1">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Check Availability</span>
          </button>
          </div>


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
          </form>
          <div class="mt-6 flex justify-end">
            <button on:click={() => addToCart(product, index)}  class="bg-primary-400 text-white py-2 px-4 rounded-lg flex items-center space-x-1">
              <i class="fa-solid fa-cart-shopping mr-1"></i>Add To Cart
            </button>
            </div>
            </div>
          </div>
          {/if}
          <button on:click={toggleSharePopup} class="w-full text-sm font-semibold text-right text-primary-400">Share<i class="fa-regular fa-share-from-square ml-1"></i></button>
            {#if showSharePopup}
            <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4">
                <button on:click={toggleSharePopup} class="absolute top-3 right-3 text-primary-400">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>

                <h2 class="text-base font-semibold text-primary-400 mb-3">
                  Share Product
                </h2>

                <div class="flex items-start space-x-4">
                  <div class="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center">
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img src={product.imageSrc}  alt="Product Image" class="w-full h-full object-cover"/>
                  </div>

                <div>
                <p class="text-lg font-semibold text-primary-400">{product.productNumber}</p>
                <p class="text-sm text-gray-600">{product.productName}</p>
              </div>
            </div>

            <div class="mt-4">
              <p
                class="text-sm md:text-base font-semibold text-gray-800 mb-1"
              >
                Direct Link
              </p>
              <div class="relative flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center">
                {#if showToast}
                  <div class="absolute -top-8 transform -translate-x-1/2 left-1/2 bg-gray-800 text-white py-1 px-3 rounded text-xs sm:text-sm">
                    Copied!
                  </div>
                {/if}
              
                <input
                  type="text"
                  readonly
                  bind:value={productURL}
                  class="text-xs sm:text-sm md:text-sm border border-primary-400 p-2 rounded-lg text-gray-600 outline-none flex-grow w-full"
                />
              
                <button
                  on:click={copyToClipboard}
                  class="text-primary-400 text-xs sm:text-sm md:text-sm font-semibold border p-2 border-primary-400 rounded-lg flex items-center justify-center space-x-1 w-full sm:w-auto"
                >
                  <i class="fa-regular fa-copy"></i>
                  <span>Copy</span>
                </button>
              </div>
            </div>
    </div>
            </div>
            {/if}
        </div>
      </div>
    </div>
  
    <div class="w-full !ml-0">
      <div class="flex items-center border border-gray-300 rounded-sm justify-between w-full space-x-4 mt-10">
        <button
          on:click={decreaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><i class="fa-solid fa-minus"></i></button
        >
        <span
          class="w-full text-center text-gray-800 rounded-sm p-1"
          >{quantity}</span
        >
        <button
          on:click={increaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><i class="fa-solid fa-plus"></i></button
        >
      </div>
      <div class="w-full mt-3">
        <button 
        on:click={() => addToCart(product, index)} 
        class="w-full text-white border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 bg-primary-400 hover:text-white"><i class="fa-solid fa-cart-shopping mr-1"></i>Add To Cart</button>
        <button class="mt-4 w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 hover:text-white">
          <i class="fa-solid fa-code-pull-request mr-1"></i>Request For Bulk
            Order
        </button>
      </div>
    </div>
  </div>
</div>
{#if cartNotification}
<div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
    {cartNotification}
</div>
{/if}

{#if loginSuccesstype!=='success'}
{#if showLikedPopup}
<div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80 z-50">
  <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
      <button on:click={toggleLikedPopup} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
          <Icon icon="mdi:close" class="text-xl hover:text-primary-400" />
      </button>
      <form method="POST" action="?/favorite" 
      use:enhance={() => {
        return async({ result }) => {
        let status='';
                console.log(result); 
                status = result.type;
      console.log("success/error type:",status); 
      console.log("success/error message:result.data.message=",result.data.message);
      loginSuccessmsg=result.data.message;
      loginSuccesstype=result.data.type;
      if (loginSuccesstype === 'success') {
              showLikedPopup = false;
              email='';password='';
            }
        }; 
    }}
      >
      <h2 class="text-xl  text-center font-bold mb-1">Please Login or Register to continue</h2>
      {#if loginSuccesstype==='success'}
      <p class="text-green-400 text-sm text-center">{loginSuccessmsg}</p>
      {:else}
      <p class="text-red-400 text-sm text-center">{loginSuccessmsg}</p>
      {/if}
      <input type="hidden" name="id" value={product.productId} />
      <input type="hidden" name="imgUrl" value={product.imageSrc} />
      <input type="hidden" name="priceSize"/>
      <input type="hidden" name="authedEmail" value={authedEmail} />
      <input type="hidden" name="price" value={product.priceSize[index].price} />
      <input type="hidden" name="size" value={product.priceSize[index].size} />
      <input type="hidden" name="productDesc" value={product.prodDesc} />
      <input type="hidden" name="productName" value={product.productName} />
      <input type="hidden" name="productNumber" value={product.productNumber} />
      <input type="hidden" name="quantity" value={product.quantity || 1} />
      <input type="hidden" name="stock" value={product.stockQuantity} />
      <label for="email" class="block font-bold text-gray-600 mb-2">Email</label>
      <input
          name="email"
          type="email"
          placeholder="Enter your email"
          class="border border-gray-300 p-2 rounded w-full"
          bind:value={email}
      />
      <label for="password" class="block font-bold text-gray-600 mb-2 mt-1">Password</label>
      <input
          name="password"
          type="password"
          placeholder="Enter your password"
          class="border border-gray-300 p-2 rounded w-full"
          bind:value={password}
      />
      <button class="bg-primary-400 text-white p-2 rounded w-full mt-4 mb-4">Login</button>
    </form>
      <div class="flex justify-between">
          <a href="/" class="text-primary-400" on:click|preventDefault={toggleLikedPopup}>Continue browsing</a>
          <a href="/signup" class="text-primary-400">Register</a>
      </div>
  </div>
</div>
{/if}
{:else}
{#if showLikedPopup}
<div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80 z-50">
  <div class="bg-white rounded-lg p-6 relative">
      <button on:click={toggleLikedPopup} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
          <Icon icon="mdi:close" class="text-xl text-primary-400" />
      </button>
      <h1 class="text-primary-400 font-semibold text-center p-5">Added to favorites!</h1>
  </div>
</div>
{/if}
{/if}
{/each}

<Properties {data}/>