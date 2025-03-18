<script>
  import Orderstatus from "$lib/components/OrderStatus/Orderstatus.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `Order History | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
  };
</script>

<SEO {metadata} />

<Orderstatus />
