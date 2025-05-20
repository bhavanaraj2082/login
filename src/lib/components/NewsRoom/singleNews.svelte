<script>
  export let data;
  import { PUBLIC_COMPBUY_IMAGE_PATH } from "$env/static/public";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  const { singleNewsData } = data;

  $: record = singleNewsData; 

  let isExpanded = false;
  let shouldShowToggle = false;
  const WORD_LIMIT = 100;

  onMount(() => {
    if (record && record.previewText) {
      // shouldShowToggle = record.previewText.split(/\s+/).length > WORD_LIMIT;
        const words = record.previewText.replace(/<[^>]*>/g, '').split(/\s+/);
      shouldShowToggle = words.length > WORD_LIMIT;
    }

    window.scrollTo(0, 0);
  });

  function truncateText(text, wordLimit) {
    if (!text) return "";
    const words = text.split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  }

  function toggleExpand() {
    isExpanded = !isExpanded;

    if (!isExpanded) {
      // When collapsing, scroll back to the top of the content
      setTimeout(() => {
        const contentTop = document.getElementById("news-content-top");
        if (contentTop) {
          contentTop.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return "";
    }
  }

  function getImageUrl(image) {
    if (!image) return '/fallback.webp';
    return image.includes('/')
      ? image
      : `${PUBLIC_COMPBUY_IMAGE_PATH}/prod/${image}`;
  }
</script>

<div class="max-w-7xl mx-auto px-4 py-2 lg:w-11/12">
  {#if record}
    <div class="bg-white rounded-md shadow-md overflow-hidden mb-6" id="news-content-top">
      <div class="p-6 md:p-8">
        <div class="mb-6">
          <div class="flex items-center sm:text-sm text-xs text-gray-500 mb-2">
            <Icon icon="uil:calendar-alt" class="mr-1" width="16" height="16" />
            <time datetime={record.createdAt}>
              {formatDate(record.createdAt)}
            </time>
          </div>
          <h1 class="text-xl font-semibold md:text-2xl md:font-bold text-gray-700 leading-tight overflow-x-auto hide">
            {record.title || "News Title"}
          </h1>
        </div>

        <hr class="border-gray-200 my-6" />

        <div class="relative">
          <div class="float-right ml-6 mb-4 rounded-lg overflow-hidden shadow-sm w-full md:w-1/4 max-w-xs h-40">
            <img
              src={getImageUrl(record.image)}
              alt={record.title || "News image"}
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onerror="this.onerror=null; this.src='/fallback.webp'" />
          </div>
          <div class="prose max-w-none">
            {#if record.previewText}
              <div class="text-gray-700 leading-relaxed sm:text-base text-xs">
                {#if shouldShowToggle}
                  {#if isExpanded}
                    <p class="text-justify">{@html record.previewText}</p>
                  {:else}
                    <p class="text-justify">
                      {@html truncateText(record.previewText, WORD_LIMIT)}
                    </p>
                  {/if}
                  <button
                    class="text-primary-500 font-medium hover:text-primary-600 hover:underline mt-2 flex items-center focus:outline-none rounded"
                    on:click={toggleExpand}
                    aria-expanded={isExpanded}>
                    <span>{isExpanded ? "Read less" : "Read more"}</span>
                    <Icon 
                      icon={isExpanded ? "ph:caret-up" : "ph:caret-down"} 
                      class="ml-1" 
                      width="16" 
                      height="16"/>
                  </button>
                {:else}
                  <p class="text-justify">{@html record.previewText}</p>
                {/if}
              </div>
            {:else}
              <p class="text-gray-500 italic">No content available for this article.</p>
            {/if}
          </div>
          <div class="clear-both"></div>
        </div>
        {#if isExpanded && record.fullContent}
          <div class="mt-6 text-justify text-gray-700 sm:text-base text-xs">
            <p class="mb-3">
              {record.fullContent}
            </p>
          </div>
        {/if}
        <div class="mt-8 sm:text-base text-xs" id="about-section">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">
            About Chemikart
          </h2>
          <p class="text-gray-600 text-justify">
            At Chemikart, our mission is to provide high-quality chemical products
            with unparalleled service. We aim to be the trusted partner for
            industries by delivering reliable solutions that meet our customers'
            needs efficiently and safely.
          </p>
          <p class="text-gray-600 mt-3 text-justify">
            We envision a world where businesses thrive with access to premium
            chemical products and services. Our goal is to be the leading
            distributor in the chemical industry, known for our commitment to
            excellence and innovation.
          </p>
          <p class="text-gray-600 mt-3 text-justify">
            Our knowledgeable team can assist you in selecting the right products
            for your applications. We pride ourselves on our consistent supply
            chain and timely deliveries. We offer tailored solutions to meet the
            specific requirements of our clients.
          </p>
          <div class="mt-4 sm:text-base text-xs">
            <span class="text-gray-700">Follow us:</span>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <a href="https://chemikart.partskeys.com/"
                class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer">
                Chemikart.com
              </a>
              <span class="text-gray-400">•</span>
              <a href="https://www.facebook.com/chemikart"
                class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer">
                Facebook
              </a>
              <span class="text-gray-400">•</span>
              <a href="https://x.com/chemikart"
                class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer">
                Twitter
              </a>
              <span class="text-gray-400">•</span>
              <a href="https://www.instagram.com/chemikart/"
                class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer">
                Instagram</a>
              <span class="text-gray-400">•</span>
              <a href="https://www.linkedin.com/chemikart?_l=en_US"
                class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-6 border-t border-gray-200">
          <a
            href="/newsroom"
            class="group inline-flex items-center sm:text-base text-xs gap-2 px-4 py-2 text-white bg-primary-400 font-semibold rounded-md shadow transition-all duration-200 ease-in-out hover:text-primary-50 hover:bg-primary-500 focus:outline-none " >
            <Icon icon="mdi:arrow-left" class="transition-transform duration-200 group-hover:-translate-x-1" width="20" height="20" />
            <span>Back to Newsroom</span>
          </a>
        </div>
      </div>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-lg p-8 text-center">
      <Icon icon="ph:newspaper-clipping" width="72" height="72" class="text-primary-500 mx-auto mb-4"/>
      <h2 class="text-lg font-semibold text-gray-800 mb-2">News article not found</h2>
      <p class="text-gray-600 mb-6 text-sm">The news article you're looking for is unavailable or may have been removed.</p>
      <a 
        href="/newsroom" 
        class="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200">
        <Icon icon="ph:arrow-left" class="mr-2" width="16" height="16"/>
        Return to News
      </a>
    </div>
  {/if}
</div>