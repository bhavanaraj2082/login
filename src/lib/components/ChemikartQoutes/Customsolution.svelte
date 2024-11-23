<script>
	import { solutionType } from '$lib/stores/solution_stores.js';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
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

<div class="">
	<h1 class="font-bold text-2xl">Step 1: Select custom solution type</h1>
	<br />
	<div class="mt-4 flex flex-col md:flex-row lg:flex-row">
		<button
			type="button"
			class={`box-content h-25 w-56 p-4 border-2 mx-10 ${solutionValue === 'Organic' ? 'border-primary-500' : ''}`}
			on:click={() => {
				selectOrgan('Organic');
			}}
		>
			<div class="mx-20 my-11 font-medium">Organic</div>
		</button>
		<br />
		<button
			type="button"
			class={`box-content h-25 w-56 p-4 border-2 mx-10 mt-4 sm:mt-0  ${solutionValue === 'Inorganic' ? 'border-primary-500' : ''}`}
			on:click={() => {
				selectOrgan('Inorganic');
			}}
		>
			<div class="mx-20 my-11 font-medium">Inorganic</div>
		</button>
	</div>
	<input type="hidden" name="solutionValue" bind:value={solutionValue} />
	<button
		type="button"
		on:click={organ}
		class=" ml-10 lg:ml-10 text-white bg-primary-500 hover:bg-primary-500 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
	>
		Continue
	</button>
</div>
<ul class="">
	<li>
		<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">
			Step 2: Select custom format
		</h1>
	</li>
	<hr />
	<li>
		<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">
			Step 3: Configure custom solution
		</h1>
	</li>
	<hr />
	<li>
		<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">Step 4: Additional notes</h1>
	</li>
	<hr />
	<li>
		<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">Step 5: Customer details</h1>
	</li>
	<hr />
	<li>
		<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">
			Step 6: Delivery information
		</h1>
	</li>
	<hr />
</ul>
