<script>
	import * as XLSX from 'xlsx';
	import { formData } from '../../../stores/solution_stores';
	import  Icon  from '@iconify/svelte'
	import { onMount,onDestroy  } from 'svelte'

	export let tog;
	export let tog1;
	export let tog2;

	let data = { headers: [], rows: [] }; // State to hold the Excel data

	const handleFileUpload = (event) => {
		const uploadedFile = event.target.files[0];
		if (uploadedFile) {
			event.stopPropagation(); // Prevent event bubbling

			const reader = new FileReader();

			reader.onload = (e) => {
				const arrayBuffer = new Uint8Array(e.target.result);
				const workbook = XLSX.read(arrayBuffer, { type: 'array' });

				// Assuming you're interested in the first sheet
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				// Convert the sheet to JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

				// Store the first row as headers and the rest as data
				const headers = jsonData[0];
				const rows = jsonData
					.slice(1)
					.filter((row) => row.some((cell) => cell !== null && cell !== ''));

				data = { headers, rows }; // Store headers and rows separately
				formData.update((currentData) => ({ ...currentData, components: rows }));
			};

			reader.readAsArrayBuffer(uploadedFile); // Read the file as an ArrayBuffer
		}
	};

	function downloadExcel(event) {
		event.stopPropagation(); // Prevent click event from bubbling up
		event.preventDefault(); // Prevent default button action
		const link = document.createElement('a');
		link.href = '/Custom_Quote_Template.xls'; // Path to your Excel file
		link.download = 'Custom_Quote_Template.xls'; // Name of the downloaded file
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function deleteRow(index) {
		data.rows = data.rows.filter((_, i) => i !== index); // Remove the row at the specified index
		formData.update((currentData) => ({ ...currentData, components: data.rows }));
	}

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

	// Other handlers for solvent, packaging type, etc.
	let showSolventDropdown = false;
	let selectedSolvent = '';

	const setSolvent = (solvent) => {
		formData.update((currentData) => ({ ...currentData, solvent })); // Update the store
	};

	// This function will also be called when a solvent is selected from the dropdown
	const updateSelectedSolvent = (solvent) => {
		formData.update((currentData) => ({ ...currentData, solvent })); // Update the store
	};

	let selectedPackagingType = 'Ampoule';


	const setPackagingType = (type) => {
		selectedPackagingType = type;
		formData.update((currentData) => ({ ...currentData, packagingType: type })); // Update the store
	};


	let inputValue = '';
	const options = ['1ml', '2ml', '5ml', '10ml'];
	const handleSelect = (event) => {
		inputValue = event.target.value; // Set input value to the selected option
		formData.update((data) => ({
			...data,
			volume: inputValue // Update the volume property
		}));
	};

	let count = 0;
	let inputValue1 = count.toString();

	function handleInput1(event) {
		const value = event.target.value;

		// Check if the input is a valid number
		if (/^\d*$/.test(value)) {
			inputValue1 = value; // Update only if it's a number
			count = value === '' ? 0 : parseInt(value, 10); // Handle empty input
			updateUnits(); // Update the store with new count
		} else {
			// Revert to previous valid number
			inputValue1 = count.toString();
		}
	}

	function increment() {
		count += 1;
		inputValue1 = count.toString();
		updateUnits(); // Update the store
	}

	function decrement() {
		if (count > 0) {
			count -= 1;
			inputValue1 = count.toString();
			updateUnits(); // Update the store
		}
	}

	function updateUnits() {
		formData.update((currentData) => ({
			...currentData,
			units: count // Update the units property in the store
		}));
	}

	// Local state variables for managing selection and error states
	let selectedFormat = 'ISO 17034'; // To track the selected format

	const setquality = (type) => {
		selectedFormat = type;
		// Update the formData store
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

// $: showSolventDropdown = selectedSolvent === 'Yes'

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

	// Ensure to clean up subscription
	onDestroy(() => {
		unsubscribe();
	});

  $:isformData=$formData.components && $formData.solvent && $formData.units && $formData.volume && $formData.analyticalTechnique

	// Function for saving and continuing
	const saveAndContinue = () => {

		if(!isformData){
			alert("Please fill all the details")
		}
		else{
			tog2()
		}
		};
;


</script>

<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 1: Select custom solution type</h1>
	<button type="button" class="font-semibold text-blue" on:click={tog()} >Edit</button>
</div>
<hr />
<div class="mx-10 my-10 flex justify-between">
	<h1 class="font-bold text-2xl text-black text-opacity-25">Step 2: Select custom format</h1>
	<button type="button" class="font-semibold text-blue" on:click={tog1()} >Edit</button>
</div>
<hr />
<!-- <form method="POST" action="?/stage"> -->
	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Step 3: Configure custom solution</h1>
	</div>

	<div>
		<button
			class="box-content h-25 w-4/5 p-4 border-dashed border-indigo-300 border-2 mx-10"
			type="button"
			on:click={() => document.getElementById('file-input').click()}
		>
			<i class="mi mi-add"><span class="u-sr-only"></span></i>
			<h1 class="font-bold text-2xl">Add Components</h1>
			<div>
				Upload an Excel
				<button class="text-blue-700 underline" on:click={downloadExcel} type="button">
					download template
				</button>
				of CAS numbers or component names that you wish to add
			</div>
			<div>or browse if you already have a file prepared.</div>
		</button>
		<label for="">
			<input
				name="file"
				type="file"
				id="file-input"
				accept=".xls,.xlsx"
				style="display: none;"
				on:change={handleFileUpload}
			/>
		</label>

		{#if data.rows && data.rows.length > 0}
    <div class="overflow-x-auto mt-4">
        <table class="min-w-full border-collapse">
            <thead>
                <tr>
                    {#each data.headers as header}
                        <th class="border p-2 text-center">{header}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each data.rows as row, index}
                    <tr>
                        {#each row as cell}
                            <td class="border p-2 text-center">{cell}</td>
                        {/each}
                        <td class="border p-2 text-center">
                            <button type="button" class="text-red-600" on:click={() => deleteRow(index)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <p class="mt-4 text-sm">
            * Please note: one or more components could not be matched, please check these above. We can
            still provide a quote, but may need to get in contact for further information.
        </p>
    </div>
{/if}

	</div>

	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Would you like to specify a solvent?*</h1>
		<div class="mt-4">
			<input
			  type="radio"
			  id="yes"
			  name="solvent"
			  bind:group={selectedSolvent}
			  value="Yes"
			  on:change={() => {
				setSolvent('Yes');
				showSolventDropdown = true; // Show dropdown if Yes is selected
			  }}
			  style="transform: scale(1.5); margin-right: 10px;"
			/>
			<label for="yes">Yes</label>
		  
			<input
			  class="ml-5"
			  type="radio"
			  id="no"
			  name="solvent"
			  value="No"
			  bind:group={selectedSolvent}
			  on:change={() => {
				setSolvent('No');
				showSolventDropdown = false; // Hide dropdown if No is selected
			  }}
			  style="transform: scale(1.5); margin-right: 10px;"
			/>
			<label for="no">No</label>
		  
			{#if showSolventDropdown}
			  <select
				class="box-content border-2"
				id="solvent"
				name="solvent"
				bind:value={selectedSolvent} 
				
				on:change={(e) => {
				  updateSelectedSolvent(e.target.value);
				  setSolvent(e.target.value); // This updates the solvent in the store
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
		<div class="mt-4">
			<div class="flex flex-wrap">
				<button
					type="button"
					class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center"
					style="border-color: {selectedPackagingType === 'Ampoule' ? 'blue' : ''};"
					on:click={() => setPackagingType('Ampoule')}
				>
					<h1 class="text-sm text-center">Ampoule</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>

						<!-- <i class="mi mi-circle-information"><span class="u-sr-only"></span></i> -->
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white">
							Ampoule
						</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center"
					style="border-color: {selectedPackagingType === 'CERTAN' ? 'blue' : ''};"
					on:click={() => setPackagingType('CERTAN')}
				>
					<h1 class="text-sm text-center">CERTAN capillary bottle</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>
						<!-- <i class="mi mi-circle-information"><span class="u-sr-only"></span></i> -->
						<div class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white">
							CERTAN® capillary bottle provides the benefits of a sealed ampoule with the flexibility of a screw-cap bottle, ensuring minimal evaporation even with volatile materials.
						</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center"
					style="border-color: {selectedPackagingType === 'Bottle' ? 'blue' : ''};"
					on:click={() => setPackagingType('Bottle')}
				>
					<h1 class="text-sm text-center">Bottle with screw cap</h1>
					<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>

						<!-- <i class="mi mi-circle-information"><span class="u-sr-only"></span></i> -->
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
				class="border-2 border-gray-300 rounded-md mt-1 w-20"
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
		<div class="counter mt-5">
			<button type="button" on:click={decrement} disabled={count === 0}>
				<Icon icon="ion:minus" class="text-blue-700 text-2xl"/>
				<!-- <i class="mi mi-circle-remove text-blue-700 text-2xl"></i> -->
			</button>
			<input
				type="text"
				class="w-20 h-15 text-center border-2"
				bind:value={$formData.units}
				on:input={handleInput1}
			/>
			<button type="button" on:click={increment}>
				<Icon icon="ion:plus" class="text-blue-700 text-2xl"/>
				<!-- <i class="mi mi-circle-add text-blue-700 text-2xl"></i> -->
			</button>
		</div>
	</div>

	<div class="ml-10 my-10">
		<h1 class="font-bold text-2xl">Select your quality level*</h1>
		<div class="mt-4">
			<div class="flex flex-wrap">
				<button
					type="button"
					class="box-content mx-5 h-20 w-24 p-3 border-2 md:mx-5 lg:mx-10"
					style="border-color: {selectedFormat==="ISO 17034" ? 'blue' : ''};"
					on:click={()=>{setquality('ISO 17034')}}
				>
					<div class="mx-6 my-2 flex">
						<div class="text-sm">ISO 17034</div>
						<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>

							<!-- <i class="mi mi-circle-information"><span class="u-sr-only"> </span> </i> -->
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
					class="box-content mx-5 h-20 w-24 p-3 border-2"
					style="border-color: {selectedFormat==="ISO/IEC 17025"  ? 'blue' : ''};"
					on:click={()=>{setquality('ISO/IEC 17025')}}
				>
					<div class="mx-6 my-2 flex">
						<div class="text-sm">ISO/IEC 17025</div>
						<div class="relative group">
						<Icon icon="ion:information"/><span class="u-sr-only"></span>

							<!-- <i class="mi mi-circle-information"><span class="u-sr-only"> </span> </i> -->
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
		<div class="lg:flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			<button
				type="button"
				class="box-content mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out hover:border-blue-500"
				style="border-color: {setanalytic==="GC" ? 'blue' : ''};"
				on:click={()=>{analytical('GC')}}
			>
				<div class="mx-6">
					<div class="text-sm">GC</div>
				</div>
			</button>
			<button
				type="button"
				class="box-content mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out hover:border-blue-500"
				style="border-color: {setanalytic==="LC" ? 'blue' : ''};"
				on:click={()=>{analytical('LC')}}
			>
				<div class="mx-6">
					<div class="text-sm">LC</div>
				</div>
			</button>
			<button
				type="button"
				class="box-content mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out hover:border-blue-500"
				style="border-color: {setanalytic==="GC and LC" ? 'blue' : ''};"
				on:click={()=>{analytical('GC and LC')}}
			>
				<div class="mx-6">
					<div class="text-sm">GC and LC</div>
				</div>
			</button>
		</div>
	</div>




	<button
		type="button"
		on:click={saveAndContinue}
		class="ml-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-20 my-5"
		>Save & continue</button
	>
<!-- </form> -->


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
