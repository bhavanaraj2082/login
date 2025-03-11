<script>
	import { AddNoted } from '$lib/stores/solution_stores.js';
	import { get } from "svelte/store";
	import Icon from '@iconify/svelte';
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
<div class="pb-10 flex justify-between bg-white ">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
		Step 1: Select custom solution type
	</h1>
	</span>
	<button class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="py-10 flex justify-between bg-white ">
	<span class="flex items-center gap-2">
		<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
		Step 2: Select custom format
	</h1>
	</span>
	<button class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog1()}>Edit</button>
</div>
<hr /><hr />
<div class=" py-10 flex justify-between bg-white ">
	<span class="flex items-center gap-2">
		<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
		Step 3: Configure custom solution
	</h1>
	</span>
	<button class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog2()}>Edit</button>
</div>
<hr /><hr />
<div class="bg-white ">
	<span class="flex items-center gap-2 pt-10">
		<Icon icon="arcticons:youdao-note" class="sm:w-8 sm:h-8 w-6 h-6 text-heading"  style="stroke-width: 2;"/>
	<h1 class="font-bold sm:text-2xl text-sm  bg-white ">Step 4: Additional notes</h1>
	</span>
	<div class="bg-white sm:ml-10 ml-0">
	<h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm">Further details or requests</h1>
	<textarea
		rows="6"
		class="w-5/6 sm:w-80 p-2 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500
		border-1 focus:border-primary-500 placeholder:text-sm sm:text-sm text-xs"
		bind:value={$AddNoted}
		name="futherdetails"
		placeholder="Add your notes here..."
	></textarea>
	<br />
	{#if showRequiredMessage}
		<p class="text-red-500 text-sm font-medium ml-1">This field is required.</p>
	{/if}
	<button
		type="button"
		on:click={handleSubmit}
		class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 my-5">Save & continue</button
	>
</div>
</div>
<div class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="mdi:user-details-outline" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
		Step 5: Customer details
	</h1>
	</span>
</div>
<hr /><hr />
<div class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols-light:delivery-truck-speed-outline" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
		Step 6: Delivery information
	</h1>
	</span>
</div>
<hr />