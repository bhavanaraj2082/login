<script>
	import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	export let isOpen = false;
	export let closePopup = () => {
		isOpen = !isOpen;

	};

	let activeSection = 'a';
	let isActive = false;
	let showAllowAllButton = true;
	let isMdScreen = false;

	function initializeState() {
		const token = getCookie('pb_auth');
		const necessaryCookies = getCookie('necessaryCookies');
		const functionalCookies = getCookie('functionalCookies');
		const performanceCookies = getCookie('performanceCookies');
		const targetingCookies = getCookie('targetingCookies');

		if (token) {
			try {
				const parsedToken = JSON.parse(token);
				if (parsedToken.token) {
					isActive = true;
					setCookie('functionalCookies','enabled',7);
				}
			} catch (error) {
				console.error('Invalid token format', error);
			}
		}

		if (!necessaryCookies) {
			setCookie('necessaryCookies', 'enabled', 7);
		}

		if (activeSection === 'b' && necessaryCookies) {
			isActive = necessaryCookies === 'enabled';
		} else if (activeSection === 'c' && functionalCookies) {
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
		if (activeSection === 'c' || activeSection === 'd' || activeSection === 'e'){
			isActive = !isActive;
			updateCookies();
		}
	}

	function updateCookies() {

		if (activeSection === 'b') {
			setCookie('necessaryCookies', 'enabled', 7);
		} else if (activeSection === 'c') {
			if (isActive) {
				setCookie('functionalCookies', 'enabled', 7);
			} else {
				deleteCookie('functionalCookies');
				logoutUser();
			}
		} else if (activeSection === 'd') {
			isActive ? setCookie('performanceCookies', 'enabled', 7) : deleteCookie('performanceCookies');
		} else if (activeSection === 'e') {
			isActive ? setCookie('targetingCookies', 'enabled', 7) : deleteCookie('targetingCookies');
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
		deleteCookie('functionalCookies');
		deleteCookie('performanceCookies');
		deleteCookie('targetingCookies');
		if (activeSection === 'b'){
			isActive = true;
		}
		closePopup();
		showAllowAllButton = true; 
	}

	function allowAllCookies(event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		}

		isActive = true;
		setCookie('necessaryCookies', 'enabled', 7);
		setCookie('functionalCookies', 'enabled', 7);
		setCookie('performanceCookies', 'enabled', 7);
		setCookie('targetingCookies', 'enabled', 7);
		closePopup();
		showAllowAllButton = false; 
	}

	function updateAllowAllButton() {
		const necessaryCookies = getCookie('necessaryCookies');
		const functionalCookies = getCookie('functionalCookies');
		const performanceCookies = getCookie('performanceCookies');
		const targetingCookies = getCookie('targetingCookies');

		if (necessaryCookies === 'enabled' && functionalCookies === 'enabled' && performanceCookies === 'enabled' && targetingCookies === 'enabled') {
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

	function logoutUser(){
		deleteCookie('pb_auth');
		deleteCookie('functionalCookies');
		deleteCookie('performanceCookies');
		deleteCookie('targetingCookies');
		goto('/logout');
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
<div class={`fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center sm:px-2 shadow-lg transition-opacity transition-visibility z-50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
	<div class='bg-white p-8 rounded shadow-lg w-full max-w-4xl h-auto max-h-screen overflow-y-auto mx-4 sm:mx-0'>
	<form class="w-full h-full overflow-y-scroll hide">
		<header class="flex mb-5 justify-between">
			<h2 class="pt-4 ml-2 text-xs xs:text-md sm:text-lg  mb-4 text-primary-400  font-bold">CHEMIKART</h2>
            <div class="flex sm:gap-20 gap-2">
                <h2 class="pt-4 pl-2 text-xs xs:text-md sm:text-lg  mb-4 text-primary-400  font-bold">Privacy Preference Center</h2>
                <button class="relative text-lg sm:text-xl md:text-2xl  text-primary-400 cursor-pointer transition duration-200 " on:click={closePopup}><Icon icon="gravity-ui:xmark" width="1.2em" height="1.2em"/></button>
            </div>
		</header>
		<section class="md:h-full overflow-y-scroll hide">
			<div class="flex flex-col md:flex-row gap-6 w-full mt-5">
				<div class="w-full md:w-96">
					<ul class="w-full pl-1">
						<li class="w-full">
							<a
							class={`block px-2 py-3 text-base text-heading font-semibold hover:font-bold border-b ${activeSection === 'a' ? 'bg-primary-100 ' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('a')}
							href="#a">
							Your Privacy
							{#if activeSection === 'a'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							
							{#if activeSection === 'a' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="text-x md:text-md font-bold py-2">
									<span class="text-primary-400">Your Privacy</span></h3>
								<p class="text-xs md:text-sm text-description">When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give a more personalized web exprience. Because we respect your right to privacy, you can choose not to allow some types cookies. 
									Please note that blocking some types of cookies.</p>
									<a class="text-xs text-primary-400 hover:text-primary-600 hover:underline" href="/about-privacy">Privacy Policy</a>
							</div>
							{/if}
						</li>
						<li>
							<a
							class={`block px-2 py-3 text-base text-heading font-semibold hover:font-bold border-b  ${activeSection === 'b' ? 'bg-primary-100 ' : ''}  flex justify-between items-center`}
							on:click={() => handleSidebarClick('b')}
							href="#b">
							Necessary Cookies
                            {#if activeSection === 'b'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'b' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md justify-between font-bold py-2">
									<span class="text-primary-400">Necessary Cookies</span>
									<div class="flex gap-2">
                                    <button class="py-1 text-xs font-semibold sm:ml-60 text-primary-400 pb-5 transition-colors duration-300">
										Always Active
									  </button>
									  <!-- <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
                                        <button 
                                          on:click={ontoggle} 
                                          class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-primary-600'} transition-colors duration-300`}>
                                          <div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                        </button>
                                      </div> -->
									</div>
                                </h3>
								<p class="text-xs md:text-sm text-description">These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identificable information.</p>
							</div>
							{/if}
						</li>

						<li>
							<a
							class={`block px-2 py-3 text-base text-heading font-semibold hover:font-bold border-b ${activeSection === 'c' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('c')}
							href="#c">
							Functional Cookies
                            {#if activeSection === 'c'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'c' && !isMdScreen}
							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md justify-between font-bold  py-2">
									<span class="text-primary-400">Functional Cookies</span>
									<div class="flex gap-2">
									<button on:click={ontoggle} class={`py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400 pb-5' : 'text-gray-600 pb-5'} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div class="relative mr-4 w-8 h-6 rounded-full cursor-pointer transition-colors">
										<button 
										  on:click={toggleActive} 
										  class={`w-11 h-4 mt-1 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
										  aria-pressed={isActive} 
										  type="button" 
										  aria-label="Toggle functional cookies">
										  <div class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}></div>
										</button>
									  </div>									  
									  </div>
								</h3>
								<p class="text-xs md:text-sm text-description">These Cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers who's services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.</p>
							</div>
							{/if}
						</li>
						<li>
							<a
							class={`block px-2 py-3 text-base text-heading font-semibold hover:font-bold border-b ${activeSection === 'd' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('d')}
							href="#d">
							Performance Cookies
							{#if activeSection === 'd'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em"/>
							{/if}
						  </a>
							{#if activeSection === 'd' && !isMdScreen}

							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold justify-between py-2">
									<span class="text-primary-400">Performance Cookies</span>
									<div class="flex gap-2">
									<button on:click={ontoggle} class={`py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400 pb-5' : 'text-gray-600 pb-5'} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div
									  role="button"
									  tabindex="0"
									  aria-pressed={isActive}
									  class="relative mr-4 w-8 h-6 rounded-full cursor-pointer transition-colors"
									  on:click={toggleActive}
									  on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleActive()}
									>
									  <div
										class={`w-11 h-4 mt-1 border flex items-center rounded-full transition-colors duration-300 ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
									  >
										<div
										  class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}
										></div>
									  </div>
									</div>
									</div>
								</h3>
								<p class="text-xs md:text-sm text-description">Performance Cookies collect data on how visitors use the website, such as which pages are visited most often and how users navigate through the site. This information helps improve site performance and user experience. While they do not identify individual users, they provide insights that are used to enhance the overall functionality of the website. Disabling these cookies may affect the website's performance monitoring.</p>
							</div>
							{/if}
						</li>

						<li>
							<a
							class={`block  px-2 py-3 text-base text-heading font-semibold hover:font-bold border-b ${activeSection === 'e' ? 'bg-primary-100' : ''} flex justify-between items-center`}
							on:click={() => handleSidebarClick('e')}
							href="#e">
							Targeting Cookies
							{#if activeSection === 'e'}
                            <Icon icon="icon-park-outline:right" width="1.2em" height="1.2em" />
							{/if}
						  </a>
							{#if activeSection === 'e'&& !isMdScreen}

							<div class="p-2 bg-gray-100">
								<h3 class="flex text-sm md:text-md font-bold justify-between py-2">
							<span class="text-primary-400">Targeting Cookies</span>
							<div class="flex gap-2">
									<button on:click={ontoggle} class={`py-1 text-xs font-semibold sm:ml-60 ${isActive ? 'text-primary-400 pb-5' : 'text-gray-600 pb-5'} transition-colors duration-300`}>
										{isActive ? 'Active' : 'Inactive'}
									  </button>
									  <div
									  role="button"
									  tabindex="0"
									  aria-pressed={isActive}
									  class="relative mr-4 w-8 h-6 rounded-full cursor-pointer transition-colors"
									  on:click={toggleActive}
									  on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleActive()}
									>
									  <div
										class={`w-11 h-4 mt-1 border flex items-center rounded-full transition-colors duration-300 ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
									  >
										<div
										  class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}
										></div>
									  </div>
									</div>
									</div>
								</h3>
								<p class="text-xs md:text-sm text-description">These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relavent adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your brower and internet device. If you do not allow these cookies, you will experience less targeted advertising.</p>
							</div>
							{/if}
						</li>
					</ul>
				</div>
		

				<div class="w-full p-2 mx-6 ml-2 hidden md:block border border-primary-400 rounded-md">
					{#if activeSection === 'a'}
  						<div id="a">
    						<h3 class="text-md font-bold py-1 text-heading flex gap-2"> 
      							<Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
								  <span class="text-primary-400">Your Privacy</span>
    						</h3>
    						<p class="text-xs ml-10 text-description">
                                When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give a more personalized web exprience. Because we respect your right to privacy, you can choose not to allow some types cookies. 
                                Please note that blocking some types of cookies.
    						</p>
    						<a class="text-xs text-primary-400 ml-10 hover:underline" href="/about-privacy">Privacy Policy</a>
  						</div>
					{/if}
					{#if activeSection === 'b'}
  						<div id="b">
    						<h3 class="text-md font-bold py-1 flex justify-between">
								<div class="flex text-heading">
                                <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
      							<span class="text-primary-400 pl-3">Necessary Cookies</span>
								</div>
								<div class="flex gap-2">
								  <button 
								  class="py-1 mr-2 text-sm font-semibold text-primary-400 transition-colors duration-300">
								  Always Active
								</button>
								<!-- <div class="relative pl-2 ml-1 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors" on:click={toggleActive}>
								  <button 
									on:click={ontoggle} 
									class={`w-11 h-4 mt-1 border-primary-200 border flex items-center rounded-full px-0 cursor-pointer ${isActive ? 'border-primary-200' : 'border-gray-600'} transition-colors duration-300`}>
									<div class={`w-3 h-3 bg-primary-400  rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
								  </button>
								</div> -->
								</div>
    						</h3>
    						<p class="text-xs ml-10 text-description">
                                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identificable information.
    						</p>
  						</div>
					{/if}
					{#if activeSection === 'c'}
					<div id="c">
					  <h3 class="text-md font-bold py-1 flex justify-between">
						<div class="flex text-heading">
                        <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                        <span class="text-primary-400 pl-3">Functional Cookies</span>
						</div>
						<div class="flex gap-2">
                        <button 
                        on:click={ontoggle} 
                        class={`py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-gray-600'} transition-colors duration-300`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
					  <div
					  role="button"
					  tabindex="0"
					  aria-pressed={isActive}
					  class="relative mr-4 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors"
					  on:click={toggleActive}
					  on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleActive()}
					  >
					  <div
						  class={`w-11 h-4 mt-1 border flex items-center rounded-full transition-colors duration-300 ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
					  >
						  <div
						  class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}
						  ></div>
					  </div>
					  </div>
					  </div>
					  </h3>
					  <p class="text-xs ml-9 text-description">
						These Cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party prividers whoes services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.
					  </p>
					</div>
				  {/if}
				  
					
				  {#if activeSection === 'd'}
				  <div id="d">
					<h3 class="text-md font-bold py-1 flex justify-between">
					<div class="flex text-heading">
                    <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                    <span class="text-primary-400 pl-3">Performance Cookies</span>
					</div>
					<div class="flex gap-2">
                    <button 
                    on:click={ontoggle} 
                    class={`py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-gray-600'} transition-colors duration-300`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
				  <div
				  role="button"
				  tabindex="0"
				  aria-pressed={isActive}
				  class="relative mr-4 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors"
				  on:click={toggleActive}
				  on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleActive()}
				  >
				  <div
					  class={`w-11 h-4 mt-1 border flex items-center rounded-full transition-colors duration-300 ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
				  >
					  <div
					  class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}
					  ></div>
				  </div>
				  </div>
				</div>
					</h3>
					<p class="text-xs ml-10 text-description">
					  Performance Cookies collect data on how visitors use the website, such as which pages are visited most often and how users navigate through the site. This information helps improve site performance and user experience. While they do not identify individual users, they provide insights that are used to enhance the overall functionality of the website. Disabling these cookies may affect the website's performance monitoring.
					</p>
				  </div>
				{/if}
				{#if activeSection === 'e'}
				<div id="e">
                    <h3 class="text-md font-bold py-1 flex justify-between">
					<div class="flex text-heading">	
                    <Icon icon="fluent:cookies-48-regular" width="1.6em" height="1.6em" class="text-primary-400"/>
                    <span class="text-primary-400 pl-3">Targeting Cookies</span>
					</div>
					<div class="flex gap-2">
                    <button 
                    on:click={ontoggle} 
                    class={`py-1 text-sm font-semibold  ${isActive ? 'text-primary-400' : 'text-gray-600'} transition-colors duration-300`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
				  <div
				  role="button"
				  tabindex="0"
				  aria-pressed={isActive}
				  class="relative mr-4 mt-1 w-8 h-6 rounded-full cursor-pointer transition-colors"
				  on:click={toggleActive}
				  on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleActive()}
				  >
				  <div
					  class={`w-11 h-4 mt-1 border flex items-center rounded-full transition-colors duration-300 ${isActive ? 'border-primary-400' : 'border-gray-600'} transition-colors duration-300`}
				  >
					  <div
					  class={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'bg-primary-600 translate-x-7' : 'bg-gray-800 translate-x-0.5'}`}
					  ></div>
				  </div>
				  </div>
				</div>
				  </h3>
				  <p class="text-xs ml-10 text-description">
					These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relavent adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your brower and internet device. If you do not allow these cookies, you will experience less targeted advertising.
				  </p>
				</div>
			  {/if}
				</div>
			</div>
		</section>		
		  

		<footer>
			<div class="flex relative justify-between mb-2 space-x-2">
				<div class="w-full sm:w-auto flex">
				<button
					class="ml-0 sm:ml-0 mt-5 sm:mt-5 py-2 sm:w-py-2 px-4 sm:px-8 md:px-12 text-xs sm:text-sm bg-primary-400 text-white rounded cursor-pointer font-medium hover:bg-primary-400 hover:bg-opacity-75 transition-all duration-300"
					on:click={confirmCookies}
				>
					Confirm My Cookies
				</button>
				</div>
		
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
</div>
