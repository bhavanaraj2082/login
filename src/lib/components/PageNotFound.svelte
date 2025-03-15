<script>
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  export let message;
  $: currentPath = $page.url.pathname;
  $: isProductPage = currentPath.includes("/products/");
</script>

<div
  class="min-h-[80%] overflow-hidden bg-gray-50 relative max-w-7xl mx-auto md:mb-20"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 90">
    <text x="300" y="85" font-family="Pacifico, cursive" font-size="100" font-weight="bold" text-anchor="middle" fill="#fe5939">404</text>
    <circle r="10" fill="#f9fafb"  cx="240" cy="30"></circle>
    <circle cx="230" r="9" fill="#f9fafb"  cy="60"></circle>
    <circle cy="40" r="9" fill="#f9fafb"  cx="280"></circle>
    <circle cx="310" r="10" fill="#f9fafb"  cy="60"></circle>
    <circle cx="350" cy="50" r="8" fill="#f9fafb" ></circle>
    <circle cy="50" r="10" fill="#f9fafb"  cx="350"></circle>
    <circle r="12" fill="#f9fafb"  cx="330" cy="30"></circle>
    <circle cy="30" r="9" fill="#f9fafb"  cx="370"></circle>
    <circle cx="380" r="10" fill="#f9fafb"  cy="80"></circle>
  </svg>
  <div
    class="absolute top-1/4 left-10 lg:w-72 w-20 lg:h-80 h-20 bg-primary-100 blur-sm clip-hexagon shadow"
  ></div>
  <div
    class="absolute bottom-2 right-40 lg:w-40 w-20 lg:h-40 h-20 bg-primary-100 clip-hexagon"
  ></div>
  <div
    class="absolute top-0 md:right-20 right-6 w-20 h-20 bg-primary-200 clip-hexagon"
  ></div>
  <div
    class="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10"
  >
    <div class=" p-8 max-w-lg w-full mx-auto">
      <div class="text-center">
        <!-- <div class="flex justify-center mb-6">
          <div class="h-28 w-28 bg-primary-100 rounded-full flex items-center justify-center shadow-md">
            <Icon icon="fluent:globe-prohibited-20-filled" class="text-7xl text-red-500 font-bold" />
          </div>
        </div> -->
        <h1
          class="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 text-black animate-slow-bounce"
        >
          Oops..!
        </h1>
        <div class="flex justify-center items-center whitespace-nowrap">
          <!-- <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 text-primary-300 animate-pulse">
            404
          </h1> -->
          <h2 class="text-2xl font-bold mb-3 ml-4 capitalize text-gray-800">
            {#if isProductPage}
              {message}
            {:else}
              Page Not Found
            {/if}
          </h2>
        </div>
        <p
          class="lg:text-base md:text-base sm:text-base text-sm font-medium mb-6 text-gray-600 max-w-md mx-auto"
        >
          The {#if isProductPage} product {:else} page {/if} you are looking for may be temporarily unavailable. Please
          check back later
        </p>
        <div class="flex justify-center z-50">
          <a
            href="/"
            class="inline-flex bg-primary-500 sm:text-base text-xs text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors duration-300"
          >
            <Icon icon="mdi:home" class="text-xl mr-2" />
            <span class="text-sm">Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .clip-hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
</style>
