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
  <div class="absolute z-70 lg:right-20 right-7 lg:mt-[-36px] md:mt-[-36px] sm:mt-0 mt-[182px]
">
    <div class="">
      <button
      class="flex items-center justify-center rounded py-0.3 bg-primary-50 md:mr-14 lg:mr-0 shadow-md"
        on:click={toggleHelp}
      >
       <div class="flex flex-col items-center">
				<Icon icon="tdesign:chevron-up" width="20" height="20"  class="text-primary-500" />
				<span class="px-2 text-xs pb-0.5 text-primary-500">TOP</span>
			</div>	
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