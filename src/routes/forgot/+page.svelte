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
  <div class="absolute top-1/4 left-10 w-72 h-80 bg-primary-200/20 blur-sm clip-hexagon shadow-md"></div>
  <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-200/10 clip-hexagon"></div>
  <div class="absolute top-0 right-10 w-80 h-80 bg-primary-100/10 clip-hexagon"></div>
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