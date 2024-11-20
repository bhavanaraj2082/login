<script>
	import { tick } from 'svelte';
	import { derived } from 'svelte/store'
	import { resetFormData } from  '$lib/stores/solution_stores.js';
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
<form method="POST" action="?/qoutes" class="mx-10 p-8 bg-white rounded-lg shadow-lg space-y-6"
 use:enhance={() => {return async({ result }) => {
    let message1 = '';
    let keywordError = '';
    keywordError = result.data.type;
    if (keywordError === "success") {
      message1 = result.data.data.message; 
	  location.reload()
    } else if (keywordError === "error") {
      message1 = result.data.data.error; 
    }
    showMessage(message1, keywordError);
  };
}}>

  <!-- Custom solution type -->
  <div class="lg:flex justify-between items-center">
    <div class="flex items-center">
      <h1 class="font-semibold text-lg">Custom solution type:</h1>
      <p class="ml-2 text-gray-600">{$solutionType}</p>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog}>Edit</button>
  </div>

  <!-- Custom format -->
  <div class="lg:flex justify-between items-center">
    <div class="flex items-center">
      <h1 class="font-semibold text-lg">Custom format:</h1>
      <p class="ml-2 text-gray-600">{$formatType}</p>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog1}>Edit</button>
  </div>

  <!-- Custom solution (Components) -->
  <div class="lg:flex justify-between items-center">
    <div>
      <h1 class="font-semibold text-lg">Custom solution:</h1>
      <div class="space-y-4">
        <div class="flex items-center">
          <h2 class="text-gray-600">Components:</h2>
          {#if $formData.components.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-2">
              {#each $formData.components as component}
                <div class="p-4 border rounded-lg shadow-sm">
                  {#each Object.entries(component).slice(0, 3) as [key, value]}
                    <div class="text-gray-600 mb-2">
                      <strong>{key}:</strong> {value}
                    </div>
                  {/each}
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-600">No components added yet.</p>
          {/if}
        </div>
      </div>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog2}>Edit</button>
  </div>

  <!-- Additional Notes -->
  <div class="lg:flex justify-between items-center">
    <div class="flex items-center">
      <h1 class="font-semibold text-lg">Additional notes:</h1>
      <p class="ml-2 text-gray-600">{$AddNoted}</p>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog3}>Edit</button>
  </div>

  <!-- Customer Details -->
  <div class="lg:flex justify-between items-center">
    <div>
      <h1 class="font-semibold text-lg">Customer details:</h1>
      <div class="space-y-4">
        {#each Object.entries($Cusdetails) as [key, value]}
          <div class="lg:flex md:flex items-center">
            <label for={key} class="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <p class="ml-2 text-gray-600">{value}</p>
          </div>
        {/each}
      </div>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog4}>Edit</button>
  </div>

  <!-- Delivery Details -->
  <div class="lg:flex justify-between items-center">
    <div>
      <h1 class="font-semibold text-lg">Delivery Details:</h1>
      <div class="space-y-4">
        {#each Object.entries($Delivery) as [key, value]}
          <div class="lg:flex md:flex items-center">
            <label for={key} class="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <p class="ml-2 text-gray-600">{value}</p>
          </div>
        {/each}
      </div>
    </div>
    <button type="button" class="font-semibold text-blue-600 hover:text-blue-800" on:click={tog5}>Edit</button>
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
  <input type="hidden" name="first" bind:value={$Cusdetails.First} />
  <input type="hidden" name="last" bind:value={$Cusdetails.Last} />
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

  <div class="mt-3" bind:this={messageContainer}>
    {#if errorMessage === "success"}
      <div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
        {successMessage}
      </div>
    {:else if errorMessage === 'error'}
      <div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
        {successMessage}
      </div>
    {/if}
  </div>
  
  <!-- Form buttons -->
  <div class="flex space-x-4 mt-6">
    <button type="submit" class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-500">
      Send quote request
    </button>
    <button type="button" on:click={refreshPage} class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500">
      Back
    </button>
  </div>
</form> 