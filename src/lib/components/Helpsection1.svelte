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
      // showCrcl = false;
      showCrcl = true;

    }

  function togglePage(path) {
  showCrcl = true;
  goto(path); 
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
  <div class="relative w-full  flex items-center justify-center">
    <button
        class="font-semibold rounded-full flex flex-col items-center py-2 gap-3 transition-opacity duration-300 w-full max-w-4xl z-30"
        on:click={toggleHelp}
    >
        <!-- Inner div with larger content -->
        <div class="w-full h-10 bg-primary-400 text-white rounded-lg flex items-center justify-center text-2xl shadow-md hover:shadow-primary-500/50 transition-shadow duration-300 cursor-pointer">
            <p class="text-lg sm:text-xl md:text-2xl">Feedback</p>
            <Icon icon="material-symbols:chat-outline-rounded" class="text-bold text-2xl ml-2 mt-1" />
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
  
      <div class="w-full">
        <div class="slide h-10 flex justify-start items-start text-center text-sm font-semibold font-montserrat">
            <Icon icon="noto:waving-hand" class="text-bold text-3xl" />
            &nbsp; &nbsp; Hi! there
        </div>

         <div class="text-lg font-semibold font-serif">
      We value your Feedback
    </div>
        <div class="flex flex-row items-center w-full p-1">

  <!-- Left side: Text content (3/4 width) -->
  <div class="w-3/4 flex flex-col space-y-0">
  
    <div class="text-sm font-semibold font-montserrat">
      Please take a moment to fill out our form
    </div>
  </div>

  <!-- Right side: Button with icon (1/4 width) -->
  <div class="w-1/4 flex justify-end items-center cursor-pointer mt-2" on:click={() => { toggleHelps(); goto('/feedback'); }}>
   <button class="absolute text-sm text-primary-500 font-semibold border-1 p-2 rounded-md mb-5" type='submit'>
            Click here
          </button>
            <Icon icon="ph:hand-pointing-thin" class="absolute text-bold text-3xl text-gray-500 icon-1 mt-6" />
</div>



</div>


 <div class="w-full">
   
        <div class="text-lg font-semibold font-serif">
      We're here to help
    </div>

     <div class="flex flex-row items-center w-full p-1">

  <!-- Left side: Text content (3/4 width) -->
  <div class="w-1/2 flex flex-col space-y-0">
  
    <div class="text-sm font-semibold font-montserrat">
     Get in touch if you have any questions, issues
    </div>
  </div>

  <!-- Right side: Button with icon (1/4 width) -->
  <div class="w-1/2 flex justify-end items-center cursor-pointer mt-2" on:click={() => { toggleHelps(); goto('/help-support'); }}>
   <button class="absolute text-sm text-primary-500 font-semibold border-1 p-2 rounded-md mb-5" type='submit'>
            Click here
          </button>
            <Icon icon="ph:hand-pointing-thin" class="absolute text-bold text-3xl text-gray-500 icon-1 mt-6" />
</div>



</div>



     
    </div>
      </div>
    </div>




    
  </div>
</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
{/if}
</div>