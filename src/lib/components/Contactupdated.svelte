<script>
	import Icon from "@iconify/svelte";
	import { onMount, onDestroy } from "svelte";
	import { enhance } from "$app/forms";
	import { toast, Toaster } from "svelte-sonner";
	import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
	let showSubmitPopup = false;
	export let data;
	let isLoadingPhone = false;
	let searchTerm = "";
	let loadingotp = false;
	let loadingPhone = false;
	let country = "";
	let authedUserEmailVerified = data?.profile?.isEmailVerified;
	let authedUserPhoneVerified = data?.profile?.isPhoneVerified;
	let verificationMessage = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let form3;

	let ProfileEmailVerified = data.isEmailVerified;
	let ProfilePhoneVerified = data.isPhoneVerified;
	let TokenEmailVerified = "";
	let captchaVerified = false;
	let form2;
	let phone = "";
	let email = "";
	let name = "";
	let company = "";

	let message = "";
	let subject = "";
	let emailidstatus = "";
	let isDataAvailable = false;
	let errors = {};
	let recaptchaResponse = "";
	let successMessage = "";
	let isChecked = false;
	let isEditable = false;
	let errorMessage = "";
	let rotationClass = "";
	let showCaptchaPopup = false;
	let mathQuestion = "";
	let mathAnswer = 0;
	let userAnswer = "";
	let mathError = "";
	let OtpSent = false;
	let captchaToken = "";
	let form;
	let showFailureDiv = false;
	let showSuccesDiv = false;
	let submitting = false;
	let actionMessage = { message: "", success: false };
	function setActionMessage(message, isSuccess) {
		actionMessage = {
			message: message,
			success: isSuccess,
		};

		if (message) {
			showSubmitPopup = true;
		} else {
			setTimeout(() => {
				showSubmitPopup = false;
			});
		}
	}
	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		if (keywordError === "success") {
			setTimeout(() => {
				resetForm();
			}, 2000);
		}
	}

	let countryDropdownRef;

	function handleFormClick(event) {
    const isInCountry = countryDropdownRef?.contains(event.target);
    if (!isInCountry) {
      showDropdown = false;
    }
  }

	const validateField = (fieldName) => {
		
		if (!fieldName || fieldName === "name") {
	if (!name) {
		errors.name = "User Name is required";
	} else if (name.trim().length < 3 || name.trim().length > 50) {
	errors.name = "User Name must be between 3 and 50 characters";
}else if (!/^[A-Za-z\s]+$/.test(name)) {
		errors.name = "User Name should contain only letters and spaces";
	} else {
		delete errors.name;
	}
	errors = { ...errors }; // ✅ triggers Svelte to re-render error messages
}




		if (!fieldName || fieldName === "country") {
    if (!country || country === "") {
        errors.country = "Country is required";
    } else {
        delete errors.country;
    }
}
		if (!fieldName || fieldName === "email") {
			if (
				!email ||
				!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
					email,
				) ||
				email.split("@")[1].includes("gamil")
			) {
				errors.email = "Email is required"
			} else {
				delete errors.email;
			}
		}

		if (!fieldName || fieldName === "phone") {
			if (!country && phone){
        errors.phone = "Please select the country before entering the phone number";
        return;
    }

			if (!phone || phone === "") {
				errors.phone = "Number is required";
			} else {
				const countryDetails = getCountryByCode(country);
				if (!countryDetails) {
					errors.phone = "Invalid Number for the selected country";
					errors.country = "Invalid country selected";
				} else {
					const phonePattern = getPhonePattern(country);
					if (!phonePattern) {
						errors.phone =
							"Phone number pattern for country not found";
					} else {
						const phoneRegex = new RegExp(phonePattern);
						if (!phoneRegex.test(phone)) {
							const countryName = countryDetails.name || country || "selected country";
							errors.phone = `Please enter a valid phone number for ${countryName}.`;
						} else {
							delete errors.phone;
						}
					}
				}
			}
		}

		if (!fieldName || fieldName === "message") {
			if (!message || message.trim().length < 3 || message.trim().length > 500) {
	errors.message = "Message must be between 3 and 500 characters";
}
 else if (
		!/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(message) ||
		/<[^>]*>/.test(message)
	) {
		errors.message = "Message is required";
	} else {
		delete errors.message;
	}
	errors = { ...errors }; // ✅ reassign to trigger Svelte update
}

