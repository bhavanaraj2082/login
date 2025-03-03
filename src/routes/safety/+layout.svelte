<script>
  import { page } from "$app/stores";
</script>
<div class="w-11/12 mx-auto pb-10">
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/4 h-fit border-t-2 border-b-2 sm:mb-0 mb-5 border-gray-300 mt-10 pt-7 pb-7">
      <a href="/safety" 
         class=" font-medium sm:text-md text-sm mb-4 py-2 px-4 w-full text-left cursor-pointer transition duration-200 ease-in-out"
         class:text-primary-500={$page.url.pathname === "/safety"}
         class:font-semibold={$page.url.pathname === "/safety"}>
        Product Safety
      </a>
      <ul class="pl-2 mt-2 sm:space-y-7 space-y-2 border-gray-300">
        <li>
          <div class="flex flex-col items-start">
          <a href="/safety/understanding-product-labels" 
             class="py-1 px-4 w-full font-medium sm:text-sm text-xs text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500"
             class:text-primary-500={$page.url.pathname === "/safety/understanding-product-labels"}
             class:font-semibold={$page.url.pathname === "/safety/understanding-product-labels"}>
            - Understanding Product Labels
          </a>
          </div>
        </li>
        <li>
          <div class="flex flex-col items-start">
          <a href="/safety/globally-harmonized-system" 
             class="py-1 px-4 w-full font-medium sm:text-sm text-xs text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500"
             class:text-primary-500={$page.url.pathname === "/safety/globally-harmonized-system"}
             class:font-semibold={$page.url.pathname === "/safety/globally-harmonized-system"}>
            - Globally Harmonized System
          </a>
          </div>
        </li>
        <li>
          <div class="flex flex-col items-start">
          <a href="/safety/tsca-8-notification" 
             class="py-1 px-4 w-full font-medium sm:text-sm text-xs text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500"
             class:text-primary-500={$page.url.pathname === "/safety/tsca-8-notification"}
             class:font-semibold={$page.url.pathname === "/safety/tsca-8-notification"}>
            - TSCA 8 Notification
          </a>
          </div>
        </li>
        <li>
          <div class="flex flex-col items-start">
          <a href="/safety/hazard-and-precautionary-statements" 
             class="py-1 px-4 w-full font-medium sm:text-sm text-xs text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500"
             class:text-primary-500={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}
             class:font-semibold={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}>
            - Hazard & Precautions
          </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="w-full md:w-3/4">
    {#if $page.url.pathname === '/safety'}
    <div class="container mx-auto sm:px-4 px-1 sm:py-8 py-1">
      <div class="mb-8">
          <a href="/safety" 
          class="py-1 w-full  font-medium sm:text-md text-sm mb-2 text-left cursor-pointer transition duration-200 ease-in-out"
          class:text-primary-500={$page.url.pathname === "/safety"}
              class:font-semibold={$page.url.pathname === "/safety"}>
              Product Safety
          </a>
          <p class="sm:text-sm text-xs text-heading mt-5">
              Our worldwide Product Safety staff is comprised of scientists with extensive backgrounds in global compliance regulations. 
              We provide Safety Data Sheets with comprehensive safety and regulatory data to promote safe product usage and handling. 
              Our SDS documents are always current and available in over 50 languages.
          </p>
      </div>
      <div class="grid grid-cols-2 gap-4"> 
        <div class="">
          <a href="/safety/understanding-product-labels" 
              class=" font-medium sm:text-md text-sm mb-2 py-1 w-full text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
              class:text-primary-500={$page.url.pathname === "/safety/understanding-product-labels"}
              class:font-semibold={$page.url.pathname === "/safety/understanding-product-labels"}>
            <img src="/productsafety/Understanding Product Labels.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52" />
            Understanding Product Labels
          </a>
          <p class="sm:text-sm text-xs text-heading">
            Our product labels are designed to provide complete, up-to-date information on our products. 
            Information available when and where you need it most.
        </p>
        </div>
        
        <div class="">
          <a href="/safety/globally-harmonized-system" 
              class="py-1 w-full  font-medium sm:text-md text-sm mb-2 text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
              class:text-primary-500={$page.url.pathname === "/safety/globally-harmonized-system"}
              class:font-semibold={$page.url.pathname === "/safety/globally-harmonized-system"}>
            <img src="/productsafety/GHS.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52" />
            Globally Harmonized System
          </a>
          <p class="sm:text-sm text-xs text-heading">
            GHS harmonizes most classification criteria for supply and transportation and is based on the intrinsic properties of substances. 
            GHS allows individual countries or regions to implement building blocks at their own discretion.
        </p>
        </div>
        

        <div class="">
          <a href="/safety/tsca-8-notification" 
              class="py-1 w-full  font-medium sm:text-md text-sm mb-2 text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
              class:text-primary-500={$page.url.pathname === "/safety/tsca-8-notification"}
              class:font-semibold={$page.url.pathname === "/safety/tsca-8-notification"}>
            <img src="/productsafety/TSCA.webp" alt="img" class="mb-10 ml-1 sm:ml-10 w-52" />
            TSCA 8 Notification
          </a>
          <p class="sm:text-sm text-xs text-heading">
            SDS provide essential information for anyone handling laboratory chemicals, including all of the dangerous 
            and most non-dangerous products.
        </p>
        </div>

        <div class="">
          <a href="/safety/hazard-and-precautionary-statements" 
              class="py-1 w-full  font-medium sm:text-md text-sm mb-2 text-left cursor-pointer transition duration-200 ease-in-out hover:text-primary-500 text-heading decoration-2 underline-offset-4"
              class:text-primary-500={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}
              class:font-semibold={$page.url.pathname === "/safety/hazard-and-precautionary-statements"}>
            <img src="/productsafety/Hazard_Precaution.webp" alt="img" class="sm:mb-10 mb-5 ml-1 sm:ml-10 w-28 sm:mt-5 mt-0" />
            Hazard and Precautionary Statements
          </a>
          <p class="sm:text-sm text-xs text-heading">
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