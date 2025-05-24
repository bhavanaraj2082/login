<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { slide , fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { urlHistory } from '../stores/feedStore.js';

let currentUrl;

$: {
  currentUrl = $page.url.pathname;
  // console.log("currentUrl",currentUrl);
  

  if (currentUrl !== '/feedback') {
    urlHistory.update(history => [...history, currentUrl]);
  }
}

    export let footer;
    let isHelpVisible = false;
    let popupRef;
    let showButton = false;
    let showCrcl = true;

    function toggleHelp() {
      isHelpVisible = !isHelpVisible;
      showCrcl = false;
    }
  
    function toggleHelps() {
      isHelpVisible = !isHelpVisible;
      // showCrcl = false;
      showCrcl = true;

    }


    function hideHelp() {
      isHelpVisible = false;
      showCrcl = true;
    }
  
    function handleClickOutside(event) {
      if (popupRef && !popupRef.contains(event.target)) {
        hideHelp();
      }
    }


    const handleScroll = () => {
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const distanceFromBottom = footerTop - viewportHeight;
      showButton = distanceFromBottom > 50; 
    };
  
    onMount(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousedown', handleClickOutside); 
      handleScroll(); 
      setTimeout(handleScroll, 100);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousedown', handleClickOutside); 
      };
    });

    const contactInfo = [
      { icon: 'mdi:phone-outline', text: '7829922222', href: 'tel:7829922222', ariaLabel: 'Call us' },
      { icon: 'mdi:email-outline', text: 'sales@partskeys.com', href: 'mailto:sales@partskeys.com', ariaLabel: 'Email us' },
      { 
              icon: 'ic:baseline-whatsapp', 
              text: 'Chat with us on', 
              href: 'javascript:void(0)', 
              onClick: "window.open('https://wa.me/917829922222?text=Hello%2C%0A%0AI%20am%20interested%20in%20discussing%20the%20availability%20of%20your%20products%20and%20services.%20I%20would%20like%20to%20know%20if%20the%20following%20part%20is%20available%3A%20%5BInsert%20Part%20Number%20Here%5D%20If%20not%2C%20could%20you%20inform%20me%20when%20it%20will%20be%20available%20or%20send%20me%20an%20email%20with%20the%20details%3F%0A%0AThank%20you%20for%20your%20assistance.%20I%20look%20forward%20to%20your%20response.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D', '_blank')",
              ariaLabel: 'Chat with us on WhatsApp' 
            },
    ];
  </script>
{#if showCrcl}
	<div class="hidden md:block">
		<div class="fixed z-10 bottom-14 md:right-8 right-8 origin-bottom-right">
			<div class=" " class:hidden={!showButton}>
				<button
					class="font-semibold rounded-sm rounded-t-none flex flex-col items-center px-3 py-2 transition-opacity duration-300 transform 0"
					on:click={toggleHelp}
				>
					<div
						class="fixed w-8 h-8 bg-primary-500 text-white rounded flex items-center justify-center text-2xl shadow-md hover:shadow-primary-500/50 transition-shadow duration-300 cursor-pointer"
					>
						<Icon icon="ic:outline-chat" class="text-bold text-xl" />
					</div>
				</button>
			</div>
		</div>
	</div>
{/if}
{#if isHelpVisible}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 flex items-center justify-center z-30"
		on:click={handleClickOutside}
		transition:slide
	>
		<!-- <div
      class="fixed bg-primary-500 p-3 rounded-xl shadow-xl mx-auto overflow-hidden md:w-1/3 lg:w-1/4 right-0 h-56 bottom-56"
      bind:this={popupRef}
      on:click|stopPropagation
      transition:slide
    > -->

		<div
			class="fixed bg-white pb-3 rounded-xl shadow-xl mx-auto overflow-hidden md:w-1/3 lg:w-1/3 xl:w-1/4 right-4 h-96 bottom-20 border-gray-100"
			bind:this={popupRef}
			on:click|stopPropagation
			transition:slide
		>
			<div
				class="relative bg-primary-500 rounded-t-xl pt-4 pb-6 px-2 shadow-xl flex justify-between"
			>
				<span class="text-xl font-bold text-white font-serif mx-2">Chemikart</span>
				<button
					class="top-2 right-2 transform -translate-x-2 text-white text-lg font-bold"
					on:click={hideHelp}
				>
					<Icon
						icon="ion:close"
						width="28"
						height="28"
						class="transition-transform hover:scale-110 duration-200 ease-in-out"
					/>
				</button>
			</div>
			<div
				class="relative -mt-4 bg-white rounded-t-xl pb-4 border border-gray-100 shadow-xl overflow-hidden"
			>
				<div class="w-full max-w-lg px-2 py-6 rounded-t-xl">
					<div
						class="slide h-10 flex justify-start items-start text-center text-md font-semibold font-montserrat"
					>
						<Icon icon="noto:waving-hand" class="text-bold text-3xl" />
						<span class="px-2 pb-2 pt-1">Hi! there</span>
					</div>
					<div
						class="text-lg font-semibold p-2 border hover:border-transparent hover:bg-primary-400 hover:text-white rounded-md group transition-colors duration-300 ease-in-out cursor-pointer"
						on:click={() => {
							toggleHelps();
							goto('/feedback');
						}}
					>
						We value your <span class="text-primary-500 group-hover:text-white">Feedback</span>

						<div class="flex flex-row gap-2 items-center w-full p-1">
							<!-- Left side: Text content (3/4 width) -->
							<div class=" flex flex-col space-y-0">
								<div class="text-sm lg:text-sm sm:text-xs font-semibold font-montserrat">
									Please take a moment to fill out our form
								</div>
							</div>

							<!-- Right side: Button with icon (1/4 width) -->
							<div class=" flex justify-end items-center cursor-pointer">
								<button
									class=" sm:text-md text-xs text-nowrap text-white group-hover:text-primary-500 font-semibold border-1 p-2 rounded-md bg-white group-hover:bg-white group-hover:bg-none bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 bg-200p-200p bg-0p-50p animate-gradient-flow transition-all duration-300"
									type="submit"
								>
									Click here
								</button>
							</div>
						</div>
					</div>

					<div class="w-full max-w-lg py-2">
						<div
							class="text-lg font-semibold p-2 border hover:border-transparent hover:bg-primary-400 hover:text-white rounded-md group transition-colors duration-300 ease-in-out cursor-pointer"
							on:click={() => {
								toggleHelps();
								goto('/help-support');
							}}
						>
							We're here to <span class="text-primary-500 group-hover:text-white">Help</span>

							<div class="flex flex-row-reverse gap-2 items-center w-full p-1">
								<!-- Left side: Text content (3/4 width) -->
								<div class=" flex flex-col space-y-0">
									<div class="text-sm lg:text-sm sm:text-xs font-semibold font-montserrat">
										Get in touch if you have any questions or issues
									</div>
								</div>

								<!-- Right side: Button with icon (1/4 width) -->
								<div class=" flex justify-end items-center cursor-pointer">
									<button
										class=" sm:text-md text-xs text-nowrap text-white group-hover:text-primary-500 font-semibold border-1 p-2 rounded-md bg-white group-hover:bg-white group-hover:bg-none bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 bg-200p-200p bg-0p-50p animate-gradient-flow transition-all duration-300"
										type="submit"
									>
										Click here
									</button>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div>
							<ul class="flex flex-row items-center justify-around space-x-4 lg:mt-2">
								{#each contactInfo as { icon, text, href, ariaLabel, onClick }}
									<li>
										<a
											{href}
											class="w-10 h-10 flex items-center justify-center
         text-xl text-white bg-primary-400
         hover:bg-primary-500 transition-all duration-300
         rounded-full"
											aria-label={ariaLabel}
											on:click={onClick
												? (e) => {
														e.preventDefault();
														eval(onClick);
													}
												: undefined}
										>
											<Icon {icon} class="w-5 h-5" />
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- </div> -->
{/if}
