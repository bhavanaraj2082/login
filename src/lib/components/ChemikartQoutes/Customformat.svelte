<script>
	import  Icon  from '@iconify/svelte'
	import { formatType } from '../../../stores/solution_stores'
	import { get } from 'svelte/store'
	import { onMount } from 'svelte';


	export let tog

	export let tog1


	let selectedColor = 'Neat';

	const Neatsolution = (type) => {
		selectedColor = type; // Set for Organic
	
		formatType.set(type)
		console.log("=====>",get(formatType))
	};

	onMount(() => {
        // Set initial value based on the store
        selectedColor = get(formatType) || 'Neat'; 
		// Default to 'Neat' if no value is set
    });



	const sub=()=>{
		const currentSelection = get(formatType);
    
    // Check if a selection has been made
    if (!currentSelection) {
		formatType.set('Neat'); // Default to Organic
      console.log('Defaulting to Neat');
    }

    console.log('Final Selection:', get(formatType));
	tog1()
	}
</script>

<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 1: Select custom solution type
	</h1>
	<button type="button" class="font-semibold text-blue" on:click={tog()}>Edit</button>
</div>
<hr>
<br />
<br />
<div class="ml-10">
	
	<h1 class="font-bold text-2xl">Step 2: Select custom format</h1>
	<br />
	<!-- <form method="POST" action="?/main2"> -->
		<div class="mt-4 flex flex-col md:flex-row lg:flex-row">
			<button type="button" class="box-content md:mx-5 lg:mx-10 h-28 md:w-56  lg:w-56 p-4 border-2 transition duration-200 ease-in-out flex items-center justify-center"
				style="border-color: {selectedColor === 'Neat' ? 'blue' : ''};"
				on:click={() => { Neatsolution("Neat") }}>
				<div class="mx-5 flex items-center">
					<div class="font-medium">Neat</div>
					<div class="relative group ml-2">
						<Icon icon="ion:information"/><span class="u-sr-only"> </span>
						<!-- <i class="mi mi-circle-information"><span class="u-sr-only"> </span></i> -->
						<!-- <span class="icon-[ph--plus-fill]"></span>	 -->
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-sm bg-white">
							Substance in pure form, without any solvent, for maximum flexibility
						</div>
					</div>
				</div>
			</button>
	
			<button type="button" class="box-content h-28 md:mx-5 lg:mx-10  md:w-56 lg:w-56 p-4 border-2 transition duration-200 ease-in-out flex items-center justify-center"
				style="border-color: {selectedColor === 'Solution' ? 'blue' : ''};"
				on:click={() => { Neatsolution("Solution") }}>
				<div class="mx-5 flex items-center">
					<div class="font-medium">Solution</div>
					<div class="relative group ml-2">
						<Icon icon="ion:information"/><span class="u-sr-only"> </span>
						<!-- <i class="mi mi-circle-information"><span class="u-sr-only"> </span></i> -->
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-sm bg-white">
							Single or multiple analytes at a definable concentration in a solvent, for quick and easy use
						</div>
					</div>
				</div>
			</button>
		</div>
	
		<input type="hidden" name="selectedColor" bind:value={selectedColor} />
	
		<button type="button" on:click={sub}
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-5">
			continue
		</button>
	<!-- </form> -->
</div>

<hr>


<div class="ml-10 my-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 3: Configure custom solution
	</h1>
</div>
<hr>


<div class="ml-10 my-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 4: Additional notes
	</h1>
</div>
<hr>


<div class="ml-10 my-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 5: Customer details
	</h1>
</div>
<hr>


<div class="ml-10 my-10">
	<h1 class="font-bold text-2xl text-black text-opacity-25">
		Step 6: Delivery information
	</h1>
</div>
<hr>


