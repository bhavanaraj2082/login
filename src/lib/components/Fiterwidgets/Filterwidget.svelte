<script>
	import { createEventDispatcher } from "svelte";

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
					family
						.toLowerCase()
						.startsWith(apiFamilySearch.toLowerCase()),
				)
				.slice(0, 3);
		}
	}

	let isApiFamilyOpen = false;
	let isProductTypeOpen = false;
	let isBrandOpen = false;
	let isAccreditationsOpen = false;
	let isProductFormatOpen = false;

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
	<div
		class="filter-widget border shadow-md p-4 w-72 max-w-xs mt-10 ml-4"
		style="height: auto;"
	>
		<h3 class="text-lg font-bold mb-4 pl-16 text-blue-800">
			Filters Result
		</h3>
		<hr />
		<!--API Family Filter-->
		<div class="filter-group mb-5">
			<div class="flex items-center">
				<h4 class="font-semibold text-blue-700 mb-1 mt-2 flex-1">
					API Family
				</h4>
				<button
					class="flex items-center text-blue-600"
					on:click={toggleApiFamilySection}
				>
					<span class="mr-2 text-3xl"
						>{isApiFamilyOpen ? "-" : "+"}</span
					>
				</button>
			</div>
			<div class={isApiFamilyOpen ? "space-y-2" : "hidden"}>
				<div class="relative">
					<input
						type="text"
						class="border rounded p-1 mb-2 w-full pr-10"
						placeholder="Search API Family"
						bind:value={apiFamilySearch}
						on:input={updateMatchingApiFamilies}
					/>
					<button
						class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none pb-2"
						on:click={updateMatchingApiFamilies}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
							/>
						</svg>
					</button>
				</div>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each filters.apiFamily as selectedFamily}
						<div
							class="bg-blue-200 rounded-full px-2 py-1 flex items-center"
						>
							<span>{selectedFamily}</span>
							<button
								class="ml-2 text-red-600"
								on:click={() => toggleApiFamily(selectedFamily)}
							>
								&times;
							</button>
						</div>
					{/each}
				</div>
				<ul>
					{#each matchingApiFamilies as family}
						<li>
							<label class="flex items-center mb-2 text-blue-600">
								<input
									type="checkbox"
									checked={filters.apiFamily.includes(family)}
									on:change={() => toggleApiFamily(family)}
								/>
								<span class="ml-2">{family}</span>
							</label>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Product Type Filter -->
		<div class="filter-group mb-5 mt-3">
			<div class="flex items-center">
				<h4 class="font-semibold text-blue-700 mb-1 mt-2 flex-1">
					Product Type
				</h4>
				<button
					class="flex items-center text-blue-600"
					on:click={toggleProductType}
				>
					<span class="mr-2 text-3xl"
						>{isProductTypeOpen ? "-" : "+"}</span
					>
				</button>
			</div>
			<div class={isProductTypeOpen ? "space-y-2" : "hidden"}>
				{#each [...new Set(products.map((p) => p.productType))] as productType}
					<label
						class="flex items-center mb-2 text-blue-600 justify-between"
					>
						<div>
							<input
								type="checkbox"
								class="mr-2"
								on:change={(e) =>
									updateFilters(
										"productType",
										productType,
										e.target.checked,
									)}
							/>
							<span>{productType}</span>
						</div>
						<span class="ml-2" style="text-align: right;"
							>({products.filter(
								(p) => p.productType === productType,
							).length})</span
						>
					</label>
				{/each}
			</div>
		</div>

		<!-- Brand Filter -->
		<div class="filter-group mb-5">
			<div class="flex items-center">
				<h4 class="font-semibold text-blue-700 mb-1 mt-2 flex-1">
					Brand
				</h4>
				<button
					class="flex items-center text-blue-600"
					on:click={toggleBrand}
				>
					<span class="mr-2 text-3xl">{isBrandOpen ? "-" : "+"}</span>
				</button>
			</div>
			<div class={isBrandOpen ? "space-y-2" : "hidden"}>
				{#each [...new Set(products.map((p) => p.brand))] as brand}
					<label
						class="flex items-center mb-2 text-blue-600 justify-between"
					>
						<div>
							<input
								type="checkbox"
								class="mr-2"
								on:change={(e) =>
									updateFilters(
										"brand",
										brand,
										e.target.checked,
									)}
							/>
							<span>{brand}</span>
						</div>
						<span class="ml-2" style="text-align: right;"
							>({products.filter((p) => p.brand === brand)
								.length})</span
						>
					</label>
				{/each}
			</div>
		</div>

		<!-- Accreditations Filter -->
		<div class="filter-group mb-5">
			<div class="flex items-center">
				<h4 class="font-semibold text-blue-700 mb-1 mt-2 flex-1">
					Accreditations
				</h4>
				<button
					class="flex items-center text-blue-600"
					on:click={toggleAccreditations}
				>
					<span class="mr-2 text-3xl"
						>{isAccreditationsOpen ? "-" : "+"}</span
					>
				</button>
			</div>
			<div class={isAccreditationsOpen ? "space-y-2" : "hidden"}>
				{#each [...new Set(products.map((p) => p.Accreditations))] as accreditation}
					<label
						class="flex items-center mb-2 text-blue-600 justify-between"
					>
						<div>
							<input
								type="checkbox"
								class="mr-2"
								on:change={(e) =>
									updateFilters(
										"accreditations",
										accreditation,
										e.target.checked,
									)}
							/>
							<span>{accreditation}</span>
						</div>
						<span class="ml-2" style="text-align: right;"
							>({products.filter(
								(p) => p.Accreditations === accreditation,
							).length})</span
						>
					</label>
				{/each}
			</div>
		</div>

		<!-- Product Format Filter -->
		<div class="filter-group mb-5">
			<div class="flex items-center">
				<h4 class="font-semibold text-blue-700 mb-1 mt-2 flex-1">
					Product Format
				</h4>
				<button
					class="flex items-center text-blue-600"
					on:click={toggleProductFormat}
				>
					<span class="mr-2 text-3xl"
						>{isProductFormatOpen ? "-" : "+"}</span
					>
				</button>
			</div>
			<div class={isProductFormatOpen ? "space-y-2" : "hidden"}>
				{#each [...new Set(products.map((p) => p.format))] as format}
					<label
						class="flex items-center mb-2 text-blue-600 justify-between"
					>
						<div>
							<input
								type="checkbox"
								class="mr-2"
								on:change={(e) =>
									updateFilters(
										"format",
										format,
										e.target.checked,
									)}
							/>
							<span>{format}</span>
						</div>
						<span class="ml-2" style="text-align: right;"
							>({products.filter((p) => p.format === format)
								.length})</span
						>
					</label>
				{/each}
			</div>
		</div>
	</div>
</div>
