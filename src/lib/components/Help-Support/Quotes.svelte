<script>
  import { onMount, onDestroy } from 'svelte';
import { enhance } from "$app/forms";
import Icon from '@iconify/svelte';
import { toast } from "svelte-sonner";
import {countries , phoneNumberPatterns} from '$lib/Data/constants.js';
export let data;
let products = [{ itemNumber: "", quantity: "" }];
let exportMaterial = "";

let country= data?.profile?.country||"";
let firstName = data?.profile?.firstName||"";
let lastName = data?.profile?.lastName||"";
let email =  data?.profile?.email||"";
let phoneNumber = data?.profile?.cellPhone|| "";
let companyName =  data?.profile?.companyName|| "";
let formLoading=false;

let searchTerm="";
let errors={};

let showSuccesDiv=false;
let showFailureDiv=false;
let form;

let location = "";
let accountNumber = "";
let streetAddress = "";
let city = "";
let postalCode = "";
let shippinglocation = "";
let billingStreetAddress = "";
let billingCity = "";
let billingPostalCode = "";
let billingLocation = "";
let useShippingAddress = false;
let itemNumber="";
let message = "";
let errormessage = "";
const addProduct = () => {
products = [...products, { itemNumber: "", quantity: "" }];
};

const removeProduct = (index) => {
products = products.filter((_, i) => i !== index);
};



