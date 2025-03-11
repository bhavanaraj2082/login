<script>
	import { solutionType } from '$lib/stores/solution_stores.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Icon from "@iconify/svelte";
	export let tag;
	let solutionValue = 'Organic';
	onMount(() => {
		solutionValue = get(solutionType) || 'Organic';
	});
	const selectOrgan = (type) => {
		solutionValue = type;
		solutionType.set(type);
	};
	const organ = () => {
		const currentSelection = get(solutionType);
		if (!currentSelection) {
			solutionType.set('Organic');
		}
		tag();
	};
</script>
<div class="bg-white">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6" />
		<h1 class="font-bold sm:text-2xl text-sm">Step 1: Select custom solution type</h1>
	</span>
		<br />
	<div class="mt-4 sm:ml-10 ml-0 flex flex-col sm:flex-row gap-x-20 gap-y-4 items-center sm:items-start">
		<button
			type="button"
			class={`w-full sm:w-56 border-2 rounded-md px-6 py-14 flex items-center justify-center text-center ${solutionValue === 'Organic' ? 'border-primary-500' : ''}`}
			on:click={() => selectOrgan('Organic')}
		>
			<span class="font-medium text-sm sm:text-2xl">Organic</span>
		</button>
	
		<button
			type="button"
			class={`w-full sm:w-56 border-2 rounded-md px-6 py-14 flex items-center justify-center text-center ${solutionValue === 'Inorganic' ? 'border-primary-500' : ''}`}
			on:click={() => selectOrgan('Inorganic')}
		>
			<span class="font-medium text-sm sm:text-2xl">Inorganic</span>
		</button>
	</div>
	
	<input type="hidden" name="solutionValue" bind:value={solutionValue} />
	<button
		type="button"
		on:click={organ}
		class="sm:ml-10 ml-0 text-white bg-primary-500 hover:bg-primary-500 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 my-5"
	>
		Continue
	</button>
</div>
<ul class="bg-white">
	<li>
		<span class="flex items-center gap-2">
			<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-gray-300" />
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25 py-10">
				Step 2: Select custom format
			</h1>
		</span>
	</li>
	<hr /><hr />
	<li>
		<span class="flex items-center gap-2">
			<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
		<h1 class="font-bold sm:text-2xl text-sm my-10 text-black text-opacity-25">
			Step 3: Configure custom solution
		</h1>
		</span>
	</li>
	<hr /><hr />
	<li>
		<span class="flex items-center gap-2">
			<Icon icon="arcticons:youdao-note" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300"  style="stroke-width: 2;" />
		<h1 class="font-bold sm:text-2xl text-sm my-10 text-black text-opacity-25">Step 4: Additional notes</h1>
		</span>
	</li>
	<hr /><hr />
	<li>
		<span class="flex items-center gap-2">
			<Icon icon="mdi:user-details-outline" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
		<h1 class="font-bold sm:text-2xl text-sm my-10 text-black text-opacity-25">Step 5: Customer details</h1>
		</span>
	</li>
	<hr /><hr />
	<li>
		<span class="flex items-center gap-2">
			<Icon icon="material-symbols-light:delivery-truck-speed-outline" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
		<h1 class="font-bold sm:text-2xl text-sm my-10 text-black text-opacity-25">
			Step 6: Delivery information
		</h1>
		</span>
	</li>
</ul>