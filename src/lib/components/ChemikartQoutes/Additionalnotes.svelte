<script>
	import { AddNoted } from "../../../stores/solution_stores";
	import { get } from "svelte/store";

	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;

	const handleSubmit = () => {
		console.log("Details saved:", get(AddNoted)); // For debugging
		tog3();
	};
</script>

<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 1: Select custom solution type
	</h1>
	<button class="font-semibold text-blue" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 2: Select custom format
	</h1>
	<button class="font-semibold text-blue" on:click={tog1()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 3: Configure custom solution
	</h1>
	<button class="font-semibold text-blue" on:click={tog2()}>Edit</button>
</div>
<hr />

<div class="ml-10">
	<h1 class="font-bold text-2xl my-10">Step 4: Additional notes</h1>
	<hr />
	<!-- <form method="POST" action="?/addnote"> -->
	<h1 class="font-semibold my-5">Further details or requests</h1>
	<textarea
		rows="6"
		class="w-80 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
		bind:value={$AddNoted}
		name="futherdetails"
		placeholder="Add your notes here..."
	></textarea>
	<br />
	<button
		type="button"
		on:click={handleSubmit}
		class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-20 my-5"
		>Save & continue</button
	>
	<!-- </form> -->
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
