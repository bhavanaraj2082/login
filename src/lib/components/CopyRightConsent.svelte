<script>
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { toast, Toaster } from "svelte-sonner";
    import Icon from "@iconify/svelte";
    export let data;
    // console.log(data, "i a consent");
    let submitting = false;
    let isChecked =  false;
	let mathQuestion = '';
	let mathAnswer = 0;
	let userAnswer = '';
	let mathError = '';
    let submittingForm = false;
	let isLoadingemail = false;
	let progress = 0;
	let errorMessagecap = '';
	let inputReadOnly = false;
    let captchaToken = '';

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
    let errorMessage = '';
	let rotationClass = '';
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
    let successMessage = '';
    let showCaptchaPopup = false;
    let loading=false;
    function submitFormAutomatically() {
		loading = false;
		if (form) {
			const formData = new FormData(form);

			fetch(form.action, {
				method: form.method,
				body: formData
			})
				.then((response) => response.json())
				.then((data) => {
					// console.log("respose Status",data.status);
					window.scrollTo({ top: 0, behavior: 'smooth' });
					if (data.status === 200) {
						showSuccesDiv = true;
						window.scrollTo({ top: 0, behavior: 'smooth' });
					} else {
						showFailureDiv = true;
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
				});
		}
	}
    
	function generateMathQuestion() {
		const num1 = Math.floor(Math.random() * 10) + 1;
		const num2 = Math.floor(Math.random() * 10) + 1;
		const operations = ['+', '-', '*'];
		const randomOperation = operations[Math.floor(Math.random() * operations.length)];

		if (randomOperation === '-') {
			const larger = Math.max(num1, num2);
			const smaller = Math.min(num1, num2);
			mathQuestion = `What is ${larger} - ${smaller}?`;
			mathAnswer = larger - smaller;
		} else if (randomOperation === '+') {
			mathQuestion = `What is ${num1} + ${num2}?`;
			mathAnswer = num1 + num2;
		} else if (randomOperation === '*') {
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
			errorMessagecap = '';
			successMessage = 'Captcha verified Successfully!!!';
			isChecked = true;
			captchaVerified = true;
			loading = true;
			inputReadOnly = true;

			const tokenPayload = {
				question: mathQuestion,
				answer: mathAnswer
			};
			captchaToken = btoa(JSON.stringify(tokenPayload));

			setTimeout(() => {
				submitFormAutomatically();
			}, 50);
		} else {
			successMessage = '';
			errorMessagecap = 'Incorrect answer, try again.';
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
            firstname = `${data.profile.firstName || ""} `.trim();
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
    const countries = [
        { name: "Afghanistan", code: "+93" },
        { name: "Albania", code: "+355" },
        { name: "Algeria", code: "+213" },
        { name: "Andorra", code: "+376" },
        { name: "Angola", code: "+244" },
        { name: "Antigua and Barbuda", code: "+1-268" },
        { name: "Argentina", code: "+54" },
        { name: "Armenia", code: "+374" },
        { name: "Australia", code: "+61" },
        { name: "Austria", code: "+43" },
        { name: "Azerbaijan", code: "+994" },
        { name: "Bahamas", code: "+1-242" },
        { name: "Bahrain", code: "+973" },
        { name: "Bangladesh", code: "+880" },
        { name: "Barbados", code: "+1-246" },
        { name: "Belarus", code: "+375" },
        { name: "Belgium", code: "+32" },
        { name: "Belize", code: "+501" },
        { name: "Benin", code: "+229" },
        { name: "Bhutan", code: "+975" },
        { name: "Bolivia", code: "+591" },
        { name: "Bosnia and Herzegovina", code: "+387" },
        { name: "Botswana", code: "+267" },
        { name: "Brazil", code: "+55" },
        { name: "Brunei", code: "+673" },
        { name: "Bulgaria", code: "+359" },
        { name: "Burkina Faso", code: "+226" },
        { name: "Burundi", code: "+257" },
        { name: "Cabo Verde", code: "+238" },
        { name: "Cambodia", code: "+855" },
        { name: "Cameroon", code: "+237" },
        { name: "Canada", code: "+1" },
        { name: "Central African Republic", code: "+236" },
        { name: "Chad", code: "+235" },
        { name: "Chile", code: "+56" },
        { name: "China", code: "+86" },
        { name: "Colombia", code: "+57" },
        { name: "Comoros", code: "+269" },
        { name: "Congo, Republic of the", code: "+242" },
        { name: "Congo, Democratic Republic of the", code: "+243" },
        { name: "Costa Rica", code: "+506" },
        { name: "Croatia", code: "+385" },
        { name: "Cuba", code: "+53" },
        { name: "Cyprus", code: "+357" },
        { name: "Czech Republic", code: "+420" },
        { name: "Denmark", code: "+45" },
        { name: "Djibouti", code: "+253" },
        { name: "Dominica", code: "+1-767" },
        { name: "Dominican Republic", code: "+1-809" },
        { name: "Ecuador", code: "+593" },
        { name: "Egypt", code: "+20" },
        { name: "El Salvador", code: "+503" },
        { name: "Equatorial Guinea", code: "+240" },
        { name: "Eritrea", code: "+291" },
        { name: "Estonia", code: "+372" },
        { name: "Eswatini", code: "+268" },
        { name: "Ethiopia", code: "+251" },
        { name: "Fiji", code: "+679" },
        { name: "Finland", code: "+358" },
        { name: "France", code: "+33" },
        { name: "Gabon", code: "+241" },
        { name: "Gambia", code: "+220" },
        { name: "Georgia", code: "+995" },
        { name: "Germany", code: "+49" },
        { name: "Ghana", code: "+233" },
        { name: "Greece", code: "+30" },
        { name: "Grenada", code: "+1-473" },
        { name: "Guatemala", code: "+502" },
        { name: "Guinea", code: "+224" },
        { name: "Guinea-Bissau", code: "+245" },
        { name: "Guyana", code: "+592" },
        { name: "Haiti", code: "+509" },
        { name: "Honduras", code: "+504" },
        { name: "Hungary", code: "+36" },
        { name: "Iceland", code: "+354" },
        { name: "India", code: "+91" },
        { name: "Indonesia", code: "+62" },
        { name: "Iran", code: "+98" },
        { name: "Iraq", code: "+964" },
        { name: "Ireland", code: "+353" },
        { name: "Israel", code: "+972" },
        { name: "Italy", code: "+39" },
        { name: "Jamaica", code: "+1-876" },
        { name: "Japan", code: "+81" },
        { name: "Jordan", code: "+962" },
        { name: "Kazakhstan", code: "+7" },
        { name: "Kenya", code: "+254" },
        { name: "Kiribati", code: "+686" },
        { name: "Kuwait", code: "+965" },
        { name: "Kyrgyzstan", code: "+996" },
        { name: "Laos", code: "+856" },
        { name: "Latvia", code: "+371" },
        { name: "Lebanon", code: "+961" },
        { name: "Lesotho", code: "+266" },
        { name: "Liberia", code: "+231" },
        { name: "Libya", code: "+218" },
        { name: "Liechtenstein", code: "+423" },
        { name: "Lithuania", code: "+370" },
        { name: "Luxembourg", code: "+352" },
        { name: "Madagascar", code: "+261" },
        { name: "Malawi", code: "+265" },
        { name: "Malaysia", code: "+60" },
        { name: "Maldives", code: "+960" },
        { name: "Mali", code: "+223" },
        { name: "Malta", code: "+356" },
        { name: "Marshall Islands", code: "+692" },
        { name: "Mauritania", code: "+222" },
        { name: "Mauritius", code: "+230" },
        { name: "Mexico", code: "+52" },
        { name: "Micronesia", code: "+691" },
        { name: "Moldova", code: "+373" },
        { name: "Monaco", code: "+377" },
        { name: "Mongolia", code: "+976" },
        { name: "Montenegro", code: "+382" },
        { name: "Morocco", code: "+212" },
        { name: "Mozambique", code: "+258" },
        { name: "Myanmar", code: "+95" },
        { name: "Namibia", code: "+264" },
        { name: "Nauru", code: "+674" },
        { name: "Nepal", code: "+977" },
        { name: "Netherlands", code: "+31" },
        { name: "New Zealand", code: "+64" },
        { name: "Nicaragua", code: "+505" },
        { name: "Niger", code: "+227" },
        { name: "Nigeria", code: "+234" },
        { name: "North Macedonia", code: "+389" },
        { name: "Norway", code: "+47" },
        { name: "Oman", code: "+968" },
        { name: "Pakistan", code: "+92" },
        { name: "Palau", code: "+680" },
        { name: "Palestine", code: "+970" },
        { name: "Panama", code: "+507" },
        { name: "Papua New Guinea", code: "+675" },
        { name: "Paraguay", code: "+595" },
        { name: "Peru", code: "+51" },
        { name: "Philippines", code: "+63" },
        { name: "Poland", code: "+48" },
        { name: "Portugal", code: "+351" },
        { name: "Qatar", code: "+974" },
        { name: "Romania", code: "+40" },
        { name: "Russia", code: "+7" },
        { name: "Rwanda", code: "+250" },
        { name: "Saint Kitts and Nevis", code: "+1-869" },
        { name: "Saint Lucia", code: "+1-758" },
        { name: "Saint Vincent and the Grenadines", code: "+1-784" },
        { name: "Samoa", code: "+685" },
        { name: "San Marino", code: "+378" },
        { name: "Sao Tome and Principe", code: "+239" },
        { name: "Saudi Arabia", code: "+966" },
        { name: "Senegal", code: "+221" },
        { name: "Serbia", code: "+381" },
        { name: "Seychelles", code: "+248" },
        { name: "Sierra Leone", code: "+232" },
        { name: "Singapore", code: "+65" },
        { name: "Slovakia", code: "+421" },
        { name: "Slovenia", code: "+386" },
        { name: "Solomon Islands", code: "+677" },
        { name: "Somalia", code: "+252" },
        { name: "South Africa", code: "+27" },
        { name: "South Korea", code: "+82" },
        { name: "Spain", code: "+34" },
        { name: "Sri Lanka", code: "+94" },
        { name: "Sudan", code: "+249" },
        { name: "Suriname", code: "+597" },
        { name: "Sweden", code: "+46" },
        { name: "Switzerland", code: "+41" },
        { name: "Syria", code: "+963" },
        { name: "Taiwan", code: "+886" },
        { name: "Tajikistan", code: "+992" },
        { name: "Tanzania", code: "+255" },
        { name: "Thailand", code: "+66" },
        { name: "Togo", code: "+228" },
        { name: "Tonga", code: "+676" },
        { name: "Trinidad and Tobago", code: "+1-868" },
        { name: "Tunisia", code: "+216" },
        { name: "Turkey", code: "+90" },
        { name: "Turkmenistan", code: "+993" },
        { name: "Tuvalu", code: "+688" },
        { name: "Uganda", code: "+256" },
        { name: "Ukraine", code: "+380" },
        { name: "United Arab Emirates", code: "+971" },
        { name: "United Kingdom", code: "+44" },
        { name: "United States", code: "+1" },
        { name: "Uruguay", code: "+598" },
        { name: "Uzbekistan", code: "+998" },
        { name: "Vanuatu", code: "+678" },
        { name: "Vatican City", code: "+39" },
        { name: "Venezuela", code: "+58" },
        { name: "Vietnam", code: "+84" },
        { name: "Yemen", code: "+967" },
        { name: "Zambia", code: "+260" },
        { name: "Zimbabwe", code: "+263" },
    ];
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

		userAnswer = '';

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
                errors = { ...errors, title: "Title is required" };
            } else {
                const { title: _, ...rest } = errors;
                errors = rest;
            }
        }
        if (!fieldName || fieldName === "firstname") {
            if (
                !firstname ||
                !/^[A-Za-z0-9@!#$%^&*(_)+-\s]+$/.test(firstname)
            ) {
                errors.firstname = "First Name is required";
            } else {
                delete errors.firstname;
            }
        }
        if (!fieldName || fieldName === "lastname") {
            if (!lastname || !/^[A-Za-z0-9@!#$%^&*(_)+-\s]+$/.test(lastname)) {
                errors.lastname = "Last Name is required";
            } else {
                delete errors.lastname;
            }
        }

        if (!fieldName || fieldName === "company") {
            const companyPattern = /^[A-Za-z0-9@.,\s&-]+$/;
            if (!companyPattern.test(company)) {
                errors.company = "Please enter a valid company name";
            } else {
                delete errors.company;
            }
        }
        if (!fieldName || fieldName === "street") {
            if (!street || !/^[A-Za-z0-9@!#$%^&*(_)+-\s]+$/.test(street)) {
                errors.street = "Street Name is required";
            } else {
                delete errors.street;
            }
        }

        if (!fieldName || fieldName === "city") {
            if (!city || !/^[A-Za-z0-9@!#$%^&*.,:;'"(_)+-\s]+$/.test(city)) {
                errors.city = "City Name is required";
            } else {
                delete errors.city;
            }
        }

        if (!fieldName || fieldName === "postalcode") {
            if (!postalcode || !/^[0-9\s]+$/.test(postalcode)) {
                errors.postalcode = "Postal Code is required";
            } else {
                delete errors.postalcode;
            }
        }


        if (!fieldName || fieldName === "email") {
    if (!email) {
        errors.email = "Email is required.";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        errors.email = "Please enter a valid email address.";
    } else if (email.split("@")[1].includes("gamil")) {
        errors.email = "Email domain cannot be gmail.com.";
    } else {
        delete errors.email;
    }
}


       
        if (!fieldName || fieldName === "description") {
            if (
                !description ||
                !/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(description) ||
                /<script.*?>.*?<\/script>/i.test(description) ||
                /<[^>]*>/i.test(description)
            ) {
                errors.description =
                    "Description is required and must not contain HTML tags or scripts.";
            } else {
                delete errors.description;
            }
        }

        if (!fieldName || fieldName === "country") {
    if (!country || country === "") {
        errors.country = "Please select a country";
    } else {
        delete errors.country;
    }
}
        if (!fieldName || fieldName === "phone") {
    if (!country) {
        errors.phone = "Please select the country before entering the phone number";
        return;
    }
    if (!phone || phone === "") {
        errors.phone = "Required for the selected country";
    } else {
        const countryDetails = getCountryByCode(country);
        
        if (!countryDetails) {
            errors.phone = "Invalid country selected. Please reselect country.";
            errors.country = "Invalid country selected";
        } else {
            const phonePattern = getPhonePattern(country);
            if (!phonePattern) {
                errors.phone = "Phone number pattern for country not found";
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
        if (Object.keys(errors).length > 0) {
            isValid = false;
        }
    };
    const phoneNumberPatterns = {
        Afghanistan: /^[7-9]\d{8}$/,
        Algeria: /^[5-9]\d{8}$/,
        Andorra: /^\+376[0-9]{6}$/,
        Angola: /^(\+244|0)9\d{8}$/,
        "Antigua and Barbuda": /^\+1[2689]\d{7}$/,
        Armenia: /^(\+374|0)(10|20|30|40|50|60|70|80)\d{6}$/,
        Austria: /^\+43\d{1,12}$/,
        Azerbaijan: /^(\+994|0)5[0-9]\d{7}$/,
        Bahamas: /^\+1[242]\d{7}$/,
        Bangladesh: /^(\+8801|01)\d{9}$/,
        Belarus: /^(\+375|0)29\d{7}$/,
        Belgium: /^(\+32|0)4\d{8}$/,
        Belize: /^(\+501|0)\d{7}$/,
        Benin: /^(\+229|0)\d{8}$/,
        Bolivia: /^(\+591|0)\d{8}$/,
        "Bosnia and Herzegovina": /^(\+387|0)\d{8}$/,
        "Burkina Faso": /^(\+226|0)\d{8}$/,
        Burundi: /^(\+257|0)\d{8}$/,
        "Cabo Verde": /^(\+238|0)\d{7}$/,
        Cambodia: /^(\+855|0)\d{8,9}$/,
        Cameroon: /^(\+237|0)\d{8}$/,
        "Central African Republic": /^(\+236|0)\d{8}$/,
        Chad: /^(\+235|0)\d{8}$/,
        Comoros: /^(\+269|0)\d{7}$/,
        "Congo, Republic of the": /^(\+242|0)\d{7}$/,
        "Congo, Democratic Republic of the": /^(\+243|0)\d{9}$/,
        "Costa Rica": /^(\+506|0)\d{8}$/,
        Croatia: /^(\+385|0)9\d{8}$/,
        Cyprus: /^(\+357|0)\d{8}$/,
        "Czech Republic": /^(\+420|0)\d{9}$/,
        Djibouti: /^(\+253|0)\d{7}$/,
        Dominica: /^(\+1[7678]|0)\d{7}$/,
        "Dominican Republic": /^(\+1[809]|0)\d{7}$/,
        Ecuador: /^(\+593|0)\d{9}$/,
        "El Salvador": /^(\+503|0)\d{8}$/,
        "Equatorial Guinea": /^(\+240|0)\d{8}$/,
        Eritrea: /^(\+291|0)\d{7}$/,
        Estonia: /^(\+372|0)\d{7}$/,
        Eswatini: /^(\+268|0)\d{8}$/,
        Finland: /^(\+358|0)\d{9}$/,
        France: /^(\+33|0)\d{9}$/,
        Gabon: /^(\+241|0)\d{7}$/,
        Gambia: /^(\+220|0)\d{7}$/,
        Georgia: /^(\+995|0)\d{9}$/,
        Germany: /^(\+49|0)\d{10}$/,
        Greece: /^(\+30|0)\d{10}$/,
        Grenada: /^(\+1[473]|0)\d{7}$/,
        Guatemala: /^(\+502|0)\d{8}$/,
        Guinea: /^(\+224|0)\d{9}$/,
        "Guinea-Bissau": /^(\+245|0)\d{7}$/,
        Guyana: /^(\+592|0)\d{7}$/,
        Honduras: /^(\+504|0)\d{8}$/,
        Iran: /^(\+98|0)\d{10}$/,
        Iraq: /^(\+964|0)\d{9}$/,
        Ireland: /^(\+353|0)\d{9}$/,
        Italy: /^(\+39|0)\d{10}$/,
        Jamaica: /^(\+1[876]|0)\d{7}$/,
        Kenya: /^(\+254|0)\d{9}$/,
        Kiribati: /^(\+686|0)\d{4}$/,
        Laos: /^(\+856|0)\d{8}$/,
        Latvia: /^(\+371|0)\d{8}$/,
        Lebanon: /^(\+961|0)\d{8}$/,
        Lesotho: /^(\+266|0)\d{8}$/,
        Liechtenstein: /^(\+423|0)\d{7}$/,
        Lithuania: /^(\+370|0)\d{8}$/,
        Luxembourg: /^(\+352|0)\d{6}$/,
        Malawi: /^(\+265|0)\d{9}$/,
        Maldives: /^(\+960|0)\d{7}$/,
        Mali: /^(\+223|0)\d{8}$/,
        Malta: /^(\+356|0)\d{8}$/,
        "Marshall Islands": /^(\+692|0)\d{7}$/,
        Mauritania: /^(\+222|0)\d{8}$/,
        Micronesia: /^(\+691|0)\d{7}$/,
        Monaco: /^(\+377|0)\d{8}$/,
        Mongolia: /^(\+976|0)\d{8}$/,
        Montenegro: /^(\+382|0)\d{8}$/,
        Mozambique: /^(\+258|0)\d{9}$/,
        Myanmar: /^(\+95|0)\d{9}$/,
        Nauru: /^(\+674|0)\d{4}$/,
        Netherlands: /^(\+31|0)\d{9}$/,
        "New Zealand": /^(\+64|0)\d{9}$/,
        Niger: /^(\+227|0)\d{8}$/,
        Nigeria: /^(\+234|0)\d{10}$/,
        "North Macedonia": /^(\+389|0)\d{9}$/,
        Oman: /^(\+968|0)\d{8}$/,
        Palau: /^(\+680|0)\d{7}$/,
        Palestine: /^(\+970|0)\d{9}$/,
        Panama: /^(\+507|0)\d{7}$/,
        "Papua New Guinea": /^(\+675|0)\d{7}$/,
        Paraguay: /^(\+595|0)\d{9}$/,
        Poland: /^(\+48|0)\d{9}$/,
        Portugal: /^(\+351|0)\d{9}$/,
        Romania: /^(\+40|0)\d{9}$/,
        "Saint Kitts and Nevis": /^(\+1[869]|0)\d{7}$/,
        "Saint Lucia": /^(\+1[758]|0)\d{7}$/,
        "Saint Vincent and the Grenadines": /^(\+1[784]|0)\d{7}$/,
        Samoa: /^(\+685|0)\d{5}$/,
        "San Marino": /^(\+378|0)\d{7}$/,
        "Sao Tome and Principe": /^(\+239|0)\d{7}$/,
        "Saudi Arabia": /^(\+966|0)\d{9}$/,
        Senegal: /^(\+221|0)\d{9}$/,
        Seychelles: /^(\+248|0)\d{7}$/,
        "Sierra Leone": /^(\+232|0)\d{8}$/,
        Slovakia: /^(\+421|0)\d{9}$/,
        Slovenia: /^(\+386|0)\d{8}$/,
        "Solomon Islands": /^(\+677|0)\d{5}$/,
        Somalia: /^(\+252|0)\d{8}$/,
        "South Africa": /^(\+27|0)\d{9}$/,
        "South Korea": /^(\+82|0)\d{9}$/,
        Spain: /^(\+34|0)\d{9}$/,
        "Sri Lanka": /^(\+94|0)\d{9}$/,
        Syria: /^(\+963|0)\d{9}$/,
        Togo: /^(\+228|0)\d{8}$/,
        "Trinidad and Tobago": /^(\+1[868]|0)\d{7}$/,
        Tuvalu: /^(\+688|0)\d{4}$/,
        Uganda: /^(\+256|0)\d{9}$/,
        Ukraine: /^(\+380|0)\d{9}$/,
        "United Arab Emirates": /^(\+971|0)\d{9}$/,
        "United Kingdom": /^(\+44|0)\d{10}$/,
        "United States": /^(\+1|0)\d{10}$/,
        Uruguay: /^(\+598|0)\d{8}$/,
        Uzbekistan: /^(\+998|0)\d{9}$/,
        Vanuatu: /^(\+678|0)\d{5}$/,
        "Vatican City": /^(\+379|0)\d{7}$/,
        Venezuela: /^(\+58|0)\d{10}$/,
        Yemen: /^(\+967|0)\d{9}$/,
        Zimbabwe: /^(\+263|0)\d{9}$/,

        Albania: /^\d{9}$/,
        USA: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
        UK: /^\d{4}[\s-]?\d{6}$/,
        Eurozone: /^\d{8,15}$/,
        Japan: /^\d{10,11}$/,
        Canada: /^[2-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
        Australia: /^[4-5]\d{8}$/,
        Switzerland: /^\d{9}$/,
        China: /^[1-9]\d{10}$/,
        Sweden: /^\d{6,13}$/,
        NewZealand: /^[2-9]\d{7,9}$/,
        Singapore: /^[8-9]\d{7}$/,
        HongKong: /^[5-9]\d{7}$/,
        Norway: /^\d{8}$/,
        Mexico: /^\d{10}$/,
        India: /^[6-9]\d{9}$/,
        Brazil: /^\d{10,11}$/,
        Russia: /^[1-9]\d{9}$/,
        SouthAfrica: /^\d{10}$/,
        Israel: /^[5-7]\d{8}$/,
        Thailand: /^[6-9]\d{8}$/,
        Malaysia: /^[1-9]\d{7,9}$/,
        Philippines: /^[8-9]\d{9}$/,
        UAE: /^[5-9]\d{8}$/,
        Colombia: /^\d{10}$/,
        Pakistan: /^[3-9]\d{9}$/,
        CzechRepublic: /^\d{9}$/,
        Argentina: /^\d{10,11}$/,
        Denmark: /^\d{8}$/,
        Hungary: /^\d{9}$/,
        Turkey: /^[5-9]\d{9}$/,
        Chile: /^\d{9}$/,
        SaudiArabia: /^[5-9]\d{8}$/,
        Taiwan: /^[9]\d{8}$/,
        Indonesia: /^[8-9]\d{9,10}$/,
        Vietnam: /^[3-9]\d{8,9}$/,
        Egypt: /^[1-9]\d{9}$/,
        Bahrain: /^\d{8}$/,
        Qatar: /^\d{8}$/,
        Kuwait: /^\d{8}$/,
        Morocco: /^[5-9]\d{8}$/,
        Jordan: /^\d{8,9}$/,
        Kazakhstan: /^\d{10}$/,
        Serbia: /^\d{9}$/,
        Peru: /^\d{9}$/,
        Tunisia: /^\d{8}$/,
        WestAfrica: /^\d{8}$/,
        CentralAfrica: /^\d{8}$/,
        Zambia: /^\d{9}$/,
        Nepal: /^[9]\d{9}$/,
        SriLanka: /^[7]\d{8}$/,
        Turkmenistan: /^\d{8}$/,
        Moldova: /^\d{8}$/,
        Ethiopia: /^\d{9}$/,
        Tanzania: /^\d{9}$/,
        Ghana: /^[2-9]\d{8}$/,
        Nicaragua: /^\d{8}$/,
        Bulgaria: /^\d{8,10}$/,
        BosniaHerzegovina: /^\d{8,9}$/,
        Namibia: /^\d{9}$/,
        CaymanIslands: /^\d{7}$/,
        Fiji: /^\d{7}$/,
        Macau: /^\d{8}$/,
        Mauritius: /^\d{8}$/,
        Tajikistan: /^\d{9}$/,
        Aruba: /^\d{7}$/,
        Suriname: /^\d{7}$/,
        Iceland: /^\d{7}$/,
        SierraLeone: /^\d{8}$/,
        Madagascar: /^\d{8,9}$/,
        EastCaribbean: /^\d{7}$/,
        Barbados: /^\d{7}$/,
        CFPFranc: /^\d{6,9}$/,
        PapuaNewGuinea: /^\d{8}$/,
        ElSalvador: /^\d{8}$/,
        Gibraltar: /^\d{8}$/,
        Liberia: /^\d{7}$/,
        Rwanda: /^\d{9}$/,
        Botswana: /^\d{7,8}$/,
        Kyrgyzstan: /^\d{9}$/,
        Brunei: /^\d{7}$/,
        Sudan: /^\d{9}$/,
        Libya: /^\d{8,9}$/,
        Cuba: /^\d{8}$/,
        Bhutan: /^\d{8}$/,
        DominicanRepublic: /^\d{10}$/,
        Haiti: /^\d{8}$/,
        Tonga: /^\d{7}$/,
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

        return isValid;
    }

    let errors = {};

    let searchTerm = "";
    function selectCountry(selectedCountry) {
		country = selectedCountry.name;
		searchTerm = selectedCountry.name;
		showDropdown = false;
		validateField('country');
		validatePhoneNumber(country, phone);
        validateField("phone");

		delete errors.country;
		const countryInput = document.querySelector('input[name="country"]');
		if (countryInput) {
			countryInput.value = selectedCountry.name;
		}
        if (!phone || phone === "") {
               errors.phone = "Required for the selected country.";
        }
        else {
        delete errors.phone; // Remove any errors if conditions are satisfied
    }
	}


function handleKeyDown(event) {
		const exactCountryMatch = countries.some((c) => c.name === country && c.name === searchTerm);
		if (
			exactCountryMatch &&
			!(
				event.key === 'Backspace' ||
				event.key === 'Delete' ||
				event.key === 'ArrowLeft' ||
				event.key === 'ArrowRight' ||
				event.key === 'Home' ||
				event.key === 'End' ||
				event.key === 'Tab' ||
				event.key === 'Escape' ||
				event.ctrlKey
			)
		) {
			// Block adding characters to an exact match
			event.preventDefault();
			return false;
		}

		if (event.key === 'Enter' && searchTerm.length >= 3 && filteredCountries.length > 0) {
			selectCountry(filteredCountries[0]);
			event.preventDefault();
		} else if (event.key === 'Escape') {
			showDropdown = false;
		}
		// Allow backspace/delete to work normally - no special handling needed
	}
    function toggleDropdown() {
        showDropdown = !showDropdown;
    }
    // function filterCountries() {
    //     filteredCountries = countries.filter(
    //         (country) =>
    //             country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             country.code
    //                 .replace("+", "")
    //                 .includes(searchTerm.replace("+", "").toLowerCase()),
    //     );
    //     if (
    //         filteredCountries.length === 1 &&
    //         (filteredCountries[0].name.toLowerCase() ===
    //             searchTerm.toLowerCase() ||
    //             filteredCountries[0].code.replace("+", "").toLowerCase() ===
    //                 searchTerm.replace("+", "").toLowerCase())
    //     ) {
    //         selectCountry(filteredCountries[0]);
    //     } else {
    //         showDropdown = filteredCountries.length > 0;
    //     }
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
    // function handleInputChange(event) {
    //     searchTerm = event.target.value;
    //     filterCountries();
    // }
	function handleInputChange(event) {
		searchTerm = event.target.value;
		const isDeleting =
			event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward';

		if (searchTerm.length > 0 && !isDeleting) {
			filterCountriesWithoutAutoSelect();
			showDropdown = filteredCountries.length > 0;
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

			const countriesStartingWith = filteredCountries.filter((country) =>
				country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
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
    $: if (country) {
    validateField("phone");
}
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
            class="bg-white mx-auto shadow rounded-lg  lg:w-full w-11/12 py-6 px-4 md:px-8 lg:px-10">
            <h1 class="sm:text-3xl text-xl font-bold mb-6 mt-3 text-center text-gray-800">
                Copyright Consent
            </h1>

            <div
                class="bg-primary-50 border-l-4 border-primary-400 p-4 mb-6 rounded-r">
                <p class="mb-2 sm:text-sm text-xs text-gray-700">
                    In case you are requesting our consent to use copyrighted
                    material available on our website, please make sure that you
                    have checked our <br>
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
                    if (event.key === 'Enter') {
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
                                e.target.value = e.target.value.replace(/^\s+/, '');
                                firstname = e.target.value;
                                validateField("firstname");
                                errors.firstname = !firstname
                                    ? "*Required"
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
                                 e.target.value = e.target.value.replace(/^\s+/, '');
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
                                 e.target.value = e.target.value.replace(/^\s+/, '');
                                 company = e.target.value;
                                validateField("company");
                                errors.company = !company
                                    ? "*Required"
                                    : !/^[A-Za-z0-9@!#$%^&*(_)+-\s]+$/.test(
                                            company,
                                        )
                                      ? "Please enter a valid company name"
                                      : "";
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
                                 e.target.value = e.target.value.replace(/^\s+/, '');
                                 street = e.target.value;
                                validateField("street");
                                errors.street = !street
                                    ? "*Required"
                                    : !/^[A-Za-z0-9@!#$%^&*(_).,:;'"+-\s]+$/.test(
                                            street,
                                        )
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
                                        class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Email"
                                        on:input={(e) => {
                                             e.target.value = e.target.value.replace(/^\s+/, '');
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
                                            disabled={loadingotp}
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
                                 e.target.value = e.target.value.replace(/^\s+/, '');
                                 city = e.target.value;
                                validateField("city");
                                errors.city = !city
                                    ? "*Required"
                                    : !/^[A-Za-z" "/?()*$#0-9\s]+$/.test(city)
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
                        <div class="relative">
                            <input
                                type="text"
                                name="country"
                                bind:value={country}
                                placeholder="Search country"
                                on:input={handleInputChange}
                                on:click={toggleDropdown}
                                on:keydown={handleKeyDown}
                                on:input={() => {
                                    country= country.trim();
                                    validateField("country");
                                    
                                      
                                }}
                                class="w-full placeholder:text-gray-400 text-sm px-3 py-2.5 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />

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
                                                    selectCountry(country)}
                                                class="px-4 py-2 cursor-pointer hover:bg-gray-100"
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
                                 e.target.value = e.target.value.replace(/^\s+/, '');
                                 description = e.target.value;
                                validateField("description");
                                errors.description = !description
                                    ? "*Required"
                                    : /<script.*?>.*?<\/script>/i.test(
                                            description,
                                        ) 
                                      ? "Script tags are not allowed."
                                      : !/^[A-Za-z" "/?().,:;""''*$#0-9\s]+$/.test(
                                              description,
                                          )
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
                                e.target.value = e.target.value.replace(/^\s+/, '');
                                url = e.target.value;
                               validateField("url");
                               
                                
                           }}
                        />
                        {#if errors.url}
                            <p class="text-red-500 text-xs mt-1">
                                {errors.url}
                            </p>
                        {/if}
                    </div>
                </div>
                <span class="flex-1 w-1/3 mb-4">
                    <label for="recaptcha" class="block text-sm font-medium text-gray-700">
                    </label>
                    <input type="hidden" name="token" value={captchaToken} />
                    <div id="g-recaptcha-response">
                        <label class="flex mt-5 md:mt-6 items-center justify-end space-x-2 mb-4 cursor-pointer">
                            <input
                                type="checkbox"
                                name="captcha"
                                value="captcha"
                                class="w-5 h-5 border-2 border-gray-400 text-primary-600 focus:ring-primary-500 rounded cursor-pointer hover:border-primary-500 transition-colors duration-300"
                                bind:checked={isChecked}
                                on:click={(event) => {
                                    event.preventDefault();
                                    if (formValid()) {
                                        isChecked = true;
                                        showPopup();
                                    } else {
                                        if (Object.keys(errors).length > 0) {
                                            toast.error('Please fill all the required fields.');
                                            return;
                                        }
                                        if (!(ProfileEmailVerified || authedUserEmailVerified === true)) {
                                            {
                                                toast.error('Please verify your email to proceed');
                                                return;
                                            }
                                        }
                
                                        isChecked = false;
                                    }
                                }}
                                	on:keydown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                        }
                                    }}
                            />
                            <span class="text-gray-700 font-medium text-sm">Please verify you are human</span>
                        </label>

                        <div class="mt-4 rounded flex items-center justify-end">
                            <button
                                class="px-4 py-3 rounded bg-primary-400 to-primary-500 text-white font-medium shadow-lg hover:shadow-xl  md:w-1/4 w-1/2 transform transition hover:bg-primary-600"
                                on:click={(event) => {
                                    event.preventDefault();
                
                            
                                    if (!formValid()) {
                                        if (Object.keys(errors).length > 0) {
                                            toast.error('Please fill all the required fields.');
                                            return;
                                        }
                
                                        if (!(ProfileEmailVerified || authedUserEmailVerified === true)) {
                                            {
                                                toast.error(
                                                    'Please verify either your email or your phone number to proceed'
                                                );
                                                return;
                                            }
                                        }
                                    }
                
                                    if (!isChecked) {
                                        toast.error(
                                            'Please complete the CAPTCHA to proceed with the submission.'
                                        );
                                        return;
                                    }
                
                                    handlesubmit({ event });
                                }}
                              	on:keydown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                    }
                                }}
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
                        </div>
                
                        {#if errorMessage}
                            <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
                        {/if}
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
