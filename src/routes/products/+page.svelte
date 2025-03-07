<script>
  import Category from "$lib/components/Product/category.svelte";
  export let data;
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";
  import SEO from "$lib/components/SEO.svelte";
  let showButton = false;

  let key = data?.records
    .filter(
      (item) => item.productCount !== undefined && item.productCount !== null
    )
    .map((item) => item.name)
    .filter((value, index, self) => self.indexOf(value) === index);

  let metadata = {
    title:
      `Chemical Products | Product Categories | ${PUBLIC_WEBSITE_NAME} ` ||
      "Default Product Title",
    description:
      `Check Chemical Products , price, from our trusted manufactures.Order now and get for discounted price.` ||
      "Default product description",
    keywords: `${key}` || "default, product, keywords",
    urlPath: `${PUBLIC_WEBSITE_URL}/products` || "Default URl",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Chemical Products | Product Categories | ${PUBLIC_WEBSITE_NAME}`,
      description:
        `Check Chemical Products ,price, from our trusted manufactures.Order now and get for discounted price.` ||
        "Default product description",
      url: `${PUBLIC_WEBSITE_URL}/products`,
      brand: {
        "@type": "Brand",
        name: `${PUBLIC_WEBSITE_NAME}`,
      },
    },
  };

  // console.log("meta data --->", metadata);

  const handleScroll = () => {
    showButton = window.scrollY > 20;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  let showTooltip = false;
  function handleMouseEnter() {
    showTooltip = true;
  }
  function handleMouseLeave() {
    showTooltip = false;
  }
</script>

<SEO {metadata} />
<div>
  <div class="pt-2 max-w-7xl md:w-11/12 mx-auto">
    <div
      class="fixed z-30 md:bottom-[75px] bottom-40 right-0 lg:right-10 py-6 lg:p-4"
    >
      <button
        class="flex items-center justify-center rounded py-0.3 bg-primary-400 text-white md:mr-14 lg:mr-0 shadow-md"
        on:click={scrollToTop}
        class:hidden={!showButton}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
      >
        <div class="flex flex-col items-center">
          <Icon icon="tdesign:chevron-up" width="20" height="20" />
          <span class="px-1.5 text-xs pb-0.5">TOP</span>
        </div>
      </button>
      {#if showTooltip}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-transparent text-black font-medium py-1 rounded-md shadow-lg sm:text-sm text-[10px] px-4"
          on:click={scrollToTop}
          class:hidden={!showButton}
        >
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-transparent"
          ></div>
        </div>
      {/if}
    </div>
  </div>
  <Category {data} />
</div>
