<script>
  import Signup from "$lib/components/SignupSigninComps/Signup.svelte";
  import { authedUser } from "$lib/stores/mainStores.js";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  console.log($authedUser.email);

  let metadata = {
    title: `SignUp | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    urlPath: `${PUBLIC_WEBSITE_URL}/signup` || "Default URl",
  };
</script>

<SEO {metadata} />
<div class="min-h-screen overflow-hidden bg-gradient-to-br from-primary-400 via-primary-400 to-primary-200 relative">
  <div class="absolute top-0 left-0 w-full h-10 text-primary-500  bg-white flex items-center md:justify-start justify-center">
    <span class="text-2xl font-extrabold md:ml-6 py-4">Chemikart</span>
  </div>
  <div class="absolute top-1/4 left-2 w-72 h-80 md:bg-gray-white/30 bg-gray-200/10 blur-2xl clip-hexagon shadow-md"></div>
  <div class="absolute bottom-0 right-4 w-80 h-80 bg-primary-300/10 blur-2xl clip-hexagon"></div>
  <div class="absolute top-0 right-2 w-80 h-80 bg-primary-400/10 blur-2xl clip-hexagon"></div>  
<Signup />
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