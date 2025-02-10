<script>
	import { authedUser } from '$lib/stores/mainStores.js';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Cartrightside from '$lib/components/HeaderDropDownCart/Cartrightside.svelte';
	import menusdata from '$lib/data/chemicalProducts.json';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { slide, fade } from 'svelte/transition';

	let menus = [];
	let submenuLeaveTimeoutId;
	let subSubmenuLeaveTimeoutId;
	let activeMenu = null;
	let activeSubmenu = null;
	let hoveredSubSubmenu = null;
	let form;
	let searchQuery = '';
	let debounceTimeout;
	let isLoading = false;
	let searchResults = [];
	let isLiked = false;
	const heartOutline = 'mdi:heart-outline';
	const heartFilled = 'mdi:heart';
	// $authedUser.email="rukhiyasameen@gmail.com"
	// $authedUser.username="Sameena"
	let userEmail = $authedUser.email;
	let userName = $authedUser.username;
	
	$: showUserOptions = false;
  let dropdown; 
  function handleProfile(event) {
        event.stopPropagation(); 
        showUserOptions = !showUserOptions;

        if (showUserOptions) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }
    }

    function handleClickOutside(event) {
        if (dropdown && !dropdown.contains(event.target)) {
            showUserOptions = false;
            window.removeEventListener('click', handleClickOutside);
        }
    }
	const getInitial = (name) => name.charAt(0).toUpperCase();
	onMount(async () => {
		try {
			menus = menusdata.menus;
		} catch (error) {
			console.error('Error fetching menus:', error);
		}
		isLiked = false;
	});

	function handleMouseEnter(subSubmenu) {
		clearTimeout(subSubmenuLeaveTimeoutId);
		hoveredSubSubmenu = subSubmenu;
	}

	function handleMouseLeave() {
		subSubmenuLeaveTimeoutId = setTimeout(() => {
			hoveredSubSubmenu = null;
		}, 5000);
	}
	let menuTimeoutId;
	function toggleMenu(menu) {
		activeMenu = activeMenu === menu ? null : menu;
		if (activeMenu) activeSubmenu = null;
	}

	function handleMouseEnterMenu(menu) {
		clearTimeout(menuTimeoutId);
		activeMenu = menu;
		activeSubmenu = null;
	}

	function handleMouseLeaveMenu() {
		menuTimeoutId = setTimeout(() => {
			activeMenu = null;
			activeSubmenu = null;
		}, 300);
	}

	function handleMouseEnterSubmenu(submenu) {
		clearTimeout(submenuLeaveTimeoutId);
		activeSubmenu = submenu;
	}
	function handleMouseLeaveSubmenu() {
		submenuLeaveTimeoutId = setTimeout(() => {
			activeSubmenu = null;
		}, 50000);
	}
	function navigateTo(url) {
		window.location.href = url;
		isLiked = false;
	}
	let isOpen = false;

	function toggleLogoMenu() {
		isOpen = !isOpen;
	}

	function toggleLike() {
		isLiked = !isLiked;
	}
	
	function closeSidebar() {
    isOpen = false; 
  }

	function debounce(func, delay) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			func();
		}, delay);
	}

	function selectProduct() {
		searchQuery = '';
	}

	function handleSearchSubmit() {
		form.requestSubmit();
	}

	function handleInput(event) {
		searchQuery = event.target.value;
		isLoading = true;
		debounce(handleSearchSubmit, 300);
	}

	function handleData() {
		return async ({ result }) => {
			if (result) {
				isLoading = false;
			}
			searchResults = result?.data?.responce;
		};
	}
	const handleSubmitBtn = () => {
		if (searchQuery !== '') {
			goto('/search?query=' + searchQuery);
			searchQuery = '';
		}
	};
