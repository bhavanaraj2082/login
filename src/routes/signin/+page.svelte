<script>
  import Signin from "$lib/components/SignupSigninComps/Signin.svelte";
  import SEO from '$lib/components/SEO.svelte';
  import { PUBLIC_WEBSITE_URL,PUBLIC_WEBSITE_NAME } from '$env/static/public';

  let metadata = {
    title: `Login | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    urlPath: `${PUBLIC_WEBSITE_URL}/signin` || "Default URl",
  };

</script>

<SEO {metadata} />

<!-- <Signin /> -->
<div class="min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-900 relative">
  <div class="absolute top-0 left-0 w-full h-12 text-primary-500  bg-white flex items-center md:justify-start justify-center">
    <span class="text-2xl font-extrabold md:ml-6 py-4"><a href="/">Chemikart</a></span>
  </div>
  <div class="absolute top-1/4 left-10 lg:w-72 w-8 lg:h-80 h-8 bg-primary-800/20 blur-sm clip-hexagon shadow-md"></div>
  <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-900/10 clip-hexagon"></div>
  <div class="absolute top-0 right-10 w-80 h-80 bg-primary-900/5 clip-hexagon"></div>
  <Signin />
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