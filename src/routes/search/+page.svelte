<script>
  export let data;
  import ProductSearch from "$lib/components/HeaderDropdownCart/ProductSearch.svelte";

  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title:
      `Chemicals Search | ${PUBLIC_WEBSITE_NAME} ` || "Default Product Title",
    description:
      `Find Chemical products ,price, from trusted manufactures.Order now and get for discounted price.` ||
      "Default product description",
    keywords:
      `${PUBLIC_WEBSITE_NAME}, Search Chemicals` ||
      "default, product, keywords",
  };
</script>

<SEO {metadata} />
<div>
  <ProductSearch {data} />
</div>
