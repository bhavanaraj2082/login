<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onMount, onDestroy } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
  import { countries, postalCodePatterns } from '$lib/Data/constants.js';
  const dispatch = createEventDispatcher();
	export let formdata;
	export let actionName;
  export let isShowbox ;
  export let billing
  export let shipping ;
  let message="At least one address must be default";
  // export let accounttype;
	export let handlePopupAddress;
  let showErrors = false;
	let email='';
	let phone='';
	let postalCode='';
  // let gst='';
	let city='';
	let state='';
	let street='';
	let building='';
	let location='';
	let attentionTo='';
	let organizationName='';
	let department='';
	let errors = {};
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleAddress = (type,checked)=>{
    if(checked === true){
      if(type === "billing"){
        email= billing?.email || email ,
        phone= billing?.phone || phone ,
        postalCode= billing?.postalCode || postalCode ,
        city= billing?.city || city ,
        state= billing?.state || state ,
        organizationName= billing?.organizationName || organizationName ,
        attentionTo= billing?.attentionTo || attentionTo ,
        street= billing?.street || street ,
        location= capitalize(billing?.location) || location ,
        building= billing?.building || building ,
        department= billing?.department || department
      }
      else if(type === "shipping"){
        email= shipping?.email || email ,
        phone= shipping?.phone || phone ,
        postalCode= shipping?.postalCode || postalCode ,
        city= shipping?.city || city ,
        state= shipping?.state || state ,
        organizationName= shipping?.organizationName || organizationName ,
        attentionTo= shipping?.attentionTo || attentionTo ,
        street= shipping?.street || street ,
        location= capitalize(shipping?.location) || location ,
        building= shipping?.building || building ,
        department= shipping?.department || department
      }else{
        email= formdata?.email || email ,
        phone= formdata?.phone || phone ,
        postalCode= formdata?.postalCode || postalCode ,
        city= formdata?.city || city ,
        state= formdata?.state || state ,
        organizationName= formdata?.organizationName || organizationName ,
        attentionTo= formdata?.attentionTo || attentionTo ,
        street= formdata?.street || street ,
        location= formdata?.country ?capitalize(formdata?.country) : location  ,
        building= formdata?.building || building ,
        department= formdata?.department || department
      }
    }else{
      email= formdata?.email || email ,
        phone= formdata?.phone || phone ,
        postalCode= formdata?.postalCode || postalCode ,
        city= formdata?.city || city ,
        state= formdata?.state || state ,
        organizationName= formdata?.organizationName || organizationName ,
        attentionTo= formdata?.attentionTo || attentionTo ,
        street= formdata?.street || street ,
        location= formdata?.country ?capitalize(formdata?.country) : location ,
        building= formdata?.building || building ,
        department= formdata?.department || department
    }
  }
  handleAddress()
   // gst=formdata?.gst || gst,
  
  location= formdata?.location || location ;
	let name;
	let errorMessage = '';
	actionName == 'billingaddress' ? (name = 'Billing') : (name = 'Shipping');
	const handleCheckbox = (checked, Default) => {
		if (Default === true) {
			if (checked !== Default) {
				errorMessage = 'One address has to be Default';
			}
			if (checked === Default) {
				errorMessage = '';
			}
			console.log(errorMessage);
		} else {
			formdata.isDefault = true;
		}
	};

let filteredCountries = countries;
let showDropdown = false;
function selectCountry(selectedCountry) {
        location = selectedCountry.name; // Set the selected location name
        filteredCountries = countries; // Reset the filtered list
        showDropdown = false; // Hide dropdown after selection
        validateForm('location');
		    validatePhoneNumber(location, phone); 
		    validatePostalCode(location, postalCode); 
        delete errors.location; // Clear any existing errors
}

	function toggleDropdown() {
		showDropdown = !showDropdown; // Toggle the dropdown visibility
	}


	function filterCountries(event) {
		const searchTerm = event.target.value.toLowerCase();
		filteredCountries = countries.filter(country => 
			country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) || 
			country.code.toLowerCase().includes(searchTerm)
		);
    console.log(filteredCountries,"sdfghhdjjjjjjd");
		location = searchTerm; // Update the bound value with the search term
	}

