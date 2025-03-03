<script>
    import productlicence from '$lib/data/FooterLinks/productlicence.json';

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
<div class="md:ml-5 ml-0">
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

    <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Product Licenses</h1>
    <p class=" text-justify text-sm lg:ml-5">
        To allow us to offer the latest technology, some of our products can only be used under specific label licenses. Depending on the product, the label license may restrict quantities, commercial applications, or other specifications. Each license applies only to the products mentioned in the license.
    </p>
    <div class="gap-6 lg:ml-5">
        {#each Object.entries(productlicence) as [key, value]}
            <div class="mt-4">
                <h3 class="font-bold text-primary-400 text-justify mb-2">{value.Heading}</h3>
                <p class="text-sm ">{value.Description}</p>
                <p class="mt-3 text-justify text-sm">{value.Description2}</p>
            </div>
        {/each}
    </div>
</div>
