<script>
	import { authedUser } from '$lib/stores/mainStores.js';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Cartrightside from '$lib/components/HeaderDropDownCart/Cartrightside.svelte';
	import menusdata from '$lib/data/chemicalProducts.json';
	import { enhance } from "$app/forms";

	let menus = [];
	let submenuLeaveTimeoutId;
	let subSubmenuLeaveTimeoutId;
	let activeMenu = null;
	let activeSubmenu = null;
	let hoveredSubSubmenu = null;
	let form;
	let searchQuery = "";
	let debounceTimeout;
	let isLoading = false;
	let searchResults=[]

	//console.log('header',$authedUser)
	const getInitial = (name) => name.charAt(0).toUpperCase();
	onMount(async () => {
		try {
			menus = menusdata.menus;
		} catch (error) {
			console.error('Error fetching menus:', error);
		}
	});

	function handleMouseEnter(subSubmenu) {
		clearTimeout(subSubmenuLeaveTimeoutId);
		hoveredSubSubmenu = subSubmenu;
	}

	function handleMouseLeave() {
		subSubmenuLeaveTimeoutId = setTimeout(() => {
			hoveredSubSubmenu = null;
		}, 800);
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
		}, 1000);
	}

	function handleMouseEnterSubmenu(submenu) {
		clearTimeout(submenuLeaveTimeoutId);
		activeSubmenu = submenu;
	}
	function handleMouseLeaveSubmenu() {
		submenuLeaveTimeoutId = setTimeout(() => {
			activeSubmenu = null;
		}, 10000);
	}
	function navigateTo(url) {
		window.location.href = url;
	}
	let isOpen = false;

	function toggleLogoMenu() {
		isOpen = !isOpen;
	}

	function debounce(func, delay) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			func();
		}, delay);
	}

	function selectProduct() {
		searchQuery = "";	
	}

	function handleSearchSubmit() {
		form.requestSubmit();
	}

	function handleInput(event) {
		searchQuery = event.target.value;
		isLoading=true
		debounce(handleSearchSubmit, 800);
	}

	function handleData() {
		return async ({ result }) => {
			if (result) {
				isLoading=false
			}
			searchResults=result.data.responce.items;
		};
	}

</script>

