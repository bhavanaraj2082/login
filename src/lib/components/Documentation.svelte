<script>
  let showNav = false;
  let showProductDetails = false;
  let showProductDetails1 = false;
  let activeTab = "SafetyData Sheets"; 
  let finalvalue = ""; 
  let inputValue = ""; 
  let lotNumber=null;
  let sdsLottNumberError="";
  $: if (activeTab) {
    finalvalue = ""; 
  }
  let validateAndCheckSDSForm = async (event) => {
    event.preventDefault();
    const productNumber = event.target['product-number-sds'].value;
    if (!productNumber) {
        sdsProductNumberError = "Product number is required.";
        sdsLottNumberError="Lot number is required."
        return; 
    } else {
        sdsProductNumberError = ""; 
    }
    const formData = new FormData();
    formData.append('inputValue', productNumber); 
    try {
        const response = await fetch('/Document', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        let value = result.data;
        const finalValue = value.replace("[", "").replace("]", "");
        console.log(finalValue);
        finalvalue = finalValue;
        value = '';
        console.log('Server response:', result);
        inputValue = '';
    } catch (error) {
        console.error('Error during fetch:', error);
    }
};
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
</script>
<div class="p-4 max-w-6xl mx-auto">
  <div class="flex flex-col md:flex-row"> 
    <div class="w-full md:w-8/12 p-2"> 
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
          {#if showNav}
          <nav class="block sm:hidden space-y-2 w-full p-4 rounded-lg" aria-label="Tabs">
            {#each tabs as tab}
              <div class="relative inline-block w-full">
                <button
                  on:click={() => (activeTab = tab.name)} 
                  class="w-full text-left py-2 px-4 text-base font-semibold focus:outline-none transition-all duration-300 rounded-md
                  {activeTab === tab.name 
                    ? 'bg-white text-primary-300 shadow-sm'
                    : 'bg-primary-300 hover:bg-primary-100 hover:text-primary-300'}
                  whitespace-nowrap">
                  {tab.name}
                </button>
                <span 
                  class="relative h-0.5 bg-primary-300 
                  {activeTab === tab.name ? 'w-1 h-6' : 'hidden'} absolute bottom-0 left-1/2 transform -translate-x-1/2"></span>
              </div>
            {/each}
          </nav>
        {/if}
        <nav class="hidden sm:flex flex-col sm:flex-row space-x-0 overflow-x-auto" aria-label="Tabs">
          {#each tabs as tab}
            <div class="relative inline-block">
              <button
                on:click={() => (activeTab = tab.name)} 
                class="py-2 sm:py-1 px-4 sm:px-2 sm:text-sm md:text-base focus:outline-none transition duration-300
                {activeTab === tab.name 
                  ? 'bg-white text-primary-300 font-bold'
                  : 'bg-primary-300 text-black'}
                hover:bg-white hover:text-primary-300 whitespace-nowrap">
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
        <form on:submit={validateAndCheckSDSForm}  class="space-y-2">
          <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input
            type="text"
            bind:value={inputValue}
            id="product-number-sds"
            name="product-number-sds"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
            {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <button
              type="submit"
              class="absolute font-semibold right-0 mt-3 mb-3 mt-1 sm:mt-20 bg-primary-500 text-white py-2 px-6 rounded-md shadow hover:bg-primary-300 transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {finalvalue}
          </p>
        </form>
      </div>
      {/if}
      
      
      
      
      
      {#if activeTab === "Certificates of Analysis"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Analysis (COA)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Analysis (COA), please enter both the product number and the Lot/batch number.</p>
        <form on:submit={validateAndCheckSDSForm} class="space-y-2">
          <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue}
            type="text"
            id="product-number-sds"
            name="product-number-sds"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <br>
            <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch number
            </label>
            
            <div class="relative w-full">
              <input 
                type="text"
                id="product-number"
                name="product-number"
                bind:value={lotNumber}
                placeholder="E.G. 1503"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {#if lotNumber === '' || lotNumber === null}
                <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
              {/if}
            </div>
              <button
              type="submit"
              class="absolute font-semibold right-0 mt-3 mb-3 sm:mt-20 mb-10 bg-primary-500 text-white py-2 px-6 rounded-md shadow hover:bg-primary-300 transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
          {finalvalue}
          </p>
        </form>
      </div>
      {/if}
      
      
      
      
      {#if activeTab === "Certificates of Origin"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Origin (COO)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Origin (COO), please enter both the product number and the Lot/batch number.</p>
        <form on:submit={validateAndCheckSDSForm} class="space-y-2">
          <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue}
            type="text"
            id="product-number-sds"
            name="product-number-sds"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if sdsProductNumberError}
            <p class="text-red-500 text-md">{sdsProductNumberError}</p>
            {/if}
            <br>
            <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch number
            </label>
            <div class="relative w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}
            <button
              type="submit"
              class="absolute font-semibold right-0 mt-3 mb-3 mt-1 sm:mt-20 mb-10 bg-primary-500 text-white py-2 px-6 rounded-md shadow hover:bg-primary-300 transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
            {finalvalue}
          </p>
        </form>
      </div>
      {/if}
      
      
      
      
      
      {#if activeTab === "Certificates of Quality"}
      <div class="mb-6 max-sm:w-full" >
        <h2 class="text-lg font-semibold mb-4">Certificates of Quality (COQ)</h2>
        <p class="mb-6 text-md text-gray-600 mx-auto">To search for a Certificates of Quality (COQ), please enter both the product number and the Lot/batch number.</p>
        <form on:submit={validateAndCheckSDSForm} class="space-y-2">
          <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
            * Product Number
          </label>
          <div class="relative w-full">
            <input 
            bind:value={inputValue}
            type="text"
            id="product-number-sds"
            name="product-number-sds"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
            <br>
            <label for="product-number-sds" class="block text-md font-medium {sdsProductNumberError ? 'text-red-500' : 'text-gray-700'}">
              * Lot/batch number
            </label>
            <div class="relative w-full">
              <input 
            type="text"
            id="product-number"
            name="product-number"
            placeholder="E.G. 1503"
            class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          {#if lotNumber === '' || lotNumber === null}
            <p class="text-red-500 text-md mt-1">{sdsLottNumberError}</p>
          {/if}
            <button
              type="submit"
              class="absolute font-semibold right-0 mt-3 mb-3 mt-1 sm:mt-20 mb-10 bg-primary-500 text-white py-2 px-6 rounded-md shadow hover:bg-primary-300 transition duration-300"
            >
              SEARCH
            </button>
          </div>
          <p class="text-lg font-semibold text-primary-500 my-4 p-4">
            {finalvalue}
          </p>
        </form>
      </div>
      {/if}
    </div>
    
    
    
    
    
    <div class="w-full md:w-4/12 p-2 mt-1 sm:mt-32"> 
      {#if activeTab === "SafetyData Sheets"}  
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails} class="text-primary-500 hover:underline flex items-center cursor-pointer ">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[1]} on:click={toggleRotation(1)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails}
        <div class="mt-4 text-sm text-gray-600">
          <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: 1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: 1503).</p>
          <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
            <p><strong>Example:</strong></p>
            <p><code>1503</code> <span class="font-bold">Product Number</span></p>
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
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails1} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[2]} on:click={toggleRotation(2)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails1}
        <div class="mt-4 text-sm text-gray-600">
          <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: 1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: 1503).</p>
          <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
            <p><strong>Example:</strong></p>
            <p><code>1503</code> <span class="font-bold">Product Number</span></p>
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
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[3]} on:click={toggleRotation(3)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails}
        <div class="mt-4 text-xs text-gray-600">
          <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
          <h4 class="font-bold mt-2">Mallipore Products</h4>
          <h2>
            For assistance obtaining the Lot or batch number for Millipore products, please contact 
            <span class="font-bold">customer support</span>.
          </h2>
        </div>
        {/if}        
      </div>
      {/if}
      {#if activeTab === "Certificates of Analysis"}
      <div class="bg-white p-4 mx-auto self-start mt-1 sm:mt-10"> 
          <h3 class="text-md font-bold text-gray-700">Not Finding What You Are Looking For?</h3>
          <br>
          <p class="text-sm font-medium text-gray-700 mb-2">In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.</p>
          <a href="##" class="text-primary-500 font-semibold">Request COQ</a>
        </div>    
      {/if}
      
      
      
      
      
      
      {#if activeTab === "Certificates of Origin"}
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails1} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[4]} on:click={toggleRotation(4)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails1}
        <div class="mt-4 text-sm text-gray-600">
          <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: 1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: 1503).</p>
          <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
            <p><strong>Example:</strong></p>
            <p><code>1503</code> <span class="font-bold">Product Number</span></p>
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
      {#if activeTab === "Certificates of Origin"}
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[5]} on:click={toggleRotation(5)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails}
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
      {/if}
      
      
      
      
      
      {#if activeTab === "Certificates of Quality"}
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find the Product Number</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails1} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[6]} on:click={toggleRotation(6)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails1}
        <div class="mt-4 text-sm text-gray-600">
          <p>Product numbers are combined with Pack Sizes/Quantity when displayed on the website (example: 1503-25G). Please make sure you enter ONLY the product number in the Product Number field (example: 1503).</p>
          <div class="bg-gray-100 p-3 border border-gray-300 rounded mt-3">
            <p><strong>Example:</strong></p>
            <p><code>1503</code> <span class="font-bold">Product Number</span></p>
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
      {#if activeTab === "Certificates of Quality"}
      <div class="bg-white p-4 mx-auto rounded-lg shadow-md self-start mt-1 sm:mt-10"> 
        <div class="flex items-center justify-between">
          <h3 class="text-md font-medium text-gray-700">How to Find a Lot/Batch Number for COQ</h3>
          <a href="##" on:click|preventDefault={toggleProductDetails} class="text-primary-500 hover:underline flex items-center cursor-pointer">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="transition-transform duration-300 ease-in-out" 
            class:rotate-90={rotations[7]} on:click={toggleRotation(7)}>
              <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
            </svg>
          </a>          
        </div>
        {#if showProductDetails}
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
      {/if}
    </div>
  </div>
</div>