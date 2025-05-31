<script>
	import { Cusdetails } from '$lib/stores/solution_stores.js';
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import Icon from '@iconify/svelte';
	import { toast, Toaster } from "svelte-sonner";
	import {countries , phoneNumberPatterns} from '$lib/Data/constants.js';
	export let data;
	console.log(data, "data customer details");
	export let tog;
	export let tog1;
	export let tog2;
	export let tog3;
	export let tog4;
	export let showStep1 = true;
    export let showStep2 = true;
    export let showStep3 = true;
    export let showStep4 = true;
	let number = "";
	let authedUserEmailVerified = data?.profile?.isEmailVerified || "";
	console.log("authedUserEmailVerified", authedUserEmailVerified);
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
	let isLoadingPhone = false;
	let isEmailVerified = false;
	let loadingotp = false;
	let loadingPhone = false;
	let isLoading = false;
	let ProfileEmailVerified = false;
	let isDataAvailable = false;
	let isEditable = false;
	let verificationMessage = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let form3;
	let country;
	let errorMessage = '';
	$: isFormData =
		$Cusdetails.FirstName &&
		$Cusdetails.LastName &&
		$Cusdetails.Organisation &&
		$Cusdetails.Country &&
		$Cusdetails.Email &&
		$Cusdetails.Number;
	$Cusdetails.userId = data?.profile?.userId || "";
	// console.log("$Cusdetails.userId",$Cusdetails.userId);
	const titles = ['Dr', 'Miss', 'Mr', 'Ms', 'Mrs', 'Prof'];

    let errorMessage1, errorMessage2,errorMessage3,errorMessage4,errorMessage7,errorMessage5;	
	    function validateFirstName(event) {
    const input = event.target.value;
    const regex = /^[A-Za-z\s]*$/; 
    if (!regex.test(input)) {
        errorMessage1 = 'First Name cannot contain numbers or special characters';
    } else if (input.length < 3 || input.length > 50) {
	errorMessage1 = 'First Name must be between 3 and 50 characters';
	return false;
}else {
        errorMessage1 = '';
    }
}
function validateLastName(event) {
    const input = event.target.value;
    const regex = /^[A-Za-z\s]*$/; 
    if (!regex.test(input)) {
        errorMessage2 = 'Last Name cannot contain numbers or special characters';
    } else if ( input.length > 50) {
	errorMessage1 = 'Last Name must be less than 50 characters';
	return false;
}
else {
        errorMessage2 = '';
    }
}
function validatecompany(event) {
  const input = event.target.value.trim();
  const regex = /^[a-zA-Z0-9\s&\-.,!@():;"']+$/;

  if (input.length === 0) {
    errorMessage5 = '';
    return true; // Optional field
  } else if (/^\d+$/.test(input)) {
    errorMessage5 = 'Company name cannot contain only numbers, Please include letters as well';
    return false;
  } else if ((input.length > 0 && input.length < 3) || input.length > 100) {
    errorMessage5 = 'Company Name must be between 3 and 100 characters';
    return false;
  } else if (!regex.test(input)) {
    errorMessage5 = 'Invalid characters in Company Name';
    return false;
  } else if (/<[^>]*>/.test(input)) {
    errorMessage5 = 'Company Name should not contain HTML tags';
    return false;
  } else {
    errorMessage5 = '';
    return true;
  }
}


function validateEmail(event) {
    const input = event.target.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(input)) {
        errorMessage3 = 'Please enter a valid email address';
    } else {
        errorMessage3 = '';
    }
}
function validatePhNo(country, number) {
    if (!country) {
        errorMessage4 = 'Please select your country before entering Number';
    } else {
        const pattern = phoneNumberPatterns[country];
        if (!pattern) {
            errorMessage4 = 'Select a country from the dropdown before entering number';
        } else if (!pattern.test(number)) {
            errorMessage4 = `Please enter a valid phone number for ${country}`;
        } else {
            errorMessage4 = '';
        }
    }
}
const validateAll = (country, number) => {
	if (!isFormData) {
		errorMessage = 'Please fill all the required fields';
		// setTimeout(() => {
		// 	errorMessage = '';
		// }, 5000);
		return false;
	} else {
		errorMessage = '';
	}
	validateFirstName({ target: { value: $Cusdetails.FirstName } });
	validateLastName({ target: { value: $Cusdetails.LastName } });
	validateEmail({ target: { value: $Cusdetails.Email } });
	validatecompany({ target: { value: $Cusdetails.Organisation } });
	return (
		!errorMessage1 && 
		!errorMessage2 && 
		!errorMessage3 && 
		!errorMessage4 && 
		!errorMessage5
	);
};
const cust = () => {
	// console.log("$Cusdetails.Country",$Cusdetails.Country);
	// console.log("$Cusdetails.FirstName",$Cusdetails.FirstName);
	// console.log("$Cusdetails.LastName",$Cusdetails.LastName);
	// console.log("$Cusdetails.Organisation",$Cusdetails.Organisation);
	// console.log("$Cusdetails.Email",$Cusdetails.Email);
	// console.log("$Cusdetails.Number",$Cusdetails.Number);
	if (!validateAll($Cusdetails.Country, $Cusdetails.Number)) {
	return;
}
if (validateEmail && !(authedUserEmailVerified || ProfileEmailVerified)) {
    errorMessage7 = 'Please verify your Email';
	setTimeout(() => {
	errorMessage7 = '';
}, 3000);
	return;
}
tog4();
};
onMount(() => {
    const storedEmailVerified = localStorage.getItem("ProfileEmailVerified");
    if (storedEmailVerified === "true") {
        ProfileEmailVerified = true;
    }

    // Check if user details are already filled
    if ($Cusdetails.FirstName && $Cusdetails.LastName && $Cusdetails.Email) {
        // User details are already filled, no need to fetch again
        isDataAvailable = true;
    } else if (data && data.profile) {
        // Fetch user details from data
        $Cusdetails.FirstName = `${data.profile.firstName || ""}`.trim();
        $Cusdetails.LastName = `${data.profile.lastName || ""}`.trim();
        $Cusdetails.Email = data.profile.email || "";
        $Cusdetails.Number = data.profile.cellPhone || data.profile.primaryPhone || "";
        $Cusdetails.userId = data.profile.userId || "";
        $Cusdetails.Organisation = data.profile.companyName || "";
        const profileCountry = data.profile.country?.trim();
        if (profileCountry) {
            const foundCountry = countries.find(
                (c) => c.name.toLowerCase() === profileCountry.toLowerCase(),
            );
            if (foundCountry) {
                $Cusdetails.Country = foundCountry.name;
            }
        }

        isDataAvailable = true;
    }

    isEditable = false;
    // document.addEventListener('click', handleClickOutside);
    // return () => document.removeEventListener('click', handleClickOutside);
});
	$: if (ProfileEmailVerified) {
    localStorage.setItem("ProfileEmailVerified", "true");
}

