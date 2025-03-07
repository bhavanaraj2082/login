<script>
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_LINKEDIN_CALLBACK_URL;
  const scope = import.meta.env.VITE_LINKEDIN_SCOPE;
  const baseUrl = import.meta.env.VITE_LINKEDIN_BASE_URL;
  import Icon from "@iconify/svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";

  let isOtpLogin = false;
  let email = "";
  let password = "";
  let otpStatus = "";
  let enteredOtp = "";
  let errors = {};
  let form4;
  let timeLeft;
  let timerInterval;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const linkedinUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}`;

  // const validateForm = () => {
  //   errors = {};
  //   if (!email || !emailRegex.test(email))
  //     errors.email = "Please enter a valid email address.";
  //   if (!password) errors.password = "Please enter a valid password";

  //   if (Object.keys(errors).length > 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  function validateEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    } else {
      delete errors.email;
    }
  }

  const handleFormSubmit = ({ cancel }) => {
    // if (!validateForm()) {
    //   cancel();
    // }
    return async ({ result, update }) => {
      console.log(result);

      // if (result.type === "redirect") {
      //   await update();
      //   await applyAction(result);
      //   return;
      // }

      if (result.type === "redirect") {
        await goto(result.location);
        await update();
        location.reload();
        // return;
      }
      await applyAction(result);

      if (result.type === "failure") {
        toast.error(result.data.errorMsg);
      } else if (result.type === "success") {
        toast.success(result.data.errorMsg);
      }
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

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

  const handleResendOtp = () => {
    if (timeLeft === 0 && !loadingPhone) {
      form4.requestSubmit();
      startTimer();
    }
  };
</script>

<div
  class="flex flex-col md:flex-row max-w-4xl shadow-md mx-auto h-auto md:h-auto my-14 border rounded-lg border-gray-300"
>
  <div class="md:hidden w-full h-1/2 mx-auto flex justify-center">
    <img src="/image.jpg" alt="Sign In" class="object-cover h-full rounded" />
  </div>

  <div
    class="flex flex-col items-center w-full md:w-2/5 rounded-l md:rounded-l-lg p-6 bg-white"
  >
    <div class="w-full mx-auto">
      <h1 class="text-2xl font-bold text-primary-500 mb-4">Sign In</h1>
      <p class="mb-4 text-gray-600">
        Do not have an account? <a
          href="/signup"
          class="text-primary-500 hover:text-primary-600 underline"
          >Create a new one</a
        >
      </p>
      {#if isOtpLogin}
        <form
          method="POST"
          action="?/sendOtp"
          use:enhance={() => {
            return async ({ result, update }) => {
              console.log(result);
              otpStatus = result.status;
              if (result.type === "failure") {
                toast.error(result.data.errorMsg);
              } else if (result.type === "success") {
                toast.success(result.data.errorMsg);
                startTimer();
                // goto(result.location);
                // location.reload();
              }
              await applyAction(result);
            };
          }}
        >
          <div class="mb-5">
            <label for="email" class="mb-2 text-gray-600"
              >Enter your email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              bind:value={email}
              on:input={validateEmail}
              placeholder="username@example.com"
              class="border border-gray-300 rounded-md p-2 w-full focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm"
            />
            {#if errors.email}
              <div class="text-red-500 text-xs mb-4">{errors.email}</div>
            {/if}
          </div>
          {#if otpStatus !== 200}
            <button
              type="submit"
              class="bg-primary-400 hover:bg-primary-500 text-sm font-medium text-white rounded p-2 w-full text-center"
            >
              Send OTP
            </button>{/if}

          {#if otpStatus === 200}
            <form
              action="?/verifyOtp"
              method="POST"
              use:enhance={() => {
                return async ({ result, update }) => {
                  if (result.type === "failure") {
                    toast.error(result.data.errorMsg); // Show error messages for failed verification
                  } else if (result.type === "redirect") {
                    await goto(result.location);
                    location.reload();
                  } else if (result.type === "success") {
                    // Handle successful responses with a redirect (if provided)
                    const { redirectTo } = result.data;
                    if (redirectTo) {
                      await goto(redirectTo);
                      location.reload();
                    } else {
                      toast.error(
                        "Verification successful, but no redirect URL provided!"
                      );
                    }
                  }
                  await applyAction(result);
                };
              }}
            >
              <div class="mb-4 flex flex-col items-center">
                <p class="text-gray-700 sm:text-sm text-xs mb-3 text-left">
                  Enter the OTP sent to your registered email to complete
                  verification.
                </p>
                <input type="hidden" name="email" bind:value={email} />

                <div class="flex w-full justify-between items-center">
                  <!-- OTP Input -->
                  <input
                    type="text"
                    maxlength="6"
                    name="enteredOtp"
                    bind:value={enteredOtp}
                    on:input={() => (enteredOtp = enteredOtp.trim())}
                    placeholder="Enter 6-digit OTP"
                    class="w-full max-w-[220px] px-4 py-1.5 border border-gray-300 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-center"
                  />

                  <!-- Verify Button -->
                  <button
                    class="bg-primary-500 text-white text-xs sm:text-sm py-1.5 px-4 rounded-md shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-300 focus:outline-none"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </form>

            <form
              action="?/sendOtp"
              method="POST"
              use:enhance={() => {
                return async ({ result }) => {
                  console.log(result);
                  otpStatus = result.status;
                  if (result.type === "failure") {
                    toast.error(result.data.errorMsg);
                  } else if (result.type === "success") {
                    toast.success(result.data.errorMsg);
                    startTimer();
                  }
                  await applyAction(result);
                };
              }}
            >
              {#if timeLeft > 0}
                <div class="flex justify-center">
                  <span
                    class="text-xs sm:text-sm font-semibold px-3 mb-1 py-1 pb-2 rounded-md bg-gradient-to-r from-red-400 to-red-500 text-white"
                  >
                    <span class="text-lg">⏳</span> Time remaining {formatTime(
                      timeLeft
                    )}
                  </span>
                </div>
              {:else}
                <div class="flex justify-center mt-3">
                  <input type="hidden" name="email" bind:value={email} />
                  <button
                    on:click={handleResendOtp}
                    type="submit"
                    class="text-xs sm:text-sm pb-2 font-medium text-primary-500 px-3 py-1 hover:underline"
                  >
                    Get a new code?
                  </button>
                </div>
              {/if}
            </form>
          {/if}
        </form>
      {:else}
        <form method="POST" action="?/login" use:enhance={handleFormSubmit}>
          <div class="mb-4">
            <label for="email" class="mb-2 text-gray-600"
              >Enter your email</label
            >
            <input
              type="text"
              name="email"
              id="email"
              bind:value={email}
              on:input={validateEmail}
              placeholder="username@example.com"
              class="border border-gray-300 rounded-md p-2 w-full focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm"
            />
            {#if errors.email}
              <div class="text-red-500 text-xs mt-1 mb-3">{errors.email}</div>
            {/if}
          </div>
          <label for="password" class="mb-2 text-gray-600"
            >Enter your password</label
          >
          <input
            name="password"
            type="password"
            id="password"
            bind:value={password}
            placeholder="********"
            class="border border-gray-300 rounded-md p-2 w-full focus:border-primary-400 focus:ring-1 focus:ring-primary-400 placeholder-gray-400"
          />
          {#if errors.password}
            <div class="text-red-500 text-xs mt-1">{errors.password}</div>
          {/if}
          <p class="mb-4 mt-2">
            <a
              href="/forgot"
              class="text-primary-500 hover:text-primary-600 underline"
              >Forgot password?</a
            >
          </p>

          <button
            type="submit"
            class="bg-primary-400 text-sm font-medium hover:bg-primary-500 text-white rounded p-2 w-full text-center"
          >
            SignIn
          </button>
        </form>
      {/if}
      <div class="relative flex items-center my-4 w-full">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="px-2 text-sm text-gray-500 font-bold bg-white">OR</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      {#if isOtpLogin}
        <button
          on:click={() => (isOtpLogin = false)}
          class="w-full flex mb-6 items-center justify-center py-2 px-4 text-white bg-primary-400 hover:bg-primary-500 rounded-md transition duration-200"
        >
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="flex items-center space-x-2">
            <Icon icon="fluent-mdl2:signin" class="text-2xl" />
            <span class="text-sm font-medium">Back to SignIn</span></a
          ></button
        >
      {:else}
        <button
          on:click={() => (isOtpLogin = true)}
          class="w-full flex mb-6 items-center justify-center py-2 px-4 text-white bg-primary-400 hover:bg-primary-500 rounded-md transition duration-200"
        >
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="flex items-center space-x-2">
            <Icon icon="fluent-mdl2:signin" class="text-2xl" />
            <span class="text-sm font-medium">SignIn with OTP</span></a
          ></button
        >
      {/if}
      <button
        class="w-full flex items-center justify-center py-2 px-4 text-white bg-blue-600 hover:bg-blue-600 rounded-md transition duration-200"
        ><a href={linkedinUrl} class="flex items-center space-x-2">
          <Icon icon="bi:linkedin" class="text-2xl" />
          <span class="text-sm font-medium">SignIn with LinkedIn</span></a
        ></button
      >
    </div>
  </div>

  <div class="hidden md:flex md:w-2/5 flex-grow">
    <img
      src="/image.jpg"
      alt="Sign In"
      class="object-cover w-full h-full rounded-r-lg"
    />
  </div>
</div>
<Toaster position="bottom-right" richColors />
