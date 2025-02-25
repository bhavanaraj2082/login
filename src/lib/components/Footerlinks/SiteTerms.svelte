<script>
    import termsOfUseData from '$lib/data/FooterLinks/Terms.json'; 

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
        <div class="fixed z-30 bottom-0 right-0 lg:right-4 py-4 lg:p-4">
            <button
              class="font-semibold rounded flex flex-col items-center px-1.5 pb-2 lg:p-2 gap-2 text-primary-900 transition-opacity duration-300 transform"
              on:click={scrollToTop}
              class:hidden={!showButton}
              on:mouseenter={handleMouseEnter}
                on:mouseleave={handleMouseLeave}
            >
              <Icon icon="ci:chevron-up-duo" class="text-bold text-4xl text-primary-400 hover:text-primary-500" />
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
    <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Terms of Use</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">
        {termsOfUseData.TermsOfUse.Content}
    </p>
    <h1 class="text-xl font-bold lg:ml-5 mt-4 text-primary-400 mb-4">Consent</h1>
    <div class="lg:ml-5  leading-relaxed">
        <p>
            <span class="font-bold text-sm">
                By using the Website or by clicking to accept or agree to the Terms of Use when this option is made available to you, you accept and agree to be bound and abide by these Terms of Use.
            </span>
            <span class="text-sm">{termsOfUseData.TermsOfUse.Consent}</span>
            <span class="font-bold  text-sm">
                If you are an existing user with an Account and do not agree to these Terms of Use and wish to remove your Account from the website, please submit a request to us for the removal of your Account.
            </span>
        </p>
    </div>
    <p class="lg:ml-5  text-sm mt-5">{termsOfUseData.TermsOfUse.Consent2}</p>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5 text-primary-400">Exclusion of Warranty</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">{termsOfUseData.TermsOfUse.waranty}</p>
    <p class=" leading-relaxed  text-sm lg:ml-5 mt-5">{termsOfUseData.TermsOfUse.waranty2}</p>
    <h1 class="text-xl font-bold  mt-5 mb-5 lg:ml-5 text-primary-400">Account Management</h1>
    <p class=" leading-relaxed text-sm lg:ml-5">{termsOfUseData.TermsOfUse.account}</p>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5 text-primary-400">Prohibited Users</h1>
    <p class="text-sm mb-2 lg:ml-5">You may use the Website and its contents only for lawful purposes and in accordance with these Terms of Use. You agree not to use the Website and its contents:</p>
    <ul class="list-disc  lg:ml-5 text-sm">
        <li >In any way that violates any applicable federal, state, local, or international law or regulation.</li>
        <li>To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter”, “spam”, or any other similar solicitation.</li>
        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
        <li>To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the Website.</li>
    </ul>
    <h1 class="text-xl font-bold mt-5 mb-5 lg:ml-5 text-primary-400">Intellectual Property Rights</h1>
    <p class="text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right1}</p>
    <p class="mt-2 text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right2}</p>
    <p class="mt-2 text-sm lg:ml-5">{termsOfUseData.TermsOfUse.Property_Right3}</p>
  </div>
  