function validatePhoneNumber(countryCode, phone) {
    if (!countryCode) {
        delete errors.phone;  
        return true;  
    }

    if (!phone || phone.trim() === '') {
        errors.phone = ``;
        delete errors.phone
        return false;
    }

    const location = getCountryByCode(countryCode);
    if (!location) {
        errors.phone = 'Invalid country selected';
        errors.location = 'Invalid country selected';
        return false;
    }

    const phonePattern = getPhonePattern(countryCode);
    if (!phonePattern) {
        errors.phone = 'Phone number pattern for country not found';
        return false;
    } 

    const phoneRegex = new RegExp(phonePattern);
    if (!phoneRegex.test(phone)) {
        errors.phone = `Please enter a valid phone number for ${location}.`;
        return false;
    } else {
        delete errors.phone;  
        return true;
    }
}

	function getCountryByCode(name) {
    const location = countries.find(c => c.name === name);
  
    return location ? location.name : null; 
}

    function getPhonePattern(countryCode) {
        const countryName = getCountryByCode(countryCode);
        if (!countryName) return '^[0-9]+$'; 
        const regex = phoneNumberPatterns[countryName];
        return regex || '^[0-9]+$'; 
    }

	let isValid = true;
  	
 function validateForm(fieldName) {
  street = street.trim()
  organizationName = organizationName.trim()
  department = department.trim()
  attentionTo = attentionTo.trim()
  location = location.trim()
  state = state.trim()
  city = city.trim()
  postalCode = postalCode.trim()
  if (!fieldName || fieldName === 'street') {
    if (!street || !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(street)) {
      errors.street = 'Address is required and can contain only letters, numbers, and a few special characters.';
    } else {
      delete errors.street;
    }
  }

  if (!organizationName || !/^[A-Za-z ]+$/.test(organizationName)) {
      console.log('object');
      errors.organizationName = 'Company name is required and can contain only letters';
    } else {
      delete errors.organizationName;
    }

    if (!department || !/^[A-Za-z ]+$/.test(department)) {
      errors.department = 'Department name is required and can contain only letters';
    } else {
      delete errors.department;
    }

    if (!attentionTo || !/^[A-Za-z ]+$/.test(attentionTo)) {
      errors.attentionTo = 'Person name is required and can contain only letters';
    } else {
      delete errors.attentionTo;
    }

    if (!city || !/^[a-zA-Z\s.'-]+$/.test(city)) {
      errors.city = 'Please enter a valid city Name';
    } else {
      delete errors.city;
    }

//   if (!fieldName || fieldName === 'phone') {
//     if (!country) {
//         delete errors.phone; 
//     } else {
//         if (!phone || phone.trim() === '') {
//             errors.phone = 'Required'; 
//         } else {
//             const countryDetails = getCountryByCode(country);
//             if (!countryDetails) {
//                 errors.phone = 'Invalid country selected';
//                 errors.country = 'Invalid country selected';
//             } else {
//                 const phonePattern = getPhonePattern(country);
//                 if (!phonePattern) {
//                     errors.phone = 'Phone number pattern for country not found'; 
//                 } else {
//                     const phoneRegex = new RegExp(phonePattern); 
//                     if (!phoneRegex.test(phone)) {
//                         errors.phone = `Please enter a valid phone number for ${countryDetails.name}.`; 
//                     } else {
//                         delete errors.phone;  // Valid phone number, so remove error
//                     }
//                 }
//             }
//         }
//     }
// }

if (!fieldName || fieldName === 'country') {
	if (!location || location === 'country') {
      errors.location = 'Please select a country';
    } else {
      delete errors.location;
    }
  }
  if (!fieldName || fieldName === 'state') {
    if (!state || !/^[a-zA-Z\s.'-]+$/.test(state)) {
      errors.state = 'State is required and can only contain letters and spaces.';
    } else {
      delete errors.state;
    }
  }

  if (!fieldName || fieldName === 'postalCode') {
    if (!postalCode || !/^\d{6}$|^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$|^\d{5}$|^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$|^\d{4} [A-Za-z]{2}$|^\d{4}$|^\d{5}-\d{3}$|^\d{3} \d{2}$|^\d{3}-\d{4}$|^[A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}$/.test(postalCode)) {
      errors.postalCode = 'Please enter a valid postal code';
    } else {
      delete errors.postalCode;
    }
  }

if (Object.keys(errors).length > 0) {
   console.log(errors);
    return false; 
  }

  return true; 

}

	function validatePostalCode(countryCode, postalCode) {
    const selectedCountry = countries.find(country => country.name === countryCode);
    // console.log('Selected Country:', selectedCountry); 
    
    if (selectedCountry && selectedCountry.postalRegex && postalCode) {
        const regex = selectedCountry.postalRegex;
        if (!regex.test(postalCode)) {
            errors.postalCode = 'Please enter a valid postal code for the selected country';
        } else {
            delete errors.postalCode;
        }
    }
}

function handleSubmit(event) {
  if (!validateForm()) {
    showErrors = true;
    event.preventDefault();
  }
}
$: show= isShowbox ? `Edit ${name} Address` : `Add ${name} Address`;

$:console.log(location,"location");

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=" w-full h-screen fixed top-0 left-0 z-50 modal-wrapper" on:click={handlePopupAddress}>
	<div class=" absolute w-full inset-0 backdrop-blur-sm bg-gray-500 bg-opacity-50 h-screen"></div>
	<div class=" relative w-full h-full">
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<form
			method="POST"
			action={`?/${actionName}`}
			on:click|stopPropagation
      use:enhance={({cancel}) => {
        if (!validateForm()) {
            console.log(validateForm(),"kkk");
            cancel()
        }
        return async({ result , update}) => {
          console.log(result,"uytrewq");
          if (result.type === 'success') {
				handlePopupAddress();
				await update();
				dispatch('onSubmit', result.data);
			  }
        };
      }}			
      class=" bg-white max-w-96 sm:max-w-96 md:max-w-md lg:max-w-lg h-5/6 md:h-5/6 overflow-y-scroll scroll rounded mx-auto my-12 px-5 pb-6 sm:px-6 md:px-8 lg:px-10">
			
      <h1 class="text-center text-md sm:text-lg md:text-xl font-semibold pt-6 md:pt-8 bg-white sticky top-0 z-20">
        {show}
    </h1>
        <!-- <h1>{isShowbox}</h1> -->
			<input type="hidden" name="userId" value={formdata.userId} />
			<input type="hidden" name="actionType" value={actionName} />
			<input type="hidden" name="addressId" value={formdata.addressId} />
			<input type="hidden" name="addAlternate" value={formdata.addAlternate} />
      <div class=" text-sm flex items-center gap-2 py-2.5">
        {#if actionName === 'billingaddress'}
        {#if shipping}
          <input class=" focus:ring-0 outline-none text-primary-500" on:change={(e)=>handleAddress("shipping",e.target.checked)} type="checkbox"> same as shipping address
        {/if}
      {:else}
      {#if billing}
       <input class=" focus:ring-0 outline-none text-primary-500" on:change={(e)=>handleAddress("billing",e.target.checked)} type="checkbox"> same as billing address
      {/if}
      {/if}
      </div>
			<label class="w-full text-xs md:text-sm font-medium mt-1 bg-red" for="firstname">Attention To</label>
			<input
				class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text"
				name="attentionTo"
        minlength="5"
        maxlength="50"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
				bind:value={attentionTo}/>
        <p class="{!errors?.attentionTo ? "hidden" : ""} text-red-500 text-xs">{errors?.attentionTo}</p>
			<label class="w-full text-xs md:text-sm font-medium mt-1" for="lastname">Company Name</label>
			<input
				class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text"
				name="organizationName"
        minlength="3"
        maxlength="50"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
				bind:value={organizationName}/>
        <p class="{!errors?.organizationName ? "hidden" : ""} text-red-500 text-xs">{errors?.organizationName}</p>
				<!-- <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="email">Email</label>
		             <input type="email" name="email" required
			         class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
			         bind:value={email}/>
                     {#if email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        <span class="text-red-500 text-xs block">Please enter a valid email</span>
                     {/if}
                     {#if showErrors && email.length === 0}
				        <span class="text-red-500 text-xs block">Email is required</span>
		             {/if}
                     {#if errors?.email}
		              <p class="text-xs text-red-500">{errors.email}</p>
	                 {/if} -->

                     <!-- <label class="w-full text-xs md:text-sm font-medium mt-1" for="phone">Phone</label>
						<input
						  class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
						  type="tel" name="phone" bind:value={phone}
						  title="Please enter a valid phone number"
						  on:input={() => validateForm('phone')}
						  on:input={() => validatePhoneNumber(country, phone)} 
                          on:input={delete errors.phone}/> 
						{#if errors?.phone}
				            <p class="text-red-500 text-xs mt-1">{errors.phone}</p>
			            {/if}
                        {#if showErrors && phone.length === 0}
				            <span class="text-red-500 text-xs block">Phone is required</span>
		                {/if} -->
			
        <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Department</label>
        <input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
          type="text" name="department" minlength="2" maxlength="40"
           on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
          bind:value={department}/>
          <p class="{!errors?.department ? "hidden" : ""} text-red-500 text-xs">{errors?.department}</p>
      <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Building</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="building" minlength="10" maxlength="60"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
		    bind:value={building}/>
            {#if building.length > 0 && !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(building)}
				<span class="text-red-500 text-xs block">Please enter a valid building name</span>
			{/if}
            {#if showErrors && building.length === 0}
				<span class="text-red-500 text-xs block">Address is required</span>
		    {/if}

        <label class="w-full text-xs md:text-sm font-medium mt-1 block" for="address">Street</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="street" minlength="10" maxlength="60"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
		    bind:value={street}/>
            {#if street.length > 0 && !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(street)}
				<span class="text-red-500 text-xs block">Please enter a valid street name</span>
			{/if}
            {#if showErrors && street.length === 0}
				<span class="text-red-500 text-xs block">Address is required</span>
		    {/if}

    
            <label class="w-full text-xs md:text-sm font-medium mt-1" for="country">Country</label>
            <div class="relative z-10">
            <div class="flex items-center border border-gray-300 rounded my-1 overflow-hidden">
            <input type="text" name="location" bind:value={location} maxlength="30" placeholder="Search Country" 
            on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
                location = filteredCountries[0].name
                toggleDropdown()
              }
            }}
            on:input={toggleDropdown} on:click={toggleDropdown} on:input={filterCountries} on:input={delete errors.country}
            class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none"
            required/>
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
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
                </div>
                {#if showDropdown}
                    <ul class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {#each filteredCountries as { name, code }}
                            <li on:click|stopPropagation={() => selectCountry({ name, code })} 
                            class="cursor-pointer px-2 py-1 hover:bg-gray-200">
                                <option value={name}>{name} ({code})</option>
                            </li>
                        {/each}
                        {#if filteredCountries.length === 0}
                            <li class="px-2 py-1 text-gray-500">No results found</li>
                        {/if}
                    </ul>
                {/if}
            </div>
                            
                {#if errors?.location}
                    <p class="text-red-500 text-xs mt-1">{errors.location}</p>
                {/if}
            
            <label class="w-full text-xs md:text-sm font-medium mt-1" for="city">City</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="city" minlength="3" maxlength="30"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
			bind:value={city}/>
		{#if errors?.city}
			    <p class="text-red-500 text-xs mt-1">{errors.city}</p>
		    {/if}
		    <label class="w-full text-xs md:text-sm font-medium mt-1" for="state">State</label>
            {#if location === 'India' || location === 'india' }
            <select class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
            name="state" bind:value={state}>
                <option value="" disabled selected>Select a State</option>
                {#each states as s}
                    <option value={s}>{s}</option>
                {/each}
            </select>
            {#if state.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(state)}
				<span class="text-red-500 text-xs block">Please enter a valid state Name</span>
			{/if}
            {#if showErrors && state.length === 0}
			    <span class="text-red-500 text-xs block">State is required</span>
		    {/if}
            {:else}

            <input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
				type="text" name="state" maxlength="20" minlength="3"
         on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
			bind:value={state}/>
	        {#if state.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(state)}
				<span class="text-red-500 text-xs block">Please enter a valid state Name</span>
			{/if}
            {#if showErrors && state.length === 0}
				<span class="text-red-500 text-xs block">State is required</span>
		    {/if}
            {/if}


			<label class="w-full text-xs md:text-sm font-medium mt-1" for="postalCode">Postal code</label>
			<input class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
			type="text" name="postalCode" bind:value={postalCode} minlength="3" maxlength="12"
       on:keydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
              }
            }}
			on:input={() => {
				validateForm('postalCode'); 
				validatePostalCode(location, postalCode);  // Validate postal code as user types
			}}
            on:input={delete errors.postalCode}/>
			{#if errors?.postalCode}
			    <p class="text-red-500 text-xs mt-1">{errors.postalCode}</p>
		    {/if}

			    <!--<div class=" flex items-center mt-4 mb-2">
				 <input type="checkbox" name="isDefault" class="focus:ring-0 text-primary-400" 
                   on:change={(e) => {
                       if (!e.target.checked) {
                           e.preventDefault(); 
                           e.target.checked = true; 
                           e.target.style.cursor = 'not-allowed'; 
                           e.target.style.borderColor = 'red';
                           toast.error(message);
                       } else {
                            handleCheckbox(true, formdata.isDefault); 
                       }
                    }}
                    checked={formdata.isDefault} value={formdata.isDefault}/>
				<label class="w-full text-xs md:text-sm font-medium ml-2" for="isDefault">Set this address as default</label>
			    </div> -->
                <div class="my-2 flex flex-row gap-2">
                <button on:click={handlePopupAddress} type="button"
                class="px-4 py-2 bg-gray-200 text-description rounded hover:bg-gray-300 focus:outline-none focus:ring-0 w-1/2">
                    Cancel
                </button>
                <button type="submit" 
                  class="font-roboto font-medium py-2 px-2 w-1/2 text-xs sm:text-sm rounded bg-primary-600 hover:bg-primary-800 text-white"  
                  >
                     Submit
                </button>
            </div>
		</form>
	</div>
</div>
<Toaster position="bottom-right" richColors/>
