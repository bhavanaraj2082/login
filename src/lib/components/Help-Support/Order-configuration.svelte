<script>
	import { enhance } from "$app/forms";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
	import { toast } from "svelte-sonner";
	export let data;
	let form;
	let form3;
	let enteredOtp;
	let ProfileEmailVerified;
	let isOtpVerified = false;
	let verificationMessage = "";
	let loadingotp = false;
	let authedUserEmailVerified = data?.profile?.isEmailVerified;
	let emailSent = false;
	let enteredOtpemail;
	let isLoading = false;
	let displayMessage = "";

	let highlightedIndex = -1;
	let dropdownEl;
	let selectOptionNumber = "";
	let isValidOrder = false;
	let isValidating = false;
	let errors = {};
	let searchTerm = "";
	let formLoading = false;
	let poVerified = false;
	//   let country="";
	let products = [{ itemNumber: "" }];
	let itemNumber = "";
	let poNumber = "";
	let country = data?.profile?.country || "";
	let firstName =
		data?.profile?.firstName || data?.authedUser?.username || "";
	let lastName = data?.profile?.lastName || "";
	let email = data?.profile?.email || "";
	let phoneNumber = data?.profile?.cellPhone || "";
	let companyName = data?.profile?.companyName || "";
	let location = "";
	let accountNumber = "";
	let message = "";
	let errormessage = "";
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
			// startTimer();
		}
	};
	const addProduct = () => {
		products = [...products, { itemNumber: "" }];
	};

	const removeProduct = (index) => {
		products = products.filter((_, i) => i !== index);
	};

	const validateField = (fieldName) => {
		if (!fieldName || fieldName === "firstName") {
			if (!firstName) {
				errors.firstName = "*Required";
			} else if (firstName.length < 3) {
				errors.firstName = "Must be at least 3 characters.";
			} else if (!/^[A-Za-z\s]+$/.test(firstName)) {
				errors.firstName = "Only letters and spaces are allowed.";
			} else {
				delete errors.firstName;
			}
		}

		if (!fieldName || fieldName === "lastName") {
			if (!lastName) {
				errors.lastName = "*Required";
			} else if (!/^[A-Za-z\s]+$/.test(lastName)) {
				errors.lastName = "Only letters and spaces are allowed.";
			} else {
				delete errors.lastName;
			}
		}

		if (!fieldName || fieldName === "email") {
			if (!email) {
				errors.email = "*Required";
				return;
			}
			if (
				!email ||
				!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
			) {
				errors.email = "Please enter a valid email address";
			} else {
				delete errors.email;
			}
		}

		if (!fieldName || fieldName === "phoneNumber") {
			if (!phoneNumber) {
				errors.phoneNumber = "*Required";
				return;
			}
			if (!country) {
				errors.phoneNumber =
					"Please select the country before entering the phone number";
				return;
			}
			if (!phoneNumber || phoneNumber === "") {
				errors.phone = "Required for the selected country";
			} else {
				const countryDetails = getCountryByCode(country);

				if (!countryDetails) {
					errors.phoneNumber =
						"Invalid country selected. Please reselect country.";
					errors.country = "Invalid country selected";
				} else {
					const phonePattern = getPhonePattern(country);
					if (!phonePattern) {
						errors.phoneNumber =
							"Phone number pattern for country not found";
					} else {
						const phoneRegex = new RegExp(phonePattern);
						if (!phoneRegex.test(phoneNumber)) {
							const countryName =
								countryDetails.name ||
								country ||
								"selected country";
							errors.phoneNumber = `Please enter a valid phone number for ${countryName}.`;
						} else {
							delete errors.phoneNumber;
						}
					}
				}
			}
		}

		if (!fieldName || fieldName === "country") {
			if (!country) {
				errors.country = "*Required";
			} else {
				delete errors.country;
			}
		}

		if (!fieldName || fieldName === "accountNumber") {
			if (!accountNumber || !/^[a-zA-Z0-9]+$/.test(accountNumber)) {
				errors.accountNumber =
					"Please enter a valid account number (letters and numbers allowed)";
			} else {
				delete errors.accountNumber;
			}
		}

		if (!fieldName || fieldName === "companyName") {
			if (!companyName) {
				errors.companyName = "*Required";
			} else if (companyName.length < 3) {
				errors.companyName = "Must be at least 3 characters.";
			} else if (!/^[A-Za-z0-9@.,!#$%^&*(_)+\-\s]+$/.test(companyName)) {
				errors.companyName = "Please enter a valid company name.";
			} else {
				delete errors.companyName;
			}
		}

		if (!fieldName || fieldName === "itemNumber") {
			if (!itemNumber) {
				errors.itemNumber = "*Required";
			} else if (!/^[A-Za-z0-9-\s]+$/.test(itemNumber)) {
				errors.itemNumber = "Only letters and spaces are allowed.";
			} else {
				delete errors.itemNumber;
			}
		}

		if (!fieldName || fieldName === "poNumber") {
			if (!poNumber) {
				errors.poNumber = "*Required";
			} else if (!/^[A-Za-z0-9-\s]+$/.test(poNumber)) {
				errors.poNumber = "Only letters and spaces are allowed.";
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
		highlightedIndex = -1;
		validateField("country");
		validatePhoneNumber(country, phoneNumber);

		delete errors.country;
		// console.log('Selected Country:', country);
	}
	function handleKeyDown(event) {
		const exactCountryMatch = countries.some(
			(c) => c.name === country && c.name === searchTerm,
		);
		if (
			exactCountryMatch &&
			!(
				event.key === "Backspace" ||
				event.key === "Delete" ||
				event.key === "ArrowLeft" ||
				event.key === "ArrowRight" ||
				event.key === "Home" ||
				event.key === "End" ||
				event.key === "Tab" ||
				event.key === "Escape" ||
				event.ctrlKey ||
				event.key === "ArrowUp" ||
				event.key === "ArrowDown"
			)
		) {
			const input = document.querySelector('input[name="country"]');
			if (
				input &&
				(input.selectionStart !== input.selectionEnd ||
					input.selectionStart === 0)
			) {
				return true;
			}
			event.preventDefault();
			return false;
		}

		if (showDropdown) {
			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					if (filteredCountries.length > 0) {
						highlightedIndex =
							(highlightedIndex + 1) % filteredCountries.length;
						scrollToHighlighted();
					}
					break;
				case "ArrowUp":
					event.preventDefault();
					if (filteredCountries.length > 0) {
						highlightedIndex =
							highlightedIndex <= 0
								? filteredCountries.length - 1
								: highlightedIndex - 1;
						scrollToHighlighted();
					}
					break;
			}
		} else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			showDropdown = true;
			if (filteredCountries.length > 0) {
				highlightedIndex = 0;
			}
			event.preventDefault();
		}
		if (event.key === "Enter") {
			if (
				highlightedIndex >= 0 &&
				highlightedIndex < filteredCountries.length
			) {
				selectCountry(filteredCountries[highlightedIndex]);
				event.preventDefault();
			} else if (searchTerm && filteredCountries.length > 0) {
				selectCountry(filteredCountries[0]);
				event.preventDefault();
			}
		} else if (event.key === "Escape") {
			showDropdown = false;
			highlightedIndex = -1;
		}
	}
	function scrollToHighlighted() {
		if (!dropdownEl) return;
		const items = dropdownEl.querySelectorAll("li");
		if (items[highlightedIndex]) {
			items[highlightedIndex].scrollIntoView({
				block: "nearest",
			});
		}
	}
	function toggleDropdown() {
		showDropdown = !showDropdown;
		if (showDropdown) {
			if (country.length > 0) {
				searchTerm = country;
				filterCountriesWithoutAutoSelect();
			} else {
				filteredCountries = countries;
			}
		}
	}
	function handleInputChange(event) {
		searchTerm = event.target.value;
		country = event.target.value;
		const isDeleting =
			event.inputType === "deleteContentBackward" ||
			event.inputType === "deleteContentForward";
		filterCountriesWithoutAutoSelect();
		showDropdown = filteredCountries.length > 0;

		if (searchTerm.length > 0 && !isDeleting) {
			const codeSearch = searchTerm.replace("+", "").trim();
			if (codeSearch.length > 0) {
				const exactCodeMatches = filteredCountries.filter(
					(country) => country.code.replace("+", "") === codeSearch,
				);

				if (exactCodeMatches.length === 1) {
					selectCountry(exactCodeMatches[0]);
					return;
				}
			}

			const countriesStartingWith = filteredCountries.filter((country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
			);

			if (countriesStartingWith.length === 1) {
				selectCountry(countriesStartingWith[0]);
			}
		}
	}
	// function toggleDropdown() {
	// 	showDropdown = !showDropdown;
	// }
	function filterCountries() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
			showDropdown = filteredCountries.length > 0; // Show dropdown only if results exist
		}
	}

	//   function handleInputChange(event) {
	// 	  searchTerm = event.target.value;
	// 	  filterCountries();
	//   }
	// function handleInputChange(event) {
	// 	// Get the current input value
	// 	searchTerm = event.target.value;

	// 	// Track if user is deleting text
	// 	const isDeleting =
	// 		event.inputType === "deleteContentBackward" ||
	// 		event.inputType === "deleteContentForward";

	// 	if (searchTerm.length > 0 && !isDeleting) {
	// 		// Filter countries
	// 		filterCountriesWithoutAutoSelect();

	// 		// Show dropdown with filtered results
	// 		showDropdown = filteredCountries.length > 0;

	// 		// Check for country code matches specifically
	// 		const codeSearch = searchTerm.replace("+", "").trim();
	// 		if (codeSearch.length > 0) {
	// 			const exactCodeMatches = filteredCountries.filter(
	// 				(country) => country.code.replace("+", "") === codeSearch,
	// 			);

	// 			if (exactCodeMatches.length === 1) {
	// 				selectCountry(exactCodeMatches[0]);
	// 				return;
	// 			}
	// 		}

	// 		const countriesStartingWith = filteredCountries.filter((country) =>
	// 			country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
	// 		);

	// 		if (countriesStartingWith.length === 1) {
	// 			selectCountry(countriesStartingWith[0]);
	// 		}
	// 	} else {
	// 		filterCountriesWithoutAutoSelect();
	// 		showDropdown = filteredCountries.length > 0;
	// 	}
	// }
	// function filterCountriesWithoutAutoSelect() {
	// 	filteredCountries = countries.filter(
	// 		(country) =>
	// 			country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 			country.code
	// 				.replace("+", "")
	// 				.includes(searchTerm.replace("+", "").toLowerCase()),
	// 	);
	// }
	function filterCountriesWithoutAutoSelect() {
		const countriesStartingWith = countries.filter((country) =>
			country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
		);

		const countriesContaining = countries.filter(
			(country) =>
				!country.name
					.toLowerCase()
					.startsWith(searchTerm.toLowerCase()) &&
				country.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		filteredCountries = [...countriesStartingWith, ...countriesContaining];
		const codeMatches = countries.filter((country) =>
			country.code
				.replace("+", "")
				.includes(searchTerm.replace("+", "").toLowerCase()),
		);
		codeMatches.forEach((country) => {
			if (!filteredCountries.some((c) => c.name === country.name)) {
				filteredCountries.push(country);
			}
		});
	}
	let filteredCountries = countries;
	let showDropdown = false;
	function getCountryByCode(name) {
		const country = countries.find((c) => c.name === name);

		return country ? country.name : null;
	}

	function getPhonePattern(countryCode) {
		const countryName = getCountryByCode(countryCode);
		if (!countryName) return "^[0-9]+$";
		const regex = phoneNumberPatterns[countryName];
		return regex || "^[0-9]+$";
	}

	function validatePhoneNumber(countryCode, phoneNumber) {
		if (!phoneNumber || !countryCode || phoneNumber === "") {
			// errors.contactNumber = `*Required`;
			return false;
		}

		const country = getCountryByCode(countryCode);

		// console.log('Validating phone number for country:', country);

		if (!country) {
			errors.phoneNumber = "Invalid country selected";
			errors.phoneNumber = "Invalid country selected";
			return false;
		}

		const phonePattern = getPhonePattern(countryCode);
		if (!phonePattern) {
			errors.phoneNumber = "Phone number pattern for country not found";
			return false;
		}

		const phoneRegex = new RegExp(phonePattern);

		if (!phoneRegex.test(phoneNumber)) {
			errors.phoneNumber = `Please enter a valid phone number for ${country}.`;
			return false;
		} else {
			errors.phoneNumber = "";
			return true;
		}
	}

	function formValid() {
		if (formLoading) {
			return false;
		}

		errors = {};

		validateField("firstName");
		validateField("lastName");
		validateField("email");
		validateField("phoneNumber");
		validateField("companyName");
		validateField("country");
		// validateField('accountNumber');
		validateField("poNumber");
		validateField("itemNumber");

		const isValid = Object.keys(errors).length === 0;

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
				if (result.type === "success") {
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
						showSuccesDiv = true;
					}
				}
			};
		} catch (error) {
			console.error("Error submitting form:", error);
			// Handle failure actions
			// loading = false;
			showFailureDiv = true;
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const submitForm = async (data) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ type: "success", data: { success: true } });
			});
		});
	};
	let showSuccesDiv = false;
	let showFailureDiv = false;
	function handleClickOutside(event) {
		if (!event.target.closest(".dropdown-container")) {
			showDropdown = false;
		}
	}
	onMount(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	});
