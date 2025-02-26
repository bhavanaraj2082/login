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
  <div class="absolute z-30 right-12 sm:mt-36">
    <div class="">
      <button
        class="w-10 h-10 bg-primary-500 font-bold text-lg text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:bg-white hover:text-primary-400 mt-2"
        on:click={toggleHelp}
      
      >
      ↑    
       <!-- </button>
    <button class="fixed bottom-5 right-5 w-10 h-10 bg-white font-bold text-lg text-primary-400 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:bg-gray-900">
      ↑
    </button> -->
    </div>
  </div>




      
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