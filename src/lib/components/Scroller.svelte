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
  <div class="absolute z-70 lg:right-20 right-12 lg:mt-[-36px] md:mt-[-36px] sm:mt-0 mt-20
">
    <div class="">
      <button
      class="flex items-center justify-center p-2 text-white bg-primary-400 rounded hover:bg-primary-300 hover:shadow"
        on:click={toggleHelp}
      
      >
      <!-- class="w-10 h-10  font-bold text-lg text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:bg-white hover:text-primary-400 mt-2" -->

      <Icon icon="gg:arrow-up-r" width="20" height="20"/>   
       </button>
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