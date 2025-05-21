<script>
  import Icon from "@iconify/svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";
  import {
    countries,
    phoneNumberPatterns,
  } from "$lib/Data/constants.js";

  export let productName;
  export let toggleQuoteModal;
  export let form5;
  export let productQuote;
  export let selectedProduct;
  export let profile;
  let successMessage = "";
  let errorMessage = "";
  let units = "";
  let firstName = profile?.firstName || "";
  let lastName = profile?.lastName || "";
  let organisation = profile?.companyName || "";
  let phone = profile?.cellPhone || "";
  let message = "";
  let isLoading = false;
  let emailSent = false;
  let verificationMessage = "";
  let ProfileEmailVerified = profile?.isEmailVerified || false;
  let isOtpVerified = profile?.isEmailVerified || false;
  let displayMessage = "";
  let enteredOtp = "";
  let email = profile?.email || "";
  let formErrors = {};
  let isSubmitting = false;
  let country = profile?.country || "";
  let searchTerm = "";
  let dropdownEl;
  let highlightedIndex = -1;
  let modalContent;

  const handleResendemailOtp = () => {
    form5.requestSubmit();
  };

  function handleInput(e) {
    enteredOtp = e.target.value.replace(/[^0-9]/g, "").trim();
  }

  function validateForm() {
    formErrors = {};

    validateUnits();
    validateFirstName();
    validateLastName();
    validateOrganisation();
    validateEmail();
    validateCountry();
    validatePhoneNumber(country, phone);

    if (!(isOtpVerified === true)) {
      toast.error("Please verify your email to proceed");
    }

    return Object.keys(formErrors).length === 0 && isOtpVerified === true;
  }

  async function handleQuoteSubmission({ cancel, formData }) {
    if (!validateForm()) {
      cancel();
      return;
    }
    isSubmitting = true;
    formData.append('email', email);
    return async ({ result, update }) => {
      console.log("result", result);

      if (result.type === "success") {
        if (result.data.success) {
          await update();
          toast.success(result.data.message);
          location.reload();
        } else {
          toast.error(result.data.message);
        }
      }
      isSubmitting = false;
    };
  }

  let currencies = [
    "AFN",
    "ALL",
    "DZD",
    "EUR",
    "AOA",
    "XCD",
    "ARS",
    "AMD",
    "AUD",
    "EUR",
    "AZN",
    "BSD",
    "BHD",
    "BDT",
    "BBD",
    "BYN",
    "EUR",
    "BZD",
    "XOF",
    "BTN",
    "BOB",
    "BAM",
    "BWP",
    "BRL",
    "BND",
    "BGN",
    "XOF",
    "BIF",
    "CVE",
    "KHR",
    "XAF",
    "CAD",
    "XAF",
    "XAF",
    "CLP",
    "CNY",
    "COP",
    "KMF",
    "CDF",
    "XAF",
    "CRC",
    "HRK",
    "CUP",
    "EUR",
    "CZK",
    "DKK",
    "DJF",
    "XCD",
    "DOP",
    "USD",
    "EGP",
    "USD",
    "XAF",
    "ERN",
    "EUR",
    "SZL",
    "ETB",
    "FJD",
    "EUR",
    "EUR",
    "XAF",
    "GMD",
    "GEL",
    "EUR",
    "GHS",
    "EUR",
    "XCD",
    "GTQ",
    "GNF",
    "XOF",
    "GYD",
    "HTG",
    "HNL",
    "HUF",
    "ISK",
    "INR",
    "IDR",
    "IRR",
    "IQD",
    "EUR",
    "ILS",
    "EUR",
    "JMD",
    "JPY",
    "JOD",
    "KZT",
    "KES",
    "AUD",
    "KWD",
    "KGS",
    "LAK",
    "EUR",
    "LBP",
    "LSL",
    "LRD",
    "LYD",
    "CHF",
    "EUR",
    "EUR",
    "MGA",
    "MWK",
    "MYR",
    "MVR",
    "XOF",
    "EUR",
    "USD",
    "MRU",
    "MUR",
    "MXN",
    "USD",
    "MDL",
    "EUR",
    "MNT",
    "EUR",
    "MAD",
    "MZN",
    "MMK",
    "NAD",
    "AUD",
    "NPR",
    "EUR",
    "NZD",
    "NIO",
    "XOF",
    "NGN",
    "MKD",
    "NOK",
    "OMR",
    "PKR",
    "USD",
    "ILS",
    "PAB",
    "PGK",
    "PYG",
    "PEN",
    "PHP",
    "PLN",
    "EUR",
    "QAR",
    "RON",
    "RUB",
    "RWF",
    "XCD",
    "XCD",
    "XCD",
    "WST",
    "EUR",
    "STN",
    "SAR",
    "XOF",
    "RSD",
    "SCR",
    "SLL",
    "SGD",
    "EUR",
    "EUR",
    "SBD",
    "SOS",
    "ZAR",
    "KRW",
    "EUR",
    "LKR",
    "SDG",
    "SRD",
    "SEK",
    "CHF",
    "SYP",
    "TWD",
    "TJS",
    "TZS",
    "THB",
    "XOF",
    "TOP",
    "TTD",
    "TND",
    "TRY",
    "TMT",
    "AUD",
    "UGX",
    "UAH",
    "AED",
    "GBP",
    "USD",
    "UYU",
    "UZS",
    "VUV",
    "EUR",
    "VES",
    "VND",
    "YER",
    "ZMW",
    "ZWL",
  ];

  currencies = currencies.sort();
  let filteredCountries = countries;
  let showDropdown = false;

  function getCountryByCode(code) {
    const country = countries.find((c) => c.code === code || c.name === code);
    return country ? country.name : null;
  }

  function getPhonePattern(countryCode) {
    const countryName = getCountryByCode(countryCode);
    if (!countryName) return "^[0-9]+$";
    const regex = phoneNumberPatterns[countryName];
    return regex ? regex.source : "^[0-9]+$";
  }

  function validatePhoneNumber(countryName, phone) {
    let newErrors = { ...formErrors };

    if (!phone) {
      newErrors.phone = "*Required";
    } else if (!countryName) {
      newErrors.phone = "Select a country before entering your phone number";
    } else {
      const matchedCountry = countries.find((c) => c.name === countryName);
      if (!matchedCountry) {
        newErrors.phone = "Invalid country selected to validate phone";
      } else {
        const phonePattern = getPhonePattern(matchedCountry.code);
        const phoneRegex = new RegExp(phonePattern);
        if (!phoneRegex.test(phone)) {
          newErrors.phone = `Please enter a valid phone number for ${countryName}.`;
        } else {
          delete newErrors.phone;
          delete newErrors.country;
        }
      }
    }
    formErrors = newErrors;
  }

  function validateCountry() {
    if (!country || country.trim() === "") {
      formErrors.country = "*Required";
    } else {
      const match = countries.find(
        (c) => c.name.toLowerCase() === country.toLowerCase()
      );
      if (!match) {
        formErrors.country = "Invalid country selected";
      } else {
        delete formErrors.country;
      }
    }
  }

  function validateUnits() {
    if (!units) {
      formErrors.units = "*Required";
    } else if (Number(units) < 1 || Number(units) > 999) {
      formErrors.units = "Units must be between 1 and 999.";
    } else {
      delete formErrors.units;
    }
  }

  function validateFirstName() {
    if (!firstName || firstName.trim() === "") {
      formErrors.firstName = "*Required";
    } else if (/[\d]/.test(firstName)) {
      formErrors.firstName = "First name cannot contain numbers.";
    } else {
      delete formErrors.firstName;
    }
  }

  function validateLastName() {
    if (!lastName || lastName.trim() === "") {
      formErrors.lastName = "*Required";
    } else if (/[\d]/.test(lastName)) {
      formErrors.lastName = "Last name cannot contain numbers.";
    } else {
      delete formErrors.lastName;
    }
  }

  function validateOrganisation() {
    if (!organisation || organisation.trim() === "") {
      formErrors.organisation = "*Required";
    } else if (/[^a-zA-Z0-9\s]/.test(organisation)) {
      formErrors.organisation =
        "Organisation name cannot contain special characters.";
    } else {
      delete formErrors.organisation;
    }
  }

  function validateEmail() {
    if (!email.trim()) {
      formErrors.email = "*Required";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      formErrors.email = "Enter a valid email address.";
    } else {
      delete formErrors.email;
    }
  }

  function handleInputChange(event) {
    searchTerm = event.target.value.trim();
    const searchLower = searchTerm.toLowerCase();
    const normalizedSearch = searchTerm.replace(/^\+/, '');
    country = searchTerm;

    filteredCountries = countries
      .filter((c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.code.replace(/^\+/, '').includes(normalizedSearch) 
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aCode = a.code.replace(/^\+/, '');
        const bCode = b.code.replace(/^\+/, '');

        const aExact = aName === searchLower || aCode === normalizedSearch;
        const bExact = bName === searchLower || bCode === normalizedSearch;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = aName.startsWith(searchLower) || aCode.startsWith(normalizedSearch);
        const bStarts = bName.startsWith(searchLower) || bCode.startsWith(normalizedSearch);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.name.localeCompare(b.name);
      });

    if (
      filteredCountries.length > 0 &&
      (
        filteredCountries[0].name.toLowerCase() === searchLower ||
        filteredCountries[0].code.replace(/^\+/, '') === normalizedSearch
      )
    ) {
      selectCountry(filteredCountries[0]);
      showDropdown = false;
      highlightedIndex = -1;
      return;
    }

    showDropdown = true;
    highlightedIndex = -1;

    validateCountry();
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
    if (showDropdown) {
      filteredCountries = countries;
      highlightedIndex = -1;
    }
  }

  function handleKeyDown(event) {
    if (!showDropdown) return;

    if (event.key === "ArrowDown") {
      highlightedIndex = (highlightedIndex + 1) % filteredCountries.length;
      scrollToHighlighted();
    } else if (event.key === "ArrowUp") {
      highlightedIndex =
        (highlightedIndex - 1 + filteredCountries.length) %
        filteredCountries.length;
      scrollToHighlighted();
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0) {
        selectCountry(filteredCountries[highlightedIndex]);
      } else if (filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
      }
    }
  }

  function scrollToHighlighted() {
    setTimeout(() => {
      const list = dropdownEl?.querySelectorAll("li");
      if (list && list[highlightedIndex]) {
        list[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, 0);
  }

  function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    searchTerm = selectedCountry.name;
    // updateCurrency(country);
    validateCountry();
    // validatePhoneNumber(country, phone);
    showDropdown = false;
  }
  // updateCurrency(country);

  const sanitizeInput = (e) => {
    let value = e.target.value;
    value = value.replace(/<script.*?>.*?<\/script>/gi, '');
    value = value.replace(/[&*+\-<>|^+-/%{}/]/g, '');
    message = value;
  };
</script>

<!-- {#each data.records as product} -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
  on:click={toggleQuoteModal}
  on:keydown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }}
  tabindex="0"
>
  <div
    class="bg-white rounded-md p-6 w-full sm:w-3/5 md:w-3/5 lg:w-2/5 h-5/6 overflow-y-auto"
    bind:this={modalContent}
    on:click|stopPropagation
  >
    <!-- your modal content -->
    <h2 class="text-xl font-bold mb-4 text-heading">Request a Quote</h2>
    <!-- Form -->
    <form
      method="POST"
      action="/products/subid/subsubid/product?/createQuote"
      use:enhance={handleQuoteSubmission}
    >
      <div class="mb-4">
        <p class="text-sm">
          <strong class="text-sm">Product Name:</strong>
          {#if productName}
            {productQuote.productName}
          {:else}
            {selectedProduct.name || "--"}
          {/if}
        </p>
      </div>
      <input
        type="text"
        hidden
        name="productName"
        value={productQuote.productName
          ? productQuote.productName
          : selectedProduct.name || "--"}
      />
      <input
        type="text"
        hidden
        name="productNumber"
        value={productQuote.productNumber
          ? productQuote.productNumber
          : selectedProduct.partNumber || "--"}
      />
      <input type="text" hidden name="status" value="unread" />
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Units</label
        >
        <input
          type="number"
          min="1"
          max="999"
          maxlength="10"
          name="units"
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          bind:value={units}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          placeholder="Units Required"
          on:input={validateUnits}
        />
        {#if formErrors.units}
          <p class="text-red-500 text-xs">{formErrors.units}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="Firstname" class="block text-sm font-medium text-gray-700"
          >First Name</label
        >
        <input
          type="text"
          name="Firstname"
          maxlength="50"
          bind:value={firstName}
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm mt-1 placeholder:text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          placeholder="First Name"
          on:input={validateFirstName}
        />
        {#if formErrors.firstName}
          <p class="text-red-500 text-xs">{formErrors.firstName}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="lastname" class="block text-sm font-medium text-gray-700"
          >Last Name</label
        >
        <input
          type="text"
          name="lastname"
          maxlength="50"
          bind:value={lastName}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 text-sm placeholder:text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          placeholder="Last Name"
          on:input={validateLastName}
        />
        {#if formErrors.lastName}
          <p class="text-red-500 text-xs">{formErrors.lastName}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label
          for="organisation"
          class="block text-sm font-medium text-gray-700">Organisation</label
        >
        <input
          type="text"
          name="organisation"
          maxlength="50"
          bind:value={organisation}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          placeholder="Organisation Name"
          on:input={validateOrganisation}
        />
        {#if formErrors.organisation}
          <p class="text-red-500 text-xs">{formErrors.organisation}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="country" class="block text-sm font-medium text-gray-700"
          >Country</label
        >
        <div class="relative">
          <input
            type="text"
            name="country"
            bind:value={country}
            placeholder="Search Country"
            on:input={handleInputChange}
            on:click={toggleDropdown}
            on:keydown={handleKeyDown}
            class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          />
          <Icon
            icon={showDropdown ? "ep:arrow-up-bold" : "ep:arrow-down-bold"}
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs mr-1"
          />
          {#if showDropdown}
            <ul
              bind:this={dropdownEl}
              class="absolute bg-white border w-full mt-px z-10 max-h-60 overflow-y-auto rounded-md shadow"
            >
              {#each filteredCountries as countryItem, index}
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <li
                  class="px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 {highlightedIndex ===
                  index
                    ? 'bg-primary-50'
                    : ''}"
                  on:click={() => selectCountry(countryItem)}
                >
                  {countryItem.name} ({countryItem.code})
                </li>
              {/each}
              {#if filteredCountries.length === 0}
                <div class="flex items-center px-4 py-3">
                  <Icon
                    icon="tabler:info-square-rounded-filled"
                    class="text-red-500 text-base mr-2"
                  />
                  <li class="text-gray-800 text-xs">
                    No matching countries found!
                  </li>
                </div>
              {/if}
            </ul>
          {/if}
        </div>
        {#if formErrors.country}
          <p class="text-red-500 text-xs">{formErrors.country}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-700"
          >Phone Number</label
        >
        <input
          id="phone"
          type="tel"
          name="phone"
          bind:value={phone}
          on:input={() => validatePhoneNumber(country, phone)}
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          placeholder="Enter phone number without country code"
          maxlength="16"
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
        />
        <div class="text-base">
          <Icon
            icon="carbon:location-info-filled"
            class="inline-block text-primary-400"
          />
          <span class="text-2s text-gray-600"
            >Enter phone number without country code</span
          >
        </div>
        {#if formErrors.phone}
          <p class="text-red-500 text-xs">{formErrors.phone}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <div class="relative">
          <form
            action="/signup?/verifyemail"
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
              name="email"
              maxlength="80"
              bind:value={email}
              class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
              placeholder="Your email"
              on:input={() => {
                validateEmail();
                ProfileEmailVerified = false;
                emailSent = false;
                isOtpVerified = false;
              }}
            />
            {#if isLoading}
              <span
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-500 flex items-center"
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
        {#if formErrors.email}
          <p class="text-red-500 text-xs">{formErrors.email}</p>
        {/if}
      </div>

      {#if emailSent && isOtpVerified === false}
        <form
          action="/signup?/verifyOtp"
          method="POST"
          use:enhance={({formData}) => {
            formData.append('email', email);
            return async ({ result }) => {
              console.log(result);
              isOtpVerified = result.data.isEmailVerified;
              if (result.data?.status === 200) {
                toast.success(result.data.message);
                enteredOtp = "";
                isOtpVerified = true;
                ProfileEmailVerified = true;
              } else if (result.data?.status === 500) {
                toast.error(result.data.message);
              }
              console.log(isOtpVerified, "isOtpVerified");
            };
          }}
        >
          <div class="relative w-full mb-4">
            <label
              for="enteredOtp"
              class="block text-sm font-medium text-gray-600"
              >Enter the Recieved 6-digit OTP</label
            >
            <input
              type="text"
              maxlength="6"
              name="enteredOtp"
              bind:value={enteredOtp}
              on:input={handleInput}
              placeholder="Enter 6-digit OTP"
              class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
				  focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400
				  placeholder:text-sm h-10"
            />
            <button
              type="submit"
              class="absolute top-1/2 right-2 -translate-y-1/2 text-primary-500 font-bold text-2s py-1 rounded hover:underline"
            >
              Verify
            </button>

            <p class="mt-px text-2s text-right text-gray-600">
              Didn't receive the code?
              <button
                type="button"
                on:click={handleResendemailOtp}
                class="text-primary-500 font-medium hover:underline"
              >
                Get a new code
              </button>
            </p>
          </div>
        </form>
      {/if}

      <div class="mb-4">
        <label
          for="futherdetails"
          class="block text-sm font-medium text-gray-700">Message</label
        >
        <textarea
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm focus:border-primary-400 focus:ring-0 focus:ring-primary-400"
          placeholder="Your message"
          name="futherdetails"
          bind:value={message}
    on:input={sanitizeInput}
        ></textarea>
      </div>
      {#if successMessage}
        <div class="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      {/if}

      {#if errorMessage}
        <div class="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {errorMessage}
        </div>
      {/if}
      <div class="flex justify-between items-center mt-4">
        <button
          on:click={toggleQuoteModal}
          class="bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm py-1.5 px-4 rounded"
        >
          Close
        </button>
        <button
          type="submit"
          class="bg-primary-500 hover:bg-primary-600 text-white text-sm rounded py-1.5 px-4"
        >
          {#if isSubmitting}
            <Icon
              icon="line-md:loading-alt-loop"
              class="w-5 h-5 mr-2 animate-spin inline"
            />
            Submitting..
          {:else}
            Submit
          {/if}
        </button>
      </div>
    </form>
    <!-- Close button -->
  </div>
</div>
<!-- {/each} -->
<Toaster position="bottom-right" richColors />
