<script>
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import Subsubcategory from "$lib/components/Product/subsubcategory.svelte";
  import Filter from "$lib/components/productsFilter/Filter.svelte";
  import { sendMessage } from "$lib/utils.js";
  import { allProducts } from "$lib/stores/filter.js";
  import ProductFilter from "$lib/components/ProductsFilter/ProductFilter.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";
  import SEO from "$lib/components/SEO.svelte";

  export let data;
  console.log(data.products, "object->");

  let catName = data?.products[0]?.categoryDetails?.name;
  let catUrl = data?.products[0]?.categoryDetails?.urlName;

  let SubCatName = data?.products[0]?.subCategoryDetails?.name;
  let SubCatUrl = data?.products[0]?.subCategoryDetails?.urlName;

  let keys = data?.products.flatMap((item) => {
    return [item.productName, item.productNumber];
  });

  $: ({ manufacturers, products, productCount, subSubCategory } = data);
  const handlePage = (e) => {
    invalidate("page:data");
  };

  let metadata = {
    title:
      `${catName} | ${SubCatName} | ${PUBLIC_WEBSITE_NAME} ` ||
      "Default Product Title",
    description:
      `Check ${catName} ${SubCatName} products online at ${PUBLIC_WEBSITE_NAME}.` ||
      "Default product description",
    keywords:
      `${catName},${SubCatName}, ${keys}` || "default, product, keywords",
    urlPath:
      `${PUBLIC_WEBSITE_URL}/products/${catUrl}/${SubCatUrl}` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      name:
        `${catName} | ${SubCatName} | ${PUBLIC_WEBSITE_NAME}` ||
        "Default Product Name",
      description:
        `Check ${catName} ${SubCatName} products online at ${PUBLIC_WEBSITE_NAME}.` ||
        "Default product description",
      url:
        `${PUBLIC_WEBSITE_URL}/products/${catUrl}/${SubCatUrl}` ||
        "Default URl",
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />
<section class="bg-gray-50 mb-5">
  <div class="px-4 max-w-7xl md:w-11/12 mx-auto">
    <!-- <Subsubcategory data={data.productdata} count={data.count} />-->
    <!-- <Filter {data} on:pageChange={handlePageChange} />  -->
    <ProductFilter
      on:onPageChange={(e) => handlePage(e)}
      {manufacturers}
      {products}
      {productCount}
      {subSubCategory}
    />
  </div>
</section>
