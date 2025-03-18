<script>
  import Qoutescomponents from "$lib/components/ChemikartQoutes/Qoutescomponents.svelte";
  import QoutesBeforeLogin from "$lib/components/ChemikartQoutes/QoutesBeforeLogin.svelte";
  export let data;
  // console.log(data.authedUser, "data in page");
  let isAuthedUserEmpty = Object.keys(data.authedUser ?? {}).length === 0;
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `Quotes | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    description:
      `${PUBLIC_WEBSITE_NAME} company profile, one of the fastest-growing chemical distributor in the world.` ||
      "Default product description",
    keywords: `${PUBLIC_WEBSITE_NAME}, Quotes, Quick, Order, chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
    urlPath: `${PUBLIC_WEBSITE_URL}/quotes` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Webpage",
      name: `Quotes | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
      description:
        `${PUBLIC_WEBSITE_NAME} company profile, one of the fastest-growing chemical distributors in the world.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/quotes`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>
<SEO {metadata} />
{#if isAuthedUserEmpty}
  <QoutesBeforeLogin />
{:else}
  <div class="pt-10 pb-5">
    <Qoutescomponents {data} />
  </div>
{/if}