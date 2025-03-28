<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { slide , fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  let isHelpVisible = false;
  let popupRef;
  let showButton = false;
  let showCrcl = true;

  function toggleHelp() {
    isHelpVisible = !isHelpVisible;
    showCrcl = false;
  }

  function togglePage() {
    showCrcl = true;
    goto('/feedback');
    isHelpVisible = !isHelpVisible;
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

  onMount(() => {
    window.addEventListener('mousedown', handleClickOutside); 
    return () => {
      window.removeEventListener('mousedown', handleClickOutside); 
    };
  });
</script>
<div  class="block md:hidden">
{#if showCrcl}
<!-- <div  class="block md:hidden"> -->
  <div class="relative">
      <button
        class="font-semibold absolute rounded rounded-b-none flex flex-col items-center px-3 pt-2 pb-1 gap-2 transition-opacity duration-300 transform bottom-12 right-5 z-30
        "
        on:click={toggleHelp}>
        <div class="fixed w-8 h-8 bg-primary-500 text-white rounded flex items-center justify-center text-2xl shadow-md hover:shadow-primary-500/50 transition-shadow duration-300 cursor-pointer">
          <Icon icon="ic:outline-chat" class="text-bold text-xl" />
      </div>
      </button>
  </div>
<!-- </div> -->
{/if}
{#if isHelpVisible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
  class="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-30"
  on:click={handleClickOutside} transition:fade
>
  <div
    class="fixed bg-primary-500 rounded-lg shadow-xl mx-auto overflow-hidden lg:w-[900px] md:w-[750px] w-full"
    bind:this={popupRef}
    on:click|stopPropagation transition:fade
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center p-3 text-black">
        <span class="text-xl font-extrabold text-white font-serif">Chemikart</span>  
      </div>
      <!-- <button
      class="p-1 hover:bg-gray-100 rounded transition-colors duration-200 text-end"
      on:click={hideHelp}>
      <Icon icon="mdi:close" class="text-xl text-white hover:text-white" />
    </button> -->
    <button
        class="text-white text-lg font-bold mr-2"
        on:click={hideHelp}
      >
        ✖
      </button> 
    </div>
    <div class="text-xs bg-white overflow-y-auto scroll p-3" style="max-height: 400px">
  
      <div class="w-full max-w-lg">
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
        <div class="slide mb-4 mt-4 flex justify-start items-start text-center lg:text-sm md:text-xs text-3s font-semibold font-montserrat">
          Please take a moment to fill out our form      
        </div>
  
        <div class="relative w-full h-10 flex items-center justify-end cursor-pointer" on:click={togglePage} >
          <button class="absolute text-md text-primary-500 font-semibold border-1 p-2 rounded-md mb-5" type='submit'>
            Click here
          </button>
            <Icon icon="ph:hand-pointing-thin" class="absolute text-bold text-3xl text-gray-500 icon-1 mt-6" />
            <!-- <Icon icon="svg-spinners:pulse-rings-multiple" class="absolute text-bold text-lg text-gray-700 icon-2 mr-2" /> -->
          </div>
      </div>
    </div>
  </div>
</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
{/if}
</div>