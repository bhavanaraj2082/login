<script>
	
    import { solutionType } from '../../../stores/solution_stores';
    import { get } from 'svelte/store';
	import { onMount } from 'svelte';


	export let tag

    // let selectedColor = 'click';

    let solutionValue = 'Organic'; // Initialize solutionValue

	onMount(() => {
        // Set initial value based on the store
        solutionValue = get(solutionType) || 'Organic'; 
		// Default to 'Organic' if no value is set
    });

    const selectOrgan = (type) => {
		solutionValue=type
		solutionType.set(type)

    };
	

    const organ = () => {
        const currentSelection = get(solutionType);
        if (!currentSelection) {
            solutionType.set('Organic'); // Default to Organic
            console.log('Defaulting to Organic');
        }

        console.log('Final Selection:', get(solutionType));
		tag()
    };


	

</script>

<div class="ml-10">
        <h1 class="font-bold text-2xl">Step 1: Select custom solution type</h1>
        <br />
        <div class="mt-4 flex flex-col md:flex-row lg:flex-row">
            <button
                type="button"
                class="box-content h-25 w-56 p-4 border-2 mx-10"
                style="border-color: {solutionValue ==="Organic" ? 'blue' : ''};"
                on:click={()=>{selectOrgan('Organic')}}
            >
                <div class="mx-20 my-11 font-medium">Organic</div>
            </button>
			<br>
            <button
                type="button"
                class="box-content h-25 w-56 p-4 border-2 mx-10"
                style="border-color: {solutionValue ==="Inorganic" ? 'blue' : ''};"
                on:click={()=>{selectOrgan('Inorganic')}}
            >
                <div class="mx-20 my-11 font-medium">Inorganic</div>
            </button>
        </div>

		 <!-- Hidden input to send solutionValue with form submission -->
		 <input type="hidden" name="solutionValue" bind:value={solutionValue} />

		 
        <button
            type="button"
		on:click={organ}
            class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm py-2.5  px-20 my-5"
        >
            Continue
        </button>
</div>


	<ul class="ml-10">
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
	
<!-- {:else if selectedColor === 'click2'}
	<ul class="ml-10">
		<li>
			<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">
				Step 2: Configure custom solution
			</h1>
		</li>
		<hr />

		<li>
			<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">Step 3: Additional notes</h1>
		</li>
		<hr />

		<li>
			<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">Step 4: Customer details</h1>
		</li>
		<hr />

		<li>
			<h1 class="font-bold text-2xl my-10 text-black text-opacity-25">
				Step 5: Delivery information
			</h1>
		</li>
		<hr />
	</ul>
{/if} -->

