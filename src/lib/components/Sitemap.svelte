<script>
	import { onMount } from "svelte";
	import data1 from "$lib/data/sitemap.json";
	import { slide } from "svelte/transition";
	import Icon from "@iconify/svelte";

	let searchTerm = "";
	let expandedCategories1 = {};
	let expandedCategories2 = {};

	let categories1 = updateCategoryNames(data1.categories1);
	let categories2 = updateCategoryNames(data1.categories2);
	let categories3 = data1.categories3;
	let categories4 = data1.categories4;

	let filteredCategories1 = [...categories1];
	let filteredCategories2 = [...categories2];
	let filteredCategories3 = [...categories3];
	let filteredCategories4 = [...categories4];
	let manuallyExpanded1 = {};
	let manuallyExpanded2 = {};

	function updateCategoryNames(categories) {
		return categories.map((category) => {
			if (category.name1 === "Chemistry And Biochemicals") {
				category.name1 = "Chemistry & Biochemicals"
			}
			if (
				category.name1 === "Molecular Biology And Functional Genomics"
			) {
				category.name1 = "Molecular BioGen";
			}
			if (category.name1 === "Pharma And Biopharma Manufacturing") {
				category.name1 = "Pharma & BioTech";
			}
			if (category.name2 === "Cell Culture & Cell Culture Analysis") {
				category.name2 = "Cell Culture Tech";
			}
			if (
				category.name2 ===
				"Clinical Testing & Diagnostics Manufacturing"
			) {
				category.name2 = "Clinical Test MFG";
			}
			if (
				category.name2 === "Environmental Testing & Industrial Hygiene"
			) {
				category.name2 = "EcoHygiene & Testing";
			}
			if (category.name2 === "Food & Beverage Testing & Manufacturing") {
				category.name2 = "Food Beverage Test MFG";
			}
			if (category.name2 === "Materials Science and Engineering") {
				category.name2 = "Material Tech";
			}
			if (
				category.name2 ===
				"Pharmaceutical & Biopharmaceutical Manufacturing"
			) {
				category.name2 = "Pharma BioPharma MFG";
			}
			return category;
		});
	}

	function filterCategories(
		categories,
		expandedCategories,
		categoryKey,
		subcategoryKey,
		sectionTitle,
		isExpandable = true,
	) {
		if (!searchTerm.trim()) return categories;

		return categories
			.filter((category) => category && category[categoryKey])
			.map((category, index) => {
				const allSubcategories = (
					category[subcategoryKey] || []
				).filter((sub) => sub && sub[categoryKey]);

				const categoryName = category[categoryKey];
				const categoryMatch =
					typeof categoryName === "string" &&
					categoryName
						.toLowerCase()
						.includes(searchTerm.toLowerCase());

				const matchingSubcategories = allSubcategories.filter(
					(sub) =>
						typeof sub[categoryKey] === "string" &&
						sub[categoryKey]
							.toLowerCase()
							.includes(searchTerm.toLowerCase()),
				);

				const sectionMatch =
					typeof sectionTitle === "string" &&
					sectionTitle
						.toLowerCase()
						.includes(searchTerm.toLowerCase());

				if (
					categoryMatch ||
					matchingSubcategories.length > 0 ||
					sectionMatch
				) {
					if (isExpandable && !manuallyExpanded1[index])
						expandedCategories[index] = true;
					return {
						...category,
						[subcategoryKey]: matchingSubcategories.length
							? matchingSubcategories
							: allSubcategories,
					};
				}

				return null;
			})
			.filter(Boolean);
	}

	function resetExpandedState() {
		categories1.forEach((_, index) => {
			if (!manuallyExpanded1[index]) expandedCategories1[index] = false;
		});
		categories2.forEach((_, index) => {
			if (!manuallyExpanded2[index]) expandedCategories2[index] = false;
		});
	}

	$: {
		if (!searchTerm.trim()) {
			resetExpandedState();
			filteredCategories1 = categories1;
			filteredCategories2 = categories2;
			filteredCategories3 = categories3;
			filteredCategories4 = categories4;
		} else {
			let newExpandedCategories1 = {};
			let newExpandedCategories2 = {};
			manuallyExpanded1 = {};
			manuallyExpanded2 = {};
			filteredCategories1 = filterCategories(
				categories1,
				expandedCategories1,
				"name1",
				"subcategories1",
				"Products",
				true,
			);
			filteredCategories2 = filterCategories(
				categories2,
				expandedCategories2,
				"name2",
				"subcategories2",
				"Applications",
				true,
			);
			filteredCategories3 = filterCategories(
				categories3,
				{},
				"name3",
				"subcategories3",
				"Documents",
				false,
			);
			filteredCategories4 = filterCategories(
				categories4,
				{},
				"name4",
				"subcategories4",
				"Resources",
				false,
			);
			expandedCategories1 = {
				...expandedCategories1,
				...newExpandedCategories1,
			};
			expandedCategories2 = {
				...expandedCategories2,
				...newExpandedCategories2,
			};
		}
	}

	function toggleExpand(categoryIndex, categoryType, event) {
		event.stopPropagation();
		if (categoryType === 1) {
			expandedCategories1[categoryIndex] =
				!expandedCategories1[categoryIndex];
			manuallyExpanded1[categoryIndex] =
				expandedCategories1[categoryIndex];
			expandedCategories1 = { ...expandedCategories1 };
		} else if (categoryType === 2) {
			expandedCategories2[categoryIndex] =
				!expandedCategories2[categoryIndex];
			manuallyExpanded2[categoryIndex] =
				expandedCategories2[categoryIndex];
			expandedCategories2 = { ...expandedCategories2 };
		}
	}

	function handleClickOutside(event) {
		if (event.target.closest(".see.more-btn")) {
			return;
		}
		expandedCategories1 = {};
		expandedCategories2 = {};
	}

	onMount(() => {
		resetExpandedState();
		document.addEventListener("click", handleClickOutside);
	});
