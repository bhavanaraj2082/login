<script>
	import { tick } from 'svelte';
	import { derived } from 'svelte/store'
	import { resetFormData } from  '$lib/stores/solution_stores.js';
	import Icon from "@iconify/svelte";
  import { toast, Toaster } from "svelte-sonner";
		let successMessage = '';
		let errorMessage = '';
		let messageContainer;
    let showSuccesDiv = false;
	  let showFailureDiv = false;
    let submitting = false;
		// function refreshPage() {
		// 	resetFormData();
		// 	tog();
		// }
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      scrollToTop();
			successMessage = message1;
			errorMessage = keywordError;
			tick().then(() => {
				if (messageContainer) {
					messageContainer.scrollIntoView({ behavior: 'smooth' });
				}
        if (keywordError === "success") {
			setTimeout(() => {
				resetFormData();
			}, 2000);
		}
			});
		}


  const componentsString = derived(formData, $formData => JSON.stringify($formData.components))

	</script>
{#if showSuccesDiv}
  <div
  class="mb-4 w-full flex items-center justify-center mx-auto max-w-7xl p-4"
>
  <div
      class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg"
  >
      <h3 class="md:text-xl text-lg font-semibold text-green-600 mb-4">
        Quotes request Submission
      </h3>
      <p class="md:text-md text-xs text-gray-700 mt-4 mb-6">
        Your form has been submitted successfully. We noted your requirements and will get back to you with quotes soon.

      </p>
      <div class="w-10/12 mx-auto my-6 border-t-1 border-green-300"></div>
      <div class="flex items-center justify-center">
          <a
              href="/"
              class="bg-white text-primary-500 border-1 border-primary-500 px-4 py-2 rounded-md font-medium hover:bg-primary-500 hover:text-white transition-all duration-300 flex justify-center items-center"
          >
              <Icon icon="mdi:home" class="text-xl mr-2" />Back to Home
          </a>
      </div>
  </div>
</div>

  {:else if showFailureDiv}
	<div
		class="pb-20 pt-20 h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10 sm:text-sm text-xs"
	>
		<div
			class="w-10/12 md:w-8/12 bg-gradient-to-r from-red-100 via-red-50 to-red-100 p-8 rounded-lg shadow-lg text-center"
		>
			<p class="sm:text-md text-sm text-gray-700 mb-6">
			There was an issue with submitting the request. Please try again after a while.
			</p>

			<div class="w-10/12 mx-auto my-6 border-t-2 border-red-300"></div>
			<div>
				<a
					href="/feedback"
					class="sm:text-sm text-xs bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
				>
				Report Issue
				</a>
			</div>
		</div>
	</div>

	{:else}
<form method="POST" action="?/qoutes" class="mb-4 space-y-6"
 use:enhance={() => {
  submitting= true;
  return async({ result }) => {
    let message1 = '';
    let keywordError = '';
    // console.log("result form",result);
    // console.log("result.data.data.record.quoteId form",result.data.data.record.quoteId);
    keywordError = result.data.type;
    let quoteNo ='';
    quoteNo = result.data.quoteId;
        if (keywordError === "success") {
      message1 = result.data.data.message; 
      submitting = false;
      // toast.success(message1);
      showSuccesDiv = true;
      // setTimeout(() => {
      //   location.reload();
      // }, 3000)
    } else if (keywordError === "error") {
      message1 = result.data.data.error;
      submitting = false;
      showFailureDiv = true;
      // toast.error(message1); 
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
    {#if key !== 'userId'}
<div class="flex items-center">
<label for={key} class="text-black sm:text-sm text-xs font-medium ml-1">
  {key === 'LGC' ? 'Invoice Number' : key.charAt(0).toUpperCase() + key.slice(1)}:
</label>
<p class="ml-2 text-gray-600 sm:text-sm text-xs">{value}</p>
</div>
{/if}
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
  <input type="hidden" name="userId" bind:value={$Cusdetails.userId} />
  <input type="hidden" name="address1" bind:value={$Delivery.Address1} />
  <input type="hidden" name="address2" bind:value={$Delivery.Address2} />
  <input type="hidden" name="country1" bind:value={$Delivery.Country} />
  <input type="hidden" name="county" bind:value={$Delivery.County} />
  <input type="hidden" name="city" bind:value={$Delivery.City} />
  <input type="hidden" name="post" bind:value={$Delivery.Post} />
  <input type="hidden" name="status" value="unread" />
  
  <!-- Form buttons -->
  <div class="flex space-x-4 mt-6 justify-end">
    <button type="submit"
    class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
    >
      {#if submitting}
    Sending...
  {:else}
  Send quote request
  {/if}
    </button>
  </div>
</form> 
{/if}

<Toaster position="bottom-right" richColor/>