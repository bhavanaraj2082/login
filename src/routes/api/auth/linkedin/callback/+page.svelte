<script>
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
  
    let code = null;
    let error = null;
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const callbackUrl = import.meta.env.VITE_LINKEDIN_CALLBACK_URL;
    const scope = import.meta.env.VITE_LINKEDIN_SCOPE;
    const baseUrl = import.meta.env.VITE_LINKEDIN_BASE_URL;
    const linkedinUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}`;
  
    onMount(() => {
      const params = new URL(window.location.href).searchParams;
      code = params.get("code");
      error = params.get("error");
  
      console.log("Authorization Code:", code);
      console.log("Error:", error);
  
      if (code) {
        setTimeout(() => {
          goto("/profile");
        }, 1500);
      }
    });
  </script>
  
  <section class="bg-gray-50 py-10 flex items-center justify-center">
    <div class="px-6 w-full max-w-md mx-auto">
      <div
        class="py-8 px-6 bg-white rounded-lg shadow-lg flex border border-gray-300 flex-col items-center"
      >
        {#if code}
          <!-- Success Message -->
          <Icon icon="ooui:success" class="text-6xl text-green-500" />
          <h1 class="text-xl font-bold text-center my-4">Login Successful</h1>
          <p class="text-sm text-gray-500 text-center mb-4">
            Redirecting to your dashboard...
          </p>
        {:else}
          <!-- Error or Initial Login State -->
          <Icon
            icon="material-symbols:error-rounded"
            class="text-7xl text-red-500"
          />
          <h1 class="text-xl font-bold text-center my-4">Login Unsuccessful</h1>
          <p class="text-sm text-gray-500 text-center mb-4">
            Something went wrong. Please try again.
          </p>
          <!-- LinkedIn Login Button -->
          <a
            href={linkedinUrl}
            class="w-full flex items-center justify-center py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
          >
            <Icon icon="bi:linkedin" class="text-2xl" />
            <span class="text-sm font-medium ml-2">Login with LinkedIn</span>
          </a>
        {/if}
      </div>
    </div>
  </section>
  