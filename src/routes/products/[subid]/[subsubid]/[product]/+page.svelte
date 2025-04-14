<script>
  import SEO from "$lib/components/SEO.svelte";
  import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
  import RelatedProductss from "$lib/components/RelatedProductss.svelte";
  import CompSimItems from "$lib/components/CompSimItems.svelte";
  import Properties from "$lib/components/ProductInfoPopups/Properties.svelte";
  import Description from "$lib/components/ProductInfoPopups/Description.svelte";
  import { PUBLIC_WEBSITE_URL, PUBLIC_WEBSITE_NAME } from "$env/static/public";
  import { isFavoriteStore } from "$lib/stores/favorites.js";
  import { tick } from "svelte";
  export let data;
  import { page } from '$app/stores';
  // console.log("Data  ==>(:", data);

  $: tick().then(() => {
    isFavoriteStore.set(data.isFavorite);
  });

  function generateProgressiveStrings(input) {
  if (input.length < 5) {
    return input; 
  }
  const progressiveSlices = Array.from({ length: input.length - 4 }, (_, index) => {
    return input.slice(0, index + 5); 
  });
  const filteredSlices = progressiveSlices.filter(item => !item.endsWith('-'));
  return filteredSlices.join(', ');
}   

  let url = $page.url.pathname; 
  let urlArray = url.split('/');

  let productData = data?.productData?.records[0];
  
  let relatedProductsNames = data.relatedProducts?.map((item) => {
  return `Buy ${productData?.manufacturer?.name} ${item.productName} ${item.productNumber}.`;
  }).join(' ');

  // console.log("relatedProductsNames", relatedProductsNames);

  let categoryUrl = urlArray[(urlArray.length)-3];
  let subCategoryUrl = urlArray[(urlArray.length)-2];
  let sliceNum = data?.productData?.records[0]?.productNumber;
  const slicedNumber = generateProgressiveStrings(sliceNum);
  
  let metadata = {
    title:
      `${productData?.productName} | ${productData?.manufacturer?.name} | ${PUBLIC_WEBSITE_NAME} ` ||
      `${PUBLIC_WEBSITE_NAME}`,
    description:
      `Order ${productData?.manufacturer?.name} manufacturers ${productData?.productName} partnumber online at ${PUBLIC_WEBSITE_NAME}.` ||
      "Default product description",
    keywords:
      `${slicedNumber},${productData?.manufacturer?.name}, ${productData?.productName},${productData?.description},${relatedProductsNames}` ||
      "default, product, keywords",
    urlPath:
      `${PUBLIC_WEBSITE_URL}/products/${categoryUrl}/${subCategoryUrl}/${productData?.productNumber}` ||
      `${PUBLIC_WEBSITE_URL}`,
    image: productData?.imageSrc,
    // ? `${PUBLIC_COMPBUY_IMAGE_PATH}/part/${data.componentData.image}`
    // 	: '/partskeys.jpeg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      name:
        `${productData?.productName} | ${productData?.manufacturer?.name} | ${PUBLIC_WEBSITE_NAME} ` ||
        `${PUBLIC_WEBSITE_NAME}`,
      description:
        `Order ${productData?.manufacturer?.name} manufacturers ${productData?.productName} partnumber online at ${PUBLIC_WEBSITE_NAME}.` ||
        "Default product description",
      url:
        `${PUBLIC_WEBSITE_URL}/products/${categoryUrl}/${subCategoryUrl}/${productData?.productNumber}` ||
        `${PUBLIC_WEBSITE_URL}`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />

<ProductDetails
  data={data.productData}
  isauthedUser={data.authedUser}
  profile={data.profile}
/>
{#if data.relatedProducts.length > 1}
  <RelatedProductss
    relatedProducts={data.relatedProducts}
    data={data.productData}
    profile={data.profile}
  />
{/if}
{#if data.productData.length !== 0}
  <Properties data={data.productData} />
{/if}
{#if data.productData.length !== 0}
  <Description data={data.productData} />
{/if}
{#if data.compareSimilarity.length > 1}
  <CompSimItems
    compareSimilarity={data.compareSimilarity}
    data={data.productData}
    profile={data.profile}
  />
{/if}
