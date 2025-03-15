<script>
  import CopyRightConsent from "$lib/components/CopyRightConsent.svelte";
  export let data;
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `Copyright Consent | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
  };
</script>


<SEO {metadata} />
<CopyRightConsent {data} />
