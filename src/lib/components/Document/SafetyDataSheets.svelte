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
  const productCodes = [
    { code: "705578-5MG-PW" },
    { code: "PL860-CGA/SHF-1EA" },
    { code: "MMYOMAG-74K-13" },
    { code: "1000309185", note: "1.000309185" },
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

<div class="w-[90%] mx-auto pb-10">
  <h1 class="text-2xl font-bold mb-8">Documents</h1>
  
  <div class="w-full inline-flex rounded mb-8">
    <!-- Navigation Menu (Tabs) -->
    <!-- <nav aria-label="Tabs" class="w-full flex space-x-0 overflow-x-auto">
      {#each tabs as tab}
      <div class="inline-block w-full">
        <button
          on:click={() => (activeTab = tab.name)} 
          class="w-full py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300
            {activeTab === tab.name 
              ? 'bg-white text-primary-500 font-bold'
              : 'bg-primary-100 text-black'}
            hover:bg-white hover:text-primary-500 whitespace-nowrap">
          {tab.name}
        </button>
        <div class="h-0.5 bg-primary-300 w-3/4 ml-9
          {activeTab === tab.name ? 'w-3/4' : 'w-0'} transition-all duration-300 ease-in-out"></div>
      </div>
      {/each}
    </nav> -->
    <nav aria-label="Tabs" class="w-full flex space-x-0 overflow-x-auto rounded-t scroll">
      {#each tabs as tab}
        <div class="inline-block w-full">
          <button
            on:click={() => (activeTab = tab.name)} 
            class="w-full py-2 sm:py-1 h-12 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300
              {activeTab === tab.name 
                ? 'bg-white text-primary-500 font-bold'
                : 'bg-primary-100 text-black'}
              hover:bg-white hover:text-primary-500 whitespace-nowrap">
            {tab.name}
          </button>
          <div class="h-0.5 bg-primary-300 
            {activeTab === tab.name ? 'w-full' : 'w-0'} transition-all duration-300 ease-in-out"></div>
        </div>
      {/each}
    </nav>
    
  </div>
  <div class="flex flex-col lg:flex-row lg:space-y-0 space-y-5"> 
    <div class="w-full lg:w-7/12 px-3 pt-3 rounded bg-white shadow"> 
      {#if activeTab === "SafetyData Sheets"}
      <div class="mb-2 max-sm:w-full" >
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
          <div class="w-full">
            <input
            type="text"
            bind:value={inputValue}
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. IPAKKIT00"
            class="block w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm mb-0"
          />
          {#if showErrors && inputValue.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Order Number is required</span>
          </div>
          {/if}
            {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <div class="flex items-center justify-end mt-2">
              <div class="flex items-center justify-end mt-2">
                <button
                type="submit"
                class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
              >
                SEARCH
              </button>
              </div>
            </div>
           
          </div>
          <p class="sm:text-sm text-xs font-medium text-primary-500 my-2">
          {#if status === undefined}
          <div class="sm:text-lg text-md font-semibold text-black mb-2">
            SDS Not Found
          </div> We were unable to locate an SDS for the selected product.
          {/if}
          </p>
        </form>
      </div>
      {/if}
      {#if activeTab === "Certificates of Analysis"}
      <div class="mb-2 max-sm:w-full" >
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
          <div class="w-full">
            <input 
            bind:value={inputValue1}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. IPAKKIT00"
            class="block w-full  p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
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
            
            <div class=" w-full">
              <input 
                type="text"
                id="product-number"
                name="product-number"
                bind:value={lotNumber}
                placeholder="E.G. 708371"
                class="block w-full p-3  border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
              />
              {#if showErrors && lotNumber.length === 0}
              <div class="flex text-start">
                <span class="text-red-400 text-xs">Lot Number is required</span>
              </div>
            {/if}
            </div>
            <div class="flex items-center justify-end mt-2">
              <button
              type="submit"
              class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
            >
              SEARCH
            </button>
            </div>
          </div>
          <p class="sm:text-sm text-xs font-medium text-primary-500 my-2">
            {#if status === undefined}
            <div class="sm:text-lg text-md font-semibold text-black mb-2">
              SDS Not Found
            </div> We were unable to locate an SDS for the selected product.
            {/if}
            </p>
        </form>
      </div>
      {/if}
      {#if activeTab === "Certificates of Origin"}
      <div class="mb-2 max-sm:w-full" >
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
          <div class=" w-full">
            <input 
            bind:value={inputValue2}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. IPAKKIT00"
            class="block w-full  p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
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
            <div class=" w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            bind:value={lotNumber1}
            placeholder="E.G. 708371"
            class="block w-full p-3  border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && lotNumber1.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Lot Number is required</span>
          </div>
        {/if}
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}
          <div class="flex items-center justify-end mt-2">
            <button
            type="submit"
            class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
          >
            SEARCH
          </button>
          </div>
          </div>
          <p class="sm:text-sm text-xs font-medium text-primary-500 my-2">
            {#if status === undefined}
            <div class="sm:text-lg text-md font-semibold text-black mb-2">
              SDS Not Found
            </div> We were unable to locate an SDS for the selected product.
            {/if}
            </p>
        </form>
      </div>
      {/if}
      {#if activeTab === "Certificates of Quality"}
      <div class="mb-2 max-sm:w-full" >
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
          <div class=" w-full">
            <input 
            bind:value={inputValue3}
            type="text"
            id="product-number-sds"
            name="productNumber"
            placeholder="E.G. IPAKKIT00"
            class="block w-full p-3  border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm" 
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
            <div class=" w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            bind:value={lotNumber2}
            placeholder="E.G. 708371"
            class="block w-full p-3  border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 sm:text-sm"
          />
          {#if showErrors && lotNumber2.length === 0}
          <div class="flex text-start">
            <span class="text-red-400 text-xs">Lot Number is required</span>
          </div>
          {/if}
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}
          <div class="flex items-center justify-end mt-2">
            <button
            type="submit"
            class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
          >
            SEARCH
          </button>
          </div>
        <p class="sm:text-sm text-xs font-medium text-primary-500 my-2">
          {#if status === undefined}
          <div class="sm:text-lg text-md font-semibold text-black mb-2">
            SDS Not Found
          </div> We were unable to locate an SDS for the selected product.
          {/if}
          </p>
        </form>
      </div>
      {/if}
    </div>
    <div class="w-full lg:w-5/12 pl-2"> 
      {#if activeTab === "SafetyData Sheets"}
        <div class="bg-white p-4 border rounded shadow-md w-full self-start">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => toggleProductDetails2("Safety Data Sheets")} class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
                  <!-- svelte-ignore a11y-missing-attribute -->
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`  transition-transform duration-400 ${showProductDetailsSafety ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showProductDetailsSafety}
            <div class="mt-4 text-sm text-gray-600 leading-relaxed">
              <p>
                Product numbers are combined with Pack Sizes/Quantity when displayed on the website 
                (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00-25G</code>). 
                Please make sure you enter <strong>ONLY</strong> the product number in the Product Number field 
                (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code>).
              </p>
              <div class="bg-gray-50 p-4 border border-gray-300 rounded mt-3">
                <p class="font-semibold mb-2">Example:</p>
                <p>
                  <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code> 
                  <span class="font-bold">Product Number</span>
                </p>
                <p>
                  <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">25G</code> 
                  <span class="font-bold">Pack Size/Quantity</span>
                </p>
                <p class="font-semibold mt-3">Additional examples:</p>
                <ul class="list-disc ml-6">
                  {#each productCodes as product}
                    <li>
                      <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.code}</code>
                      {#if product.note}
                        (enter as 
                        <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.note}</code>)
                      {/if}
                    </li>
                  {/each}
                </ul>
              </div>
              <p class="mt-3">
                Having trouble? Feel free to contact <strong>Technical Service</strong> for assistance.
              </p>
            </div>
          {/if}
        </div>
      {/if}
      {#if activeTab === "Certificates of Analysis"}
      <div class="flex flex-wrap  space-y-4 ml-0 lg:ml-1">       
        <div class="bg-white p-4 border rounded shadow w-full self-start"> 
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
          <div class="mt-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Product numbers are combined with Pack Sizes/Quantity when displayed on the website 
              (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00-25G</code>). 
              Please make sure you enter <strong>ONLY</strong> the product number in the Product Number field 
              (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code>).
            </p>
            <div class="bg-gray-50 p-4 border border-gray-300 rounded mt-3">
              <p class="font-semibold mb-2">Example:</p>
              <p>
                <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code> 
                <span class="font-bold">Product Number</span>
              </p>
              <p>
                <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">25G</code> 
                <span class="font-bold">Pack Size/Quantity</span>
              </p>
              <p class="font-semibold mt-3">Additional examples:</p>
              <ul class="list-disc ml-6">
                {#each productCodes as product}
                  <li>
                    <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.code}</code>
                    {#if product.note}
                      (enter as 
                      <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.note}</code>)
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
            <p class="mt-3">
              Having trouble? Feel free to contact <strong>Technical Service</strong> for assistance.
            </p>
          </div>
        {/if}        
        </div>
        <div class="bg-white p-4 border rounded shadow w-full self-start">
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
        <div class="bg-white p-4 border rounded shadow w-full  self-start">
          <div class="flex items-center justify-between">
            <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
          </div>
          <p class="mt-4 text-sm text-gray-600">
            In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one by clicking product documentation.
          </p>
          <div class="flex items-center justify-end mt-4">
            <button
            type="submit"
            class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
            onclick="window.location.href='https://chemikart.partskeys.com/help-support'"
          >
          Request COA
          </button>
          </div>
        </div>
      </div>
      {/if}   
{#if activeTab === "Certificates of Origin"}
<div class="flex flex-wrap space-y-4 ml-0 lg:ml-1">
  <div class="bg-white p-4 border rounded shadow w-full  self-start">
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
    <div class="mt-4 text-sm text-gray-600 leading-relaxed">
      <p>
        Product numbers are combined with Pack Sizes/Quantity when displayed on the website 
        (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00-25G</code>). 
        Please make sure you enter <strong>ONLY</strong> the product number in the Product Number field 
        (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code>).
      </p>
      <div class="bg-gray-50 p-4 border border-gray-300 rounded mt-3">
        <p class="font-semibold mb-2">Example:</p>
        <p>
          <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code> 
          <span class="font-bold">Product Number</span>
        </p>
        <p>
          <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">25G</code> 
          <span class="font-bold">Pack Size/Quantity</span>
        </p>
        <p class="font-semibold mt-3">Additional examples:</p>
        <ul class="list-disc ml-6">
          {#each productCodes as product}
            <li>
              <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.code}</code>
              {#if product.note}
                (enter as 
                <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.note}</code>)
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <p class="mt-3">
        Having trouble? Feel free to contact <strong>Technical Service</strong> for assistance.
      </p>
    </div>
  {/if}
  </div>
  <div class="bg-white p-4 border rounded shadow w-full  self-start">
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
  <div class="bg-white p-4 border rounded shadow w-full self-start">
    <div class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      In some cases, a COO may not be available online. If your search was unable to find the COO, you can request one.
    </p>
    <div class="flex items-center justify-end mt-4">
      <button
      type="submit"
      class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
      onclick="window.location.href='https://chemikart.partskeys.com/help-support'"
    >
    Request COO
    </button>
    </div>
  </div>
</div>
{/if}   
{#if activeTab === "Certificates of Quality"}
<div class="flex flex-wrap space-y-4 ml-0 lg:ml-1">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="bg-white p-4 border rounded shadow w-full self-start"> 
    <div class="flex items-center justify-between" on:click={() => toggleProductDetails2("Certificates of Quality")}>
      <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-300 ${showProductDetailsQuality ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showProductDetailsQuality}
    <div class="mt-4 text-sm text-gray-600 leading-relaxed">
      <p>
        Product numbers are combined with Pack Sizes/Quantity when displayed on the website 
        (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00-25G</code>). 
        Please make sure you enter <strong>ONLY</strong> the product number in the Product Number field 
        (example: <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code>).
      </p>
      <div class="bg-gray-50 p-4 border border-gray-300 rounded mt-3">
        <p class="font-semibold mb-2">Example:</p>
        <p>
          <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">TIPAKKIT00</code> 
          <span class="font-bold">Product Number</span>
        </p>
        <p>
          <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">25G</code> 
          <span class="font-bold">Pack Size/Quantity</span>
        </p>
        <p class="font-semibold mt-3">Additional examples:</p>
        <ul class="list-disc ml-6">
          {#each productCodes as product}
            <li>
              <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.code}</code>
              {#if product.note}
                (enter as 
                <code class="text-gray-800 bg-gray-100 px-1 py-0.5 rounded">{product.note}</code>)
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <p class="mt-3">
        Having trouble? Feel free to contact <strong>Technical Service</strong> for assistance.
      </p>
    </div>
  {/if}
  </div>
  <div class="bg-white p-4 border rounded shadow w-full  self-start">
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
  <div class="bg-white p-4 border rounded shadow w-full  self-start">
    <div class="flex items-center justify-between">
      <h3 class="text-md font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      In some cases, a COQ may not be available online. If your search was unable to find the COQ, you can request one.
    </p>
    <div class="flex items-center justify-end mt-4">
      <button
      type="submit"
      class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
      onclick="window.location.href='https://chemikart.partskeys.com/help-support'"
    >
    Request COQ
    </button>
    </div>
  </div>
</div>
{/if}
</div>
</div>
</div>