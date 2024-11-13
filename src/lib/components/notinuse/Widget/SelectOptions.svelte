<script context="module">
  import selectOptions from '$lib/data/OrderWidget/selectOptions.json'; 
  import { currentstep } from '$lib/OrderWidget/store.js';
</script>

<script>
  let sectorOptions = (selectOptions.sectors || []).map(s => s.name);
  let selectedSectors = [];
  let selectedScheme = "";
  let selectedYear = "";
  let selectedLab = "";
  
  let isSectorOpen = false;
  let isSchemeOpen = false;
  let isYearOpen = false;
  let isLabOpen = false;
  let showLabPopup = false; 
  
  const toggleSector = (sector) => {
    selectedSectors.includes(sector) 
      ? selectedSectors = selectedSectors.filter(s => s !== sector) 
      : selectedSectors = [...selectedSectors, sector];
  };
  
  const checkAllSectors = () => {
    selectedSectors = [...sectorOptions];
  };
  
  const uncheckAllSectors = () => {
    selectedSectors = [];
  };
  
  const getSchemeOptions = () => {
    let schemes = [];
    selectedSectors.forEach(sector => {
      const foundSector = selectOptions.sectors.find(s => s.name === sector);
      if (foundSector) {
        schemes.push(...foundSector.schemes);
      }
    });
    return [...new Set(schemes)];
  };
  
  const selectScheme = (scheme) => {
    selectedScheme = scheme;
  };
  
  const selectYear = (year) => {
    selectedYear = year;
  };
  
  const selectLab = (lab) => {
    selectedLab = lab;
    if (lab === "Browse without Lab ID") {
      showLabPopup = true; 
    }
  };
  
  const closePopup = () => {
    showLabPopup = false; 
    $currentstep = 2;
  };
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold text-red-800 mb-2">1. Select options</h1>

  <div class="grid grid-cols-4 gap-2">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
    <div class="relative w-full">
      <label class="block text-sm font-medium text-black-700">Sector</label>
      <div class="border border-gray-400 bg-yellow-400 rounded-md shadow-sm p-2 cursor-pointer text-xs"
        on:click={() => isSectorOpen = !isSectorOpen}>
        <div class="flex justify-between items-center">
          <span>{selectedSectors.length > 0 ? `${selectedSectors.length} selected` : "Choose sector"}</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        {#if isSectorOpen}
          <div class="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
            <div class="p-2 flex justify-between">
              <button class="bg-green-500 text-white text-xs px-2 py-1 rounded" on:click={checkAllSectors}>Check All</button>
              <button class="bg-red-500 text-white text-xs px-2 py-1 rounded" on:click={uncheckAllSectors}>Uncheck All</button>
            </div>
            <ul class="p-2 max-h-40 overflow-y-auto text-xs text-left">
              {#each sectorOptions as sector}
                <li class="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100" on:click={() => toggleSector(sector)}>
                  <input type="checkbox" id={sector} checked={selectedSectors.includes(sector)} class="mr-2">
                  <label for={sector}>{sector}</label>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <div class="relative w-full">
      <label class="block text-sm font-medium text-black-700">Scheme</label>
      <div class="border border-gray-400 bg-yellow-400 rounded-md shadow-sm p-2 cursor-pointer text-xs"
        on:click={() => isSchemeOpen = !isSchemeOpen}>
        <div class="flex justify-between items-center">
          <span>{selectedScheme ? selectedScheme : "Choose scheme"}</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        {#if isSchemeOpen}
          <div class="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
            <ul class="p-2 max-h-40 overflow-y-auto text-xs text-left">
              {#each getSchemeOptions() as scheme}
                <li class="py-1 px-2 cursor-pointer hover:bg-gray-100" on:click={() => selectScheme(scheme)}>
                  <span>{scheme}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <div class="relative w-full">
      <label class="block text-sm font-medium text-black-700">Year</label>
      <div class="border border-gray-400 bg-yellow-400 rounded-md shadow-sm p-2 cursor-pointer text-xs"
        on:click={() => isYearOpen = !isYearOpen}>
        <div class="flex justify-between items-center">
          <span>{selectedYear ? selectedYear : "Choose year"}</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        {#if isYearOpen}
          <div class="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
            <ul class="p-2 max-h-40 overflow-y-auto text-xs text-left">
              <li class="py-1 px-2 cursor-pointer hover:bg-gray-100" on:click={() => selectYear("January 2025-December 2025")}>
                <span>January 2025-December 2025</span>
              </li>
              <li class="py-1 px-2 cursor-pointer hover:bg-gray-100" on:click={() => selectYear("January 2024-December 2024")}>
                <span>January 2024-December 2024</span>
              </li>
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <div class="relative w-full">
      <label class="block text-sm font-medium text-black-700">Lab</label>
      <div class="border border-gray-400 bg-yellow-400 rounded-md shadow-sm p-2 cursor-pointer text-xs"
        on:click={() => isLabOpen = !isLabOpen}>
        <div class="flex justify-between items-center">
          <span>{selectedLab ? selectedLab : "Choose lab"}</span>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        {#if isLabOpen}
          <div class="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
            <ul class="p-2 max-h-40 overflow-y-auto text-xs text-left">
              <li class="py-1 px-2 cursor-pointer hover:bg-gray-100" on:click={() => selectLab("Browse without Lab ID")}>
                <span>Browse without Lab ID</span>
              </li>
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if showLabPopup}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 w-1/3">
        <h2 class="text-lg font-bold">Please select your Lab ID if you have one</h2><br>
        <p>Note that browsing is possible but pricing details and the ability to check out are restricted when no Lab ID is selected.</p>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" on:click={closePopup}>Close</button>
      </div>
    </div>
  {/if}
</div>
