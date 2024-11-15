<script>
  import {enhance} from '$app/forms';
  import { goto } from "$app/navigation";
  import Icon from '@iconify/svelte';
  let showNav = false;
  let showErrors = false;
  let showProductDetails = false;
  let showProductDetails1 = false;
  let activeTab = "SafetyData Sheets"; 
  let inputValue = "";
  let inputValue1 = ""; 
  let inputValue2 = ""; 
  let inputValue3 = ""; 
  let lotNumber="";
  let lotNumber1="";
  let lotNumber2="";
  let result='';
  let errormssg='';
  let status = '';
  let sdsLottNumberError="";
  let safetyDatasheet='';
  $: if (activeTab) {
    status = "";
  }
  function showMessage(s) {
    status = s;
    if (status && status.includes('http')) {
      location.assign(status); 
    }
  }
  function toggleProductDetails() {
    showProductDetails = !showProductDetails;
  }
  function toggleProductDetails1() {
    showProductDetails1 = !showProductDetails1;
  }
  let rotations = [false, false, false, false, false, false, false];
function toggleRotation(index) {
  rotations = rotations.map((_, i) => i === index ? !rotations[i] : false);
}
  const tabs = [
    { name: "SafetyData Sheets" },
    { name: "Certificates of Analysis" },
    { name: "Certificates of Origin" },
    { name: "Certificates of Quality" },
  ];
  console.log(tabs[0].name);  
  let sdsProductNumberError = '';
  let showProductDetailsSafety = false;
  let showProductDetailsCertificates =false;
  let showProductDetailsOrigin = false;
  let showProductDetailsQuality = false;
  let showLotDetailsCertificates = false;
  let showLotDetailsOrigin = false;
  let showLotDetailsQuality = false;
  let coaProductNumberError = '';
  let coaLotNumberError = '';
  let cooProductNumberError = '';
  let cooLotNumberError = '';
  let cqProductNumberError = '';
  let cqLotNumberError = '';
  let scrollContainer;
  function toggleProductDetails2(tab) {
    if (tab === "Safety Data Sheets") {
      showProductDetailsSafety = !showProductDetailsSafety;
    } else if (tab === "Certificates of Analysis") {
      showProductDetailsCertificates = !showProductDetailsCertificates;
    } else if (tab === "Certificates of Origin"){
      showProductDetailsOrigin = !showProductDetailsOrigin;
    } else if (tab === "Certificates of Quality"){
      showProductDetailsQuality = !showProductDetailsQuality;
    }
  }
  function toggleLotDetails(tab) {
    if (tab === "Certificates of Analysis") {
      showLotDetailsCertificates = !showLotDetailsCertificates;
    } else if (tab === "Certificates of Origin"){
      showLotDetailsOrigin = !showLotDetailsOrigin;
    } else if (tab === "Certificates of Quality"){
      showProductDetailsQuality = !showProductDetailsQuality;
    }
  }
  function validateSDSForm(event) {
    const productNumberSDS = event.target.elements['product-number-sds'].value;
    if (!productNumberSDS) {
      event.preventDefault();
      sdsProductNumberError = "*Please enter product number.";
    } else {
      sdsProductNumberError = "";
    }
  }
  function validateCOAForm(event) {
    const productNumberCOA = event.target.elements['product-number-coa'].value;
    const lotNumberCOA = event.target.elements['lot-number-coa'].value;
    let isValid = true;   
    if (!productNumberCOA) {
      event.preventDefault();
      coaProductNumberError = "*Please enter product number.";
      isValid = false;
    } else {
      coaProductNumberError = "";
    }
    if (!lotNumberCOA) {
      event.preventDefault();
      coaLotNumberError = "*Please enter lot number.";
      isValid = false;
    } else {
      coaLotNumberError = "";
    }
    return isValid;
  }
  function validateCOOForm(event) {
    const productNumberCOO = event.target.elements['product-number-coo'].value;
    const lotNumberCOO = event.target.elements['lot-number-coo'].value;
    let isValid = true;    
    if (!productNumberCOO) {
      event.preventDefault();
      cooProductNumberError = "*Please enter product number.";
      isValid = false;
    } else {
      cooProductNumberError = "";
    }
    if (!lotNumberCOO) {
      event.preventDefault();
      cooLotNumberError = "*Please enter lot number.";
      isValid = false;
    } else {
      cooLotNumberError = "";
    }
    return isValid;
  }
  function validateCQForm(event) {
    const productNumberCQ = event.target.elements['product-number-cq'].value;
    const lotNumberCQ = event.target.elements['lot-number-cq'].value;
    let isValid = true;
    if (!productNumberCQ) {
      event.preventDefault();
      cqProductNumberError = "*Please enter product number.";
      isValid = false;
    } else {
      cqProductNumberError = "";
    }
    if (!lotNumberCQ) {
      event.preventDefault();
      cqLotNumberError = "*Please enter lot number.";
      isValid = false;
    } else {
      cqLotNumberError = "";
    }
    return isValid;
  }  
  const scrollLeft = () => {
    scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
  };
  const scrollRight = () => {
    scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
  };
