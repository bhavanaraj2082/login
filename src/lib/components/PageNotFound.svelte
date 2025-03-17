<script>
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  
  export let message;
  $: currentPath = $page.url.pathname;
  $: isProductPage = currentPath.includes("/products/");
</script>

<div class="min-h-[80vh] bg-gray-50 flex items-center justify-center overflow-hidden relative">
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-1/4 left-10 w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-200 opacity-40 animate-float"></div>
    <div class="absolute top-1/3 right-20 w-12 h-12 md:w-20 md:h-20 rounded-full bg-green-200 opacity-40 animate-float-delay"></div>
    <div class="absolute bottom-1/4 left-1/4 w-20 h-20 md:w-32 md:h-32 rounded-full bg-purple-200 opacity-40 animate-float-slow"></div>
    <div class="hidden md:block absolute bottom-0 right-0 w-32 h-64 bg-primary-100 opacity-30 rounded-t-3xl"></div>
    <div class="hidden md:block absolute bottom-10 right-10 w-6 h-6 bg-primary-300 opacity-50 rounded-full animate-bubble"></div>
    <div class="hidden md:block absolute bottom-20 right-14 w-4 h-4 bg-primary-300 opacity-50 rounded-full animate-bubble-delay"></div>
    <div class="hidden md:block absolute bottom-30 right-8 w-5 h-5 bg-primary-300 opacity-50 rounded-full animate-bubble-slow"></div>
    <svg class="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="3" fill="#fe5939"/>
      <circle cx="50" cy="30" r="3" fill="#fe5939"/>
      <circle cx="80" cy="20" r="3" fill="#fe5939"/>
      <circle cx="30" cy="60" r="3" fill="#fe5939"/>
      <circle cx="70" cy="60" r="3" fill="#fe5939"/>
      <circle cx="50" cy="80" r="3" fill="#fe5939"/>
      <line x1="20" y1="20" x2="50" y2="30" stroke="#fe5939" stroke-width="0.5"/>
      <line x1="50" y1="30" x2="80" y2="20" stroke="#fe5939" stroke-width="0.5"/>
      <line x1="50" y1="30" x2="30" y2="60" stroke="#fe5939" stroke-width="0.5"/>
      <line x1="50" y1="30" x2="70" y2="60" stroke="#fe5939" stroke-width="0.5"/>
      <line x1="30" y1="60" x2="50" y2="80" stroke="#fe5939" stroke-width="0.5"/>
      <line x1="70" y1="60" x2="50" y2="80" stroke="#fe5939" stroke-width="0.5"/>
    </svg>
  </div>
  <div class="max-w-2xl min-h-[80vh] w-full mx-auto px-4 py-8 md:pb-12 relative z-10">
    <div class=" bg-opacity-90  overflow-hidden">
      <div class="px-6 py-8 md:px-10 md:py-12">
        <div class="flex justify-center mb-8">
          <div class="h-20 w-20 md:h-24 md:w-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow transform rotate-45 animate-pulse">
            <div class="transform -rotate-45">
              <Icon icon="fluent:beaker-24-filled" class="text-4xl md:text-5xl text-white" />
            </div>
          </div>
        </div>
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">404</h1>
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800">
            {#if isProductPage}
              {message}
            {:else}
              Page Not Found
            {/if}
          </h2>
          <div class="max-w-md mx-auto bg-white/30 justify-center items-center p-4 mb-8 rounded-md shadow">
            <div class="text-gray-600 flex flex-col md:text-lg text-xs">
              <span class="md:text-lg text-xs">
                The {#if isProductPage} 
                <span class="font-semibold">Product</span> you are looking for may be temporarily unavailable..
                  {:else} 
                <span class="font-semibold">Page</span> you are looking is unavailable..
                {/if}  
              </span>
                <span class="pt-3">
                  Please check back later..! 
                </span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-center gap-4 sm:text-md text-xs">
            <a href="/" class="inline-flex items-center justify-center bg-gradient-to-r from-primary-400 to-primary-500 text-white font-medium py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Icon icon="mdi:flask" class="mr-2 text-xl" />
              <span>Back to Home</span>
            </a>
            <a href="/products" class="inline-flex items-center justify-center bg-white border-1 border-primary-400 text-gray-700 hover:text-white hover:bg-gradient-to-r from-primary-400 to-primary-500 hover:border-none font-medium py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Icon icon="simple-line-icons:chemistry" class="mr-2 text-xl" />
              <span>Browse Products</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes bubble {
    0% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-40px); opacity: 0.8; }
    100% { transform: translateY(-80px); opacity: 0; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delay {
    animation: float 7s ease-in-out 1s infinite;
  }
  
  .animate-float-slow {
    animation: float 8s ease-in-out 2s infinite;
  }
  
  .animate-bubble {
    animation: bubble 4s ease-in-out infinite;
  }
  
  .animate-bubble-delay {
    animation: bubble 5s ease-in-out 1s infinite;
  }
  
  .animate-bubble-slow {
    animation: bubble 6s ease-in-out 2s infinite;
  }
</style>