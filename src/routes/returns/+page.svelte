<script>
  import Returns from "$lib/components/Returns.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `Returns | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
  };
</script>

<SEO {metadata} />
<section class="bg-gray-50 py-2">
	<div class="px-4 lg:w-11/12 mx-auto">
		<Returns />
	</div>
</section>
