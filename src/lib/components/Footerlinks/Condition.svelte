<script>
    import productlicence from '$lib/data/FooterLinks/productlicence.json';

    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    let showButton = false;
	let thresholdFromBottom = 360;

	const updateThreshold = () => {
		const windowWidth = window.innerWidth;
		if (windowWidth <= 640) {  
			thresholdFromBottom = 1185; 
		} else if (windowWidth <= 768) {  
			thresholdFromBottom = 690; 
		} else if (windowWidth <= 1024) {  
			thresholdFromBottom = 480; 
		} else {
			thresholdFromBottom = 480; 
		}
	};

  const handleScroll = () => {
	const scrollPosition = window.scrollY;
	const documentHeight = document.documentElement.scrollHeight;
	const windowHeight = window.innerHeight;
    showButton = window.scrollY > 20 && (documentHeight - (scrollPosition + windowHeight)) > thresholdFromBottom;
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  onMount(() => {
	updateThreshold();
    window.addEventListener('scroll', handleScroll);
	window.addEventListener('resize', updateThreshold);
    return () => {
      window.removeEventListener('scroll', handleScroll);
	  window.removeEventListener('resize', updateThreshold);
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
  <div class="pt-5 max-w-7xl md:w-11/12 mx-auto">
    <div class="fixed z-30 bottom-1.5 right-0 lg:right-10 py-4 lg:p-4">
        <button
        class="flex items-center justify-center p-2 rounded text-primary-500 md:mr-14 lg:mr-0" on:click={scrollToTop}
          class:hidden={!showButton}
          on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
        >
        <Icon icon="gg:arrow-up-r" width="2.2em" height="2.2em" />
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
