<script>
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
    const dispatch = createEventDispatcher()
    export let recordId
    export let contact
    export let isEmailVerified
    let {
        email,
        firstName,
        lastName,
        country,
        cellPhone,
        alternatePhone,
        gstNumber,
        needsPasswordSetup,
        companyName,
        tanNumber,
        jobtitle,
        companytype
    } = contact
    let toggleEdit = false;
    let errors

    // $:console.log(errors);

    import { onMount} from 'svelte';

let containerRef;
let showErrors = false;
let handleClickOutside;

onMount(() => {

  handleClickOutside = (event) => {
    if (containerRef && !containerRef.contains(event.target)) {
      showDropdown = false;
    }
  };

  document.addEventListener('click', handleClickOutside);

  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
});

function toggleDropdown() {
  showDropdown = !showDropdown;
}


let filteredCountries = countries;
let showDropdown = false;
let autoSelectedOnce = false; 

function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    filteredCountries = countries; 
    showDropdown = false; 
    validateForm('country');
    validatealterphoneNumber(country, alterphone); 
    validatePhoneNumber(country, phone); 
    validateZipCode(country, postalcode); 
    delete errors.country; 
    autoSelectedOnce = false; 
}

//     function toggleDropdown() {
//     showDropdown = !showDropdown; 
// }

let previousSearchTerm = '';

function filterCountries(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const isDialCode = /^\d+$/.test(searchTerm);
    showDropdown = true;

    // Disable auto-selection when shortening input
    const isTypingForward = searchTerm.length > previousSearchTerm.length;
    previousSearchTerm = searchTerm;

    autoSelectedOnce = searchTerm.length < 3 ? false : autoSelectedOnce;

    if (isDialCode) {
        filteredCountries = countries.filter(country =>
            country.code.replace('+', '') === searchTerm
        );
        if (filteredCountries.length === 0) {
            filteredCountries = countries.filter(country =>
                country.code.replace('+', '').endsWith(searchTerm) &&
                country.code.replace('+', '').length === searchTerm.length + 1
            );
        }
    } else {
        filteredCountries = countries.filter(country =>
            country.name.toLowerCase().startsWith(searchTerm) ||
            country.code.toLowerCase().includes(searchTerm)
        );
    }

    // Only auto-select if typing forward and not previously auto-selected
    if (filteredCountries.length === 1 && searchTerm.length >= 2 && !autoSelectedOnce && isTypingForward) {
        const autoSelectedCountry = filteredCountries[0];
        setTimeout(() => {
            country = autoSelectedCountry.name;
            selectCountry(autoSelectedCountry);
            autoSelectedOnce = true;
        }, 200);
    } else {
        country = searchTerm;
    }
}



// function handleKeyDown(event) {
//     if (event.key === "Enter" && country.length >= 3 && filteredCountries.length > 0) {
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

const validateField = (name, value) => {
    let message = "";
    const pattern = phoneNumberPatterns[country] || /^\d{10}$/;
    switch(name) {
        case "firstName":
            if (!value) {
                message = "First name is required";
            } else if (value.length < 3) {
                message = "First name must be at least 3 characters";
            } else if (value.length > 20) {
                message = "First name must not exceed 20 characters";
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                message = "First name must contain only letters and spaces, no numbers or special characters allowed";
            }
            break;
        
        case "lastName":
            if (value) {
                if (value.length > 20) {
                    message = "Last name must not exceed 20 characters";
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    message = "Last name must contain only letters and spaces, no numbers or special characters allowed";
                }
            }
            break;

        case "country":
            if (!value) {
                message = "Country is required";  // Country must be selected
            } else if (!countries.some(c => c.name.toLowerCase() === value.toLowerCase())) {
                message = "Please select a country from the list";  // Check if country is in the list
            }
            break;

        case "cellPhone":
            if (!value) message = "Primary phone is required";
            else if (pattern && !pattern.test(value)) message = `Primary phone is invalid for ${country}`;
            break;

        case "alternatePhone":
            if (value && pattern && !pattern.test(value)) {
                message = `Alternate phone is invalid for ${country}`;
            }
            break;

        case "companyName":
            if (value) {
            if (value.length < 3) {
                message = "Company name must be at least 3 characters";
            } else if (value.length > 35) {
                message = "Company name must not exceed 35 characters";
            } 

            else if (!/^[A-Za-z][\w\s.,&()-]*$/.test(value)) {
                message = "Company name contains invalid characters or starts with a number";
            } }
            break;

        case "companytype":
            if (value) {
                if (value.length < 3) message = "Company type must be at least 3 characters";
                else if (value.length > 25) message = "Company type must not exceed 25 characters";
                else if (!/^[A-Za-z\s]+$/.test(value)) message = "Company type should contain only letters";
            }
            break;


        case "jobtitle":
            if (value) {
                value = value.replace(/\b0+(\d)/g, "$1");

                if (/ \b0\b/.test(value)) {
                    message = "Job title cannot contain level 0";
                }

                else if (value.length < 3) message = "Job title must be at least 3 characters";
                else if (value.length > 30) message = "Job title must not exceed 30 characters";

                // Regex to allow letters, spaces, hyphens, periods, and valid levels (1/2/3 or I/II/III, up to 3 levels)
                else if (!/^[A-Za-z\s.-]+( (I{1,3}|\d{1})(\/(I{1,3}|\d{1})){0,2})?$/.test(value)) 
                    message = "Job title should contain only letters, spaces, hyphens, periods, or valid levels (e.g., 1/2/3 or I/II/III, up        to 3 levels)";
            }
            break;

        case "gstNumber":
            if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/.test(value)) message = "Invalid GST number format (e.g, 12ABCDE1234F4Z5)";
        break;

        case "tanNumber":
                if (value && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value)) message = "Invalid TAN format (e.g., ABCD12345E)";
                break;
        }

    errors = { ...errors, [name]: message };
}

