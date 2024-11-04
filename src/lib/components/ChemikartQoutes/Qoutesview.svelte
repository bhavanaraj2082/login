<script>
	let successMessage = '';
	let errorMessage = '';
	let messageContainer;
	import {
		solutionType,
		formatType,
		formData,
		AddNoted,
		Cusdetails,
		Delivery
	} from '$lib/stores/solution_stores.js';
	import { enhance } from '$app/forms';
	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;
	export let tog4;
	export let tog5;
	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		if (messageContainer) {
			messageContainer.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<form
	method="POST"
	action="?/qoutes"
	class="mx-10 p-5 bg-white rounded-lg shadow-lg space-y-4"
	use:enhance={() => {
		return async ({ result }) => {
			let message1 = '';
			let keywordError = '';
			console.log(result);
			keywordError = result.data.type;
			if (keywordError === 'success') {
				message1 = result.data.data.message;
				console.log(message1);
			} else if (keywordError === 'error') {
				message1 = result.data.data.error;
				console.log(message1);
			}
			showMessage(message1, keywordError);
		};
	}}
>
	<div class="mt-3" bind:this={messageContainer}>
		{#if errorMessage === 'success'}
			<div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
				{successMessage}
			</div>
		{:else if errorMessage === 'error'}
			<div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
				{successMessage}
			</div>
		{/if}
	</div>
	<div class="lg:flex justify-between">
		<div class="lg:flex md:flex items-center">
			<h1 class="font-semibold text-lg">Custom solution type:</h1>
			<p class="ml-2 text-gray-600">{$solutionType}</p>
		</div>
		<button type="button" class="font-semibold text-primary-500" on:click={tog}>Edit</button>
	</div>
	<div class="lg:flex justify-between">
		<div class="lg:flex md:flex items-center">
			<h1 class="font-semibold text-lg">Custom format:</h1>
			<p class="ml-2 text-gray-600">{$formatType}</p>
		</div>
		<button type="button" class="font-semibold text-primary-500" on:click={tog1()}>Edit</button>
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
		<button type="button" class="font-semibold text-primary-500" on:click={tog2()}>Edit</button>
	</div>
	<div class="lg:flex justify-between">
		<div class="lg:flex md:flex items-center">
			<h1 class="font-semibold text-lg">Additional notes:</h1>
			<p class="text-gray-600 ml-2">{$AddNoted}</p>
		</div>
		<button type="button" class="font-semibold text-primary-500" on:click={tog3()}>Edit</button>
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
		<button type="button" class="font-semibold text-primary-500" on:click={tog4()}>Edit</button>
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
		<button type="button" class="font-semibold text-primary-500" on:click={tog5()}>Edit</button>
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
	<div class="flex space-x-4 mt-5">
		<button
			type="submit"
			class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-500 focus:outline-none focus:ring focus:ring-primary-500"
		>
			Send quote request
		</button>
		<a
			href="https://chemikart.partskeys.com/quotes"
			class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-500 focus:outline-none focus:ring focus:ring-primary-500 inline-block"
		>
			Back
		</a>
	</div>
</form>
