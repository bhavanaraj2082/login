<script>
  export let data;
  import { PUBLIC_COMPBUY_IMAGE_PATH } from "$env/static/public";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  const { singleNewsData } = data; // Extract single news data

  let isExpanded = false;
  let showReadMoreButton = false;
  const wordLimit = 100;

  onMount(() => {
    // Check if the text is long enough to need truncation
    if (singleNewsData && singleNewsData.previewText) {
      showReadMoreButton =
        singleNewsData.previewText.split(" ").length > wordLimit;
    }

    // Scroll to top of page when component mounts
    window.scrollTo(0, 0);
  });

  function truncateText(text, wordLimit) {
    if (!text) return "";

    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  function toggleExpand() {
    isExpanded = !isExpanded;

    // If expanding, wait a moment then scroll to ensure all content is visible
    if (isExpanded) {
      setTimeout(() => {
        const aboutSection = document.getElementById("about-section");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-4">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="p-6 md:p-8">
      <div class="mb-6">
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <Icon icon="uil:calendar-alt" class="mr-1" width="16" height="16" />
          <span>{formatDate(singleNewsData.createdAt)}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-700 leading-tight">
          {singleNewsData.title || "News Title"}
        </h1>
      </div>

      <hr class="border-gray-200 my-6" />

      <div class="flex flex-col md:flex-row items-start">
        <div class="md:w-3/4 pr-4">
          <div class="text-base text-gray-700 leading-relaxed">
            {#if isExpanded}
              <p class="text-justify">{singleNewsData.previewText || ""}</p>
            {:else}
              <p class="text-justify">
                {truncateText(singleNewsData.previewText || "", wordLimit)}
              </p>
            {/if}

            {#if showReadMoreButton}
              <button
                class="text-primary-500 font-medium hover:text-primary-600 hover:underline mt-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                on:click={toggleExpand}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            {/if}
          </div>
        </div>

        <div class="md:w-1/4 md:pl-2 mt-4 md:mt-0 flex-shrink-0">
          <div class="w-full h-48 md:h-40">
            <img
              src={`${PUBLIC_COMPBUY_IMAGE_PATH}/prod/${singleNewsData.image}`}
              onerror="this.src='/fallback.webp'"
              alt={singleNewsData.title || "News image"}
              class="w-full h-full object-cover rounded-lg shadow"
            />
          </div>
        </div>
      </div>

      <!-- Content that will show below the image when expanded -->
      {#if isExpanded}
        <div class="mt-6 text-justify text-gray-700">
          <p class="mb-3">
            {singleNewsData.fullContent || ""}
          </p>
        </div>
      {/if}

      <div class="mt-8" id="about-section">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">
          About Chemikart
        </h2>
        <p class="text-gray-600">
          At Chemikart, our mission is to provide high-quality chemical products
          with unparalleled service. We aim to be the trusted partner for
          industries by delivering reliable solutions that meet our customers'
          needs efficiently and safely.
        </p>
        <p class="text-gray-600 mt-3">
          We envision a world where businesses thrive with access to premium
          chemical products and services. Our goal is to be the leading
          distributor in the chemical industry, known for our commitment to
          excellence and innovation.
        </p>
        <p class="text-gray-600 mt-3">
          Our knowledgeable team can assist you in selecting the right products
          for your applications. We pride ourselves on our consistent supply
          chain and timely deliveries. We offer tailored solutions to meet the
          specific requirements of our clients.
        </p>

        <div class="mt-4">
          <span class="text-gray-700">Follow us:</span>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <a
              href="https://chemikart.partskeys.com/"
              class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chemikart.com
            </a>
            <span class="text-gray-400">•</span>
            <a
              href="https://www.facebook.com/chemikart"
              class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <span class="text-gray-400">•</span>
            <a
              href="https://x.com/chemikart"
              class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <span class="text-gray-400">•</span>
            <a
              href="https://www.instagram.com/chemikart/"
              class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <span class="text-gray-400">•</span>
            <a
              href="https://www.linkedin.com/chemikart?_l=en_US"
              class="text-primary-500 hover:text-primary-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-gray-200">
        <a
          href="/newsroom"
          class="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          <Icon icon="mdi:arrow-left" class="mr-1" width="20" height="20" />
          <span>Back to Newsroom</span>
        </a>
      </div>
    </div>
  </div>
</div>
