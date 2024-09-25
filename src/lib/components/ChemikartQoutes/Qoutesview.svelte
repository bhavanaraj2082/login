<script>
	import {
	  solutionType,
	  formatType,
	  formData,
	  AddNoted,
	  Cusdetails,
	  Delivery
	} from '../../../stores/solution_stores';
	import { enhance } from '$app/forms'


	export let tog
    export let tog1
    export let tog2
    export let tog3
    export let tog4
    export let tog5

	function testResponse(result) {
		if (result.success) {
			alert('Quote request submitted successfully!');
		} else {
			alert(`Error: ${result.error}`);
		}
	}

  </script>
  
  <form method="POST" action="?/qoutes" use:enhance class="mx-10 p-5 bg-white rounded-lg shadow-lg space-y-4">
	<div class="lg:flex justify-between">
	<div class="lg:flex md:flex items-center">
	  <h1 class="font-semibold text-lg ">Custom solution type:</h1>
	  <p class="ml-2 text-gray-600">{$solutionType}</p>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog}>Edit</button>
	</div>
  
	<div class="lg:flex justify-between">
	<div class="lg:flex md:flex items-center">
	  <h1 class="font-semibold text-lg">Custom format:</h1>
	  <p class="ml-2 text-gray-600">{$formatType}</p>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog1()}>Edit</button>
	</div>
  
	<div class="lg:flex justify-between">
	<div>
	  <h1 class="font-semibold text-lg">Custom solution:</h1>
	  <div class="space-y-2">
		<div class="lg:flex md:flex items-center">
		  <label for="components" class="">Components:</label>
		  {#if $formData.components.length > 0}
			<ul class="ml-2 list-disc list-inside">
			  {#each $formData.components as component}
				<li class="text-gray-600">{component}</li>
			  {/each}
			</ul>
		  {:else}
			<p class="text-gray-600">No components added yet.</p>
		  {/if}
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="solvent" class="">Solvent:</label>
		  <p class="ml-2 text-gray-600">{$formData.solvent}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="packagingType" class="">Packaging Type:</label>
		  <p class="ml-2 text-gray-600">{$formData.packagingType}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="volume" class="">Volume:</label>
		  <p class="ml-2 text-gray-600">{$formData.volume}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="units" class="">Units:</label>
		  <p class="ml-2 text-gray-600">{$formData.units}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="qualityLevel" class="">Quality Level:</label>
		  <p class="ml-2 text-gray-600">{$formData.qualityLevel}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="analyticalTechnique" class="">Analytical Technique:</label>
		  <p class="ml-2 text-gray-600">{$formData.analyticalTechnique}</p>
		</div>
	  </div>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog2()}>Edit</button>
	</div>
  
	<div class="lg:flex justify-between">
	<div class="lg:flex md:flex items-center">
	  <h1 class="font-semibold text-lg ">Additional notes:</h1>
	  <p class="text-gray-600 ml-2">{$AddNoted}</p>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog3()}>Edit</button>
	</div>
  
	<div class="lg:flex justify-between">
	<div>
	  <h1 class="font-semibold text-lg">Customer details:</h1>
	  <div class="space-y-2">
		<div class="lg:flex md:flex items-center">
		  <label for="title" class=" ">Title:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Title}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="first" class=" ">First name:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.First}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="last" class=" ">Last name:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Last}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="organisation" class=" ">Organisation name:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Organisation}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="country" class=" ">Country:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Country}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="lgc" class=" ">Invoice number or LGC account number:</label>
		  {#if $Cusdetails.LGC === ''}
			<p class="ml-2 text-gray-600">NO LCG Number</p>
		  {:else}
			<p class="ml-2 text-gray-600">{$Cusdetails.LGC}</p>
		  {/if}
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="email" class=" ">Email address:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Email}</p>
		</div>
		<div class="lg:flex md:flex items-center">
		  <label for="number" class=" ">Phone number:</label>
		  <p class="ml-2 text-gray-600">{$Cusdetails.Number}</p>
		</div>
	  </div>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog4()}>Edit</button>
	</div>
  
	<div class="lg:flex justify-between">
	<div>
	  <h1 class="font-semibold text-lg">Delivery Details:</h1>
	  <div>
		<div class="space-y-2">
		  <div class="lg:flex md:flex items-center">
			<label for="address1" class="">Address 1:</label>
			<p class="ml-2 text-gray-600">{$Delivery.Address1}</p>
		  </div>
		  <div class="lg:flex md:flex items-center">
			<label for="address2" class=" ">Address 2:</label>
			<p class="ml-2 text-gray-600">{$Delivery.Address2}</p>
		  </div>
		  <div class="lg:flex md:flex items-center">
			<label for="country1" class=" ">Country:</label>
			<p class="ml-2 text-gray-600">{$Delivery.Country}</p>
		  </div>
		  <div class="lg:flex md:flex items-center">
			<label for="county" class=" ">County:</label>
			<p class="ml-2 text-gray-600">{$Delivery.County}</p>
		  </div>
		  <div class="lg:flex md:flex items-center">
			<label for="city" class="">City:</label>
			<p class="ml-2 text-gray-600">{$Delivery.City}</p>
		  </div>
		  <div class="lg:flex md:flex items-center">
			<label for="post" class="">Post code:</label>
			<p class="ml-2 text-gray-600">{$Delivery.Post}</p>
		  </div>
		</div>
	  </div>
	</div>
	<button type="button" class="font-semibold text-blue" on:click={tog5()}>Edit</button>
	</div>
  
	<input type="hidden" name="solutionValue" bind:value={$solutionType} />
	<input type="hidden" name="selectedColor" bind:value={$formatType} />
  
	{#each $formData.components as component}
	  <input type="hidden" name="components[]" bind:value={component} />
	{/each}
	
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
  
	<button type="submit" class="mt-5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring">Send quote request</button>
  </form>