</script>

<div class="p-4 max-w-6xl mx-auto">
  <div class="flex flex-col md:flex-row"> 
    <div class="w-full md:w-7/12 p-2"> 
      <h1 class="text-4xl font-bold mb-8">Documents</h1>
      <div class="inline-flex bg-primary-300 p-0 rounded-md mb-8">
          <button 
          on:click={() => (showNav = !showNav)} 
          class="sm:hidden text-white p-2 rounded-md bg-primary-300 hover:bg-primary-400"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav class="hidden sm:flex flex-col sm:flex-row space-x-0 overflow-x-auto" aria-label="Tabs">
          {#each tabs as tab}
            <div class="relative inline-block">
              <button
                on:click={() => (activeTab = tab.name)} 
                class="py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300 
                {activeTab === tab.name 
                  ? 'bg-gray-50 text-primary-300 font-bold'
                  : 'bg-primary-100 text-black'}
                hover:bg-gray-50 hover:text-primary-300 whitespace-nowrap">
                {tab.name}
              </button>
              <span 
                class="relative h-0.5 bg-primary-300 
                {activeTab === tab.name ? 'w-0.5 h-3/4' : 'hidden'} sm:absolute sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-3/4 sm:h-0.5"></span>
            </div>
          {/each}
        </nav>
      </div>

      {#if activeTab === "SafetyData Sheets"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">SafetyData Sheets (SDS)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Safety Data Sheet, please enter the product number.</p>
        <form 
        method="post" 
        action="?/document" 
        use:enhance={() => {
            return async ({ result }) => {
              showErrors = inputValue.length === 0;
            if (showErrors) {
              return;
            }
                if (result.data) {
                    const safetyDatasheet = result.data.safetyDatasheet;
                    showMessage(safetyDatasheet);
                    console.log("pdf_url",safetyDatasheet);
                } else if (result) {
                    console.log(result);
                    const errormssg = result.data.props.error;
                    showMessage(errormssg);
                }
            };
        }}>
          <label for="product-number-sds" class="block text-md font-medium mb-1 {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input
            type="text"
            bind:value={inputValue}
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. 775118"
            class="block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm mb-0"
          />
          {#if showErrors && inputValue.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Order Number is required</span>
          </div>
          {/if}
            {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <button
            type="submit"
            class="absolute right-0  font-semibold bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-500 transition duration-300 sm:mt-5 mt-0.5"
          >
            SEARCH
          </button>
          </div>
          <!-- <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {status}
          </p> -->
        </form>
      </div>
      {/if}
      
      
      
      
      
      {#if activeTab === "Certificates of Analysis"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Analysis (COA)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Analysis (COA), please enter both the product number and the Lot/batch Number.</p>
        <form 
        method="post" 
        action="?/document" 
        use:enhance={() => {
            return async ({ result }) => {
              showErrors = inputValue1.length === 0 || lotNumber.length === 0;
            if (showErrors) {
              return;
            }
                if (result.data) {
                    const certificateOfAnalysis = result.data.certificateOfAnalysis;
                    showMessage(certificateOfAnalysis);
                    console.log(certificateOfAnalysis);
                } else if (result) {
                    console.log(result);
                    const errormssg = result.data.props.error;
                    showMessage(errormssg);
                }
            };
        }}>
        <label for="product-number-sds" class="block text-md font-medium mb-1{sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue1}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. 775118"
            class="block w-full  p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && inputValue1.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Order Number is required</span>
          </div>
        {/if}
          {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <br>
            <label for="product-number-sds" class="block text-md font-medium mb-2{sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch Number
            </label>
            
            <div class="relative w-full">
              <input 
                type="text"
                id="product-number"
                name="product-number"
                bind:value={lotNumber}
                placeholder="E.G. 708371"
                class="block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
              />
              {#if showErrors && lotNumber.length === 0}
              <div class="flex text-start">
                <span class="text-red-400 text-xs">Lot Number is required</span>
              </div>
            {/if}
            </div>
              <button
              type="submit"
              class="absolute  font-semibold right-0 mt-3 mb-3 sm:mt-20 mb-10 bg-primary-400 hover:bg-primary-500 text-white py-2 px-6 rounded-md shadow transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {status}
          </p>
        </form>
      </div>
      {/if}
      
      
      
      
      {#if activeTab === "Certificates of Origin"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Origin (COO)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Origin (COO), please enter both the product number and the Lot/batch Number.</p>
        <form 
        method="post" 
        action="?/document" 
        use:enhance={() => {
            return async ({ result }) => {
              showErrors = inputValue2.length === 0 || lotNumber1.length === 0;
            if (showErrors) {
              return;
            }
                if (result.data) {
                    const certificateOfOrigin = result.data.certificateOfOrigin;
                    showMessage(certificateOfOrigin);
                    console.log(certificateOfOrigin);
                } else if (result) {
                    console.log(result);
                    const errormssg = result.data.props.error;
                    showMessage(errormssg);
                }
            };
        }}>
          <label for="product-number-sds" class="block text-md font-medium mb-1 {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue2}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. 775118"
            class="block w-full  p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && inputValue2.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Order Number is required</span>
          </div>
          {/if}
          {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <br>
            <label for="product-number-sds" class="block text-md font-medium mb-2{sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch Number
            </label>
            <div class="relative w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            bind:value={lotNumber1}
            placeholder="E.G. 708371"
            class="block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && lotNumber1.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Lot Number is required</span>
          </div>
        {/if}
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}
            <button
              type="submit"
              class="absolute  font-semibold right-0 mt-3 mb-3 mt-1 sm:mt-20 mb-10 bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-500 transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {status}
          </p>
        </form>
      </div>
      {/if}
      
      
      
      
      
      {#if activeTab === "Certificates of Quality"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Quality (COQ)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Quality (COQ), please enter both the product number and the Lot/batch Number.</p>
        <form 
        method="post" 
        action="?/document" 
        use:enhance={() => {
            return async ({ result }) => {
              showErrors = inputValue3.length === 0 || lotNumber2.length === 0;
            if (showErrors) {
              return;
            }
                if (result.data) {
                    const certificateOfQuality = result.data.certificateOfQuality;
                    showMessage(certificateOfQuality);
                    console.log(certificateOfQuality);
                } else if (result) {
                    console.log(result);
                    const errormssg = result.data.props.error;
                    showMessage(errormssg);
                }
            };
        }}>
        <label for="product-number-sds" class="block text-md font-medium mb-1{sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue3}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. 775118"
            class="block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && inputValue3.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Order Number is required</span>
          </div>
          {/if}
            <br>
            <label for="product-number-sds" class="block text-md font-medium mb-2{sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch Number
            </label>
            <div class="relative w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            bind:value={lotNumber2}
            placeholder="E.G. 708371"
            class="block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && lotNumber2.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Lot Number is required</span>
          </div>
          {/if}
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}

          <button
          type="submit"
          class="absolute font-semibold right-0 mt-3 mb-3 mt-1 sm:mt-20 mb-10 bg-primary-400 text-white py-2 px-6 rounded-md  shadow hover:bg-primary-500 transition duration-300"
        >
          SEARCH
        </button>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {status}
          </p>
        </form>
      </div>
      {/if}
    </div>
    
    
    
    <div class="w-full md:w-5/12 p-2 mt-1 sm:mt-32"> 
      {#if activeTab === "SafetyData Sheets"}
        <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start ml-0 md:ml-7">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => toggleProductDetails2("Safety Data Sheets")} class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
                  <!-- svelte-ignore a11y-missing-attribute -->
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsSafety ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showProductDetailsSafety}
            <div class="mt-4 text-sm text-gray-600">
              <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T775118-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T775118).</p>
              <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
                <p><strong>Example:</strong></p>
                <p><code>T775118</code> <span class="font-bold">Product Number</span></p>
                <p><span class="font-bold">-</span></p>
                <p><code>25G</code> <span class="font-bold">Pack Size/Quantity</span></p>
                <p><strong>Additional examples:</strong></p>
                <ul class="list-disc ml-5">
                  <li><code>705578-5MG-PW</code></li>
                  <li><code>PL860-CGA/SHF-1EA</code></li>
                  <li><code>MMYOMAG-74K-13</code></li>
                  <li><code>1000309185</code> (enter as <code>1.000309185</code>)</li>
                </ul>
              </div>
              <p>Having trouble? Feel free to contact Technical Service for assistance.</p>
            </div>
          {/if}
        </div>
      {/if}
  
    
      {#if activeTab === "Certificates of Analysis"}
      <div class="flex flex-wrap  space-y-4 ml-0 md:ml-16">       
        <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start"> 
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => toggleProductDetails2("Certificates of Analysis")} class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
                  <!-- svelte-ignore a11y-missing-attribute -->
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsCertificates ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showProductDetailsCertificates}
            <div class="mt-4 text-sm text-gray-600">
              <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T775118-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T775118).</p>
              <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
                <p><strong>Example:</strong></p>
                <p><code>T775118</code> <span class="font-bold">Product Number</span></p>
                <p><span class="font-bold">-</span></p>
                <p><code>25G</code> <span class="font-bold">Pack Size/Quantity</span></p>
                <p><strong>Additional examples:</strong></p>
                <ul class="list-disc ml-5">
                  <li><code>705578-5MG-PW</code></li>
                  <li><code>PL860-CGA/SHF-1EA</code></li>
                  <li><code>MMYOMAG-74K-13</code></li>
                  <li><code>1000309185</code> (enter as <code>1.000309185</code>)</li>
                </ul>
              </div>
              <p>Having trouble? Feel free to contact Technical Service for assistance.</p>
            </div>
          {/if}
        </div>
      
        <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => toggleLotDetails("Certificates of Analysis")} class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COA</h3>
                  <!-- svelte-ignore a11y-missing-attribute -->
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showLotDetailsCertificates ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showLotDetailsCertificates}
          <div class="mt-4 text-sm text-gray-600">
            <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
            <h4 class="font-bold mt-2">Mallipore Products</h4>
            <h2>
              For assistance obtaining the Lot or batch number for Millipore products, please contact 
              <span class="font-bold">customer support</span>.
            </h2>
          </div>
          {/if}
        </div>
      
      
        <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
          <div class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
          </div>
          <p class="mt-4 text-sm text-gray-600">
            In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
          </p>
          <div class="mt-4">
            <button class="bg-primary-400 text-white px-4 py-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600">
              Request COA
            </button>
          </div>
        </div>
      </div>
      {/if}
      
{#if activeTab === "Certificates of Origin"}
<div class="flex flex-wrap space-y-4 ml-0 md:ml-16">
  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={() => toggleProductDetails2("Certificates of Origin")} class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
            <!-- svelte-ignore a11y-missing-attribute -->
      <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsOrigin ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showProductDetailsOrigin}
      <div class="mt-4 text-sm text-gray-600">
        <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T775118-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T775118).</p>
        <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
          <p><strong>Example:</strong></p>
          <p><code>T775118</code> <span class="font-bold">Product Number</span></p>
          <p><span class="font-bold">-</span></p>
          <p><code>25G</code> <span class="font-bold">Pack Size/Quantity</span></p>
          <p><strong>Additional examples:</strong></p>
          <ul class="list-disc ml-5">
            <li><code>705578-5MG-PW</code></li>
            <li><code>PL860-CGA/SHF-1EA</code></li>
            <li><code>MMYOMAG-74K-13</code></li>
            <li><code>1000309185</code> (enter as <code>1.000309185</code>)</li>
          </ul>
        </div>
        <p>Having trouble? Feel free to contact Technical Service for assistance.</p>
      </div>
    {/if}
  </div>

 
  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={() => toggleLotDetails("Certificates of Origin")} class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
            <!-- svelte-ignore a11y-missing-attribute -->
      <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showLotDetailsOrigin ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showLotDetailsOrigin}
      <div class="mt-4 text-sm text-gray-600">
        <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
        <h4 class="font-bold mt-2">Sigma Products</h4>
        <p>If the letter is preceded by only two numbers (e.g. 62K1064), insert a '0' to the beginning and enter it as <code>062K1064</code>.</p>
        <h4 class="font-bold mt-2">Aldrich Products</h4>
        <ul class="list-disc ml-5">
          <li>For a lot number such as <code>TO09019TO</code>, enter it as <code>09019TO</code> (without the first two letters 'TO').</li>
          <li>For a lot number with a filling-code such as <code>05427ES-021</code>, enter it as <code>05427ES</code> (without the filling-code '-021').</li>
          <li>For a lot number with a filling-code such as <code>STBB0728K9</code>, enter it as <code>STBB0728</code> (without the filling-code 'K9').</li>
        </ul>
      </div>
    {/if}
  </div>

  
  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
    <div class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
    </p>
    <div class="mt-4">
      <button class="bg-primary-400 text-white px-4 py-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600">
        Request COA
      </button>
    </div>
  </div>
</div>
{/if}

      
{#if activeTab === "Certificates of Quality"}
<div class="flex flex-wrap space-y-4 ml-0 md:ml-16">
  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start"> 
    <div class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <a on:click={() => toggleProductDetails2("Certificates of Quality")} class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-300 ${showProductDetailsQuality ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showProductDetailsQuality}
      <div class="mt-4 text-sm text-gray-600">
        <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T775118-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T775118).</p>
        <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
          <p><strong>Example:</strong></p>
          <p><code>T775118</code> <span class="font-bold">Product Number</span></p>
          <p><span class="font-bold">-</span></p>
          <p><code>25G</code> <span class="font-bold">Pack Size/Quantity</span></p>
          <p><strong>Additional examples:</strong></p>
          <ul class="list-disc ml-5">
            <li><code>705578-5MG-PW</code></li>
            <li><code>PL860-CGA/SHF-1EA</code></li>
            <li><code>MMYOMAG-74K-13</code></li>
            <li><code>1000309185</code> (enter as <code>1.000309185</code>)</li>
          </ul>
        </div>
        <p>Having trouble? Feel free to contact Technical Service for assistance.</p>
      </div>
    {/if}
  </div>

  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={() => toggleLotDetails("Certificates of Origin")} class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COQ</h3>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showLotDetailsOrigin ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showLotDetailsOrigin}
      <div class="mt-4 text-sm text-gray-600">
        <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
        <h4 class="font-bold mt-2">Sigma Products</h4>
        <p>If the letter is preceded by only two numbers (e.g. 62K1064), insert a '0' to the beginning and enter it as <code>062K1064</code>.</p>
        <h4 class="font-bold mt-2">Aldrich Products</h4>
        <ul class="list-disc ml-5">
          <li>For a lot number such as <code>TO09019TO</code>, enter it as <code>09019TO</code> (without the first two letters 'TO').</li>
          <li>For a lot number with a filling-code such as <code>05427ES-021</code>, enter it as <code>05427ES</code> (without the filling-code '-021').</li>
          <li>For a lot number with a filling-code such as <code>STBB0728K9</code>, enter it as <code>STBB0728</code> (without the filling-code 'K9').</li>
        </ul>
      </div>
    {/if}
  </div>

  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full  self-start">
    <div class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
    </p>
    <div class="mt-4">
      <button class="bg-primary-400 text-white px-4 py-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600">
        Request COA
      </button>
    </div>
  </div>
</div>
{/if}
</div>
</div>
</div>