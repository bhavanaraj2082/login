<script>
  import { onMount } from 'svelte';
  import Icon from "@iconify/svelte";

  const COOKIE_CONFIG = {
    name: 'performanceCookies',
    expiryDays: 25,
    domain: 'chemikart.partskeys.com',
    sameSite: 'Strict',
    secure: true,
    path: '/'
  };

  let showBanner = false;

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=${COOKIE_CONFIG.path};${COOKIE_CONFIG.secure ? 'Secure;' : ''}SameSite=${COOKIE_CONFIG.sameSite};domain=${COOKIE_CONFIG.domain}`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, val] = cookie.trim().split('=');
      if (key === name) return val;
    }
    return null;
  }

  function synchronizeCookiesAndLocalStorage() {
    const cookieValue = getCookie(COOKIE_CONFIG.name);
    const localValue = localStorage.getItem(COOKIE_CONFIG.name);

    if (cookieValue && localValue !== cookieValue) {
      localStorage.setItem(COOKIE_CONFIG.name, cookieValue);
    } else if (!cookieValue && localValue) {
      setCookie(COOKIE_CONFIG.name, localValue, COOKIE_CONFIG.expiryDays);
    }

    return !(cookieValue || localValue);
  }

  function handleConsent(isAccepted) {
    const consentValue = isAccepted ? 'enabled' : 'disabled';
    setCookie(COOKIE_CONFIG.name, consentValue, COOKIE_CONFIG.expiryDays);
    localStorage.setItem(COOKIE_CONFIG.name, consentValue);
    showBanner = false;
  }

  function closeBanner() {
    showBanner = false;
  }

  onMount(() => {
    showBanner = synchronizeCookiesAndLocalStorage();
  });
</script>

{#if showBanner}
<div
  class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end pb-4 transition-opacity transition-visibility z-50"
  role="dialog"
  aria-label="Cookie Banner">
  <div class="w-full max-w-7xl mx-4 bg-white shadow rounded relative overflow-hidden">
    <button
      on:click={closeBanner}
      class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition duration-100"
      aria-label="Close cookie banner">
      <Icon icon="ic:baseline-close" width="24" height="24" />
    </button>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-4 gap-4">
      <div class="flex-1 text-xs text-gray-800">
        <p class="sm:text-sm">
          Chemikart uses cookies and similar technologies to collect and process personal data. This may involve sharing information with third parties.
          <br />
          For more information, please refer to our
          <a
            href="/terms/site-and-terms"
            class="text-primary-600 underline"
            rel="noopener noreferrer"
          >Terms & Conditions</a>,
          <a
            href="/terms/privacy-notice"
            class="text-primary-600 underline"
            rel="noopener noreferrer"
          >Privacy Notice</a>, and
          <a
            href="/terms/privacy-notice/#"
            class="text-primary-600 underline"
            rel="noopener noreferrer"
          >Cookie Notice</a>.
        </p>
      </div>
      <div class="flex sm:flex-col mr-14 gap-4 w-full md:w-auto">
        <button
          on:click={() => handleConsent(true)}
          class="flex-1 flex items-center justify-center border border-primary-500 text-primary-500 px-3 py-1 text-sm rounded font-medium hover:bg-primary-500 hover:text-white transition duration-100">
          Allow
          <Icon icon="fluent:cookies-48-regular" width="16" height="16" class="ml-1" />
        </button>
        <button
          on:click={() => handleConsent(false)}
          class="flex-1 flex items-center justify-center bg-primary-500 text-white px-3 py-1 text-sm rounded font-medium hover:bg-primary-700 transition duration-100">
          Reject
        </button>
      </div>
    </div>
  </div>
</div>
{/if}
