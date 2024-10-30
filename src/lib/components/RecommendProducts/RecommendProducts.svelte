<script>
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  export let data = [];

  let currentIndex = 0;
  let previewProduct = null;
  let quantityInput = 1;
  let displayMode = "lg";
  let message = "";
  let errormessage = "";
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array, but got:", data);
    data = [];
  }

  function updateDisplayMode() {
    if (window.innerWidth >= 1024) {
      displayMode = "lg";
    } else if (window.innerWidth >= 768) {
      displayMode = "md";
    } else {
      displayMode = "sm";
    }
  }

  onMount(() => {
    updateDisplayMode();
    window.addEventListener("resize", updateDisplayMode);

    return () => window.removeEventListener("resize", updateDisplayMode);
  });

  function next() {
    if (currentIndex + getCardsToShow() < data.length) {
      currentIndex += getCardsToShow();
    }
  }

  function prev() {
    if (currentIndex > 0) {
      currentIndex -= getCardsToShow();
    }
  }

  function getCardsToShow() {
    return displayMode === "lg" ? 3 : displayMode === "md" ? 2 : 1;
  }

  function showPreview(product) {
    previewProduct = product;
    quantityInput = 1;
    message = ""; 
    errormessage = "";
  }

  function closePreview() {
    previewProduct = null;
  }
  let addedToCart = false;
  function addToCart(product, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = { ...product, quantity: parseInt(quantity) };
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    addedToCart = true;
    // alert(`${product.productName} added to cart successfully!`);
  }

  function preventClose(event) {
    event.stopPropagation();
  }
</script>

<div>
  <h1 class="text-primary-500 p-8 font-semibold">Recommended Products</h1>
  <div class="flex items-center ">
  <button
    class=" p-2"
    on:click={prev}
    disabled={currentIndex === 0}
  >
  <Icon
  icon="lsicon:double-arrow-left-outline"
  class=" text-3xl  text-primary-500"
