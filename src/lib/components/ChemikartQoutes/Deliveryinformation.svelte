<script>
    import Icon from '@iconify/svelte';
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
  const postalCodePatterns = {
    'United States': /^[0-9]{5}(?:-[0-9]{4})?$/,
    'Canada': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    'United Kingdom': /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
    'Germany': /^\d{5}$/,
    'India': /^\d{6}$/,
    'Australia': /^\d{4}$/,
    'France': /^\d{5}$/,
    'Italy': /^\d{5}$/,
    'Spain': /^\d{5}$/,
    'Poland': /^\d{5}$/,
    'Russia': /^\d{6}$/,
    'China': /^\d{6}$/,
    'Japan': /^\d{3}-\d{4}$/,
    'Brazil': /^\d{5}-\d{3}$/,
    'Mexico': /^\d{5}$/,
    'New Zealand': /^\d{4}$/,
    'Singapore': /^\d{6}$/,
    'South Africa': /^\d{4}$/,
    'Belgium': /^\d{4}$/,
    'Netherlands': /^\d{4}\s?[A-Za-z]{2}$/,
    'Austria': /^\d{4}$/,
    'Sweden': /^\d{3} \d{2}$/,
    'Denmark': /^\d{4}$/,
    'Norway': /^\d{4}$/,
    'Finland': /^\d{5}$/,
    'Switzerland': /^\d{4}$/,
    'South Korea': /^\d{5}$/,
    'Thailand': /^\d{5}$/,
    'Hong Kong': /^\d{4}$/,
    'United Arab Emirates': /^\d{5}$/,
    'Malaysia': /^\d{5}$/,
    'Kuwait': /^\d{5}$/,
    'Saudi Arabia': /^\d{5}$/,
    'Egypt': /^\d{5}$/,
    'Pakistan': /^\d{5}$/,
    'Philippines': /^\d{4}$/,
    'Indonesia': /^\d{5}$/,
    'Greece': /^\d{5}$/,
    'Turkey': /^\d{5}$/,
    'Iran': /^\d{5}-\d{5}$/,
    'Colombia': /^\d{6}$/,
    'Chile': /^\d{7}$/,
    'Peru': /^\d{5}$/,
    'Venezuela': /^\d{4}$/,
    'Argentina': /^\d{4}$/,
    'Ukraine': /^\d{5}$/,
    'Romania': /^\d{6}$/,
    'Czech Republic': /^\d{5}$/,
    'Slovakia': /^\d{5}$/,
    'Hungary': /^\d{4}$/,
    'Lithuania': /^\d{5}$/,
    'Latvia': /^\d{4}$/,
    'Estonia': /^\d{5}$/,
    'Bulgaria': /^\d{4}$/,
    'Croatia': /^\d{5}$/,
    'Slovenia': /^\d{4}$/,
    'North Macedonia': /^\d{4}$/,
    'Serbia': /^\d{5}$/,
    'Montenegro': /^\d{5}$/,
    'Albania': /^\d{4}$/,
    'Armenia': /^\d{4}$/,
    'Georgia': /^\d{4}$/,
    'Moldova': /^\d{4}$/,
    'Belarus': /^\d{6}$/,
    'Kosovo': /^\d{5}$/,
    'Bosnia and Herzegovina': /^\d{5}$/,
    'Iceland': /^\d{3}$/,
    'Luxembourg': /^\d{4}$/,
    'Malta': /^\d{4}$/,
    'Andorra': /^\d{3}$/,
    'Liechtenstein': /^\d{4}$/,
    'San Marino': /^\d{5}$/,
    'Monaco': /^\d{5}$/,
    'Vatican City': /^\d{5}$/,
    'Taiwan': /^\d{5}$/,
    'Haiti': /^\d{4}$/,
    'Jamaica': /^\d{5}$/,
    'Barbados': /^\d{5}$/,
    'Bahamas': /^\d{5}$/,
    'Bermuda': /^\d{5}$/,
};

