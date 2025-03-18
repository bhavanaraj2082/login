<script>
  import { page } from "$app/stores";
  import { PUBLIC_WEBSITE_URL } from "$env/static/public";
  import Icon from "@iconify/svelte";
  import Error404 from "$lib/components/PageNotFound.svelte";
  import Error503 from "$lib/components/ServiceUnavilable.svelte";

  $: status = $page.status;
  $: message =
  $page.error?.message || "Something went wrong. Please try again later.";
  // console.log(message,"message");
  console.log("Page error:", $page.error);
</script>

{#if status === 404}
  <Error404 {message} />
{:else if status === 503}
  <Error503 />
{:else}
  <div class="min-h-[80vh] bg-gray-50 relative max-w-7xl mx-auto mb-12 py-16 px-4">
    <div class="absolute top-1/4 md:left-10 left-2 lg:w-72 w-20 lg:h-80 h-20 bg-primary-100 blur-sm clip-hexagon shadow-xl animate-pulse"></div>
    <div class="absolute bottom-2 md:right-12 right-4 lg:w-40 w-20 lg:h-40 h-20 bg-primary-100 clip-hexagon shadow-xl animate-pulse"></div>
    <div class="absolute top-0 md:right-20 right-4 md:w-20 w-10 md:h-20 h-10 mt-3 bg-primary-100 clip-hexagon shadow-lg animate-pulse"></div>
    <div class="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="w-full max-w-5xl mx-auto">
        <div class="flex flex-col md:flex-row items-center">
          <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img
              src="/error.webp"
              alt="Connection Error"
              class="w-8/12 h-auto"/>
          </div>
          <div class="w-full md:w-1/2 flex flex-col md:pl-8 text-center md:text-left">
            <div class="mb-1">
              <p class="text-4xl font-extrabold text-black tracking-wide animate-bounce">
                Oops!
              </p>
              <span class="whitespace-nowrap md:text-2xl text-md font-semibold mt-2 text-gray-800">
                  Something Went Wrong
                </span>
            </div>
            <div class="md:text-xl text-sm font-bold mb-6">
              <span class="text-red-500">{status} - Internal Server Error</span>
            </div>
            <p class="md:text-lg text-sm text-gray-700 mb-6 text-justify">
              Sorry, something went wrong. Please try again later. If the issue
              persists, contact support.
            </p>
            <div class="mb-8">
              <p class="text-md text-gray-600 font-semibold">
                In the meantime, you can:
              </p>
              <ul class="md:list-disc pl-5 text-gray-700 md:text-md text-sm text-justify">
                <li>
                  Visit our 
                  <a href="/products" class="text-primary-600 hover:underline font-semibold">
                    Products Page</a>
                </li>
                <li>Go back to the homepage</li>
              </ul>
            </div>
            <p class="text-gray-700 mb-4 sm:text-lg text-xs">
              Thank you for your understanding !
            </p>
            <p class="font-semibold mb-6 text-gray-800">- The Chemikart Team</p>
            <div class="flex md:justify-start justify-center md:items-center">
              <a
                href={PUBLIC_WEBSITE_URL}
                class="inline-flex items-center text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white sm:text-base text-sm font-medium sm:py-3 py-2 sm:px-8 px-4 mb-4 rounded-full shadow hover:bg-primary-600 transition-all duration-500 transform hover:scale-105">
                <Icon icon="mdi:home" class="text-xl mr-2" />
                <span class="text-sm">Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}