</script>
<nav class="bg-primary-400">
	{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={closeSidebar}
		class="fixed top-0 left-0 w-full h-full bg-gray-300/60 z-40 backdrop-blur-sm"
	></div>
{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class={`fixed top-0 left-0 h-full bg-primary-400 bg-opacity-70 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-9/12 overflow-y-auto`}
		on:click={(e) => e.stopPropagation()}
	>
	<!-- <div
	class={`fixed top-0 left-0 h-full bg-primary-950 bg-opacity-70 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-9/12 overflow-y-auto`}
> -->
		<div class="flex flex-col h-full p-10 font-medium text-gray-600">
			<div class="flex justify-between mb-2">
				<button
				on:click={() => {
					navigateTo('/');
				}}
				class="text-xl text-white font-semibold"
			>
				Chemikart
			</button>
				<button
					on:click={toggleLogoMenu}
					class="self-end text-primary-400 text-2xl hover:text-primary-400 transition duration-200"
				>
					<Icon icon="cuida:x-outline" class="w-10 h-5 hover:text-primary-600 text-white mb-1" />
				</button>
			</div>
			{#if activeMenu === null}
			{#each menus as menu}
				<button
					on:click={() =>
						(menu.title === 'Products' ||
							menu.title === 'Applications' ||
							menu.title === 'Services') &&
						menu.submenus
							? toggleMenu(menu)
							: navigateTo(menu.href)}
					class="flex justify-between text-left  text-white transition duration-200 w-full py-2 px-2 ml-2"
				>
					{menu.title}
					{#if menu.submenus && menu.submenus.length > 0}
						<Icon
							icon="prime:chevron-down"
							class="w-5 h-5 mr-2 text-white "
						/>
					{/if}
				</button>
			{/each}
			<div class="flex flex-col font-semibold">
				<button
					on:click={() => navigateTo('/quick-order')}
					class="text-left text-white text-md transition duration-200 w-full py-2 px-4 font-medium"
				>
					Quick Order
				</button>
				<button
					on:click={() => navigateTo('/order-status')}
					class="text-left text-white text-md transition duration-200 w-full py-2 px-4 font-medium"
				>
					Order Status
				</button>
			</div>
		{:else}
			<button
				on:click={() => toggleMenu(null)}
				class="text-gray-800 flex items-center gap-3 text-left font-semibold py-2 px-0 rounded transition duration-200"
			>
				<Icon icon="material-symbols:chevron-backward" class="w-5 h-5" />
				Back
			</button>
			{#if activeMenu.submenus && activeMenu.submenus.length > 0}
				<div class="mt-2 pb-2">
					{#each activeMenu.submenus as submenu}
						<button
							on:click={() => navigateTo(`${activeMenu.href}${submenu.href}`)}
							class="block text-gray-800 p-2 hover:text-primary-400 w-full text-left rounded transition duration-200"
						>
							{submenu.title}
						</button>
					{/each}
				</div>
			{/if}
		{/if}
		</div>
	</div>
	<div class="flex items-center justify-between w-11/12 py-0 sm:py-4 mx-auto max-w-7xl flex-wrap">
		<div class="flex md:hidden">
			<button
				on:click={toggleLogoMenu}
				class="flex items-center text-gray-600 focus:outline-none"
			>
				<Icon icon="fa6-solid:bars" class=" text-md text-white" />
			</button>
		</div>
		<div class="text-center pl-3 w-1/10">
			<button
				on:click={() => {
					navigateTo('/');
				}}
				class="flex items-center hover:text-primary-100 hover:scale-105 text-white text-2xl md:text-3xl lg:text-3xl sm:text-2xl font-poppins md:mb-0 py-2 font-roboto font-bold"
			>
				Chemikart
			</button>
		</div>
		<!-- SMALL -->
		<div class="md:hidden flex items-center gap-1">
			{#if $authedUser.email}
						<div class="relative bg-white" bind:this={dropdown}>
				<button
						class="w-4 h-4 flex items-center justify-center bg-primary-400 text-white rounded-full text-xs"
						on:click={handleProfile}>
						{getInitial(userName)}
				</button>
				{#if showUserOptions}
				<div class="relative">
					<div class="absolute right-0 top-2 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
					  <!-- Triangle -->
					  <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
				  
					  <button
						on:click={() => navigateTo('/profile')}
						class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
						My Profile
					  </button>
					  <button
						on:click={() => navigateTo('/logout')}
						class="loginbtn block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
						Logout
					  </button>
					</div>
				  </div>
				  
				{/if}
		</div>
		{:else}
				<div class="flex items-center justify-between">
					<div class="relative bg-primary-400" bind:this={dropdown}>
						<button
								class="w-4 h-4 flex items-center justify-center bg-primary-400 text-white rounded-full"
								on:click={handleProfile}>
								<Icon 
					icon="tdesign:user-filled" 
					class="w-4 h-4 flex items-center justify-center bg-white text-primary-400 rounded-full p-1"
				/>
						</button>
						{#if showUserOptions}
						<div class="relative">
							<div class="absolute right-0 top-2 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
							  <!-- Triangle -->
							  <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
						  
							  <button
								on:click={() => navigateTo('/login')}
								class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
								Login
							  </button>
							  <button
								on:click={() => navigateTo('/signup')}
								class="loginbtn block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
								Register
							  </button>
							</div>
						  </div>
						{/if}
				</div>
				</div>
			{/if}
			<a href="/my-favourite">
				<button
					on:click={toggleLike}
					aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
					class={`py-2 rounded-full transition-all duration-300 ease-in-out relative overflow-hidden ${isLiked ? 'bg-gray-50' : 'bg-transparent'}`}
				>
					<Icon
						icon={isLiked ? heartFilled : heartOutline}
						class={`text-lg transition-colors duration-300 hover:text-primary-400 ease-in-out ${isLiked ? 'text-white' : 'text-primary-100'}`}
					/>
				</button>
			</a>
			<Cartrightside />
		</div>
		<!-- Searchbar functionality -->
		<div class="relative sm:max-w-3xl md:max-w-sm lg:max-w-md xl:max-w-xl  sm:mt-2 w-full sm:pb-0 pb-2 mx-auto">
			<form action="/?/search" method="post" bind:this={form} use:enhance={handleData}>
				<div class=" w-full flex items-center">
					<input
						type="text"
						placeholder="Search for Product Names, Numbers, or CAS Numbers"
						bind:value={searchQuery}
						name="query"
						on:input={handleInput}
						class=" border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 w-full px-3 py-3 text-sm placeholder:text-xs truncate pr-12 sm:pr-10"
					/>
					{#if isLoading}
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Icon
								icon="ei:spinner"
								class="w-8 h-8 animate-spin text-primary-600 opacity-75 text-5xl"
							/>
						</div>
					{/if}
					<button
						class="absolute right-1 sm:top-1/2 top-[42%] transform -translate-y-1/2 bg-primary-400 text-white w-10 h-10 flex items-center justify-center rounded-md"
						on:click={handleSubmitBtn}
					>
						<Icon icon="feather:search" style="width: 25px; height: 25px;" />
					</button>
				</div>
				{#if searchQuery.trim() && searchResults && searchResults.length > 0}
					<ul
						class="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-30 max-h-60 overflow-y-auto"
					>
						{#each searchResults as product}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<li
								class="px-0 py-0 text-sm text-gray-800 hover:bg-primary-200 cursor-pointer"
								on:click={() => selectProduct(product)}
							>
								<a
									href={`/products/${product?.category?.urlName}/${product?.subCategory?.urlName}/${product?.productNumber}`}
									class="block w-full text-sm text-gray-800 px-4 py-2"
								>
									{product?.productName}
								</a>
							</li>
						{/each}
					</ul>
				{:else if searchQuery.trim() && isLoading}
					<p
						class="absolute w-full bg-white text-sm text-gray-500 py-2 px-4 mt-1 border border-gray-300 z-30 rounded flex items-center justify-start"
					>
						<Icon
							icon="ei:spinner"
							class="w-8 h-8 animate-spin-slow text-primary-600 mx-2 text-5xl"
						/>
						<span>Loading Products...</span>
					</p>
				{:else if searchQuery.trim() && searchResults && searchResults.length === 0}
					<p
						class="absolute w-full bg-white text-sm text-gray-500 py-2 px-4 mt-1 border border-gray-300 z-30 rounded"
					>
						No products found
					</p>
				{/if}
			</form>
		</div>
		<!-- big-->
		<div class="md:flex hidden w-1/10">
			{#if $authedUser.email}
			
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="relative p-2 bg-primary-200 hidden md:block cursor-pointer rounded-md" on:click={handleProfile} bind:this={dropdown}>
				<button
						class="mr-2 flex flex-row justify-center cursor-pointer z-30 gap-2">
						<p class="w-7 h-7 flex items-center justify-center bg-primary-400 text-white rounded-full text-lg"
						>{getInitial(userName)}
					</p>
						<h2 class="text-sm text-primary-500 mt-1">{userName}</h2>
						<button on:click={handleProfile}>
							<Icon
								icon={showUserOptions ? 'ion:chevron-up' : 'ion:chevron-down'}
								class="text-primary-500 mt-0.5"
							/>
					</button>
				</button>
		
				{#if showUserOptions}
				<div class="relative">
					<div class="absolute right-0 top-2 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
					  <!-- Triangle -->
					  <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
				  
					  <button
						on:click={() => navigateTo('/profile')}
						class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
						My Profile
					  </button>
					  <button
						on:click={() => navigateTo('/logout')}
						class="loginbtn block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
						Logout
					  </button>
					</div>
				  </div>
				{/if}
		</div>
			{:else}
				<div class="flex items-center justify-between">
					<button
						on:click={() => {
							navigateTo('/login');
						}}
						class="  loginbtn text-md font-medium border-b-2 border-b-transparent hover:text-primary-100 hover:scale-105 text-white"
						>Login</button
					>
					<Icon icon="vaadin:line-v" class="mr-0 text-white font-semibold" />
					<button
						on:click={() => {
							navigateTo('/signup');
						}}
						class=" registerbtn pr-2  text-md font-medium border-b-2 border-b-transparent hover:text-primary-100 hover:scale-105 text-white"
						>Register</button
					>
				</div>
			{/if}
		</div>
	</div>
	<div class="hidden md:flex mx-auto w-full">
		<!-- Menu Section -->
		<div class="md:flex mx-auto justify-between w-11/12 max-w-7xl">
			<div class="md:flex justify-around items-center lg:gap-2 hidden">
				{#each menus as menu, index}
					<!-- svelte-ignore a11y-interactive-supports-focus -->
					<div
						class="relative group"
						role="menu"
						on:mouseenter={() => handleMouseEnterMenu(menu)}
						on:mouseleave={handleMouseLeaveMenu}
					>
						<div
							class={`py-0 pr-2 pl-3 ${activeMenu === menu ? 'text-orange-500' : 'text-gray-600'}`}
						>
							<button
								on:click={() => navigateTo(menu.href)}
								class={`flex items-center hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md text-nowrap text-xs lg:text-base font-medium text-left w-full ${activeMenu === menu ? 'text-white scale-105' : 'text-white'}`}
								role="menuitem"
							>
								{menu.title}
								{#if index < 5 && menu.title !== 'Documents' && menu.title !== 'Support'}
									<Icon icon="prime:chevron-down" class="ml-1 w-5 h-5 " />
								{/if}
							</button>
						</div>

						{#if menu.submenus && menu.submenus.length > 0}
							<div
								class={`absolute shadow-md z-20 rounded-sm mt-0 ml-2 bg-white transition-opacity duration-200 ${activeMenu === menu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
								role="menu"
							>
								{#each menu.submenus as submenu}
									<!-- svelte-ignore a11y-interactive-supports-focus -->
									<div
										class="relative group hover:text-primary-950"
										role="menu"
										on:mouseenter={() => handleMouseEnterSubmenu(submenu)}
										on:mouseleave={handleMouseLeaveSubmenu}
									>
										<button
											on:click={() => navigateTo(`${menu.href}${submenu.href}`)}
											class="flex relative text-left mr-24 pl-4 py-1 px-4 md:text-xs lg:text-sm hover:bg-primary-50 w-full"
											role="menuitem"
										>
											<span
												class={`absolute left-0 top-0 h-full w-1 bg-primary-400 transition-all duration-200 ${activeSubmenu === submenu ? 'opacity-100 text-gray-800' : 'opacity-0'}`}
											></span>
											{submenu.title}
											<Icon
												icon="material-symbols:chevron-right"
												class={`absolute right-2 w-5 h-5 transition-colors duration-200 ${activeSubmenu === submenu ? 'text-primary-600' : 'text-gray-300'}`}
											/>
										</button>
									</div>
									{#if submenu.subSubmenus && submenu.subSubmenus.length > 0}
										<div
											class={`mt-0 ml-0 border-gray-300 border-l h-full overflow-y-scroll scroll absolute left-full rounded-sm pb-2 top-0 z-30 w-full bg-white shadow-sm transition-opacity duration-200 ${activeSubmenu === submenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
											role="menu"
										>
											<ul>
												{#each submenu.subSubmenus as subSubmenu}
													<li
														class="hover:bg-primary-50 relative"
														on:mouseenter={() => handleMouseEnter(subSubmenu)}
														on:mouseleave={handleMouseLeave}
													>
														<button
															on:click={() =>
																navigateTo(`${menu.href}${submenu.href}${subSubmenu.href}`)}
															class="title block text-left py-1 pl-4 md:text-xs lg:text-sm text-gray-700 w-full"
															role="menuitem"
														>
															{#if hoveredSubSubmenu === subSubmenu}
																<span
																	class="absolute left-0 top-0 h-full w-1 transition-opacity duration-200"
																></span>
															{/if}
															{subSubmenu.title}
														</button>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
			<div class="flex gap-4 text-gray-600 items-center ">
				<a href="/quick-order">
					<button class="hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md hover:scale-105">
						<span class="text-white font-medium text-xs lg:text-sm">
							Quick Order
						</span>
					</button>
				</a>
				
				<a href="/order-status">
					<button class="hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md hover:scale-105">
						<span class="text-white font-medium text-xs lg:text-sm">
							Order Status
						</span>
					</button>
				</a>
				
				
				<div class="md:flex hidden items-center justify-center">
					<a href="/my-favourite">
						<button
							on:click={toggleLike}
							aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
							class={`py-2 rounded-full transition-all duration-300 ease-in-out relative overflow-hidden ${isLiked ? 'bg-white' : 'bg-transparent'}`}
						>
							<Icon
								icon={isLiked ? heartFilled : heartOutline}
								class={`text-2xl transition-colors duration-300 hover:text-primary-100 hover:scale-105 text-white ease-in-out ${isLiked ? 'text-primary-400' : 'text-gray-600'}`}
							/>
						</button>
					</a>
				</div>
				<Cartrightside />
			</div>
		</div>
	</div>
</nav>