function checkcount() {
    if (!country) {
        errors.alternatePhone = "Select country before entering number"; 

}
}

function checkcountry() {
    if (!country) {
        errors.cellPhone = "Select country before entering number"; 

}
}

function otherstr() {
  const found = countries.find(
    c => c.name.toLowerCase().trim() === country.toLowerCase().trim()
  );
  if (!found && country.length!==0) {
    errors.country = "Please select a valid country from the dropdown";
    return false;
  } else {
    delete errors.country;
    return true;
  }
}
const validateForm = () => {
    errors = {};
    validateField("firstName", firstName);
    validateField("lastName", lastName);
    validateField("cellPhone", cellPhone);
    validateField("alternatePhone", alternatePhone);
    validateField("companyName", companyName);
    validateField("companytype", companytype);
    validateField("gstNumber", gstNumber);
    validateField("jobtitle", jobtitle);
    validateField("tanNumber", tanNumber);
    validateField("country", country);

    return Object.values(errors).every(error => !error);
}

const handleSubmit =({cancel})=>{
    // const isCountryValid = otherstr();
    showErrors = true;
    

        if(!validateForm()){
            cancel()
        }
    return async({result})=>{
        console.log('form result==>',result)
        if(result.type === "success"){
            toggleEdit = false
            dispatch("onSuccess",result.data)
            // await update()
            location.reload()

        }
    }
}

