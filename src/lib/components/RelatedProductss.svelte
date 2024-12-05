<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { cartState } from '$lib/stores/cartStores.js'; 
  import { toast } from 'svelte-sonner';
  import Icon from "@iconify/svelte";
  export let relatedProducts;
  const productsData = relatedProducts;

  let RelatedProductData = productsData.map((product) => ({
    productId: product._id,
    prodDesc: product.prodDesc,
    productName: product.productName,
    priceSize: product.stockPriceSize.map((size) => ({
      size: size.break,
      price: size.INR,
    })),
    image: product.imageSrc,
    manufacturer: product.manufacturerInfo[0]?.name,
    stock: product.stockQuantity,
    category: product.categoryInfo[0]?.urlName,
    subCategory: product.subCategoryInfo[0]?.urlName,
    subsubCategory: product.subsubCategoryInfo[0]?.urlName,
    productUrl: product.productUrl,
    productNumber: product.productNumber,
  }));

  let currentIndex = 0;
  let logosPerSlide = 4;
  let totalSlides = Math.ceil(RelatedProductData.length / logosPerSlide);

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

    totalSlides = Math.ceil(RelatedProductData.length / logosPerSlide);
    currentIndex = Math.min(currentIndex, totalSlides - 1);
  }

  onMount(() => {
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

  function openModal(product) {

    selectedProduct = {
    brand : product.brand,
		description: product.description,
		id:product.id,
		name : product.name,
		image : product.image,
		name : product.name,
        partNumber : product.partNumber,
		priceSize : product.priceSize,
        quantity : product.quantity,
		stock : product.stock
	}
    selectedPrice = selectedProduct.priceSize[0];
    selectedPriceIndex = 0;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function selectPrice(index, size) {
    const filtered = selectedProduct.priceSize.find(
      (price) => price.size === size
    );
    selectedPrice = filtered;
    selectedPriceIndex = index;
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
    (item) =>
      item.partNumber === product.partNumber &&
      item.priceSize.size === product.priceSize.size
  );

  if (existingProduct) {

    existingProduct.quantity += product.quantity;

    cartState.update((currentCart) => {
      const index = currentCart.findIndex(
        (item) =>
          item.partNumber === product.partNumber &&
          item.priceSize.size === product.priceSize.size
      );

      if (index !== -1) {
        currentCart[index].quantity += product.quantity;
        toast.info("Item quantity updated!")
      }
      return currentCart; 
    });
    
  } else {
    cart.push({
      ...product,
    });

    cartState.update((currentCart) => {
      currentCart.push(product);
      return currentCart;
    });
    toast.success("Item added to cart")
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  setTimeout(() => {
    showModal = false;
    popupQuantity = 1;
  }, 500);
}
</script>

<div class="max-w-7xl mx-auto my-10">
  <h2 class="font-bold text-primary-500 mt-4 ml-12">Related Products</h2>

  <div class="relative mt-1">
    <div class="flex items-center">
      <button on:click={prevSlide} class="text-primary-500">
        <Icon class="text-3xl" icon="ion:chevron-back" />
      </button>

      <div class="overflow-hidden flex-1">
        <div
          class="flex transition-transform duration-300"
          style={`transform: translateX(-${currentIndex * 100}%)`}
        >
          {#each RelatedProductData as product}
            <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
              <div
                class="flex flex-col w-full bg-white shadow-sm border rounded-lg overflow-hidden"
              >
                <div class="flex items-center p-3">
                  <img
                    src={product.image}
                    alt="Img"
                    class="w-20 h-20 object-contain rounded-sm"
                  />
                  <div class="ml-2 text-left flex-1">
                    <h3 class="text-gray-600 text-xs font-semibold">
                      {product.manufacturer || "--"}
                    </h3>
                    <p class="font-bold text-sm text-primary-500">
                      <a
                        href="/products/{product.category}/{product.subCategory}/{product.productNumber}"
                        >{product.productNumber || "--"}</a
                      >
                    </p>
                    <p class="font-medium text-sm h-10 overflow-hidden">
                      {product.prodDesc
                        ? product.prodDesc.slice(0, 35) + "..."
                        : "--"}
                    </p>
                  </div>
                </div>
                <div class="flex justify-center">
                  <button
                    on:click={() =>
                      openModal({
                        image: product.image,
                        brand: product.manufacturer,
                        partNumber: product.productNumber,
                        name: product.productName,
                        priceSize: product.priceSize,
                        description: product.prodDesc,
                        id: product.productId,
                        stock: product.stock,
                        category: product.category,
                        subCategory: product.subCategory,
                        subsubCategory: product.subsubCategory,
                      })}
                    class="w-11/12 max-w-xs text-primary-500 py-2 rounded border border-primary-500 hover:bg-primary-500 hover:text-white transition p-2 mb-4"
                  >
                    View Price & Availability
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <button on:click={nextSlide} class="text-primary-500">
        <Icon class="text-4xl" icon="ion:chevron-forward" />
      </button>
    </div>
    <div class="flex justify-center mt-4 relative">
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
          {#each selectedProduct.priceSize as { size }, index}
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
                >₹ {selectedPrice.price}</span
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
                priceSize: {
                  price: selectedPrice.price,
                  size: selectedPrice.size,
                },
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
