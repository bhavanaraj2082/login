<script>
  import Icon from "@iconify/svelte";
  import { currencyState } from "$lib/stores/mainStores.js";
  import Sharepopup from "./Sharepopup.svelte";
  import ShowCartPopup from "./showCartPopup.svelte";
  import CheckAvailability from "./CheckAvailability.svelte";
  // export let showTooltip;
  export let data;
  export let quantity;
  export let addedQuantity;
  export let index;
  export let toggleTooltip;
  export let togglePopup;
  export let showPopup;
  export let decreaseQuantity;
  export let updateQuantity;
  export let increaseQuantity;
  export let addToCart;
  export let showCartPopup;
  export let cartTogglePopup;
  let showSharePopup = false;

  function toggleSharePopup() {
    showSharePopup = !showSharePopup;
  }
</script>

{#each data.records as product}
  <div
    class="justify-between items-center flex-col lg:flex-row lg:w-1/5 max-md:!ml-0 max-md:mt-4"
  >
    <div class="flex flex-col w-full">
      <div class="text-gray-800">
        <div
          class="items-center justify-between border-b-1 border-gray-300 pb-2"
        >
          <div class="text-md font-semibold relative flex">
            <div class="relative inline-block tooltip-container">
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- {#if showTooltip}
                <div class="absolute border border-primary-200 bottom-full left-1/2 transform -translate-x-1/2 bg-white text-black text-center w-56 text-sm rounded-md p-2 shadow-lg animate-fadeIn">
                  <button
                    on:click={() => (showTooltip = false)}
                    class="absolute top-1 right-2 text-black">
                    <Icon
                      icon="mdi:close"
                      class="absolute top-1 right-2 text-black text-sm font-bold"/>
                  </button>
                  <h2 class="font-semibold text-sm text-black text-left">
                    Product Information
                  </h2>
                  <p class="text-xs font-normal text-gray-800 mt-1 text-left">
                    Foreign Trade Commodity Code: <span
                      class="text-gray-500 font-medium">{product?.productNumber}</span>
                  </p>
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-gray-700 border-transparent border-t-primary-300"></div>
                </div>
              {/if} -->
            </div>
            <p class="text-heading font-semibold">
              {product?.productNumber} - {product?.priceSize[index]?.break}
            </p>
            <button
              on:click={toggleTooltip}
              class="text-primary-400 ml-2 pointer-events-none"
            >
              <Icon
                icon="akar-icons:info-fill"
                class="text-base font-semibold"
              />
            </button>
          </div>
          <span class="text-lg font-bold mt-4">
            {#if $currencyState === "usd"}
              $ {(Number(product?.priceSize[index]?.USD) || 0).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            {:else}
              ₹ {(Number(product?.priceSize[index]?.INR) || 0).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            {/if}
          </span>
        </div>
      </div>

      <div class="border-b-1 border-gray-300 my-3">
        <span class="flex justify-between items-center">
          <!-- <p class="text-heading font-semibold md:text-sm text-xs whitespace-nowrap">Availability :</p> -->
          <p class="md:text-sm text-xs whitespace-nowrap font-medium">
            {#if product?.stockQuantity > 0}
              In Stock <Icon
                icon="ix:success-filled"
                class="text-base text-green-500 inline font-bold"
              />
            {:else}
              Out of stock <Icon
                icon="ix:error-filled"
                class="text-base text-red-500 font-bold inline"
              />
            {/if}
          </p>
        </span>
        <div class="flex space-x-2 items-center mt-1 mb-3">
          <button
            on:click={togglePopup}
            class="w-full text-sm font-semibold text-left text-primary-400"
            >More Info</button
          >
          {#if showPopup}
            <CheckAvailability
              {data}
              {cartTogglePopup}
              {addToCart}
              {updateQuantity}
              {increaseQuantity}
              {decreaseQuantity}
              CheckAvailabilityClose={togglePopup}
              {quantity}
              {index}
            />
          {/if}
          <button
            on:click={toggleSharePopup}
            class="w-full text-sm font-semibold text-right text-primary-400"
            >Share <Icon
              icon="fluent:share-24-filled"
              class="text-lg font-bold inline"
            /></button
          >
          {#if showSharePopup}
            <Sharepopup {data} SharePopup={toggleSharePopup} />
          {/if}
        </div>
      </div>
    </div>

    <div class="w-full !ml-0">
      {#if quantity > 0}
        <div class="mt-2 flex justify-between gap-3">
          <div class="flex flex-col text-heading">
            <p class="font-medium text-sm">Quantity</p>
            <p class="font-semibold text-center text-md mt-4">{quantity}</p>
          </div>
          <div class="flex flex-col text-heading">
            <p
              class="font-normal flex justify-between items-center text-xs py-px whitespace-nowrap"
            >
              Base Price:
              <span class="font-medium text-xs">
                {#if $currencyState === "usd"}
                  $ {(
                    (Number(product?.priceSize[index]?.USD) || 0) *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {:else}
                  ₹ {(
                    (Number(product?.priceSize[index]?.INR) || 0) *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                {/if}
              </span>
            </p>

            <p
              class="font-normal flex justify-between items-center text-xs border-b-1 border-gray-400 border-dotted pb-1 whitespace-nowrap"
            >
              GST (18%):
              <span class="font-medium text-xs">
                {#if $currencyState === "usd"}
                  $ {(
                    (Number(product?.priceSize[index]?.USD) || 0) *
                    0.18 *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                {:else}
                  ₹ {(
                    (Number(product?.priceSize[index]?.INR) || 0) *
                    0.18 *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                {/if}
              </span>
            </p>

            <p
              class="font-medium text-xs mt-1 flex justify-between items-center whitespace-nowrap"
            >
              Total Price:
              <span class="font-semibold text-xs">
                {#if $currencyState === "usd"}
                  $ {(
                    (Number(product?.priceSize[index]?.USD) || 0) *
                    1.18 *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                {:else}
                  ₹ {(
                    (Number(product?.priceSize[index]?.INR) || 0) *
                    1.18 *
                    (Number(quantity) || 0)
                  ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                {/if}
              </span>
            </p>
          </div>
        </div>
      {/if}

      <div
        class="flex items-center border border-gray-300 justify-between w-full space-x-4 mt-5 rounded-md"
      >
        <button
          on:click={decreaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><Icon icon="ic:round-minus" class="text-2xl" /></button
        >
        <input
          type="text"
          min="1"
          maxlength="3"
          bind:value={quantity}
          class="w-12 h-6 p-0 text-center border-none focus:border-none outline-none focus:outline-none appearance-none focus:ring-0 focus:ring-transparent bg-transparent"
          on:focus={(e) => {
            setTimeout(() => e.target.select(), 10);
          }}
          on:blur={(e) => {
            if (!e.target.value || parseInt(e.target.value, 10) < 1) {
              quantity = 1;
              e.target.value = "1";
            }
          }}
          on:input={(e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, "");
            if (e.target.value === "") {
              quantity = "";
              return;
            }

            if (e.target.value.startsWith("0") && e.target.value.length > 1) {
              e.target.value = e.target.value.slice(1);
            }

            const parsedValue = parseInt(e.target.value, 10);

            if (parsedValue > 999) {
              quantity = 999;
              e.target.value = "999";
            } else {
              quantity = parsedValue;
            }
            updateQuantity(e);
          }}
          aria-label="Quantity"
          max="999"
        />
        <button
          on:click={increaseQuantity}
          class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
          ><Icon icon="ic:round-plus" class="text-2xl" /></button
        >
      </div>
      <div class="w-full mt-3">
        <button
          on:click={() => {
            if (quantity >= 1) {
              addToCart(product, index);
              cartTogglePopup();
            }
          }}
          class="w-full text-white border flex justify-center items-center border-primary-400 rounded-md py-1.5 font-medium px-2
          hover:bg-primary-400 bg-primary-400 hover:text-white
          {quantity < 1 ? 'cursor-not-allowed hover:opacity-65' : ''}"
          disabled={quantity < 1}
        >
          <Icon icon="ic:round-shopping-cart" class=" inline text-xl mr-1" />
          Add To Cart
        </button>
      </div>
    </div>
  </div>
{/each}
{#if showCartPopup}
  <ShowCartPopup {data} {cartTogglePopup} {addedQuantity} {index} />
{/if}
