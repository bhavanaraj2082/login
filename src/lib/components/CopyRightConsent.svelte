<script>
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { toast, Toaster } from "svelte-sonner";
    import Icon from "@iconify/svelte";
    import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
    export let data;
    // console.log(data, "i a consent");
    let submitting = false;
    let isChecked = false;
    let highlightedIndex = -1;
    let dropdownEl;
    let mathQuestion = "";
    let mathAnswer = 0;
    let userAnswer = "";
    let mathError = "";
    let submittingForm = false;
    let isLoadingemail = false;
    let progress = 0;
    let errorMessagecap = "";
    let inputReadOnly = false;
    let captchaToken = "";

    let isLoadingPhone = false;
    let isEmailVerified = false;
    let loadingotp = false;
    let submitLoading = false;
    let loadingPhone = false;
    let isLoading = false;
    let ProfileEmailVerified;
    let isDataAvailable = false;
    let isEditable = false;
    // console.log(data,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    let authedUserEmailVerified = data?.profile?.isEmailVerified;
    // console.log("authedUserEmailVerified", authedUserEmailVerified);

    let verificationMessage = "";
    let emailSent = false;
    let displayMessage = "";
    let enteredOtp = "";
    let enteredOtpemail = "";
    let isOtpVerified = false;
    let form3;
    let errorMessage = "";
    let rotationClass = "";
    let thankYouMessageVisible = false;
    let uploadOption = "";
    let email = "";
    let emailid = "";
    let showSuccesDiv = false;
    let showFailureDiv = false;
    let isValid = false;
    let emailError = "";
    let form;
    let captchaVerified = false;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    let title;
    let firstname = "";
    let lastname = "";
    let company = "";
    let errormessage = "";
    let phone = "";
    let message = "";
    let countrySelect;
    let street = "";
    let postalcode = "";
    let country = "";
    let city = "";
    let selectedFileName = "";
    let description = "";
    let url = "";
    let ExtractedData = null;
    let image = null;
    let fileName = "";
    let successMessage = "";
    let showCaptchaPopup = false;
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
                    // console.log("respose Status",data.status);
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
            }, 50);
        } else {
            successMessage = "";
            errorMessagecap = "Incorrect answer, try again.";
            isChecked = false;

            // setTimeout(() => {
            // 	generateMathQuestion();
            // 	userAnswer = '';
            // 	errorMessagecap = '';
            // 	// setActionMessage('Something went wrong while processing your message', false);
            // }, 4000);
        }
    }
    function handleClickOutside(event) {
        if (!event.target.closest(".dropdown-container")) {
            showDropdown = false;
        }
    }
    // function refreshMathQuestion() {
    // 	rotationClass = 'rotate-[360deg]';

    // 	setTimeout(() => {
    // 		generateMathQuestion();
    // 		rotationClass = '';
    // 	}, 1000);
    // }
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
    function showPopup() {
        if (isChecked) {
            showCaptchaPopup = true;
            generateMathQuestion();
        }
    }
    onMount(() => {
        if (data && data.profile) {
            firstname =
                `${data.profile.firstName || data?.authedUser?.username || ""} `.trim();
            lastname = `${data.profile.lastName || ""}`.trim();
            email = data.profile.email || "";
            phone = data.profile.cellPhone || "";
            company = data.profile.companyName || "";

            const profileCountry = data.profile.country?.trim();
            if (profileCountry) {
                const foundCountry = countries.find(
                    (c) =>
                        c.name.toLowerCase() === profileCountry.toLowerCase(),
                );
                if (foundCountry) {
                    country = foundCountry.name;
                }
            }

            isDataAvailable = true;
        } else {
            firstname = "";
            lastname = "";
            email = data?.email || "";
            phone = "";
            company = "";
            country = "";
            isDataAvailable = false;

            if (data?.email) {
                email = data.email;
                const reloadFlag = sessionStorage.getItem("emailReloaded");
                if (!reloadFlag) {
                    sessionStorage.setItem("emailReloaded", "true");
                    location.reload(); // This will reload the page only once to prevent infinite reload
                } else {
                    sessionStorage.removeItem("emailReloaded");
                }
            }
        }

        isEditable = false;
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });
    // function onInputChange() {
    // 	if (userAnswer.trim()) {
    // 		validateMathCaptcha();
    // 	} else {
    // 		errorMessagecap = '';
    // 	}
    // }
    function onInputChange() {
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

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFileName = file.name;

            if (file.type.startsWith("image/")) {
                fileName = "image";
                image = file;
                ExtractedData = null;
            } else {
                fileName = "ExtractedData";
                image = null;
            }

            if (file.size > maxFileSize) {
                alert("File is too large, maximum size is 25MB.");
                return;
            }

            if (
                file.type === "text/plain" ||
                file.type === "application/csv" ||
                file.type === "application/pdf"
            ) {
                const reader = new FileReader();
                reader.onload = () => {
                    let fileContent = reader.result;

                    fileContent = sanitizeFileContent(fileContent);
                    ExtractedData = fileContent;
                };

                reader.readAsText(file);
            }
        }
    }

    function sanitizeFileContent(content) {
        if (typeof content === "string") {
            const scriptRegex = /<script.*?>.*?<\/script>/gi;
            return content.replace(scriptRegex, "");
        }
        return content;
    }

    const handlesubmit = async (data) => {
        if (!formValid()) {
            cancel();
            return;
        }

        try {
            const result = await submitForm(data);
            console.log(result, "result");
            submitting = true;
            return async ({ result }) => {
                if (result.type === "success") {
                    form = result.data;
                    thankYouMessageVisible = true;
                    showSuccesDiv = true;
                    submitting = false;

                    showSuccesDiv = true;
                }
            };
        } catch (error) {
            console.error("Error submitting form:", error);
            // loading = false;
            showFailureDiv = true;
            submitting = false;
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

    const validateField = (fieldName) => {
        if (!fieldName || fieldName === "title") {
            if (!title) {
                errors = { ...errors, title: "* Required" };
            } else {
                const { title: _, ...rest } = errors;
                errors = rest;
            }
        }

        if (!fieldName || fieldName === "firstname") {
            if (!firstname) {
                errors.firstname = "* Required";
            } else if (firstname.length < 3) {
                errors.firstname = "First Name must be at least 3 characters";
            } else if (!/^[A-Za-z\s]+$/.test(firstname)) {
                errors.firstname = "Please enter a valid name";
            } else {
                delete errors.firstname;
            }
        }

        if (!fieldName || fieldName === "lastname") {
            if (!lastname || lastname.length === 0) {
                errors.lastname = "* Required";
            } else if (!/^[A-Za-z\s]+$/.test(lastname)) {
                errors.lastname = "Please enter a valid last name";
            } else {
                delete errors.lastname;
            }
        }

        if (!fieldName || fieldName === "company") {
            if (!company) {
                errors.company = "*Required";
            } else if (company.length < 3) {
                errors.company = "Company name must be at least 3 characters";
            } else if (!/^[A-Za-z0-9@.,\s&-]+$/.test(company)) {
                errors.company = "Please enter a valid company name";
            } else if (/^\d+$/.test(company)) {
                errors.company = "Company name cannot contain only numbers";
            } else {
                delete errors.company;
            }
        }

        if (!fieldName || fieldName === "street") {
            if (!street) {
                errors.street = "* Required";
            } else if (street.length < 3) {
                errors.street = "Street name must be at least 3 characters";
            } else if (/^[0-9\s]+$/.test(street)) {
                errors.street = "Street name cannot be only numbers";
            } else if (!/^[A-Za-z0-9@!#$%^&*(_).,:;'"+-\s]+$/.test(street)) {
                errors.street = "Please enter a valid street name";
            } else {
                delete errors.street;
            }
        }

        if (!fieldName || fieldName === "city") {
            if (!city) {
                errors.city = "* Required";
            } else if (city.length < 3) {
                errors.city = "City name must be at least 3 characters";
            } else if (/^[0-9\s]+$/.test(city)) {
                errors.city = "City name cannot be only numbers";
            } else if (!/^[A-Za-z0-9@!#$%^&*(_).,:;'"+-\s]+$/.test(city)) {
                errors.city = "Please enter a valid city name";
            } else {
                delete errors.city;
            }
        }

        if (!fieldName || fieldName === "postalcode") {
            if (!postalcode) {
                errors.postalcode = "* Required";
            } else if (!/^[0-9\s]+$/.test(postalcode)) {
                errors.postalcode = "Please enter a valid postal code";
            } else {
                delete errors.postalcode;
            }
        }

        if (!fieldName || fieldName === "email") {
            if (!email) {
                errors.email = "* Required";
            } else if (
                !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
            ) {
                errors.email = "Please enter a valid email address.";
            } else if (email.split("@")[1].includes("gamil")) {
                errors.email = "Email domain cannot be gmail.com.";
            } else {
                delete errors.email;
            }
        }

        if (!fieldName || fieldName === "description") {
            if (!description) {
                errors.description = "* Required";
            } else if (description.length < 3) {
                errors.description =
                    "Description name must be at least 3 characters";
            } else if (!/^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(description)) {
                errors.description = "Please enter a valid description";
            } else if (
                /<script.*?>.*?<\/script>/i.test(description) ||
                /<[^>]*>/i.test(description)
            ) {
                errors.description = "Please enter a valid description";
            } else {
                delete errors.description;
            }
        }

        if (!fieldName || fieldName === "country") {
            if (!country || country === "") {
                errors.country = "* Required";
            } else {
                delete errors.country;
            }
        }

        if (!fieldName || fieldName === "phone") {
            if (!phone) {
                errors.phone = "*Required";
                return;
            }
            if (!country) {
                errors.phone =
                    "Please select the country before entering the phone number";
                return;
            }
            if (!phone || phone === "") {
                errors.phone = "Required for the selected country";
            } else {
                const countryDetails = getCountryByCode(country);

                if (!countryDetails) {
                    errors.phone =
                        "Invalid country selected. Please reselect country.";
                    errors.country = "Invalid country selected";
                } else {
                    const phonePattern = getPhonePattern(country);
                    if (!phonePattern) {
                        errors.phone =
                            "Phone number pattern for country not found";
                    } else {
                        const phoneRegex = new RegExp(phonePattern);
                        if (!phoneRegex.test(phone)) {
                            const countryName =
                                countryDetails.name ||
                                country ||
                                "selected country";
                            errors.phone = `Please enter a valid phone number for ${countryName}.`;
                        } else {
                            delete errors.phone;
                        }
                    }
                }
            }
        }
        if (Object.keys(errors).length > 0) {
            isValid = false;
        }
    };

    function formValid() {
        console.log("Errors before validation:", errors);
        validateField("title");
        validateField("firstname");
        validateField("lastname");
        validateField("email");
        validateField("phone");
        validateField("country");
        validateField("description");
        validateField("street");
        validateField("city");
        validateField("company");

        const isEmailVerified = ProfileEmailVerified;

        const isValid =
            Object.keys(errors).length === 0 &&
            (isEmailVerified || authedUserEmailVerified === true);
        console.log(isValid, "iujdiuhdi");
        console.log(errors, "after validation");

        return isValid;
    }

    let errors = {};

    let searchTerm = "";
    // function selectCountry(selectedCountry) {
    //     country = selectedCountry.name;
    //     searchTerm = selectedCountry.name;
    //     showDropdown = false;
    //     highlightedIndex = -1;
    //     validateField("country");
    //     validatePhoneNumber(country, phone);

    //     delete errors.country;
    //     const countryInput = document.querySelector('input[name="country"]');
    //     if (countryInput) {
    //         countryInput.value = selectedCountry.name;
    //     }
    //     if (!phone || phone === "") {
    //         errors.phone = "Required for the selected country.";
    //     } else {
    //         delete errors.phone; // Remove any errors if conditions are satisfied
    //     }
    // }

    function selectCountry(selectedCountry) {
        country = selectedCountry.name;
        searchTerm = selectedCountry.name;
        showDropdown = false;
        highlightedIndex = -1;
        validateField("country");
        validatePhoneNumber(country, phone);
        // validateField('phone');

        delete errors.country;
        const countryInput = document.querySelector('input[name="country"]');
        if (countryInput) {
            countryInput.value = selectedCountry.name;
        }
        // if (!phone || phone === '') {
        // 	errors.phone = 'Required for the selected country.';
        // } else {
        // 	delete errors.phone;
        // }
    }

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
            } else if (searchTerm) {
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

    function validatePhoneNumber(countryCode, phone) {
        if (!phone || !countryCode || phone.trim() === "") {
            // errors.contactNumber = `*Required`;
            return false;
        }

        const country = getCountryByCode(countryCode);

        // console.log('Validating phone number for country:', country);

        if (!country) {
            errors.phone = "Invalid country selected";
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
    const handleResendOtpemail = () => {
        if (!loadingotp) {
            form3.requestSubmit();
            // startTimer();
        }
    };
</script>

{#if showSuccesDiv}
    <div
        class="mb-4 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl p-4"
    >
        <!-- <div class="w-10/12 md:w-8/12 bg-gradient-to-r from-green-100 via-green-50 to-green-100 p-8 rounded-lg shadow-lg text-center"> -->
        <div
            class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg"
        >
            <h3 class="md:text-xl text-lg font-semibold text-green-600 mb-4">
                Copyright Consent Form Submission
            </h3>
            <p class="md:text-md text-xs text-gray-700 mt-4 mb-6">
                Thank you for submitting your copyright consent form ! <br />
                We have received your information and will process it shortly.
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
    <div class="lg:w-11/12 max-w-7xl px-3 mx-auto mb-8">
        <div
            class="bg-white mx-auto shadow rounded-lg lg:w-full w-11/12 py-6 px-4 md:px-8 lg:px-10"
        >
            <h1
                class="sm:text-3xl text-xl font-bold mb-6 mt-3 text-center text-gray-800"
            >
                Copyright Consent
            </h1>

            <div
                class="bg-primary-50 border-l-4 border-primary-400 p-4 mb-6 rounded-r"
            >
                <p class="mb-2 sm:text-sm text-xs text-gray-700">
                    In case you are requesting our consent to use copyrighted
                    material available on our website, please make sure that you
                    have checked our <br />
                    <a
                        href="/terms/site-and-terms"
                        class="text-primary-500 hover:text-primary-600 font-sm"
                        >Site Use Terms</a
                    >.
                </p>

                <p class="mb-2 sm:text-sm text-xs text-gray-700">
                    If you are requesting copyright consent that is not already
                    provided by the "Intellectual Property Rights" section, then
                    please fill out the below form, and send it to us. We will
                    review your request.
                </p>
                <p class="sm:text-sm text-xs text-gray-700 font-medium">
                    Please note that sending the below request form does NOT
                    give you any license or consent, including implied, to use
                    our copyrighted work unless you receive our explicit consent
                    or if the consent is provided according to the Site Use
                    Terms.
                </p>
            </div>

            <p class="mb-4 sm:text-sm tet-xs text-gray-600">
                Fields indicated by an * are required.
            </p>

            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <form
                method="POST"
                action="?/copyconsent"
                enctype="multipart/form-data"
                class="space-y-6"
                bind:this={form}
                use:enhance={handlesubmit}
                on:keydown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                    }
                }}
            >
                <!-- Title -->
                <div class="md:w-1/2">
                    <label
                        for="title"
                        class="block text-gray-700 font-semibold text-sm mb-2"
                        >*Title</label
                    >
                    <select
                        id="title"
                        name="title"
                        bind:value={title}
                        on:change={() => {
                            validateField("title");
                            if (errors?.title) {
                                errors.title = "";
                            }
                        }}
                        class="bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 rounded-md mb-2 w-full md:w-4/5 p-2.5"
                    >
                        <option value="" disabled selected>Select Title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Ph.D.">Ph.D.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Rev.">Rev.</option>
                    </select>
                </div>
                {#if errors?.title}
                    <span class="text-red-500 text-xs">{errors.title}</span>
                {/if}

                <!-- Name fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="customerName"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*First Name:</label
                        >
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            bind:value={firstname}
                            maxlength="50"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="First Name"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                firstname = e.target.value;
                                validateField("firstname");

                                errors.firstname = !firstname
                                    ? "*Required"
                                    : firstname.length < 3
                                      ? "Minimum 3 characters required"
                                      : !/^[A-Za-z\s]+$/.test(firstname)
                                        ? "Please enter a valid name"
                                        : "";
                            }}
                        />
                        {#if errors?.firstname}
                            <span class="text-red-500 text-xs mt-1 block"
                                >{errors.firstname}</span
                            >
                        {/if}
                    </div>
                    <div>
                        <label
                            for="lastname"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*Last Name:</label
                        >
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            bind:value={lastname}
                            maxlength="50"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Last Name"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                lastname = e.target.value;
                                validateField("lastname");
                                errors.lastname = !lastname
                                    ? "*Required"
                                    : !/^[A-Za-z]+$/.test(lastname)
                                      ? "Please enter a valid last name"
                                      : "";
                            }}
                        />
                        {#if errors?.lastname}
                            <span class="text-red-500 text-xs mt-1 block"
                                >{errors.lastname}</span
                            >
                        {/if}
                    </div>
                </div>

                <!-- Company and address fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="company"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*Company Name:</label
                        >
                        <input
                            type="text"
                            name="company"
                            id="company"
                            bind:value={company}
                            maxlength="50"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Company Name"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                company = e.target.value;
                                if (!company) {
                                    errors.company = "*Required";
                                } else if (company.length < 3) {
                                    errors.company =
                                        "Company name must be at least 3 characters";
                                } else if (
                                    !/^[A-Za-z0-9@.,\s&-]+$/.test(company)
                                ) {
                                    errors.company =
                                        "Please enter a valid company name";
                                } else if (/^\d+$/.test(company)) {
                                    errors.company =
                                        "Company name cannot contain only numbers";
                                } else {
                                    delete errors.company;
                                }

                                validateField("company");
                            }}
                        />
                        {#if errors?.company}
                            <span class="text-red-500 text-xs mt-1 block"
                                >{errors.company}</span
                            >
                        {/if}
                    </div>
                    <div>
                        <label
                            for="street"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*Street or Postbox:</label
                        >
                        <input
                            type="text"
                            name="street"
                            id="street"
                            bind:value={street}
                            maxlength="50"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Street Name"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                street = e.target.value;
                                validateField("street");

                                const isOnlyNumbers = /^[0-9\s]+$/.test(street);
                                const isValidChars =
                                    /^[A-Za-z0-9@!#$%^&*(_).,:;'"+-\s]+$/.test(
                                        street,
                                    );

                                errors.street = !street
                                    ? "*Required"
                                    : street.length < 3
                                      ? "Street name must be at least 3 characters"
                                      : isOnlyNumbers
                                        ? "Street name cannot be only numbers"
                                        : !isValidChars
                                          ? "Please enter a valid street name"
                                          : "";
                            }}
                        />
                        {#if errors?.street}
                            <span class="text-red-500 text-xs mt-1 block"
                                >{errors.street}</span
                            >
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        if (authedUserEmailVerified === true) {
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
                                <label
                                    for="email"
                                    class="block text-gray-700 font-semibold text-sm mb-2"
                                    >*Email Address</label
                                >
                                <div class="relative">
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        bind:value={email}
                                        maxlength="50"
                                        class="w-full pr-10 placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
                                                        .includes("gamil")
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
                                class="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200"
                            >
                                <form
                                    action="?/verifyOtpEmail"
                                    method="POST"
                                    use:enhance={() => {
                                        return async ({ result }) => {
                                            loadingotp = false; // Hide loading spinner when the request is complete
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
                                            class="w-full placeholder:text-xs text-sm px-2 py-2 rounded bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
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
                                                <span class="flex items-center">
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
                                        <span> Didn't receive the code?</span>
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
                    <div>
                        <label
                            for="city"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*City:</label
                        >
                        <input
                            type="text"
                            name="city"
                            id="city"
                            bind:value={city}
                            maxlength="50"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="City"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                city = e.target.value;
                                validateField("city");

                                const isOnlyNumbers = /^[0-9\s]+$/.test(city);
                                const isValidChars =
                                    /^[A-Za-z0-9@!#$%^&*(_).,:;'"+-\s]+$/.test(
                                        city,
                                    );

                                errors.city = !city
                                    ? "*Required"
                                    : city.length < 3
                                      ? "City name must be at least 3 characters"
                                      : isOnlyNumbers
                                        ? "City name cannot be only numbers"
                                        : !isValidChars
                                          ? "Please enter a valid city name"
                                          : "";
                            }}
                        />
                        {#if errors?.city}
                            <span class="text-red-500 text-xs mt-1 block"
                                >{errors.city}</span
                            >
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="country"
                            class="block text-gray-700 font-semibold text-sm mb-2"
                            >*Country</label
                        >
                        <div class="relative dropdown-container">
                            <input
                                type="text"
                                name="country"
                                bind:value={country}
                                placeholder="Search country"
                                on:input={handleInputChange}
                                on:click={toggleDropdown}
                                on:keydown={handleKeyDown}
                                on:input={() => {
                                    country = country.trim();
                                    validateField("country");
                                }}
                                class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />

                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                on:click|stopPropagation={toggleDropdown}
                                class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                <Icon
                                    icon={showDropdown
                                        ? "ep:arrow-up-bold"
                                        : "ep:arrow-down-bold"}
                                    class="text-gray-500 mr-1 text-sm font-bold"
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
                                                    No matching countries found!
                                                </li>
                                            </div>
                                        {/if}
                                    </ul>
                                </div>
                            {/if}
                            {#if errors?.country}
                                <p class="text-red-500 text-xs mt-1">
                                    {errors.country}
                                </p>
                            {/if}
                        </div>
                    </div>

                    <div>
                        <label
                            for="phone"
                            class="text-sm font-semibold text-gray-700 mb-2 block"
                            >*Phone Number:</label
                        >
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter Contact Number"
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            bind:value={phone}
                            title="Please enter a valid phone number"
                            on:input={() => {
                                phone = phone.replace(/[^+\d]/g, "").trim();
                                validateField("phone");
                                validatePhoneNumber(country, phone);
                            }}
                        />
                        {#if errors?.phone}
                            <p class="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        {/if}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="description"
                            class="sm:text-sm text-xs font-semibold text-gray-700 mb-2 block"
                        >
                            *Please describe the way and the purpose you are
                            going to use our copyrighted work
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            bind:value={description}
                            maxlength="200"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                description = e.target.value;
                                validateField("description");

                                const hasHtmlScript =
                                    /<script.*?>.*?<\/script>/i.test(
                                        description,
                                    ) || /<[^>]*>/i.test(description);
                                const isValidChars =
                                    /^[A-Za-z0-9\s&\-.,!@():;"']+$/.test(
                                        description,
                                    );

                                errors.description = !description
                                    ? "*Required"
                                    : description.length < 3
                                      ? "Description name must be at least 3 characters"
                                      : hasHtmlScript || !isValidChars
                                        ? "Please enter a valid description"
                                        : "";
                            }}
                            class="bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 rounded-md w-full p-3 text-sm"
                        ></textarea>
                        {#if errors.description}
                            <p class="text-red-500 text-xs mt-1">
                                {errors.description}
                            </p>
                        {/if}
                    </div>

                    <div>
                        <label
                            for="url"
                            class="md:text-sm text-xs font-semibold text-gray-700 mb-2 block"
                            >Please share the link so that we could allocate it:</label
                        >
                        <input
                            name="url"
                            type="url"
                            id="url"
                            placeholder="https://example.com/page"
                            bind:value={url}
                            class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            title="Please enter a valid URL"
                            on:input={(e) => {
                                e.target.value = e.target.value.replace(
                                    /^\s+/,
                                    "",
                                );
                                url = e.target.value;
                                validateField("url");
                                const urlPattern =
                                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

                                if (url) {
                                    if (!urlPattern.test(url)) {
                                        errors.url = "Please enter a valid URL";
                                    } else {
                                        delete errors.url;
                                    }
                                } else {
                                    delete errors.url;
                                }
                            }}
                        />
                        {#if errors.url}
                            <p class="text-red-500 text-xs mt-1">
                                {errors.url}
                            </p>
                        {/if}
                    </div>
                </div>
                <span class="flex-1 w-1/2 mb-4">
                    <input type="hidden" name="token" value={captchaToken} />
                    <div id="g-recaptcha-response">
                        <!-- Remove the label wrapper and place elements side by side -->
                        <div
                            class="flex mt-5 md:mt-6 items-center justify-end space-x-2 mb-4"
                        >
                            <input
                                type="checkbox"
                                id="captcha-checkbox"
                                name="captcha"
                                value="captcha"
                                class="w-5 h-5 border-2 border-gray-400 text-primary-600 focus:ring-primary-500 rounded cursor-pointer hover:border-primary-500 transition-colors duration-300"
                                bind:checked={isChecked}
                                on:click={(event) => {
                                    event.preventDefault();
                                    // Don't prevent default here, so checkbox works normally
                                    if (formValid()) {
                                        isChecked = true;
                                        showPopup();
                                    } else {
                                        if (Object.keys(errors).length > 0) {
                                            toast.error(
                                                "Please fill all the required fields.",
                                            );
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
                                            return;
                                        }

                                        isChecked = false;
                                    }
                                }}
                                on:keydown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            <!-- Use label with "for" attribute to associate with checkbox but keep them separate -->
                            <label
                                for="captcha-checkbox"
                                class="text-gray-700 font-medium text-sm cursor-pointer"
                            >
                                Please verify you are human
                            </label>
                        </div>

                        <div class="mt-4 rounded flex items-center justify-end">
                            <button
                                class="px-4 py-3 rounded bg-primary-400 to-primary-500 text-white font-medium shadow-lg hover:shadow-xl md:w-1/4 w-1/2 transform transition hover:bg-primary-600"
                                on:click={(event) => {
                                    event.preventDefault();

                                    if (!formValid()) {
                                        if (Object.keys(errors).length > 0) {
                                            toast.error(
                                                "Please fill all the required fields.",
                                            );
                                            return;
                                        }

                                        if (
                                            !(
                                                ProfileEmailVerified ||
                                                authedUserEmailVerified === true
                                            )
                                        ) {
                                            toast.error(
                                                "Please verify either your email or your phone number to proceed",
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

                                    handlesubmit({ event });
                                }}
                                on:keydown={(event) => {
                                    if (event.key === "Enter") {
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
                </span>
                {#if showCaptchaPopup}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        class="fixed !mt-0 inset-0 flex justify-center items-center bg-black backdrop-blur-sm bg-opacity-50 z-50"
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
                                    <span class="text-lg">{mathQuestion}</span>
                                    <button
                                        class="ml-4 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-all duration-300 {submittingForm
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''}"
                                        on:click={submittingForm
                                            ? null
                                            : (e) => refreshMathQuestion(e)}
                                        disabled={submittingForm}
                                    >
                                        <Icon
                                            icon="ic:round-refresh"
                                            class={`w-5 h-5 text-primary-600 ${submittingForm ? "" : "cursor-pointer hover:scale-110"} transition transform ${rotationClass}`}
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
                                    <p
                                        class="text-red-500 text-sm mt-2 flex items-center"
                                    >
                                        <Icon
                                            icon="mdi:alert-circle"
                                            class="w-4 h-4 mr-1"
                                        />
                                        {errorMessagecap}
                                    </p>
                                {/if}

                                {#if successMessage}
                                    <p
                                        class="text-green-500 text-sm mt-2 flex items-center"
                                    >
                                        <Icon
                                            icon="mdi:check-circle"
                                            class="w-4 h-4 mr-1"
                                        />
                                        {successMessage}
                                    </p>
                                {/if}
                            </div>

                            {#if submittingForm}
                                <div class="w-full mb-4">
                                    <p
                                        class="text-sm mb-2 flex items-center text-primary-600"
                                    >
                                        <Icon
                                            icon="mdi:loading"
                                            class="w-4 h-4 mr-2 animate-spin"
                                        />
                                        Submitting form
                                    </p>
                                    <div class="relative">
                                        <div
                                            class="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                                        >
                                            <!-- Bind the width of the progress bar to the progress variable -->
                                            <div
                                                class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300"
                                                style="width: {progress}%;"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                            <button
                                class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition font-medium text-base {submittingForm
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''}"
                                on:click={(e) => {
                                    if (!submittingForm) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        verifyCaptcha();
                                    }
                                }}
                                disabled={submittingForm}
                            >
                                {submittingForm ? "Verifying..." : "Verify Now"}
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
                <!-- <div class="flex items-center justify-end mt-6">
                    <button
                        class="px-6 py-3 bg-primary-400 text-white text-sm rounded-md transition duration-300 hover:bg-primary-600 font-semibold sm:text-sm text-xs shadow-sm"
                        on:click={(event) => {
                            // event.preventDefault();
                            if (!formValid()) {
                                if (Object.keys(errors).length > 0) {
                                    toast.error(
                                        "Please fill all the required fields.",
                                    );
                                    return;
                                }
                                if (
                                    !(
                                        ProfileEmailVerified ||
                                        authedUserEmailVerified === true
                                    )
                                ) {
                                    {
                                        toast.error(
                                            "Please verify your email to proceed",
                                        );
                                        return;
                                    }
                                }
                            }

                            handlesubmit();
                        }}
                        on:keydown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                            }
                        }}
                        disabled={submitting}
                    >
                        {#if submitting}
                            <span class="flex items-center justify-center">
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
                </div> -->
            </form>
        </div>
    </div>
{/if}
