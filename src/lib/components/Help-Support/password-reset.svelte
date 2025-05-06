<script>
	import { onMount, onDestroy } from 'svelte';
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  import {countries , phoneNumberPatterns} from '$lib/Data/constants.js';
  let formLoading=false;
  
  export let data;
  let form;
  let searchTerm="";
  let errors={};
  let poNumber = "";
  let assistanceMessage = "";
  let country= data?.profile?.country||"";
  let firstName = data?.profile?.firstName||"";
  let lastName = data?.profile?.lastName||"";
  let email =  data?.profile?.email||"";
  let phoneNumber = data?.profile?.cellPhone|| "";
  let companyName =  data?.profile?.companyName|| "";
  
  let location = "";
  let accountNumber = "";
  let message = "";
  let errormessage = "";
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
  errors.country = 'Country is required';
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
  
  
  
  
  
  
  if (!fieldName || fieldName === 'poNumber') {
  if (!poNumber && !/^[A-Za-z0-9-]+$/.test(poNumber)) {
  errors.poNumber = 'PO Number number should contain only alphanumeric characters and dashes';
  } else {
  delete errors.poNumber;
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
  
  // function handleInputChange(event) {
  // searchTerm = event.target.value;
  // filterCountries();
  // }
  function handleInputChange(event) {
	// Get the current input value
	searchTerm = event.target.value;
	
	// Track if user is deleting text
	const isDeleting = event.inputType === 'deleteContentBackward' || 
					   event.inputType === 'deleteContentForward';
	
	if (searchTerm.length > 0 && !isDeleting) {
	  // Filter countries
	  filterCountriesWithoutAutoSelect();
	  
	  // Show dropdown with filtered results
	  showDropdown = filteredCountries.length > 0;
	  
	  // Check for country code matches specifically
	  const codeSearch = searchTerm.replace('+', '').trim();
	  if (codeSearch.length > 0) {
		const exactCodeMatches = filteredCountries.filter(
		  (country) => country.code.replace('+', '') === codeSearch
		);
  
		if (exactCodeMatches.length === 1) {
		  selectCountry(exactCodeMatches[0]);
		  return;
		}
	  }
  
	  const countriesStartingWith = filteredCountries.filter(
		(country) => country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
	  );
	  
	  if (countriesStartingWith.length === 1) {
		selectCountry(countriesStartingWith[0]);
	  }
	} else {
	  filterCountriesWithoutAutoSelect();
	  showDropdown = filteredCountries.length > 0;
	}
  }
  function filterCountriesWithoutAutoSelect() {
	filteredCountries = countries.filter(
	  (country) =>
		country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
	);
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
  // validateField('accountNumber');
  validateField('poNumber');
  validateField('assistanceMessage');
  
  
  
  
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
  function clearError(field) {
  if (errors[field]) {
  delete errors[field];
  }
  }
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