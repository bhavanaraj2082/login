<script>
	import { AddNoted } from '$lib/stores/solution_stores.js';
	import { get } from "svelte/store";
	import Icon from '@iconify/svelte';

	let showRequiredMessage = false;

	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;

	export let showStep1 = true;
	export let showStep2 = true;
	export let showStep3 = true;

	const handleSubmit = () => {
		if (!get(AddNoted)) {
			showRequiredMessage = true;
		} else {
			showRequiredMessage = false;
			tog3();
			// scrollToStep('step5');
		}
	};

	const scrollToStep = (stepId) => {
		const element = document.getElementById(stepId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	const handleEdit = (step, toggleFn) => {
		toggleFn();
		scrollToStep(step);
	};
</script>
{#if showStep1}
<div id="step1" class="pb-10 flex justify-between bg-white">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
		<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			Step 1: Select custom solution type
		</h1>
	</span>
	<button on:click={() => handleEdit('step1', tog)} class="font-semibold text-primary-500 sm:text-lg text-xs">
		Edit
	</button>
</div>
<hr />
{/if}

{#if showStep2}
<div id="step2" class="py-10 flex justify-between bg-white">
	<span class="flex items-center gap-2">
		<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
		<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			Step 2: Select custom format
		</h1>
	</span>
	<button on:click={() => handleEdit('step2', tog1)} class="font-semibold text-primary-500 sm:text-lg text-xs">
		Edit
	</button>
</div>
<hr />
{/if}

{#if showStep3}
<div id="step3" class="py-10 flex justify-between bg-white">
	<span class="flex items-center gap-2">
		<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
		<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			Step 3: Configure custom solution
		</h1>
	</span>
	<button on:click={() => handleEdit('step3', tog2)} class="font-semibold text-primary-500 sm:text-lg text-xs">
		Edit
	</button>
</div>
<hr />
{/if}

<!-- Step 4: Notes -->
<div id="step4" class="bg-white pt-10">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-heading" />
		<h1 class="font-bold sm:text-2xl text-sm">Step 4: Additional notes</h1>
	</span>
	<div class="sm:ml-10 ml-0">
		<h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm">Further details or requests</h1>
		<textarea
			rows="6"
			class="w-5/6 sm:w-80 p-2 rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500
			border-1 focus:border-primary-500 placeholder:text-sm sm:text-sm text-xs"
			bind:value={$AddNoted}
			name="furtherdetails"
			placeholder="Add your notes here..."
		></textarea>
		{#if showRequiredMessage}
			<p class="text-red-500 text-sm font-medium ml-1">This field is required.</p>
		{/if}
		
	</div>
	<button
			type="button"
			on:click={handleSubmit}
			class="text-white sm:ml-10 ml-0 bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 my-5"
		>
			Save & continue
		</button>
</div>

<!-- Step 5 -->
<div id="step5" class="py-10 bg-white flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-gray-300" />
		<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			Step 5: Customer details
		</h1>
	</span>
</div>
<hr />

<!-- Step 6 -->
<div id="step6" class="py-10 bg-white flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
		<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			Step 6: Delivery information
		</h1>
	</span>
</div>
<hr />