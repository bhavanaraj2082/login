<script>
	import { AddNoted } from '$lib/stores/solution_stores.js';
	import { get } from "svelte/store";
	let showRequiredMessage = false;
	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;
	const handleSubmit = () => {
		if (!get(AddNoted)) {
			showRequiredMessage = true;
		} else {
			showRequiredMessage = false;
			tog3();
		}
	};
</script>
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 1: Select custom solution type
	</h1>
	<button class="font-semibold text-primary-500" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 2: Select custom format
	</h1>
	<button class="font-semibold text-primary-500" on:click={tog1()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 3: Configure custom solution
	</h1>
	<button class="font-semibold text-primary-500" on:click={tog2()}>Edit</button>
</div>
<hr />
<div class="ml-10">
	<h1 class="font-bold text-2xl my-10">Step 4: Additional notes</h1>
	<hr />
	<div class="ml-10 my-10">
	<h1 class="font-semibold my-5">Further details or requests</h1>
	<textarea
		rows="6"
		class="w-80 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
		bind:value={$AddNoted}
		name="futherdetails"
		placeholder="Add your notes here..."
	></textarea>
	<br />
	{#if showRequiredMessage}
		<p class="text-red-500">This field is required.</p>
	{/if}
	<button
		type="button"
		on:click={handleSubmit}
		class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 px-20 my-5">Save & continue</button
	>
</div>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 5: Customer details
	</h1>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 6: Delivery information
	</h1>
</div>
<hr />