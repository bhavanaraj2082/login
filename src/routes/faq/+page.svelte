<script>
  import FAQupdated from "$lib/components/FAQupdated.svelte";

  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  let metadata = {
    title: `${PUBLIC_WEBSITE_NAME}: FAQ` || "Default Product Title",
    description:
      `Frequently asked question's in ${PUBLIC_WEBSITE_NAME}.` ||
      "Default product description",
    keywords: `${PUBLIC_WEBSITE_NAME},FAQ, faq, chemical product distributor`,
    urlPath: `${PUBLIC_WEBSITE_URL}/faq` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Webpage",
      name: `${PUBLIC_WEBSITE_NAME}: FAQ` || "Default Product Title",
      description:
        `Frequently asked question's in ${PUBLIC_WEBSITE_NAME}.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/faq`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />
<FAQupdated />