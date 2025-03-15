<script>
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';

	export let products = [];
	const dispatch = createEventDispatcher();

	let filters = {
		productType: new Set(),
		brand: new Set(),
		accreditations: new Set(),
		format: new Set(),
		apiFamily: [],
	};

	let apiFamilySearch = "";
	let matchingApiFamilies = [];

	function updateFilters(category, value, checked) {
		if (checked) {
			filters[category].add(value);
		} else {
			filters[category].delete(value);
		}
		dispatch("filterChange", Object.values(filters));
	}

	function toggleApiFamily(family) {
		const index = filters.apiFamily.indexOf(family);
		if (index === -1) {
			filters.apiFamily.push(family);
		} else {
			filters.apiFamily.splice(index, 1);
		}
		dispatch("filterChange", Object.values(filters));
		if (index === -1) {
			apiFamilySearch = "";
		}
	}

	function updateMatchingApiFamilies() {
		if (apiFamilySearch.trim() === "") {
			matchingApiFamilies = [];
		} else {
			matchingApiFamilies = [...new Set(products.map((p) => p.apiFamily))]
				.filter((family) =>
					family.toLowerCase().startsWith(apiFamilySearch.toLowerCase()),
				)
				.slice(0, 3);
		}
	}

	let isApiFamilyOpen = false;
	let isProductTypeOpen = false;
	let isBrandOpen = false;
	let isAccreditationsOpen = false;
	let isProductFormatOpen = false;

	let showFiltersOnSmallScreens = false; // State for small screen toggle

	function toggleApiFamilySection() {
		isApiFamilyOpen = !isApiFamilyOpen;
	}
	function toggleProductType() {
		isProductTypeOpen = !isProductTypeOpen;
	}
	function toggleBrand() {
		isBrandOpen = !isBrandOpen;
	}
	function toggleAccreditations() {
		isAccreditationsOpen = !isAccreditationsOpen;
	}
	function toggleProductFormat() {
		isProductFormatOpen = !isProductFormatOpen;
	}
</script>

