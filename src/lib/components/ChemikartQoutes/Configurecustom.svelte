<script>
	import { formData } from '../../../src/stores/solution_stores';
	import  Icon  from '@iconify/svelte'
	import { onMount,onDestroy  } from 'svelte'
	$: isFormData = $formData.components && 
                $formData.solvent && 
                $formData.units && 
                $formData.volume && 
                $formData.analyticalTechnique;
	let errorMessage = '';
	export let tog;
	export let tog1;
	export let tog2;
	let data = { headers: [], rows: [] }; 
	const solvent = [
		'Acetone',
		'Acetonitrile',
		'Benzene',
		'Carbon Disulfide',
		'Cyclohexane',
		'Dimethyl Sulfoxide',
		'Ethanol',
		'Ethyl Acetate',
		'Hexane',
		'Isooctane',
		'Isopropanol',
		'Methanol',
		'Methyl t-Butyl Ether',
		'Methylene Chloride',
		'Nonane',
		'Toluene',
		'Triacetin',
		'Water'
	];
	let showSolventDropdown = false;
	let selectedSolvent = '';
	const setSolvent = (solvent) => {
		formData.update((currentData) => ({ ...currentData, solvent })); 
	};
	const updateSelectedSolvent = (solvent) => {
		formData.update((currentData) => ({ ...currentData, solvent })); 
	};
	let selectedPackagingType = 'Ampoule';
	const setPackagingType = (type) => {
		selectedPackagingType = type;
		formData.update((currentData) => ({ ...currentData, packagingType: type })); 
	};
	let inputValue = '';
	const options = ['1ml', '2ml', '5ml', '10ml'];
	const handleSelect = (event) => {
		inputValue = event.target.value; 
		formData.update((data) => ({
			...data,
			volume: inputValue 
		}));
	};
	let count = 0;
	let inputValue1 = count.toString();
	function handleInput1(event) {
		const value = event.target.value;
		if (/^\d*$/.test(value)) {
			inputValue1 = value; 
			count = value === '' ? 0 : parseInt(value, 10); 
			updateUnits(); 
		} else {
			inputValue1 = count.toString();
		}
	}
	function increment() {
		count += 1;
		inputValue1 = count.toString();
		updateUnits(); 
	}
	function decrement() {
		if (count > 0) {
			count -= 1;
			inputValue1 = count.toString();
			updateUnits(); 
		}
	}
	function updateUnits() {
		formData.update((currentData) => ({
			...currentData,
			units: count
		}));
	}
	let selectedFormat = 'ISO 17034';
	const setquality = (type) => {
		selectedFormat = type;
		formData.update((current) => ({ ...current, qualityLevel: type }));
	};
	let setanalytic=''
  const analytical  = (type) => {
	setanalytic = type
    formData.update(current => ({
      ...current,
      analyticalTechnique: type
    }));
  };
  const unsubscribe = formData.subscribe(currentData => {
		console.log("currentData:",currentData)
		data.rows = currentData.components;
		selectedSolvent = currentData.solvent;
		selectedPackagingType = currentData.packagingType;
		inputValue = currentData.volume;
		count = currentData.units;
		selectedFormat = currentData.qualityLevel;
		setanalytic = currentData.analyticalTechnique;
		showSolventDropdown = selectedSolvent === 'Yes' || selectedSolvent;
console.log("Selected Solvent:", selectedSolvent);
console.log("Show Solvent Dropdown:", showSolventDropdown);
	});
	onDestroy(() => {
		unsubscribe();
	});
	const saveAndContinue = () => {
		if (!isFormData) {
        errorMessage = "Please fill all the details"; 
        console.log(errorMessage);
				
    } else {
        errorMessage = ''; 
        tog2(); 
    }
};
</script>
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 1: Select custom solution type</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog()}>Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 2: Select custom format</h1>
	<button type="button" class="font-semibold text-primary-500" on:click={tog1()} >Edit</button>
