<script>
  import MyCart from "$lib/components/DashboardPage/MyCart.svelte";
  export let data;
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `My Cart | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
  };
</script>

<SEO {metadata} />

<div class="bg-gray-50">
  <MyCart {data} />
</div>