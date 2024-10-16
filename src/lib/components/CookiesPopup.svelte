<script>
	import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
	export let isOpen = false;
	export let closePopup = () => {
		isOpen = !isOpen;

	};

	let activeSection = 'a';
	let isActive = false;
	let showAllowAllButton = true;
	let isMdScreen = false;

	function initializeState() {
		const functionalCookies = getCookie('EG-S-ID');
		const performanceCookies = getCookie('ar_debug');
		const targetingCookies = getCookie('SRCHD');

		if (activeSection === 'c' && functionalCookies) {
			isActive = functionalCookies === 'enabled';
		} else if (activeSection === 'd' && performanceCookies) {
			isActive = performanceCookies === 'enabled';
		} else if (activeSection === 'e' && targetingCookies) {
			isActive = targetingCookies === 'enabled';
		} else {
			isActive = false; 
		}
		updateAllowAllButton();
	}

	function handleSidebarClick(section) {
		activeSection = section;
		initializeState();
	}

	function toggleActive(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}
		isActive = !isActive;
		updateCookies();
	}

	function updateCookies() {

		if (activeSection === 'c') {
			isActive ? setCookie('EG-S-ID', 'enabled', 7) : deleteCookie('EG-S-ID');
		} else if (activeSection === 'd') {
			isActive ? setCookie('ar_debug', 'enabled', 7) : deleteCookie('ar_debug');
		} else if (activeSection === 'e') {
			isActive ? setCookie('SRCHD', 'enabled', 7) : deleteCookie('SRCHD');
		}
		onToggle();
		updateAllowAllButton();
	}

	function onToggle() {
		console.log('Toggle switched', isActive);
	}

	function confirmCookies() {
		closePopup();
	}

	function rejectAllCookies(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}
		isActive = false;
		deleteCookie('EG-S-ID');
		deleteCookie('ar_debug');
		deleteCookie('SRCHD');
		closePopup();
		showAllowAllButton = true; 
	}

	function allowAllCookies(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}

		isActive = true;
		setCookie('EG-S-ID', 'enabled', 7);
		setCookie('ar_debug', 'enabled', 7);
		setCookie('SRCHD', 'enabled', 7);
		closePopup();
		showAllowAllButton = false; 
	}

	function updateAllowAllButton() {
		const functionalCookies = getCookie('EG-S-ID');
		const performanceCookies = getCookie('ar_debug');
		const targetingCookies = getCookie('SRCHD');

		if (functionalCookies === 'enabled' && performanceCookies === 'enabled' && targetingCookies === 'enabled') {
			showAllowAllButton = false;
		} else {
			showAllowAllButton = true;
		}
	}

	function setCookie(name, value, days) {
		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = `expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value}; ${expires}; path=/; samesite=none; secure`;
	}

	function deleteCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=none; secure`;
	}

	function getCookie(name) {
		const nameEQ = `${name}=`;
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i].trim();
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
		}
		return null;
	}

	function updateScreenSize() {
    isMdScreen = window.innerWidth >= 768;
  	}

	onMount(() => {
		initializeState();
		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);
		return () => {
        window.removeEventListener('resize', updateScreenSize);
    };
	});
</script>

<!--  Start / Cookies Setting Popup -->
<div class={`${isOpen ? 'fixed inset-0  bg-opacity-50 z-50' : 'hidden'}`}></div>
<div class={`fixed top-10 left-1/2 transform -translate-x-1/2 h-4/5 w-10/12 lg:w-8/12 p-2 md:p-5  bg-white border border-gray-300 shadow-lg transition-opacity transition-visibility z-50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>

	<form class="w-full h-full overflow-y-scroll ">
		<header class="flex mb-5 justify-between">
			<h2 class="pt-4 text-xs xs:text-md sm:text-lg  mb-4 text-primary-400  font-bold">CHEMIKART</h2>
            <div class="flex sm:gap-20 gap-2">
                <h2 class="pt-4  text-xs xs:text-md sm:text-lg  mb-4 text-primary-400  font-bold">Privacy Preference Center</h2>
                <button class="relavtive text-lg sm:text-xl md:text-2xl  text-primary-400 cursor-pointer transition duration-200 " on:click={closePopup}><Icon icon="gravity-ui:xmark" width="1.2em" height="1.2em"/></button>
            </div>
		</header>
		<section class="md:h-full overflow-y-scroll overflow-hidden">
			<div class="flex flex-col md:flex-row w-full mt-5">
				<div class="w-full md:w-96">
					<ul class="w-full pl-1">
						<li class="w-full">
							<a
							class={`block px-2 py-3 text-base font-semibold hover:font-bold border-b ${activeSection === 'a' ? 'bg-primary-100 ' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('a')}
							href="#a">
							Your Privacy
							{#if activeSection === 'a'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							
							{#if activeSection === 'a' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="text-x md:text-md font-bold py-2">Your Privacy</h3>
								<p class="text-xs md:text-sm">When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give a more personalized web exprience. Because we respect your right to privacy, you can choose not to allow some types cookies. 
									Please note that blocking some types of cookies.</p>
									<a class="text-xs text-primary-400 hover:text-primary-600 hover:underline" href="/about-privacy">Privacy Policy</a>
							</div>
							{/if}
						</li>
						<li>
							<a
							class={`block px-2 py-3 text-base font-semibold hover:font-bold border-b  ${activeSection === 'b' ? 'bg-primary-100 ' : ''}  flex justify-between items-center`}
							on:click={() => handleSidebarClick('b')}
							href="#b">
							Necessary Cookies
                            {#if activeSection === 'b'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'b' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold py-2">Necessary Cookies
                                    <button on:click={ontoggle} class={`ml-2 pl-16 py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400' : 'text-primary-400'} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                                        <button 
                                          on:click={ontoggle} 
                                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-primary-600'} transition-colors duration-300`}>
                                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                        </button>
                                      </div>
                                </h3>
								<p class="text-xs md:text-sm">These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identificable information.</p>
							</div>
							{/if}
						</li>

						<li>
							<a
							class={`block px-2 py-3 text-base font-semibold hover:font-bold border-b ${activeSection === 'c' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('c')}
							href="#c">
							Functional Cookies
                            {#if activeSection === 'c'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'c' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold  py-2">Functional Cookies
									<button on:click={ontoggle} class={`ml-2 pl-16 py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400' : ''} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                                        <button 
                                          on:click={ontoggle} 
                                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                        </button>
                                      </div>
								</h3>
								<p class="text-xs md:text-sm">These Cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party prividers whoes services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.</p>
							</div>
							{/if}
						</li>
						<li>
							<a
							class={`block px-2 py-3 text-base font-semibold hover:font-bold border-b ${activeSection === 'd' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('d')}
							href="#d">
							Performance Cookies
							{#if activeSection === 'd'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'd' && !isMdScreen}

							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold py-2">Performance Cookies
									<button on:click={ontoggle} class={`ml-2 pl-16 py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400' : ''} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div class="relative pl-1 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                                        <button 
                                          on:click={ontoggle} 
                                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                        </button>
                                      </div>
								</h3>

								<p class="text-xs md:text-sm">Performance Cookies collect data on how visitors use the website, such as which pages are visited most often and how users navigate through the site. This information helps improve site performance and user experience. While they do not identify individual users, they provide insights that are used to enhance the overall functionality of the website. Disabling these cookies may affect the website's performance monitoring.</p>
							</div>
							{/if}
						</li>

						<li>
							<a
							class={`block  px-2 py-3 text-base font-semibold hover:font-bold border-b ${activeSection === 'e' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('e')}
							href="#e">
							Targeting Cookies
							{#if activeSection === 'e'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em" />
							{/if}
						  </a>
							{#if activeSection === 'e'&& !isMdScreen}

							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold py-2">Targeting Cookies
									<button on:click={ontoggle} class={`ml-2 pl-16 py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400' : ''} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                                        <button 
                                          on:click={ontoggle} 
                                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                        </button>
                                      </div>
								</h3>

								<p class="text-xs md:text-sm">These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relavent adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your brower and internet device. If you do not allow these cookies, you will experience less targeted advertising.</p>
							</div>
							{/if}
						</li>
					</ul>
				</div>
		

				<div class="w-full p-2 ml-2 hidden md:block border border-primary-400 rounded-md">
					{#if activeSection === 'a'}
  						<div id="a">
    						<h3 class="text-md font-bold py-1  flex gap-2"> 
      							<Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
								  <span class="text-primary-400">Your Privacy</span>
    						</h3>
    						<p class="text-xs ml-10">
                                When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give a more personalized web exprience. Because we respect your right to privacy, you can choose not to allow some types cookies. 
                                Please note that blocking some types of cookies.
    						</p>
    						<a class="text-xs text-primary-400 ml-10 hover:underline" href="/about-privacy">Privacy Policy</a>
  						</div>
					{/if}
					{#if activeSection === 'b'}
  						<div id="b">
    						<h3 class="text-md font-bold py-1 flex  ">
                                <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
      							<span class="text-primary-400 ">Necessary Cookies</span>
								  <button 
								  on:click={ontoggle} 
								  class={`lg:ml-10 lg:pl-16 ml-5 pl-0 py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-primary-400'} transition-colors duration-300`}>
								  {isActive ? 'Active' : 'Inactive'}
								</button>
								<div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
								  <button 
									on:click={ontoggle} 
									class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
									<div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
								  </button>
								</div>
    						</h3>
    						<p class="text-xs ml-10">
                                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identificable information.
    						</p>
  						</div>
					{/if}
					{#if activeSection === 'c'}
					<div id="c">
					  <h3 class="text-md font-bold py-1 flex ">
                        <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                        <span class="text-primary-400">Functional Cookies</span>
                        <button 
                        on:click={ontoggle} 
                        class={`ml-10 pl-16 py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-primary-400'} transition-colors duration-300`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                      <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                        <button 
                          on:click={ontoggle} 
                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
					  </h3>
					  <p class="text-xs ml-9">
						These Cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party prividers whoes services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.
					  </p>
					</div>
				  {/if}
				  
					
				  {#if activeSection === 'd'}
				  <div id="d">
					<h3 class="text-md font-bold py-1 flex ">
                    <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                    <span class="text-primary-400">Performance Cookies</span>
                    <button 
                    on:click={ontoggle} 
                    class={`ml-10 pl-16 py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-primary-400'} transition-colors duration-300`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                  <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                    <button 
                      on:click={ontoggle} 
                      class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                      <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
					</h3>
					<p class="text-xs ml-10">
					  Performance Cookies collect data on how visitors use the website, such as which pages are visited most often and how users navigate through the site. This information helps improve site performance and user experience. While they do not identify individual users, they provide insights that are used to enhance the overall functionality of the website. Disabling these cookies may affect the website's performance monitoring.
					</p>
				  </div>
				{/if}
				{#if activeSection === 'e'}
				<div id="e">
                    <h3 class="text-md font-bold py-1 flex ">
                    <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                    <span class="text-primary-400">Targeting Cookies</span>
                    <button 
                    on:click={ontoggle} 
                    class={`ml-10 pl-16 py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-primary-400'} transition-colors duration-300`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                  <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                    <button 
                      on:click={ontoggle} 
                      class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
                      <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
				  </h3>
				  <p class="text-xs ml-10">
					These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relavent adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your brower and internet device. If you do not allow these cookies, you will experience less targeted advertising.
				  </p>
				</div>
			  {/if}
				</div>
			</div>
		</section>		
		  

		<footer>
			<div class="flex relative justify-between mb-2 space-x-2">
				<button
					class="ml-0 sm:ml-6 mt-5 py-2 sm:w-2/6 w-3/6 text-xs sm:text-sm bg-primary-400 text-white rounded cursor-pointer font-semibold hover:bg-primary-400 hover:bg-opacity-75 transition-all duration-300"
					on:click={confirmCookies}
				>
					Confirm My Cookies
				</button>
		
				<div class="flex space-x-2">
                    {#if showAllowAllButton}
						<button
							class="mt-5 py-2 px-4 bg-primary-400 text-xs sm:text-sm text-white rounded cursor-pointer font-medium hover:bg-primary-400 hover:bg-opacity-75 transition-all duration-300"
							on:click={allowAllCookies}
						>
							Allow All
						</button>
					{/if}
					<button
						class="mt-5 py-2 px-3 bg-primary-400 text-xs sm:text-sm text-white rounded cursor-pointer font-medium hover:bg-primary-400 hover:bg-opacity-75 transition-all duration-300"
						on:click={rejectAllCookies}
					>
						Reject All
					</button>
				</div>
			</div>
		</footer>		
	</form>
</div>
