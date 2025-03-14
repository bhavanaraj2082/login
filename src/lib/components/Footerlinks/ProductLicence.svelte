<script>
    import Condition from '$lib/data/FooterLinks/condition.json'
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
            class="flex items-center justify-center rounded py-0.3 bg-primary-50 text-white md:mr-14 lg:mr-0 shadow-md" on:click={scrollToTop}
            class:hidden={!showButton}
              on:mouseenter={handleMouseEnter}
                on:mouseleave={handleMouseLeave}
            >
            <div class="flex flex-col items-center">
				<Icon icon="tdesign:chevron-up" width="20" height="20" class="text-primary-500" />
				<span class="px-1.5 text-xs pb-0.5 text-primary-500 font-medium">TOP</span>
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
        <h1 class="text-2xl font-bold mb-4 mt-5 text-center">General Terms and Conditions of Sale
        </h1>
        <p class="mt-2 font-bold">Rev. April 2021</p>
        <ol class="list-decimal pl-5 mt-5 space-y-2 text-primary-400">
          <li><a href="#Applicability" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Applicability</a></li>
          <li><a href="#Delivery and Performance" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Delivery and Performance</a></li>
          <li><a href="#Use of Products" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Use of Products</a></li>
          <li><a href="#Price and Payment" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Price and Payment</a></li>
          <li><a href="#Software and Use Documents Licence Terms" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Software and Use Documents Licence Terms</a></li>
          <li><a href="#Limited Warranties" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Limited Warranties</a></li>
          <li><a href="#Returns" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Returns </a></li>
          <li><a href="#Termination" class="transition-all duration-300 hover:underline hover:text-primary-600 hover:font-bold hover:pl-2">Termination</a></li>
      </ol>
        <hr class="border-t-1 mt-4 border border-gray-400 mb-10">
        <h3 id="Applicability" class="text-gray-700 mt-5 text-lg">1. Applicability</h3>
        <p class="mt-2 text-sm text-justify">1.1 {Condition.Condition.Applicabilty}</p>
        <p class="mt-3  text-sm text-justify">1.2 {Condition.Condition.Applicabilty1}</p>
        <p class="mt-3 text-sm text-justify">1.3 {Condition.Condition.Applicabilty2}</p>
        <p class="mt-3  text-sm text-justify">1.3 {Condition.Condition.Applicabilty2}</p>
        <p class="mt-3 text-sm   text-justify">1.3 {Condition.Condition.Applicabilty2}</p>
        <p class="mt-3 text-sm text-justify">1.4 {Condition.Condition.Applicabilty3}</p>
        <h3 id="Delivery and Performance" class="text-gray-700 mt-5 text-lg">2.Delivery and Performance</h3>
        <p class="mt-3 text-sm text-justify">2.1 {Condition.Condition.Delivery}</p>
        <p class="mt-3 text-sm  text-justify">2.2 {Condition.Condition.Delivery1}</p>
        <p class="mt-3 text-sm text-justify">2.3 {Condition.Condition.Delivery2}</p>
        <p class="mt-3 text-sm text-justify">2.4 {Condition.Condition.Delivery3}</p>
        <h3 id="Use of Products" class="text-gray-700 mt-5 text-lg">3.Use of Products</h3>
        <p class="mt-3 text-sm text-justify">3.1 {Condition.Condition.use_product}</p>
        <p class="mt-3 text-sm text-justify">3.2 {Condition.Condition.use_product1}</p>
        <p class="mt-3 text-sm text-justify">3.3 {Condition.Condition.use_product2}</p>
        <h3 id="Price and Payment" class="text-gray-700 mt-5 text-lg">4.Price and Payment</h3>
        <p class="mt-3  text-sm text-justify">4.1 {Condition.Condition.payment}</p>
        <p class="mt-3 text-sm text-justify">4.2 {Condition.Condition.payment1}</p>
        <p class="mt-3 text-sm text-justify">4.3 {Condition.Condition.payment2}</p>
        <p class="mt-3 text-sm text-justify">4.4 {Condition.Condition.payment3}</p>
        <p class="mt-3 text-sm text-justify">4.5 {Condition.Condition.payment4}</p>
        <h3 id="Software and Use Documents Licence Terms" class="text-gray-700 mt-5 text-lg">5.Software and Use Documents Terms</h3>
        <p class="mt-3 text-sm text-justify">5.1 {Condition.Condition.document}</p>
        <p class="mt-3 text-sm text-justify">5.2 {Condition.Condition.document1}</p>
        <p class="mt-3 text-sm text-justify">5.3 {Condition.Condition.document2}</p>
        <p class="mt-3 text-sm text-justify">5.4 {Condition.Condition.document3}</p>
        <h3 id="Returns" class="text-gray-700 mt-5 text-lg">6.Returns</h3>
        <p class="mt-3 text-sm text-justify">{Condition.Condition.returns}</p>
        <h3 id="Limited Warranties" class="text-gray-700 mt-5 text-lg">7.Limited Warranties</h3>
        <p class="mt-3 text-sm text-justify">7.1 {Condition.Condition.waranty}</p>
       <p class="mt-3 text-sm text-justify">7.2 {Condition.Condition.waranty2}</p>
        <p class="mt-3 text-sm text-justify">7.3 {Condition.Condition.waranty3}</p>
        <p class="mt-3 text-sm text-justify">7.4 {Condition.Condition.waranty4}</p>
        <p class="mt-3 text-sm text-justify">7.5 {Condition.Condition.waranty5}</p>
        <p class="mt-3 text-sm text-justify">7.6 {Condition.Condition.waranty6}</p>
        <p class="mt-3 text-sm text-justify">7.7 {Condition.Condition.waranty7}</p>
        <h3 id="Termination" class="text-gray-700 mt-5 text-lg">8.Termination</h3>
        <p class="mt-3 text-sm text-justify">{Condition.Condition.termination}</p>
    </div>