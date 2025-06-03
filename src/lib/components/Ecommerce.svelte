<script>
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import { tick } from "svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
	import { CaptchaUtils } from "$lib/utils/Captcha.js";
	const captchaUtils = new CaptchaUtils();
	let captchaState = captchaUtils.getState();

	$: captchaState = captchaUtils.getState();
	let selectedNames = [];
	let reason = [];
	let hovered = false;
	let carrn = false;
	let submitting = false;
	let inputReadOnly = false;
	let progress = 0;
	let form;
	let isCheckedcap = false;
	let errorMessagecap = "";
	let submittingForm = false;
	let loading = false;
	$: reason = [...selectedNames];
	export let data;
	let authedUserEmailVerified = data?.profile?.isEmailVerified;
	console.log("authedUserEmailVerified", authedUserEmailVerified);
	let verificationMessage = "";
	let captchaVerified = false;
	let captchaToken = "";
	let rotationClass = "";
	let showCaptchaPopup = false;
	let mathQuestion = "";
	let mathAnswer = 0;
	let userAnswer = "";
	let emailSent = false;
	let displayMessage = "";
	let enteredOtp = "";
	let enteredOtpemail = "";
	let isOtpVerified = false;
	let isOtpPhoneVerified = false;
	let isLoading = false;
	let showSuccesDiv = false;
	let showFailureDiv = false;
	let ProfileEmailVerified;
	let errors = {};
	let form3;
	import { enhance } from "$app/forms";

	let isDataAvailable = false;
	let isEditable = false;
	onMount(() => {
		if (data && data.profile) {
			fname = data.profile.firstName || "";
			lname = data.profile.lastName || "";
			email = data.profile.email || "";
			number = data.profile.cellPhone || data.profile.primaryPhone;
			company = data.profile.companyName || "";

			const profileCountry = data.profile.country?.trim();
			if (profileCountry) {
				const foundCountry = countries.find(
					(c) =>
						c.name.toLowerCase() === profileCountry.toLowerCase(),
				);
				if (foundCountry) {
					location = foundCountry.name;
				}
			}

			isDataAvailable = true;
		} else {
			name = "";
			email = data?.email || "";
			number = "";

			location = "";
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
			captchaUtils.generateMathQuestion();
		captchaState = captchaUtils.getState();
		// document.addEventListener("click", handleClickOutside);
		// return () => document.removeEventListener("click", handleClickOutside);
	});
	let isChecked = true;
	let phone = "";
	let name = "";
	let message = "";
	let subject = "";
	let formValid = true;
	let formSubmitted = false;
	let showErrors = false;
	let successMessage = "";
	let errorMessage = "";
	let fname = "";
	let lname = "";
	let email = "";
	let number = "";
	let location = "";
	let details = "";
	let company = "";
	let role = "";
	function resetForm() {
		phone = "";
		name = "";
		message = "";
		subject = "";
		successMessage = "";
		errorMessage = "";
		fname = "";
		lname = "";
		email = "";
		number = "";
		location = "";
		details = "";
		company = "";
		role = "";
		selectedNames = [];
	}
	let showDropdown = false;

	// function handleKeyDown(event) {
	// 	if (
	// 		event.key === "Enter" &&
	// 		searchTerm.length >= 3 &&
	// 		filteredCountries.length > 0
	// 	) {
	// 		event.preventDefault();
	// 	}
	// }

	let highlightedIndex = -1;

	function handleKeyDown(event) {
		if (!showDropdown) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			highlightedIndex =
				(highlightedIndex + 1) % filteredCountries.length;
			scrollToHighlightedItem();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			highlightedIndex =
				(highlightedIndex - 1 + filteredCountries.length) %
				filteredCountries.length;
			scrollToHighlightedItem();
		} else if (event.key === "Enter") {
			event.preventDefault();
			if (highlightedIndex >= 0) {
				selectlocation(filteredCountries[highlightedIndex]);
			} else {
				selectlocation(filteredCountries[0]);
			}
			showDropdown = false;
			highlightedIndex = -1;
		}
	}

	$: isDetailsEmpty = trimmedDetails.length === 0;

	$: isDetailsCharsValid =
		/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(trimmedDetails) &&
		!/<[^>]*>/.test(trimmedDetails);

	$: isDetailsLengthValid =
		trimmedDetails.length >= 5 && trimmedDetails.length <= 500;

	function scrollToHighlightedItem() {
		const item = document.getElementById(
			`dropdown-item-${highlightedIndex}`,
		);
		if (item) item.scrollIntoView({ block: "nearest" });
	}
	function handleSubmit(event) {
		console.log("Form Validation Started");

		// Log the state of all fields
		console.log({
			number,
			email,
			fname,
			lname,
			company,
			details,
			role,
			reason,
			isChecked,
		});

		if (
			number?.length === 0 ||
			email.length === 0 ||
			fname.length === 0 ||
			fname.trim() === "" ||
			!/^[A-Za-z\s]+$/.test(fname) ||
			/<[^>]*>/.test(fname) ||
			fname.trim().length < 3 ||
			fname.trim().length > 50 ||
			(lname.trim().length > 0 && !/^[A-Za-z\s]+$/.test(lname)) ||
			(lname.trim().length > 0 && /<[^>]*>/.test(lname)) ||
			lname.trim().length > 50 ||
			(company.trim().length > 0 && company.trim().length < 3) ||
			company.trim().length > 100 ||
			!/^[A-Za-z0-9\s&-.,!@():;""'']*$/.test(company) ||
			/<[^>]*>/.test(company) ||
			(company.trim().length > 0 && Number.isInteger(Number(company))) ||
			details.length === 0 ||
			details.trim() === "" ||
			details.trim().length < 5 ||
			details.trim().length > 500 ||
			!/^[A-Za-z0-9\s&-.,!@():;""'']*$/.test(details) ||
			/<[^>]*>/.test(details) ||
			// role.length === 0 ||
			// role.trim() === "" ||
			!/^[A-Za-z0-9\s&-.,!@():;""'']*$/.test(role) ||
			/<[^>]*>/.test(role) ||
			(role.trim().length > 0 && role.trim().length < 3) ||
			role.trim().length > 150 ||
			/^\d+$/.test(role.trim()) ||
			reason.length === 0
		) {
			console.log("Validation failed: Missing required fields");
			event.preventDefault();
			formValid = false;
			showErrors = true;
		} else {
			console.log("Validation Passed");
			formValid = true;
			formSubmitted = true;
			showErrors = false;
		}

		if (!formValid) {
			event.preventDefault();
		}
	}

	function showPopup() {
		console.log("Attempting to show CAPTCHA Popup...");

		// Log the state of CAPTCHA and form validation
		console.log({ showCaptchaPopup, formValid, isCheckedcap });

		if (!showCaptchaPopup) {
			// Only show CAPTCHA if needed
			console.log("Displaying CAPTCHA Popup");
			showCaptchaPopup = true;
			captchaUtils.reset();
			captchaUtils.generateMathQuestion();
			captchaState = captchaUtils.getState();
			generateMathQuestion();
		}
	}
		function forceStateUpdate() {
		captchaState = { ...captchaUtils.getState() };
	}

	function closeCaptcha() {
		console.log("Closing CAPTCHA Popup...");

		// Reset form state and CAPTCHA popup
		showCaptchaPopup = false;
		isCheckedcap = false; // Reset CAPTCHA state (if required)
		formValid = false; // Reset form validation state
		formSubmitted = false; // Reset form submission state
		showErrors = false; // Hide error messages
		console.log("State after closing CAPTCHA:", {
			showCaptchaPopup,
			formValid,
			isCheckedcap,
		});
	}

	// function handleSubmit(event) {
	// 	if (
	// 		number?.length === 0 ||
	// 		email.length === 0 ||
	// 		fname.length === 0 ||
	// 		fname.trim() === "" ||
	// 		!/^[A-Za-z\s]+$/.test(fname) ||
	// 		/<[^>]*>/.test(fname) ||
	// 		lname.length === 0 ||
	// 		lname.trim() === "" ||
	// 		!/^[A-Za-z\s]+$/.test(lname) ||
	// 		/<[^>]*>/.test(lname) ||
	// 		company.length === 0 ||
	// 		company.trim() === "" ||
	// 		company.trim().length < 3 || // ✅ Minimum 3 characters validation
	// 		!/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(company) ||
	// 		/<[^>]*>/.test(company) ||
	// 		details.length === 0 ||
	// 		details.trim() === "" ||
	// 		!/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(details) ||
	// 		/<[^>]*>/.test(details) ||
	// 		role.length === 0 ||
	// 		role.trim() === "" ||
	// 		!/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(role) ||
	// 		/<[^>]*>/.test(role) ||
	// 		reason.length === 0 ||
	// 		!isChecked
	// 	) {
	// 		console.log("Validation failed: Missing required fields");
	// 		event.preventDefault();
	// 		formValid = false;
	// 		showErrors = true;
	// 	} else {
	// 		formValid = true;
	// 		formSubmitted = true;
	// 		showErrors = false;
	// 	}
	// 	if (!formValid) {
	// 		event.preventDefault();
	// 	}
	// }
	// function showPopup() {
	// 	if (isCheckedcap) {
	// 		showCaptchaPopup = true;
	// 		generateMathQuestion();
	// 	}
	// }

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
			isCheckedcap = true;
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
			}, 50);
		} else {
			successMessage = "";
			errorMessagecap = "Incorrect answer, try again.";
			isCheckedcap = false;

			setTimeout(() => {
				generateMathQuestion();
				userAnswer = "";
				errorMessagecap = "";
			}, 4000);
		}
	}
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
	// function refreshMathQuestion() {
	// 	rotationClass = "rotate-[360deg]";

	// 	setTimeout(() => {
	// 		generateMathQuestion();
	// 		rotationClass = "";
	// 	}, 1000);
	// }

	$: trimmedRole = role.trim();
	$: isRoleLengthValid = trimmedRole.length >= 3 && trimmedRole.length <= 150;
	$: isRoleNotOnlyNumbers =
		!Number.isInteger(Number(trimmedRole)) || trimmedRole === "";

	$: isRoleCharsValid =
		/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(trimmedRole) &&
		!/<[^>]*>/.test(trimmedRole);

	$: isValidRole =
		isRoleLengthValid && isRoleCharsValid && isRoleNotOnlyNumbers;
	$: trimmedDetails = details.trim();
	$: isValidDetails =
		trimmedDetails.length >= 5 && trimmedDetails.length <= 500;
	function refreshMathQuestion() {
		// Prevent refresh if already submitting or verifying
		if (captchaState.isSubmitting || captchaState.isVerified) return;

		// Clear any existing answers and errors
		captchaUtils.reset();

		// Generate new question
		captchaUtils.generateMathQuestion();

		// Force state update
		captchaState = captchaUtils.getState();

		// Clear user input
		if (captchaState.userAnswer) {
			captchaState.userAnswer = "";
		}

		// Force a tick to ensure UI updates
		setTimeout(() => {
			captchaState = captchaUtils.getState();
		}, 0);
	}
	// function refreshMathQuestion(event) {
	// 	if (event) {
	// 		event.preventDefault();
	// 		event.stopPropagation();
	// 	}

	// 	rotationClass = "rotate-[360deg]";

	// 	setTimeout(() => {
	// 		generateMathQuestion();
	// 		rotationClass = "";
	// 		userAnswer = ""; // Clear the previous answer when refreshing
	// 		errorMessagecap = ""; // Clear any error messages
	// 		successMessage = ""; // Clear any success messages
	// 	}, 1000);
	// }
	function carrnchange() {
		carrn = true;
	}
	$: disabled = location.length === 0;
	// function onInputChange() {
	// 	if (userAnswer.trim()) {
	// 		validateMathCaptcha();
	// 	} else {
	// 		errorMessagecap = "";
	// 	}
	// }
	let showdisErrors = false;
	let showdatErrors = false;

	// function onInputChange() {
	// 	// Just clear the error message when typing, don't validate yet
	// 	if (errorMessagecap && userAnswer.trim()) {
	// 		errorMessagecap = "";
	// 	}
	// }
		function onInputChange() {
		// Don't process if already submitting
		if (captchaState.isSubmitting) return;

		const isValid = captchaUtils.setUserAnswer(captchaState.userAnswer);
		captchaState = captchaUtils.getState();

		if (isValid) {
			if (captchaUtils.startSubmission()) {
				const interval = setInterval(() => {
					progress += 5;
					if (progress >= 96) {
						// Fixed assignment operator
						clearInterval(interval);
					}
				}, 500);
				captchaState = captchaUtils.getState();
				setTimeout(() => {
					submitFormAutomatically();
				}, 2000);
			}
		}
	}
	function verifyCaptcha() {
		if (userAnswer.trim()) {
			validateMathCaptcha();
		} else {
			errorMessagecap = "Please answer the question";
		}
	}
	// function closeCaptchaPopup() {
	// 	showCaptchaPopup = false;

	// 	userAnswer = "";

	// 	if (successMessage) {
	// 		isChecked = true;
	// 	} else {
	// 		isChecked = true;
	// 	}
	// }
		function closeCaptchaPopup() {
		showCaptchaPopup = false;

		if (!captchaState.isVerified && !captchaState.isSubmitting) {
			captchaUtils.reset();
			captchaState = captchaUtils.getState();
			isChecked = false;
		}

		setTimeout(() => {
			if (!showCaptchaPopup) {
				captchaUtils.completeSubmission();
				captchaState = captchaUtils.getState();
			}
		}, 1000);
	}

	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		const messageContainer = document.querySelector(".message-container");
		if (messageContainer) {
			setTimeout(() => {
				messageContainer.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
		if (keywordError === "success") {
			setTimeout(() => {
				resetForm();
			}, 2000);
		}
	}

	function validatePhoneNumber(location, number) {
		const pattern = phoneNumberPatterns[location];
		if (!pattern) {
			console.warn(
				`No validation pattern found for location: ${location}`,
			);
			return false;
		}
		return pattern.test(number);
	}

	let loadingotp = false;
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
		}
	};
	let searchTerm = "";
	let filteredCountries = countries;

	function filterCountries() {
		filteredCountries = countries.filter(
			(location) =>
				location.name
					.toLowerCase()
					.startsWith(searchTerm.toLowerCase()) ||
				location.code
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
			selectlocation(filteredCountries[0]);
		} else {
			showDropdown = filteredCountries.length > 0;
		}
	}
	function selectlocation(selectedlocation) {
		location = selectedlocation.name;
		searchTerm = `${selectedlocation.name} `;
		showDropdown = false;
		validatePhoneNumber(location, number);
		delete errors.location;
	}
	function filterCountriesWithoutAutoSelect() {
		filteredCountries = countries.filter(
			(country) =>
				country.name
					.toLowerCase()
					.startsWith(searchTerm.toLowerCase()) ||
				country.code
					.replace("+", "")
					.includes(searchTerm.replace("+", "").toLowerCase()),
		);
	}

	function handleInputChange(event) {
		searchTerm = event.target.value;
		const isDeleting =
			event.inputType === "deleteContentBackward" ||
			event.inputType === "deleteContentForward";

		if (searchTerm.length > 0 && !isDeleting) {
			filterCountriesWithoutAutoSelect();
			showDropdown = true; // Always show, even if no matches

			const codeSearch = searchTerm.replace("+", "").trim();
			if (codeSearch.length > 0) {
				const exactCodeMatches = filteredCountries.filter(
					(country) => country.code.replace("+", "") === codeSearch,
				);

				if (exactCodeMatches.length === 1) {
					selectlocation(exactCodeMatches[0]);
					return;
				}
			}

			const countriesStartingWith = filteredCountries.filter((country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
			);

			if (countriesStartingWith.length === 1) {
				selectlocation(countriesStartingWith[0]);
			}
		} else {
			filterCountriesWithoutAutoSelect();
			showDropdown = true; // Keep it open regardless
		}
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// function handleClickOutside(event) {
	// 	if (!event.target.closest(".dropdown-container")) {
	// 		showDropdown = false;
	// 	}
	// }
	// function handleFocus() {
	// 	showErrors = false;
	// }

	let countryDropdownRef;

	function handleFormClick(event) {
		const isInCountry = countryDropdownRef?.contains(event.target);
		if (!isInCountry) {
			showDropdown = false;
		}
	}

	// $: if (location && phone) {
	// 	validateField("phone");
	// }
</script>

{#if showSuccesDiv}
	<div
		class="mb-4 w-full flex items-center justify-center mx-auto max-w-7xl p-4"
	>
		<div
			class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg"
		>
			<h3 class="md:text-xl text-lg font-semibold text-green-600 mb-4">
				Chemikart Solution Submission
			</h3>
			<p class="md:text-md text-xs text-gray-700 mt-4 mb-6">
				Thank you for reaching out! We have received your inquiry and
				will get back to you with a customized solution shortly.
			</p>
			<div class="w-10/12 mx-auto my-6 border-t-1 border-green-300"></div>
			<div class="flex items-center justify-center">
				<a
					href="/"
					class="bg-white text-primary-500 border-1 border-primary-500 px-4 py-2 rounded-md font-medium hover:bg-primary-500 hover:text-white transition-all duration-300 flex justify-center items-center"
				>
					<Icon icon="mdi:home" class="text-xl mr-2" />Back to Home
				</a>
			</div>
		</div>
	</div>
{:else if showFailureDiv}
	<div
		class="pb-20 pt-20 h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10 sm:text-sm text-xs"
	>
		<div
			class="w-10/12 md:w-8/12 bg-gradient-to-r from-red-100 via-red-50 to-red-100 p-8 rounded-lg shadow-lg text-center"
		>
			<p class="sm:text-md text-sm text-gray-700 mb-6">
				There was an issue with submitting the form. Please try again
				after a while.
			</p>

			<div class="w-10/12 mx-auto my-6 border-t-2 border-red-300"></div>
			<div>
				<a
					href="/feedback"
					class="sm:text-sm text-xs bg-white text-primary-500 border border-primary-500 px-4 py-2 rounded-md hover:bg-primary-500 hover:text-white transition"
				>
					Report Issue
				</a>
			</div>
		</div>
	</div>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<section
		class="md:w-11/12 mx-auto max-w-7xl bg-gray-50 sm:pb-0 px-2 pb-10"
		on:click={handleFormClick}
	>
		<section>
			<div class="font-bold text-xl text-gray-700 md:text-2xl pb-4">
				Chemikart Solutions
			</div>
			<p
				class="sm:text-sm text-xs leading-6 text-content mx-auto text-justify-center"
			>
				We offer a full range of e-Commerce tools designed to enable
				greater spend control for your procurement staff, providing your
				researchers with ease of access to the products they've come to
				rely on.
			</p>
			<p
				class="sm:text-sm text-xs leading-6 text-content mx-auto text-justify-center mt-2"
			>
				We have three solutions available to help you save time and cost
				in procurement management. Read further for more details of each
				solution, or fill out our contact form and our team will reach
				out to you to answer any questions.
			</p>
			<div class="md:mt-12 mt-2 mx-auto">
				<div
					class="flex gap-5 flex-wrap lg:flex-nowrap max-md:flex-col"
				>
					<div class="w-full lg:w-3/5">
						<div class="space-y-10 md:space-y-8 max-md:space-y-6">
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="game-icons:on-target"
									class="w-10 h-10 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold font-worksans sm:text-base text-sm text-heading"
									>
										The One-to-One Solution: E-Procurement
									</h2>
									<p
										class="sm:text-sm text-xs text-content mt-4"
									>
										e-Procurement provides seamless
										system-to-system connectivity of your
										existing spend management system.
									</p>
								</div>
							</div>
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="mdi:family-tree"
									class="w-10 h-8 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold font-worksans sm:text-base text-sm text-heading"
									>
										The Customized Solution: Pipeline®
									</h2>
									<p
										class="sm:text-sm text-xs text-content mt-4"
									>
										This customized service balances your
										organization's business needs with the
										product requirements of your
										researchers.
									</p>
								</div>
							</div>
							<div
								class="flex flex-col md:flex-row items-start gap-4"
							>
								<Icon
									icon="fluent-mdl2:text-document-shared"
									class="w-10 h-8 text-primary-400 flex-shrink-0"
								/>
								<div class="flex-auto">
									<h2
										class="font-semibold font-worksans sm:text-base text-sm text-heading"
									>
										The Simple Solution: Chemikart E-Shop
									</h2>
									<p
										class="sm:text-sm text-xs text-content mt-4"
									>
										Your procurement staff can access our
										products simply, easily, and securely
										through chemikart.com.
									</p>
								</div>
							</div>
						</div>
					</div>
					<aside
						class="w-full lg:w-1/3 md:ml-0 lg:ml-8 max-md:w-full"
					>
						<div
							class="flex flex-col items-start space-y-5 text-black"
						>
							<Icon
								icon="game-icons:chemical-drop"
								class="w-20 h-24 text-primary-400"
							/>
							<p class="sm:text-sm text-xs text-content">
								Discover our latest website features and enhance
								your experience with Chemikart.<br />Find
								information regarding new features as well as
								tips and tricks with Get Site Smart.
							</p>
							<div class="mt-8"></div>
						</div>
					</aside>
				</div>
			</div>
		</section>
		<section class="mx-1 md:mx-1">
			<hr
				class="self-center md:mt-10 h-px w-full border border-black border-opacity-40 max-md:mt-3"
			/>
		</section>
		<section class="px-4 mt-4">
			<div class="flex gap-8 max-md:flex-col">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<div
						class="flex flex-col text-sm leading-6 text-black max-md:mt-0"
					>
						<h3
							class="font-semibold font-worksans mt-8 sm:text-base text-sm text-heading"
						>
							The One-to-One Solution: E-Procurement
						</h3>
						<p class="sm:text-sm text-xs mt-4 text-content">
							Chemikart is your source for procurement
							optimization. If you are already using an electronic
							spend management solution, leverage your investment
							to generate even greater savings by automating
							Chemikart's purchases and link your current buying
							platform to us.
						</p>
						<p class="sm:text-sm text-xs mt-4 text-content">
							We support all major e-Procurement providers and
							have a dedicated technical team available to work
							with your organization or platform provider and
							install customized, scalable, all-in-one procurement
							solutions. e-Procurement offers efficiencies across
							the purchasing cycle, enabling product selection
							through e-Catalogs, both punchout or hosted file,
							accepting e-Purchase orders, sending electronic
							invoices, order confirmations, and advanced shipping
							notices, and more.
						</p>
						<h4
							class="mt-6 font-semibold font-worksans sm:text-base text-sm text-heading"
						>
							Three Steps to Install e-Procurement
						</h4>
						<ol
							class="list-decimal list-inside mt-4 space-y-3 sm:text-sm text-xs text-content"
						>
							<li>
								Create a Project Plan: We will partner with you
								to gather requirements, provide detailed
								analysis, then implement a project plan with
								milestones.
							</li>
							<li>
								Setup & Testing: We will work through setup and
								testing to ensure end-to-end processes are in
								place.
							</li>
							<li>
								Launch and Go-Live Monitoring: After testing, we
								provide post-go-live monitoring to ensure the
								solution meets your expectations.
							</li>
						</ol>
					</div>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-0">
					<h3
						class="font-semibold font-worksans mt-8 sm:text-base text-sm text-heading"
					>
						Benefits to e-Procurement
					</h3>
					<ol
						class="list-decimal list-inside mt-4 space-y-3 sm:text-sm text-xs text-content"
					>
						<li>
							Process efficiency from end-to-end driven by
							real-time data exchange, speed, and transaction
							efficiency.
						</li>
						<li>
							Cost Reduction via reduced transaction costs and
							administrative overhead.
						</li>
						<li>
							A variety of spend analysis options and direct spend
							control.
						</li>
						<li>
							Automated transactions increase productivity through
							improved order handling accuracy, paperless
							invoicing, and faster procure-to-pay cycles.
						</li>
						<li>
							Global approach and management of scale, harmonized
							for all your sites.
						</li>
					</ol>
					<a href="#contact-team"> </a>
				</div>
			</div>
			<div class="flex gap-8 max-md:flex-col md:mt-8 mt-3">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<h3
						class="font-semibold font-worksans mt-8 sm:text-base text-sm text-heading"
					>
						The Customized Solution: Pipeline®
					</h3>
					<p class="sm:text-sm text-xs mt-4 text-content">
						An advanced ordering process customized to meet your
						business needs. PIPELINE® delivers options and benefits
						beyond simple ordering, providing direct, private
						connection to our order processing and fulfillment
						system. Flexible ordering processes are customized to
						meet your organization's requirements.
					</p>
					<p class="sm:text-sm text-xs mt-4 text-content">
						When you create your order through PIPELINE®, you see
						the exact purchase total. In addition, it provides a
						portal to information and special offers that have been
						tailored specifically for your organization.
					</p>
					<p class="sm:text-sm text-xs mt-4 text-content">
						To learn more about creating your PIPELINE® experience,
						submit the form to have one of our team members reach
						out.
					</p>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-0">
					<h4
						class="font-semibold font-worksans mt-8 sm:text-base text-sm text-heading"
					>
						Benefits of PIPELINE®
					</h4>
					<ul
						class="list-disc list-inside md:mt-4 mt-3 space-y-2 sm:text-sm text-xs text-content"
					>
						<li>Elimination of paper transactions</li>
						<li>No IT investment required</li>
						<li>Support of procurement approval levels</li>
						<li>
							Real-time product availability with contract pricing
						</li>
						<li>Customized invoicing and payment</li>
						<li>Streamlined reconciliation process</li>
					</ul>
					<a href="#contact-team"> </a>
				</div>
			</div>
			<div class="flex gap-8 max-md:flex-col md:mt-8 mt-3">
				<div class="flex flex-col w-2/3 max-md:w-full">
					<h3
						class="font-semibold font-worksans mt-6 sm:text-base text-sm text-heading"
					>
						The Simple Solution: Chemikart E-Shop
					</h3>
					<p class="sm:text-sm text-xs mt-4 text-content">
						Your online order is integrated with our fulfillment
						systems, allowing for rapid processing. You can request
						quotes, place orders, and track deliveries all in one
						place.
					</p>
					<p class="sm:text-sm text-xs mt-4 text-content">
						With Chemikart.com as the leading Web site in the
						industry, you can rest assured you're getting the most
						competitive service available.
					</p>
				</div>
				<div class="flex flex-col w-1/3 max-md:w-full max-md:mt-0">
					<h4
						class="font-semibold font-worksans mt-6 sm:text-base text-sm text-heading"
					>
						Benefits of the Chemikart e-Shop:
					</h4>
					<ul
						class="list-disc list-inside md:mt-4 mt-3 space-y-2 sm:text-sm text-xs text-content"
					>
						<li>Your information is safe and secure</li>
						<li>Advanced tools and product searches</li>
						<li>Account-specific pricing</li>
						<li>e-Quotes converted directly to orders</li>
					</ul>
					<a href="#contact-team"> </a>
				</div>
			</div>
		</section>
		<section class="mx-1 md:mx-1">
			<hr
				class="self-center md:mt-10 h-px w-full border border-black border-opacity-40 max-md:mt-3"
			/>
		</section>
		<section
			id="contact-team"
			class="flex flex-col items-start py-3 w-full max-md:px-2 md:mt-4 scroll-smooth"
		>
			<h2
				class="font-semibold font-worksans sm:text-lg text-md text-gray-700 sm:ml-3 ml-0"
			>
				Contact Our Team
			</h2>
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<form
				method="POST"
				action="?/ecommerce"
				bind:this={form}
				class="w-full md:mt-3 mt-0 max-w-3xl sm:ml-3 ml-0"
				use:enhance={({ event, formData }) => {
					formData.append("email", email);
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
						setTimeout(() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}, 100);
					};
				}}
				on:keydown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
					}
				}}
			>
				<div>
					<p
						class="mb-5 mt-6 text-bold font-semibold sm:text-base text-sm text-heading"
					>
						Select all that apply
					</p>
				</div>
				<div>
					<div class="flex items-center space-x-2 text-lg">
						<input
							id="questionCheckbox"
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
							value="I have a question about an existing B2B connection "
						/>
						<label
							for="questionCheckbox"
							class="mb-5 text-xs cursor-default select-none"
						>
							I have a question about an existing B2B connection.
						</label>
					</div>
					<div class="flex items-center space-x-2 text-lg">
						<input
							id="infoCheckbox1"
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
							value="I would like to have more information about B2B solutions"
						/>
						<label
							for="infoCheckbox1"
							class="mb-5 text-xs cursor-default select-none"
						>
							I would like to have more information about B2B
							solutions
						</label>
					</div>

					<div class="flex items-center space-x-2 text-lg">
						<input
							id="infoCheckbox2"
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
							value="I would like to be contacted about setting up a B2B connection"
						/>
						<label
							for="infoCheckbox2"
							class="mb-5 text-xs cursor-default select-none"
						>
							I would like to be contacted about setting up a B2B
							connection
						</label>
					</div>

					<div class="flex items-center space-x-2 text-lg">
						<input
							id="infoCheckbox3"
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
							value="I would like to know if there is an existing B2B connection for my organization"
						/>
						<label
							for="infoCheckbox3"
							class="mb-5 text-xs cursor-default select-none"
						>
							I would like to know if there is an existing B2B
							connection for my organization
						</label>
					</div>

					<div class="flex items-center space-x-2 text-lg">
						<input
							id="infoCheckbox4"
							type="checkbox"
							bind:group={selectedNames}
							class="w-4 h-4 mb-5 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
							value="I have another question (fill in Additional details)"
						/>
						<label
							for="infoCheckbox4"
							class="mb-5 text-xs cursor-default select-none"
						>
							I have another question (fill in Additional details)
						</label>
					</div>
				</div>
				<div>
					<label class=" items-center space-x-2 hidden">
						<input
							type="checkbox"
							name="query"
							bind:value={reason}
							bind:checked={isChecked}
							class="w-4 h-4 ml-1 form-checkbox rounded-sm text-primary-400 focus:outline-none focus:ring-0 cursor-pointer"
						/>
						<span class=" text-xs">
							I confirm that I have selected the correct queries</span
						>
					</label>
					{#if showErrors && reason.length === 0}
						<span
							class="text-red-500 sm:text-xs text-2s font-medium"
						>
							Please select one of the above reasons</span
						>
					{/if}

					<input type="hidden" name="status" value="unread" />
				</div>
				<div
					class="w-full mt-3 max-w-full sm:max-w-lg md:max-w-3xl overflow-hidden"
				>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="fname"
								id="fname"
								bind:value={fname}
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="First Name*"
								on:input={() => {
									fname = fname.trimStart(); // Update value reactively

									if (!fname) {
										errors = { ...errors, name: "" };
									} else if (!/^[A-Za-z\s]+$/.test(fname)) {
										errors = {
											...errors,
											name: "First Name should contain only letters and spaces",
										};
									} else if (
										fname.trim().length < 3 ||
										fname.trim().length > 50
									) {
										errors = {
											...errors,
											name: "First name Name must be between 3 and 50 characters",
										};
									} else {
										const { name, ...rest } = errors;
										errors = rest; // Remove error when valid
									}
								}}
							/>
							{#if errors?.name}
								<span class="text-red-500 text-xs">
									{errors.name}
								</span>
							{/if}
							{#if showErrors && !fname}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									*Required
								</span>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="lname"
								id="lname"
								bind:value={lname}
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="Last Name"
								on:input={() => {
									lname = lname.trimStart(); // Optional: trim leading spaces

									if (lname.trim() === "") {
										const { lname, ...rest } = errors;
										errors = rest; // Clear any last name errors if field is empty (optional)
									} else if (!/^[A-Za-z\s]+$/.test(lname)) {
										errors = {
											...errors,
											lname: "Last Name should contain only letters and spaces",
										};
									} else if (lname.trim().length > 50) {
										errors = {
											...errors,
											lname: "Last Name must be less than 50 characters",
										};
									} else {
										const { lname, ...rest } = errors;
										errors = rest; // Clear error if valid
									}
								}}
							/>

							{#if errors?.lname}
								<span class="text-red-500 text-xs">
									{errors.lname}
								</span>
							{/if}
							<!-- {#if showErrors && !lname}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Last Name is required.
								</span>
							{/if} -->
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 relative w-full">
							<div
								class="relative"
								bind:this={countryDropdownRef}
							>
								<div
									class="flex items-center relative overflow-hidden w-full bg-gray-50"
								>
									<input
										type="text"
										id="location"
										name="location"
										bind:value={location}
										placeholder="Location*"
										on:input={handleInputChange}
										on:click={toggleDropdown}
										on:keydown={handleKeyDown}
										on:input={() => {
											const trimmedLocation =
												location.trim();
											location = trimmedLocation;
										}}
										class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
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
										style:transform={showDropdown
											? "rotate(180deg)"
											: "rotate(0deg)"}
										on:click={toggleDropdown}
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
							{#if showDropdown}
								<div
									class="absolute w-full bg-white border border-gray-300 rounded-md-md shadow-lg z-10 mt-1"
								>
									<ul
										class="max-h-60 overflow-y-auto sm:text-sm text-xs"
									>
										{#each filteredCountries as location, index (location.name)}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

											<li
												id={`dropdown-item-${index}`}
												class="px-4 py-2 cursor-pointer {highlightedIndex ===
												index
													? 'bg-primary-100'
													: 'hover:bg-primary-50'}"
												on:click={() =>
													selectlocation(location)}
											>
												{location.name} ({location.code})
											</li>
										{/each}
										{#if filteredCountries.length === 0}
											<div
												class="px-4 py-2 text-gray-600 text-xs"
											>
												No matching countries found!
											</div>
										{/if}
									</ul>
								</div>
							{/if}
							{#if showErrors && location.length === 0}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
									>*Required</span
								>
							{/if}

							{#if filteredCountries.length === 0}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
									>No matching countries found!</span
								>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="tel"
								name="number"
								id="number"
								bind:value={number}
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="Phone Number*"
								disabled={!location}
								on:mouseenter={() => (hovered = true)}
								on:mouseleave={() => (hovered = false)}
								on:input={() => {
									number = number.trim();
								}}
							/>

							{#if showErrors && !number}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									*Required
								</span>
							{:else if !location && hovered}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Please select your country before entering
									Number
								</span>

								<!-- {:else if number?.length > 0 && !validatePhoneNumber(location, number) && (showErrors || dirty)} -->
							{:else if number?.length > 0 && !validatePhoneNumber(location, number)}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									{#if filteredCountries.find((c) => c.name === location)}
										Please enter a valid phone number for {location}
									{:else}
										First select a valid country from the
										dropdown
									{/if}
								</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="company"
								id="company"
								bind:value={company}
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="Company Name"
								on:input={() => {
									company = company.trimStart(); // Avoid leading spaces

									if (
										company.trim().length > 0 &&
										(company.trim().length < 3 ||
											company.trim().length > 100)
									) {
										errors = {
											...errors,
											company:
												"Company Name must be between 3 and 100 characters",
										};
									} else if (
										Number.isInteger(Number(company))
									) {
										errors = {
											...errors,
											company:
												"Company name cannot contain only numbers. Please include letters as well.",
										};
									} else if (
										!/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(
											company,
										)
									) {
										errors = {
											...errors,
											company:
												"Invalid characters in Company Name",
										};
									} else if (/<[^>]*>/.test(company)) {
										errors = {
											...errors,
											company:
												"Company Name should not contain HTML tags",
										};
									} else {
										const { company, ...rest } = errors;
										errors = rest; // Clear error if valid
									}
								}}
							/>
							<!-- {#if showErrors && company.length === 0}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Company is required
								</span>
							{/if} -->
							{#if errors?.company}
								<span class="text-red-500 text-xs">
									{errors.company}
								</span>
							{/if}
						</div>
						<div class="flex-1 mb-4 sm:w-full">
							<input
								type="text"
								name="role"
								id="role"
								bind:value={role}
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="Role"
								on:input={() => {
									role = role.trimStart();
									showdisErrors = true;
								}}
							/>

							{#if showdisErrors && !isRoleCharsValid}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Only letters, numbers, and valid symbols (&
									- . , ! @ ( ) : ; " ') are allowed.
								</span>
							{:else if showdisErrors && !isRoleLengthValid}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Must be between 3 and 150 characters.
								</span>
							{:else if showdisErrors && !isRoleNotOnlyNumbers}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Role cannot contain only numbers, Please
									include letters as well.
								</span>
							{/if}

							<!-- {#if showErrors && role.length === 0}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									*Required
								</span>
							{/if}			 -->
						</div>
					</div>
					<div class="flex flex-col md:flex-row md:space-x-4">
						<div class="flex-1 mb-4 sm:w-full">
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
								use:enhance={({ formData }) => {
									formData.append("email", email);
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
								class="flex w-full items-center"
								on:submit={() => {
									isLoading = true;
								}}
							>
								<div class="relative w-full">
									<input
										type="text"
										name="email"
										maxlength="100"
										id="email"
										bind:value={email}
										class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
										placeholder="Email*"
										on:input={() => {
											email = email.trim();

											ProfileEmailVerified = false;
											emailSent = false;
											authedUserEmailVerified = false;
										}}
									/>
									{#if showErrors && email.length === 0}
										<span
											class="text-red-500 sm:text-xs text-2s font-medium"
											>*Required</span
										>
									{/if}
									{#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
										<span
											class="text-red-500 sm:text-xs text-2s font-medium"
											>Please enter a valid email address.</span
										>
									{/if}
									{#if isLoading}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
										>
											<Icon
												icon="line-md:loading-alt-loop"
												class="w-4 h-4 mr-1"
											/>
											Verifying...
										</span>
									{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
										<button
											type="submit"
											class={`absolute right-2  transform -translate-y-1/2 text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed ${!showErrors ? "top-1/2" : "top-1/3"}`}
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
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
										>
											{#if isOtpVerified}
												<span
													class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
												>
													Verified
													<Icon
														icon="material-symbols:verified-rounded"
														class="w-4 h-4 ml-1"
													/>
												</span>
											{:else}
												<Icon
													icon="fluent:mail-all-read-16-filled"
													class="w-4  h-4 mr-1"
												/>
												Check your inbox
											{/if}
										</span>
									{:else}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
										>
											Verified
											<Icon
												icon="material-symbols:verified-rounded"
												class="w-4 h-4 ml-1"
											/>
										</span>
									{/if}
								</div>
							</form>
							{#if emailSent && isOtpVerified === false}
								<br />

								<form
									action="?/verifyOtpEmail"
									method="POST"
									use:enhance={({ formData }) => {
										formData.append("email", email);
										return async ({ result }) => {
											loadingotp = false;
											if (result.status === 200) {
												if (
													result.data.status === 200
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
														result.data.message ||
														"An unknown error occurred!";
													toast.error(errorMessage);
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
										loadingotp = true;
									}}
								>
									<div class="relative w-full">
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
											class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
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
											class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-600 font-bold text-2s py-1 rounded-md hover:underline"
											disabled={loadingotp}
										>
											{#if loadingotp}
												<span
													class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
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
									<div class="flex justify-end text-sm">
										<button
											type="button"
											on:click={handleResendOtpemail}
											disabled={loadingotp}
											class="text-sm text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Get a new code
										</button>
									</div>
								</form>
							{/if}
						</div>
					</div>
					<div class="flex-1 mb-4 sm:w-full">
						<textarea
							name="details"
							id="details"
							bind:value={details}
							class="w-full placeholder:text-xs text-sm px-2 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300 h-32"
							placeholder="Additional Details*"
							on:input={() => {
								const trimmedDetails = details.trimStart();
								details = trimmedDetails;
								showdatErrors = true;
							}}
						></textarea>
						{#if showErrors || showdatErrors}
							{#if isDetailsEmpty}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									*Required
								</span>
							{:else if !isDetailsCharsValid}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Invalid characters in Details
								</span>
							{:else if !isDetailsLengthValid}
								<span
									class="text-red-500 sm:text-xs text-2s font-medium"
								>
									Must be between 5 and 500 valid characters.
								</span>
							{/if}
						{/if}
					</div>
					<span class="flex-1 w-1/3 mb-4">
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
							<label
								class="flex mt-5 md:mt-6 items-center justify-end space-x-2 mb-4 cursor-pointer"
							>
								<input
									type="checkbox"
									name="captcha"
									value="captcha"
									class="w-5 h-5 border-2 border-gray-400 text-primary-600 focus:ring-primary-500 rounded cursor-pointer hover:border-primary-500 transition-colors duration-300"
									bind:checked={isCheckedcap}
									on:click={(event) => {
										event.preventDefault();
										handleSubmit(event);

										// Check form validation
										if (!formValid) {
											if (
												Object.keys(errors).length > 0
											) {
												toast.error(
													"Please fill all the required fields.",
												);
											}
											isCheckedcap = false;
											return;
										}

										// Check email verification
										if (
											!(
												ProfileEmailVerified ||
												authedUserEmailVerified === true
											)
										) {
											toast.error(
												"Please verify your email to proceed",
											);
											isCheckedcap = false;
											return;
										}

										// All checks passed
										// isCheckedcap = true;

										// Make sure showPopup is defined
										showPopup();
									}}
									on:keydown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault();
										}
									}}
								/>
								<span class="text-gray-600 font-medium text-sm"
									>Please verify you are human</span
								>
							</label>
							<div
								class="mt-0 flex items-center justify-end gap-x-6"
							>
								<button
									type="submit"
									on:click={(event) => {
										console.log(
											"isCheckedcap",
											isCheckedcap,
										);
										handleSubmit(event);
										if (!isCheckedcap) {
											toast.error(
												"Please complete the CAPTCHA to proceed with the submission.",
											);
											event.preventDefault();
											return;
										}
									}}
									on:keydown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault();
										}
									}}
									class="sm:px-5 px-2 sm:py-2 py-1 bg-primary-500 text-white sm:text-md text-sm rounded-md transition duration-300 hover:bg-primary-600 sm:w-auto font-semibold"
								>
									{#if submitting}
										Sending...
									{:else}
										Send Message
									{/if}
								</button>
							</div>
						</div>
					</span>
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
								class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-100"
								on:click|stopPropagation
							>
								<h2
									class="text-xl font-bold mb-6 text-gray-800 text-center"
								>
									Verify You're Human
								</h2>

								<div class="bg-gray-50 p-4 rounded-lg mb-6">
									<p
										class="flex items-center justify-between text-gray-700 font-medium"
									>
										<span class="text-lg"
											>{captchaState.mathQuestion}</span
										>
										<button
											class="ml-4 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-all duration-300 {submittingForm
												? 'opacity-50 cursor-not-allowed'
												: ''}"
											on:click={refreshMathQuestion}
											disabled={captchaState.isSubmitting ||
												captchaState.isVerified}
											title="Generate new question"
											type="button"
										>
											<Icon
												icon="ic:round-refresh"
												class={`w-5 h-5 text-primary-600 ${captchaState.rotationClass} ${captchaState.isSubmitting ? "" : "cursor-pointer hover:scale-110"} transition transform ${rotationClass}`}
											/>
										</button>
									</p>
								</div>

								<div class="mb-6">
									<input
										type="text"
										bind:value={captchaState.userAnswer}
										placeholder="Your Answer"
										class="border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none transition-all"
										on:input={onInputChange}
										readonly={inputReadOnly}
										disabled={captchaState.isSubmitting ||
											captchaState.isVerified}
										autocomplete="off"
									/>

									{#if captchaState.errorMessage}
										<div
											class="flex mt-4 items-center space-x-2 text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse"
										>
											<Icon
												icon="mdi:alert-circle"
												class="w-5 h-5 flex-shrink-0 animate-bounce"
											/>
											<p class="text-sm font-medium">
												{captchaState.errorMessage}
											</p>
										</div>
									{/if}
									{#if captchaState.successMessage}
										<div
											class="flex mt-4 items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 animate-pulse"
										>
											<Icon
												icon="mdi:check-circle"
												class="w-5 h-5 flex-shrink-0 animate-bounce"
											/>
											<p class="text-sm font-medium">
												{captchaState.successMessage}
											</p>
										</div>
									{/if}
								</div>
								{#if captchaState.isSubmitting}
									<div class="mb-6">
										<!-- <div class="flex items-center justify-center space-x-3 py-4">
						<Icon
							icon="line-md:loading-alt-loop"
							class="w-6 h-6 animate-spin text-primary-600"
						/>

					</div> -->
										<div
											class="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden"
										>
											<div
												class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm animate-pulse"
												style="width: {progress}%"
											></div>
										</div>
									</div>
								{/if}
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
								{#if !captchaState.isVerified && !captchaState.isSubmitting}
									<button
										type="button"
										class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-500/50 group"
										on:click={onInputChange}
									>
										<div
											class="flex items-center justify-center space-x-2"
										>
											<Icon
												icon="mdi:shield-check"
												class="w-5 h-5 group-hover:animate-bounce"
											/>
											<span>Verify Answer</span>
										</div>
									</button>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</form>
			<Toaster position="bottom-right" richColors />
		</section>
	</section>
{/if}

<style>
	input:disabled {
		cursor: not-allowed;
	}
</style>
