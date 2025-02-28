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

    function toggleHelps() {
      isHelpVisible = !isHelpVisible;
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
  
    onMount(() => {
      window.addEventListener('mousedown', handleClickOutside); 
      return () => {
        window.removeEventListener('mousedown', handleClickOutside); 
      };
    });
  </script>  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div  class="hidden md:block">
    {#if showCrcl}
<!-- <div  class="block md:hidden"> -->
  <div class="relative">
      <button
        class="font-semibold absolute rounded rounded-b-none flex flex-col items-center px-3 pr-4 gap-2 transition-opacity duration-300 transform bottom-9 right-7 z-30
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



    <!-- <div
    class="fixed inset-0 flex items-center justify-center z-30"
  >
    <div
      class="absolute lg:top-40 md:top-12 sm:top-40 lg:right-40 md:right-28 sm:right-40" on:click={toggleHelp} transition:fade
    >
  <div class="fixed w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl shadow-md hover:shadow-primary-500/50 transition-shadow duration-300 cursor-pointer" >
      <Icon icon="prime:chevron-down" class="text-xl text-white" />
  </div>
    </div>
  </div> -->



    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="fixed inset-0 flex items-center justify-center z-30"
      on:click={handleClickOutside} transition:slide
    >
      <div
        class="fixed bg-primary-500 p-3 rounded-xl shadow-xl mx-auto overflow-hidden lg:w-[250px] md:w-[200px] w-[320px] right-0 h-72 bottom-20"
        bind:this={popupRef}
        on:click|stopPropagation transition:slide
      >
        <span class="text-xl font-extrabold text-white font-serif">Chemikart</span> 
        <button
        class="absolute top-2 right-2 text-white text-lg font-bold"
        on:click={hideHelp}
      >
        ✖
      </button> 
      <div
      class="fixed bg-white p-3 rounded-xl shadow-xl mx-auto overflow-hidden lg:w-[250px] md:w-[200px] sm:w-[200px] right-0 h-72 bottom-7 border-2 border-gray-100"
      bind:this={popupRef}
      on:click|stopPropagation transition:slide
    >
      <div class="w-full max-w-lg px-2">
        <div class="slide h-10 flex justify-start items-start text-center text-sm font-semibold font-montserrat">
            <Icon icon="noto:waving-hand" class="text-bold text-3xl" />
            &nbsp; &nbsp; Hi! there
        </div>
        <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
          We 
        </div>
        <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
           value 
        </div>
        <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
        your 
        </div>
        <div class="slide flex justify-start items-start text-center text-lg font-semibold font-serif">
        Feedback
        </div>
        <div class="slide mb-4 mt-4 flex justify-start items-start text-center lg:text-sm md:text-xs text-3s font-semibold font-montserrat">
          Please take a moment to fill out our form      
        </div>
        <div class="relative w-full h-16 flex items-center justify-between cursor-pointer" on:click={() => { goto('/feedback'); toggleHelps(); }}>
          <button class="absolute text-md text-primary-500 font-semibold border-1 p-2 rounded-md mb-7" type='submit'>
            Click here
          </button>
            <Icon icon="ph:hand-pointing-thin" class="absolute text-bold text-3xl text-gray-500 icon-1 mt-6" />
            <!-- <Icon icon="svg-spinners:pulse-rings-multiple" class="absolute text-bold text-lg text-gray-700 icon-2 ml-1" /> -->
          </div>
      </div>
    </div>
      </div>
    </div>
  {/if}
</div>