<script>
  import { page } from "$app/stores";
</script>
<div class="w-11/12 mx-auto">
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/4 h-fit border-t-2 border-b-2 border-gray-300 mt-10 pt-7 pb-7">
      <a href="/safety" 
         class="text-lg font-bold mb-4 py-2 px-4 w-full text-left cursor-pointer transition duration-200 ease-in-out"
         class:text-primary-500={$page.url.pathname === "/safety"}
         class:font-semibold={$page.url.pathname === "/safety"}>
        Product Safety
      </a>
      <ul class="pl-2 mt-2 space-y-7 border-gray-300">
        <li>
          <a href="/safety/understanding-product-labels" 
             class="py-1 px-4 w-full font-medium text-sm text-left cursor-pointer transition duration-200 ease-in-out"
             class:text-primary-500={$page.url.pathname === "/safety/understanding-product-labels"}
             class:font-semibold={$page.url.pathname === "/safety/understanding-product-labels"}>
            - Understanding Product Labels
          </a>
        </li>
        <li>
          <a href="/safety/globally-harmonized-system" 
             class="py-1 px-4 w-full font-medium text-sm text-left cursor-pointer transition duration-200 ease-in-out"
             class:text-primary-500={$page.url.pathname === "/safety/globally-harmonized-system"}
             class:font-semibold={$page.url.pathname === "/safety/globally-harmonized-system"}>
            - Globally Harmonized System
          </a>
        </li>
        <li>
          <a href="/safety/tsca-8-notification" 
             class="py-1 px-4 w-full font-medium text-sm text-left cursor-pointer transition duration-200 ease-in-out"
             class:text-primary-500={$page.url.pathname === "/safety/tsca-8-notification"}
             class:font-semibold={$page.url.pathname === "/safety/tsca-8-notification"}>
            - TSCA 8 Notification
          </a>
        </li>
        <li>
          <a href="/safety/hazard-and-precautionary-statements" 
             class="py-1 px-4 w-full font-medium text-sm text-left cursor-pointer transition duration-200 ease-in-out"
             class:text-primary-500={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}
             class:font-semibold={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}>
            - Hazard & Precautions
          </a>
        </li>
      </ul>
    </div>
    <div class="w-full md:w-3/4 p-4">
    {#if $page.url.pathname === '/safety'}
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
          <a href="/safety" 
          class="py-1 w-full text-xl font-bold mb-2 text-left cursor-pointer transition duration-200 ease-in-out"
          class:text-primary-500={$page.url.pathname === "/safety"}
              class:font-semibold={$page.url.pathname === "/safety"}>
              Product Safety
          </a>
          <p class="text-gray-700">
              Our worldwide Product Safety staff is comprised of scientists with extensive backgrounds in global compliance regulations. 
              We provide Safety Data Sheets with comprehensive safety and regulatory data to promote safe product usage and handling. 
              Our SDS documents are always current and available in over 50 languages.
          </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="">
            <img src="/productsafety/Understanding Product Labels.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52" />
              <a href="/safety/understanding-product-labels" 
                  class="text-xl font-bold mb-2 py-1 w-full text-left cursor-pointer transition duration-200 ease-in-out"
                  class:text-primary-500={$page.url.pathname === "/safety/understanding-product-labels"}
                  class:font-semibold={$page.url.pathname === "/safety/understanding-product-labels"}>
                  Understanding Product Labels
              </a>
              <p class="text-gray-700">
                  Our product labels are designed to provide complete, up-to-date information on our products. 
                  Information available when and where you need it most.
              </p>
          </div>
          <div class="">
            <img src="/productsafety/GHS.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52" />
              <a href="/safety/globally-harmonized-system" 
                  class="py-1 w-full text-xl font-bold mb-2 text-left cursor-pointer transition duration-200 ease-in-out"
                  class:text-primary-500={$page.url.pathname === "/safety/globally-harmonized-system"}
                  class:font-semibold={$page.url.pathname === "/safety/globally-harmonized-system"}>
                  Globally Harmonized System
              </a>
              <p class="text-gray-700">
                  GHS harmonizes most classification criteria for supply and transportation and is based on the intrinsic properties of substances. 
                  GHS allows individual countries or regions to implement building blocks at their own discretion.
              </p>
          </div>
          <div class="">
          <img src="/productsafety/TSCA.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52"/>
              <a href="/safety/tsca-8-notification" 
                  class="py-1 w-full text-xl font-bold mb-2 text-left cursor-pointer transition duration-200 ease-in-out"
                  class:text-primary-500={$page.url.pathname === "/safety/tsca-8-notification"}
                  class:font-semibold={$page.url.pathname === "/safety/tsca-8-notification"}>
                  TSCA 8 Notification
              </a>
              <p class="text-gray-700">
                  SDS provide essential information for anyone handling laboratory chemicals, including all of the dangerous 
                  and most non-dangerous products.
              </p>
          </div>
          <div class="">
            <img src="/productsafety/Hazard_Precaution.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-28 mt-5"/>
              <a href="/safety/hazard-and-precautionary-statements" 
                  class="py-1 w-full text-xl font-bold mb-2 text-left cursor-pointer transition duration-200 ease-in-out"
                  class:text-primary-500={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}
                  class:font-semibold={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}>
                  Hazard and Precautionary Statements
              </a>
              <p class="text-gray-700">
                  These statements provide critical guidance on hazards and proper precautions to ensure safe handling and use of chemicals.
              </p>
          </div>
      </div>
  </div>
  {/if}
    <slot />
    </div>
  </div>
</div>