</script>
<div class="shadow max-w-7xl rounded p-5 bg-white">
    {#if toggleEdit}
    <div class="">
        <h1 class=" text-xl font-bold"> Edit Contact Information <span class=" text-xs font-normal"> <span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 px-2"
        method="POST" action="?/editContact" use:enhance={handleSubmit}>
            <input type="hidden" name="recordId" value={recordId}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="firstName">
                        <span class=" text-sm font-bold text-red-500">*</span>First Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500"
                     type="text" name="firstName" bind:value={firstName} on:input={()=>{firstName=firstName.trimStart();validateField("firstName", firstName);}}/>
                     {#if showErrors && errors?.firstName}
					<span class="text-red-600 text-xs">{errors.firstName}</span>
				     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="lastName">
                        Last Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="lastName" bind:value={lastName} on:input={()=>{lastName=lastName.trimStart();validateField("lastName", lastName);}}/>
                    {#if errors?.lastName}
					<span class="text-red-600 text-xs">{errors.lastName}</span>
				     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full" >
                    <!-- <label class="w-full text-xs md:text-sm font-medium mt-1" for="country">Country</label> -->
                    <label class=" text-xs md:text-sm font-medium" for="country">
                        <span class=" text-sm font-bold text-red-500">*</span>Country</label><br>
                    <div class="relative z-10" bind:this={containerRef}>
                      <div class="flex items-center border-1 border-gray-300 rounded-md my-1 overflow-hidden">
                          <input
                            type="text"
                            name="country"
                            bind:value={country}
                            placeholder="Search Country"
                      on:click={toggleDropdown}
                            on:input={toggleDropdown}
                            on:input={filterCountries}
                      on:input={otherstr}
                      on:input={delete errors.country}
                      on:keydown={handleKeyDown}
                      on:input={() => {
                        country = country.trimStart(); 
                        validateField("country", country);
                      }}
                      class="w-full focus:ring-0 focus:border-primary-400 px-2 py-2 text-xs md:text-sm border-none"
                          />
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-no-static-element-interactions -->
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      style:transform={showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
                      on:click={toggleDropdown}>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 9l-7 7-7-7"/>
                    </svg>
                    </div>
                          {#if showDropdown}
                            <ul class="absolute z-10 w-full text-sm sm:text-base bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                              {#each filteredCountries as { name, code },index}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <!-- <li on:click|stopPropagation={() => selectCountry({ name, code })} class="cursor-pointer px-1 py-0 sm:text-sm text-xs hover:bg-gray-200">
                                  <option value={code}>{name} ({code})</option>
                                </li> -->
                                <li id={`dropdown-item-${index}`}
                                	class="px-4 py-2 cursor-pointer {highlightedIndex === index
                                	? 'bg-primary-100'
                                	: 'hover:bg-primary-50'}"
                                	on:click|stopPropagation={() => selectCountry({ name, code })} >
                                {name} ({code})
                                </li>
                              {/each}
                              {#if filteredCountries.length === 0}
                                <li class="px-2 py-1 text-gray-500">No results found</li>
                              {/if}
                            </ul>
                          {/if}
                        </div>
                        {#if errors?.country}
                          <p class="text-red-500 text-xs mt-1">{errors.country}</p>
                        {/if}
                </div>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="cellPhone"><span class=" text-sm font-bold text-red-500">*</span>Primary Phone</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="cellPhone" bind:value={cellPhone} on:input={()=>{cellPhone=cellPhone.trimStart();validateField("cellPhone", cellPhone);checkcountry();}}/>
                {#if showErrors && errors?.cellPhone}
				    <span class="text-red-600 text-xs">{errors.cellPhone}</span>
			    {/if}
            </div>
                       
            </div>
            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="alternatePhone"><span class=" text-sm font-bold text-red-500"></span>Alternative Phone </label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="alternatePhone" bind:value={alternatePhone} on:input={()=>{alternatePhone=alternatePhone.trimStart();validateField("alternatePhone", alternatePhone);checkcount();}}/>
                    {#if errors?.alternatePhone}
                        <span class="text-red-600 text-xs">{errors.alternatePhone}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companyName">Company Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companyName" bind:value={companyName} on:input={()=>{companyName=companyName.trimStart();validateField("companyName", companyName);}}/>
                    {#if errors?.companyName}
                        <span class="text-red-600 text-xs">{errors.companyName}</span>
                    {/if}
                </div>
               
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companytype">Company Type</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companytype" bind:value={companytype} on:input={()=>{companytype=companytype.trimStart();validateField("companytype", companytype);}}/>
                    {#if errors?.companytype}
                        <span class="text-red-600 text-xs">{errors.companytype}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="gstNumber">GST Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="gstNumber" bind:value={gstNumber} on:input={()=>{gstNumber=gstNumber.trimStart();validateField("gstNumber", gstNumber);}}/>
                    {#if errors?.gstNumber}
                        <span class="text-red-600 text-xs">{errors.gstNumber}</span>
                    {/if}
                </div>
              
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="jobtitle">Job Title</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="jobtitle" bind:value={jobtitle} on:input={()=>{jobtitle=jobtitle.trimStart();validateField("jobtitle", jobtitle);}}/>
                    {#if errors?.jobtitle}
                        <span class="text-red-600 text-xs">{errors.jobtitle}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="tanNumber">TAN Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="tanNumber" bind:value={tanNumber} on:input={()=>{tanNumber=tanNumber.trimStart();validateField("tanNumber", tanNumber);}}/>
                    {#if errors?.tanNumber}
                        <span class="text-red-600 text-xs">{errors.tanNumber}</span>
                    {/if}
                </div>
            </div>

            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="button" on:click={()=>{
                    toggleEdit = false
                    window.location.reload()
                }} class=" w-full rounded-md py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
                <button type="submit" class=" w-full rounded-md py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            </div>

        </form>
     </div>
    {/if}

    {#if !toggleEdit}
    <div class="overflow-hidden mt-4 sm:mt-0">
        <h1 class="font-bold text-lg lg:text-xl mb-4 px-2 sm:px-0">
            Manage Your Personal Information
        </h1>
        <div class="mt-4 px-2">
            <div class="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h2 class="font-semibold text-base lg:text-lg">Contact Information</h2>
                <button 
                    on:click={() => toggleEdit = true} 
                    class="px-4 py-2 rounded-md font-medium text-sm text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-200 min-w-[80px]">
                    Edit
                </button>
            </div>
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">Name:</label>
                    <div class="text-sm text-gray-600 min-h-[20px] sm:ml-1">
                        {#if firstName && firstName !== 'N/A' || lastName && lastName !== 'N/A'}
                            <span>{firstName} {lastName}</span>
                        {:else}
                            <span>
                                {#if email && email.includes('@')}
                                    {email.split('@')[0]}
                                {:else}
                                    {email}
                                {/if}
                            </span>
                        {/if}
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">Primary Phone:</label>
                    <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                        {#if !cellPhone && (firstName && lastName && email || email)}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <a 
                                on:click={() => toggleEdit = true} 
                                class="text-primary-500 font-medium hover:underline cursor-pointer transition-colors duration-200">
                                Update Phone Number
                            </a>
                        {:else}
                            <span>{cellPhone || "N/A"}</span>
                            {#if errors?.cellPhone}
                                <div class="text-red-600 text-xs mt-1">{errors.cellPhone}</div>
                            {/if}
                        {/if}
                    </div>
                </div>
                {#if alternatePhone}
                    <div class="flex flex-col sm:flex-row sm:items-center ">
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label class="font-medium text-sm text-gray-700 sm:min-w-[130px] sm:flex-shrink-0">Alternative Phone:</label>
                        <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                            <span>{alternatePhone}</span>
                        </div>
                    </div>
                {/if}
                
                <div class="flex flex-col sm:flex-row sm:items-center">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="font-medium text-sm text-gray-700 sm:min-w-[60px] sm:flex-shrink-0">Email:</label>
                    <div class="flex items-center space-x-2 min-h-[20px] sm:ml-0.5">
                        <span class="text-sm text-gray-600 break-all">{email || "N/A"}</span>
                        <Icon 
                            icon="tdesign:verified-filled" 
                            class="text-lg flex-shrink-0 {isEmailVerified ? 'text-green-500' : 'text-gray-400'}"/>
                    </div>
                </div>
                <div class="lg:col-span-2">
                    {#if needsPasswordSetup}
                        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <p class="text-sm text-primary-600 leading-relaxed">
                                We noticed you haven't set up a password yet. To keep your account safe, please create one now. 
                                <a 
                                    href="/reset-password" 
                                    class="text-primary-600 font-medium hover:underline hover:text-primary-500 transition-colors duration-200">
                                    Click here to setup your password
                                </a>
                            </p>
                        </div>
                    {:else}
                        <div class="flex flex-col sm:flex-row sm:items-center">
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="font-medium text-sm text-gray-700 sm:min-w-[80px] sm:flex-shrink-0">Password:</label>
                            <div class="min-h-[20px] sm:ml-0.5">
                                <a 
                                    href="/reset-password" 
                                    class="text-sm text-primary-500 font-semibold hover:underline transition-colors duration-200">
                                    Reset Password
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
            </section>
            {#if companyName || companytype || jobtitle || gstNumber || tanNumber}
                <div class="mt-8">
                    <h2 class="font-semibold text-base lg:text-lg border-b border-gray-200 pb-3 mb-4">
                        Business Information
                    </h2>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {#if companyName}
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">Company Name:</label>
                                <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                                    <span>{companyName || "--"}</span>
                                </div>
                            </div>
                        {/if}
                        {#if companytype}
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">Company Type:</label>
                                <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                                    <span>{companytype || "--"}</span>
                                </div>
                            </div>
                        {/if}
                        {#if gstNumber}
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">GST Number:</label>
                                <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                                    <span>{gstNumber || "--"}</span>
                                </div>
                            </div>
                        {/if}
                        {#if tanNumber}
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">TAN Number:</label>
                                <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                                    <span>{tanNumber || "--"}</span>
                                </div>
                            </div>
                        {/if}
                        {#if jobtitle}
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label class="font-medium text-sm text-gray-700 sm:flex-shrink-0">Job Title:</label>
                                <div class="text-sm text-gray-600 min-h-[20px] sm:ml-0.5">
                                    <span>{jobtitle || "--"}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
    {/if}
</div>