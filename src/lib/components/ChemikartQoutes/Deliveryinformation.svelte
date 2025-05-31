<script>
  import Icon from '@iconify/svelte';
import { Cusdetails } from '$lib/stores/solution_stores.js';
import { Delivery } from '$lib/stores/solution_stores.js'
  import { postalCodePatterns } from '$lib/Data/constants.js'
  import { onMount } from 'svelte';
  let pincodeError = '';
  export let tog
  export let tog1
  export let tog2
  export let tog3
  export let tog4
  export let tog5
    export let showStep1 = true;
  export let showStep2 = true;
  export let showStep3 = true;
  export let showStep4 = true;
  export let showStep5 = true;
  let selectbox=false;
  $:{
  if ($Cusdetails.Country=== "India") {
    selectbox=true;
  } else {
    selectbox=false;
  }
  }
  
  const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

let errorMessage = '';
let errorMessages = {
  address1: '',
  address2: '',
  postalCode: '',
  gst: ''
};
console.log();

let activeIndex = -1;

let state = ''; // This holds the selected state

let stateSearch = '';
let showStateDropdown = false;
let autoSelectedStateOnce = false;

function toggleDropdown() {
  showStateDropdown = !showStateDropdown;
}

// Reactive filteredStates: filter states by search input
$: filteredStates = stateSearch
  ? states.filter(s => s.toLowerCase().startsWith(stateSearch.toLowerCase()))
  : states;

// Function to select a state from the dropdown
function selectState(selected) {
state = selected;
stateSearch = selected;
$Delivery.Country = selected; // Optional, if Delivery.Country is used elsewhere
showStateDropdown = false;
autoSelectedStateOnce = true;
activeIndex = -1;
}

// Auto select if exactly one match after typing 2+ chars and not auto selected before
$: {
  if (
    filteredStates.length === 1 &&
    stateSearch.length >= 2 &&
    !autoSelectedStateOnce
  ) {
    const autoSelected = filteredStates[0];
    setTimeout(() => {
      selectState(autoSelected);
      autoSelectedStateOnce = true;
    }, 200);
  }
  if (stateSearch.length < 2) {
    autoSelectedStateOnce = false;
  }
}

function handleKeyDown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % filteredStates.length;
    scrollToHighlightedItem();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + filteredStates.length) % filteredStates.length;
    scrollToHighlightedItem();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const indexToSelect = activeIndex === -1 ? 0 : activeIndex;
    if (filteredStates.length > 0) {
      selectState(filteredStates[indexToSelect]);
    }
  }
}

function scrollToHighlightedItem() {
  const item = document.getElementById(`dropdown-item-${activeIndex}`);
  if (item) item.scrollIntoView({ block: "nearest" });
}


function validateInput(input, regex, errorMessage) {
  return regex.test(input) ? '' : errorMessage;
}
let stateDropdownRef;

function handleFormClick(event) {
  const isState = stateDropdownRef?.contains(event.target);
  if (!isState) {
    showStateDropdown = false;
  }
}
let errors = {};

