<script>
  import { onMount } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  import { countries, phoneNumberPatterns } from "$lib/Data/constants.js";
  let formLoading = false;

  let form;
  export let data;
  let searchTerm = "";
  let errors = {};
  let technical_issue = "";
  let issue = "";
  let assistance = "";
  let attachments = [];
  let totalSize = 0;
  let country = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let country = "";
  let companyName = "";
  let jobTitle = "";
  let companyType = "";
  let lastName = "";
  let firstName = "";
  let currency = "";
  let isAccountSelected = false;
  let isTermsAccepted = false;
  let password = "";
  let passwordConfirm = "";
  let searchTerm = "";
  let phone = "";
  let form5;
  let error = {};
  let isLoading = false;
  let emailSent = false;
  let verificationMessage = "";
  let ProfileEmailVerified = false;
  let isOtpVerified = false;
  let displayMessage = "";
  let enteredOtp = "";
  let errorCount = "";
  let tanNumber = "";
  let gstNumber = "";
  let highlightedIndex = -1;
  let dropdownEl;
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_LINKEDIN_CALLBACK_URL;
  const scope = import.meta.env.VITE_LINKEDIN_SCOPE;
  const baseUrl = import.meta.env.VITE_LINKEDIN_BASE_URL;
  const linkedinUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}`;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%_\-*])[A-Za-z\d!@#$%_\-*]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[A-Za-z]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  function validateUsername() {
    let newErrors = { ...errors }; // Create a new object for reactivity

    if (!username) {
      newErrors.username = "*Required";
    } else if (username.length < 3) {
      newErrors.username = "Please enter at least 3 characters";
    } else if (/^[^a-zA-Z]/.test(username)) {
      newErrors.username = "Username must start with a letter";
    } else if (/[^a-zA-Z0-9_]/.test(username)) {
      newErrors.username =
        "Username can include only letters, numbers, and underscore ( _ )";
    } else if (/^[0-9]+$/.test(username)) {
      newErrors.username = "Username cannot contain only numbers";
    } else if (/^[_]+$/.test(username)) {
      newErrors.username = "Username cannot contain only underscores ( _ )";
    } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = "Username must contain at least 3 letters";
    } else {
      delete newErrors.username;
    }

    errors = newErrors; // Reassign errors to trigger reactivity
  }

  function validateEmail() {
    let newErrors = { ...errors }; // Create a new object for reactivity

    if (!email) {
      newErrors.email = "*Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email.";
    } else {
      delete newErrors.email;
    }

    errors = newErrors; // Reassign errors to trigger reactivity
  }

  function validateFirstName() {
    let newErrors = { ...errors }; // Ensure reactivity

    if (!firstName) {
      newErrors.firstName = "*Required";
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces";
    } else {
      delete newErrors.firstName;
    }

    errors = newErrors; // Update errors object to trigger reactivity
  }

  function validateLastName() {
    let newErrors = { ...errors }; // Ensure reactivity

    if (!lastName) {
      newErrors.lastName = "*Required";
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    } else {
      delete newErrors.lastName;
    }

    errors = newErrors; // Update errors object to trigger reactivity
  }

  function validatePhone() {
    if (!phone) {
      errors.phone = "*Required";
    } else {
      const phonePattern = getPhonePattern(country);
      const phoneRegex = new RegExp(phonePattern);

      if (!phoneRegex.test(phone)) {
        errors.phone = `Please enter a valid phone number for ${country}.`;
      } else {
        delete errors.phone;
      }
    }
  }

  let errors = {};
  let passwordStrength = 0;

  function validatePassword() {
    typing = password.length > 0;

    let newErrors = { ...errors };

    if (!password) {
      newErrors.password = "*Required";
      passwordStrength = 0;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
  }
  const validateField = (fieldName) => {
    if (!fieldName || fieldName === "firstName") {
      if (!firstName || !/^[A-Za-z\s]+$/.test(firstName)) {
        errors.firstName =
          "First name is required and should contain only letters";
      } else {
        delete errors.firstName;
      }
    }

    if (!fieldName || fieldName === "lastName") {
      if (!lastName || !/^[A-Za-z\s]+$/.test(lastName)) {
        errors.lastName =
          "Last name is required and should contain only letters";
      } else {
        delete errors.lastName;
      }
    }

    if (!fieldName || fieldName === "email") {
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
      if (!country) {
        errors.phoneNumber =
          "Please select the country before entering the phone number";
        return;
      }

      if (!phoneNumber || phoneNumber === "") {
        errors.phoneNumber = "Required for the selected country";
      } else {
        const countryDetails = getCountryByCode(country);
        if (!countryDetails) {
          errors.phoneNumber = "Invalid country selected";
          errors.country = "Invalid country selected";
        } else {
          const phonePattern = getPhonePattern(country);
          if (!phonePattern) {
            errors.phoneNumber = "Phone number pattern for country not found";
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

    if (!fieldName || fieldName === "country") {
      if (!country) {
        errors.country = "Country is required";
      } else {
        delete errors.country;
      }
    }

    if (!fieldName || fieldName === "accountNumber") {
      if (!accountNumber || !/^[a-zA-Z0-9]+$/.test(accountNumber)) {
        errors.accountNumber = "Please enter a valid account number.";
      } else {
        delete errors.accountNumber;
      }
    }
    if (!fieldName || fieldName === "companyName") {
			if (!companyName || !/^[A-Za-z0-9@.,\s&-]+$/.test(companyName)) {
				errors.companyName = "Please enter a valid Company name ";
			} else {
				delete errors.companyName;
			}
		}
    if (fieldName === "technical_issue") {
      if (!selectedOption) {
        errors.technical_issue = "Please select an option";
      } else {
        delete errors.technical_issue;
      }
    }

    if (!fieldName || fieldName === "assistance") {
  if (
    !assistance ||
    !/^[A-Za-z0-9\s&-.,!@():;""'']+$/.test(assistance) ||
    /<script.*?>.*?<\/script>/i.test(assistance) ||
    /<[^>]*>/i.test(assistance)
  ) {
    errors.assistance = "Please enter valid assistance details.";
  } else {
    delete errors.assistance;
  }
}

    if (!fieldName || fieldName === "issue") {
      if (!issue) {
        errors.issue = "Please select any one Option ";

        // toast.error('Please select the option');
      } else {
        delete errors.issue; // Clear error once a valid option is selected
      }
    }
  };

  function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    // filteredCountries = countries;
    searchTerm = `${selectedCountry.name} `;
    showDropdown = false;
    validateField("country");
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
        country.code
          .replace("+", "")
          .includes(searchTerm.replace("+", "").toLowerCase()),
    );
    if (
      filteredCountries.length === 1 &&
      (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
        filteredCountries[0].code.replace("+", "").toLowerCase() ===
          searchTerm.replace("+", "").toLowerCase())
    ) {
      selectCountry(filteredCountries[0]);
    } else {
      showDropdown = filteredCountries.length > 0; // Show dropdown only if results exist
    }
  }

  // function handleInputChange(event) {
  //   searchTerm = event.target.value;
  //   filterCountries();
  // }
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
  // function filterCountriesWithoutAutoSelect() {
  //   filteredCountries = countries.filter(
  //     (country) =>
  //       country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       country.code
  //         .replace("+", "")
  //         .includes(searchTerm.replace("+", "").toLowerCase()),
  //   );
  // }
  function filterCountriesWithoutAutoSelect() {

const countriesStartingWith = countries.filter(
    (country) => country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
);

const countriesContaining = countries.filter(
    (country) => 
        !country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) && 
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
);

filteredCountries = [...countriesStartingWith, ...countriesContaining];
const codeMatches = countries.filter(
    (country) => country.code.replace('+', '').includes(searchTerm.replace('+', '').toLowerCase())
);
codeMatches.forEach(country => {
    if (!filteredCountries.some(c => c.name === country.name)) {
        filteredCountries.push(country);
    }
});
}

  function handleKeyDowncountry(event) {
    const exactCountryMatch = countries.some((c) => c.name === country);

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
        event.ctrlKey
      )
    ) {
      event.preventDefault();
      return false;
    }

    if (
      event.key === "Enter" &&
      searchTerm.length >= 3 &&
      filteredCountries.length > 0
    ) {
      selectCountry(filteredCountries[0]);
      event.preventDefault();
    } else if (event.key === "Escape") {
      showDropdown = false;
    }
  }

  function filterCountries() {
    filteredCountries = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code
          .replace("+", "")
          .includes(searchTerm.replace("+", "").toLowerCase())
    );
    if (
      filteredCountries.length === 1 &&
      (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
        filteredCountries[0].code.replace("+", "").toLowerCase() ===
          searchTerm.replace("+", "").toLowerCase())
    ) {
      selectCountry(filteredCountries[0]);
    } else {
      showDropdown = filteredCountries.length > 0 || searchTerm.length > 0;
    }
  }

  function validateGstNumber() {
    if (companyName && !gstNumber) {
      errors.gstNumber =
        "*GST Number is required when company name is provided.";
    } else {
      delete errors.gstNumber;
    }

    if (gstNumber) {
      if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
        errors.gstNumber = "Please provide a valid GST Number.";
      } else {
        delete errors.gstNumber;
      }
    } else {
      delete errors.gstNumber;
    }
  }

  function validateTanNumber() {
    if (tanNumber) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
        errors.tanNumber = "Please provide a valid TAN Number.";
      } else {
        delete errors.tanNumber;
      }
    } else {
      delete errors.tanNumber;
    }
  }

  function validateForm() {
    errors = {};
    if (companyName && !/^[a-zA-Z\s]+$/.test(companyName)) {
      errors.companyName = "Company name can only contain letters and spaces";
    } else {
      delete errors.companyName;
    }

    if (companyType && !/^[a-zA-Z\s]+$/.test(companyType)) {
      errors.companyType = "Company type can only contain letters and spaces";
    } else {
      delete errors.companyType;
    }
    if (companyName && !gstNumber) {
      errors.gstNumber =
        "*GST Number is required when company name is provided.";
    } else if (gstNumber && !/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
      errors.gstNumber = "Please provide a valid GST Number.";
    } else {
      delete errors.gstNumber;
    }
    if (tanNumber) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
        errors.tanNumber = "Please provide a valid TAN Number";
      } else {
        delete errors.tanNumber;
      }
    } else {
      delete errors.tanNumber;
    }

    if (!country) {
      errors.country = "*Required";
    } else {
      delete errors.country;

      const countryInput = document.querySelector('input[name="country"]');
      if (countryInput) {
        const previousDropdownState = showDropdown;
        showDropdown = false;
        handleInputChange(
          { target: countryInput, inputType: "insertText" },
          true
        );
        showDropdown = previousDropdownState;
      }

      const countryExists = countries.some((c) => c.name === country);
      if (!countryExists) {
        errors.country = "Invalid country selected";
        errors.phone = "Invalid country selected to validate phone";
      } else {
        delete errors.country;
        delete errors.phone;
        validatePhoneNumber(country, phone);
      }
    }

    validateUsername();
    validateEmail();
    validateFirstName();
    validateLastName();
    validatePhoneNumber(country, phone);
    validatePassword();
    validateConfirmPassword();

    const checkbox = document.querySelector('input[type="checkbox"]');
    if (!checkbox) {
      errors.termsAndConditions = "*Required";
    } else if (!checkbox.checked) {
      errors.termsAndConditions =
        "You need to agree to the Terms of Service and Privacy Policy to proceed";
    } else {
      delete errors.termsAndConditions;
    }

    if (!(isOtpVerified === true)) {
      toast.error("Please verify your email to proceed");
    }

    // console.log(isOtpVerified, "isOtpVerified");
    console.log("Error object:", errors);
    errorCount = Object.keys(errors).length;
    console.log("Number of errors:", errorCount);

    return Object.keys(errors).length === 0 && isOtpVerified === true;
  }

  const handleCheckboxChange = (event) => {
    isTermsAccepted = event.target.checked;
    if (isTermsAccepted) {
      delete errors.termsAndConditions;
    } else {
      errors.termsAndConditions =
        "You need to agree to the Terms of Service and Privacy Policy to proceed";
    }
  };

  async function handleFormSubmission({ cancel }) {
    if (!validateForm()) {
      cancel();
    }
    // if (!validateForm()) {
    //   cancel();
    //   return;
    // }
    return async ({ result, update }) => {
      console.log("result", result);

      if (result.type === "redirect") {
        await applyAction(result);
      }

      if (result.type === "success") {
        if (result.data.success) {
          await update();
          toast.success(result.data.message);

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

  let isDataAvailable = false;
  onMount(() => {
    if (data && data.profile) {
      firstName = `${data.profile.firstName || ""} `.trim();
      lastName = `${data.profile.lastName || ""}`.trim();
      email = data.profile.email || "";
      phoneNumber = data.profile.cellPhone || "";
      companyName = data.profile.companyName || "";

      const profileCountry = data.profile.country?.trim();
      if (profileCountry) {
        const foundCountry = countries.find(
          (c) => c.name.toLowerCase() === profileCountry.toLowerCase(),
        );
        if (foundCountry) {
          country = foundCountry.name;
        }
      }

      isDataAvailable = true;
    } else {
      firstName = "";
      lastName = "";
      email = data?.email || "";
      phoneNumber = "";
      companyName = "";
      country = "";
      isDataAvailable = false;
    }
  }
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });
</script>

<div
  class="flex flex-col w-11/12 md:flex-row justify-center z-50 items-start shadow-md mt-20 mb-12 rounded-lg max-w-3xl bg-white mx-auto border-gray-300 border"
>
  <button
    on:click={() => goto("/")}
    class="absolute top-0.5 right-4 md:right-4 flex z-50 items-center justify-center py-2 px-2 sm:px-3 text-primary-500 bg-white hover:bg-primary-600 hover:text-white sm:rounded-md rounded-full transition duration-200 shadow-md"
  >
    <div class="flex items-center space-x-2">
      <Icon icon="mdi:home" class="text-xl" />
      <span class="hidden sm:inline text-sm font-medium">Back to Home</span>
    </div>
  </button>
  <div
    class="content w-full p-4 md:p-10 flex flex-col justify-center rounded-tr-lg rounded-b-lg md:rounded-l-lg md:rounded-tl-none"
  >
    <h2 class="text-2xl font-bold text-primary-500 sm:pt-0 pt-2 sm:pb-2 pb-4">
      Sign Up
    </h2>
    <p class="text-gray-500 mb-5 md:text-sm text-xs">
      Already have an account? <a
        href="/signin"
        class="text-primary-500 hover:text-primary-600 font-semibold">SignIn</a
      >
    </p>
    <!-- <p class="text-gray-500 mb-5">
      Already have an account? <a
        href="/login"
        class="underline text-primary-500 hover:text-primary-600">Login.</a
      >
    </p> -->

    <form method="POST" action="?/register" use:enhance={handleFormSubmission}>
      <!-- <div class="flex items-center gap-3 mx text-md mt-2 mb-5">
        <label class="flex items-center md:gap-2 font-medium">
          For a Business
          <input
            type="radio"
            name="account"
            value="For a Business"
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
        <label class="flex items-center gap-2 font-medium">
          For Myself
          <input
            type="radio"
            name="account"
            value="For Myself"
            checked
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
      </div> -->
      <!-- {#if showBusinessDetails} -->

      <!-- {/if} -->
      <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
        <div class="flex-1 mb-2 md:mb-0">
          <label for="username" class="block text-sm font-medium text-gray-600"
            >Username</label
          >
          <input
            type="text"
            id="username"
            name="username"
            bind:value={username}
            on:input={() => validateUsername()}
            placeholder="Enter your username"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
          />
          {#if errors.username}
            <div class="text-red-500 text-xs mt-1">{errors.username}</div>
          {/if}
        </div>
        <div class="flex-1 mb-2 md:mb-0 relative">
          <label for="email" class="block text-sm font-medium text-gray-600"
            >Email</label
          >
          <div class="relative">
            <form
              action="?/verifyemail"
              bind:this={form5}
              method="POST"
              use:enhance={({}) => {
                return async ({ result }) => {
                  console.log("result", result);

                  isLoading = false;
                  console.log(result);
                  if (result.data?.status === 200) {
                    toast.success(result.data.message);
                    ProfileEmailVerified = result.data.isEmailVerified;
                    verificationMessage = result.data.message;

                    if (
                      verificationMessage.includes(
                        "Verification email sent successfully. Please check your inbox."
                      )
                    ) {
                      displayMessage = "Please check your inbox.";
                      emailSent = true;
                      isOtpVerified = false;
                    } else {
                      displayMessage = verificationMessage;
                      emailSent = false;
                      isOtpVerified = true;
                    }
                  } else {
                    ProfileEmailVerified = result.data.isEmailVerified;
                    toast.error(result.data.message);
                    emailSent = false;
                  }
                };
              }}
              on:submit={() => {
                isLoading = true;
              }}
            >
              <input
                type="email"
                id="email"
                name="email"
                bind:value={email}
                on:input={() => {
                  validateEmail();
                  ProfileEmailVerified = false;
                  emailSent = false;
                  isOtpVerified = false;
                }}
                placeholder="Enter your email"
                class="mt-1 block w-full p-2 pr-24 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm h-10"
              />

              {#if isLoading}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
                >
                  <Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1" />
                  Sending...
                </span>
              {:else if !ProfileEmailVerified && !emailSent}
                <button
                  type="submit"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-500 font-semibold text-2s pl-2 py-1 rounded hover:underline disabled:cursor-not-allowed"
                  disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                    email
                  ) || email.split("@")[1].includes("gamil")}
                >
                  Verify
                </button>
              {:else if emailSent}
                <span
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
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
                    Check inbox
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
            </form>
          </div>
          <input type="hidden" name="email" bind:value={email} />
          {#if errors.email}
            <div class="text-red-500 text-xs mt-1">{errors.email}</div>
          {/if}
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
                  : !/^[A-Za-z\s]+$/.test(firstName)
                    ? "Please enter a valid last name"
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
                errors.lastname = !lastName
                  ? "*Required"
                  : !/^[A-Za-z]+$/.test(lastName)
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

          <!-- Email Input -->
          <div class="flex flex-col">
            <input
              name="email"
              type="email"
              placeholder="Email"
              bind:value={email}
              class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
              required
              on:input={() => validateField("email")}
              on:input={(e) => {
                e.target.value = e.target.value.replace(
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
              }}
            />
            {#if errors?.email}
              <p class="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
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
              class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
              required


                                          on:input={(e) => {
                              e.target.value = e.target.value.replace(/^\s+/, '');
                              companyName = e.target.value;
                               validateField("companyName");
                               errors.company = !companyName
                                 ? "*Required"
                                 : !/^[A-Za-z0-9@.,!#$%^&*(_)+-\s]+$/.test(
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
            <div class="relative dropdown-container">
              <input
                type="text"
                name="country"
                bind:value={country}
                placeholder="Search Country"
                on:input={handleInputChange}
                on:click={toggleDropdown}
                on:input={(e) => {
                  country = country.trim();

                  validateField("country");
                }}
                autocomplete="off"
                class="flex-1 outline-none w-full border border-gray-300 rounded focus:ring-0 focus:border-primary-400 p-2 text-sm"
                required
              />
              <Icon
                icon={showDropdown
                  ? "ep:arrow-up-bold"
                  : "ep:arrow-down-bold"}
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-1 text-2s font-bold cursor-pointer"
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

      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-600">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          bind:value={phone}
          on:input={() => validatePhoneNumber(country, phone)}
          placeholder="Enter your phone number"
          class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10" />
        {#if errors.phone}
          <div class="text-red-500 text-xs mt-1">{errors.phone}</div>
        {/if}
      </div>

      <!-- <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="gstNumber"
              class="block text-sm font-medium text-gray-600">GST Number</label
            >
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              placeholder="Enter your GST number"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              bind:value={gstNumber}
              on:input={validateGstNumber}
            />
            {#if errors.gstNumber}
              <div class="text-red-500 text-xs mt-1">{errors.gstNumber}</div>
            {/if}
          </div>

          <div class="flex-1 mb-2 md:mb-0 relative">
            <label
              for="tanNumber"
              class="block text-sm font-medium text-gray-600">TAN Number</label
            >
            <div class="relative">
              <input
                type="text"
                id="tanNumber"
                name="tanNumber"
                placeholder="Enter your TAN number"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm h-10"
                on:input={validateTanNumber}
                bind:value={tanNumber}
              />
              {#if errors.tanNumber}
                <div class="text-red-500 text-xs mt-1">{errors.tanNumber}</div>
              {/if}
            </div>
          </div>
        </div> -->

      <!-- <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-600"
          >Password</label
        >
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          on:input={() => validatePassword()}
          placeholder="Enter your password"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 text-sm placeholder:text-sm h-10"
        />
        {#if errors.password}
          <div class="text-red-500 text-xs mt-1">{errors.password}</div>
        {/if}
        <div class="text-gray-400 text-sm mt-1">
          <p>*Contain at least 8 Characters</p>
          <p>*Cannot contain common or guessable text</p>
          <p>*Contain at least one number</p>
          <p>*Contain one of the following special characters !@#$%_-*</p>
        </div>
      </div> -->

      <div class="mb-4 relative">
        <label for="password" class="block text-sm font-medium text-gray-600">
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            name="password"
            type="password"
            bind:value={password}
            on:input={() => validatePassword()}
            placeholder="Enter your password"
            class="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 text-sm placeholder:text-sm h-10"/>
          <button
            type="button"
            on:click={togglePasswordVisibility}
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={passwordVisible ? "Hide password" : "Show password"}>
            {#if passwordVisible}
              <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
            {:else}
              <Icon icon="mdi:eye-outline" class="w-5 h-5" />
            {/if}
          </button>
        </div>
        {#if errors.password}
          <div class="text-red-500 text-xs mt-1">{errors.password}</div>
        {/if}
      </div>
      {#if typing}
        <div class="bg-primary-50 px-2 mt-3 py-2 rounded-md border border-gray-200">
          <ul class="w-full text-xs text-gray-500 text-left list-none ml-1">
            <li class="flex justify-start items-center sm:text-xs text-2s py-1">
              {#if password.length >= 8}
                <span class="text-green-500">
                  <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                </span>
              {:else}
                <span class="text-red-500">
                  <Icon
                    icon="lets-icons:close-ring-duotone"
                    class="w-4 h-4 mr-1"
                  />
                </span>
              {/if}
              Contain at least 8 characters
            </li>
            <li class="flex justify-start items-center sm:text-xs text-2s py-1">
              {#if !password.includes("password")}
                <span class="text-green-500">
                  <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                </span>
              {:else}
                <span class="text-red-500">
                  <Icon icon="lets-icons:close-ring-duotone" class="w-4 h-4 mr-1"/>
                </span>
              {/if}
              Cannot contain common or guessable text
            </li>
            <li class="flex justify-start items-center sm:text-xs text-2s py-1">
              {#if /[!@#$%_*\\-]/.test(password)}
                <span class="text-green-500">
                  <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                </span>
              {:else}
                <span class="text-red-500">
                  <Icon icon="lets-icons:close-ring-duotone" class="w-4 h-4 mr-1"/>
                </span>
              {/if}
              Contain one of the following special characters !@#$%_-*
            </li>
            <li class="flex justify-start items-center sm:text-xs text-2s py-1">
              {#if /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)}
                <span class="text-green-500">
                  <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                </span>
              {:else}
                <span class="text-red-500">
                  <Icon icon="lets-icons:close-ring-duotone" class="w-4 h-4 mr-1" />
                </span>
              {/if}
              Contain at least one uppercase letter, one lowercase letter, one number
            </li>
          </ul>
        </div>
      {/if}
      <div class="mt-2">
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between"></div>
          <div class="flex mb-2">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style="width: {passwordStrength}%"
                class:bg-red-500={passwordStrength <= 33}
                class:bg-yellow-500={passwordStrength > 33 &&
                  passwordStrength <= 66}
                class:bg-green-500={passwordStrength > 66}
              ></div>
            </div>
          </div>
          <div class="mt-1 md:text-xs text-2s font-medium pb-2">
            {#if passwordStrength <= 33}
              <span class="text-red-500">Weak</span>
            {:else if passwordStrength <= 66}
              <span class="text-yellow-500">Moderate</span>
            {:else}
              <span class="text-green-500">Strong</span>
            {/if}
          </div>
        </div>
      </div>
      <div class="mb-4 relative">
        <label
          for="passwordConfirm"
          class="block text-sm font-medium text-gray-600">
          Confirm Password</label>
        <div class="relative">
          <input
            id="passwordConfirm"
            name="confirmpassword"
            type="password"
            bind:value={passwordConfirm}
            on:input={validateConfirmPassword}
            placeholder="Confirm your password"
            class="mt-1 block w-full p-2 pr-10 border text-sm border-gray-300 rounded-md focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10"/>
          <button
            type="button"
            on:click={toggleConfirmPasswordVisibility}
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={confirmPasswordVisible
              ? "Hide confirm password"
              : "Show confirm password"}>
            {#if confirmPasswordVisible}
              <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
            {:else}
              <Icon icon="mdi:eye-outline" class="w-5 h-5" />
            {/if}
          </button>
        </div>

        {#if errors.passwordConfirm}
          <div class="text-red-500 text-xs mt-1">{errors.passwordConfirm}</div>
        {/if}
      </div>
      <div class="mb-4">
        <div class="text-primary-500 sm:text-sm text-xs font-semibold pb-2">
          TERMS AND CONDITION:
        </div>
        <p class="text-gray-500 sm:text-xs text-2s">
          We will occasionally contact you with relevant updates about your
          account and our products and services. You may manage your account
          preferences in your account or unsubscribe at any time. We are
          committed to protecting the privacy of your personal data.
        </p>
      </div>
      <div class="flex gap-2 {errors.termsAndConditions ? 'mb-1' : 'mb-6'}">
        <input type="checkbox" name="termsAndConditions" value={true} on:change={handleCheckboxChange} class="mt-0.5 text-primary-500 rounded focus:ring-0 outline-none" />
        <div class=" sm:text-sm text-xs">
          I have read and agreed to the
          <a class="font-medium text-primary-500 hover:underline" href="/terms/site-and-terms"> Terms of Service </a>
          and
          <a class="font-medium text-primary-500 hover:underline" href="/terms/privacy-notice">Privacy Policy</a>
        </div>
      </div>
      {#if !isTermsAccepted && errors.termsAndConditions}
        <div class="text-red-500 text-xs block mb-4">
          {errors.termsAndConditions}
        </div>
      {/if}

      <button
        type="submit"
        class="w-full bg-primary-400 text-white py-2 rounded-md hover:bg-primary-500 transition duration-200 flex items-center justify-center sm:hidden">
        <Icon icon="material-symbols:account-box" class="text-2xl mr-2" />
        Create Account
      </button>
      <div class="hidden sm:flex sm:space-x-4 sm:justify-between w-full py-2">
        <div class="flex items-center justify-center py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200">
          <a href={linkedinUrl} class="flex items-center space-x-2">
            <Icon icon="bi:linkedin" class="text-xl" />
            <span class="text-sm font-medium">Continue with LinkedIn</span>
          </a>
        </div>
        <div class="relative flex items-center py-1 w-1/6">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="px-2 text-sm text-gray-500 font-bold bg-white">OR</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="submit"
          class="w-full sm:w-auto bg-primary-400 text-white py-2 px-6 rounded-md hover:bg-primary-500 transition duration-200 flex items-center justify-center" >
          <Icon icon="material-symbols:account-box" class="text-2xl mr-2" />
          Create Account
        </button>
      </div>
    </form>
    <div class="relative flex items-center my-4 w-full sm:hidden">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="px-2 text-sm text-gray-500 font-bold bg-white">OR</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>
    <button class="w-full flex items-center justify-center py-2 px-4 text-white bg-blue-600 hover:bg-blue-600 rounded-md transition duration-200 sm:hidden">
      <a href={linkedinUrl} class="flex items-center space-x-2">
        <Icon icon="bi:linkedin" class="text-2xl" />
        <span class="text-sm font-medium">Continue with LinkedIn</span>
      </a>
    </button>
  </div>
</div>
<Toaster position="bottom-right" richColors />
