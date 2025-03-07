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
<Signin />