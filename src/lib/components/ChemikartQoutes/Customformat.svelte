<script>
	import Icon from '@iconify/svelte';
	import { formatType } from '$lib/stores/solution_stores.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	export let tog;
	export let tog1;
	let selectedColor = 'Neat';
	const Neatsolution = (type) => {
		selectedColor = type;
		formatType.set(type);
	};
	onMount(() => {
		selectedColor = get(formatType) || 'Neat';
	});
	const sub = () => {
		const currentSelection = get(formatType);
		if (!currentSelection) {
			formatType.set('Neat');
		}
		tog1();
	};
</script>

<div class="py-10 flex justify-between bg-white">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 1: Select custom solution type</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="bg-white">
	<h1 class="font-bold text-2xl py-10">Step 2: Select custom format</h1>
	<br />
	<div class="flex flex-col md:flex-row lg:flex-row">
		<button
			type="button"
			class="box-content md:mx-5 lg:mx-10 h-28 md:w-56 lg:w-56 p-4 border-2 transition duration-200 ease-in-out flex items-center justify-center
				{selectedColor === 'Neat' ? 'border-primary-500' : ''}"
			on:click={() => {
				Neatsolution('Neat');
			}}
		>
			<div class="mx-5 flex items-center">
				<div class="font-medium">Neat</div>
				<div class="relative group ml-2">
					<Icon icon="ion:information" /><span class="u-sr-only"> </span>
					<div
						class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-sm bg-white"
					>
						Substance in pure form, without any solvent, for maximum flexibility
					</div>
				</div>
			</div>
		</button>
		<button
			type="button"
			class="box-content mt-4 sm:mt-0 h-28 md:mx-5 lg:mx-10 md:w-56 lg:w-56 p-4 border-2 transition duration-200 ease-in-out flex items-center justify-center
    {selectedColor === 'Solution' ? 'border-primary-500' : ''}"
			on:click={() => {
				Neatsolution('Solution');
			}}
		>
			<div class="mx-5 flex items-center">
				<div class="font-medium">Solution</div>
				<div class="relative group ml-2">
					<Icon icon="ion:information" /><span class="u-sr-only"> </span>
					<div
						class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-sm bg-white"
					>
						Single or multiple analytes at a definable concentration in a solvent, for quick and
						easy use
					</div>
				</div>
			</div>
		</button>
	</div>
	<input type="hidden" name="selectedColor" bind:value={selectedColor} />
	<button
		type="button"
		on:click={sub}
		class="sm:ml-10 ml-0 lg:ml-10 text-white bg-primary-500 hover:bg-primary-500 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
	>
		continue
	</button>
</div>
<hr />
<div class=" bg-white py-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 3: Configure custom solution</h1>
</div>
<hr />
<div class="bg-white py-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 4: Additional notes</h1>
</div>
<hr />
<div class="bg-white py-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 5: Customer details</h1>
</div>
<hr />
<div class="bg-white py-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 6: Delivery information</h1>
</div>
<hr />