/>
  </button>

  {#if displayMode === "lg"}
    <div class="grid grid-cols-4 gap-4">
      {#each data.slice(currentIndex, currentIndex + 4) as product}
        <div class="bg-white shadow-lg rounded p-4">
          <div class="flex">
            <img
              src={product.imageSrc}
              alt={product.productName}
              class="w-1/3 rounded-lg"
            />
            <div class="ml-4">
              <h3 class="text-xs">{product.manufacturerName}</h3>
              <h2 class="text-sm font-semibold">{product.productNumber}</h2>
              <h1 class="text-sm text-wrap">{product.productName}</h1>
            </div>
          </div>
          <div class="mt-8 mb-4">
            <button
              class="text-primary-500 border-1 rounded border-primary-500 w-full hover:bg-primary-500 hover:text-white py-2 text-sm"
              on:click={() => showPreview(product)}
            >
              View Price and Availability
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else if displayMode === "md"}
    <div class="grid grid-cols-3 gap-4 ">
      {#each data.slice(currentIndex, currentIndex + 3) as product}
        <div class="bg-white shadow-lg rounded-lg p-4">
          <div class="flex">
            <img
              src={product.imageSrc}
              alt={product.productName}
              class="w-1/3 rounded-lg"
            />
            <div class="ml-4">
              <h3 class="text-xs">{product.manufacturerName}</h3>
              <h2 class="text-sm font-semibold">{product.productNumber}</h2>
              <h1 class="text-sm text-wrap">{product.productName}</h1>
            </div>
          </div>
          <div class="mt-8 mb-4">
            <button
              class="text-primary-500 border-1 rounded border-primary-500 w-full hover:bg-primary-500 hover:text-white py-2 text-sm"
              on:click={() => showPreview(product)}
            >
              View Price and Availability
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else if displayMode === "sm"}
    <div class="grid grid-cols-1 gap-4">
      {#each data.slice(currentIndex, currentIndex + 1) as product}
        <div class="bg-white shadow-lg rounded-lg p-4">
          <div class="flex">
            <img
              src={product.imageSrc}
              alt={product.productName}
              class="w-1/3 rounded-lg"
            />
            <div class="ml-4">
              <h3 class="text-xs">{product.manufacturerName}</h3>
              <h2 class="text-sm font-semibold">{product.productNumber}</h2>
              <h1 class="text-sm text-wrap">{product.productName}</h1>
            </div>
          </div>
          <div class="mt-8 mb-4">
            <button
              class="text-primary-500 border-1 rounded border-primary-500 w-full hover:bg-primary-500 hover:text-white py-2 text-sm"
              on:click={() => showPreview(product)}
            >
              View Price and Availability
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <button
    class="p-2"
    on:click={next}
    disabled={currentIndex + getCardsToShow() >= data.length}
  >
  <Icon
  icon="lsicon:double-arrow-right-outline"
  class="text-3xl  text-primary-500"
/>
  </button>
</div>
</div>

{#if previewProduct}
  <form
    method="post"
    action="?/checkavailability"
    use:enhance={() => {
      return async ({ result }) => {
        // console.log("*****************");
        
        // console.log(result);
message=""  
        if (result.data && result.type === "success") {
          // console.log(`${result.data.message}` );
          // Clear the form
          
          message = "Stock available";
          // alert('Stock available!');
        } else if (result.type === "success" && !result.data) {
          message = "Out of stock";
          // alert('Out of Stock');
        } else {
          console.error(`${result.error}`, result.details);
          errormessage = "There was an error fetching stock. Please try again.";
          // alert("There was an error fetching stock. Please try again.");
        }
      };
    }}
  >
    <div
      class={`fixed inset-0 flex  lg:items-center md:items-center sm:items-center justify-center bg-black bg-opacity-50 z-50 ${displayMode === "sm" ? "h-full" : ""}`}
    >
      <div
        class={`bg-white w-full ${displayMode === "sm" ? "h-full" : "max-w-xl"} rounded-lg overflow-hidden shadow-lg`}
      >
        <div class="flex justify-end items-center p-4 border-b">
          <button class="text-red-500" on:click={closePreview}>X</button>
        </div>
        <div class="flex p-4 flex-col lg:flex-row">
          <img
            src={previewProduct.imageSrc}
            alt={previewProduct.productName}
            class="lg:w-1/2 rounded-lg h-36 object-cover"
          />
          <div class="ml-4">
            <h3 class="text-sm font-semibold">
              {previewProduct.manufacturerName}
            </h3>
            <h3 class="text-sm text-primary-500">
              {previewProduct.productNumber}
            </h3>
            <h3 class="text-sm font-bold">{previewProduct.productName}</h3>
            <p class="mt-2 text-xs">{previewProduct.prodDesc}</p>
          </div>
        </div>
        <div
          class="border-b-1 border-primary-500 flex justify-between items-center m-4"
        >
          <span>{previewProduct.productSynonym.split(", ").pop()}</span>
          <span
            ><a href="/fav"
              ><Icon
                icon="line-md:heart-filled"
                class=" text-lg text-white bg-primary-500 hover:text-primary-500 hover:bg-white"
              /></a
            ></span
          >
        </div>
        <div class="flex justify-between px-4 items-start text-sm">
          <span
            class="text-sm text-primary-500 border rounded-2xl p-1 px-8 bg-primary-50 border-primary-500"
          >
            {previewProduct.productNumber}
          </span>
          <span>
            {previewProduct.priceSize[0].price} / {previewProduct.priceSize[0]
              .size}
          </span>
        </div>
        <div
          class="flex items-center mt-4 justify-evenly flex-col lg:flex-row p-4 w-full"
        >
          <div class="flex flex-row">
            <div
              class="flex items-center justify-evenly mx-4 border border-primary-300 rounded bg-primary-50"
            >
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span
                class="text-primary-500 py-2 text-sm px-4"
                on:click={() => {
                  if (quantityInput > 1) quantityInput -= 1;
                }}
              >
                -
              </span>
              <input
                type="text"
                bind:value={quantityInput}
                class="rounded py-2 w-20 text-center text-sm bg-primary-50"
                on:click={preventClose}
                on:input={(e) =>
                  (quantityInput = Math.max(1, parseInt(e.target.value) || 1))}
              />
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span
                class="text-primary-500 py-2 text-sm px-4"
                on:click={() => (quantityInput += 1)}
              >
                +
              </span>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
              class="text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white py-2 px-10 text-sm rounded text-nowrap"
              on:click={addToCart(previewProduct, quantityInput)}
            >
              {#if !addedToCart}
                Add to Cart
              {:else if addedToCart}
                Added to Cart
              {/if}
            </span>
            <input
              type="text"
              bind:value={previewProduct.productNumber}
              name="productNumber"
              hidden
            />
            <input
              type="text"
              bind:value={quantityInput}
              name="quantity"
              hidden
            />
          </div>
          {#if message}
          <span class="text-sm ml-1">{message}</span>
          {/if}
          <button class="text-primary-500 font-semibold text-sm mt-2"
            >CHECK AVAILABILITY</button
          >
        </div>
      </div>
    </div>
  </form>
{/if}