let searchTerm = "";
    let showDropdown = false;
    let filteredCountries = countries;

	function filterCountries() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
		);
		if (
			filteredCountries.length === 1 &&
			(filteredCountries[0].name.toLowerCase() ===
				searchTerm.toLowerCase() ||
				filteredCountries[0].code.replace("+", "").toLowerCase() ===
					searchTerm.replace("+", "").toLowerCase())
		) {
			selectCountry(filteredCountries[0]);
		} else {
			showDropdown = filteredCountries.length > 0; 
		}
	}
	function selectCountry(selectedCountry) {
		$Cusdetails.Country = selectedCountry.name;
		searchTerm = `${selectedCountry.name} `;
		showDropdown = false;
		// validatePhoneNumber(country, phone);
		// validatePhNo($Cusdetails.Country, number);
		// delete errors.$Cusdetails.Country;
		validatePhNo($Cusdetails.Country, $Cusdetails.Number);
	}
	function handleInputChange(event) {
		searchTerm = event.target.value;
		const isDeleting =
			event.inputType === "deleteContentBackward" ||
			event.inputType === "deleteContentForward";

				if (searchTerm.length > 0 && !isDeleting) {
	filterCountriesWithoutAutoSelect();
	showDropdown = true; // Always show, even if no matches

	const codeSearch = searchTerm.replace("+", "").trim();
	if (codeSearch.length > 0) {
		const exactCodeMatches = filteredCountries.filter(
			(country) => country.code.replace("+", "") === codeSearch
		);

		if (exactCodeMatches.length === 1) {
			selectCountry(exactCodeMatches[0]);
			return;
		}
	}

	const countriesStartingWith = filteredCountries.filter((country) =>
		country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
	);

	if (countriesStartingWith.length === 1) {
		selectCountry(countriesStartingWith[0]);
	}
} else {
	filterCountriesWithoutAutoSelect();
	showDropdown = true; // Keep it open regardless
}
	}
