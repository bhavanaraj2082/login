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
let errorMessage10 = "";

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
		const requiredHeaders = ["Component Name", "CasNumber", "Concentration"];

const isValidCasNumber = (value) => {
	return /^\d+$/.test(value);
};

const handleFileUpload = (event) => {
    uploadedFiles = true;
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
        event.stopPropagation();
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = new Uint8Array(e.target.result);
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = jsonData[0] || []; // First row is the header
            const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

            // Check if all required headers exist
            const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

            if (missingHeaders.length > 0) {
                errorMessage10 = `Missing required headers: ${missingHeaders.join(", ")}`;
                uploadedFiles = false;
                return;
            }

            // Get the index positions of required headers
            const headerIndex = {};
            headers.forEach((header, index) => {
                headerIndex[header] = index;
            });

            // Validate if data is in the correct columns
            for (let i = 0; i < Math.min(rows.length, 5); i++) { // Check first 5 rows
                const row = rows[i];

                // Validate "Component Name" (should be a string)
                if (typeof row[headerIndex["Component Name"]] !== "string" || row[headerIndex["Component Name"]].trim() === "") {
                    errorMessage10 = `Invalid Component Name at row ${i + 1}`;
                    uploadedFiles = false;
                    return;
                }

                // Validate "CasNumber" (should be a valid CAS number format)
                if (!isValidCasNumber(row[headerIndex["CasNumber"]])) {
                    errorMessage10 = `Invalid CAS Number format at row ${i + 1}`;
                    uploadedFiles = false;
                    return;
                }

                // Validate "Concentration" (should be a number)
                if (isNaN(row[headerIndex["Concentration"]]) || row[headerIndex["Concentration"]] === "") {
                    errorMessage10 = `Invalid Concentration value at row ${i + 1}`;
                    uploadedFiles = false;
                    return;
                }
            }

            // If validation passes, update the formData store
            const components = rows.map(row => {
                return headers.reduce((acc, header, index) => {
                    acc[header] = row[index] || "";
                    return acc;
                }, {});
            });

            formData.update((currentData) => ({
                ...currentData,
                components
            }));

            errorMessage10 = ""; // Clear error if data is correct
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
			$formData.packagingType &&
			$formData.analyticalTechnique;
		let errorMessage = "";
		export let tog;
		export let tog1;
		export let tog2;
		const solvent = [
			"Select a solvent",
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
			if (!isFormData) { 
    errorMessage = "Please fill all the fields.";
    setTimeout(() => {
        errorMessage = "";
    }, 3000);
} else if (!uploadedFiles) {
    errorMessage = "Please upload an Excel file.";
    setTimeout(() => {
        errorMessage = "";
    }, 3000);
}
else if (selectedSolvent === "Yes") {
    errorMessage = "Please select a solvent.";
    setTimeout(() => {
        errorMessage = "";
    }, 3000);
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
// console.log("formDataformData",data);
		</script>
		<style>
			.tooltip::after {
				content: '';
				position: absolute;
				top: 100%; /* Position below the tooltip */
				left: 50%;
				margin-left: -5px; /* Center the triangle */
				border-width: 7px;
				border-style: solid;
				border-color: black transparent transparent transparent; /* Triangle color */
			}
		</style>
		<div class="bg-white py-10 flex justify-between">
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
				Step 1: Select custom solution type
			</h1>
			<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog()}
				>Edit</button
			>
		</div>
		<hr />
		<div class="bg-white py-10 flex justify-between">
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
				Step 2: Select custom format
			</h1>
			<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={tog1()}
				>Edit</button
			>
		</div>
		<hr /><hr />
		<div class=" bg-white py-10">
			<h1 class="font-bold sm:text-2xl text-sm">Step 3: Configure custom solution</h1>
		</div>
		<div class="bg-white">
			<button
				class="box-content rounded h-25 w-4/5 p-4 border-dashed border-primary-500 border-2 ml-3 md:ml-8 py-10 bg-white"
				type="button"
				on:click={triggerFileInput}
			>
			<div class="flex items-center font-bold sm:text-2xl text-sm justify-center">
				<span>Add Components</span>
				<Icon icon="material-symbols-light:upload" class="sm:text-3xl text-lg text-bold text-primary-500 ml-2" />
			</div>
			
			<div class="sm:text-lg text-sm">
				Upload an Excel
				<a 
					href={fileLink} 
					download="Custom_Quote_Template.xls" 
					class="text-primary-500 underline ml-1.5 mr-1.5 sm:text-lg text-sm"
					role="button">
					download template
				</a>
				of CAS numbers or component names that you wish to add
			</div>
				<div class="sm:text-lg text-sm">or browse if you already have a file prepared.</div>
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
					<!-- {#each data.headers as header}
					  <th class="border p-2 text-center bg-gray-300 sm:text-md text-xs">{header}</th>
					{/each} -->
					{#each Object.keys(data.rows[0]) as key}
					<th class="border p-2 text-center bg-gray-300 sm:text-md text-xs">{key}</th>
				  {/each}
					<th class="border p-2 text-center bg-gray-300 sm:text-md text-xs">Action</th> 
				  </tr>
				</thead>
				<tbody>
				  {#each data.rows as row, rowIndex}
					<tr>
					  {#each Object.values(row) as cell, cellIndex} 
						<td
						  class="border p-2 text-center sm:text-md text-xs "
						  on:blur={(e) => updateCell(rowIndex, cellIndex, e)}
						>
						  {cell}
						</td>
					  {/each}
					  <td class="border p-2 text-center">
						<button
						  class="bg-red-500 text-white sm:text-md text-xs px-2 py-1 rounded hover:bg-red-700"
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
	{#if errorMessage10}
		<div class="text-red-500 mt-5 ml-12 text-sm font-medium">
			{errorMessage10}
		</div>
	{/if}		<div class="bg-white">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10 py-5">Would you like to specify a solvent?*</h1>
			<div class="mt-4 ml-3 md:ml-20 ">
				<input
					type="radio"
					id="yes"
					name="solvent"
					class="form-radio sm:w-3.5 sm:h-3.5 w-2 h-2 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
					bind:group={selectedSolvent}
					value="Yes"
					on:change={() => {
						setSolvent("Yes");
						showSolventDropdown = true;
					}}
					style="transform: scale(1.5); margin-right: 10px;"
				/>
				<label for="yes" class="sm:text-lg text-xs">Yes</label>
				<input
				class="form-radio sm:w-3.5 sm:h-3.5 w-2 h-2 text-primary-500 ml-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
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
				<label for="no" class="sm:text-lg text-xs">No</label>
				{#if showSolventDropdown}
					<select
					class="box-content border-1 sm:mt-4 mt-0 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 rounded focus:border-primary-500 bg-white sm:text-sm text-2s h-5 ml-4"
						id="solvent"
						name="solvent"
						
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
		<div class=" bg-white">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10 py-5">Select your packaging type*</h1>
			<div class="mt-4 ml-0 md:ml-14">
				<div class="flex flex-wrap">
					<button
					type="button"
					class="box-content rounded sm:text-md text-xs mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
					{selectedPackagingType === 'Ampoule' ? 'border-primary-500' : ''}" on:click={() => setPackagingType("Ampoule")}
					
				  >
					<h1 class="text-center sm:text-md text-xs">Ampoule</h1>
					<div class="relative group">
					  <Icon icon="ion:information" />
					  <span class="u-sr-only"></span>
					  <div
						class="tooltip absolute hidden group-hover:block w-40 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
						style="bottom: calc(100% + 30px); left: 50%; transform: translateX(-50%);"
					  >
						Ampoule
					  </div>
					</div>
				  </button>
				

				  <button
				  type="button"
				  class="box-content rounded mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
				  {selectedPackagingType === 'Bottle' ? 'border-primary-500' : ''}"  on:click={() => setPackagingType("Bottle")}
				  
				>
				  <h1 class="text-center sm:text-md text-xs">Bottle with screw cap</h1>
				  <div class="relative group">
					<Icon icon="ion:information" />
					<span class="u-sr-only"></span>
					<div
					class="tooltip absolute hidden group-hover:block w-40 text-xs p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
					style="bottom: calc(100% + 30px); left: 50%; transform: translateX(-50%);"
				>
					  Bottle with screw cap
					</div>
				  </div>
				</button>
				<button
				type="button"
				class="box-content rounded sm:text-md text-xs mx-5 my-4 h-24 w-32 border-2 transition duration-200 ease-in-out flex flex-col items-center justify-center
				{selectedPackagingType === 'CERTAN' ? 'border-primary-500' : ''}" on:click={() => setPackagingType("CERTAN")}
				
			  >
				<h1 class="text-sm text-center sm:text-md">CERTAN capillary bottle</h1>
				<div class="relative group">
				  <Icon icon="ion:information" />
				  <span class="u-sr-only"></span>
				  <div
				  class="tooltip absolute hidden group-hover:block w-40 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
				  style="bottom: calc(100% + 30px); left: 50%; transform: translateX(-50%);"
			>
					CERTAN® capillary bottle provides the benefits of a sealed ampoule
					with the flexibility of a screw-cap bottle, ensuring minimal
					evaporation even with volatile materials.
				  </div>
				</div>
			  </button>
				</div>
			</div>
		</div>
		<div class=" bg-white">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10 py-5">What unit volume do you need?*</h1>
			<div class="relative">
				<select
					class="ml-3 md:ml-20 border-1 border-gray-300 rounded mt-5 h-10 w-28 focus:ring-0 focus:outline-none focus:border-primary-500  "
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
		<div class=" bg-white">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10 py-5">How many units do you need?*</h1>
			<div
				class="counter mt-3 ml-3 md:ml-20 p-1  border-gray-300 bg-white inline-flex items-center space-x-1 border-1 rounded h-10 w-28 focus:ring-0 focus:outline-none focus:border-primary-500  "

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
					class="w-10 h-6 text-center border-0 rounded text-md"
					bind:value={$formData.units}
					on:input={handleInput1}
				/>
				<button type="button" on:click={increment} class="p-1">
					<Icon icon="ion:plus" class="text-primary-500 text-lg" />
				</button>
			</div>
		</div>
		<div class=" bg-white  py-10">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10">Select your quality level*</h1>
			<div class="mt-4">
				<div class="flex flex-wrap ml-0 md:ml-10">
					<button
						type="button"
						class="box-content rounded mt-4 mx-5 h-20 w-24 p-3 border-2 md:mx-5 lg:mx-10
								{selectedFormat === 'ISO 17034' ? 'border-primary-500' : ''}"
						on:click={() => {
							setquality("ISO 17034");
						}}
					>
						<div class="mx-6 my-2 flex">
							<div class="sm:text-sm text-xs">ISO 17034</div>
							<div class="relative group">
								<Icon icon="ion:information" />
								<span class="u-sr-only"></span>
								<div
								class="tooltip absolute text-xs hidden group-hover:block w-40 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
								style="bottom: calc(100% + 10px); left: 50%; transform: translateX(-65%);"
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
						class="box-content rounded mt-4 mx-5 h-20 w-24 p-3 border-2 md:ml-20 lg:ml-10
					{selectedFormat === 'ISO/IEC 17025' ? 'border-primary-500' : ''}"
						on:click={() => {
							setquality("ISO/IEC 17025");
						}}
					>
						<div class="mx-6 my-2 flex">
							<div class="text-smsm:text-sm text-xs">ISO/IEC 17025</div>
							<div class="relative group">
								<Icon icon="ion:information" /><span class="u-sr-only"></span>
								<div
								class="tooltip text-xs absolute hidden group-hover:block w-40 p-2 text-center text-white bg-black rounded-md -bottom-10 left-1/2 transform -translate-x-1/2"
								style="bottom: calc(100% + 10px); left: 50%; transform: translateX(-60%);"
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
		<div class=" bg-white ">
			<h1 class="font-bold sm:text-2xl text-sm ml-3 md:ml-10">
				Which analytical technique will you use with this solution?*
			</h1>
			<p class="my-5 ml-3 md:ml-11 sm:text-md text-xs">
				We aim to optimise our solutions for your needs. Some components/solvents,
				for example, do not perform well with certain analytical techniques. We may
				offer a revised mixture in these cases.
			</p>
			<div class="lg:flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ml-0 md:ml-14">
				<button
					type="button"
					class="box-content rounded mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'GC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("GC");
					}}
				>
					<div class="mx-6">
						<div class="sm:text-sm text-xs">GC</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content rounded mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'LC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("LC");
					}}
				>
					<div class="mx-6">
						<div class="sm:text-sm text-xs">LC</div>
					</div>
				</button>
				<button
					type="button"
					class="box-content rounded mt-4 mx-5 h-20 w-28 p-3 border-2 transition duration-200 ease-in-out
					hover:border-primary-500 {setanalytic === 'GC and LC'
						? 'border-primary-500'
						: ''}"
					on:click={() => {
						analytical("GC and LC");
					}}
				>
					<div class="mx-6">
						<div class="sm:text-sm text-xs">GC and LC</div>
					</div>
				</button>
			</div>
			{#if errorMessage}
				<div class="text-red-500 ml-3 md:ml-20 mt-5 text-sm font-medium">
					{errorMessage}
				</div>
			{/if}
		</div>
		
		<div class="flex space-x-4 bg-white">
		
			<button
				type="button"
				on:click={saveAndContinue}
				class="sm:ml-10 ml-0 mt-10 text-white sm:text-sm text-xs bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none dark:focus:ring-primary-500 my-5"
				>Save & continue</button
			>
			
		</div>
		<div class="bg-white py-10 flex justify-between">
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
				Step 4: Additional notes
			</h1>
		</div>
		<hr /><hr />
		<div class="bg-white py-10 flex justify-between">
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
				Step 5: Customer details
			</h1>
		</div>
		<hr /><hr />
		<div class="bg-white py-10 flex justify-between">
			<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
				Step 6: Delivery information
			</h1>
		</div>
		<hr /><hr />