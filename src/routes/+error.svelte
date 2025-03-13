<script>
    import { page } from '$app/stores';
    import { PUBLIC_WEBSITE_URL } from '$env/static/public';
    import Icon from '@iconify/svelte';
    import Error404 from '$lib/components/PageNotFound.svelte';
    import Error503 from '$lib/components/ServiceUnavilable.svelte';
    
    $: status = $page.status;
    $: message = $page.error?.message || "Something went wrong. Please try again later.";
    
    // console.log("Page error:", $page.error);
  </script>
  
  {#if status === 404}
    <Error404 />
  {:else if status === 503}
    <Error503 />
  {:else}
  <div class="min-h-screen overflow-hidden bg-gray-50 relative">
    <div class="absolute top-1/4 md:left-10 left-2 lg:w-72 w-20 lg:h-80 h-20 bg-primary-100 blur-sm clip-hexagon shadow"></div>
    <div class="absolute bottom-2 md:right-12 right-4 lg:w-40 w-20 lg:h-40 h-20 bg-primary-100 clip-hexagon"></div>
    <div class="absolute top-0 md:right-12 right-4 md:w-20 w-10 md:h-20 h-10 bg-primary-200 clip-hexagon"></div>
    <div class="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="w-full max-w-5xl mx-auto">
        <div class="p-2 md:p-4">
          <div class="flex flex-col md:flex-row items-center">
            <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
              <img src="/error.webp" alt="Connection Error" class="w-8/12 h-auto" />
            </div>
            <div class="w-full md:w-1/2 flex flex-col md:pl-8 text-center md:text-left">
              <div class="mb-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 ">
                    Oops! 
                </p>
                <span class="whitespace-nowrap text-md font-semibold mt-2">
                    Something Went Wrong
                </span>
              </div>
              <div class="text-xl md:text-2xl font-semibold text-gray-600 mb-4">
                <span class="text-red-600">{status}- Internal Server Error</span>
              </div>
              <p class="text-sm md:text-lg text-gray-700 mb-4">
                Sorry, something went wrong. Please try again later. If the issue persists, contact support
              </p>
              <div class="mb-5">
                <p class="text-md text-gray-700">In the meantime, you can:</p>
                <ul class="sm:list-disc pl-5 text-gray-700 text-sm md:text-md ">
                    <li>Visit our <a href='/products' class="text-primary-600 hover:underline font-medium">Products Page</a></li>
                    <li>Go back to the homepage</li>
                </ul>
              </div>
              <p class="text-gray-700 mb-4 sm:text-lg text-xs">Thank you for your understanding!</p>
              <p class="font-semibold mb-6">- The Chemikart Team</p>
              <div>
                <a href={ PUBLIC_WEBSITE_URL } class="inline-flex text-center  bg-primary-500 text-white sm:text-base text-sm font-medium  sm:py-3 py-2 sm:px-8 px-4 mb-4 rounded-full hover:bg-primary-600 transition-colors duration-600">
                  <Icon icon="mdi:home" class="text-xl mr-2" /> Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/if}
  
  <style>
    .clip-hexagon {
      clip-path: polygon(
        50% 0%,
        100% 25%,
        100% 75%,
        50% 100%,
        0% 75%,
        0% 25%
      );
    }
  </style>