<script>
  import Safetydata3 from "$lib/components/Productsafety/safetydata3.svelte";
  import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    let showButton = false;
	
    const handleScroll = () => {
    showButton = window.scrollY > 20;
};


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  let showTooltip = false;
  function handleMouseEnter(){
    showTooltip = true;
  }
  function handleMouseLeave(){
    showTooltip = false;
  }

</script>
<div>
  <div class="pt-5 max-w-7xl md:w-11/12 mx-auto sm:block hidden">
		<div class="fixed z-30 md:bottom-[75px] bottom-40 right-0 lg:right-10 py-6 lg:p-4">
      <button
        class="flex items-center justify-center rounded py-0.3 bg-primary-400 text-white md:mr-14 lg:mr-0 shadow-md" on:click={scrollToTop}
        class:hidden={!showButton}
          on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
        >
        <div class="flex flex-col items-center">
          <Icon icon="tdesign:chevron-up" width="20" height="20"  />
          <span class="px-1.5 text-xs pb-0.5">TOP</span>
        </div>
      </button>
        {#if showTooltip}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-transparent text-black font-medium py-1 rounded-md shadow-lg sm:text-sm text-[10px] px-4"
        on:click={scrollToTop}
        class:hidden={!showButton}>
        <div
          class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-transparent"></div>
        </div>
        {/if}
      </div>
</div>
<Safetydata3/>
</div>