function filterCountriesWithoutAutoSelect() {
  filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
  );
}
    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

	// function handleClickOutside(event) {
	// 	if (!event.target.closest('.dropdown-container')) {
	// 		showDropdown = false;
	// 	}
	// }

	let countryDropdownRef;

function handleFormClick(event) {
const isInCountry = countryDropdownRef?.contains(event.target);
if (!isInCountry) {
  showDropdown = false;
}
}

	let errors = {};
// 	function handleKeyDown(event) {
//     if (event.key === "Enter" && searchTerm.length >= 3 && filteredCountries.length > 0) {
//         selectCountry(filteredCountries[0]);
//         event.preventDefault();
//     }
// }

	let highlightedIndex = -1;

	function handleKeyDown(event) {
	if (!showDropdown) return;

	if (event.key === 'ArrowDown') {
		event.preventDefault();
		highlightedIndex = (highlightedIndex + 1) % filteredCountries.length;
		scrollToHighlightedItem();
	} else if (event.key === 'ArrowUp') {
		event.preventDefault();
		highlightedIndex = (highlightedIndex - 1 + filteredCountries.length) % filteredCountries.length;
		scrollToHighlightedItem();
	} else if (event.key === 'Enter') {
		event.preventDefault();
		if (highlightedIndex >= 0) {
			selectCountry(filteredCountries[highlightedIndex]);
		} else {
			selectCountry(filteredCountries[0]);
		}
		showDropdown = false;
		highlightedIndex = -1;
	}
}

