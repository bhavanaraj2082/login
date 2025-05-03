<script>
  import MyQuotes from "$lib/components/DashboardPage/MyQuotes.svelte";
  export let data;
  console.log("Quotes====>", data);
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `My Quotes | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
  };
</script>

<SEO {metadata} />

<div class="bg-gray-50">
  <MyQuotes {data} />
</div>
