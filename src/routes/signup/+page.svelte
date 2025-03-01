<script>
  import Signup from "$lib/components/SignupSigninComps/Signup.svelte";
  import { authedUser } from "$lib/stores/mainStores.js";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  console.log($authedUser.email);

  let metadata = {
    title: `SignUp | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    urlPath: `${PUBLIC_WEBSITE_URL}/signup` || "Default URl",
  };
</script>

<SEO {metadata} />
<Signup />