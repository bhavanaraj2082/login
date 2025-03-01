<script>
  import Feedback from "$lib/components/Feedback.svelte";
  import { urlHistory } from "$lib/stores/feedStore.js";
  import { prev } from "$lib/stores/feedStore.js";
  import { onMount } from "svelte";
  import { expoOut } from "svelte/easing";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";
  export let data;
  console.log("page data", data);

  let previousUrls;
  onMount(() => {
    const unsubscribe = urlHistory.subscribe((history) => {
      if (history.length > 1) {
        previousUrls = history[history.length - 1];
        //   console.log("previousUrls in onMount (multiple history):", previousUrls);
      } else if (history.length === 1) {
        previousUrls = history[0];
        //   console.log("previousUrls in onMount (single history):", previousUrls);
      } else {
        previousUrls = "/feedback";
      }
      prev.set(previousUrls);
    });
    return () => unsubscribe();
  });

  let metadata = {
    title: `Feedback | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
    description:
      `${PUBLIC_WEBSITE_NAME} is an industry leader in the distribution of quality, chemical products - committed to product availability, service and performance.` ||
      "Default description",
    keywords: `${PUBLIC_WEBSITE_NAME}, chemical products Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
    urlPath: `${PUBLIC_WEBSITE_URL}/feedback` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Webpage",
      name: `Why Register | ${PUBLIC_WEBSITE_NAME}` || "Default Product Title",
      description:
        `${PUBLIC_WEBSITE_NAME} is an industry leader in the distribution of quality, chemical products - committed to product availability, service and performance.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/feedback`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };
</script>

<SEO {metadata} />
<Feedback {data} />