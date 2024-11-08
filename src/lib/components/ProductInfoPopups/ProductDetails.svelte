<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
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

function handleThumbnailClick(selectedIndex) {
    index = selectedIndex;
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

    const firstPriceSize = prod.priceSize[0];
    console.log(
      `Product ${index + 1} - Size: ${firstPriceSize.size}, Price: ${firstPriceSize.price}`
    );
    console.log(firstPriceSize.price);
  });

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
</script>

<link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
  rel="stylesheet"
/>

{#each data.records as product}
  <div class="flex justify-center">
    <div
      class="bg-white shadow-lg rounded-lg w-full h-full max-w-4xl p-8 flex space-x-4 justify-between items-center flex-col lg:flex-row"
    >
      <div class="flex flex-col space-y-4 w-1/4">
        <div class="relative mb-3">
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <button on:click={toggleImagePopup}
            ><img
              src={product.imageSrc}
              alt="Product Image"
              class="rounded-lg"
            /></button
          >
          {#if showImagePopup}
            <div
              class="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 lg:p-8 overflow-y-auto bg-neutral-500 bg-opacity-30"
            >
              <div
                class="max-w-full md:max-w-2xl lg:max-w-4xl w-full bg-white rounded-md shadow-md p-4 md:p-6 lg:p-8"
              >
                <div class="flex justify-between items-center mb-4">
                  <h2
                    class="text-sm md:text-base lg:text-xl font-semibold text-primary-400 uppercase"
                  >
                    Product Image
                  </h2>
                  <button
                    on:click={toggleImagePopup}
                    class="text-primary-400 p-2 rounded-md"
                  >
                    <i class="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>

                <div
                  class="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start"
                >
                  <div class="w-full md:w-3/4 lg:w-1/3 h-auto">
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img
                      src={product.imageSrc}
                      alt="Product Image"
                      class="w-full h-auto object-cover rounded-md"
                    />
                  </div>

                  <div
                    class="space-y-2 md:space-y-3 lg:space-y-4 w-full lg:w-2/3"
                  >
                    <h2
                      class="text-sm md:text-base lg:text-xl font-semibold text-gray-800"
                    >
                      {product.productName}
                    </h2>
                    <p class="text-xs md:text-sm lg:text-base text-gray-600">
                      {product.prodDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
        <h1 class="text-center text-primary-400 font-semibold !mt-0">All(1)</h1>
        <div class="relative w-full mb-4">
          <button
            on:click={toggleDropdown}
            class="w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-4 hover:bg-primary-400 hover:text-white"
          >
            Documents <i class="fa-solid fa-angle-down"></i>
          </button>

          
            <div class="absolute w-full mt-2 rounded-lg p-2 space-y-1">
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

      <div class=" flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-primary-400 font-semibold"
            >{product.productNumber}</span
          >
          <div>
            <button
              on:click={toggleDetailsPopup}
              class="text-primary-400 font-semibold cursor-pointer"
              >Details</button
            >

            {#if showDetailsPopup}
              <div class="fixed inset-0 flex items-center justify-center z-50">
                <div
                  class="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-white rounded-md shadow-md max-h-[90vh] overflow-y-auto"
                >
                  <div class="">
                    <div class="mt-4 flex justify-between items-center">
                      <h2
                        class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold uppercase"
                      >
                        Complete Details
                      </h2>
                      <button
                        on:click={toggleDetailsPopup}
                        class="text-primary-400 py-2 px-4 rounded-md"
                      >
                        <i class="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>

                    <div
                      class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start"
                    >
                      <div class="flex-shrink-0">
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img
                          src={product.imageSrc}
                          alt="Product Image"
                          class="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
                        />
                      </div>

                      <div class="space-y-2 md:space-y-3 lg:space-y-4">
                        <h1
                          class="lg:text-xl sm:text-xs font-bold text-primary-400 !mt-0"
                        >
                          {product.productNumber}
                        </h1>
                        <h2
                          class="lg:text-xl sm:text-xs font-semibold text-gray-800 !mt-0"
                        >
                          {product.productName}
                        </h2>
                        <p class="lg:text-base sm:text-xs text-gray-600 !mt-0">
                          {product.prodDesc}
                        </p>
                      </div>
                    </div>

                    <div
                      class="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    >
                      {#each data.records as product}
                        <div class="border border-gray-200 p-4 rounded-lg">
                          <h3
                            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
                          >
                            Properties
                          </h3>
                          {#each Object.entries(product.properties) as [key, value]}
                            <p
                              class="text-xs md:text-sm lg:text-sm text-gray-600"
                            >
                              <strong>{key}:</strong>
                              {value}
                            </p>
                          {/each}
                        </div>
                      {/each}

                      {#each data.records as product}
                        <div class="border border-gray-200 p-4 rounded-lg">
                          <h3
                            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
                          >
                            Description
                          </h3>
                          {#each Object.entries(product.description) as [key, value]}
                            <p
                              class="text-xs md:text-sm lg:text-sm text-gray-600"
                            >
                              <strong>{key}:</strong>
                              {value}
                            </p>
                          {/each}
                        </div>
                      {/each}

                      {#each data.records as product}
                        <div class="border border-gray-200 p-4 rounded-lg">
                          <h3
                            class="text-xs md:text-sm lg:text-base text-primary-400 font-semibold mb-2"
                          >
                            Usage and Safety
                          </h3>
                          {#each Object.entries(product.safetyInfo) as [key, value]}
                            <p
                              class="text-xs md:text-sm lg:text-sm text-gray-600"
                            >
                              <strong>{key}:</strong>
                              {value}
                            </p>
                          {/each}
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>

              <div class="fixed inset-0 bg-black opacity-50 z-40"></div>
            {/if}
          </div>
        </div>
        <h1 class="text-gray-800 font-semibold text-2xl">
          {product.productName}
        </h1>
        <p class="text-gray-500 text-sm">
          {product.prodDesc}
        </p>
        <div class="flex justify-between">
          <p class="text-gray-900 text-sm font-semibold text-start">
            Synonym(S): <span class="text-gray-500 font-normal">{product.productSynonym}</span>
          </p>
          <p><i class="fa-regular fa-heart text-primary-400 text-end"></i></p>
        </div>

        <div>
          <h2 class="text-gray-800 font-semibold">SELECT A SIZE</h2>
          <div class="grid grid-cols-4 gap-4 text-sm text-gray-500 mt-2">
            <div>Pack Size</div>
            <div>SKU</div>
            <div>Availability</div>
            <div>Price</div>
          </div>

          <!-- {#each product.priceSize as priceItem, i}
            <div
              class="grid grid-cols-4 gap-4 text-sm text-gray-800 font-semibold mt-1"
            >
              <div>{priceItem.size}</div>
              <div>{product.productNumber}-{priceItem.size}</div>
              <div class="flex items-center space-x-2">
                <span
                  ><i class="fa-regular fa-circle-check mr-1 text-primary-400"
                  ></i>Available</span
                >
              </div>
              <div>{priceItem.price}</div>
            </div>
          {/each} -->
        
          {#each product.priceSize as priceItem, i}
          <div class="w-full">
            <button
              type="button"
              class={`w-full py-1 grid grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-sm text-gray-800 font-semibold  cursor-pointer transition-transform 
                ${index === i ? 'border md:border-l-6 lg:border bg-primary-50' : 'border-none'}`}
              on:click={() => handleThumbnailClick(i)}
            >
              <div class="col-span-1 text-left">{priceItem.size}</div>
              <div class="col-span-1 text-left">
                {product.productNumber}-{priceItem.size}
              </div>
              <div class="col-span-1 flex items-center justify-center space-x-2">
                <i class="fa-regular fa-circle-check text-primary-400"></i>
                <span>Available</span>
              </div>
              <div class="col-span-1 text-left">{priceItem.price}</div>
            </button>
          </div>
        {/each}
        
        </div>
      </div>
    </div>
    <div class="relative w-full lg:flex-1 ml-4">
      <div class="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-4 md:p-6 shadow-md max-w-lg z-10">
        <div class="flex flex-col ">
          <div class="">
            <div class="text-gray-800">
              <div
                class=" items-center justify-between border-dotted border-b-2 border-gray-300 pb-2"
              >
                <div class="relative text-lg font-semibold">
                  {product.productNumber}-{product.priceSize[index].size}
                  <button on:click={toggleModal} class="ml-1 text-primary-400">
                    <i class="fa-solid fa-circle-info"></i>
                  </button>
                    <!-- product info popup -->
                    {#if showModal}
                    <div
                      class="absolute bottom-full mb-px left-0 bg-white p-2 rounded-lg shadow-lg w-72 border border-primary-400"
                    >
                      <button
                        on:click={toggleModal}
                        class="absolute top-2 right-2 text-gray-500 font-semibold"
                        ><i
                          class="fa-solid fa-xmark text-primary-400 font-semibold"
                        ></i></button
                      >
                      <h2 class="text-sm">Product Information</h2>
                      <p class="text-xs text-gray-500">
                        Foreign Trade Community Code: {product.productNumber}
                      </p>
                    </div>
                  {/if}
                </div>
                <span class="text-lg font-semibold">{product.priceSize[index].price}</span>
              </div>
            </div>

            <div class="border-dotted border-b-2 border-gray-300 pb-2 mb-2">
              <p class="text-gray-500 text-sm mt-1">Availability</p>
              <p class="text-sm w-72">
                <i class="fa-regular fa-circle-check mr-1 text-primary-400"
                ></i>{#if stockAvailability !== ''} {stockAvailability} {:else} Available {/if}
              </p>
              <div class="flex space-x-2 items-center mt-2">
              <button class="w-full text-sm font-semibold text-left text-primary-400" on:click={togglePopup}>More Info</button>
                <!-- more info popup -->
                {#if showPopup}
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              
                <button type="submit" class="bg-primary-400 text-white p-2 text-sm rounded-lg flex items-center space-x-1">
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
              
              <div class="mt-6 flex justify-end">
                <button class="bg-primary-400 text-white py-2 px-4 rounded-lg flex items-center space-x-1">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span>Add To Cart</span>
                </button>
              </div>
              </form>
                  </div>
                </div>
              {/if}
                <button
                  on:click={toggleSharePopup}
                  class="w-full text-sm font-semibold text-right text-primary-400"
                  >Share<i class="fa-regular fa-share-from-square ml-1"
                  ></i></button
                >
              </div>
            </div>

<!-- share popup -->
{#if showSharePopup}
<div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
  <div class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4">
    <button
      on:click={toggleSharePopup}
      class="absolute top-3 right-3 text-primary-400"
    >
      <i class="fa-solid fa-xmark text-lg"></i>
    </button>

    <h2 class="text-sm font-semibold text-gray-600 mb-3">
      Share Product
    </h2>

    <div class="flex items-start space-x-4">
      <div class="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={product.imageSrc}
          alt="Product Image"
          class="w-full h-full object-cover"
        />
      </div>

      <div>
        <p class="text-lg font-semibold text-gray-800">
          {product.productNumber}
        </p>
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
          class="text-xs sm:text-sm md:text-base border border-primary-400 p-2 rounded-lg text-gray-600 outline-none flex-grow w-full"
        />
      
        <button
          on:click={copyToClipboard}
          class="text-primary-400 text-xs sm:text-sm md:text-base font-semibold border p-2 border-primary-400 rounded-lg flex items-center justify-center space-x-1 w-full sm:w-auto"
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

          <div class=" w-full  mt-4 space-y-4">
            <div class="flex items-center w-full justify-between mt-2">
              <button class="w-full text-left text-sm text-gray-600"
                >Total</button
              >
              <button class="w-full text-right text-sm text-gray-600"
                >{product.priceSize[index].price}</button
              >
            </div>

            <div class="flex items-center justify-between w-full space-x-4">
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

            <button
              class="bg-primary-400 text-white w-full mt-4 rounded-lg py-2 px-6 text-base hover:bg-primary-500"
              ><i class="fa-solid fa-cart-shopping mr-1"></i>Add To Cart</button
            >
          </div>

          <button
            class="mt-4 w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-4 hover:bg-primary-400 hover:text-white"
            ><i class="fa-solid fa-code-pull-request mr-1"></i>Request For Bulk
            Order
          </button>
        </div>
      </div>
  </div>
  </div>
{/each}