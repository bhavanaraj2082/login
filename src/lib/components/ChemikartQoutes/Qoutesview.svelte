<script>
	import { tick } from 'svelte';
	import { derived } from 'svelte/store'
	import { resetFormData } from  '$lib/stores/solution_stores.js';
  import { toast, Toaster } from "svelte-sonner";
		let successMessage = '';
		let errorMessage = '';
		let messageContainer;
		function refreshPage() {
			resetFormData();
			tog();
		}
		import {
			solutionType,
			formatType,
			formData,
			AddNoted,
			Cusdetails,
			Delivery
		} from  '$lib/stores/solution_stores.js';
		import { enhance } from '$app/forms'
		export let tog
			export let tog1
			export let tog2
			export let tog3
			export let tog4
			export let tog5
		function showMessage(message1, keywordError) {
			successMessage = message1;
			errorMessage = keywordError;
			tick().then(() => {
				if (messageContainer) {
					messageContainer.scrollIntoView({ behavior: 'smooth' });
				}
			});
		}


  const componentsString = derived(formData, $formData => JSON.stringify($formData.components))

	</script>
<form method="POST" action="?/qoutes" class="mb-4 space-y-6"
 use:enhance={() => {return async({ result }) => {
    let message1 = '';
    let keywordError = '';
    // console.log("result form",result);
    // console.log("result.data.data.record.quoteId form",result.data.data.record.quoteId);
    keywordError = result.data.type;
    let quoteNo ='';
    quoteNo = result.data.quoteId;
        if (keywordError === "success") {
      message1 = result.data.data.message; 
      toast.success(message1);
      setTimeout(() => {
        location.reload();
      }, 2000)
    } else if (keywordError === "error") {
      message1 = result.data.data.error;
      toast.error(message1); 
    }
    showMessage(message1, keywordError);
  };
}}>

<!-- <div class="mt-3" bind:this={messageContainer}>
  {#if errorMessage === "success"}
    <div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
      {successMessage}
    </div>
  {:else if errorMessage === 'error'}
    <div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
      {successMessage}
    </div>
  {/if}
</div> -->

  <!-- Custom solution type -->
   
  <div class="sm:flex justify-between items-center">
    <div class="flex items-center">
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog}>Edit</button>
      <h1 class="font-semibold sm:text-lg text-sm">Custom solution type:</h1>
      <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$solutionType}</p>
    </div>
    <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 hidden sm:block" on:click={tog}>Edit</button>
  </div>

  <!-- Custom format -->
  <div class="sm:flex justify-between items-center">
    <div class="flex items-center">
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog1}>Edit</button>
      <h1 class="font-semibold sm:text-lg text-sm">Custom format:</h1>
      <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formatType}</p>
    </div>
    <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 hidden sm:block" on:click={tog1}>Edit</button>
  </div>

  <!-- Custom solution (Components) -->
  <div class="sm:flex justify-between items-center ">
    <div class="flex items-center">
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog2}>Edit</button>
      <h1 class="font-semibold sm:text-lg text-sm">Configure custom solution:</h1>
    </div>
    <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 hidden sm:block" on:click={tog2}>Edit</button>
  </div>
  <div  class="border-2 border-gray-100 rounded p-3">
    <h2 class="text-black sm:text-sm text-xs font-medium mb-1">Components:</h2>

  <div class="flex flex-col sm:flex-row items-start sm:items-center">
    {#if $formData.components.length > 0}
      <!-- <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 ml-1 sm:ml-2 w-full">
        {#each $formData.components as component}
          <div class="p-2 sm:border rounded shadow-sm  sm:sm:text-lg text-xs w-full max-w-full break-words">
            {#each Object.entries(component).slice(0, 3) as [key, value]}
              <div class="text-gray-600 pb-1 sm:text-sm text-xs">
                <strong>{key}:</strong> {value}
              </div>
            {/each}
          </div>
        {/each}
      </div> -->
      <div class="w-full overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200">
              {#if $formData.components.length > 0}
                {#each Object.keys($formData.components[0]).slice(0, 3) as key}
                  <th class="border border-gray-300 p-1 text-left text-black sm:text-100s text-xs font-medium">{key}</th>
                {/each}
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each $formData.components as component}
              <tr>
                {#each Object.values(component).slice(0, 3) as value}
                  <td class="border border-gray-300 text-gray-600 sm:text-sm text-xs p-2">{value}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      {:else}
      <p class="text-gray-600 mt-4">No components added yet.</p>
    {/if}
  </div>
  <div class="flex items-center mt-2 mb-2">
    <label for="solvent" class="text-black sm:text-sm text-xs font-medium">Solvent:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.solvent}</p>
  </div>
  <div class="flex items-center mt-1 mb-2">
    <label for="packagingType" class="text-black sm:text-sm text-xs font-medium">Packaging Type:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.packagingType}</p>
  </div>
  <div class="flex items-center mt-1 mb-2">
    <label for="volume" class="text-black sm:text-sm text-xs font-medium">Volume:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.volume}</p>
  </div>
  <div class="flex items-center mt-1 mb-2">
    <label for="units" class="text-black sm:text-sm text-xs font-medium">Units:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.units}</p>
  </div>
  <div class="flex items-center mt-1 mb-2">
    <label for="qualityLevel" class="text-black sm:text-sm text-xs font-medium">Quality Level:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.qualityLevel}</p>
  </div>
  <div class="flex items-center mt-1 mb-2">
    <label for="analyticalTechnique" class="text-black sm:text-sm text-xs font-medium">Analytical Technique:</label>
    <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$formData.analyticalTechnique}</p>
  </div>
