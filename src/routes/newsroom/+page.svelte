<script>
  import NewsRoom from "$lib/components/NewsRoom/NewsRoom.svelte";
  export let data;

  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `${PUBLIC_WEBSITE_NAME}: Newsroom ` || "Default Product Title",
    description:
      `Find and read the latest news on chemical products and industry events and get the latest updates on what’s happening at ${PUBLIC_WEBSITE_NAME}.` ||
      "Default description",
    keywords: `${PUBLIC_WEBSITE_NAME}, engineering news, engineering competitions, press releases, chemical products Distributor, Authorized distributor,Chemical Distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
    urlPath: `${PUBLIC_WEBSITE_URL}/newsroom` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Webpage",
      name: `${PUBLIC_WEBSITE_NAME}: Newsroom` || "Default Product Title",
      description:
      `Find and read the latest news on chemical products and industry events and get the latest updates on what’s happening at ${PUBLIC_WEBSITE_NAME}.` ||
      "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/newsroom`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />
<NewsRoom {data} />
