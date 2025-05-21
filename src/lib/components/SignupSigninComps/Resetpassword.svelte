<script>
  import { createEventDispatcher } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import { authedUser } from "$lib/stores/mainStores.js";
  import { toast } from "svelte-sonner";
  import { Toaster } from "svelte-sonner";
  export let data;
  // console.log(data, "ddataaa");
  // console.log(data.authedUser,"authedUser");
  let token = data?.token || "";
  // console.log(token, "tpoken");
  let userEmail = data.authedUser?.id;
  // console.log(userId,"userId");
  let message = "";
  let flag = false;
  const dispatch = createEventDispatcher();
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";

  $: successMessage = "";
  $: errorMessage = "";

  let hide = true;

  let error = {};
  let newPassword = "";
  let confirmPassword = "";

  function validateNewPassword() {
    let newErrors = { ...error };

    if (!newPassword) {
      newErrors.password = "*Required";
    } else if (!/^[A-Za-z\d!@#$%^&*]*$/.test(newPassword)) {
      newErrors.password = "Only !@#$%^&* characters are allowed";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/.test(
        newPassword
      )
    ) {
      newErrors.password =
        "Ensure your password matches the format outlined below";
    } else {
      delete newErrors.password;
    }

    error = newErrors;
  }

  function validateConfirmPassword() {
    let newErrors = { ...error };

    if (!confirmPassword) {
      newErrors.passwordConfirm = "*Required";
    } else if (confirmPassword !== newPassword) {
      newErrors.passwordConfirm =
        "Current password does not match the entered password";
    } else {
      delete newErrors.passwordConfirm;
    }

    error = newErrors;
  }

  const validation = () => {
    error = {};
    validateNewPassword();
    validateConfirmPassword();
    return Object.keys(error).length === 0
  };
  
  let showNewPassword = false;
  let showConfirmPassword = false;

  function toggleNewPasswordVisibility() {
    showNewPassword = !showNewPassword;
  }

  function toggleConfirmPasswordVisibility() {
    showConfirmPassword = !showConfirmPassword;
  }
</script>

<button
  on:click={() => goto("/")}
  class="absolute top-0.5 right-4 md:right-4 flex z-50 items-center justify-center py-2 px-2 sm:px-4 text-primary-600 bg-white hover:bg-primary-700 hover:text-white sm:rounded-md rounded-full transition duration-200 shadow-md"
>
  <div class="flex items-center space-x-2">
    <Icon icon="mdi:home" class="text-xl" />
    <span class="hidden sm:inline text-sm font-medium">Back to Home</span>
  </div>
</button>
{#if token || userEmail}
  <div
    class="max-w-80 my-20 sm:max-w-xs md:max-w-sm lg:max-w-sm rounded-lg shadow-xl mx-auto z-50 border border-gray-200 overflow-hidden"
  >
    {#if !successMessage}
      <div
        class="bg-primary-400 text-white p-6 flex flex-col items-center justify-center"
      >
        <Icon icon="mdi:lock-reset" class="text-4xl mb-2" />
        <h1 class="text-center text-white text-xl lg:text-2xl font-semibold">
          Password Reset
        </h1>
        <p class="text-center text-white text-opacity-80 text-sm mt-2">
          Create a new secure password
        </p>
      </div>
    {/if}

    <div class="px-6 py-6 bg-white">
      {#if successMessage}
        <div
          class="p-6 text-gray-900 bg-green-50 border border-green-300 rounded-lg shadow-md text-center animate-fadeIn"
        >
          <!-- Center the icon properly -->
          <div class="flex justify-center">
            <Icon
              icon="mdi:check-circle"
              class="text-green-500 text-6xl drop-shadow-lg"
            />
          </div>

          <h2 class="text-lg font-semibold text-green-700 mt-3">
            Your password has been reset successfully!
          </h2>

          <p class="text-sm text-gray-700 mt-2">
            You will be redirected to the
            <span class="font-semibold text-green-600">
              {#if userEmail}
                Dashboard
              {:else}
                Sign In Page
              {/if}
            </span> shortly.
          </p>

          <div
            class="mt-4 text-sm text-gray-600 flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:clock-outline" class="text-gray-500 w-5 h-5" />
            <span>Redirecting in a moment...</span>
          </div>
        </div>
      {/if}

      {#if errorMessage}
        <div
          class="p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg shadow-md flex items-center animate-fadeIn"
        >
          <div class="flex justify-center">
            <Icon
              icon="mdi:alert-circle"
              class="text-red-500 mr-3 text-xl drop-shadow-lg"
            />
          </div>
          <span class="text-sm font-medium">{errorMessage}</span>
        </div>
      {/if}

      <form
        action="?/updatePassword"
        method="POST"
        use:enhance={({ cancel, formData }) => {
          if (!validation()) {
            successMessage = "";
            cancel();
            return;
          }
          formData.append('token', token);
          formData.append('userEmail', userEmail);
          formData.append('email', $authedUser?.email);
          return async ({ result }) => {
            console.log("result", result);
            if (result.data.success === true) {
              toast.success(result.data.message);

              if (data?.authedUser && data?.authedUser.id) {
                setTimeout(() => {
                  goto("/dashboard");
                }, 4000);
              } else {
                setTimeout(() => {
                  // goto("/login");
                  goto("/signin");
                }, 4000);
              }

              successMessage = "Password Reset Successfully";
              errorMessage = "";
              flag = true;
              hide = false;
            }
            if (result.data.success === false) {
              successMessage = "";
              toast.error(result.data.message);
            }
            await applyAction(result);
          };
        }}
      >
        {#if hide}
          <div class="mb-5">
            <label
              for="newPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div class="relative">
              {#if showNewPassword}
                <input
                  id="newPassword"
                  type="text"
                  name="newPassword"
                  placeholder="Enter new password"
                  class="w-full px-4 py-2 pr-10 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-0 focus:ring-primary-500 focus:border-primary-500"
                  bind:value={newPassword}
                  on:input={validateNewPassword}
                />
              {:else}
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  class="w-full px-4 py-2 pr-10 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-0 focus:ring-primary-500 focus:border-primary-500"
                  bind:value={newPassword}
                  on:input={validateNewPassword}
                />
              {/if}

              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                on:click={toggleNewPasswordVisibility}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {#if showNewPassword}
                  <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
                {:else}
                  <Icon icon="mdi:eye-outline" class="w-5 h-5" />
                {/if}
              </button>
            </div>
            {#if error.password}
              <p class="text-red-500 text-xs mt-1 flex items-start">
                <Icon
                  icon="mdi:alert-circle"
                  class="w-4 h-4 mr-1 flex-shrink-0 mt-0.5"
                />
                <span>{error.password}</span>
              </p>
            {/if}
            <div class="mt-1 text-xs text-gray-500 flex items-start">
              <Icon
                icon="ri:information-2-fill"
                class="w-4 h-4 mr-1 flex-shrink-0 mt-0.5"
              />
              <span
                >Password should include uppercase, lowercase, number and
                special character with !@#$%^&*</span
              >
            </div>
          </div>

          <div class="mb-5">
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div class="relative">
              {#if showConfirmPassword}
                <input
                  id="confirmPassword"
                  type="text"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2 pr-10 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-0 focus:ring-primary-500 focus:border-primary-500"
                  bind:value={confirmPassword}
                  on:input={validateConfirmPassword}
                />
              {:else}
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2 pr-10 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  bind:value={confirmPassword}
                  on:input={validateConfirmPassword}
                />
              {/if}

              <button
                type="button"
                class="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                on:click={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword
                  ? "Hide password"
                  : "Show password"}
              >
                {#if showConfirmPassword}
                  <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
                {:else}
                  <Icon icon="mdi:eye-outline" class="w-5 h-5" />
                {/if}
              </button>
            </div>
            {#if error.passwordConfirm}
              <p class="text-red-500 text-xs mt-1 flex items-start">
                <Icon
                  icon="mdi:alert-circle"
                  class="w-4 h-4 mr-1 flex-shrink-0 mt-0.5"
                />
                <span>{error.passwordConfirm}</span>
              </p>
            {/if}
          </div>
          <div class="mt-6">
            <button
              type="submit"
              class="w-full py-3 text-sm rounded-md font-medium bg-primary-400 text-white hover:bg-primary-500 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Icon icon="mdi:lock-check" class="text-lg" />
              <span>Reset Password</span>
            </button>
          </div>
        {/if}
      </form>
    </div>
  </div>
{:else}
  <div
    class="max-w-80 sm:max-w-xs md:max-w-sm lg:max-w-sm mx-auto my-28 p-6 bg-white rounded-lg shadow-xl border border-gray-200"
  >
    <div class="flex flex-col items-center justify-center mb-4">
      <Icon icon="mdi:link-off" class="text-red-500 text-4xl mb-2" />
      <h2 class="text-xl font-semibold text-gray-800">
        Invalid or Expired Token
      </h2>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-sm text-red-800">
        Your password reset token has either expired or is invalid. Please
        request a new password reset email.
      </p>
    </div>

    <a
      href="/forgot"
      class="w-full block text-center bg-primary-600 text-white text-sm py-3 px-4 rounded-md hover:bg-primary-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div class="flex items-center justify-center gap-2">
        <Icon icon="mdi:email-send" class="text-lg" />
        <span>Request New Reset Link</span>
      </div>
    </a>
  </div>
{/if}
<Toaster position="bottom-right" richColors />
