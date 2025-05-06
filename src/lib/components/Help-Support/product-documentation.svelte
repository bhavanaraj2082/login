<script>
	import {onMount} from 'svelte'
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import {countries , phoneNumberPatterns} from '$lib/Data/constants.js';
  import { toast } from "svelte-sonner";
  let formLoading=false;
 
export let data;
  let form;
  let searchTerm="";
  let errors={};
  let country= data?.profile?.country||"";
let firstName = data?.profile?.firstName||"";
let lastName = data?.profile?.lastName||"";
let email =  data?.profile?.email||"";
let phoneNumber = data?.profile?.cellPhone|| "";
let companyName =  data?.profile?.companyName|| "";
  let location = "";
  let accountNumber = "";
  let message = "";
  let documentRequired = "";
  let attachments = [];
  let totalSize = 0;
  let errormessage = "";

  const maxFileSize = 25 * 1024 * 1024;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let filesAdded = false;

    for (const file of files) {
      if (totalSize + file.size > maxFileSize) {
        alert(
          "Total file size exceeds 25 MB limit. Please select smaller files."
        );
        return;
      }
      totalSize += file.size;
      attachments.push(file);
      filesAdded = true;
      attachments = attachmentFunction(attachments);
    }

    if (filesAdded) {
      alert(`${files.length} file(s) added successfully!`);
    }

    event.target.value = "";
  };

  const removeAttachment = (index) => {
    if (attachments[index]) {
      totalSize -= attachments[index].size;
      attachments.splice(index, 1);
      alert("File removed successfully!");
      attachments = attachmentFunction(attachments);
    }
  };

  function attachmentFunction(attachments) {
    return attachments;
  }


  let fileInputRef;

  const triggerFileInput = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  
  function clearError(field) {
		if (errors[field]) {
			delete errors[field];
		}
	}
  const validateField = (fieldName) => {
	if (!fieldName || fieldName === 'firstName') {
	  if (!firstName || !/^[A-Za-z\s]+$/.test(firstName)) {
		errors.firstName = 'First name is required and should contain only letters';
	  } else {
		delete errors.firstName;
	  }
	}
  
	if (!fieldName || fieldName === 'lastName') {
	  if (!lastName || !/^[A-Za-z\s]+$/.test(lastName)) {
		errors.lastName = 'Last name is required and should contain only letters';
	  } else {
		delete errors.lastName;
	  }
	}
  
	if (!fieldName || fieldName === 'email') {
	  if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
		errors.email = 'Please enter a valid email address';
	  } else {
		delete errors.email;
	  }
	}
  
	if (!fieldName || fieldName === 'phoneNumber') {
	  if (!country) {
		errors.phoneNumber = 'Please select the country before entering the phone number';
		return;
	  }
  
	  if (!phoneNumber || phoneNumber.trim() === '') {
		errors.phoneNumber = 'Required for the selected country';
	  } else {
		const countryDetails = getCountryByCode(country);
		if (!countryDetails) {
		  errors.phoneNumber = 'Invalid country selected';
		  errors.country = 'Invalid country selected';
		} else {
		  const phonePattern = getPhonePattern(country);
		  if (!phonePattern) {
			errors.phoneNumber = 'Phone number pattern for country not found';
		  } else {
			const phoneRegex = new RegExp(phonePattern);
			if (!phoneRegex.test(phoneNumber)) {
			  errors.phoneNumber = `Please enter a valid phone number for ${countryDetails.name}.`;
			} else {
			  delete errors.phoneNumber;
			}
		  }
		}
	  }
	}
	
  

  
	if (!fieldName || fieldName === 'country') {
	  if (!country) {
		errors.country = 'Location is required';
	  } else {
		delete errors.country;
	  }
	}
  
	if (!fieldName || fieldName === 'accountNumber') {
	  if (!accountNumber || !/^[a-zA-Z0-9]+$/.test(accountNumber)) {
		errors.accountNumber = 'Please enter a valid account number.';
	  } else {
		delete errors.accountNumber;
	  }
	}
	if (!fieldName || fieldName === 'companyName') {
	  if (!companyName || !/^[a-zA-Z0-9@*()#$]+$/.test(companyName)) {
		errors.companyName = 'Please enter a valid Company name ';
	  } else {
		delete errors.companyName;
	  }
	}



  
  if (!fieldName || fieldName === 'assistanceMessage') {
  if (!assistanceMessage || 
      !/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(assistanceMessage) || 
      /<script.*?>.*?<\/script>/i.test(assistanceMessage) || 
      /<[^>]*>/i.test(assistanceMessage)
  ) {
    errors.assistanceMessage = 'Message is required and must not contain HTML tags or scripts.';
  } else {
    delete errors.assistanceMessage;
  }
}
  

  
  

if (!fieldName || fieldName === 'documentRequired') {
	  if (!documentRequired ) {
		errors.documentRequired = 'Please select one of the Required  Document ';

		// toast.error('Please select the option');
	  } else {
		delete errors.documentRequired; // Clear error once a valid option is selected
	  }
	}
  };
  
	function selectCountry(selectedCountry) {
		  country = selectedCountry.name;
		  // filteredCountries = countries;
		  searchTerm = `${selectedCountry.name} `;
		  showDropdown = false;
		  validateField('country');
		  validatePhoneNumber(country, phoneNumber);
  
		  delete errors.country;
		  // console.log('Selected Country:', country);
	  }
	function toggleDropdown() {
		  showDropdown = !showDropdown;
	  }
	function filterCountries() {
		  filteredCountries = countries.filter(
			  (country) =>
				  country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				  country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
		  );
		  if (
			  filteredCountries.length === 1 &&
			  (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
				  filteredCountries[0].code.replace('+', '').toLowerCase() ===
					  searchTerm.replace('+', '').toLowerCase())
		  ) {
			  selectCountry(filteredCountries[0]);
		  } else {
			  showDropdown = filteredCountries.length > 0; // Show dropdown only if results exist
		  }
	  }
	
	  function handleInputChange(event) {
		  searchTerm = event.target.value;
		  filterCountries();
	  }

  
	let filteredCountries = countries;
	  let showDropdown = false;
	function getCountryByCode(name) {
		  const country = countries.find((c) => c.name === name);
  
		  return country ? country.name : null;
	  }
  
	  function getPhonePattern(countryCode) {
		  const countryName = getCountryByCode(countryCode);
		  if (!countryName) return '^[0-9]+$';
		  const regex = phoneNumberPatterns[countryName];
		  return regex || '^[0-9]+$';
	  }

	function validatePhoneNumber(countryCode, phoneNumber) {
		  if (!phoneNumber || !countryCode || phoneNumber.trim() === '') {
			  // errors.contactNumber = `*Required`;
			  return false;
		  }
  
		  const country = getCountryByCode(countryCode);
  
		  // console.log('Validating phone number for country:', country);
  
		  if (!country) {
			  errors.phoneNumber = 'Invalid country selected';
			  errors.phoneNumber = 'Invalid country selected';
			  return false;
		  }
  
		  const phonePattern = getPhonePattern(countryCode);
		  if (!phonePattern) {
			  errors.phoneNumber = 'Phone number pattern for country not found';
			  return false;
		  }
  
		  const phoneRegex = new RegExp(phonePattern);
  
		  if (!phoneRegex.test(phoneNumber)) {
			  errors.phoneNumber = `Please enter a valid phone number for ${country}.`;
			  return false;
		  } else {
			  errors.phoneNumber = '';
			  return true;
		  }
	  }
  

  
  function formValid() {
	if (formLoading) {
	  return false;
	}
  
	errors = {};
  
	validateField('firstName');
	validateField('lastName');
	validateField('email');
	validateField('phoneNumber');
	validateField('companyName');
	validateField('country');
	validateField('accountNumber');
  validateField('documentRequired');
	// validateField('assistanceMessage');
  
  
  
  
	const isValid =
	  Object.keys(errors).length === 0 
  
	return isValid;
  }

