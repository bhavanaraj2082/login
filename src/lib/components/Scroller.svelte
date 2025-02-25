<script>
    import Icon from '@iconify/svelte';
    function toggleHelp() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    let showTooltip = false;
  
    function handleMouseEnter(){
      showTooltip = true;
    }
  
    function handleMouseLeave(){
      showTooltip = false;
    }
  </script>
  <div class="absolute z-30 md:right-4 lg:right-1 right-1 mt-[980px] sm:mt-80">
    <div class="">
      <button
        class="font-semibold rounded flex flex-col items-center p-2 gap-2 text-white transition-opacity duration-300 transform"
        on:click={toggleHelp}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
      >
      <Icon icon="ci:chevron-up-duo" class="text-gray-300/60 text-5xl" />
    </button>
    {#if showTooltip}
      <div
        class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-white text-black font-medium py-1 rounded-md shadow-lg mb-1 sm:text-sm text-[10px] px-2"
      >
      Back to Top
        <div
          class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"
        ></div>
      </div>
      {/if}
    </div>
  </div>