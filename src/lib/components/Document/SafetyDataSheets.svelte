<script>
	import Icon from '@iconify/svelte';
  let showProductDetailsSafety = false;
  let showProductDetailsCertificates =false;
  let showProductDetailsOrigin = false;
  let showProductDetailsQuality = false;
  let showLotDetailsCertificates = false;
  let showLotDetailsOrigin = false;
  let showLotDetailsQuality = false;


  let activeTab = "Safety Data Sheets";

 
  const tabs = [
    { name: "Safety Data Sheets" },
    { name: "Certificates of Analysis" },
    { name: "Certificates of Origin" },
    { name: "Certificates of Quality" },
  ];

  
  let sdsProductNumberError = '';
  let coaProductNumberError = '';
  let coaLotNumberError = '';
  let cooProductNumberError = '';
  let cooLotNumberError = '';
  let cqProductNumberError = '';
  let cqLotNumberError = '';
  let scrollContainer;

  function toggleProductDetails(tab) {
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

<div class="max-w-7xl  mx-auto px-6 py-8">
  <h1 class="relative text-4xl font-bold mb-8">Documents</h1>
  
   <!-- <div class="absolute top-8 right-8 bg-white px-3 py-2 rounded-md border border-primary-200 flex space-x-2 shadow-sm">
    <Icon icon="f7:exclamationmark-circle" width="2em" height="2em" class="text-primary-400"/>
    <span class="text-black-500 text-xs leading-snug">
      Sign in to import items<br>from your recent orders and quotes.
    </span>
  </div> -->

  
    <div class="relative mb-8 ">
      <!-- Left arrow -->
      <button 
        class="absolute -left-4 top-0 h-full  bg-white z-10 md:hidden" 
        on:click={scrollLeft}>
        <Icon icon="formkit:left" width="1.2em" height="1.2em" />
      </button>
    
      <!-- Right arrow -->
      <button 
        class="absolute -right-4 top-0 h-full  bg-white  z-10 md:hidden" 
        on:click={scrollRight}>
        <Icon icon="formkit:right" width="1.2em" height="1.2em" />
      </button>
    
      <div class="inline-flex overflow-hidden w-full">
        <nav 
          class="flex bg-primary-100 overflow-x-auto no-scrollbar" 
          aria-label="Tabs" 
          bind:this={scrollContainer}>
          {#each tabs as tab}
          <button
            on:click={() => (activeTab = tab.name)} 
            class="py-2 px-4  text-gray-600 text-sm focus:outline-none transition duration-300 whitespace-nowrap
              {activeTab === tab.name ? ' bg-gray-100 font-semibold text-primary-400 text-sm' : 'font-medium'} ">
            {tab.name}
            {#if activeTab === tab.name}
            <hr class="w-28 flex-center h-1 mx-auto bg-primary-400 mt-1">
            {/if}
          </button>
          {/each}
        </nav>
      </div>
    </div>
    
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8  ">
        <div class="flex-1">
            
            {#if activeTab === "Safety Data Sheets"}
              <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4 ">Safety Data Sheets (SDS)</h2>
                <p class="mb-6 text-xs text-gray-600">To search for a Safety Data Sheet, please enter the product number.</p>
                <form on:submit={validateSDSForm} class="space-y-2">
                  <label for="product-number-sds" class="block text-sm font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
                    * Product Number
                  </label>
                  <div class="relative w-full">
                    <input
                      type="text"
                      id="product-number-sds"
                      name="product-number-sds"
                      placeholder="E.G. T1503"
                      class="block w-full p-3 border {sdsProductNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    {#if sdsProductNumberError}
                      <p class="text-red-500 text-sm">{sdsProductNumberError}</p>
                    {/if}
                    <button
                      type="submit"
                      class="absolute right-0 bottom-0 w-full sm:w-40 transform translate-x-1 translate-y-20 bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-600 transition duration-300"
                    >
                      SEARCH
                    </button>
                  </div>
                </form>
              </div>
            {/if}
            
            
          {#if activeTab === "Certificates of Analysis"}
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Certificates of Analysis (COA)</h2>
          <form on:submit={validateCOAForm} class="space-y-2">
            <label for="product-number-coa" class="block text-sm font-medium {coaProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Product Number
            </label>
            <div class="relative w-full">
            <input
              type="text"
              id="product-number-coa"
              name="product-number-coa"
              placeholder="E.G. T1503"
              class="block w-full p-3 border {coaProductNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if coaProductNumberError}
              <p class="text-red-500 text-sm">{coaProductNumberError}</p>
            {/if}
            
            <label for="lot-number-coa" class="block text-sm font-medium {coaLotNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot Number
            </label>
            <input
              type="text"
              id="lot-number-coa"
              name="lot-number-coa"
              placeholder="E.G. L1234"
              class="block w-full  p-3 border {coaLotNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if coaLotNumberError}
              <p class="text-red-500 text-sm">{coaLotNumberError}</p>
            {/if}
          
              <button
              type="submit"
              class="absolute right-0 bottom-0 w-full sm:w-40 transform translate-x-1 translate-y-20 bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-600 transition duration-300"
            >
              SEARCH
            </button>
            </div>
          </form>
        </div>
      {/if}
      
            
          
      {#if activeTab === "Certificates of Origin"}
      <div class="mb-6 relative">
        <h2 class="text-xl font-semibold mb-4">Certificates of Origin (COO)</h2>
        <form on:submit={validateCOOForm} class="space-y-2">
          <label for="product-number-coo" class="block text-sm font-medium {cooProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
          <input
            type="text"
            id="product-number-coo"
            name="product-number-coo"
            placeholder="E.G. T1503"
            class="block w-full  p-3 border {cooProductNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if cooProductNumberError}
            <p class="text-red-500 text-sm">{cooProductNumberError}</p>
          {/if}
          
          <label for="lot-number-coo" class="block text-sm font-medium {cooLotNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Lot Number
          </label>
          <input
            type="text"
            id="lot-number-coo"
            name="lot-number-coo"
            placeholder="E.G. L1234"
            class="block w-full  p-3 border {cooLotNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if cooLotNumberError}
            <p class="text-red-500 text-sm">{cooLotNumberError}</p>
          {/if}
          <button
            type="submit"
            class="absolute right-0 bottom-0 w-full sm:w-40 transform translate-x-1 translate-y-20 bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-600 transition duration-300"
          >
            SEARCH
          </button>
        </form>
      </div>
      {/if}
      
            
      {#if activeTab === "Certificates of Quality"}
      <div class="mb-6 relative">
        <h2 class="text-xl font-semibold mb-4">Certificates of Quality (CQ)</h2>
        <form on:submit={validateCQForm} class="space-y-2">
          <label for="product-number-cq" class="block text-sm font-medium {cqProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full ">
          <input
            type="text"
            id="product-number-cq"
            name="product-number-cq"
            placeholder="E.G. T1503"
            class="block w-full p-3 border {cqProductNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if cqProductNumberError}
            <p class="text-red-500 text-sm">{cqProductNumberError}</p>
          {/if}
          
          <label for="lot-number-cq" class="block text-sm font-medium {cqLotNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Lot Number
          </label>
          <input
            type="text"
            id="lot-number-cq"
            name="lot-number-cq"
            placeholder="E.G. L1234"
            class="block w-full  p-3 border {cqLotNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if cqLotNumberError}
            <p class="text-red-500 text-sm">{cqLotNumberError}</p>
          {/if}
          <button
            type="submit"
            class="absolute right-0 bottom-0 w-full sm:w-40 transform translate-x-1 translate-y-20 bg-primary-400 text-white py-2 px-6 rounded-md shadow hover:bg-primary-600 transition duration-300"
          >
            SEARCH
          </button>
        </form>
      </div>
      {/if}
    </div>

    <div class="flex space-y-4 ml-0 md:ml-16 mt-10"> 
      {#if activeTab === "Safety Data Sheets"}
        <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start "> 
          <div on:click={() => toggleProductDetails("Safety Data Sheets")} class="flex items-center justify-between">
            <h3 class="text-xs font-medium text-gray-700">How to Find the Product Number</h3>
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsSafety ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showProductDetailsSafety}
            <div class="mt-4 text-sm text-gray-600">
              <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T1503).</p>
              <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
                <p><strong>Example:</strong></p>
                <p><code>T1503</code> <span class="font-bold">Product Number</span></p>
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
          <div on:click={() => toggleProductDetails("Certificates of Analysis")} class="flex items-center justify-between">
            <h3 class="text-xs font-medium text-gray-700">How to Find the Product Number</h3>
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsCertificates ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showProductDetailsCertificates}
            <div class="mt-4 text-sm text-gray-600">
              <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T1503).</p>
              <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
                <p><strong>Example:</strong></p>
                <p><code>T1503</code> <span class="font-bold">Product Number</span></p>
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
          <div on:click={() => toggleLotDetails("Certificates of Analysis")} class="flex items-center justify-between">
            <h3 class="text-xs font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
            <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
              <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showLotDetailsCertificates ? 'rotate-45' : '-rotate-45'}`} />
            </a>
          </div>
          {#if showLotDetailsCertificates}
            <div class="mt-4 text-xs text-gray-600">
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
            <h3 class="text-xs font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
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
    <div on:click={() => toggleProductDetails("Certificates of Origin")} class="flex items-center justify-between">
      <h3 class="text-xs font-medium text-gray-700">How to Find the Product Number</h3>
      <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showProductDetailsOrigin ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showProductDetailsOrigin}
      <div class="mt-4 text-sm text-gray-600">
        <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T1503).</p>
        <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
          <p><strong>Example:</strong></p>
          <p><code>T1503</code> <span class="font-bold">Product Number</span></p>
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
    <div on:click={() => toggleLotDetails("Certificates of Origin")} class="flex items-center justify-between">
      <h3 class="text-xs font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
      <a  class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-400 ${showLotDetailsOrigin ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showLotDetailsOrigin}
      <div class="mt-4 text-xs text-gray-600">
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
      <h3 class="text-xs font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
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
      <h3 class="text-xs font-medium text-gray-700">How to Find the Product Number</h3>
      <a on:click={() => toggleProductDetails("Certificates of Quality")} class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-300 ${showProductDetailsQuality ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showProductDetailsQuality}
      <div class="mt-4 text-sm text-gray-600">
        <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: T1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: T1503).</p>
        <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
          <p><strong>Example:</strong></p>
          <p><code>T1503</code> <span class="font-bold">Product Number</span></p>
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
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
      <a on:click={() => toggleLotDetails("Certificates of Quality")} class="text-primary-400 hover:underline flex items-center ml-12 cursor-pointer">
        <Icon icon="mynaui:arrow-right" width="1.8em" height="1.8em"  class={`transition-transform duration-300 ${showLotDetailsQuality ? 'rotate-45' : '-rotate-45'}`} />
      </a>
    </div>
    {#if showLotDetailsQuality}
      <div class="mt-4 text-xs text-gray-600">
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

  
  <div class="bg-white p-4 border border-primary-100 rounded-lg shadow-md w-full self-start">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
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