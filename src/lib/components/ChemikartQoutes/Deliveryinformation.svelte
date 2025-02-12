<script>
	import { Cusdetails } from '$lib/stores/solution_stores.js';
	import { Delivery } from '$lib/stores/solution_stores.js'
	  import { onMount } from 'svelte';
	  let pincodeError = '';
	  export let tog
	  export let tog1
	  export let tog2
	  export let tog3
	  export let tog4
	  export let tog5
	  let selectbox=false;
	  $:{
		if ($Cusdetails.Country=== "India") {
			selectbox=true;
		} else {
			selectbox=false;
		}
	  }
	  
	  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
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

function validateInput(input, regex, errorMessage) {
    return regex.test(input) ? '' : errorMessage;
}

function validateAdd1(event) {
    const input = event.target.value;
    const regex = /^[a-zA-Z0-9\s,.'\-/#()]*$/;
    errorMessages.address1 = validateInput(input, regex, 'Please enter a valid address');
}

function validateAdd2(event) {
    const input = event.target.value;
    const regex = /^[a-zA-Z0-9\s,.'\-/#()]*$/;
    errorMessages.address2 = validateInput(input, regex, 'Please enter a valid address');
}

function validatePostalcode(event) {
    const input = event.target.value;
    const regex = /^\d{6}$/;
    errorMessages.postalCode = validateInput(input, regex, 'Please enter a valid Postal code');
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
        setTimeout(() => {
	    errorMessage = '';
        }, 5000);
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
  
	  </script>
  <div class="py-10 bg-white  flex justify-between">
		  <h1 class="font-bold text-2xl text-black text-opacity-25">
			  Step 1: Select custom solution type
		  </h1>
		  <button type="button" class="font-semibold text-primary-500" on:click={tog()}>Edit</button>
	  </div>
	  <hr>
	  <div class="py-10 bg-white  flex justify-between">
		  <h1 class="font-bold text-2xl text-black text-opacity-25">
			  Step 2: Select custom format 
		  </h1>
		  <button type="button" class="font-semibold text-primary-500" on:click={tog1()}>Edit</button>
	  </div>
	  <hr>
	  <div class="py-10 bg-white  flex justify-between">
		  <h1 class="font-bold text-2xl text-black text-opacity-25">
			  Step 3: Configure custom solution 
		  </h1>
		  <button type="button" class="font-semibold text-primary-500" on:click={tog2()}>Edit</button>
	  </div>
	  <hr>
	  <div class="py-10 bg-white  flex justify-between">
		  <h1 class="font-bold text-2xl text-black text-opacity-25">
			  Step 4: Additional notes
		  </h1>
		  <button type="button" class="font-semibold text-primary-500" on:click={tog3()}>Edit</button>
	  </div>
	  <hr>
	  <div class="py-10 bg-white  flex justify-between">
		  <h1 class="font-bold text-2xl text-black text-opacity-25">
			  Step 5: Customer details
		  </h1>
		  <button type="button" class="font-semibold text-primary-500" on:click={tog4()}>Edit</button>
	  </div>
	  <hr>
	  <div class="bg-white ">
		  <div>
			  <h1 class="font-bold text-2xl py-10"> Step 6: Delivery information
			  </h1>
			  <hr>
			  <h1 class="font-semibold py-5 text-primary-500 ">Address</h1>
			  <div class="">
				  <label for="" class="text-sm">Address line 1 <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="Address" bind:value={$Delivery.Address1} id="" 
				  class="block rounded-md  md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				              on:input={validateAdd1}
		/>
        {#if errorMessages.address1}
		<div class="text-red-500 ml-1 mt-1 text-xs font-medium">
			{errorMessages.address1}</div>
		{/if}
        {#if errorMessage && !$Delivery.Address1}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    Address1 is required</div>
                {/if}

			  </div>
			  <div class="mt-2 mb-2 ">
				  <label for="" class="text-sm">Address line 2 <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="Address2" bind:value={$Delivery.Address2} id="" 
				  class="block rounded-md md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				              on:input={validateAdd2}
		/>
        {#if errorMessages.address2}
		<div class="text-red-500 ml-1 mt-1 text-xs font-medium">
			{errorMessages.address2}</div>
		{/if}
        {#if errorMessage && !$Delivery.Address2}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    Address2 is required</div>
                {/if}

			  </div>
			  <div class="mt-2 mb-2 ">
				<label for="" class="text-sm">City <span class="text-primary-500"> *</span> </label>
				<br>
				<input type="text" name="City" id="" 
				class="block rounded-md  md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				bind:value={$Delivery.City} />
                {#if errorMessage && !$Delivery.City}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    City is required</div>
                {/if}
			</div>
			  <div class="mt-2 mb-2 ">
				  <label for="" class="text-sm">State <span class="text-primary-500"> *</span> </label>
				  <br>
				 {#if selectbox}
				 <select 
				 class="block rounded-md md:w-3/4 w-full lg:w-1/2 p-1.5 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 bg-white"
				 name="Country" id="country" bind:value={$Delivery.Country}>
					 <option value="" disabled selected>Select your State</option>
					 {#each states as s}
					 <option value={s}>{s}</option>
				   {/each}
				 </select>
                 {#if errorMessage && !$Delivery.Country}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    State is required</div>
                {/if}
				 {:else}
				 <input type="text" name="Country" id="country" 
				class="block rounded-md  md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				bind:value={$Delivery.Country} />
                {#if errorMessage && !$Delivery.Country}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    State is required</div>
                {/if}
				 {/if}
			  </div>
			  <div class="mt-2 mb-2 ">
				  <label for="text1" class="text-sm">Post code <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="postcode" id="text1" 
				  class="block rounded-md  md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				  bind:value={$Delivery.Post} on:input={validatePostalcode}
                  />
                  {#if errorMessages.postalCode}
                  <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                      {errorMessages.postalCode}</div>
                  {/if}
                  {#if errorMessage && !$Delivery.Post}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    postalCode is required</div>
                {/if}
			  </div>
			  <div class="mt-2 mb-2 ">
				<label for="" class="text-sm ">GST</label><br>
				<input type="text" 
				class="block rounded-md  md:w-3/4 w-full lg:w-1/2 p-1 border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				name="County" id="" bind:value={$Delivery.County} on:input={validateGST}
                />
                {#if errorMessages.gst}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    {errorMessages.gst}</div>
                {/if}
			</div>
			 

		{#if errorMessage}
		  <div class="text-red-500 ml-1 mt-1 text-xs font-medium">{errorMessage}</div> <!-- Display the error message -->
	  {/if}
		  </div>
		  <div class="flex space-x-4 mt-5 ">
			  <button
			  type="button"
			  on:click={sub}
			  class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-500 dark:hover:bg-primary-500 focus:outline-none dark:focus:ring-primary-500 px-20 my-5"
			  >Save & View Summary</button
		  >		  
		  </div>
	  </div>
	  <hr>