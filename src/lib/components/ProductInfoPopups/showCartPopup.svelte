<script>
  import Icon from "@iconify/svelte";
  import { currencyState } from "$lib/stores/mainStores.js";
  import { PUBLIC_IMAGE_URL } from "$env/static/public";
  export let data;
  export let cartTogglePopup;
  export let addedQuantity;
  export let index;
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity !m-0"
    on:click={cartTogglePopup}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-center mb-2 border-b-1 pb-3">
        <h2 class="text-lg font-semibold text-heading">Added to Cart</h2>
        <button
          on:click={cartTogglePopup}
          class="hover:bg-red-100 text-white rounded font-bold transition-colors duration-300"
        >
          <Icon
            icon="mdi:close"
            class="text-2xl font-bold text-red-600 border rounded hover:p-px"
          />
        </button>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex items-center mb-6 justify-around w-full">
          <img
            src="{PUBLIC_IMAGE_URL}/{product?.imageSrc}"
            alt="Img"
            class="w-24 h-24 object-contain p-1 mt-2 border rounded"
            onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'"
          />
          <div class="text-sm m-4">
            <p class="font-semibold text-primary-500">
              {product.productNumber}
            </p>
            <p class="text-description">{product.productName}</p>
          </div>
        </div>
        <div
          class="flex justify-between items-center w-full bg-primary-50 p-2 rounded-md border border-gray-200"
        >
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Quantity</p>
            <p class="text-base font-semibold text-gray-800">{addedQuantity}</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Total Price</p>
            <div class="flex flex-col items-center gap-1 mt-1">
              <p class="text-base font-semibold text-gray-800">
                {#if $currencyState === "usd"}
                  $ {(
                    (Number(product?.priceSize[index]?.USD) || 0) *
                    1.18 *
                    Number(addedQuantity || 0)
                  ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                {:else}
                  ₹ {(
                    (Number(product?.priceSize[index]?.INR) || 0) *
                    1.18 *
                    (addedQuantity || 0)
                  ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                {/if}
              </p>
              <p class="text-xs text-gray-500">with GST</p>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-700">Base Price</p>
            <div class="flex flex-col items-center gap-1 mt-1">
              <p class="text-sm font-bold text-gray-500">
                {#if $currencyState === "usd"}
                  $ {(
                    (Number(product?.priceSize[index]?.USD) || 0) *
                    (addedQuantity || 0)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {:else}
                  ₹ {(
                    (Number(product?.priceSize[index]?.INR) || 0) *
                    (addedQuantity || 0)
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {/if}
              </p>
              <p class="text-xs text-gray-400">without GST</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-5 mt-6 pt-3 border-t-1">
        <button
          on:click={cartTogglePopup}
          class="bg-primary-400 text-white px-3 py-1.5 rounded-md font-normal hover:bg-primary-500 transition-all ease-in-out duration-300 shadow-sm"
        >
          Continue Shopping
        </button>
        <a href="/cart">
          <button
            class="text-primary-400 px-3 py-1.5 rounded-md font-normal flex gap-2 border-1 border-primary-400 hover:border-primary-500 hover:bg-primary-500 hover:text-white transition-all ease-in-out duration-300 shadow-sm"
          >
            View Cart
            <Icon icon="ic:round-shopping-cart" class="text-2xl inline mr-1" />
          </button>
        </a>
      </div>
    </div>
  </div>
{/each}