<div>
	<div class="filter-widget border border-gray-300 rounded-lg shadow-md p-4 w-full md:w-72 max-w-xs mt-10 ml-4">
		<h3 class="text-lg font-bold mb-2 text-gray-700 flex items-center hidden md:flex">
			<Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
			Filters
		</h3>
		<div class="md:hidden mb-2 flex items-center cursor-pointer" on:click={() => showFiltersOnSmallScreens = !showFiltersOnSmallScreens}>
			<Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
			<h3 class="text-lg font-bold mb-2 text-gray-700">{showFiltersOnSmallScreens ? 'Hide Filters' : 'Filters'}</h3>
		</div>
		
		<hr class="border-gray-300 mb-2" />
		<div class={showFiltersOnSmallScreens ? "block" : "hidden md:block"}>
			<!-- API Family Filter -->
			<div class="filter-group border border-gray-300 rounded mb-3">
				<div class="flex items-center">
					<h4 class="font-semibold text-gray-700 mb-1 mt-2 flex-1 pl-5 pr-2 py-2">API Family</h4>
					<button class="flex items-center text-primary-500 px-2 py-2" on:click={toggleApiFamilySection}>
						<Icon icon={isApiFamilyOpen ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
					</button>
				</div>
				<div class={isApiFamilyOpen ? "space-y-2" : "hidden"}>
					<div class="relative">
						<input type="text" class="border rounded p-1 ml-1 mb-2 w-full pr-10" placeholder="Search API Family" bind:value={apiFamilySearch} on:input={updateMatchingApiFamilies} />
						<button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none pb-2" on:click={updateMatchingApiFamilies}>
							<Icon icon="mdi:magnify" class="text-gray-600" />
						</button>
					</div>
					<div class="mt-2   flex flex-wrap gap-2">
						{#each filters.apiFamily as selectedFamily}
							<div class="bg-blue-200 rounded-full px-2 py-1 flex items-center">
								<span>{selectedFamily}</span>
								<button class="mr-3 text-red-600" on:click={() => toggleApiFamily(selectedFamily)}>&times;</button>
							</div>
						{/each}
					</div>
					<ul>
						{#each matchingApiFamilies as family}
							<li>
								<label class="flex items-center pr-4 mb-2 text-gray-600">
									<input type="checkbox" checked={filters.apiFamily.includes(family)} on:change={() => toggleApiFamily(family)} />
									<span class="ml-2">{family}</span>
								</label>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Product Type Filter -->
			<div class="filter-group border border-gray-300 rounded mb-3">
				<div class="flex items-center">
					<h4 class="font-semibold text-gray-700 mb-1 mt-2 flex-1 pl-5 pr-2 py-2">Product Type</h4>
					<button class="flex items-center text-primary-500" on:click={toggleProductType}>
						<Icon icon={isProductTypeOpen ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="mr-2 text-3xl" />
					</button>
				</div>
				<div class={isProductTypeOpen ? "space-y-2" : "hidden"}>
					{#each [...new Set(products.map((p) => p.productType))] as productType}
						<label class="flex items-center mb-2 text-gray-600 justify-between">
							<div>
								<input type="checkbox" class="ml-3" on:change={(e) => updateFilters("productType", productType, e.target.checked)} />
								<span>{productType}</span>
							</div>
							<span class="ml-3 pr-4" style="text-align: right;">{products.filter((p) => p.productType === productType).length}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Brand Filter -->
			<div class="filter-group border border-gray-300 rounded mb-3">
				<div class="flex items-center">
					<h4 class="font-semibold text-gray-700 mb-1 mt-2 flex-1 pl-5 pr-2 py-2">Brand</h4>
					<button class="flex items-center text-primary-500" on:click={toggleBrand}>
						<Icon icon={isBrandOpen ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="mr-2 text-3xl" />
					</button>
				</div>
				<div class={isBrandOpen ? "space-y-2" : "hidden"}>
					{#each [...new Set(products.map((p) => p.brand))] as brand}
						<label class="flex items-center mb-2 text-gray-600 justify-between">
							<div>
								<input type="checkbox" class="ml-3" on:change={(e) => updateFilters("brand", brand, e.target.checked)} />
								<span>{brand}</span>
							</div>
							<span class="ml-2 pr-4" style="text-align: right;">{products.filter((p) => p.brand === brand).length}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Accreditations Filter -->
			<div class="filter-group border border-gray-300 rounded mb-3">
				<div class="flex items-center">
					<h4 class="font-semibold text-gray-700 mb-1 mt-2 flex-1 pl-5 pr-2 py-2">Accreditations</h4>
					<button class="flex items-center text-primary-500" on:click={toggleAccreditations}>
						<Icon icon={isAccreditationsOpen ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="mr-2 text-3xl" />
					</button>
				</div>
				<div class={isAccreditationsOpen ? "space-y-2" : "hidden"}>
					{#each [...new Set(products.map((p) => p.Accreditations))] as accreditation}
						<label class="flex items-center mb-2 text-gray-600 justify-between">
							<div>
								<input type="checkbox" class="ml-3" on:change={(e) => updateFilters("accreditations", accreditation, e.target.checked)} />
								<span>{accreditation}</span>
							</div>
							<span class="ml-2 pr-4" style="text-align: right;">{products.filter((p) => p.Accreditations === accreditation).length}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Product Format Filter -->
			<div class="filter-group border border-gray-300 rounded mb-3">
				<div class="flex items-center">
					<h4 class="font-semibold text-gray-700 mb-1 mt-2 flex-1 pl-5 pr-2 py-2">Product Format</h4>
					<button class="flex items-center text-primary-500" on:click={toggleProductFormat}>
						<Icon icon={isProductFormatOpen ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="mr-2 text-3xl" />
					</button>
				</div>
				<div class={isProductFormatOpen ? "space-y-2" : "hidden"}>
					{#each [...new Set(products.map((p) => p.format))] as format}
						<label class="flex items-center mb-2 text-gray-600 justify-between">
							<div>
								<input type="checkbox" class="ml-3" on:change={(e) => updateFilters("format", format, e.target.checked)} />
								<span>{format}</span>
							</div>
							<span class="ml-1 pr-4" style="text-align: right;">{products.filter(p => p.format === format).length}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