const validateField = (fieldName ,index ) => {
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

if (!phoneNumber || phoneNumber === '') {
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


if (!fieldName || fieldName === 'shippinglocation') {
if (!shippinglocation) {
errors.shippinglocation = 'Shipping location is required';
} else {
delete errors.shippinglocation;
}
}

if (!fieldName || fieldName === 'billingLocation') {
if (!billingLocation) {
errors.billingLocation = 'Billing location is required';
} else {
delete errors.billingLocation;
}
}
if (!fieldName || fieldName === 'accountNumber') {
if (!accountNumber || !/^[a-zA-Z0-9]+$/.test(accountNumber)) {
errors.accountNumber = 'Please enter a valid account number (letters and numbers allowed)';
} else {
delete errors.accountNumber;
}
}



if (!fieldName || fieldName === 'postalCode') {
if (!postalCode || !/^[0-9]+$/.test(postalCode)) {
errors.postalCode = 'Please enter a valid Poastal Code';
} else {
delete errors.postalCode;
}
}
if (!fieldName || fieldName === 'companyName') {
if (!companyName || !/^[a-zA-Z0-9@*()#$]+$/.test(companyName)) {
errors.companyName = 'Please enter a valid Company name ';
} else {
delete errors.companyName;
}
}



if (!fieldName || fieldName === 'streetAddress') {
if (!streetAddress || !/^[a-zA-Z0-9@*()#$/"";.,]+$/.test(streetAddress)) {
errors.streetAddress = 'Please enter a valid Street Address ';
} else {
delete errors.streetAddress;
}
}
if (!fieldName || fieldName === 'city') {
if (!city || !/^[a-zA-Z0-9@*()#$/"";.,]+$/.test(city)) {
errors.city = 'Please enter a valid City ';
} else {
delete errors.city;
}
}


if (!fieldName || fieldName === 'billingStreetAddress') {
if (!billingStreetAddress || !/^[a-zA-Z0-9@*()#$/"";.,]+$/.test(billingStreetAddress)) {
errors.billingStreetAddress = 'Please enter a valid Street Address ';
} else {
delete errors.billingStreetAddress;
}
}
if (!fieldName || fieldName === 'billingCity') {
if (!billingCity || !/^[a-zA-Z0-9@*()#$/"";.,]+$/.test(billingCity)) {
errors.billingCity = 'Please enter a valid City ';
} else {
delete errors.billingCity;
}
}
if (!fieldName || fieldName === 'billingPostalCode') {
if (!billingPostalCode || !/^[0-9]+$/.test(billingPostalCode)) {
errors.billingPostalCode = 'Please enter a Billing Postal Code ';
} else {
delete errors.billingPostalCode;
}
}
if (!products[index]) {
return;
}

if (fieldName === 'itemNumber') {
const itemNumber = products[index].itemNumber;
if (itemNumber && !/^[A-Za-z0-9-]+$/.test(itemNumber)) {
  errors[`itemNumber-${index}`] = 'Item number should contain only alphanumeric characters and dashes';
} else {
  delete errors[`itemNumber-${index}`];
}
}

if (fieldName === 'quantity') {
const quantity = products[index].quantity;
if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
  errors[`quantity-${index}`] = 'Quantity must be a positive integer';
} else {
  delete errors[`quantity-${index}`];
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
  if (!phoneNumber || !countryCode || phoneNumber=== '') {
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



function formValid(index) {
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
validateField('streetAddress');
validateField('city');
validateField('postalCode');
validateField('billingStreetAddress');
validateField('billingCity');
validateField('billingLocation');
validateField('shippinglocation');
validateField('billingPostalCode');
validateField('itemNumber', index);
validateField('quantity', index);







const isValid =
Object.keys(errors).length === 0 

return isValid;
}
const shippinglocations = [
"United States",
"Canada",
"United Kingdom",
"Australia",
"Germany",
"France",
"India",
];
const billinglocations = [
"United States",
"Canada",
"United Kingdom",
"Australia",
"Germany",
"France",
"India",
];
const handleRadioChange = (event) => {
useShippingAddress = event.target.value === "yes";
if (useShippingAddress) {
  billingStreetAddress = streetAddress;
  billingCity = city;
  billingPostalCode = postalCode;
  billingLocation = shippinglocation;
} else {
  billingStreetAddress = "";
  billingCity = "";
  billingPostalCode = "";
  billingLocation = "";
}
};
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
                // You can add custom actions for this case
                showFailureDiv = true;
            } else {
                // Handle unexpected status values
                // console.log('Unexpected status code received');
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

<div class="  w-full p-4">
<form
method="POST"
action="?/contact"
bind:this={form}
use:enhance={handlesubmit}
>
<div class=" flex flex-col h-full">
  <div class="lg:w-3/4 w-full pb-6 h-full">
    <h2 class="text-primary-400 font-semibold text-base pb-6">Quotes</h2>
    <input hidden name="issueName" value="Quotes" />
    <h3 class="block mb-2 text-sm">
      Please provide the following product information
    </h3>
    {#each products as product, index}
    <div class="mb-4 flex flex-col items-start">
      <div class="flex-1 w-3/4">
        <input
          id={`item-number-${index}`}
          type="text"
          name="products[${index}].itemNumber"
          placeholder="Item Number"
          bind:value={product.itemNumber}
          class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
          required
          on:input={() => validateField('itemNumber', index)}
        />
        {#if errors[`itemNumber-${index}`]}
          <p class="text-red-500 text-xs mt-1">{errors[`itemNumber-${index}`]}</p>
        {/if}
  
        <input
          id={`quantity-${index}`}
          type="number"
          placeholder="Quantity"
          bind:value={product.quantity}
          class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
          required
          min="1"
          on:input={() => validateField('quantity', index)}
        />
        {#if errors[`quantity-${index}`]}
          <p class="text-red-500 text-xs mt-1">{errors[`quantity-${index}`]}</p>
        {/if}
      </div>
      {#if index > 0}
        <button
          type="button"
          on:click={() => removeProduct(index)}
          class="ml-2 text-primary-400"
        >
          &times;
        </button>
      {/if}
    </div>
  {/each}
  
  

    <button
      type="button"
      on:click={addProduct}
      class=" text-primary-400 border border-primary-400 mb-4 px-2 py-1 rounded-md hover:text-white hover:bg-primary-400"
    >
      Add another product
    </button>
    <input hidden name="products" value={JSON.stringify(products)} />
    <fieldset
      class="flex flex-col md:flex-row lg:flex-row justify-between p-2"
    >
      <legend class="block mb-2 text-sm"
        >Do you intend to export this material?</legend
      >
      <div class="w-1/2">
        <label class="inline-flex items-center mr-4">
          <input
            name="exportMaterial"
            type="radio"
            bind:group={exportMaterial}
            value="Yes"
          class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          />
          <span class="ml-2 text-sm">Yes</span>
        </label>
        <label class="inline-flex items-center">
          <input
            name="exportMaterial"
            type="radio"
            bind:group={exportMaterial}
            value="No"
          class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          />
          <span class="ml-2 text-sm">No</span>
        </label>
      </div>
    </fieldset>
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
    <h2 class="text-primary-400 font-semibold text-base pb-6">
      Shipping Address
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
      <div class="flex flex-col">
        <input
          name="streetAddress"
          type="text"
          placeholder="Street Address*"
          bind:value={streetAddress}
          on:input={() => validateField('streetAddress')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.streetAddress}
          <p class="text-red-500 text-xs mt-1">{errors.streetAddress}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <input
          name="city"
          type="text"
          placeholder="City*"
          bind:value={city}
          on:input={() => validateField('city')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.city}
          <p class="text-red-500 text-xs mt-1">{errors.city}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <select
          name="shippinglocation"
          bind:value={shippinglocation}
          on:click={() => validateField('shippinglocation')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        >
          <option value="" disabled selected>Location</option>
          {#each shippinglocations as shiploc}
            <option value={shiploc}>{shiploc}</option>
          {/each}
        </select>
        {#if errors.shippinglocation}
          <p class="text-red-500 text-xs mt-1">{errors.shippinglocation}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <input
          type="tel"
          name="postalCode"
          placeholder="Postal Code*"
          bind:value={postalCode}
          on:input={() => validateField('postalCode')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.postalCode}
          <p class="text-red-500 text-xs mt-1">{errors.postalCode}</p>
        {/if}
      </div>
    </div>
    
    <h2 class="text-primary-400 font-semibold text-base pb-6">
      Billing Address
    </h2>

    <fieldset class="flex flex-col justify-between p-2">
      <label for="sameasShipping" class="block mb-2 text-sm"
        >Same as shipping address?</label
      >
      <div class="w-1/2">
        <input
          type="radio"
          id="yes"
          name="sameasShipping"
          value="yes"
          class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          on:change={handleRadioChange}
        />
        <label for="yes" class="mr-4 text-sm">Yes</label>
        <input
          type="radio"
          id="no"
          class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
          name="sameasShipping"
          value="no"
          on:change={handleRadioChange}
          checked
        />
        <label for="no" class="text-sm">No</label>
      </div>
    </fieldset>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="flex flex-col">
        <input
          name="billingStreetAddress"
          type="text"
          placeholder="Street Address*"
          bind:value={billingStreetAddress}
          on:input={() => validateField('billingStreetAddress')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.billingStreetAddress}
          <p class="text-red-500 text-xs mt-1">{errors.billingStreetAddress}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <input
          name="billingCity"
          type="text"
          placeholder="City*"
          bind:value={billingCity}
          on:input={() => validateField('billingCity')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.billingCity}
          <p class="text-red-500 text-xs mt-1">{errors.billingCity}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <select
          name="billingLocation"
          bind:value={billingLocation}
          on:click={() => validateField('billingLocation')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        >
          <option value="" disabled selected>Location</option>
          {#each billinglocations as billloc}
            <option value={billloc}>{billloc}</option>
          {/each}
        </select>
        {#if errors.billingLocation}
          <p class="text-red-500 text-xs mt-1">{errors.billingLocation}</p>
        {/if}
      </div>
    
      <div class="flex flex-col">
        <input
          type="text"
          name="billingPostalCode"
          placeholder="Postal Code*"
          bind:value={billingPostalCode}
          on:input={() => validateField('billingPostalCode')}
          class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          required
        />
        {#if errors.billingPostalCode}
          <p class="text-red-500 text-xs mt-1">{errors.billingPostalCode}</p>
        {/if}
      </div>
    </div>
    

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





     handlesubmit();
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
