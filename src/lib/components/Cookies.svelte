<script>
  import CookiesPopup from "$lib/components/CookiesPopup.svelte";

  export let isPopupOpen = false;

  const togglePopup = () => {
    isPopupOpen = !isPopupOpen;
  };
</script>

<button
class="fixed bottom-5 py-2 px-4 border-none text-base cursor-pointer z-50 bg-transparent text-black hover:underline hover:text-primary-500"
on:click={togglePopup}
>
Cookies Setting
</button>

<CookiesPopup isOpen={isPopupOpen} closePopup={togglePopup} />