function validateAdd1(event) {
  const input = event.target.value;
  const trimmedAdd1 = input.trim();
  let errors = {}; // or your existing error object
  const regex = /^[a-zA-Z0-9\s,.'\-/#()]*$/;

  if (!trimmedAdd1) {
      errors = { ...errors, Address1: "" };
  } else if (trimmedAdd1.length < 3 || trimmedAdd1.length > 200) {
      errors = { ...errors, Address1: "Address1 must be between 3–200 chars" };
  } else if (!regex.test(trimmedAdd1)) {
      errors = { ...errors, Address1: "Invalid chars in Address1" }; 
  } else if (/<[^>]*>/.test(trimmedAdd1)) {
      errors = { ...errors, Address1: "Address1 should not contain HTML tags" };
  } else {
      const { Address1, ...rest } = errors;
      errors = rest;
  }

  // Optional: Assign to your global or external error state
  errorMessages.address1 = errors.Address1 || "";

  return errors; // If needed elsewhere
}

function validateAdd2(event) {
  const input = event.target.value;
  const trimmedAdd2 = input.trim();
  let errors = {}; // or your existing error object
  const regex = /^[a-zA-Z0-9\s,.'\-/#()]*$/;

  if (!trimmedAdd2) {
      errors = { ...errors, Address2: "" };
  } else if (trimmedAdd2.length < 3 || trimmedAdd2.length > 200) {
      errors = { ...errors, Address2: "Address2 must be between 3–200 chars" };
  } else if (!regex.test(trimmedAdd2)) {
      errors = { ...errors, Address2: "Invalid chars in Address2" };
  } else if (/<[^>]*>/.test(trimmedAdd2)) {
      errors = { ...errors, Address2: "Address2 should not contain HTML tags" };
  } else {
      const { Address2, ...rest } = errors;
      errors = rest;
  }

  // Optional: Assign to your global or external error state
  errorMessages.address2 = errors.Address2 || "";

  return errors; // If needed elsewhere
}


function validateCity(event) {
  const input = event.target.value;
  const trimmedCity = input.trim();
  let errors = {}; // or your existing error object
  const regex = /^[a-zA-Z\s,.'\-/#()]*$/;

  if (!trimmedCity) {
      errors = { ...errors, City: "" };
  } else if (trimmedCity.length < 3 || trimmedCity.length > 200) {
      errors = { ...errors, City: "City must be between 3–200 chars" };
  } else if (!regex.test(trimmedCity)) {
      errors = { ...errors, City: "Invalid chars in City" }; 
  } else if (/<[^>]*>/.test(trimmedCity)) {
      errors = { ...errors, City: "City should not contain HTML tags" };
  } else {
      const { City, ...rest } = errors;
      errors = rest;
  }

  // Optional: Assign to your global or external error state
  errorMessages.city = errors.City || "";

  return errors; // If needed elsewhere
}

function validateCountry(event) {
  const input = event.target.value;
  const trimmedCountry = input.trim();
  let errors = {}; // or your existing error object
  const regex = /^[a-zA-Z\s,.'\-/#()]*$/;

  if (!trimmedCountry) {
      errors = { ...errors, Country: "" };
  } else if (trimmedCountry.length < 3 || trimmedCountry.length > 300) {
      errors = { ...errors, Country: "must be between 3–300 chars" };
  } else if (!regex.test(trimmedCountry)) {
      errors = { ...errors, Country: "Invalid chars in State" };
  } else if (/<[^>]*>/.test(trimmedCountry)) {
      errors = { ...errors, Country: "State should not contain HTML tags" };
  } else {
      const { Country, ...rest } = errors;
      errors = rest;
  }

  // Optional: Assign to your global or external error state
  errorMessages.Country = errors.Country || "";

  return errors; // If needed elsewhere
}


function validatePostalcode(event, country) {
  const input = event.target.value;
  const regex = postalCodePatterns[country] || /^.*$/; 
  if (!regex.test(input)) {
      errorMessages.postalCode = `Please enter a valid postal code for ${country}`;
  } else {
      errorMessages.postalCode = ''; 
  }
}

function validateGST(event) {
const input = event.target.value;
const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
if (input.trim() !== '') {
  errorMessages.gst = validateInput(input, regex, 'Please enter a valid GST number (eg: 12ABCDE1234F4Z5)');
} else {
  errorMessages.gst = ''; 
}
}

function validateAll() {
  if (!$Delivery.Address1 || !$Delivery.Address2 || !$Delivery.City || !$Delivery.Country || !$Delivery.Post) {
      errorMessage = "Please fill all the required fields"; 
      return false; 
  }
  errorMessages = {
      address1: '',
      address2: '',
      postalCode: '',
      gst: ''
  };
  validateAdd1({ target: { value: $Delivery.Address1 } });
  validateAdd2({ target: { value: $Delivery.Address2 } });
  validateCity({ target: { value: $Delivery.City } });
  validateCountry({ target: { value: $Delivery.Country } });
  validatePostalcode({ target: { value: $Delivery.Post } });
  if ($Delivery.County.trim() !== '') {
validateGST({ target: { value: $Delivery.County } });
}
  return !Object.values(errorMessages).some(message => message !== '');
}

const sub = () => {
  if (!validateAll()) {
      return; 
  }
  errorMessage = ''; 
  tog5(); 
};

onMount(() => {
  const storedDetails = JSON.parse(localStorage.getItem('Delivery'));
  if (storedDetails) {
  Object.assign($Delivery, storedDetails);
  }
});

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
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
      Step 1: Select custom solution type
    </h1>
  </span>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={() => handleEdit('step1', tog)}>Edit</button>
  </div>
    {/if}
  <hr /><hr />
    {#if showStep2}
  <div id="step2" class="py-10 bg-white  flex justify-between">
      <span class="flex items-center gap-2">
          <Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
      Step 2: Select custom format 
    </h1>
      </span>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={() => handleEdit('step2', tog1)}>Edit</button>
  </div>
    {/if}
  <hr /><hr />
    {#if showStep3}
  <div id="step3" class="py-10 bg-white  flex justify-between">
      <span class="flex items-center gap-2">
          <Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
      Step 3: Configure custom solution 
    </h1>
      </span>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={() => handleEdit('step3', tog2)}>Edit</button>
  </div>
    {/if}
  <hr /><hr />
    {#if showStep4}
  <div id="step4" class="py-10 bg-white  flex justify-between">
      <span class="flex items-center gap-2">
          <Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300 " style="stroke-width: 2;"  />
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
      Step 4: Additional notes
    </h1>
      </span>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={() => handleEdit('step4', tog3)}>Edit</button>
  </div>
    {/if}
  <hr /><hr />
  <!-- <div class="py-10 bg-white  flex justify-between">
      <span class="flex items-center gap-2">
          <Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
      Step 5: Customer details
    </h1>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog4()}>Edit</button>
  </div> -->


    {#if showStep5}
    <div id="step5" class="py-10 bg-white  flex justify-between">
      <span class="flex items-center gap-2">
          <Icon icon="ph:user-list-bold" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300 "  />
    <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
          Step 5: Customer details
    </h1>
      </span>
    <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={() => handleEdit('step5', tog4)}>Edit</button>
  </div>
    {/if}
  <hr /><hr />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="bg-white " on:click={handleFormClick}>
    <div>
          <span class="flex items-center gap-2 pt-10">
              <Icon icon="material-symbols:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-heading" />
      <h1 class="font-bold sm:text-2xl text-sm "> Step 6: Delivery information
      </h1>
          </span>
      <div class="sm:ml-10 ml-0">
      <h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm">Address</h1>
     
     
      <div class="mt-2 mb-2 ">
        <label for="" class="sm:text-sm text-xs">State <span class="text-primary-500"> *</span> </label>
        <br>
       {#if selectbox}
       <!-- <select 
       class="block rounded md:w-3/4 w-full lg:w-1/2 p-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 bg-white"
       name="Country" id="country" bind:value={$Delivery.Country}>
         <option value="" disabled selected>Select your State</option>
         {#each states as s}
         <option value={s}>{s}</option>
         {/each}
       </select> -->

               <div class="relative w-full text-xs" bind:this={stateDropdownRef}>
                  <div class="flex items-center border rounded  overflow-hidden  md:w-3/4 w-full lg:w-1/2  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 focus:border-primary-500 bg-white">
                 
                    <input
class="w-full focus:ring-0 focus:border-primary-400 px-2 text-xs md:text-sm border-none py-1.5"
type="text"
bind:value={stateSearch}
on:input={() => {
  showStateDropdown = true;
  if (stateSearch.length < 2) autoSelectedStateOnce = false;
  activeIndex = -1;
}}
on:focus={() => (showStateDropdown = true)}
on:keydown={handleKeyDown}

placeholder="Search state"
autocomplete="off"
/>


<!-- on:input={() => {
    showStateDropdown = true;
    if (stateSearch.length < 2) autoSelectedStateOnce = false;
  }}
  on:focus={() => (showStateDropdown = true)}
  on:keydown={(e) => {
    if (e.key === 'Enter' && filteredStates.length > 0) {
      e.preventDefault();
      selectState(filteredStates[0]);
    }
  }} -->

                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  style:transform={showStateDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
                  on:click={toggleDropdown}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

                  </div>
                  {#if showStateDropdown}
                    <ul
                      class="absolute z-10 bg-white border  max-h-40 overflow-y-auto mt-1 shadow block rounded md:w-3/4 w-full lg:w-1/2 p-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500  focus:border-primary-500"
                    >
                    {#each filteredStates as state, index}
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li id={`dropdown-item-${index}`} 
                      class=" py-1 cursor-pointer hover:bg-primary-100 {index === activeIndex ? 'bg-primary-100 font-semibold' : ''}"
                      on:click={() => selectState(state)}
                    >
                      {state}
                    </li>
                  {/each}
                      {#if filteredStates.length === 0}
                        <li class="px-2 py-1 text-gray-500">No results</li>
                      {/if}
                    </ul>
                  {/if}
                </div>
                {#if errorMessage && (!state || !$Delivery.Country)}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  *Required
                </div>
              {/if}
              
       {:else}
       <input type="text" name="Country" id="country" 
      class="block rounded  md:w-3/4 w-full lg:w-1/2 py-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
      bind:value={$Delivery.Country}


              on:input={() => {
                  validateCountry
                  const trimmedCountry = $Delivery.Country.trimStart();
                            $Delivery.Country= trimmedCountry;

                      if (!trimmedCountry) {
    errors = { ...errors, Country: "" };
  } else if (trimmedCountry.length < 3 || trimmedCountry.length > 300) {
errors = { ...errors, Country: "State must be between 3–300 chars" };
}else if (!/^[a-zA-Z\s,.'\-/#()]*$/.test(trimmedCountry)) {
    errors = { ...errors, Country: "Invalid chars in State" };
  } else if (/<[^>]*>/.test(trimmedCountry)) {
    errors = { ...errors, Country: "State should not contain HTML tags" };
  } else {
    const { Country, ...rest } = errors;
    errors = rest; 
  }
              }}
               />
              {#if errorMessage && !$Delivery.Country}
              <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  *Required</div>
              {/if}

              {#if errors?.Country}
  <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
    {errors.Country}
  </span>
  {/if}
       {/if}
      </div>

      <div class="mt-2 mb-2 ">
        <label for="" class="sm:text-sm text-xs">City <span class="text-primary-500"> *</span> </label>
        <br>
        <input type="text" name="City" id="" 
        class="block rounded  md:w-3/4 w-full lg:w-1/2 py-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
        bind:value={$Delivery.City}
                on:input={() => {
                    validateCity
                    const trimmedCity = $Delivery.City.trimStart();
                              $Delivery.City= trimmedCity;

                              if (!trimmedCity) {
      errors = { ...errors, City: "" };
    } else if (trimmedCity.length < 3 || trimmedCity.length > 200) {
  errors = { ...errors, City: "City must be between 3–200 chars" };
}else if (!/^[a-zA-Z\s,.'\-/#()]*$/.test(trimmedCity)) {
      errors = { ...errors, City: "Invalid chars in City" };
    } else if (/<[^>]*>/.test(trimmedCity)) {
      errors = { ...errors, City: "City should not contain HTML tags" };
    } else {
      const { City, ...rest } = errors;
      errors = rest; 
    }
                    }} />
                {#if errorMessage && !$Delivery.City}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    *Required</div>
                {/if}
                {#if errors?.City}
    <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
      {errors.City}
    </span>
    {/if}
      </div>

      <div class="">
        <label for="" class="sm:text-sm text-xs">Address line 1 <span class="text-primary-500"> *</span> </label>
        <br>
        <input type="text" name="Address" bind:value={$Delivery.Address1} id="" 
        class="block rounded  md:w-3/4 w-full lg:w-1/2 py-1.5 sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
                   
                            on:input={() => {
                              validateAdd1
                              const trimmedAdd1 = $Delivery.Address1.trimStart();
                                        $Delivery.Address1= trimmedAdd1;

                                        if (!trimmedAdd1) {
    errors = { ...errors, Address1: "" };
  } else if (trimmedAdd1.length < 3 || trimmedAdd1.length > 200) {
errors = { ...errors, Address1: "Address1 must be between 3–200 chars" };
}else if (!/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(trimmedAdd1)) {
    errors = { ...errors, Address1: "Invalid chars in Address1" };
  } else if (/<[^>]*>/.test(trimmedAdd1)) {
    errors = { ...errors, Address1: "Address1 should not contain HTML tags" };
  } else {
    const { Address1, ...rest } = errors;
    errors = rest; 
  }
                              }}
  />
      <!-- {#if errorMessages.address1}
  <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
    {errorMessages.address1}</div>
  {/if} -->
      {#if errorMessage && !$Delivery.Address1}
              <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  *Required</div>
              {/if}
              {#if errors?.Address1}
  <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
    {errors.Address1}
  </span>
  {/if}

      </div>
      <div class="mt-2 mb-2 ">
        <label for="" class="sm:text-sm text-xs">Address line 2 <span class="text-primary-500"> *</span> </label>
        <br>
        <input type="text" name="Address2" bind:value={$Delivery.Address2} id="" 
        class="block rounded md:w-3/4 w-full lg:w-1/2 py-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
                on:input={() => {
                  validateAdd2
                  const trimmedAdd2 = $Delivery.Address2.trimStart();
                            $Delivery.Address2= trimmedAdd2;

                            if (!trimmedAdd2) {
    errors = { ...errors, Address2: "" };
  } else if (trimmedAdd2.length < 3 || trimmedAdd2.length > 200) {
errors = { ...errors, Address2: "Address2 must be between 3–200 chars" };
}else if (!/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(trimmedAdd2)) {
    errors = { ...errors, Address2: "Invalid chars in Address2" };
  } else if (/<[^>]*>/.test(trimmedAdd2)) {
    errors = { ...errors, Address2: "Address2 should not contain HTML tags" };
  } else {
    const { Address2, ...rest } = errors;
    errors = rest; 
  }
                  }}
  />
      <!-- {#if errorMessages.address2}
  <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
    {errorMessages.address2}</div>
  {/if} -->
      {#if errors?.Address2}
  <span class="text-red-500 text-xs sm:text-xs text-2s font-medium">
    {errors.Address2}
  </span>
  {/if}
      {#if errorMessage && !$Delivery.Address2}
              <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  *Required</div>
              {/if}

      </div>

      <div class="mt-2 mb-2 ">
        <label for="text1" class="sm:text-sm text-xs">Post code <span class="text-primary-500"> *</span> </label>
        <br>
        <input type="text" name="postcode" id="text1" 
        class="block rounded  md:w-3/4 w-full lg:w-1/2 py-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
        bind:value={$Delivery.Post} 
                on:input={(event) => {
                  validatePostalcode(event, $Cusdetails.Country)
                  const trimmedPost = $Delivery.Post.trim();
                            $Delivery.Post= trimmedPost;
                  }}
                />
                {#if errorMessages.postalCode}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    {errorMessages.postalCode}</div>
                {/if}
                {#if errorMessage && !$Delivery.Post}
              <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  *Required</div>
              {/if}
      </div>
      <div class="mt-2 mb-2 ">
      <label for="" class="text-sm ">GST</label><br>
      <input type="text" 
      class="block rounded  md:w-3/4 w-full lg:w-1/2 py-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
      name="County" id="" bind:value={$Delivery.County} 
             on:input={(event) => {
			$Delivery.County = event.target.value.trim();
			validateGST(event);
		}}
              />
              {#if errorMessages.gst}
              <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                  {errorMessages.gst}</div>
              {/if}
    </div>
    {#if errorMessage}
    <!-- <div class="text-red-500 ml-1 mt-1 text-xs font-medium">{errorMessage}</div>  -->
      {/if}
    <div class="flex space-x-4 ">
      <button
      type="button"
      on:click={sub}
      class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded sm:text-sm text-xs sm:px-5 px-2 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-500 focus:outline-none dark:focus:ring-primary-500 my-5"
      >Save & View Summary</button
    >		  
    </div>
      </div>
  </div>
  </div>
  <hr />