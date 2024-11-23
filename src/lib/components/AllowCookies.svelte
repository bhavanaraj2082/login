<script>
  import { onMount } from 'svelte';
  import Icon from "@iconify/svelte";
  import CookiesPopup from "$lib/components/CookiesPopup.svelte";
  
  let showBanner = true;
  let isPopupOpen = false;
  
  const togglePopup = (event) => {
    event.preventDefault();
    isPopupOpen = !isPopupOpen;
  };
  const closeBanner = () => {
    showBanner = false;
  };
  const handleLinkClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    showBanner = false;
  };
</script>

{#if showBanner}
<div class={`fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center sm:px-2 shadow-lg transition-opacity transition-visibility z-50 ${showBanner ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
  <div class="w-full fixed m-1 bottom-0 left-0 right-0 bg-white shadow-lg md:p-6 p-4 z-50">
    <button
      on:click={closeBanner}
      class="absolute sm:top-4 right-8 sm:right-4 text-primary-500 rounded-full p-2 hover:bg-gray-100 transition duration-100"
    >
      <Icon icon="ic:baseline-close" width="24" height="24" />
    </button>
    <div class="max-w-7xl mx-auto w-11/12 flex flex-col md:flex-row border border-primary-200 rounded sm:p-10 p-6 items-start md:items-center justify-between relative">
      <div class="text-xs sm:text-sm md:text-base text-gray-800 mb-4 md:mb-0 md:mr-4">
        <p class="p-1">
          Chemikart uses cookies and similar technologies to collect and process personal data. This may involve sharing information with third parties. By continuing, you consent to our data practices as outlined in our Privacy and Cookie Notice. Please review our
          <a 
            href="/terms/site-and-terms" 
            class="text-primary-600 underline"
            on:click={handleLinkClick}
          >Terms & Conditions</a>,
          <a 
            href="/terms/privacy-notice" 
            class="text-primary-600 underline"
            on:click={handleLinkClick}
          >Privacy Notice</a>, and
          <a 
            href="/terms/privacy-notice/#" 
            class="text-primary-600 underline"
            on:click={handleLinkClick}>Cookie Notice</a>.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          on:click={togglePopup}
          class="flex items-center justify-center border sm:w-full border-primary-500 text-primary-500 px-4 py-2 text-xs sm:text-sm rounded font-semibold hover:bg-primary-500 hover:text-white transition duration-100">
          Cookie 
          <Icon icon="system-uicons:settings" width="18" height="18"/>
        </button>
      </div>
    </div>
  </div>
</div>
{/if}
{#if isPopupOpen}
  <CookiesPopup isOpen={isPopupOpen} closePopup={togglePopup} />
{/if}