</div>
<hr />
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Step 3: Configure custom solution</h1>
	</div>

	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl ">Would you like to specify a solvent?*</h1>
		<div class="mt-4 ml-10 ">
			<input
			  type="radio"
			  id="yes"
			  name="solvent"
			  bind:group={selectedSolvent}
			  value="Yes"
			  on:change={() => {
				setSolvent('Yes');
				showSolventDropdown = true; 
			  }}
			  style="transform: scale(1.5); margin-right: 10px; "
			/>
			<label for="yes">Yes</label>
			<input
			  class="ml-10"
			  type="radio"
			  id="no"
			  name="solvent"
			  value="No"
			  bind:group={selectedSolvent}
			  on:change={() => {
				setSolvent('No');
				showSolventDropdown = false; 
			  }}
			  style="transform: scale(1.5); margin-right: 10px;"
			/>
			<label for="no">No</label>
			{#if showSolventDropdown}
			  <select
				class="box-content border-2 mt-4 "
				id="solvent"
				name="solvent"
				bind:value={selectedSolvent} 
				on:change={(e) => {
				  updateSelectedSolvent(e.target.value);
				  setSolvent(e.target.value); 
				}}
			  >
				<option value="" disabled>Select solvent</option>
				{#each solvent as title}
				  <option value={title}>{title}</option>
				{/each}
			  </select>
			{/if}
		  </div>
	</div>
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Select your packaging type*</h1>
		<div class="mt-4 ml-5">
			<div class="flex flex-wrap">
				<button
				type="button"
				class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center 
				{selectedPackagingType === 'Ampoule' ? 'border-primary-500' : ''}"
				on:click={() => setPackagingType('Ampoule')}
		>
					<h1 class="text-sm text-center">Ampoule</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white">
							Ampoule
						</div>
					</div>
				</button>
				<button
    type="button"
    class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
    {selectedPackagingType === 'CERTAN' ? 'border-primary-500' : ''}"
    on:click={() => setPackagingType('CERTAN')}
>
					<h1 class="text-sm text-center">CERTAN capillary bottle</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white">
							CERTAN® capillary bottle provides the benefits of a sealed ampoule with the flexibility of a screw-cap bottle, ensuring minimal evaporation even with volatile materials.
						</div>
					</div>
				</button>
				<button
				type="button"
				class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center 
				{selectedPackagingType === 'Bottle' ? 'border-primary-500' : ''}"
				on:click={() => setPackagingType('Bottle')}
		>		
					<h1 class="text-sm text-center">Bottle with screw cap</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white">
							Bottle with screw cap
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">What unit volume do you need?*</h1>
		<div class="relative">
			<select
				class="ml-10 border-2 border-gray-300 rounded-md mt-5 h-8 w-28"
				on:change={handleSelect}
				bind:value={inputValue}
			>
				<option value="" disabled selected>ml</option>
				{#each options as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">How many units do you need?*</h1>
		<div class="counter mt-3 ml-10 p-1 border border-gray-300 rounded-lg bg-gray-100 inline-flex items-center space-x-1">
			<button type="button" on:click={decrement} disabled={count === 0} class="p-1">
					<Icon icon="ion:minus" class="text-primary-500 text-lg"/>
			</button>
			<input
					type="text"
					class="w-10 h-6 text-center border border-gray-300 rounded text-xs"
					bind:value={$formData.units}
					on:input={handleInput1}
			/>
			<button type="button" on:click={increment} class="p-1">
					<Icon icon="ion:plus" class="text-primary-500 text-lg"/>
			</button>
	</div>
	</div>
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Select your quality level*</h1>
		<div class="mt-4">
			<div class="flex flex-wrap">
				<button
						type="button"
						class="box-content mt-4 ml-10 mx-5 h-20 w-24 p-3 border-2 md:mx-5 lg:mx-10 
						{selectedFormat === 'ISO 17034' ? 'border-primary-500' : ''}"
						on:click={() => { setquality('ISO 17034') }}
				>
					<div class="mx-6 my-2 flex">
						<div class="text-sm">ISO 17034</div>
						<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
							<div
								class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-xs"
								style="background-color:#fff"
							>
								ISO 17034 Produced in accordance with internationally recognised requirements for
								the development and production of reference standards and for the competence of
								reference standard manufacturers. Find out more.
							</div>
						</div>
					</div>
				</button>
				<button
      type="button"
      class="box-content mt-4  mx-5 h-20 w-24 p-3 border-2 ml-10 
      {selectedFormat === 'ISO/IEC 17025' ? 'border-primary-500' : ''}"
      on:click={() => { setquality('ISO/IEC 17025') }}
			>
					<div class="mx-6 my-2 flex">
						<div class="text-sm">ISO/IEC 17025</div>
						<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
							<div
								class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-xs"
								style="background-color:#fff"
							>
								ISO/IEC 17025 Produced in accordance with internationally recognised requirements
								for the development and production of reference standards and for the competence of
								reference standard manufacturers. Find out more.
							</div>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
	<div class="ml-10">
		<h1 class="font-bold text-2xl">Which analytical technique will you use with this solution?*</h1>
		<p class="my-5">
			We aim to optimise our solutions for your needs. Some components/solvents, for example, do not
			perform well with certain analytical techniques. We may offer a revised mixture in these
			cases.
		</p>
		<div class="lg:flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ml-5">
			<button
      type="button"
      class="box-content mt-4  mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out 
      hover:border-primary-500 {setanalytic === 'GC' ? 'border-primary-500' : ''}"
      on:click={() => { analytical('GC') }}
			>
				<div class="mx-6">
					<div class="text-sm">GC</div>
				</div>
			</button>
			<button
      type="button"
      class="box-content mt-4  mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out 
      hover:border-primary-500 {setanalytic === 'LC' ? 'border-primary-500' : ''}"
      on:click={() => { analytical('LC') }}
			>
				<div class="mx-6">
					<div class="text-sm">LC</div>
				</div>
			</button>
			<button
      type="button"
      class="box-content mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out 
      hover:border-primary-500 {setanalytic === 'GC and LC' ? 'border-primary-500' : ''}"
      on:click={() => { analytical('GC and LC') }}
			>
				<div class="mx-6">
					<div class="text-sm">GC and LC</div>
				</div>
			</button>
		</div>
	</div>



<div class="flex space-x-4 mt-5">
	<button
		type="button"
		on:click={saveAndContinue}
		class="ml-20 text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
		>Save & continue</button
	>
	{#if errorMessage}
    <div class="text-red-600 font-semibold text-xl ml-5 mt-5">{errorMessage}</div> 
{/if}
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 4: Additional notes</h1>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 5: Customer details</h1>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 6: Delivery information</h1>
</div>
<hr />