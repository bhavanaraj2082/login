<script>
  import { page } from "$app/stores";
  import SEO from "$lib/components/SEO.svelte";
  import {
    PUBLIC_WEBSITE_URL,
    PUBLIC_COMPBUY_IMAGE_PATH,
    PUBLIC_WEBSITE_NAME,
  } from "$env/static/public";

  $: pathSegments = $page.url.pathname.split("/");
  $: lastSegment = pathSegments[pathSegments.length - 1];
  $: formattedSegment = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  $: metadata = {
    title:
      `${formattedSegment} | Product Safety | ${PUBLIC_WEBSITE_NAME}` ||
      "Default Product Title",
  };
</script>

<SEO {metadata} />
<div class="w-11/12 mx-auto max-w-7xl pb-8">
  <h1 class="text-heading font-bold text-xl md:text-2xl ml-2.5">
    Product Safety
  </h1>
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/4 h-fit sm:mt-6 mt-3">
      <a
        href="/safety"
        class="block text-md mt-3 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r hover:scale-105"
        class:text-primary-500={$page.url.pathname === "/safety"}
        class:font-semibold={$page.url.pathname === "/safety"}
      >
        Product Safety
      </a>
      <hr class="border-b border-gray-200" />

      <a
        href="/safety/understanding-product-labels"
        class="block text-md mt-3 font-medium mb-2 hover:scale-105 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r"
        class:text-primary-500={$page.url.pathname ===
          "/safety/understanding-product-labels"}
        class:font-semibold={$page.url.pathname ===
          "/safety/understanding-product-labels"}
      >
        Understanding Product Labels
      </a>
      <hr class="border-b border-gray-200" />

      <a
        href="/safety/globally-harmonized-system"
        class="block text-md mt-3 font-medium mb-2 hover:scale-105 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r"
        class:text-primary-500={$page.url.pathname ===
          "/safety/globally-harmonized-system"}
        class:font-semibold={$page.url.pathname ===
          "/safety/globally-harmonized-system"}
      >
        Globally Harmonized System
      </a>
      <hr class="border-b border-gray-200" />

      <a
        href="/safety/tsca-8-notification"
        class="block text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r"
        class:text-primary-500={$page.url.pathname ===
          "/safety/tsca-8-notification"}
        class:font-semibold={$page.url.pathname ===
          "/safety/tsca-8-notification"}
      >
        TSCA 8 Notification
      </a>
      <hr class="border-b border-gray-200" />

      <a
        href="/safety/hazard-and-precautionary-statements"
        class="block text-md mt-3 hover:scale-105 font-medium mb-2 whitespace-normal text-black w-full text-left pl-3 cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 hover:border-l-4 hover:border-primary-400 hover:pl-2 hover:bg-primary-50 hover:rounded-r"
        class:text-primary-500={$page.url.pathname ===
          "/safety/hazard-and-precautionary-statements"}
        class:font-semibold={$page.url.pathname ===
          "/safety/hazard-and-precautionary-statements"}
      >
        Hazard & Precautions
      </a>
      <hr class="border-b border-gray-200" />
    </div>

    <div class="w-full md:w-3/4">
      {#if $page.url.pathname === "/safety"}
        <div class="container mx-auto sm:px-4 px-1 sm:py-8 py-1">
          <div class="mb-8">
            <h1 class="text-xl font-bold mb-6">Product Safety</h1>
            <p class="sm:text-sm text-xs text-justify text-heading mt-5">
              Our worldwide Product Safety staff is comprised of scientists with
              extensive backgrounds in global compliance regulations. We provide
              Safety Data Sheets with comprehensive safety and regulatory data
              to promote safe product usage and handling. Our SDS documents are
              always current and available in over 50 languages.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="p-6 rounded-lg shadow flex flex-col justify-center items-center hover:shadow-md"
            >
              <a
                href="/safety/understanding-product-labels"
                class="font-bold sm:text-lg text-sm mb-2 py-1 w-full text-left cursor-pointer flex flex-col transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
                class:text-primary-500={$page.url.pathname ===
                  "/safety/understanding-product-labels"}
                class:font-semibold={$page.url.pathname ===
                  "/safety/understanding-product-labels"}
              >
                <img
                  src="/productsafety/Understanding Product Labels.webp"
                  alt="Understanding Product Labels IMG"
                  class="mb-10 ml-1 w-52 rounded-md"
                />
                Understanding Product Labels
              </a>
              <p class="sm:text-sm text-xs text-justify text-heading">
                Our product labels are designed to provide complete, up-to-date
                information on our products. Information available when and
                where you need it most.
              </p>
            </div>

            <div
              class="p-4 rounded-lg shadow flex flex-col justify-center items-center hover:shadow-md"
            >
              <a
                href="/safety/globally-harmonized-system"
                class="font-bold sm:text-lg text-sm mb-2 py-1 w-full text-left cursor-pointer flex flex-col transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
                class:text-primary-500={$page.url.pathname ===
                  "/safety/globally-harmonized-system"}
                class:font-semibold={$page.url.pathname ===
                  "/safety/globally-harmonized-system"}
              >
                <img
                  src="/productsafety/GHS.webp"
                  alt="GHS IMG"
                  class="mb-10 ml-1 w-52 rounded-md"
                />
                Globally Harmonized System
              </a>
              <p class="sm:text-sm text-xs text-justify text-heading">
                GHS harmonizes most classification criteria for supply and
                transportation and is based on the intrinsic properties of
                substances. GHS allows individual countries or regions to
                implement building blocks at their own discretion.
              </p>
            </div>

            <div
              class="p-4 rounded-lg shadow flex flex-col justify-center items-center hover:shadow-md"
            >
              <a
                href="/safety/tsca-8-notification"
                class="font-bold sm:text-lg text-sm mb-2 py-1 w-full text-left cursor-pointer flex flex-col transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
                class:text-primary-500={$page.url.pathname ===
                  "/safety/tsca-8-notification"}
                class:font-semibold={$page.url.pathname ===
                  "/safety/tsca-8-notification"}
              >
                <img
                  src="/productsafety/TSCA.webp"
                  alt="TSCA IMG"
                  class="mb-10 ml-1 w-52 rounded-md"
                />
                TSCA 8 Notification
              </a>
              <p class="sm:text-sm text-justify text-xs text-heading">
                SDS provide essential information for anyone handling laboratory
                chemicals, including all of the dangerous and most non-dangerous
                products.
              </p>
            </div>

            <div
              class="p-4 rounded-lg shadow flex flex-col justify-center items-center hover:shadow-md"
            >
              <a
                href="/safety/hazard-and-precautionary-statements"
                class="font-bold sm:text-lg text-sm mb-2 py-1 w-full text-left cursor-pointer flex flex-col transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
                class:text-primary-500={$page.url.pathname ===
                  "/safety/hazard-and-precautionary-statements"}
                class:font-semibold={$page.url.pathname ===
                  "/safety/hazard-and-precautionary-statements"}
              >
                <!-- <img src="/productsafety/Hazard_Precaution.webp" alt="img" class="sm:mb-10 mb-5 ml-1 sm:ml-10 w-28 sm:mt-5 mt-0" /> -->
                <img
                  src="/productsafety/Hazard_Precaution.webp"
                  alt="Hazard_Precaution"
                  class="sm:mb-10 mb-5 w-52 rounded-md"
                />
                Hazard and Precautionary Statements
              </a>
              <p class="sm:text-sm text-justify text-xs text-heading">
                These statements provide critical guidance on hazards and proper
                precautions to ensure safe handling and use of chemicals.
              </p>
            </div>
          </div>
        </div>
      {/if}
      <slot />
    </div>
  </div>
</div>
