<script>
  import ForgotPassword from "$lib/components/ForgotPassword.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title:
      `Forgot Password | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    urlPath: `${PUBLIC_WEBSITE_URL}/forgot` || "Default URl",
  };
</script>

<SEO {metadata} />
<div class="min-h-screen overflow-hidden bg-gradient-to-br from-primary-200 via-primary-50 to-primary-400 relative">
  <div class="absolute top-0 left-0 w-full text-primary-500  bg-white flex items-center md:justify-start justify-center">
    <span class="text-2xl font-extrabold md:ml-6 py-4">Chemikart</span>
  </div>
  <div class="absolute top-1/4 left-10 lg:w-72 w-8 lg:h-80 h-8 bg-primary-200/20 blur-sm clip-hexagon shadow-md"></div>
  <div class="absolute lg:bottom-20 bottom-5 right-1 lg:right-10 w-20 h-20 bg-primary-800/10 clip-hexagon"></div>
  <div class="absolute top-0 md:right-10 right-20 md:w-80 w-8 md:h-80 h-8 bg-primary-400/10 clip-hexagon"></div>
<ForgotPassword />
</div>


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