</div>
  
  <!-- Additional Notes -->
  <div class="sm:flex justify-between items-center">
    <div class="flex items-center">
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog3}>Edit</button>
      <h1 class="font-semibold sm:text-lg text-sm">Additional notes:</h1>
      <p class="ml-2 text-gray-600 sm:text-sm text-xs">{$AddNoted}</p>
    </div>
    <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 hidden sm:block" on:click={tog3}>Edit</button>
  </div>

  <!-- Customer Details -->
   <div class="md:block hidden">
  <div class="flex flex-col sm:flex-row gap-36 w-full">
    <div class="sm:flex justify-between items-center ">
      <div class="flex items-center">
        <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog4}>Edit</button>
        <h1 class="font-semibold sm:text-lg text-sm">Customer Details:</h1>
      </div>
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 ml-5 hidden sm:block" on:click={tog4}>Edit</button>
    </div>

    <div class="sm:flex justify-between items-center ">
      <div class="flex items-center">
        <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog5}>Edit</button>
        <h1 class="font-semibold sm:text-lg text-sm">Delivery information:</h1>
      </div>
      <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs sm:mt-0 mt-5 hidden sm:block ml-5" on:click={tog5}>Edit</button>
    </div>
  </div>
</div>











<div class="flex flex-col sm:flex-row gap-x-16 gap-y-4 w-full">
  <div class="flex items-center sm:hidden block">
    <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog4}>Edit</button>
    <h1 class="font-semibold sm:text-lg text-sm">Customer Details:</h1>
  </div>
<div class=" rounded pr-28 pl-2 py-2 space-y-4 border border-gray-300">
    {#each Object.entries($Cusdetails) as [key, value]}
<div class="flex items-center">
<label for={key} class="text-black sm:text-sm text-xs font-medium ml-1">
  {key === 'LGC' ? 'Invoice Number' : key.charAt(0).toUpperCase() + key.slice(1)}:
</label>
<p class="ml-2 text-gray-600 sm:text-sm text-xs">{value}</p>
</div>
{/each}
</div>
<div class="flex items-center sm:hidden block">
  <button type="button" class="font-semibold text-primary-500 hover:text-primary-600 sm:text-base text-xs mr-5 block sm:hidden" on:click={tog5}>Edit</button>
  <h1 class="font-semibold sm:text-lg text-sm">Delivery information:</h1>
</div>
<div class="rounded pr-36 pl-2 py-2 space-y-4 border border-gray-300">
    {#each Object.entries($Delivery) as [key, value]}
<div class="flex items-center">
<label for={key} class="text-black sm:text-sm text-xs font-medium ml-1">
  {key === 'Country' ? 'State' : 
   key === 'County' ? 'GST' : 
   key.charAt(0).toUpperCase() + key.slice(1)}:
</label>
<p class="ml-2 text-gray-600 sm:text-sm text-xs">{value}</p>
</div>
{/each}
</div>
</div>
































  <!-- Hidden Inputs -->
  <input type="hidden" name="solutionValue" bind:value={$solutionType} />
  <input type="hidden" name="selectedColor" bind:value={$formatType} />
  <input type="hidden" name="components" bind:value={$componentsString} />
  <input type="hidden" name="qualityLevel" bind:value={$formData.qualityLevel} />
  <input type="hidden" name="analyticalTechnique" bind:value={$formData.analyticalTechnique} />
  <input type="hidden" name="solvent" bind:value={$formData.solvent} />
  <input type="hidden" name="packagingType" bind:value={$formData.packagingType} />
  <input type="hidden" name="volume" bind:value={$formData.volume} />
  <input type="hidden" name="units" bind:value={$formData.units} />
  <input type="hidden" name="futherdetails" bind:value={$AddNoted} />
  <input type="hidden" name="title" bind:value={$Cusdetails.Title} />
  <input type="hidden" name="first" bind:value={$Cusdetails.FirstName} />
  <input type="hidden" name="last" bind:value={$Cusdetails.LastName} />
  <input type="hidden" name="organisation" bind:value={$Cusdetails.Organisation} />
  <input type="hidden" name="country" bind:value={$Cusdetails.Country} />
  <input type="hidden" name="lgc" bind:value={$Cusdetails.LGC} />
  <input type="hidden" name="email" bind:value={$Cusdetails.Email} />
  <input type="hidden" name="number" bind:value={$Cusdetails.Number} />
  <input type="hidden" name="address1" bind:value={$Delivery.Address1} />
  <input type="hidden" name="address2" bind:value={$Delivery.Address2} />
  <input type="hidden" name="country1" bind:value={$Delivery.Country} />
  <input type="hidden" name="county" bind:value={$Delivery.County} />
  <input type="hidden" name="city" bind:value={$Delivery.City} />
  <input type="hidden" name="post" bind:value={$Delivery.Post} />
  <input type="hidden" name="status" value="unread" />
  
  <!-- Form buttons -->
  <div class="flex space-x-4 mt-6 justify-end">
    <button type="submit" class="rounded sm:text-sm text-xs sm:px-5 px-2 py-3 bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-500">
      Send quote request
    </button>
    <!-- <button type="button" on:click={refreshPage} class="px-6 py-3 bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-500">
      Back
    </button> -->
  </div>
</form> 
<Toaster position="bottom-right" richColor/>