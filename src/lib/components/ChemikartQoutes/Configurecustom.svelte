<script>
    let data = {
        headers: ["CasNumber", "Component Name", "Concentration"],
        rows: [
            // ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
            // ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
        ]
    };
function deleteRow(index) {
    data.rows.splice(index, 1);
    data = { ...data }; 
}

function updateCell(rowIndex, cellIndex, event) {
    data.rows[rowIndex][cellIndex] = event.target.textContent.trim();
    data = { ...data }; 
}
    let fileInput;
	import * as XLSX from 'xlsx';
	import Icon from "@iconify/svelte";
	import { onMount, onDestroy } from "svelte";
	import { formData } from '$lib/stores/solution_stores.js';
	let fileLink = '/Custom_Quote_Template.xls';
		let uploadedFiles = false;	
	const handleFileUpload = (event) => {
    uploadedFiles = true;  
    const uploadedFile = event.target.files[0];
	if (uploadedFile) {
    event.stopPropagation();
    const reader = new FileReader();
    reader.onload = (e) => {
        const arrayBuffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = jsonData[0]; // First row is the header
        const rows = jsonData.slice(1).filter((row) => row.some((cell) => cell !== null && cell !== ''));

        // Map rows to an array of objects, using the headers as keys
        const components = rows.map(row => {
            return headers.reduce((acc, header, index) => {
                acc[header] = row[index] || ''; // Set empty string for undefined/null values
                return acc;
            }, {});
        });

        // Update the formData store
        formData.update((currentData) => {
            return { 
                ...currentData, 
                components 
            };
        });
    };
    reader.readAsArrayBuffer(uploadedFile);
}

};
		function triggerFileInput() {
			fileInput.click();
		}
		$: isFormData =
			$formData.components &&
			$formData.solvent &&
			$formData.units &&
			$formData.volume &&
			$formData.analyticalTechnique;
		let errorMessage = "";
		export let tog;
		export let tog1;
		export let tog2;
		const solvent = [
			"Acetone",
			"Acetonitrile",
			"Benzene",
			"Carbon Disulfide",
			"Cyclohexane",
			"Dimethyl Sulfoxide",
			"Ethanol",
			"Ethyl Acetate",
			"Hexane",
			"Isooctane",
			"Isopropanol",
			"Methanol",
			"Methyl t-Butyl Ether",
			"Methylene Chloride",
			"Nonane",
			"Toluene",
			"Triacetin",
			"Water",
		];
		let showSolventDropdown = false;
		let selectedSolvent = "";
		const setSolvent = (solvent) => {
			formData.update((currentData) => ({ ...currentData, solvent }));
		};
		const updateSelectedSolvent = (solvent) => {
			formData.update((currentData) => ({ ...currentData, solvent }));
		};
		let selectedPackagingType = "Ampoule";
		const setPackagingType = (type) => {
			selectedPackagingType = type;
			formData.update((currentData) => ({ ...currentData, packagingType: type }));
		};
		let inputValue = "";
		const options = ["1ml", "2ml", "5ml", "10ml"];
		const handleSelect = (event) => {
			inputValue = event.target.value;
			formData.update((data) => ({
				...data,
				volume: inputValue,
			}));
		};
		let count = 0;
		let inputValue1 = count.toString();
		function handleInput1(event) {
			const value = event.target.value;
			if (/^\d*$/.test(value)) {
				inputValue1 = value;
				count = value === "" ? 0 : parseInt(value, 10);
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
				units: count,
			}));
		}
		let selectedFormat = "ISO 17034";
		const setquality = (type) => {
			selectedFormat = type;
			formData.update((current) => ({ ...current, qualityLevel: type }));
		};
		let setanalytic = "";
		const analytical = (type) => {
			setanalytic = type;
			formData.update((current) => ({
				...current,
				analyticalTechnique: type,
			}));
		};
		const unsubscribe = formData.subscribe((currentData) => {
			data.rows = currentData.components;
			selectedSolvent = currentData.solvent;
			selectedPackagingType = currentData.packagingType;
			inputValue = currentData.volume;
			count = currentData.units;
			selectedFormat = currentData.qualityLevel;
			setanalytic = currentData.analyticalTechnique;
		});
		onDestroy(() => {
			unsubscribe();
		});
		const saveAndContinue = () => {
			if (!uploadedFiles) { 
				errorMessage = "Please upload an Excel file.";
			} else if (!isFormData) {
				errorMessage = "Please fill all the details";
			} else {
				errorMessage = "";
				tog2();
			}
		};
		
		onMount(() => {
    if (data.rows && data.rows.length > 0) {
        uploadedFiles = true;
    }
});

		</script>
		
		
		
		<div class="mx-10 my-10 flex justify-between">
			<h1 class="font-bold text-2xl text-black text-opacity-25">
				Step 1: Select custom solution type
			</h1>
			<button type="button" class="font-semibold text-primary-500" on:click={tog()}
				>Edit</button
			>
		</div>
		<hr />
		<div class="mx-10 my-10 flex justify-between">
			<h1 class="font-bold text-2xl text-black text-opacity-25">
				Step 2: Select custom format
			</h1>
			<button type="button" class="font-semibold text-primary-500" on:click={tog1()}
				>Edit</button
			>
		</div>
		<hr />
		<div class="ml-10 my-10">
			<h1 class="font-bold text-2xl">Step 3: Configure custom solution</h1>
		</div>
		<div class="ml-10">

		
			<button
				class="box-content h-25 w-4/5 p-4 border-dashed border-primary-500 border-2 ml-8 my-10"
				type="button"
				on:click={triggerFileInput}
			>
			
			
			<div class="flex items-center font-bold text-2xl justify-center">
				<span>Add Components</span>
				<Icon icon="material-symbols-light:upload" class="text-3xl text-primary-500 ml-2" />
			</div>
			
			<div>
				Upload an Excel
				<a 
					href={fileLink} 
					download="Custom_Quote_Template.xls" 
					class="text-primary-500 underline ml-1.5 mr-1.5"
					role="button">
					download template
				</a>
				of CAS numbers or component names that you wish to add
			</div>
				<div>or browse if you already have a file prepared.</div>
			</button>
			<label>
				<input
					name="file"
					type="file"
					bind:this={fileInput}
					accept=".xls,.xlsx"
					style="display: none;"
					on:change={handleFileUpload}
				/>
			</label>
			{#if data.rows && Array.isArray(data.rows) && data.rows.length > 0}
			<div class="overflow-x-auto mt-4 mx-4 sm:mx-8 lg:w-10/12">
			  <table class="min-w-full border-collapse">
				<thead>
				  <tr>
					{#each data.headers as header}
					  <th class="border p-2 text-center">{header}</th>
					{/each}
					<th class="border p-2 text-center">Action</th> <!-- Add manually -->
				  </tr>
				</thead>
				<tbody>
				  {#each data.rows as row, rowIndex}
					<tr>
					  {#each Object.values(row) as cell, cellIndex} <!-- Use Object.values(row) to iterate over the object's values -->
						<td
						  class="border p-2 text-center"
						  contenteditable="true"
						  on:blur={(e) => updateCell(rowIndex, cellIndex, e)}
						>
						  {cell}
						</td>
					  {/each}
					  <td class="border p-2 text-center">
						<button
						  class="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
						  on:click={() => deleteRow(rowIndex)}
						>
						  Delete
						</button>
					  </td>
					</tr>
				  {/each}
				</tbody>
			  </table>
			</div>
		  {/if}
		  
		</div>
		<div class="ml-10 my-10">
			<h1 class="font-bold text-2xl">Would you like to specify a solvent?*</h1>
			<div class="mt-4 ml-10">
				<input
					type="radio"
					id="yes"
					name="solvent"
					class="form-radio text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
					bind:group={selectedSolvent}
					value="Yes"
					on:change={() => {
						setSolvent("Yes");
						showSolventDropdown = true;
					}}
					style="transform: scale(1.5); margin-right: 10px; "
				/>
				<label for="yes">Yes</label>
				<input
				class="form-radio text-primary-600 ml-10 focus:outline-none focus:ring-2 focus:ring-primary-600"
				type="radio"
					id="no"
					name="solvent"
					value="No"
					
					bind:group={selectedSolvent}
					on:change={() => {
						setSolvent("No");
						showSolventDropdown = false;
					}}
					style="transform: scale(1.5); margin-right: 10px;"
				/>
				<label for="no">No</label>
				{#if showSolventDropdown}
					<select
						class="box-content border-1 mt-4 px-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 rounded-md focus:border-primary-500 bg-white "
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
						on:click={() => setPackagingType("Ampoule")}
					>
						<h1 class="text-sm text-center">Ampoule</h1>
						<div class="relative group">
							<Icon icon="ion:information" /><span class="u-sr-only"></span>
							<div
								class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white"
							>
								Ampoule
							</div>
						</div>
					</button>
					<button
						type="button"
						class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
				{selectedPackagingType === 'CERTAN' ? 'border-primary-500' : ''}"
						on:click={() => setPackagingType("CERTAN")}
					>
						<h1 class="text-sm text-center">CERTAN capillary bottle</h1>
						<div class="relative group">
							<Icon icon="ion:information" /><span class="u-sr-only"></span>
							<div
								class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white"
							>
								CERTAN® capillary bottle provides the benefits of a sealed ampoule
								with the flexibility of a screw-cap bottle, ensuring minimal
								evaporation even with volatile materials.
							</div>
						</div>
					</button>
					<button
						type="button"
						class="box-content mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
						{selectedPackagingType === 'Bottle' ? 'border-primary-500' : ''}"
						on:click={() => setPackagingType("Bottle")}
					>
						<h1 class="text-sm text-center">Bottle with screw cap</h1>
						<div class="relative group">
							<Icon icon="ion:information" /><span class="u-sr-only"></span>
							<div
								class="opacity-0 group-hover:opacity-100 duration-300 absolute w-80 box-content p-4 border-2 text-sm bg-white"
							>
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
					class="ml-10 border-2 border-gray-300 rounded-md mt-5 h-10 w-28 focus:ring-0 focus:outline-none focus:border-primary-500  "
					on:change={handleSelect}
					bind:value={inputValue}
				>
					<option class="text-sm" value="" disabled selected>ml</option>
					{#each options as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="ml-10 my-10">
			<h1 class="font-bold text-2xl">How many units do you need?*</h1>
			<div
				class="counter mt-3 ml-10 p-1  border-gray-300 bg-white inline-flex items-center space-x-1 border-2 rounded-md h-10 w-28 focus:ring-0 focus:outline-none focus:border-primary-500  "

			>
				<button
					type="button"
					on:click={decrement}
					disabled={count === 0}
					class="p-1"
				>
					<Icon icon="ion:minus" class="text-primary-500 text-lg" />
				</button>
				<input
					type="text"
					class="w-10 h-6 text-center border border-gray-300 rounded text-xs"
					bind:value={$formData.units}
					on:input={handleInput1}
				/>
				<button type="button" on:click={increment} class="p-1">
					<Icon icon="ion:plus" class="text-primary-500 text-lg" />
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
						on:click={() => {
							setquality("ISO 17034");
						}}
					>
						<div class="mx-6 my-2 flex">
							<div class="text-sm">ISO 17034</div>
							<div class="relative group">
								<Icon icon="ion:information" /><span class="u-sr-only"></span>
								<div
									class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-xs"
									style="background-color:#fff"
								>
									ISO 17034 Produced in accordance with internationally recognised
									requirements for the development and production of reference
									standards and for the competence of reference standard
									manufacturers. Find out more.
								</div>
							</div>
						</div>
					</button>
					<button
						type="button"
						class="box-content mt-4 mx-5 h-20 w-24 p-3 border-2 ml-10
					{selectedFormat === 'ISO/IEC 17025' ? 'border-primary-500' : ''}"
						on:click={() => {
							setquality("ISO/IEC 17025");
						}}
					>
						<div class="mx-6 my-2 flex">
							<div class="text-sm">ISO/IEC 17025</div>
							<div class="relative group">
								<Icon icon="ion:information" /><span class="u-sr-only"></span>
								<div
									class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 w-80 box-content p-4 border-2 text-xs"
									style="background-color:#fff"
								>
									ISO/IEC 17025 Produced in accordance with internationally
									recognised requirements for the development and production of
									reference standards and for the competence of reference standard
									manufacturers. Find out more.
								</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
		<div class="ml-10">
			<h1 class="font-bold text-2xl">
				Which analytical technique will you use with this solution?*
			</h1>
			<p class="my-5">
				We aim to optimise our solutions for your needs. Some components/solvents,
				for example, do not perform well with certain analytical techniques. We may
				offer a revised mixture in these cases.
			</p>
			<div class="lg:flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ml-5">
				<button
					type="button"
					class="box-content mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'GC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("GC");
					}}
				>
					<div class="mx-6">
						<div class="text-sm">GC</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'LC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("LC");
					}}
				>
					<div class="mx-6">
						<div class="text-sm">LC</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'GC and LC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("GC and LC");
					}}
				>
					<div class="mx-6">
						<div class="text-sm">GC and LC</div>
					</div>
				</button>
			</div>
			{#if errorMessage}
				<div class="text-red-500 ml-10 mt-5 text-sm font-medium">
					{errorMessage}
				</div>
			{/if}
		</div>
		
		<div class="flex space-x-4 mt-5">
		
			<button
				type="button"
				on:click={saveAndContinue}
				class="ml-20 text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
				>Save & continue</button
			>
			
		</div>
		<hr />
		<div class="mx-10 my-10 flex justify-between">
			<h1 class="font-bold text-2xl text-black text-opacity-25">
				Step 4: Additional notes
			</h1>
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