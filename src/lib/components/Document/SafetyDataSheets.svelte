<script>

  let showProductDetails =false;
  let showLotDetails = false;
  let activeTab = "Safety Data Sheets";
  const tabs = [
    { name: "Safety Data Sheets" },
    { name: "Certificates of Analysis" },
    { name: "Certificates of Origin" },
    { name: "Certificates of Quality" },
  ];
   
   function toggleProductDetails() {
    showProductDetails = !showProductDetails;
  }
  
   function toggleLotDetails() {
    showLotDetails = !showLotDetails;
  }
</script>
<div class="max-w-7xl mx-auto px-6 py-8">
<h1 class="text-4xl font-bold mb-8">Documents</h1>
<div class="absolute top-8 right-8 bg-white px-3 py-2 rounded-md border border-orange-200 flex space-x-2 shadow-sm">
    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" class="text-orange-500 flex-shrink-0">
      <path fill="currentColor" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z"/>
    </svg>
    <span class="text-black-500 text-xs leading-snug">
      Sign in to import items<br>from your recent orders and quotes.
    </span>
  </div>

 
  <div class="inline-flex bg-orange-100 p-0 rounded-md mb-8">
    <nav class="flex space-x-8" aria-label="Tabs">
      {#each tabs as tab}
        <button
          on:click={() => (activeTab = tab.name)} 
          class="py-2 px-4 border-b-2 font-medium text-sm focus:outline-none transition duration-300"
          class:border-orange-500={activeTab === tab.name}
          class:text-orange-600={activeTab === tab.name}
          class:text-gray-500={activeTab !== tab.name}>
          {tab.name}
        </button>
      {/each}
    </nav>
  </div>

  
  <div class="flex flex-col lg:flex-row gap-8 items-start">
    
    <div class="flex-1">
      
      {#if activeTab === "Safety Data Sheets"}
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-orange-400 mb-4">Safety Data Sheets (SDS)</h2>
          <p class="mb-6 text-gray-600">
            To search for a Safety Data Sheet, please enter the product number.
          </p>
          <form class="space-y-2">
            <label for="product-number-sds" class="block text-sm font-medium text-gray-700">
              * Product Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="product-number-sds"
                name="product-number-sds"
                placeholder="E.G. T1503"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button
                type="submit"
                class="absolute right-0 bottom-0 transform translate-x-1 translate-y-20 bg-orange-400 text-white py-2 px-6 rounded-md shadow hover:bg-orange-600 transition duration-300"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      {/if}

      {#if activeTab === "Certificates of Analysis"}
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-orange-400 mb-4">Certificates of Analysis (COA)</h2>
          <p class="mb-6 text-gray-600">
            To search for a Certificate of Analysis (COA), please enter the product number <br>and the lot/batch number.
          </p>
          <form class="space-y-2">
            <label for="product-number-coa" class="block text-sm font-medium text-gray-700">
              * Product Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="product-number-coa"
                name="product-number-coa"
                placeholder="E.G. T1503"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <label for="lot-number-coa" class="block text-sm font-medium text-gray-700">
              * Lot/Batch Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="lot-number-coa"
                name="lot-number-coa"
                placeholder="E.G. 023J431"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button
                type="submit"
                class="absolute right-0 bottom-0 transform translate-x-1 translate-y-20 bg-orange-400 text-white py-2 px-6 rounded-md shadow hover:bg-orange-600 transition duration-300"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      {/if}

     
      {#if activeTab === "Certificates of Origin"}
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-orange-400 mb-4">Certificates of Origin (COO)</h2>
          <p class="mb-6 text-gray-600">
            To search for a Certificate of Origin (COO), please enter the product number <br>and the lot/batch number.
          </p>
          <form class="space-y-2">
            <label for="product-number-coo" class="block text-sm font-medium text-gray-700">
              * Product Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="product-number-coo"
                name="product-number-coo"
                placeholder="E.G. T1503"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <label for="lot-number-coo" class="block text-sm font-medium text-gray-700">
              * Lot/Batch Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="lot-number-coo"
                name="lot-number-coo"
                placeholder="E.G. 023J431"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button
                type="submit"
                class="absolute right-0 bottom-0 transform translate-x-1 translate-y-20 bg-orange-400 text-white py-2 px-6 rounded-md shadow hover:bg-orange-600 transition duration-300"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      {/if}

    
      {#if activeTab === "Certificates of Quality"}
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-orange-400 mb-4">Certificates of Quality (CQ)</h2>
          <p class="mb-6 text-gray-600">
            To search for a Certificate of Quality (CQ), please enter the product number <br>and the lot/batch number.
          </p>
          <form class="space-y-2">
            <label for="product-number-cq" class="block text-sm font-medium text-gray-700">
              * Product Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="product-number-cq"
                name="product-number-cq"
                placeholder="E.G. T1503"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <label for="lot-number-cq" class="block text-sm font-medium text-gray-700">
              * Lot/Batch Number
            </label>
            <div class="relative w-2/3">
              <input
                type="text"
                id="lot-number-cq"
                name="lot-number-cq"
                placeholder="E.G. 023J431"
                class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
              <button
                type="submit"
                class="absolute right-0 bottom-0 transform translate-x-1 translate-y-20 bg-orange-400 text-white py-2 px-6 rounded-md shadow hover:bg-orange-600 transition duration-300"
              >
                SEARCH
              </button>
            </div>
          </form>
        </div>
      {/if}
    </div>
    
    
    <script>
      let activeTab = "Safety Data Sheets";
      let showProductDetails = false;
    
      function toggleProductDetails() {
        showProductDetails = !showProductDetails;
      }
    </script>
    
    <div class="flex flex-col space-y-4">
      
      {#if activeTab === "Safety Data Sheets"}
        <div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4"> 
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-700">How to Find the Product Number</h3>
            <a on:click={toggleProductDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
              </svg>
            </a>
          </div>
          {#if showProductDetails}
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
 
  <div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4"> 
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-700">How to Find the Product Number</h3>
      <a on:click={toggleProductDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
        </svg>
      </a>
    </div>
    {#if showProductDetails}
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

  
  <div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
      <a on:click={toggleLotDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14.59 16.003L5.983 7.397l1.414-1.415l8.607 8.607V7.003h2v11h-11v-2z"/>
        </svg>
      </a>
    </div>
    {#if showLotDetails}
      <div class="mt-4 text-sm text-gray-600">
        <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
        <h4 class="font-bold mt-2">Aldrich Products</h4>
        <ul class="list-disc ml-5">
          <li>For a lot number such as <code>TO09019TO</code>, enter it as <code>09019TO</code> (without the first two letters 'TO').</li>
          <li>For a lot number with a filling-code such as <code>05427ES-021</code>, enter it as <code>05427ES</code> (without the filling-code '-021').</li>
          <li>For a lot number with a filling-code such as <code>STBB0728K9</code>, enter it as <code>STBB0728</code> (without the filling-code 'K9').</li>
        </ul>
      </div>
    {/if}
  </div>

 
  <div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
    </p>
    <div class="mt-4">
      <button class="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600">
        Request COA
      </button>
    </div>
  </div>
{/if}

    

{#if activeTab === "Certificates of Origin"}

<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4"> 
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">How to Find the Product Number</h3>
    <a on:click={toggleProductDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
      </svg>
    </a>
  </div>
  {#if showProductDetails}
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


<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
    <a on:click={toggleLotDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14.59 16.003L5.983 7.397l1.414-1.415l8.607 8.607V7.003h2v11h-11v-2z"/>
      </svg>
    </a>
  </div>
  {#if showLotDetails}
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


<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
  </div>
  <p class="mt-4 text-sm text-gray-600">
    In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
  </p>
  <div class="mt-4">
    <button class="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600">
      Request COA
    </button>
  </div>
</div>
{/if}

      
{#if activeTab === "Certificates of Quality"}

<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4"> 
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">How to Find the Product Number</h3>
    <a on:click={toggleProductDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="m5.99 16.596l8.192-8.192H7.818v-2h9.778v9.778h-2V9.818L7.403 18.01z"/>
      </svg>
    </a>
  </div>
  {#if showProductDetails}
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


<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">How to Find a Lot/Batch Number for COO</h3>
    <a on:click={toggleLotDetails} class="text-orange-400 hover:underline flex items-center ml-12 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14.59 16.003L5.983 7.397l1.414-1.415l8.607 8.607V7.003h2v11h-11v-2z"/>
      </svg>
    </a>
  </div>
  {#if showLotDetails}
    <div class="mt-4 text-sm text-gray-600">
      <p>Lot and Batch Numbers can be found on a product's label following the words 'Lot' or 'Batch'.</p>
      <h4 class="font-bold mt-2">Millipore Products</h4>
      <p>For assistance obtaining the Lot or Batch number for Millipore Products, please contact Customer Support.</p>
    </div>
  {/if}
</div>


<div class="bg-white-50 p-4 border border-orange-100 rounded-lg shadow-md max-w-md self-start mt-4">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-medium text-gray-700">Not Finding What You Are Looking For?</h3>
  </div>
  <p class="mt-4 text-sm text-gray-600">
    In some cases, a COA may not be available online. If your search was unable to find the COA, you can request one.
  </p>
  <div class="mt-4">
    <button class="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600">
      Request COA
    </button>
  </div>
</div>
{/if}
</div></div></div>