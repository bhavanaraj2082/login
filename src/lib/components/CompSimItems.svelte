<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import Icon from "@iconify/svelte";
  export let differentProducts;
    const productsData = differentProducts;    
    let DifferentProductData = productsData.map((product) => ({
      productId: product.id,
      prodDesc: product.prodDesc,
      productNumber: product.productNumber,
      productName: product.productName,
      priceSize: product.priceSize,
      synonym: product.filteredProductData?.["Synonym(S)"],
      name: product.expand?.subCategory?.name,
      image: product.imageSrc,
      properties: product.properties,
      Form:product.properties.Form,
      manufacturerName: product.expand.manufacturerName.name,
      stock : product.stockQuantity,
      category : product.expand.Category.urlName,
      subCategory : product.expand.subCategory.urlName,
      subsubCategory : product.expand.subsubCategory.urlName,
    }));
function truncateText(text, maxLength = 50) {
    if (!text || typeof text !== 'string') {
        return '-'; 
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
    let qualityLevels = {};
    let formCounts = {};
    let mpCounts = {};
    let sustainabilityCounts = {};
    let descriptionCounts = {};
    let showDifference = false;
  function calculateCount() {
      qualityLevels = {};
      formCounts = {};
      mpCounts = {};
      sustainabilityCounts = {};
      descriptionCounts = {};
      DifferentProductData.forEach((product) => {
        if (product.properties.QualityLevel) {
          qualityLevels[product.properties.QualityLevel] = (qualityLevels[product.properties.QualityLevel] || 0) + 1;
        }
        if (product.properties.Form) {
          formCounts[product.properties.Form] = (formCounts[product.properties.Form] || 0) + 1;
        }
        if (product.properties.Mp) {
          mpCounts[product.properties.Mp] = (mpCounts[product.properties.Mp] || 0) + 1;
        }
        if (product.properties.Sustainability) {
          sustainabilityCounts[product.properties.Sustainability] = (sustainabilityCounts[product.properties.Sustainability] || 0) + 1;
        }
        if (product.prodDesc) {
          descriptionCounts[product.prodDesc] = (descriptionCounts[product.prodDesc] || 0) + 1;
        }
      });
    }
 
  let currentIndex = 0;
  let logosPerSlide = 4;
  let totalSlides = Math.ceil(DifferentProductData.length / logosPerSlide);

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
  }

  function updateLogosPerSlide() {
    if (window.innerWidth < 640) {
      logosPerSlide = 1;
    } else if (window.innerWidth < 768) {
      logosPerSlide = 2;
    } else if (window.innerWidth < 1024) {
      logosPerSlide = 3;
    } else {
      logosPerSlide = 4;
    }

    totalSlides = Math.ceil(DifferentProductData.length / logosPerSlide);
    currentIndex = Math.min(currentIndex, totalSlides - 1);
  }



  onMount(() => {
    showDifference = false;
    calculateCount();
    updateLogosPerSlide();
    window.addEventListener("resize", updateLogosPerSlide);

    return () => {
      window.removeEventListener("resize", updateLogosPerSlide);
    };
  });

  let selectedProduct = {};
  let selectedPrice;
  let selectedPriceIndex = 0;
  let showModal = false;
  let showCartMessage = false;

  function openModal(product) {
    selectedProduct = product;
    selectedPrice = selectedProduct.price[0];
    selectedPriceIndex = 0;
    showModal = true;
    showCartMessage = false;
  }

  function closeModal() {
    showModal = false;
  }

  function selectPrice(index, size) {
    const filtered = selectedProduct.price.find((price) => price.size === size);
    selectedPrice = filtered;
    selectedPriceIndex = index;
  }

  function getCart() {
    if (browser) {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  }

  function addToCart(product) {
    if (!browser) return;

    const cart = getCart();
    const existingProduct = cart.find(
      (item) => item.productNumber === product.partNumber
    );

    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.push({
        ...product,
        priceSize: { price: selectedPrice.price, size: selectedPrice.size },
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    popupQuantity = 1;
    showCartMessage = true;
    setTimeout(() => {
      showModal = false;
    }, 1000);
}

  let popupQuantity = 1;

  function decrementPopupQuantity() {
    if (popupQuantity > 1) {
      popupQuantity--;
    }
  }

  function incrementPopupQuantity() {
    popupQuantity++;
  }

  function handlePopupInput(event) {
    const value = parseInt(event.target.value, 10);
    if (value >= 1) {
      popupQuantity = value;
    } else {
      popupQuantity = 1;
    }
  }
  
  function toggleDifference() {
      showDifference = !showDifference;
    }
</script>

<div class="mx-0 lg:mx-10 mb-10">
  <div class="flex justify-between items-center mb-4">
    <div class="font-bold text-primary-500 ml-9 lg:ml-0">Compare Similar Items</div>
    <div class="flex items-center space-x-2 mr-9 lg:mr-0">
      <div class="font-bold text-primary-500">Show Difference</div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          id="toggleDifference"
          checked={showDifference}
          on:change={toggleDifference}
        />
        <div class="w-10 h-5 border-2 border-primary-500 rounded-full peer-checked:bg-primary-500 transition-colors duration-300"></div>
        <div class="dot absolute left-1 top-1 bg-primary-500 w-3 h-3 rounded-full transition-transform duration-300 peer-checked:translate-x-5 peer-checked:bg-white"></div>
      </label>
    </div>
  </div>

  <div class="relative mt-1">
    <div class="flex items-center">
      <button on:click={prevSlide} class="lg:hidden text-primary-500">
        <Icon class="text-3xl" icon="ion:chevron-back" />
      </button>

      <div class="overflow-hidden flex-1">
        <div
          class="flex transition-transform duration-300"
          style={`transform: translateX(-${currentIndex * 100}%)`}
        >

        {#each DifferentProductData as product}
        <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
          <div
            class="flex flex-col w-full bg-white rounded-lg overflow-hidden"
          >
            <div class="flex items-center p-3">
              <img
                src={product.image}
                alt="Img"
                class="w-20 h-20 object-contain rounded-sm"
              />
              <div class="ml-2 text-left flex-1">
                <h3 class="text-gray-600 text-xs font-semibold">
                  {product.manufacturerName || "--"}
                </h3>
                <p class="font-bold text-sm text-primary-500">
                  <a href="/products/{product.category}/{product.subCategory}/{product.productNumber}">{product.productNumber || "--"}</a>
                </p>
                <p class="font-medium text-sm h-10 overflow-hidden">
                  {product.synonym
                    ? product.synonym.slice(0, 35) + "..."
                    : "--"}
                </p>
              </div>
            </div>
            <div class="flex justify-center">
              <button
                on:click={() =>
                  openModal({
                    image: product.image,
                    brand: product.manufacturerName,
                    partNumber: product.productNumber,
                    name: product.productName,
                    price: product.priceSize,
                    description: product.prodDesc,
                    id: product.productId,
                    stock : product.stock,
                    category : product.category,
                    subCategory : product.subCategory,
                    subsubCategory : product.subsubCategory,
                  })}
                class="w-11/12 max-w-xs text-primary-500 py-2 rounded border border-primary-500 hover:bg-primary-500 hover:text-white transition p-2 mb-4"
              >
                View Price & Availability
              </button>
            </div>
          </div>
          <div class={`flex justify-between items-center w-full mt-5 ${showDifference && qualityLevels[product.properties.QualityLevel] === 1 ? 'bg-primary-200' : 'bg-white'}`}>              
            <span class="font-semibold text-xs ml-3 mb-1">Quality Level:</span>
            <p class="font-normal text-xs mr-3 mb-1 text-black">{product.properties.QualityLevel || '-'}</p>
          </div>
          <hr class="border-t-2 w-full">
          <div class={`flex justify-between items-center w-full mt-5 ${showDifference && formCounts[product.properties.Form] === 1 ? 'bg-primary-200' : 'bg-white'}`}>
            <span class="font-semibold text-xs ml-3 mb-1">Form:</span>
            <p class="font-normal text-xs mr-3 mb-1 text-black">
              {truncateText(product.properties.Form, 10) || '-'}
            </p>
          </div>  
          <hr class="border-t-2 w-full">
          <div class={`flex justify-between items-center w-full mt-5 ${showDifference && mpCounts[product.properties.Mp] === 1 ? 'bg-primary-200' : 'bg-white'}`}>
            <span class="font-semibold text-xs ml-3 mb-1">Storage temp:</span>
            <p class="font-normal text-xs mr-3 mb-1 text-black">{truncateText(product.properties.Mp,10) || '-'}</p>
          </div>
          <hr class="border-t-2 w-full">
          <div class={`flex justify-between items-center w-full mt-5 ${showDifference && sustainabilityCounts[product.properties.Sustainability] === 1 ? 'bg-primary-200' : 'bg-white'}`}>
            <span class="font-semibold text-xs ml-3 mb-1">Application(s):</span>
            <p class="font-normal text-xs mr-3 mb-1 text-black">
              {truncateText(product.properties.Sustainability, 10) || '-'}
          </p>
          </div>
          <hr class="border-t-2 w-full">
          <div class={`flex justify-between items-center w-full mt-5 ${showDifference && descriptionCounts[product.prodDesc] === 1 ? 'bg-primary-200' : 'bg-white'}`}>
            <span class="font-semibold text-xs ml-3 mb-1">Description:</span>
            <p class="font-normal text-xs mr-3 mb-1 text-black">{truncateText(product.prodDesc, 10) || '-'}</p>
          </div> 
          <hr class="border-t-2 w-full mb-10">
        </div>
      {/each}
        </div>
      </div>
      <button on:click={nextSlide} class="lg:hidden text-primary-500">
        <Icon class="text-4xl" icon="ion:chevron-forward" />
      </button>
    </div>
    <div class="flex justify-center mt-4 relative lg:hidden">
      {#each Array(totalSlides).fill(0) as _, slideIndex}
        <button
          on:click={() => (currentIndex = slideIndex)}
          class={`w-1.5 h-1.5 rounded-full mx-1 bg-gray-400 hover:bg-gray-600 ${currentIndex === slideIndex ? "bg-primary-400" : ""}`}
        ></button>
      {/each}
    </div>
  </div>
</div>




{#if showModal}
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div
      class="bg-white p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-5/12 relative"
    >
      {#if showCartMessage}
        <div class=" bg-green-400 text-white my-2 text-center">
          Item added to cart!
        </div>
      {/if}
      <div class="mt-2 absolute right-6 top-1">
        <button
          on:click={closeModal}
          class="text-primary-500 hover:text-primary-500 hover:scale-110"
        >
          <Icon icon="ion:close" class="text-2xl"></Icon>
        </button>
      </div>
      <div class="flex flex-row sm:flex-row gap-4 mb-3">
        <img
          src={selectedProduct.image}
          alt="ProductImage"
          class="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg border mx-auto sm:mx-0"
        />
        <div>
          <p class="text-xs font-semibold text-left">
            {selectedProduct.brand || "--"}
          </p>
          <p class="text-base font-semibold text-primary-500 text-left">
            <a
              href="/products/{selectedProduct.category}/{selectedProduct.subCategory}/{selectedProduct.partNumber}"
              >{selectedProduct.partNumber || "--"}</a
            >
          </p>
          <h2 class="text-lg font-medium text-left">
            {selectedProduct.name || "--"}
          </h2>
          <p class="text-sm text-left">
            {selectedProduct.description || "--"}
          </p>
        </div>
      </div>
      <hr class="my-4" />
      <div class="pl-2">
        <h1 class="font-semibold">Select Size</h1>
        <div class="flex gap-3 mt-3 flex-wrap">
          {#each selectedProduct.priceSize as { price, size }, index}
            <button
              class="focus:bg-primary-400 hover:scale-105 focus:text-white border px-3 py-1 rounded-full {selectedPriceIndex ===
              index
                ? ' bg-primary-400 text-white'
                : ''}"
              on:click={() => selectPrice(index, size)}
            >
              {size}
            </button>
          {/each}
        </div>
        {#if selectedPrice}
          <div
            class="mt-5 flex gap-6 items-center justify-between sm:justify-start"
          >
            <p class="text-base sm:text-lg ml-2">
              Price: <span class="font-semibold text-2xl"
                >{selectedPrice.price}</span
              >
            </p>
          </div>
        {/if}
        <div class="mt-4">
          <form
            class="flex items-center gap-3"
            on:submit|preventDefault={() =>
              addToCart({
                ...selectedProduct,
                priceSize: { price: selectedPrice.price, size: selectedPrice.size },
                quantity: popupQuantity,
              })}
          >
            <div
              class="border border-gray-300 rounded-md flex gap-2 justify-between items-center hover:shadow-lg hover:shadow-orange-100 w-full sm:w-36"
            >
              <button
                type="button"
                class="pl-3 text-xl text-primary-500 hover:scale-110"
                on:click={decrementPopupQuantity}>-</button
              >
              <input
                type="number"
                id="popupQuantity"
                min="1"
                value={popupQuantity}
                on:input={handlePopupInput}
                class="w-16 sm:w-20 h-9 text-center border-none focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                class="pr-3 text-xl text-primary-500 hover:scale-110"
                on:click={incrementPopupQuantity}>+</button
              >
            </div>
            <button
              type="submit"
              class="text-sm font-semibold py-2 px-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-400 hover:text-white transition"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}