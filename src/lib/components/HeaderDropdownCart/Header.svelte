<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Cartrightside from '$lib/components/HeaderDropDownCart/Cartrightside.svelte';
	import menusdata from '$lib/data/chemicalProducts.json';
	let menus = [];
	let submenuLeaveTimeoutId;
	let subSubmenuLeaveTimeoutId;
	let activeMenu = null;
	let activeSubmenu = null;
	let hoveredSubSubmenu = null;

	const getInitial = (name) => name.charAt(0).toUpperCase();
	onMount(async () => {
		try {
			menus = menusdata.menus;
		} catch (error) {
			console.error('Error fetching menus:', error);
		}
	});
	let searchQuery = '';
	let filteredResults = [];

	function clearSearch() {
		searchQuery = '';
	}

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

	export let data;
	let searchResult = data.products;
	$: filteredResults = searchQuery
		? searchResult.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
		: [];
</script>

<nav class="my-3 justify-between relative w-full mx-auto">
	<div
		class={`fixed top-0 left-0 h-full bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-full`}
	>
		<div class="flex flex-col h-full p-6 text-gray-600">
			<div class="flex justify-between mb-2">
				<div class="text-xl text-primary-400 font-bold">Chemikart</div>
				<button
					on:click={toggleLogoMenu}
					class="self-end text-primary-400 text-2xl hover:text-primary-400 transition duration-200"
				>
					<Icon icon="cuida:x-outline" class="w-10 h-5 text-gray-600" />
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
						class="flex justify-between text-left hover:text-primary-400 text-gray-800 font-semibold transition duration-200 w-full py-2"
					>
						{menu.title}
						<Icon
							icon="prime:chevron-down"
							class="ml-1 w-5 h-5 text-gray-800 hover:text-primary-400"
						/>
					</button>
				{/each}
				<div class="flex flex-col">
					<a
						href="/bulk-order"
						class=" text-left hover:text-primary-400 text-gray-800 font-semibold transition duration-200 w-full py-2"
						>Bulk Order</a
					>
					<a
						href="/order-status"
						class="text-left hover:text-primary-400 text-gray-800 font-semibold transition duration-200 w-full py-2"
						>Order Status</a
					>
				</div>
				<div class="flex flex-col">
					<div>
						<button
							on:click={() => navigateTo('/login')}
							class="hover:text-primary-400 text-sm transition duration-200 pb-2 pt-1">Login</button
						>
					</div>
					<div>
						<button
							on:click={() => navigateTo('/register')}
							class="hover:text-primary-400 transition text-sm duration-200 py-2">Register</button
						>
					</div>
				</div>
			{:else}
				<button
					on:click={() => toggleMenu(null)}
					class="text-gray-800 flex items-center gap-3 text-left font-semibold py-2 px-0 rounded transition duration-200"
					><Icon icon="material-symbols:chevron-backward" class=" w-5 h-5 " />
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
	<div class="mx-auto flex items-center justify-between max-md:py-0 md:px-20 px-0 py-4">
		<div class="flex md:hidden float-end">
			<button on:click={toggleLogoMenu} class="flex items-center text-gray-600 focus:outline-none">
				<Icon icon="fa6-solid:bars" class="w-10 h-5 text-gray-600" />
			</button>
		</div>
		<div class="text-center">
			<button
				on:click={() => {
					navigateTo('/');
				}}
				class="flex items-center text-primary-400 text-2xl md:text-3xl lg:text-3xl sm:text-2xl font-poppins font-semibold md:mb-0"
			>
				Chemikart
			</button>
		</div>
		<div class="relative w-full max-w-lg mx-4 lg:mx-8">
			<div class="relative w-full flex items-center">
				<input
					type="text"
					placeholder="Search your Product"
					bind:value={searchQuery}
					class="w-full px-3 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-sm"
				/>
				<button
					class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-400 text-white w-10 h-10 sm:flex hidden items-center justify-center rounded-md"
				>
					<Icon icon="feather:search" style="width: 25px; height: 25px;" />
				</button>

				{#if searchQuery}
					<div
						class="absolute w-full mt-56 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10"
					>
						<button
							class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
							on:click={clearSearch}
						>
							<Icon icon="cuida:x-outline" style="width: 20px; height: 20px;" />
						</button>
						{#each filteredResults as result, i}
							<div
								class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer"
							>
								{result.name}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<span class="hidden max-md:block"><Cartrightside /></span>
		<div class="md:flex hidden">
			<div class="flex items-center justify-between mr-1">
				<button
					on:click={() => {
						navigateTo('/login');
					}}
					class="  loginbtn text-sm font-medium border-b-2 border-b-transparent hover:text-primary-400 text-primary-400"
					>Login</button
				>
				<Icon icon="vaadin:line-v" class="mr-0 text-primary-400 font-semibold" />
				<button
					on:click={() => {
						navigateTo('/register');
					}}
					class=" registerbtn pr-2 text-primary-400 text-sm font-medium border-b-2 border-b-transparent hover:text-primary-400"
					>Register</button
				>
			</div>
		</div>
	</div>
	<div
		class="hidden md:flex mx-auto justify-between py-2 pb-0 px-6 lg:px-20 md:px-20 border-y border-gray-200"
	>
		<!-- Menu Section -->
		<div class="md:flex justify-between items-center lg:gap-2 hidden">
			{#each menus as menu, index}
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<div
					class="relative group"
					role="menu"
					on:mouseenter={() => handleMouseEnterMenu(menu)}
					on:mouseleave={handleMouseLeaveMenu}
				>
					<div
						class={`py-2 pr-2 pl-3 ${activeMenu === menu ? 'text-orange-500' : 'text-gray-600'}`}
					>
						<button
							on:click={() => navigateTo(menu.href)}
							class={`flex items-center text-nowrap font-semibold text-xs lg:text-base font-medium text-left w-full ${activeMenu === menu ? 'text-primary-400' : 'text-gray-700'}`}
							role="menuitem"
						>
							{menu.title}
							{#if index < 5}
								<Icon icon="prime:chevron-down" class="ml-1 w-5 h-5 " />
							{/if}
						</button>
					</div>

					{#if menu.submenus && menu.submenus.length > 0}
						<div
							class={`absolute shadow-sm z-20 rounded-sm mt-0.5 bg-white w-max transition-opacity duration-200 ${activeMenu === menu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
										class="flex relative text-left mr-24 pl-4 py-1 md:text-xs lg:text-sm hover:bg-primary-50 w-full"
										role="menuitem"
									>
										<span
											class={`absolute left-0 top-0 h-full w-1 transition-all duration-200 ${activeSubmenu === submenu ? 'opacity-100 text-gray-800' : 'opacity-0'}`}
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
										class={`mt-0 ml-0.5 h-full absolute left-full rounded-sm pb-2 top-0 z-30 w-full bg-white shadow-sm transition-opacity duration-200 ${activeSubmenu === submenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
		<div class="flex space-x-4 text-gray-600 pt-2 items-center">
			<a
				href="/bulk-order"
				class="hover:text-primary-400 sm:mr-3 font-semibold text-xs lg:text-base mb-2">Bulk Order</a
			>
			<a href="/order-status" class="hover:text-primary-400 font-semibold text-xs lg:text-base mb-2"
				>Order Status</a
			>
			<Cartrightside />
		</div>
	</div>
</nav>
