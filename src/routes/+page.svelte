<script>
  import Footerlinkcomp from "$lib/components/Footerlinkcomp.svelte";
  import Herosection from "$lib/components/Herosection.svelte";
  import FeaturedLinks from "$lib/components/FeaturedLinks.svelte";
  import PopularProduct from "$lib/components/PopularComps/PopularProduct.svelte";
  import AboutSection from "$lib/components/AboutSection.svelte";
  import Email from "$lib/components/Email.svelte";
  export let data;

  import SEO from "$lib/components/SEO.svelte";
  import { PUBLIC_WEBSITE_URL, PUBLIC_WEBSITE_NAME } from "$env/static/public";

  let metadata = {
    title:
      `${PUBLIC_WEBSITE_NAME} | Chemical Product Distributor | 24/7 Order Online` ||
      "Default Product Title",
    description:
      `${PUBLIC_WEBSITE_NAME} distributor of Chemical Products with large selection in stock. Signup to check Discount on Products. Same day shipping with no minimum orders.` ||
      "Default product description",
    keywords:
      `${PUBLIC_WEBSITE_NAME} Chemical Distributor, Chemical Products, industrial chemicals, laboratory chemicals, ${PUBLIC_WEBSITE_NAME}, chemical supplies, Chemicals in online, chemical product distributor, chemical product distributors, chemical product, buy chemical product, buy chemical products, buy chemical product, buy chemical products` ||
      "default, product, keywords",
    urlPath: `${PUBLIC_WEBSITE_URL}` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Webpage",
      name:
        `${PUBLIC_WEBSITE_NAME} | Chemical Product Distributor | 24/7 Order Online` ||
        "Default Product Name",
      description:
        `${PUBLIC_WEBSITE_NAME} distributor of Chemical Products with large selection in stock. Signup to check Discount on Products. Same day shipping with no minimum orders.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
  let PopularProducts = data.PopularProductsData;
</script>

<SEO {metadata} />
<Herosection />
<FeaturedLinks />
<PopularProduct {PopularProducts} />
<AboutSection />
<Email />
{#if data.foolterLinksData.length > 0}
  <Footerlinkcomp footerData={data.foolterLinksData} />
{/if}
