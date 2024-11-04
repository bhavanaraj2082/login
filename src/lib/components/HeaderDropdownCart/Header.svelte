<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	// src/lib/components/HeaderDropdownCart/Cartrightside.svelte
	import Cartrightside from '../../components/HeaderDropdownCart/Cartrightside.svelte';
	// src/lib/data/chemicalProducts.json
	import menusdata from '../../data/chemicalProducts.json';
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
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
/>

<nav class="my-3 justify-between relative w-full mx-auto">
	<!-- Mobile Menu -->
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
					<i class="fa-solid fa-xmark fa-sm text-primary-400"></i>
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
						<i class="fa-solid fa-chevron-right fa-xs py-2"></i>
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
	<div class="mx-auto flex items-center justify-between max-md:py-0 py-4 px-4">
		<!-- Sliding menu (visible only on mobile screens) -->
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

		<div class="relative w-full max-w-lg mx-8 max-md:hidden">
			<input
				type="text"
				placeholder="Search your Product"
				class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
			/>
			<button
				class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-400 text-white p-1 px-3 rounded-md"
			>
				<i class="fa-solid fa-magnifying-glass"></i>
			</button>
		</div>

		<!-- <a href="/cart" class="hover:text-primary-400 text-gray-500 hidden max-md:block">
        <i class="fa-solid fa-cart-shopping"></i>
      </a> -->
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
	<!-- {#if $page.url.pathname !== '/order-status' || $page.url.pathname !== '/login'}
    <div class="mx-auto flex items-center justify-center max-md:p-3 relative !-z-10 min-[768px]:hidden">
        <div class="relative w-full max-w-lg mx-auto">
        <input type="text" placeholder="Search your Product" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400">
        <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-400 text-white p-1 px-3 rounded-md">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        </div>
    </div>
    {/if} -->
	<div class="hidden md:flex mx-auto justify-between py-2 pb-0 px-10 border-y border-gray-200">
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
						class={` py-2 pr-2 pl-3  ${activeMenu === menu ? ' text-orange-500' : ' text-gray-600'}`}
					>
						<button
							on:click={() => navigateTo(menu.href)}
							class={`flex items-center text-nowrap text-base font-medium text-left w-full ${activeMenu === menu ? 'text-primary-400' : 'text-gray-700'}`}
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
										class={`mt-0 ml-px h-full absolute left-full rounded-sm pb-2 top-0 z-30 w-full bg-white shadow-sm transition-opacity duration-200 ${activeSubmenu === submenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
		<div class="flex space-x-4 text-gray-600 pt-2">
			<a href="/bulk-order" class="hover:text-primary-400 ml-7">Bulk Order</a>
			<a href="/order-status" class="hover:text-primary-400">Order Status</a>
			<Cartrightside />
			<!-- <span class="!ml-1">Cart</span> -->
		</div>
	</div>
</nav>
