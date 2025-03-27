<script>
  import Subcategory from "$lib/components/Product/subcategory.svelte";
  export let data;
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";
  import SEO from "$lib/components/SEO.svelte";
    import { onMount } from "svelte";

  let catName = data?.records[0]?.category?.name;
  let catUrl = data?.records[0]?.category?.urlName;

  let key = data?.records
    .map((item) => item.name)
    .filter((value, index, self) => self.indexOf(value) === index);

  onMount(()=>{
    localStorage.removeItem("specs")
  })
  let metadata = {
    title: `${catName} | ${PUBLIC_WEBSITE_NAME} ` || "Default Product Title",
    description:
      `Check ${catName} products online at ${PUBLIC_WEBSITE_NAME}.` ||
      "Default product description",
    keywords: `${catName}, ${key}` || "default, product, keywords",
    urlPath: `${PUBLIC_WEBSITE_URL}/products/${catUrl}` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${catName} | ${PUBLIC_WEBSITE_NAME} ` || "Default Product Name",
      description:
        `Check ${catName} products online at ${PUBLIC_WEBSITE_NAME}.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/products/${catUrl}` || "Default URl",
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />
<div class="pt-2">
  <Subcategory {data} />
</div>