if (!fieldName || fieldName === "subject") {
	if (!subject || subject.trim().length < 3 || subject.trim().length > 250) {
	errors.subject = "Subject must be between 3 and 250 characters";
}
else if (
		!/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(subject) ||
		/<[^>]*>/.test(subject)
	) {
		errors.subject = "Subject is required";
	} else {
		delete errors.subject;
	}
	errors = { ...errors }; // ✅ reassign to trigger Svelte update
}



		if (!fieldName || fieldName === "company") {
	const trimmedCompany = company ? company.trim() : "";
	let newErrors = { ...errors };

	if (!trimmedCompany) {
		newErrors.company = "Company name is required";
	} else if (trimmedCompany.length < 3 || trimmedCompany.length > 100) {
	newErrors.company = "Company name must be between 3 and 100 characters";
}
else if (
		!/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(trimmedCompany) ||
		/<[^>]*>/.test(trimmedCompany)
	) {
		newErrors.company = "Please enter a valid company name";
	} else {
		delete newErrors.company;
	}

	errors = newErrors; 
}




		if (!fieldName || fieldName === "captcha") {
			if (!isChecked) {
				errors.captcha = "Please complete the captcha";
			} else {
				delete errors.captcha;
			}
		}

		if (Object.keys(errors).length > 0) {
			isChecked = false;
		}
	};

	let loading = false;
	function submitFormAutomatically() {
		loading = false;
		if (form) {
			const formData = new FormData(form);

			fetch(form.action, {
				method: form.method,
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					window.scrollTo({ top: 0, behavior: "smooth" });
					if (data.status === 200) {
						showSuccesDiv = true;
						window.scrollTo({ top: 0, behavior: "smooth" });
					} else {
						showFailureDiv = true;
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
				});
		}
	}
	// function handleClickOutside(event) {
	// 	if (!event.target.closest(".dropdown-container")) {
	// 		showDropdown = false;
	// 	}
	// }
	function handleKeyDown(event) {
    if (event.key === "Enter" && searchTerm.length >= 3 && filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
        event.preventDefault();
    }
}

	const handleSubmit = async ({ cancel, event }) => {
		event.preventDefault();
		validateField("name");
		validateField("email");
		validateField("phone");
		validateField("message");
		validateField("subject");
		validateField("captcha");
		validateField("country");
		const isValid = formValid();
		console.log("Form valid result from handleSubmit:", isValid);
		if (!isValid) {
			isChecked = false;
			cancel();
			return;
		}

		showPopup();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	function selectCountry(selectedCountry) {
		country = selectedCountry.name;
		searchTerm = `${selectedCountry.name} `;
		showDropdown = false;
		validateField("country");
		validateField("phone");

		validatePhoneNumber(country, phone);
		const countryInput = document.querySelector('input[name="country"]');
		if (countryInput) {
			countryInput.value = selectedCountry.name;
		}
        if (!phone || phone === "") {
               errors.phone = "";
        }
        else {
        delete errors.phone; 
    }
	}
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function handleInputChange(event) {
		searchTerm = event.target.value;
		const isDeleting =
			event.inputType === "deleteContentBackward" ||
			event.inputType === "deleteContentForward";

		if (searchTerm.length > 0 && !isDeleting) {
			filterCountriesWithoutAutoSelect();
		showDropdown = filteredCountries.length > 0;
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
		} else {
			filterCountriesWithoutAutoSelect();
			showDropdown = filteredCountries.length > 0;
		}
	}

	function filterCountriesWithoutAutoSelect() {
		filteredCountries = countries.filter(
			(country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
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
		if (!countryName) return "^[0-9]+$";
		const regex = phoneNumberPatterns[countryName];
		return regex || "^[0-9]+$";
	}

	function validatePhoneNumber(countryCode, phone) {
		if (!phone || !countryCode === "") {
			return false;
		}

		const country = getCountryByCode(countryCode);
		if (!country) {
			errors.phone = "Select your country before entering number";
			errors.country = "Invalid country selected";
			return false;
		}

		const phonePattern = getPhonePattern(countryCode);
		if (!phonePattern) {
			errors.phone = "Phone number pattern for country not found";
			return false;
		}

		const phoneRegex = new RegExp(phonePattern);

		if (!phoneRegex.test(phone)) {
			errors.phone = `Please enter a valid phone number for ${country}.`;
			return false;
		} else {
			errors.phone = "";
			return true;
		}
	}
	function generateMathQuestion() {
		const num1 = Math.floor(Math.random() * 10) + 1;
		const num2 = Math.floor(Math.random() * 10) + 1;
		const operations = ["+", "-", "*"];
		const randomOperation =
			operations[Math.floor(Math.random() * operations.length)];

		if (randomOperation === "-") {
			const larger = Math.max(num1, num2);
			const smaller = Math.min(num1, num2);
			mathQuestion = `What is ${larger} - ${smaller}?`;
			mathAnswer = larger - smaller;
		} else if (randomOperation === "+") {
			mathQuestion = `What is ${num1} + ${num2}?`;
			mathAnswer = num1 + num2;
		} else if (randomOperation === "*") {
			mathQuestion = `What is ${num1} * ${num2}?`;
			mathAnswer = num1 * num2;
		}
	}

	let submittingForm = false;
	let isLoadingemail = false;
	let progress = 0;
	let errorMessagecap = "";
	let inputReadOnly = false;

	function validateMathCaptcha(e) {
		const userResponse = parseInt(userAnswer.trim());
		if (userResponse === mathAnswer) {
			submittingForm = true;
			if (submittingForm) {
				const interval = setInterval(() => {
					progress += 5;
					if ((progress = 96)) {
						clearInterval(interval);
					}
				}, 500);
			}
			errorMessagecap = "";
			successMessage = "Captcha verified Successfully!!!";
			isChecked = true;
			captchaVerified = true;
			loading = true;
			inputReadOnly = true;

			const tokenPayload = {
				question: mathQuestion,
				answer: mathAnswer,
			};
			captchaToken = btoa(JSON.stringify(tokenPayload));

			setTimeout(() => {
				submitFormAutomatically();
			}, 1000);
		} else {
			successMessage = "";
			errorMessagecap = "Incorrect answer, try again.";
			isChecked = false;

			// setTimeout(() => {
			// 	generateMathQuestion();
			// 	userAnswer = "";
			// 	errorMessagecap = "";
			// }, 4000);
		}
	}

	function clearForm() {
		if (data && data.authedUser && data.profile) {
			message = "";
			subject = "";
			isChecked = false;
			captchaToken = "";
			errors = {};
		} else {
			name = "";
			email = "";
			phone = "";
			message = "";
			subject = "";
			isChecked = false;
			captchaToken = "";
			errors = {};
		}
	}

	function handleBlur() {
		validateField("email");

		if (email && email.trim() !== "" && !errors.email) {
			form2.requestSubmit();
		}
	}
	function refreshMathQuestion(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  rotationClass = "rotate-[360deg]";

  setTimeout(() => {
    generateMathQuestion();
    rotationClass = "";
    userAnswer = ""; // Clear the previous answer when refreshing
    errorMessagecap = ""; // Clear any error messages
    successMessage = ""; // Clear any success messages
  }, 1000);
}
	// function refreshMathQuestion() {
	// 	rotationClass = "rotate-[360deg]";

	// 	setTimeout(() => {
	// 		generateMathQuestion();
	// 		rotationClass = "";
	// 	}, 1000);
	// }

	// function onInputChange() {
	// 	if (userAnswer.trim()) {
	// 		validateMathCaptcha();
	// 	} else {
	// 		errorMessagecap = "";
	// 	}
	// }
	function onInputChange() {
  // Just clear the error message when typing, don't validate yet
  if (errorMessagecap && userAnswer.trim()) {
    errorMessagecap = "";
  }
}
function verifyCaptcha() {
  if (userAnswer.trim()) {
    validateMathCaptcha();
  } else {
    errorMessagecap = "Please answer the question";
  }
}

	function closeCaptchaPopup() {
		showCaptchaPopup = false;

		userAnswer = "";

		if (successMessage) {
			isChecked = true;
		} else {
			isChecked = false;
		}
	}

	function formValid() {
		validateField("name");
		validateField("email");
		validateField("phone");
		validateField("message");
		validateField("subject");
		validateField("country");
		

		const isEmailVerified = ProfileEmailVerified;
		const isOtpPhoneVerified = ProfilePhoneVerified;
		const isUserEmailVerified = authedUserEmailVerified === true;
		const isUserPhoneVerified = authedUserPhoneVerified === true;
		const hasErrors = Object.keys(errors).length > 0;

		const isValid =
			!hasErrors &&
			(isEmailVerified ||
				isUserEmailVerified ||
				isOtpPhoneVerified ||
				isUserPhoneVerified);
		return isValid;
	}

	function compvalid() {
  if (
    company &&
    company.trim().length > 0 &&
    (company.trim().length < 3 || company.trim().length > 100)
  ) {
    errors.company = "Company name must be between 3 and 100 characters long.";
    errors = { ...errors }; 
    console.log("Company name length is invalid");
    return false;
  } else {
    if (Number.isInteger(Number(company))) {
      errors.company = "Company name cannot be a whole number. Please enter a valid name.";
      errors = { ...errors }; 
      console.log("Company name cannot be a whole number");
      return false;
    } else {
      delete errors.company;
      errors = { ...errors }; 
      console.log("Company name is valid");
      return true;
    }
  }
}
	
	function showPopup() {
		if (isChecked) {
			showCaptchaPopup = true;
			generateMathQuestion();
		}
	}

	let isEmailVerified = false;
	let isLoading = false;
	onMount(() => {
		isChecked = false;

		if (data && data.authedUser && data.profile) {
			name =
				`${data.profile.firstName || ""} ${data.profile.lastName || ""}`.trim();
			email = data.profile.email || "";
			phone = data.profile.cellPhone || "";
			country = data.profile.country || "";
			company = data.profile.companyName || "";

			isDataAvailable = true;
		} else {
			name = "";
			email = data.email || "";
			phone = "";
			country = "";
			company = "";

			isDataAvailable = false;
			if (data?.email) {
				email = data.email;
				const reloadFlag = sessionStorage.getItem("emailReloaded");
				if (!reloadFlag) {
					sessionStorage.setItem("emailReloaded", "true");
					location.reload();
				} else {
					sessionStorage.removeItem("emailReloaded");
				}
			}
		}
		isEditable = false;
		// document.addEventListener("click", handleClickOutside);
        // return () => document.removeEventListener("click", handleClickOutside);

		setTimeout(() => {
			isChecked = false;
		}, 1500);
		generateMathQuestion();
	});
	let isEmailModified = false;


	let timeLeft = 60;
	let timerInterval;
	const startTimer = () => {
		clearInterval(timerInterval);
		timeLeft = 60;

		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
			} else {
				clearInterval(timerInterval);
			}
		}, 1000);
	};

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
// 	$: if (country) {
//     validateField("phone");
// }
</script>

{#if showSuccesDiv}
	<div class="mb-4 w-full flex items-center justify-center mx-auto max-w-7xl p-4">
		<div class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg">
			<h3 class="md:text-xl text-lg font-semibold text-green-600 mb-4">
				Contact Us Form Submission
			</h3>
			<p class="md:text-md text-xs text-gray-700 mt-4 mb-6">
				Thank you for reaching out! We have received your message and
				will get back to you as soon as possible.
			</p>
			<div class="w-10/12 mx-auto my-6 border-t-1 border-green-300"></div>
			<div class="flex items-center justify-center">
				<a href="/"
					class="bg-white text-primary-500 border-1 border-primary-500 px-4 py-2 rounded-md font-medium hover:bg-primary-500 hover:text-white transition-all duration-300 flex justify-center items-center">
					<Icon icon="mdi:home" class="text-xl mr-2" />Back to Home
				</a>
			</div>
		</div>
	</div>
{:else if showFailureDiv}
	<div class="pb-20 pt-20 h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10 sm:text-sm text-xs">
		<div class="w-10/12 md:w-8/12 bg-gradient-to-r from-red-100 via-red-50 to-red-100 p-8 rounded-lg shadow-lg text-center">
			<p class="sm:text-md text-sm text-gray-700 mb-6">
				There was an issue with submitting the form. Please try again
				after a while.
			</p>
			<div class="w-10/12 mx-auto my-6 border-t-2 border-red-300"></div>
			<div>
				<a href="/feedback"
				class="sm:text-sm text-xs bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition">
					Report Issue
				</a>
			</div>
		</div>
	</div>
{:else}
	<section class="mt-6 mb-10 w-11/12 max-w-7xl flex flex-wrap justify-center mx-auto sm:p-0 font-roboto bg-white">
		<div class="w-full shadow rounded-lg">
			<h1 class="sm:text-2xl text-md font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
				Get in Touch with Us
			</h1>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<form
				method="POST"
				action="?/contactus"
				class="space-y-4"
				bind:this={form}
				on:click={handleFormClick}
				use:enhance={(event) => {
					const isEmailVerified = ProfileEmailVerified; 
					const isAuthedUserEmailVerified = authedUserEmailVerified; 
					console.log(
						isEmailVerified,
						isAuthedUserEmailVerified,
						"Email verification status",
					);
					if (!(isEmailVerified || isAuthedUserEmailVerified)) {
						console.log("Email is not verified");
						toast.error("Please verify your email to proceed");
						event.preventDefault();

						return () => {};
					}
					submitting = true;

					return async ({ result }) => {
						let message1 = "";
						let keywordError = "";
						console.log(result);
						keywordError = result.data.type;

						if (keywordError === "success") {
							message1 = result.data.data.message;
							submitting = false;
							showSuccesDiv = true;
							console.log(message1);
						} else if (keywordError === "error") {
							message1 = result.data.data.error;
							submitting = false;
							toast.error(message1);
							showFailureDiv = true;
							console.log(message1);
						}

						showMessage(message1, keywordError);
					};
				}}
				>
				<div class="flex flex-col md:flex-row p-4">
					<div class="md:w-2/5 p-2">
						<div
							class="flex items-start sm:mt-6 mt-3 sm:mb-6 mb-3 sm:ml-4 ml-0"
						>
							<Icon
								icon="mdi:phone"
								class="text-heading sm:w-5 w-4 h-5 mr-2 sm:mt-1 mt-0"
							/>
							<div>
								<p
									class="sm:text-lg text-sm text-heading mb-2 font-semibold"
								>
									Phone number
								</p>
								<div
									class="sm:text-sm text-xs hover:text-primary-500 cursor-pointer"
								>
									<a href="tel:7829922222"> 7829922222 </a>
								</div>
							</div>
						</div>
						<hr class="my-2" />
						<div
							class="flex items-start sm:mt-6 mt-3 sm:mb-6 mb-3 sm:ml-4 ml-0"
						>
							<Icon
								icon="material-symbols:mail-rounded"
								class="text-heading sm:w-5 w-4 h-5 mr-2 sm:mt-1 mt-0"
							/>
							<div>
								<p
									class="sm:text-lg text-sm text-heading mb-2 font-semibold"
								>
									Email
								</p>
								<div
									class="sm:text-sm text-xs hover:text-primary-500 cursor-pointer"
								>
									<a href="mailto:sales@partskeys.com"
										>chemikart@gmail.com</a
									>
								</div>
							</div>
						</div>
						<hr class="my-2" />
						<div
							class="flex items-start sm:mt-6 mt-3 sm:mb-6 mb-3 sm:ml-4 ml-0"
						>
							<Icon
								icon="ic:sharp-location-on"
								class="text-heading sm:w-5 w-4 h-5 mr-2 shrink-0 sm:mt-1 mt-0"
							/>
							<div>
								<p
									class="sm:text-lg text-sm text-heading mb-2 font-semibold"
								>
									Location
								</p>
								<a
									href="https://www.google.com/maps?q=No.+206,+Vinni+Arcade+100+Feet+Ring+Road,+Kathriguppe+Main+Rd,+Bengaluru,+Karnataka+560085"
									target="_blank"
									class="sm:text-sm text-xs hover:text-primary-500 cursor-pointer"
								>
									No. 206, Vinni Arcade 100 Feet Ring Road,
									Kathriguppe Main Rd, Bengaluru, Karnataka
									560085
								</a>
							</div>
						</div>
					</div>
					<div class="md:w-3/5 p-2">
						<div class="p-2 sm:p-6">
							<p
								class="sm:text-lg text-md text-heading font-bold"
							>
								Send a Message
							</p>
							<p
								class="sm:text-sm text-xs text-heading mt-3 mb-3"
							>
								We'd love to hear from you! Send us a message,
								and let's stay connected.
							</p>

							<div>
								<div class="mb-4">
									<input
  type="text"
  name="name"
  id="name"
  bind:value={name}
  class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
  placeholder="User Name"
  on:input={() => {
    name = name.trimStart(); 
    validateField("name");
  }}
/>
{#if errors?.name}
  <span class="text-xs ml-1 mt-1 text-red-600">
    {errors.name}
  </span>
{/if}

								  </div>
								<input
									type="hidden"
									name="email"
									id="email"
									bind:value={email}/>
								<div class="flex-1">
									<div class="flex-1 ">
										<form
											action="?/verifyemail"
											bind:this={form3}
											method="POST"
											use:enhance={({}) => {
												return async ({ result }) => {
													isLoading = false;
													console.log(
														"result",
														result,
													);
													if (
														result.data?.status ===
														200
													) {
														ProfileEmailVerified =
															result.data
																.isEmailVerified;
														if (
															authedUserEmailVerified ===
															true
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

														toast.success(
															verificationMessage,
														);
													} else {
														toast.error(
															result.data.message,
														);
														ProfileEmailVerified =
															result.data
																.isEmailVerified;
														emailSent = false;
													}
												};
											}}
											class="flex w-full items-center"
											on:submit={() => {
												isLoading = true;
											}}
										>
											<div class="relative w-full">
												<input
													type="text"
													name="email"
													id="email"
													bind:value={email}
													class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
													placeholder="Email"
													on:input={() => {
														email = email.trim();
														validateField("email");
														errors.email = !email
															? "Please enter a valid email address"
															: !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
																		email,
																  ) ||
																  email
																		.split(
																			"@",
																		)[1]
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
												<div class="flex justify-end items-center w-full pt-2 sm:pt-0 sm:absolute sm:top-1/2 sm:right-2 sm:transform sm:-translate-y-1/2 text-2s font-semibold text-primary-600">
													<span class="flex items-center">
														<Icon
															icon="line-md:loading-alt-loop"
															class="w-4 h-4 mr-1"
														/>
														Verifying...
													</span>
												</div>
												
												{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
												<div class="flex justify-end items-center w-full sm:absolute sm:top-1/2 sm:right-2 sm:transform sm:-translate-y-1/2">
													<button
														type="submit"
														class="text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
														disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) || email.split("@")[1].includes("gamil")}
													>
														Verify
													</button>
												</div>
																						  
												{:else if emailSent}
												<div class="flex justify-end items-center w-full pt-2 sm:pt-0 sm:absolute sm:top-1/2 sm:right-2 sm:transform sm:-translate-y-1/2 text-2s font-semibold text-green-600">
													{#if isOtpVerified}
														<span class="flex items-center">
															Verified
															<Icon
																icon="material-symbols:verified-rounded"
																class="w-4 h-4 mt-2 ml-1"
															/>
														</span>
													{:else}
														<span class="flex items-center">
															<Icon
																icon="fluent:mail-all-read-16-filled"
																class="w-4 h-4 mr-1"
															/>
															Check your inbox
														</span>
													{/if}
												</div>
												
												{:else}
												<div class="flex justify-end items-center w-full pt-2 sm:pt-0 sm:absolute sm:top-1/2 sm:right-2 sm:transform sm:-translate-y-1/2 text-2s font-semibold text-green-600">
													<span class="flex items-center">
														Verified
														<Icon
															icon="material-symbols:verified-rounded"
															class="w-4 h-4 ml-1"
														/>
													</span>
												</div>
												
												{/if}
											</div>
										</form>
										{#if emailSent && isOtpVerified === false}
											<form
												action="?/verifyOtpEmail"
												method="POST"
												use:enhance={() => {
													return async ({
														result,
													}) => {
														loadingotp = false; 
														if (
															result.status ===
															200
														) {
															if (
																result.data
																	.status ===
																200
															) {
																const verifiedMessage =
																	result.data
																		.message;
																toast.success(
																	verifiedMessage,
																);
																isOtpVerified =
																	result.data
																		.isEmailVerified;
																enteredOtpemail =
																	"";
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
																result.data
																	.message ||
																"Request failed. Please try again.";
															toast.error(
																errorMessage,
															);
														}
													};
												}}
												on:submit={() => {
													loadingotp = true; 
												}}
											>
												<div
													class="relative w-full mb-2"
												>
													<input
														type="hidden"
														name="email"
														id="email"
														bind:value={email}
													/>
													<input
														type="text"
														name="enteredOtp"
														bind:value={
															enteredOtpemail
														}
														placeholder="Enter 6-digit OTP"
														class="w-full placeholder:text-xs mt-4 text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
														on:input={() => {
															enteredOtpemail =
																enteredOtpemail.trim();
															enteredOtpemail =
																enteredOtpemail
																	.replace(
																		/\D/g,
																		"",
																	)
																	.slice(
																		0,
																		6,
																	);
														}}
													/>
													<button
														type="submit"
														class="absolute top-1/2 right-3 mt-2 transform -translate-y-1/2 text-primary-600 font-semibold text-xs py-1 rounded-md hover:text-primary-800 hover:underline disabled:opacity-50"
														disabled={loadingotp}
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
												<div
													class="flex justify-end text-xs"
												>
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
										{/if}
										{#if errors?.email}
											<span class=" text-xs ml-1 mt-1 text-red-600"
												>{errors.email}</span
											>
										{/if}

										{#if emailSent && isOtpVerified === false}
										<!-- fdghj -->
										{/if}
									</div>
								</div>

								<div
									class="grid grid-cols-1 md:grid-cols-2 my-4 gap-6"
								>
								<div>
									<div class="relative" bind:this={countryDropdownRef}>
										<div class="flex items-center relative overflow-hidden w-full bg-gray-50">
											<!-- Input Field -->
											<input
											  type="text"
											  name="country"
											  bind:value={country}
											  placeholder="Search country"
											  on:click={toggleDropdown}
											  on:keydown={handleKeyDown}
											  on:input={(e) => {
												handleInputChange(e);
												validateField("country", "input");
												country = e.target.value.trim();
											  }}
											  class="w-full placeholder:text-xs text-sm px-2 py-2 pr-10 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
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
									<div
										class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
									>
										<ul
											class="max-h-60 overflow-y-auto text-sm"
										>
											{#each filteredCountries as country (country.name)}
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
												<li
													on:click={() =>
														selectCountry(
															country,
														)}
													class="px-4 py-2 cursor-pointer hover:bg-gray-100"
												>
													{country.name}
													({country.code})
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
														No matching
														countries
														found!
													</li>
												</div>
											{/if}
										</ul>
									</div>
								{/if}
									</div>
										{#if errors?.country}
											<p
												class="ml-1 text-red-600 text-xs mt-1 "
											>
												{errors.country}
											</p>
										{/if}
										
								</div>

									<div>
										<input
											type="tel"
											name="phone"
											placeholder="Phone number"
											class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
											bind:value={phone}
											title="Please enter a valid phone number"
											on:input={() => {
												phone = phone
													.replace(/[^+\d]/g, "");
												validateField("phone");
												validatePhoneNumber(
													country,
													phone,
												);
											}}
										/>
										{#if errors?.phone}
											<p class=" text-xs ml-1 mt-1 text-red-600">
												{errors.phone}
											</p>
												
											
										{/if}
									</div>
								</div>
								<div class="pb-4">
									<input
	type="text"
	name="company"
	placeholder=" Company Name"
	class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
	bind:value={company}
	title="Please enter a valid company name"
	on:input={() => {
		company = company.trimStart();
		compvalid(); // ✅ call compvalid on input to validate in real-time
	}}
/>
{#if errors?.company}
	<span class="text-xs ml-1 mt-1 text-red-600">
		{errors.company}
	</span>
{/if}

								  
								</div>
								<div class="flex flex-col md:flex-row md:space-x-4">
									<div class="flex-1 mb-4">
										<input
											type="text"
											name="subject"
											id="subject"
											bind:value={subject}
											class="w-full text-sm placeholder:text-xs px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
											placeholder="Subject"
											on:input={() => {
												const trimmedSubject = subject.trimStart();
												subject = trimmedSubject;
												validateField("subject");
												


											}}
										/>
										{#if errors?.subject}
											<span class=" text-xs ml-1 mt-1 text-red-600"
												>{errors.subject}</span
											>
										{/if}
									</div>
								</div>

								<div class="">
									<div class="">
										<textarea
											name="message"
											id="message"
											bind:value={message}
											class="w-full text-sm h-24 placeholder:text-xs px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
											placeholder="Message"
											on:input={() => {
												const trimmedMessage = message.trimStart();
												message = trimmedMessage;
												validateField("message");
												
											}}
										></textarea>
										{#if errors?.message}
											<span class=" text-xs ml-1 mt-1 text-red-600"
												>{errors.message}</span
											>
										{/if}
									</div>
								</div>

								<div class="flex flex-col lg:flex-row mb-2">
									<div class="flex-1 mb-4">
										<label
											for="recaptcha"
											class="block text-sm font-medium text-gray-700"
										>
										</label>
										<input
											type="hidden"
											name="token"
											value={captchaToken}
										/>
										<div id="g-recaptcha-response">
											<div class="flex justify-end mt-5 md:mt-6 mb-4">
												<label class="flex items-center space-x-2 cursor-pointer">
												 
												  <input
													type="checkbox"
													name="captcha"
													value="captcha"
													class="w-5 h-5 border-2 border-gray-400 text-primary-600 focus:ring-primary-500 rounded-md cursor-pointer hover:border-primary-500 transition-colors duration-300"
													bind:checked={isChecked}
													on:click={(event) => {
													  event.preventDefault(); // prevent auto toggle
											  
													  const isFormValid = formValid();
													  const isCompanyValid = compvalid();
											  
													  if (isFormValid && isCompanyValid) {
														isChecked = true;
														showPopup();
													  } else {
														isChecked = false;
											  
														if (Object.keys(errors).length > 0) {
														  toast.error("Please fill all the required fields.");
														  return;
														}
											  
														if (!(ProfileEmailVerified || authedUserEmailVerified === true)) {
														  toast.error("Please verify your email to proceed");
														  return;
														}
													  }
													}}
												  />
												  <span class="text-gray-700 font-medium text-sm">
													Please verify you are human
												  </span>
												</label>
											  </div>

											<div
												class="mt-4 rounded flex items-center justify-end"
											>
												<button
													class="px-6 py-3 rounded-md bg-primary-400 text-white font-medium shadow-md hover:shadow-xl transform transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
													on:click={(event) => {
														event.preventDefault();

														if (!formValid()) {
															if (
																Object.keys(
																	errors,
																).length > 0
															) {
																toast.error(
																	"Please fill all the required fields.",
																);
																return;
															}

															if (
																!(
																	ProfileEmailVerified ||
																	authedUserEmailVerified ===
																		true
																)
															) {
																toast.error(
																	"Please verify your email to proceed",
																);
																return;
															}
														}

														if (!isChecked) {
															toast.error(
																"Please complete the CAPTCHA to proceed with the submission.",
															);
															return;
														}

														handleSubmit({ event });
													}}
													on:keydown={(event) => {
														if (
															event.key ===
															"Enter"
														) {
															event.preventDefault();
														}
													}}
												>
													{#if submitting}
														<span
															class="flex items-center justify-center"
														>
															<Icon
																icon="line-md:loading-alt-loop"
																class="w-4 h-4 mr-2 animate-spin"
															/>
															Submitting...
														</span>
													{:else}
														Submit Request
													{/if}
												</button>
											</div>

											{#if errorMessage}
												<p class="text-red-500 text-sm mt-2">
													{errorMessage}
												</p>
											{/if}
										</div>
									</div>

									{#if showCaptchaPopup}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="fixed inset-0 flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-50 z-50"
										on:click={closeCaptchaPopup}
									>
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div
											class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100 mx-4"
											on:click|stopPropagation
										>
											<h2 class="text-xl font-bold mb-6 text-gray-800 text-center">
												Verify You're Human
											</h2>
								
											<div class="bg-gray-50 p-4 rounded-lg mb-6">
												<p class="flex items-center justify-between text-gray-700 font-medium">
													<span class="text-lg">{mathQuestion}</span>
													<button
  class="ml-4 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-all duration-300 {submittingForm ? 'opacity-50 cursor-not-allowed' : ''}"
  on:click={submittingForm ? null : (e) => refreshMathQuestion(e)}
  disabled={submittingForm}
>
													<Icon
														icon="ic:round-refresh"
														class={`w-5 h-5 text-primary-600 ${submittingForm ? '' : 'cursor-pointer hover:scale-110'} transition transform ${rotationClass}`}
													/>
												</button>
												</p>
											</div>
											
											<div class="mb-6">
												<input
													type="text"
													bind:value={userAnswer}
													placeholder="Your Answer"
													class="border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none transition-all"
													on:input={onInputChange}
													readonly={inputReadOnly}
												/>
								
												{#if errorMessagecap}
													<p class="text-red-500 text-sm mt-2 flex items-center">
														<Icon icon="mdi:alert-circle" class="w-4 h-4 mr-1" />
														{errorMessagecap}
													</p>
												{/if}
												
												{#if successMessage}
													<p class="text-green-500 text-sm mt-2 flex items-center">
														<Icon icon="mdi:check-circle" class="w-4 h-4 mr-1" />
														{successMessage}
													</p>
												{/if}
											</div>
											
											{#if submittingForm}
												<div class="w-full mb-4">
													<p class="text-sm mb-2 flex items-center text-primary-600">
														<Icon icon="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
														Submitting form
													</p>
													<div class="relative">
														<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
															<div
																class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300"
																style="width: {progress}%;"
															></div>
														</div>
													</div>
												</div>
											{/if}
											<button
											class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition font-medium text-base {submittingForm ? 'opacity-50 cursor-not-allowed' : ''}"
											on:click={(e) => {
											  if (!submittingForm) {
												e.preventDefault();
												e.stopPropagation();
												verifyCaptcha();
											  }
											}}
											disabled={submittingForm}
										  >
											{submittingForm ? 'Verifying...' : 'Verify Now'}
										  </button>
											<!-- <button
												class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition font-medium text-base"
												on:click={() => {
													onInputChange();
													if (!errorMessagecap && userAnswer) {
														submittingForm = true;
								
														setTimeout(() => {
															submittingForm = false;
															successMessage = 'Verification successful!';
														}, 2000);
													} else {
														errorMessagecap = '*Please answer the question correctly';
													}
												}}
											>
												Verify Now
											</button> -->
										</div>
									</div>
								{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</section>
{/if}
<Toaster position="bottom-right" richColors />