</script>

<div class="font-sans mx-auto w-11/12 max-w-7xl">
	<div class="flex flex-col sm:flex-row justify-between">
		<h1 class="text-black sm:text-2xl text-lg px-2 font-bold">
			Chemikart Site Map
		</h1>

		<div class="relative mx-2 mt-2 mb-2 sm:mt-0 sm:mr-2">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search for categories, subcategories, or names"
				class="w-full py-2 pl-2 pr-7 sm:min-w-80 bg-white border border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none focus:border-transparent text-sm placeholder:text-xs truncate"
			/>
			<Icon
				icon="feather:search"
				class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
			/>
		</div>
	</div>
	{#if filteredCategories1.length > 0}
		<h1
			class="text-lg m-4 pb-1 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
		>
			Products
		</h1>
	{/if}
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-1 gap-0"
	>
		{#each filteredCategories1 as { name1, link1, subcategories1 }, index}
			{#if filterCategories(categories1, expandedCategories1, "name1", "subcategories1", "Products")}
				<div class="break-inside-avoid mb-4 p-4 space-y-2">
					<h2
						class="text-sm mb-4 border-b-1 border-description flex flex-nowrap"
					>
						<p class="text-gray-600 w-fit p-2 font-bold">{name1}</p>
						<span class="py-2 text-1s"
							>({subcategories1.length} items)</span
						>
					</h2>

					{#if subcategories1 && subcategories1.length > 0}
						<ul class="list-none pl-0 space-y-2">
							{#each subcategories1 as { name1: subName1, link1: subLink1 }, i}
								{#if i < 3 || expandedCategories1[index]}
									<li
										class="flex flex-wrap"
										transition:slide={{ duration: 300 }}
									>
										<a
											href={subLink1}
											class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
										>
											{subName1}
										</a>
									</li>
								{/if}
							{/each}
						</ul>

						{#if subcategories1.length > 3}
							<button
								on:click={(event) =>
									toggleExpand(index, 1, event)}
								class="mt-2 ml-2 text-xs text-primary-400 hover:text-white hover:bg-primary-400 hover:border-primary-400 p-1 border border-primary-400 rounded font-semibold see-more-btn"
							>
								{expandedCategories1[index]
									? "Show Less"
									: "See More..."}
							</button>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{#if filteredCategories2.length > 0}
		<h1
			class="text-lg m-4 pb-1 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
		>
			Applications
		</h1>
	{/if}
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 gap-0"
	>
		{#each filteredCategories2 as { name2, link2, subcategories2 }, index}
			{#if filterCategories(categories2, expandedCategories2, "name2", "subcategories2", "Applications")}
				<div class="break-inside-avoid mb-4 p-4">
					<h2
						class="text-sm mb-4 border-b-1 border-description flex flex-nowrap"
					>
						<p class="text-gray-600 w-fit p-2 font-bold">{name2}</p>
						<span class="py-2 text-1s"
							>({subcategories2.length} items)</span
						>
					</h2>

					{#if subcategories2 && subcategories2.length > 0}
						<ul class="list-none pl-0 space-y-2">
							{#each subcategories2 as { name2: subName2, link2: subLink2 }, i}
								{#if i < 3 || expandedCategories2[index]}
									<li
										class="flex flex-wrap"
										transition:slide={{ duration: 300 }}
									>
										<a
											href={subLink2}
											class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
										>
											{subName2}
										</a>
									</li>
								{/if}
							{/each}
						</ul>

						{#if subcategories2.length > 3}
							<button
								on:click={(event) =>
									toggleExpand(index, 2, event)}
								class="mt-2 ml-2 text-xs text-primary-400 hover:text-white hover:bg-primary-400 hover:border-primary-400 p-1 border border-primary-400 rounded font-semibold see-more-btn"
							>
								{expandedCategories2[index]
									? "Show Less"
									: "See More..."}
							</button>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{#if filteredCategories3.length > 0}
		<h1
			class="text-lg m-4 pb-1 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
		>
			Documents
		</h1>
	{/if}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-0">
		{#each filteredCategories3 as { name3, link3, subcategories3 }}
			{#if filterCategories(categories3, {}, "name3", "subcategories3", "Documents", false)}
				<div class="p-4">
					<h2
						class="text-sm font-semibold mb-4 border-b-1 border-description"
					>
						<p class="text-gray-600 w-fit p-2 font-bold">
							{name3}
						</p>
					</h2>
					{#if subcategories3 && subcategories3.length > 0}
						<ul class="list-none pl-0 space-y-2">
							{#each subcategories3 as { name3: subName3, link3: subLink3 }}
								<li class="flex flex-wrap">
									<a
										href={subLink3}
										class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
										>{subName3}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{#if filteredCategories4.length > 0}
		<h1
			class="text-lg m-4 pb-1 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
		>
			Resources
		</h1>
	{/if}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-0">
		{#each filteredCategories4 as { name4, link4, subcategories4 }}
			{#if filterCategories(categories4, {}, "name4", "subcategories4", "Resources", false)}
				<div class="break-inside-avoid mb-4 p-4">
					<h2
						class="text-sm font-semibold mb-4 border-b-1 border-description"
					>
						<p class="text-gray-600 w-fit p-2 font-bold">
							{name4}
						</p>
					</h2>
					{#if subcategories4 && subcategories4.length > 0}
						<ul class="list-none pl-0 space-y-2">
							{#each subcategories4 as { name4: subName4, link4: subLink4 }}
								<li class="flex flex-wrap">
									<a
										href={subLink4}
										class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
										>{subName4}</a
									>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{#if filteredCategories1.length === 0 && filteredCategories2.length === 0 && filteredCategories3.length === 0 && filteredCategories4.length === 0}
		<div
			class="flex flex-col items-center justify-center text-gray-600 font-semibold py-6 mx-2 my-4 border rounded-md border-primary-100 bg-primary-100"
		>
			<Icon
				icon="iconoir:file-not-found"
				width="34"
				height="34"
				class="text-primary-500"
			/>
			<span class="mx-2">No results found.</span>
			<span class="text-sm text-gray-500">Please try a different search.</span>
		</div>
	{/if}
</div>
