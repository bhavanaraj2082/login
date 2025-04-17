<script>
    import SingleNews from "$lib/components/NewsRoom/singleNews.svelte";
    export let data;
    import SEO from "$lib/components/SEO.svelte";
    import {
      PUBLIC_WEBSITE_URL,
      PUBLIC_COMPBUY_IMAGE_PATH,
      PUBLIC_WEBSITE_NAME,
    } from "$env/static/public";
 
    let keyword = data?.singleNewsData?.Keyword || "";
    let title = data?.singleNewsData?.title || "";
    
    let metadata = {
      title: `${title} | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
      description:
        `Find and read the latest news on chemical ingredients and industry events and get the latest updates on what's happening at ${PUBLIC_WEBSITE_NAME}.` ||
        "Default description",
      keywords: `${keyword} chemical news, chemical industry, press releases, Chemical Ingredient Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, chemical ingredients, chemical compounds, chemical products, Chemicals in online, chemical ingredient distributor, chemical ingredient distributors, chemical compound, buy chemical ingredients, buy chemical compounds`,
      urlPath: `${PUBLIC_WEBSITE_URL}/newsroom` || "Default URl",
      schema: {
        "@context": "https://schema.org",
        "@type": "Webpage",
        name: `${PUBLIC_WEBSITE_NAME}: Newsroom` || "Default Product Title",
        description:
          `Find and read the latest news on chemical ingredients and industry events and get the latest updates on what's happening at ${PUBLIC_WEBSITE_NAME}.` ||
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
  <SingleNews {data} />