<nav class="my-3">
	<div class={`fixed top-0 left-0 h-full bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-full`}>
		<div class="flex flex-col h-full p-6 font-medium text-gray-600">
			<div class="flex justify-between mb-2">
				<div class="text-xl text-primary-400 font-bold">Chemikart</div>
				<button
					on:click={toggleLogoMenu}
					class="self-end text-primary-400 text-2xl hover:text-primary-400 transition duration-200">
					<Icon icon="cuida:x-outline" class="w-10 h-5 text-gray-600"/>
				</button>
			</div>
			{#if activeMenu === null}
				{#each menus as menu}
					<button
						on:click={() =>
							menu.title === 'Products' ||
							menu.title === 'Applications' ||
							menu.title === 'Services' ||
							menu.title === 'Documents' ||
							menu.title === 'Support'
								? toggleMenu(menu)
								: navigateTo(menu.href)}
						class="flex justify-between text-left hover:text-primary-400 text-gray-800 transition duration-200 w-full py-2">
						{menu.title}
						<Icon
							icon="prime:chevron-down"
							class="w-5 h-5 mr-2 text-gray-800 hover:text-primary-400"/>
					</button>
				{/each}
				<div class="flex flex-col font-semibold">
					<a
						href="/quick-order"
						class=" text-left hover:text-primary-400 text-sm text-gray-800 transition duration-200 w-full py-2"
						>Quick Order</a
					>
					<a
						href="/order-status"
						class="text-left hover:text-primary-400 text-gray-800 text-sm transition duration-200 w-full py-2"
						>Order Status</a
					>
				</div>
				<div class="flex flex-col font-semibold">
					{#if $authedUser.email}
					<div>
						<button
							on:click={() => navigateTo('/logout')}
							class="hover:text-primary-400 text-sm font-montserrat transition text-left duration-200 pb-3 pt-1">Logout</button
						>
					</div>
					{:else}
					<div>
						<button
							on:click={() => navigateTo('/login')}
							class="hover:text-primary-400 w-full text-sm font-montserrat transition text-left duration-200 pb-3 pt-1">Login</button
						>
						<button
							on:click={() => navigateTo('/signup')}
							class="hover:text-primary-400 w-full transition text-sm font-montserrat text-left duration-200">Register</button
						>
					</div>
					{/if}
				</div>
			{:else}
				<button
					on:click={() => toggleMenu(null)}
					class="text-gray-800 flex items-center gap-3 text-left font-semibold py-2 px-0 rounded transition duration-200">
					<Icon icon="material-symbols:chevron-backward" class=" w-5 h-5 " />
					Back
				</button>
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
		</div>
	</div>
	<div class="flex items-center justify-between w-11/12 py-4 mx-auto max-w-7xl flex-wrap">
		<div class="flex md:hidden float-end">
			<button on:click={toggleLogoMenu} class="flex items-center text-gray-600 focus:outline-none">
				<Icon icon="fa6-solid:bars" class="w-10 h-5 text-gray-600" />
			</button>
		</div>
		<div class="text-center pl-2">
			<button
				on:click={() => {
					navigateTo('/');
				}}
				class="flex items-center text-primary-400 text-2xl md:text-3xl lg:text-3xl sm:text-2xl font-poppins md:mb-0 py-2 font-roboto font-bold">
				Chemikart
			</button>
		</div>

		<span class="hidden max-md:block w"><Cartrightside/></span>

		<!-- Searchbar functionality -->
		<div class="relative w-full md:max-w-sm lg:max-w-lg md:mx-4 lg:mx-8 sm:mt-2">
			<form action="/?/search" method="post" bind:this={form} use:enhance={handleData}>
				<div class=" w-full flex items-center">
					<input
						type="text"
						placeholder="Search for Product Names, Numbers, or CAS Numbers"
						bind:value={searchQuery}
						name="query"
						on:input={handleInput}
						class="w-full px-3 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-xs"
					/>
					<button
						class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-400 text-white w-10 h-10 flex items-center justify-center rounded-md"
				
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
									href={`/products/${product.expand?.Category?.urlName}/${product.expand?.subCategory?.urlName}/${product?.productNumber}`}
									class="block w-full text-sm text-gray-800 px-4 py-2"
								>
									{product?.productName}
								</a>
							</li>
						{/each}
					</ul>
				{:else if searchQuery.trim() && isLoading}
					<p
						class="absolute w-full bg-white text-sm text-gray-500 py-2 px-4 mt-1 border border-gray-300 z-30 rounded"
					>
						Loading Products
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
				<!-- Searchbar functionality ends-->	

		<div class="md:flex hidden">
			{#if $authedUser.email}
			<div>
				<button
					on:click={() => {
						navigateTo('/logout');
					}}
					class="  loginbtn text-sm font-medium border-b-2 border-b-transparent hover:text-primary-400 text-primary-400">Logout</button>
			</div>
			{:else}
			<div class="flex items-center justify-between">
				<button
					on:click={() => {
						navigateTo('/login');
					}}
					class="  loginbtn text-sm font-medium border-b-2 border-b-transparent hover:text-primary-400 text-primary-400">Login</button>
				<Icon icon="vaadin:line-v" class="mr-0 text-primary-400 font-semibold" />
				<button
					on:click={() => {
						navigateTo('/signup');
					}}
					class=" registerbtn pr-2 text-primary-400 text-sm font-medium border-b-2 border-b-transparent hover:text-primary-400">Register</button>
			</div>
			{/if}
		</div>
	</div>
	<div class="hidden bg-white md:flex mx-auto w-full border-y border-gray-200">
		<!-- Menu Section -->
		<div class="md:flex mx-auto justify-between w-11/12 max-w-7xl">
		<div class="md:flex justify-around items-center lg:gap-2 hidden">
			{#each menus as menu, index}
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<div
					class="relative group"
					role="menu"
					on:mouseenter={() => handleMouseEnterMenu(menu)}
					on:mouseleave={handleMouseLeaveMenu}>
					<div class={`py-2 pr-2 pl-3 ${activeMenu === menu ? 'text-orange-500' : 'text-gray-600'}`}>
						<button
							on:click={() => navigateTo(menu.href)}
							class={`flex items-center text-nowrap text-xs lg:text-base font-medium text-left w-full ${activeMenu === menu ? 'text-primary-400' : 'text-gray-700'}`}
							role="menuitem">
							{menu.title}
							{#if index < 5}
								<Icon icon="prime:chevron-down" class="ml-1 w-5 h-5 " />
							{/if}
						</button>
					</div>

					{#if menu.submenus && menu.submenus.length > 0}
						<div class={`absolute shadow-sm z-20 rounded-sm mt-0.5 bg-white w-max transition-opacity duration-200 ${activeMenu === menu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
							role="menu">
							{#each menu.submenus as submenu}
								<!-- svelte-ignore a11y-interactive-supports-focus -->
								<div
									class="relative group hover:text-primary-950"
									role="menu"
									on:mouseenter={() => handleMouseEnterSubmenu(submenu)}
									on:mouseleave={handleMouseLeaveSubmenu}>
									<button
										on:click={() => navigateTo(`${menu.href}${submenu.href}`)}
										class="flex relative text-left mr-24 pl-4 py-1 md:text-xs lg:text-sm hover:bg-primary-50 w-full"
										role="menuitem">
										<span class={`absolute left-0 top-0 h-full w-1 transition-all duration-200 ${activeSubmenu === submenu ? 'opacity-100 text-gray-800' : 'opacity-0'}`}></span>
										{submenu.title}
										<Icon
											icon="material-symbols:chevron-right"
											class={`absolute right-2 w-5 h-5 transition-colors duration-200 ${activeSubmenu === submenu ? 'text-primary-600' : 'text-gray-300'}`}/>
									</button>
								</div>
								{#if submenu.subSubmenus && submenu.subSubmenus.length > 0}
									<div
										class={`mt-0 ml-0 border-gray-300 border-l h-full absolute left-full rounded-sm pb-2 top-0 z-30 w-full bg-white shadow-sm transition-opacity duration-200 ${activeSubmenu === submenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
										role="menu">
										<ul>
											{#each submenu.subSubmenus as subSubmenu}
												<li
													class="hover:bg-primary-50 relative"
													on:mouseenter={() => handleMouseEnter(subSubmenu)}
													on:mouseleave={handleMouseLeave}>
													<button
														on:click={() =>
															navigateTo(`${menu.href}${submenu.href}${subSubmenu.href}`)}
														class="title block text-left py-1 pl-4 md:text-xs lg:text-sm text-gray-700 w-full"
														role="menuitem">
														{#if hoveredSubSubmenu === subSubmenu}
															<span class="absolute left-0 top-0 h-full w-1 transition-opacity duration-200"></span>
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
		<div class="flex justify-evenly pr-2 text-gray-600 pt-2 items-center">
			<a href="/quick-order" class="hover:text-primary-400 font-semibold text-xs lg:text-sm mb-3 mr-3">Quick Order</a>
			<a href="/order-status" class="hover:text-primary-400 font-semibold text-xs lg:text-sm mb-3">Order Status</a>
			<Cartrightside />
		</div>
	</div>
	</div>
</nav>