const handlesubmit = async (data) => {
	if (!formValid()) {
            cancel();
            return;
        }
    try {
   
        const result = await submitForm(data);
        console.log(result, "result");

        return async ({ result, update }) => {
            if (result.type === 'success') {
                const status = result.data.status; 

                if (status === 1) {
                    form = result.data;
                    await update();
                
                    // thankYouMessageVisible = true;
                    showSuccesDiv = true;
                } else if (status === 2) {

                    form = result.data;
                    await update();
                    
                    showFailureDiv = true;
                } else {
                  
                    form = result.data;
                    await update();
					showSuccesDiv=true;
                }
            }
        };

    } catch (error) {
        console.error("Error submitting form:", error);
        // Handle failure actions
        // loading = false;
        showFailureDiv = true;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};
  

const submitForm = async (data) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ type: 'success', data: { success: true } });
			});
		});
	};
	let showSuccesDiv=false;
	let showFailureDiv=false;
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			showDropdown = false;
			
		}
	}
	onMount(() => {
    document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
  });
</script>
{#if showSuccesDiv}
<div class="h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl">
  <div
    class="w-10/12 md:w-8/12 bg-gradient-to-r from-green-100 via-green-50 to-green-100 p-8 rounded-lg shadow-lg text-center"
  >
  <h3 class="text-2xl font-semibold text-green-600 mb-4">
	Customer Support Form Submission
  </h3>
  <p class="text-lg text-gray-700 mb-6">
	Thank you for reaching out to our customer support team! We have received your request and will get back to you as soon as possible.
  </p>
    <div class="w-10/12 mx-auto my-6 border-t-2 border-green-300"></div>
    <div>
      <a
        href="/"
        class="bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
      >
        Return to Home
      </a>
    </div>
  </div>
</div>
{:else if showFailureDiv}
<div class="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
  <p class="font-semibold mb-4">
    There was a problem submitting the form. Please try again after some time.
  </p>
  <a
    href="/contact-us"
    class="bg-white w-fit border text-black border-gray-500 px-4 py-2 rounded-md transition block"
  >
    Report Issue
  </a>
</div>
{:else}
<div class="w-full p-4">
  <form
    method="POST"
    action="?/contact"
    bind:this={form}
    use:enhance={handlesubmit}
  >
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-4">
        Product Documentation
      </h2>
      <input hidden name="issueName" value="Product Documentation" />
      <div class="my-4">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block text-base">*Please select the document you require</label>
        <div class="text-sm my-4 w-full md:w-3/4 lg:w-3/4">
          <label class="block py-2">
            <input
              type="radio"
              class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
              name="documentRequired"
              bind:group={documentRequired}
              on:input={() => { validateField('documentRequired'); clearError('documentRequired'); }}

              value="SDS / CoA / CoO"
              required
            />
            SDS / CoA / CoO
          </label>
          <label class="block py-2">
            <input
              type="radio"
              class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
              name="documentRequired"
              bind:group={documentRequired}
              on:input={() => { validateField('documentRequired'); clearError('documentRequired'); }}
              value="Other Documentation"
              required
            />
            Other Documentation
          </label>
        </div>
        {#if errors.documentRequired}
        <p class="text-red-500 text-xs mt-2">{errors.documentRequired}</p>
      {/if}
      </div>
      
      <div class="py-10 px-5 border border-gray-300 rounded-sm">
        <p>Did you know that you can find SDS, CoA, and CoO online?</p>
        <p>Please try our <a href="/documents" class="text-primary-500 font-semibold">Document Search Page</a></p>
      </div>


    </div>
    <div class=" w-full pb-6 mx-auto h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">
        Please provide your contact information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name Input -->
        <div class="flex flex-col">
          <input
          name="firstName"
          type="text"
          placeholder="First Name"
          bind:value={firstName}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('firstName')}
          />
          {#if errors.firstName}
          <p class="text-red-500 text-xs mt-1">{errors.firstName}</p>
          {/if}
        </div>
        
        <!-- Last Name Input -->
        <div class="flex flex-col">
          <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          bind:value={lastName}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('lastName')}
          />
          {#if errors.lastName}
          <p class="text-red-500 text-xs mt-1">{errors.lastName}</p>
          {/if}
        </div>
        
        <!-- Email Input -->
        <div class="flex flex-col">
          <input
          name="email"
          type="email"
          placeholder="Email"
          bind:value={email}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('email')}
          />
          {#if errors.email}
          <p class="text-red-500 text-xs mt-1">{errors.email}</p>
          {/if}
        </div>
        
     
  
  
            <div class="flex flex-col">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name "
                bind:value={companyName}
                class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
                required
                on:input={() => validateField('companyName')}
              />
              {#if errors.companyName}
                <p class="text-red-500 text-xs mt-1">{errors.companyName}</p>
              {/if}
              </div>
        
        <div class="flex flex-col">
          <div class="relative dropdown-container">
          <input
            type="text"
            name="country"
            bind:value={country}
            placeholder="Search Country"
            on:input={handleInputChange}
            on:click={toggleDropdown}
            autocomplete="off"
            class="flex-1 outline-none w-full border border-gray-300 rounded focus:ring-0 focus:border-primary-400 p-2 text-sm"
            required
          />
          <Icon
            icon={showDropdown ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'}
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-1 text-2s font-bold cursor-pointer"
          />
          {#if showDropdown}
            <div class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul class="max-h-60 overflow-y-auto text-sm">
              {#each filteredCountries as country (country.name)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <li
                on:click={() => selectCountry(country)}
                class="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {country.name} ({country.code})
              </li>
              {/each}
            </ul>
            </div>
          {/if}
          </div>
          {#if errors.country}
          <p class="text-red-500 text-xs mt-1">{errors.country}</p>
          {/if}
        </div>
        
             <!-- Phone Number Input -->
             <div class="flex flex-col">
              <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              bind:value={phoneNumber}
              class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
              required
           
                              on:input={() => {
                        phoneNumber = phoneNumber.replace(/[^+\d]/g, '').trim();
                        validateField('phoneNumber')
                        validatePhoneNumber(country, phoneNumber);
    
                      }}
              />
              {#if errors.phoneNumber}
              <p class="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              {/if}
            </div>
        <div class="flex flex-col">
          <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          bind:value={accountNumber}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
          on:input={() => validateField('accountNumber')}
          />
          {#if errors.accountNumber}
          <p class="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
          {/if}
        </div>
        </div>
      
        <div class="flex justify-center col-span-2 mt-2">
        <button
          class="w-full bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
         on:click={(event) => {
           // event.preventDefault();
     
           // Check form validity
           if (!formValid()) {
             toast.error('Please fill all the required fields.');
			 event.preventDefault();
             return;
           }
		   else{
     
  
     
  
  
           handlesubmit();
		   }
         }}
         on:keydown={(event) => {
           if (event.key === 'Enter') {
             event.preventDefault();
           }
         }}
       >
         Submit
       </button>
        </div>
    </div>
  </form>
  {#if message != ""}
    <h2
      class="text-center text-green-500 font-semibold text-base w-full"
    >
      {message}
    </h2>
  {:else if errormessage != ""}
    <h2
      class="text-center text-red-500 font-semibold text-base w-full"
    >
      {errormessage}
    </h2>
  {/if}
</div>
{/if}