</script>

{#if showSuccesDiv}
	<div
		class="h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl"
	>
		<div
			class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg"
		>
			<h3 class="text-2xl font-semibold text-green-600 mb-4">
				Customer Support Form Submission
			</h3>
			<p class="text-lg text-gray-700 mb-6">
				Thank you for reaching out to our customer support team! We have
				received your request and will get back to you as soon as
				possible.
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
			There was a problem submitting the form. Please try again after some
			time.
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
		<form method="POST" action="?/contact" use:enhance={handlesubmit}>
			<div class=" flex flex-col h-full">
				<div class="lg:w-3/4 w-full pb-6 h-full">
					<h2 class="text-primary-400 font-semibold text-base pb-6">
						Order configuration
					</h2>
					<input
						hidden
						name="issueName"
						value="Order configuration"
					/>
					<h3 class="block mb-2 text-sm">
						Please provide the following product information
					</h3>

					<div class="flex-1 w-3/4 mb-4 flex flex-col items-start">
						<!-- <label class=" mb-1 hidden" for={`item-number-${index}`}>Item Number</label> -->
						<!-- <input
			  name="poNumber"
			  id={`item-number-${1}`}
			  type="text"
			  placeholder="PO Number / Order Number"
			  bind:value={poNumber}
			  class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
			  required
			/> -->
						<form
							action="?/validatepo"
							method="POST"
							use:enhance={({}) => {
								return async ({ result }) => {
									isValidating = false;
									console.log("result", result);
									if (result.status === 200) {
										poVerified = true;
										toast.success(
											"order number validated successfully",
										);
									} else {
										poVerified = false;
										toast.error(result.data.message);
									}
								};
							}}
							class="flex flex-row w-full lg:w-3/4 md:w-3/4 mb-2"
							on:submit={() => {
								isValidating = true;
							}}
						>
							<div class="relative w-full">
								<input
									name="poNumber"
									id={`item-number-${1}`}
									type="text"
									maxlength="100"
									placeholder="Order Number"
									bind:value={poNumber}
									class="w-full border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm rounded-md"
									required
									on:input={(e) => {
										const allowedChars =
											/^[a-zA-Z0-9\-.,;"']*$/;
										let inputValue = e.target.value;

										if (!allowedChars.test(inputValue)) {
											inputValue = inputValue.replace(
												/[^a-zA-Z0-9\-.,;"']/g,
												"",
											);
										}
										poNumber = inputValue.trim();
										poNumber = poNumber.trim();
										poVerified = false;
										validateField("poNumber");
									}}
								/>
								{#if email && poNumber && !poVerified}
									<button
										type="submit"
										disabled={isValidating}
										class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-primary-400 hover:underline focus:outline-none"
									>
										{isValidating
											? "Verifying..."
											: "Verify"}
									</button>
								{/if}
								{#if poVerified}
									<span
										class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-green-600 flex items-center"
									>
										Verified
										<Icon
											icon="material-symbols:verified-rounded"
											class="w-4 h-4 ml-1"
										/>
									</span>
								{/if}
							</div>
							<input
								type="hidden"
								name="email"
								id="email"
								bind:value={email}
							/>
						</form>

						<!-- Display validation status -->
						{#if errors.poNumber}
							<p class="text-red-500 text-xs mb-2">
								{errors.poNumber}
							</p>
						{:else if isValidOrder}
							<p class="text-green-500 text-xs mb-2">
								Order number verified successfully
							</p>
						{/if}
						<input
							type="hidden"
							name="poNumber"
							id="poNumber"
							bind:value={poNumber}
						/>
						<!-- <label class="hidden mb-1" for={`poNumber-${index}`}>poNumber</label> -->
						<!-- {#each products as product, index} -->
						<input
							name="itemNumber"
							id={`poNumber`}
							type="text"
							placeholder="Product Number"
							maxlength="100"
							bind:value={itemNumber}
							on:input={(e) => {
								validateField("itemNumber");
								const allowedChars = /^[a-zA-Z0-9\-.,;"']*$/;
								let inputValue = e.target.value;

								if (!allowedChars.test(inputValue)) {
									inputValue = inputValue.replace(
										/[^a-zA-Z0-9\-.,;"']/g,
										"",
									);
								}
								itemNumber = inputValue.trim();
								itemNumber = itemNumber.trim();
							}}
							class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
						/>
						{#if errors?.itemNumber}
							<p class="text-red-500 text-xs mt-1">
								{errors.itemNumber}
							</p>
						{/if}
						<input
							type="hidden"
							name="itemNumber"
							id="itemNumber"
							bind:value={itemNumber}
						/>
					</div>

					<input
						hidden
						name="products"
						value={JSON.stringify(products)}
					/>
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
								maxlength="50"
								class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
								required
								on:input={() => validateField("firstName")}
								on:input={(e) => {
									e.target.value = e.target.value.replace(
										/^\s+/,
										"",
									);
									firstName = e.target.value;

									validateField("firstName");

									errors.firstName = !firstName
										? "*Required"
										: firstName.length < 3
											? "Must be at least 3 characters"
											: !/^[A-Za-z\s]+$/.test(firstName)
												? "Please enter a valid first name"
												: "";
								}}
							/>
							{#if errors?.firstName}
								<p class="text-red-500 text-xs mt-1">
									{errors.firstName}
								</p>
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
								on:input={() => validateField("lastName")}
								on:input={(e) => {
									e.target.value = e.target.value.replace(
										/^\s+/,
										"",
									);
									lastName = e.target.value;

									validateField("lastName");

									errors.lastName = !lastName
										? "*Required"
										: !/^[A-Za-z\s]+$/.test(lastName)
											? "Please enter a valid last name"
											: "";
								}}
							/>
							{#if errors?.lastName}
								<p class="text-red-500 text-xs mt-1">
									{errors.lastName}
								</p>
							{/if}
						</div>
						<div>
							<input
								type="hidden"
								name="email"
								id="email"
								bind:value={email}
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
											ProfileEmailVerified =
												result.data.isEmailVerified;
											if (
												authedUserEmailVerified === true
											) {
												ProfileEmailVerified = true;
											}

											verificationMessage =
												result.data.message;

											if (
												verificationMessage.includes(
													"Verification email sent successfully. Please check your inbox.",
												)
											) {
												displayMessage =
													"Please check your inbox.";
												emailSent = true;
												enteredOtp = "";
												isOtpVerified = false;
											} else {
												displayMessage =
													verificationMessage;
												emailSent = false;
												isOtpVerified = false;
											}

											toast.success(verificationMessage);
										} else {
											toast.error(result.data.message);
											ProfileEmailVerified =
												result.data.isEmailVerified;
											emailSent = false;
										}
									};
								}}
								class="w-full"
								on:submit={() => {
									isLoading = true;
								}}
							>
								<div class="relative w-full">
									<div class="relative">
										<input
											type="text"
											name="email"
											id="email"
											bind:value={email}
											maxlength="50"
											class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
											placeholder="Email"
											on:input={(e) => {
												e.target.value =
													e.target.value.replace(
														/^\s+/,
														"",
													);
												email = e.target.value;
												email = email.trim();
												validateField("email");
												errors.email = !email
													? "*Required"
													: !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
																email,
														  ) ||
														  email
																.split("@")[1]
																.includes(
																	"gamil",
																)
														? "Please enter a valid email address"
														: "";
												ProfileEmailVerified = false;
												emailSent = false;
												authedUserEmailVerified = false;
											}}
										/>
										{#if isLoading}
											<span
												class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
											>
												<Icon
													icon="line-md:loading-alt-loop"
													class="w-4 h-4 mr-1 animate-spin"
												/>
												Verifying...
											</span>
											<!-- {:else if !ProfileEmailVerified && !emailSent && isEmailVerified !== true} -->
										{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
											<button
												type="submit"
												class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-500 hover:text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
												disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
													email,
												) ||
													email
														.split("@")[1]
														.includes("gamil")}
											>
												Verify
											</button>
										{:else if emailSent}
											<span
												class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-green-600 flex items-center"
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
												class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-green-600 flex items-center"
											>
												Verified
												<Icon
													icon="material-symbols:verified-rounded"
													class="w-4 h-4 ml-1"
												/>
											</span>
										{/if}
									</div>
									{#if errors?.email}
										<span
											class="text-red-500 text-xs mt-1 block"
											>{errors.email}</span
										>
									{/if}
								</div>
							</form>
							{#if emailSent && isOtpVerified === false}
								<div
									class="mt-3"
								>
									<form
										action="?/verifyOtpEmail"
										method="POST"
										use:enhance={() => {
											return async ({ result }) => {
												loadingotp = false; // Hide loading spinner when the request is complete
												if (result.status === 200) {
													if (
														result.data.status ===
														200
													) {
														const verifiedMessage =
															result.data.message;
														toast.success(
															verifiedMessage,
														);
														isOtpVerified =
															result.data
																.isEmailVerified;
														enteredOtpemail = "";
														ProfileEmailVerified = true;
														console.log(
															isOtpVerified,
															"isOtpVerified",
														);
													} else {
														const errorMessage =
															result.data
																.message ||
															"An unknown error occurred!";
														toast.error(
															errorMessage,
														);
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
											loadingotp = true; // Show loading message when form is submitted
										}}
									>
										<div class="relative w-full mb-2">
											<input
												type="hidden"
												name="email"
												id="email"
												bind:value={email}
											/>
											<input
												type="text"
												name="enteredOtp"
												bind:value={enteredOtpemail}
												placeholder="Enter 6-digit OTP"
												class="w-full text-sm border-gray-300 border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 p-2.5"
												on:input={() => {
													enteredOtpemail =
														enteredOtpemail.trim();
													enteredOtpemail =
														enteredOtpemail
															.replace(/\D/g, "")
															.slice(0, 6);
												}}
											/>
											<button
												type="submit"
												class="absolute top-1/2 right-3 transform -translate-y-1/2 text-primary-600 font-semibold text-xs py-1 rounded hover:text-primary-800 hover:underline disabled:opacity-50"
												 disabled={loadingotp ||
                                                !enteredOtpemail ||
                                                !/^\d{6}$/.test(
                                                    enteredOtpemail,
                                                )}
											>
												{#if loadingotp}
													<span
														class="flex items-center"
													>
														<Icon
															icon="line-md:loading-alt-loop"
															class="w-4 h-4 mr-1 animate-spin"
														/>
														Verifying...
													</span>
												{:else}
													Verify
												{/if}
											</button>
										</div>
										<div class="flex justify-end text-xs">
											<span>
												Didn't receive the code?</span
											>
											<button
												type="button"
												on:click={handleResendOtpemail}
												disabled={loadingotp}
												class="text-primary-400 hover:text-primary-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Get a new code
											</button>
										</div>
									</form>
								</div>
							{/if}
						</div>

						<!-- Company Name Input -->
						<!-- <div class="flex flex-col">
				<input
				  name="companyName"
				  type="text"
				  id="companyName"
				  placeholder="Company/Institution Name"
				  bind:value={companyName}
				  required
				  class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
				  on:input={() => validateField('companyName')}
				/>
				
				</div>
				{#if errors.companyName}
				  <p class="text-red-500 text-xs mt-1">{errors.companyName}</p>
				{/if} -->

						<div class="flex flex-col">
							<input
								type="text"
								name="companyName"
								placeholder="Company Name "
								bind:value={companyName}
								maxlength="50"
								class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
								required
								on:input={(e) => {
									e.target.value = e.target.value.replace(
										/^\s+/,
										"",
									);
									companyName = e.target.value;

									validateField("companyName");

									errors.companyName = !companyName
										? "*Required"
										: companyName.length < 3
											? "Must be at least 3 characters"
											: !/^[A-Za-z@.,!#$%^&*(_)+\-\s]+$/.test(
														companyName,
												  )
												? "Please enter a valid company name"
												: "";
								}}
							/>
							{#if errors?.companyName}
								<p class="text-red-500 text-xs mt-1">
									{errors.companyName}
								</p>
							{/if}
						</div>

						<div class="flex flex-col">
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="relative dropdown-container">
								<input
									type="text"
									name="country"
									bind:value={country}
									placeholder="Search Country"
									on:input={handleInputChange}
									on:click={toggleDropdown}
									on:keydown={handleKeyDown}
									on:input={(e) => {
										country = country.trim();

										validateField("country");
									}}
									autocomplete="off"
									class="flex-1 outline-none w-full border border-gray-300 rounded focus:ring-0 focus:border-primary-400 p-2 text-sm"
									required
								/>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click|stopPropagation={toggleDropdown}
									class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
								>
									<Icon
										icon={showDropdown
											? "ep:arrow-up-bold"
											: "ep:arrow-down-bold"}
										class="text-gray-500 mr-1 text-2s font-bold"
									/>
								</div>
								{#if showDropdown}
									<div
										bind:this={dropdownEl}
										class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
									>
										<ul
											class="max-h-60 overflow-y-auto text-sm"
										>
											{#each filteredCountries as country, index}
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
												<li
													on:click={() =>
														selectCountry(country)}
													class="px-4 py-2 cursor-pointer {highlightedIndex ===
													index
														? 'bg-primary-100'
														: 'hover:bg-primary-50'}"
												>
													{country.name} ({country.code})
												</li>
											{/each}
											{#if filteredCountries.length === 0}
												<div
													class="flex items-center px-4 py-3"
												>
													<Icon
														icon="tabler:info-square-rounded-filled"
														class="text-red-500 text-base mr-2"
													/>
													<li
														class="text-gray-800 text-xs"
													>
														No matching countries
														found!
													</li>
												</div>
											{/if}
										</ul>
									</div>
								{/if}
							</div>
							{#if errors.country}
								<p class="text-red-500 text-xs mt-1">
									{errors.country}
								</p>
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
									phoneNumber = phoneNumber
										.replace(/[^+\d]/g, "")
										.trim();
									validateField("phoneNumber");
									validatePhoneNumber(country, phoneNumber);
								}}
							/>
							{#if errors.phoneNumber}
								<p class="text-red-500 text-xs mt-1">
									{errors.phoneNumber}
								</p>
							{/if}
						</div>
						<!-- <div class="flex flex-col">
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
			</div> -->
					</div>

					<div
						class="flex md:justify-end justify-center md:ml-5 col-span-2 mt-2"
					>
						<button
							class="md:w-1/2 w-full justify-end bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
							on:click={(event) => {
								// event.preventDefault();

								// Check form validity
								if (!formValid()) {
									toast.error(
										"Please fill all the required fields.",
									);
									event.preventDefault();
									return;
								}
								if (
									!(
										ProfileEmailVerified ||
										authedUserEmailVerified === true
									)
								) {
									toast.error(
										"Please verify your email to proceed",
									);
									event.preventDefault();
									return;
								}
								if (!poVerified) {
									toast.error(
										"please verify your Order number to proceed",
									);
									event.preventDefault();
									return;
								} else {
									handlesubmit();
								}
							}}
							on:keydown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
								}
							}}
						>
							Submit
						</button>
					</div>
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
			<h2 class="text-center text-red-500 font-semibold text-base w-full">
				{errormessage}
			</h2>
		{/if}
	</div>
{/if}
