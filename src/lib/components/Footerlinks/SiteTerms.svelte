<script>
    import termsOfUseData from '$lib/data/FooterLinks/Terms.json'; 

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
            <Icon icon="tdesign:chevron-up" width="20" height="20" class="text-primary-500"  />
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
    <h1 class="sm:text-2xl text-xl font-bold sm:mb-6 mb-4 text-center mt-2">Terms of Use</h1>
    <p class="leading-relaxed text-justify  sm:text-sm text-xs lg:ml-5 whitespace-normal break-words">
        {termsOfUseData.TermsOfUse.Content}
    </p>
    <h1 class="text-xl font-semibold lg:ml-5 mt-4 text-gray-700 mb-4">Consent</h1>
    <div class="lg:ml-5 text-justify whitespace-normal break-words">
        <p class="">
            <span class="font-semibold text-justify sm:text-sm text-xs">
                By using the Website or by clicking to accept or agree to the Terms of Use when this option is made available to you, you accept and agree to be bound and abide by these Terms of Use.
            </span>
            <span class="sm:text-sm text-xs whitespace-normal text-justify">{termsOfUseData.TermsOfUse.Consent}</span>
            <span class="font-semibold sm:text-sm text-xs text-justify">
                If you are an existing user with an Account and do not agree to these Terms of Use and wish to remove your Account from the website, please submit a request to us for the removal of your Account.
            </span>
        </p>
    </div>
    <p class="lg:ml-5 sm:text-sm text-xs mt-5 text-justify whitespace-normal break-words">{termsOfUseData.TermsOfUse.Consent2}</p>
    <h1 class="text-xl font-semibold mt-5 mb-5 lg:ml-5 text-gray-700 break-words text-justify  whitespace-normal">Exclusion of Warranty</h1>
    <p class="leading-relaxed sm:text-sm text-xs lg:ml-5 whitespace-normal text-justify break-words">{termsOfUseData.TermsOfUse.waranty}</p>
    <p class="leading-relaxed sm:text-sm text-xs lg:ml-5 mt-5 whitespace-normal  text-justify break-words">{termsOfUseData.TermsOfUse.waranty2}</p>
    <h1 class="text-xl font-semibold mt-5 mb-5 lg:ml-5 text-gray-700 break-words text-justify  whitespace-normal">Account Management</h1>
    <p class="leading-relaxed sm:text-sm text-xs lg:ml-5 whitespace-normal text-justify  break-words">{termsOfUseData.TermsOfUse.account}</p>
    <h1 class="text-xl font-semibold mt-5 mb-5 lg:ml-5 text-gray-700 break-words text-justify  whitespace-normal">Prohibited Users</h1>
    <p class="sm:text-sm text-xs mb-2 lg:ml-5 whitespace-normal break-words text-justify ">You may use the Website and its contents only for lawful purposes and in accordance with these Terms of Use. You agree not to use the Website and its contents:</p>
    <ul class="list-disc lg:ml-5 sm:text-sm text-xs">
        <li class="whitespace-normal text-justify  break-words">In any way that violates any applicable federal, state, local, or international law or regulation.</li>
        <li class="whitespace-normal text-justify  break-words">To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation.</li>
        <li class="whitespace-normal text-justify break-words">To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
        <li class="whitespace-normal text-justify break-words">To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
        <li class="whitespace-normal text-justify  break-words">To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website.</li>
    </ul>
    <h1 class="text-xl font-semibold mt-5 mb-5 lg:ml-5 text-gray-700 break-words text-justify  whitespace-normal">Intellectual Property Rights</h1>
    <p class="sm:text-sm text-xs lg:ml-5 whitespace-normal break-words text-justify ">{termsOfUseData.TermsOfUse.Property_Right1}</p>
    <p class="mt-2 sm:text-sm text-xs lg:ml-5 whitespace-normal break-words text-justify ">{termsOfUseData.TermsOfUse.Property_Right2}</p>
    <p class="mt-2 sm:text-sm text-xs lg:ml-5 whitespace-normal break-words text-justify mb-5">{termsOfUseData.TermsOfUse.Property_Right3}</p>
  </div>