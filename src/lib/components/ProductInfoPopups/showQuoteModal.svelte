<script>
  import Icon from "@iconify/svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";

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

  const handleResendemailOtp = () => {
    form5.requestSubmit();
  };

  function handleInput(e) {
    enteredOtp = e.target.value.replace(/[^0-9]/g, "").trim();
  }

  function validateForm() {
    formErrors = {};

    if (!units) {
      formErrors.units = "*Required";
    }

    if (!firstName.trim()) {
      formErrors.firstName = "First name is required.";
    } else if (/[\d]/.test(firstName)) {
      formErrors.firstName = "First name cannot contain numbers.";
    } else {
      delete formErrors.firstName;
    }

    if (!lastName.trim()) {
      formErrors.lastName = "Last name is required.";
    } else if (/[\d]/.test(lastName)) {
      formErrors.lastName = "Last name cannot contain numbers.";
    } else {
      delete formErrors.lastName;
    }

    if (!organisation.trim()) {
      formErrors.organisation = "Organisation name is required.";
    } else if (/[^a-zA-Z0-9\s]/.test(organisation)) {
      formErrors.organisation =
        "Organisation name cannot contain special characters.";
    } else {
      delete formErrors.organisation;
    }

    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      formErrors.phone = "Enter a valid phone number";
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      formErrors.email = "Enter a valid email address.";
    }

    if (!(isOtpVerified === true)) {
      toast.error("Please verify your email to proceed");
    }

    return Object.keys(formErrors).length === 0 && isOtpVerified === true;
  }

  async function handleQuoteSubmission({ cancel }) {
    if (!validateForm()) {
      cancel();
      return;
    }
    isSubmitting = true;
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
</script>

<!-- {#each data.records as product} -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
  on:click={toggleQuoteModal}
>
  <div
    class="bg-white rounded-md p-6 w-full sm:w-3/5 md:w-3/5 lg:w-2/5 h-5/6 overflow-y-auto"
    on:click|stopPropagation
  >
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
          name="units"
          bind:value={units}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm"
          placeholder="Units Required"
          on:input={() => {
            if (!units || units < 1 || units > 999) {
              formErrors.units = "Units must be between 1 and 999.";
            } else {
              formErrors.units = "";
            }
          }}
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
          bind:value={firstName}
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm mt-1 placeholder:text-sm"
          placeholder="First Name"
          on:input={() => {
            if (!firstName.trim()) {
              formErrors.firstName = "First name is required.";
            } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
              formErrors.firstName = "First name should contain only letters.";
            } else {
              formErrors.firstName = "";
            }
          }}
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
          bind:value={lastName}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 text-sm placeholder:text-sm"
          placeholder="Last Name"
          on:input={() => {
            if (!lastName.trim()) {
              formErrors.lastName = "Last name is required.";
            } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
              formErrors.lastName = "Last name should contain only letters.";
            } else {
              formErrors.lastName = "";
            }
          }}
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
          bind:value={organisation}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm"
          placeholder="Organisation Name"
          on:input={() => {
            if (!organisation.trim()) {
              formErrors.organisation = "Organisation name is required.";
            } else if (!/^[A-Za-z0-9\s]+$/.test(organisation)) {
              formErrors.organisation =
                "Organisation name should not contain special characters.";
            } else {
              formErrors.organisation = "";
            }
          }}
        />
        {#if formErrors.organisation}
          <p class="text-red-500 text-xs">{formErrors.organisation}</p>
        {/if}
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-700"
          >Phone Number</label
        >
        <input
          type="tel"
          name="phone"
          bind:value={phone}
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm"
          placeholder="Phone Number"
          on:input={() => {
            if (!phone.trim()) {
              formErrors.phone = "Phone number is required.";
            } else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
              formErrors.phone = "Enter a valid phone number";
            } else {
              formErrors.phone = "";
            }
          }}
        />
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
              bind:value={email}
              class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm"
              placeholder="Your email"
              on:input={() => {
                if (!email.trim()) {
                  formErrors.email = "Email is required.";
                } else if (
                  !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)
                ) {
                  formErrors.email = "Enter a valid email address.";
                } else {
                  formErrors.email = "";
                }
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
        <input type="hidden" name="email" bind:value={email} />
        {#if formErrors.email}
          <p class="text-red-500 text-xs">{formErrors.email}</p>
        {/if}
      </div>

      {#if emailSent && isOtpVerified === false}
        <form
          action="/signup?/verifyOtp"
          method="POST"
          use:enhance={() => {
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
            <input type="hidden" name="email" bind:value={email} />
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
				  focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400
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
          class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1 placeholder:text-sm text-sm"
          placeholder="Your message"
          name="futherdetails"
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
          class="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-1.5 px-4 rounded"
        >
          Close
        </button>
        <button
          type="submit"
          class="bg-primary-500 hover:bg-primary-600 text-white font-medium rounded py-1.5 px-4"
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
