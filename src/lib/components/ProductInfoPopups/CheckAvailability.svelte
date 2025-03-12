<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import { addItemToCart, cart, guestCart } from "$lib/stores/cart.js";

  export let data;
  export let CheckAvailabilityClose;
  export let quantity;
  export let index;
  export let updateQuantity;
  export let increaseQuantity;
  export let decreaseQuantity;
  export let addToCart;
  export let cartTogglePopup;
  let stockStatus = "";
  let stockAvailability = "";
  let stockType = "";
  let stockUnAvailability = "";
  let cartNotification = "";
  let notificationTimeout;
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity !ml-0"
    on:click={CheckAvailabilityClose}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg"
      on:click|stopPropagation
    >
      <button
        on:click={CheckAvailabilityClose}
        class="absolute top-4 right-4 text-primary-400 text-xl font-bold"
      >
        <Icon
          icon="mdi:close"
          class="text-xl font-bold hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
        />
      </button>

      <h2 class="text-xl font-bold text-left">
        Availability for {product?.productNumber}-{product?.priceSize[index]
          ?.break}
      </h2>
      <p class="text-gray-500 text-left mt-2">
        Enter quantity to check availability.
      </p>

      <div class="flex gap-10 mt-6">
        <div class="flex items-center space-x-4 border border-gray-300 rounded">
          <button
            on:click={decreaseQuantity}
            class="w-8 h-8 text-primary-400 flex items-center justify-center"
          >
            <Icon icon="ic:round-minus" class="text-2xl" />
          </button>
          <input
            type="text"
            min="1"
            maxlength="3"
            bind:value={quantity}
            class="w-12 h-6 p-0 text-center border-transparent focus:my-1 focus:border-gray-300 focus:ring-0 focus:outline-none rounded-md"
            on:focus={(e) => {
              const currentValue = e.target.value;
              e.target.value = "";
              setTimeout(() => {
                e.target.select();
              }, 10);
            }}
            on:blur={(e) => {
              if (e.target.value === "" || e.target.value === "0") {
                quantity = 1;
                e.target.value = "1";
              }
            }}
            on:input={(e) => {
              // Ensure only numbers are allowed
              e.target.value = e.target.value.replace(/[^0-9]/g, "");

              // If the value starts with '0' but has more than one character, remove the leading zero
              if (e.target.value.startsWith("0") && e.target.value.length > 1) {
                e.target.value = e.target.value.slice(1);
              }

              // Parse the input value and update quantity
              const parsedValue = parseInt(e.target.value, 10);

              if (parsedValue && parsedValue >= 1 && parsedValue <= 999) {
                quantity = parsedValue;
              } else if (e.target.value === "") {
                quantity = 0; // Set to 0 if empty
              }

              updateQuantity(e); // Handle additional input logic if needed
            }}
            aria-label="Quantity"
            max="999"
          />

          <input type="hidden" name="ProductId" value={product.productNumber} />
          <button
            on:click={increaseQuantity}
            class="w-8 h-8 text-primary-400 flex items-center justify-center"
          >
            <Icon icon="ic:round-plus" class="text-2xl" />
          </button>
        </div>
        <form
          method="POST"
          action="?/checkavailabilityproduct"
          use:enhance={() => {
            return async ({ result }) => {
              let status = "";
              console.log(result);
              status = result.type;
              stockStatus = result.data.stock;
              stockAvailability = result.data.message;
              // stockUnAvailability = result.data.message1;
              stockType = result.data.type;
            };
          }}
        >
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="ProductId" value={product.productNumber} />
          <button
            type="submit"
            class="bg-primary-400 text-white p-2 rounded flex items-center space-x-1 {quantity <
            1
              ? 'cursor-not-allowed hover:opacity-65'
              : ''}"
            disabled={quantity < 1}
          >
            <Icon icon="tabler:calendar-check" class="text-lg" />
            <span class="text-sm">Check Availability</span>
          </button>
        </form>
      </div>

      {#if stockType === "success"}
        <div class="mt-6 space-y-2 text-sm">
          <div class="flex items-center space-x-2">
            <!-- <Icon icon="ix:success-filled" class="text-base text-green-500" /> -->
            <Icon icon="ix:success-filled" class="text-lg text-green-500" />
            <p>{stockAvailability}</p>
          </div>
          {#if stockUnAvailability !== ""}
            <div class="flex items-center space-x-2">
              <Icon icon="ix:success-filled" class="text-lg text-green-500" />
              <p>{stockUnAvailability}</p>
            </div>
          {/if}
        </div>
      {:else if stockType === "error"}
        <div class="mt-6 space-y-2 text-sm">
          <div class="flex items-center space-x-2">
            <Icon
              icon="meteor-icons:circle-xmark"
              class="text-sm text-primary-400"
            />
            <p>{stockAvailability}</p>
          </div>
        </div>
      {/if}
      <div class="mt-8 flex justify-end">
        <button
          on:click={() => {
            if (quantity >= 1) {
              addToCart(product, index);
              CheckAvailabilityClose();
              cartTogglePopup();
            }
          }}
          class="bg-primary-400 text-white py-3 px-4 rounded-md flex items-center space-x-1 {quantity <
          1
            ? 'cursor-not-allowed hover:opacity-65'
            : ''}"
          disabled={quantity < 1}
        >
          <Icon icon="ic:round-shopping-cart" class="text-xl" /><span
            class="text-sm">Add To Cart</span
          >
        </button>
      </div>
    </div>
  </div>
{/each}
