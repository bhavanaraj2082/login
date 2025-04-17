<script>
  import Icon from "@iconify/svelte";
  export let remainingProducts;
  import {PUBLIC_IMAGE_URL} from "$env/static/public"
  // console.log("remainingProducts",remainingProducts);
  export let currencyType;

  function priceShowing(price, currency) {
    if (price === undefined || price === null || price === 0) {
        return '--';
    }
    const formattedPrice = Number(price.toFixed(2));
    if (currency === "inr") {
       let showingPrice = formattedPrice.toLocaleString("en-IN");
        return `₹ ${showingPrice}`;
    }
    if (currency === "usd") {
        return `$ ${formattedPrice}`;
    }
    return formattedPrice; 
}
</script>

<div class="col-span-2 mt-6"> 
  {#if !remainingProducts.length > 0}
    <div class="flex justify-center mt-5">
      <p class="text-content font-light">No pending products available.</p>
    </div>
  {/if}
  <div class="mb-5">
    {#each remainingProducts as product}
    <div class="mb-3">
      <h1 class="text-base text-gray-600 font-semibold">Pending Products</h1>
    </div>
      <div class="rounded-lg mb-5 bg-white">
        <div
          class="flex justify-between items-center px-4 py-2 rounded-md shadow"
        >
          <div class="flex gap-3 items-center w-[50%]">
              <!-- svelte-ignore a11y-missing-attribute -->
              <img  
              src="{PUBLIC_IMAGE_URL}/{product?.image}"
              onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
              class="w-16 rounded-lg" />
            <div class="flex flex-col">
              <p class="text-gray-600 text-sm font-semibold">
                {product.productName || "--"}
              </p>
              <p class="font-medium text-sm text-gray-500">
                Qty : <span class="text-gray-700"
                  >{product.remainingQuantity || "--"}</span
                >
              </p>
            </div>
          </div>

          <div>
            <p class="font-medium text-sm text-gray-600">unit price</p>
            <p class="font-medium text-sm text-gray-700">
              {priceShowing(product.unitPrice , currencyType)}
            </p>
          </div>

          <div class="flex gap-2 justify-end">
            <div class="flex gap-2">
              <div></div>
              <Icon
                icon="mingcute:time-duration-line"
                class="text-primary-500 text-xl"
              />
              <h3 class="font-semibold text-sm text-gray-500">Pending</h3>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  {#if remainingProducts.length > 0}
    <button
      class="sticky bottom-0 left-3/4 z-10 rounded border shrink-0 p-1.5 bg-primary-100 hover:text-white hover:bg-primary-600"
      on:click={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <Icon icon="zondicons:cheveron-up" class="text-2xl" />
    </button>
  {/if}
</div>
