<script>
  import sampleData from '$lib/data/OrderWidget/sample.json';
  import { selectedSample } from "$lib/OrderWidget/store.js"; 

  let chemistryChecked = false;
  let microbiologyChecked = false;
  let newSamplesChecked = false;
  let newSamplesChemistryChecked = false;

  let chemistryExpanded = true;
  let microbiologyExpanded = true;
  let newSamplesExpanded = true;
  let newSamplesChemistryExpanded = true;

  const samples = {
    chemistry: sampleData.sample_categories[1].subcategories[0].samples,
    microbiology: sampleData.sample_categories[1].subcategories[1].samples,
    newSamples: {
      chemistry: sampleData.sample_categories[0].subcategories[0].samples,
    },
  };

  let selectedSamples = [];
  let currentSample = null;

  function toggleSampleSelection(sample) {
    const index = selectedSamples.indexOf(sample);
    if (index === -1) {
      selectedSamples.push(sample);
      currentSample = sample; 
    } else {
      selectedSamples.splice(index, 1);
      currentSample = null; 
    }
    selectedSample.set(selectedSamples); 
  }

  function toggleExpansion(type) {
    type.expanded = !type.expanded;
    if (type.checked) type.expanded = false;
  }

  function expandAll() {
    chemistryExpanded = true;
    microbiologyExpanded = true;
    newSamplesExpanded = true;
    newSamplesChemistryExpanded = true;
  }

  function collapseAll() {
    chemistryExpanded = false;
    microbiologyExpanded = false;
    newSamplesExpanded = false;
    newSamplesChemistryExpanded = false;
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold text-red-800 mb-2">2. Select sample(s)</h1>
</div>

<div class="flex justify-center items-start min-h-screen p-4">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <div class="bg-white shadow-lg rounded-lg flex border border-gray-300 max-w-screen-lg w-full">

    <div class="w-2/3 p-3 border-r border-gray-300 overflow-auto h-[600px]">
      <h2 class="text-base font-semibold text-black-700 mb-2">Samples</h2>

      <div class="bg-blue-100 p-4 mb-4 border border-blue-300 rounded text-xs">
        <div class="flex justify-between items-center">
          <span class="text-black-900">Tick all samples required</span>
          <div>
            <button on:click={expandAll} class="text-blue-600 hover:bg-blue-200 p-1 rounded transition">Expand All</button>
            <button on:click={collapseAll} class="text-blue-600 hover:bg-blue-200 p-1 rounded transition">Collapse All</button>
          </div>
        </div>
      </div>

      <div class="text-xs overflow-auto h-[480px]">
        <div class="mb-4">
          <div class="flex items-center">
            <input type="checkbox" bind:checked={newSamplesChecked} on:change={() => toggleExpansion({ expanded: newSamplesExpanded, checked: newSamplesChecked })} class="mr-2" />
            <h3 class="font-bold text-black-800">New Samples</h3>
          </div>
          {#if newSamplesExpanded}
            <div class="pl-4 mt-2">
              <div class="flex items-center">
                <input type="checkbox" bind:checked={newSamplesChemistryChecked} on:change={() => toggleExpansion({ expanded: newSamplesChemistryExpanded, checked: newSamplesChemistryChecked })} class="mr-2" />
                <h4 class="font-bold text-black-600">Chemistry</h4>
              </div>
              {#if newSamplesChemistryExpanded}
                <ul class="pl-4 mt-2">
                  {#each samples.newSamples.chemistry as sample}
                    <li class="mb-2 flex items-center">
                      <input type="checkbox" on:change={() => toggleSampleSelection(sample)} class="mr-2" />
                      <span class="cursor-pointer text-gray-600 hover:underline" on:click={() => toggleSampleSelection(sample)}>
                        {sample.name}
                      </span>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>

        <div class="mb-4">
          <div class="flex items-center">
            <input type="checkbox" bind:checked={chemistryChecked} on:change={() => toggleExpansion({ expanded: chemistryExpanded, checked: chemistryChecked })} class="mr-2" />
            <h3 class="font-bold text-black-800">Chemistry</h3>
          </div>
          {#if chemistryExpanded}
            <ul class="pl-4 mt-2">
              {#each samples.chemistry as sample}
                <li class="mb-2 flex items-center">
                  <input type="checkbox" on:change={() => toggleSampleSelection(sample)} class="mr-2" />
                  <span class="cursor-pointer text-gray-600 hover:underline" on:click={() => toggleSampleSelection(sample)}>
                    {sample.name}
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <div class="mt-4">
          <div class="flex items-center">
            <input type="checkbox" bind:checked={microbiologyChecked} on:change={() => toggleExpansion({ expanded: microbiologyExpanded, checked: microbiologyChecked })} class="mr-2" />
            <h3 class="font-bold text-black-800">Microbiology</h3>
          </div>
          {#if microbiologyExpanded}
            <ul class="pl-4 mt-2">
              {#each samples.microbiology as sample}
                <li class="mb-2 flex items-center">
                  <input type="checkbox" on:change={() => toggleSampleSelection(sample)} class="mr-2" />
                  <span class="cursor-pointer text-gray-600 hover:underline" on:click={() => toggleSampleSelection(sample)}>
                    {sample.name}
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>

    <div class="w-1/3 p-4 bg-gray-100 rounded-lg">
      <h2 class="text-lg font-bold mb-4">Sample Information</h2>
      <div class="border border-gray-300 bg-white p-4 rounded-lg">
        {#if currentSample}
          <div>
            <h3 class="text-lg font-semibold">{currentSample.name}</h3>
            <h1 class="text-sm font-bold text-gray-800 mb-2">Product Attributes</h1>
            <h1 class="text-sm font-bold text-gray-800 mb-2">Format</h1>
            <p class="mt-2 text-sm text-gray-700">1 x 100ml fruit juice test material</p>
            <h1 class="text-sm font-bold text-gray-800 mb-2">Analytes</h1>
            <p class="mt-2 text-sm text-gray-700">Antimony / Iron / Tin / Cadmium / Lead / Zinc / Arsenic</p>
          </div>
        {:else}
          <p class="text-sm text-black-500">Click on a sample to view details.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