let errorMessage = '';
let errorMessages = {
    address1: '',
    address2: '',
    postalCode: '',
    gst: ''
};
console.log();

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
  <div class="pb-10 bg-white  flex justify-between">
    <span class="flex items-center gap-2">
		<Icon icon="ph:test-tube-fill" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
		  <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			  Step 1: Select custom solution type
		  </h1>
    </span>
		  <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog()}>Edit</button>
	  </div>
	  <hr /><hr />
	  <div class="py-10 bg-white  flex justify-between">
        <span class="flex items-center gap-2">
            <Icon icon="wpf:edit-file" class="sm:w-7 sm:h-7 w-5 h-5 text-primary-300" />
		  <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			  Step 2: Select custom format 
		  </h1>
        </span>
		  <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog1()}>Edit</button>
	  </div>
	  <hr /><hr />
	  <div class="py-10 bg-white  flex justify-between">
        <span class="flex items-center gap-2">
            <Icon icon="hugeicons:test-tube" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
		  <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			  Step 3: Configure custom solution 
		  </h1>
        </span>
		  <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog2()}>Edit</button>
	  </div>
	  <hr /><hr />
	  <div class="py-10 bg-white  flex justify-between">
        <span class="flex items-center gap-2">
            <Icon icon="material-symbols:add-notes-outline-rounded" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300 " style="stroke-width: 2;"  />
		  <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			  Step 4: Additional notes
		  </h1>
        </span>
		  <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog3()}>Edit</button>
	  </div>
	  <hr /><hr />
	  <div class="py-10 bg-white  flex justify-between">
        <span class="flex items-center gap-2">
            <Icon icon="ph:user-list" class="sm:w-8 sm:h-8 w-6 h-6 text-primary-300" />
		  <h1 class="font-bold sm:text-2xl text-sm text-black text-opacity-25">
			  Step 5: Customer details
		  </h1>
		  <button type="button" class="sm:text-lg text-xs font-semibold text-primary-500" on:click={tog4()}>Edit</button>
	  </div>
	  <hr /><hr />
	  <div class="bg-white ">
		  <div>
            <span class="flex items-center gap-2 pt-10">
                <Icon icon="material-symbols-light:delivery-truck-speed-outline-rounded" class="sm:w-9 sm:h-9 w-7 h-7 text-heading" />
			  <h1 class="font-bold sm:text-2xl text-sm "> Step 6: Delivery information
			  </h1>
            </span>
			  <div class="sm:ml-10 ml-0">
			  <h1 class="font-semibold py-5 text-primary-500 sm:text-md text-sm">Address</h1>
			  <div class="">
				  <label for="" class="sm:text-sm text-xs">Address line 1 <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="Address" bind:value={$Delivery.Address1} id="" 
				  class="block rounded  md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
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
				  <label for="" class="sm:text-sm text-xs">Address line 2 <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="Address2" bind:value={$Delivery.Address2} id="" 
				  class="block rounded md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
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
				<label for="" class="sm:text-sm text-xs">City <span class="text-primary-500"> *</span> </label>
				<br>
				<input type="text" name="City" id="" 
				class="block rounded  md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				bind:value={$Delivery.City} />
                {#if errorMessage && !$Delivery.City}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    City is required</div>
                {/if}
			</div>
			  <div class="mt-2 mb-2 ">
				  <label for="" class="sm:text-sm text-xs">State <span class="text-primary-500"> *</span> </label>
				  <br>
				 {#if selectbox}
				 <select 
				 class="block rounded md:w-3/4 w-full lg:w-1/2 p-1.5  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500 bg-white"
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
				class="block rounded  md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				bind:value={$Delivery.Country} />
                {#if errorMessage && !$Delivery.Country}
                <div class="text-red-500 ml-1 mt-1 text-xs font-medium">
                    State is required</div>
                {/if}
				 {/if}
			  </div>
			  <div class="mt-2 mb-2 ">
				  <label for="text1" class="sm:text-sm text-xs">Post code <span class="text-primary-500"> *</span> </label>
				  <br>
				  <input type="text" name="postcode" id="text1" 
				  class="block rounded  md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
				  bind:value={$Delivery.Post} 
				  on:input={(event) => validatePostalcode(event, $Cusdetails.Country)} 
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
				class="block rounded  md:w-3/4 w-full lg:w-1/2 p-1  sm:text-sm text-xs border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-500 border-1 focus:border-primary-500"
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