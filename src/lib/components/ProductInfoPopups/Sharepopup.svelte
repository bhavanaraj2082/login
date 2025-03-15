<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  export let data;
  export let SharePopup;
  let productURL = "";
  let showToast = false;

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

  onMount(() => {
    productURL = window.location.href;
  });
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity !m-0"
    on:click={SharePopup}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4"
      on:click|stopPropagation
    >
      <button
        on:click={SharePopup}
        class="absolute top-3 right-3 text-primary-400"
      >
        <Icon
          icon="mdi:close"
          class="text-xl text-primary-400 font-bold hover:bg-primary-300 hover:text-white hover:rounded-md hover:p-px"
        />
      </button>

      <h2 class="text-base font-semibold text-heading mb-3">Share Product</h2>

      <div class="flex items-start space-x-4">
        <div class="border-gray-300 border rounded-md">
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img
            src={product.imageSrc}
            alt="Product Image"
            class="w-32 h-20 p-1 object-contain"
          />
        </div>

        <div>
          <p class="text-sm font-semibold text-primary-500">
            {product.productNumber}
          </p>
          <p class="text-sm font-normal text-gray-600">
            {product.productName}
          </p>
        </div>
      </div>

      <!-- Social Media Share Section -->
      <div class="mt-6">
        <p class="text-sm font-semibold text-gray-700">Share this link via:</p>

        <div class="flex justify-start space-x-4 mt-3">
          <a
            href="https://t.me/share/url?url={encodeURIComponent(
              productURL
            )}&text={encodeURIComponent(
              'Manufacturer Name: ' +
                product.manufacturer.name +
                ' - ' +
                ' Product Name: ' +
                product.productName
            )}"
            target="_blank"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-200"
          >
            <Icon icon="bxl:telegram" class="text-2xl" />
          </a>

          <a
            href={"https://wa.me/?text=" +
              encodeURIComponent(
                "Manufacturer Name: " +
                  product.manufacturer.name +
                  " - " +
                  "Product Name: " +
                  product.productName +
                  " " +
                  productURL
              )}
            target="_blank"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition duration-200"
          >
            <Icon icon="bxl:whatsapp" class="text-2xl" />
          </a>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-sm font-semibold text-heading mb-1">Direct Link</p>
        <div
          class="relative flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center"
        >
          {#if showToast}
            <div
              class="absolute -top-8 transform -translate-x-1/2 left-1/2 bg-gray-800 text-white py-1 px-3 rounded text-xs sm:text-sm"
            >
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
            <Icon icon="mingcute:copy-fill" class="text-md" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/each}