function scrollToHighlightedItem() {
  const item = document.getElementById(`dropdown-item-${highlightedIndex}`);
  if (item) item.scrollIntoView({ block: "nearest" });
}


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
<div id="step1" class="pb-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 1: Select custom solution type</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step1', tog)}>Edit</button>
</div>
{/if}
<hr />
{#if showStep2}
<div id="step2" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 2: Select custom format</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs"on:click={() => handleEdit('step2', tog1)}>Edit</button>
</div>
{/if}
<hr /><hr />
{#if showStep3}
<div id="step3" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 3: Configure custom solution</h1>
	</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step3', tog2)}>Edit</button>
</div>
{/if}
<hr /><hr />
{#if showStep4}
<div id="step4" class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300"  style="stroke-width: 2;" />
	<h1 class="font-bold text-black text-opacity-25 sm:text-2xl text-sm">Step 4: Additional notes</h1>
</span>
	<button type="button" class="font-semibold text-primary-500 sm:text-lg text-xs" on:click={() => handleEdit('step4', tog3)}>Edit</button>
</div>
{/if}
<hr /><hr />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-white " on:click={handleFormClick}>
	<span class="flex items-center gap-2 pt-10">
		<Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-heading" />
	<h1 class="font-bold sm:text-2xl text-sm ">Step 5: Customer details</h1>
	</span>
	<div class="sm:ml-10 ml-0">
	<h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm ">Please fill the details</h1>
	<div class="grid grid-cols-1 gap-x-6 gap-y-1 md:w-3/4 lg:w-1/2 sm:grid-cols-6">
		<div class="sm:col-span-2  sm:col-start-1">
			<input
				type="hidden"
				name="userId"
				id="userId"
				bind:value={$Cusdetails.userId}
			/>
				<label for="title" class="sm:text-sm text-xs">Title</label>
		  <div class="">
			<select
				id="title"
				name="title"
				placeholder="title"
				class="block w-full sm:text-sm text-xs rounded py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1  focus:border-primary-500 bg-white"
				bind:value={$Cusdetails.Title}
			>
				<option value="" disabled selected>Title</option>
				{#each titles as title}
					<option value={title} class="sm:text-sm text-xs">{title}</option>
				{/each}
			</select>
		  </div>
		</div>
		<div class="sm:col-span-2">
			<label for="" class="sm:text-sm text-xs">First name <span class="text-primary-500"> *</span></label>
			<div class="">
			<input
			type="text"
			class="block w-full rounded py-1.5 sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
			bind:value={$Cusdetails.FirstName}
			name="Firstname"
			id="firstname"
			on:input={() => {
				validateFirstName
				const trimmedName = $Cusdetails.FirstName.trim();
						  $Cusdetails.FirstName= trimmedName;
						  if (!trimmedName) {
      errors = { ...errors, FirstName: "" };
    } else if (trimmedName.length < 3 || trimmedName.length > 50) {
  errors = { ...errors, FirstName: "Must be between 3–50 chars" };
}else if (!/^[A-Za-z\s&\-.,!@():;"']+$/.test(trimmedName)) {
      errors = { ...errors, FirstName: "Invalid chars in First Name" };
    } else if (/<[^>]*>/.test(trimmedName)) {
      errors = { ...errors, FirstName: "First Name should not contain HTML tags" };
    } else {
      const { FirstName, ...rest } = errors;
      errors = rest; 
    }
				}}
			required
		/>
		{#if errors?.FirstName}
		<span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
		  {errors.FirstName}
		</span>
	  {/if}
        {#if errorMessage && !$Cusdetails.FirstName}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">   
			*Required</div>
		{/if}
		{#if errorMessage1}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:hidden block ">
			{errorMessage1}</div>
		{/if}
		  </div>
		 
		</div>
		<div class="sm:col-span-2">
			<label for="" class="sm:text-sm text-xs">Last name <span class="text-primary-500"> *</span> </label>
			<div class="">
			<input
					type="text"
					name="lastname"
					class="block w-full sm:text-sm text-xs rounded py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
					id="lastname"
					bind:value={$Cusdetails.LastName}
					required
					on:input={() => {
						validateLastName
						const trimmedLName = $Cusdetails.LastName.trim();
								  $Cusdetails.LastName= trimmedLName;

								  if (!trimmedLName) {
      errors = { ...errors, LastName: "" };
    } else if ( trimmedLName.length > 50) {
  errors = { ...errors, LastName: "Must be less than 50 chars" };
}else if (!/^[A-Za-z\s&\-.,!@():;"']+$/.test(trimmedLName)) {
      errors = { ...errors, LastName: "Invalid chars in Last Name" };
    } else if (/<[^>]*>/.test(trimmedLName)) {
      errors = { ...errors, LastName: "Last Name should not contain HTML tags" };
    } else {
      const { LastName, ...rest } = errors;
      errors = rest; 
    }
						}}
				/>
				{#if errors?.LastName}
		<span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
		  {errors.LastName}
		</span>
	  {/if}
                {#if errorMessage && !$Cusdetails.LastName}
                <div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
                    *Required</div>
                {/if}
				{#if errorMessage2}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:hidden block">
			{errorMessage2}</div>
		{/if}
		  </div>
		</div>
	  </div>
	<div class=" mb-2">
		<!-- {#if errorMessage1}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:block hidden ">
			{errorMessage1}</div>
		{/if} -->
		{#if errorMessage2}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1 md:block hidden">
			{errorMessage2}</div>
		{/if}
		<label for="" class="sm:text-sm text-xs">Country <span class="text-primary-500"> *</span></label>
		<br />
		<div class="flex-1 mb-4 relative w-full" bind:this={countryDropdownRef}>
				<div class="flex items-center relative overflow-hidden w-full bg-gray-50 md:w-3/4 sm:2/5 lg:w-1/2 ">
    <input
        type="text"
        id="country"
        name="country"
        bind:value={$Cusdetails.Country}
        placeholder="Select your Country"
        on:input={handleInputChange}
        on:click={toggleDropdown}
		on:keydown={handleKeyDown}
        class="block w-full sm:text-sm text-xs rounded py-1.5 pr-8 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 bg-white"
        required
    />
    <!-- SVG Icon -->
											<!-- svelte-ignore a11y-no-static-element-interactions -->
											<svg
											  xmlns="http://www.w3.org/2000/svg"
											  class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer absolute right-2"
											  fill="none"
											  viewBox="0 0 24 24"
											  stroke="currentColor"
											  stroke-width="2"
											  style:transform={showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
											  on:click={toggleDropdown}
											>
											  <path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M19 9l-7 7-7-7"
											  />
											</svg>
			</div>
			{#if showDropdown}
				<div class="absolute md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
					<ul class="max-h-60 overflow-y-auto text-sm">
						{#each filteredCountries as country, index(country.name)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<li
	id={`dropdown-item-${index}`}
	class="px-4 py-2 cursor-pointer {highlightedIndex === index
	? 'bg-primary-100'
	: 'hover:bg-primary-50'}"
	on:click={() => selectCountry(country)}
>
{country.name} ({country.code})
</li>
						{/each}
						{#if filteredCountries.length === 0}
							<div class="px-4 py-1.5 text-gray-600 text-xs">No matching countries found!</div>
						{/if}
						
					</ul>
				</div>
			{/if}
			{#if errorMessage && !$Cusdetails.Country}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				*Required</div>
			{/if}
			{#if filteredCountries.length === 0}
												<p
												class="ml-1 text-red-600 text-xs mt-1 "
											>
												Invalid country selected
											</p>
											{/if}
		</div>
	</div>
	<div class="mt-2 mb-2">
		<label for="" class="sm:text-sm text-xs">Phone number <span class="text-primary-500"> *</span></label>
		<br />
		<input
			class="block rounded md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 placeholder:text-sm"
			type="tel"
			name="phone"
			id="phone"
			bind:value={$Cusdetails.Number}
			placeholder=""
			required			
			on:input={() => {
				validatePhNo($Cusdetails.Country, $Cusdetails.Number)
				const trimmedNum = $Cusdetails.Number.trim();
						  $Cusdetails.Number= trimmedNum;
				}}
            />
			{#if errorMessage && !$Cusdetails.Number}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				*Required</div>
			{/if}
		{#if $Cusdetails.Number && errorMessage4}
<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
    {errorMessage4}
</div>
{/if}
	</div>
	<div class="flex-1 mb-4 mt-2">
		<label for="" class="sm:text-sm text-xs">Email <span class="text-primary-500"> *</span></label>
		<input
			type="hidden"
			name="email"
			id="email"
			bind:value={$Cusdetails.Email}
		/>
		<form
			action="?/verifyemail"
			bind:this={form3}
			method="POST"
			use:enhance={({}) => {
				return async ({ result }) => {
					isLoading = false;
					console.log("result", result);
					if (result.data?.status === 200) {
						ProfileEmailVerified = result.data.isEmailVerified;
						if (authedUserEmailVerified === true) {
							ProfileEmailVerified = true;
						}

						verificationMessage = result.data.message;

						if (
							verificationMessage.includes(
								"Verification email sent successfully. Please check your inbox.",
							)
						) {
							displayMessage = "Please check your inbox.";
							emailSent = true;
							enteredOtp = "";
							isOtpVerified = false;
						} else {
							displayMessage = verificationMessage;
							emailSent = false;
							isOtpVerified = false;
						}

						toast.success(verificationMessage);
					} else {
						toast.error(result.data.message);
						ProfileEmailVerified = result.data.isEmailVerified;
						emailSent = false;
					}
				};
			}}
			class="flex w-full items-center"
			on:submit={() => {
				isLoading = true;
			}}
		>
			<div
				class="flex items-center space-x-2 rounded md:w-3/4 sm:2/5 lg:w-1/2 w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 pr-1"
			>
				<input
					type="text"
					name="email"
					id="email"
					bind:value={$Cusdetails.Email}
					class="block w-full h-6 border-0 focus:outline-none focus:ring-0 sm:text-sm text-xs"
					on:input={() => {
						ProfileEmailVerified = false;
						emailSent = false;
						authedUserEmailVerified = false;
					}}
				/>
				{#if isLoading}
					<span
						class="text-2s font-semibold text-primary-600 flex items-center"
					>
						<Icon
							icon="line-md:loading-alt-loop"
							class="w-4 h-4 mr-1"
						/>
						Verifying...
					</span>
				{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
					<button
						type="submit"
						class="sm:text-xs text-[9px] font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
						disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
							$Cusdetails.Email,
						) || $Cusdetails.Email.split("@")[1].includes("gmial")}
					>
						Verify
					</button>
				{:else if emailSent}
					<span
						class="text-2s font-semibold text-green-600 flex items-center"
					>
						{#if isOtpVerified}
							Verified
							<Icon
								icon="material-symbols:verified-rounded"
								class="w-4 h-4 ml-1"
							/>
						{:else}
							<Icon
								icon="fluent:mail-all-read-16-filled"
								class="w-4 h-4 mr-1"
							/>
							Check your inbox
						{/if}
					</span>
				{:else}
					<span
						class="text-2s font-semibold text-green-600 flex items-center"
					>
						Verified
						<Icon
							icon="material-symbols:verified-rounded"
							class="w-4 h-4 ml-1"
						/>
					</span>
				{/if}
			</div>
		</form>
		{#if $Cusdetails.Email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test($Cusdetails.Email)}
			<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
				Please enter a valid email address.
			</div>
		{/if}
		{#if errorMessage && !$Cusdetails.Email}
		<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
			*Required</div>
		{/if}
		{#if errorMessage7}
    <div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">
        {errorMessage7}
    </div>
		{/if}
		{#if emailSent && isOtpVerified === false}
			<br />

			<form
				action="?/verifyOtpEmail"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						loadingotp = false;
						if (result.status === 200) {
							if (result.data.status === 200) {
								const verifiedMessage = result.data.message;
								toast.success(verifiedMessage);
								isOtpVerified = result.data.isEmailVerified;
								enteredOtpemail = "";
								ProfileEmailVerified = true;
								console.log(isOtpVerified, "isOtpVerified");
							} else {
								const errorMessage =
									result.data.message ||
									"An unknown error occurred!";
								toast.error(errorMessage);
							}
						} else {
							const errorMessage =
								result.data.message ||
								"Request failed. Please try again.";
							toast.error(errorMessage);
						}
					};
				}}
				on:submit={() => {
					loadingotp = true;
				}}
			>
				<div
					class="flex items-center space-x-1 rounded-md md:w-3/4 sm:2/5 lg:w-1/2 w-full py-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				>
					<input
						type="hidden"
						name="email"
						id="email"
						bind:value={$Cusdetails.Email}
					/>
					<input
						type="text"
						name="enteredOtp"
						bind:value={enteredOtpemail}
						placeholder="Enter 6-digit OTP"
						class="block w-full h-6 border-0 sm:text-sm text-xs focus:outline-none focus:ring-0"
						on:input={() => {
							enteredOtpemail = enteredOtpemail.trim();
						}}
					/>
					<button
						type="submit"
						class="text-primary-600 font-semibold sm:text-xs text-[9px] rounded hover:underline pr-4"
						disabled={loadingotp}
					>
						{#if loadingotp}
							<span
								class="text-2s font-semibold text-primary-600 flex items-center"
							>
								<Icon
									icon="line-md:loading-alt-loop"
									class="w-4 h-4 animate-spin"
								/>
								Verifying
							</span>
						{:else}
							Verify
						{/if}
					</button>
				</div>
				<div class="">
					<button
						type="button"
						on:click={handleResendOtpemail}
						disabled={loadingotp}
						class="sm:text-2s text-[8px]"
					>
						Didn't receive the code?
						<span
							class="sm:text-2s text-[8px] font-semibold text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Get a new code
						</span>
					</button>
				</div>
			</form>
		{/if}
	</div>
	<div class="mt-2 mb-2">
		<label for="" class="sm:text-sm text-xs">Company name </label>
		<br />
  <input
  type="text"
  name="organisation"
  id="organisation"
  bind:value={$Cusdetails.Organisation}
  class="block rounded md:w-3/4 sm:2/5 lg:w-1/2 sm:text-sm text-xs w-full py-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
 on:input={() => {
  $Cusdetails.Organisation = $Cusdetails.Organisation.trimStart(); // Avoid leading spaces
  const org = $Cusdetails.Organisation.trim();

  if (org.length === 0) {
    const { organisation, ...rest } = errors;
    errors = rest; // clear any previous error if it's empty
  } else if (org && Number.isInteger(Number(org))) {
      errors = { ...errors, organisation:"Company name cannot contain only numbers, Please include letters as well"};
  }
  else if ((org.length > 0 && org.length < 3) || org.length > 100) {
    errors = { ...errors, organisation: "Company Name must be between 3 and 100 characters" };
  } else if (!/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(org)) {
    errors = { ...errors, organisation: "Invalid characters in Company Name" };
  } else if (/<[^>]*>/.test(org)) {
    errors = { ...errors, organisation: "Company Name should not contain HTML tags" };
  } else {
    const { organisation, ...rest } = errors;
    errors = rest;
  }
}}

/>

{#if errors?.organisation}
  <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
    {errors.organisation}
  </span>
{/if}

{#if errorMessage && !$Cusdetails.Organisation}
<div class="text-red-500 sm:text-xs text-2s font-medium ml-1 mt-1">   
	*Required</div>
{/if}
	</div>
	<div class="flex space-x-4">
		<button
			type="button"
			on:click={cust}
			class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-500 focus:outline-none dark:focus:ring-primary-500 my-5"
			>Save & continue</button
		>
	</div>
</div>
</div>
<div class="py-10 bg-white  flex justify-between">
	<span class="flex items-center gap-2">
		<Icon icon="material-symbols:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-gray-300" />
	<h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">Step 6: Delivery information</h1>
	</span>
</div>
<hr />