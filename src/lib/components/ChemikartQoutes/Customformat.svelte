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
<style>
	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%; /* Position below the tooltip */
		left: 50%;
		margin-left: -5px; /* Center the triangle */
		border-width: 7px;
		border-style: solid;
		border-color: black transparent transparent transparent; /* Triangle color */
	}
</style>

<div class="pb-10 flex justify-between bg-white">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 1: Select custom solution type</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="bg-white">
	<span class="flex items-center gap-2 pt-10">
		<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-heading" />
	<h1 class="font-bold sm:text-2xl text-sm">Step 2: Select custom format</h1>
	</span>
	<br />
	<div class="mt-4 sm:ml-10 ml-0 flex flex-col sm:flex-row gap-x-20 gap-y-4 items-center sm:items-start">
		<button
			type="button"
			class={`w-full sm:w-56 border-2 rounded-md px-6 py-14 flex items-center justify-center text-center gap-2
				${selectedColor === 'Neat' ? 'border-primary-500' : ''}`}
			on:click={() => Neatsolution('Neat')}
		>
			<span class="font-medium text-sm sm:text-2xl">Neat</span>
			<div class="relative group">
				<Icon icon="ion:information" />
				<div
						class="tooltip absolute sm:text-sm text-xs hidden group-hover:block w-64 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
						style="bottom: calc(100% + 30px); left: 50%; transform: translateX(-62%);"
					  >
					  Substance in pure form, without any solvent, for maximum flexibility 
					  </div>
			</div>
		</button>
	
		<button
			type="button"
			class={`w-full sm:w-56 border-2 rounded-md px-6 py-14 flex items-center justify-center text-center gap-2
				${selectedColor === 'Solution' ? 'border-primary-500' : ''}`}
			on:click={() => Neatsolution('Solution')}
		>
			<span class="font-medium text-sm sm:text-2xl">Solution</span>
			<div class="relative group">
				<Icon icon="ion:information" />
				<div
						class="tooltip absolute sm:text-sm text-xs hidden group-hover:block w-64 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
						style="bottom: calc(100% + 30px); left: 50%; transform: translateX(-71%);"
					  >
					  Single or multiple analytes at a definable concentration in a solvent, for quick and easy use 
					  </div>
			</div>
		</button>
	</div>
	
	<input type="hidden" name="selectedColor" bind:value={selectedColor} />
	<button
		type="button"
		on:click={sub}
		class="sm:ml-10 ml-0 text-white bg-primary-500 hover:bg-primary-500 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 my-5"
	>
		continue
	</button>
</div>
<div class=" bg-white py-10">
	<span class="flex items-center gap-2">
		<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 3: Configure custom solution</h1>
	</span>
</div>
<hr /><hr />
<div class="bg-white py-10">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300"  style="stroke-width: 2;"/>
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 4: Additional notes</h1>
	</span>
</div>
<hr /><hr />
<div class="bg-white py-10">
	<span class="flex items-center gap-2">
		<Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 5: Customer details</h1>
	</span>
</div>
<hr /><hr />
<div class="bg-white py-10">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 6: Delivery information</h1>
	</span>
</div>
<hr />