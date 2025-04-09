<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { slide , fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { urlHistory } from '../stores/feedStore.js';

let currentUrl;

$: {
  currentUrl = $page.url.pathname;
  // console.log("currentUrl",currentUrl);
  

  if (currentUrl !== '/feedback') {
    urlHistory.update(history => [...history, currentUrl]);
  }
}

    export let footer;
    let isHelpVisible = false;
    let popupRef;
    let showButton = false;
    let showCrcl = true;

    function toggleHelp() {
      isHelpVisible = !isHelpVisible;
      showCrcl = false;
    }
  
    function toggleHelps() {
      isHelpVisible = !isHelpVisible;
      // showCrcl = false;
      showCrcl = true;

    }


    function hideHelp() {
      isHelpVisible = false;
      showCrcl = true;
    }
  
    function handleClickOutside(event) {
      if (popupRef && !popupRef.contains(event.target)) {
        hideHelp();
      }
    }


    const handleScroll = () => {
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const distanceFromBottom = footerTop - viewportHeight;
      showButton = distanceFromBottom > 50; 
    };
  
    onMount(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousedown', handleClickOutside); 
      handleScroll(); 
      setTimeout(handleScroll, 100);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousedown', handleClickOutside); 
      };
    });
  </script>
{#if showCrcl}
   <div  class="hidden md:block">
    <div class="fixed z-10 bottom-14 md:right-8 right-8 origin-bottom-right">
      <div class=" " class:hidden={!showButton}>
        <button
          class="font-semibold rounded-sm rounded-t-none flex flex-col items-center px-3 py-2 transition-opacity duration-300 transform 0 "
          on:click={toggleHelp}
        >
        <div class="fixed w-8 h-8 bg-primary-500 text-white rounded flex items-center justify-center text-2xl shadow-md hover:shadow-primary-500/50 transition-shadow duration-300 cursor-pointer">
            <Icon icon="ic:outline-chat" class="text-bold text-xl" />
        </div>
      </button>
      </div>
      </div>
   </div>
{/if}
{#if isHelpVisible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center z-30"
    on:click={handleClickOutside} transition:slide
  >
    <div
      class="fixed bg-primary-500 p-3 rounded-xl shadow-xl mx-auto overflow-hidden lg:w-[250px] md:w-[200px] sm:w-[200px] right-0 h-72 bottom-20"
      bind:this={popupRef}
      on:click|stopPropagation transition:slide
    >
      <span class="text-xl font-extrabold text-white font-serif">Chemikart</span>  
      <button
      class="absolute top-2 right-2 transform -translate-x-2 text-white text-lg font-bold"
      on:click={hideHelp}
    >
      ✖
    </button>
    <div
    class="fixed bg-white p-3 rounded-xl shadow-xl mx-auto overflow-hidden lg:w-[250px] md:w-[200px] sm:w-[200px] right-0 h-60 bottom-20 border-2 border-gray-100"
    bind:this={popupRef}
    on:click|stopPropagation transition:slide
  >
    <div class="w-full max-w-lg px-2">
      <div class="slide h-10 flex justify-start items-start text-center text-sm font-semibold font-montserrat">
          <Icon icon="noto:waving-hand" class="text-bold text-3xl" />
          &nbsp; &nbsp; Hi! there
      </div>
      <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
        We value your Feedback
      </div>
      <!-- <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
         value 
      </div>
      <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
      your 
      </div>
      <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
      Feedback
      </div> -->
      <div class="slide mb-4 mt-4 flex justify-start items-start text-center lg:text-sm md:text-xs font-semibold font-montserrat">
        Please take a moment to fill out our form      
      </div>

      <div class="relative w-full h-16 flex items-center justify-end cursor-pointer" on:click={() => { toggleHelps(); goto('/feedback'); }}>
        <button class="absolute text-md text-primary-500 font-semibold border-1 p-2 rounded-md mb-7" type='submit'>
          Click here
        </button>
          <Icon icon="ph:hand-pointing-thin" class="absolute text-bold text-3xl text-gray-500 icon-1 mt-4" />
          <!-- <Icon icon="svg-spinners:pulse-rings-multiple" class="absolute text-bold text-lg text-gray-700 icon-2 mr-2" /> -->
        </div>
    </div>
  </div>
    </div>
  </div>
{/if}