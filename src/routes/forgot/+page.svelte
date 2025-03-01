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
<ForgotPassword />