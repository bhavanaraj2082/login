<script>
	import { onMount } from "svelte";
	import data1 from "$lib/data/sitemap.json";

	let categories1 = [];
	let categories2 = [];
	let categories3 = [];
	let categories4 = [];

	onMount(() => {
		categories1 = data1.categories1;
		categories2 = data1.categories2;
		categories3 = data1.categories3;
		categories4 = data1.categories4;
	});
</script>

<div class="font-sans mx-auto w-11/12 max-w-7xl">
	<h1 class="text-black sm:text-2xl text-xl pt-3 sm:py-4 px-2 font-bold">
		Chemikart Site Map
	</h1>
	<h1
		class="text-lg p-2 m-4 text-heading border-b max-w-50 text-start font-bold pt-4 pb-2"
	>
		Products
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each categories1 as { name1, link1, subcategories1 }}
			<div class="break-inside-avoid mb-4 p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">{name1}</p>
				</h2>
				{#if subcategories1 && subcategories1.length > 0}
					<ul class="list-none pl-0 space-y-2">
						{#each subcategories1 as { name1: subName1, link1: subLink1 }}
							<li class="flex flex-wrap">
								<a
									href={subLink1}
									class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
									>{subName1}</a
								>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
	<h1
		class="text-lg p-2 m-4 text-heading border-b max-w-50 text-start font-bold pt-4 pb-2"
	>
		Applications
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each categories2 as { name2, link2, subcategories2 }}
			<div class="break-inside-avoid mb-4 p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">
						{name2}
					</p>
				</h2>
				{#if subcategories2 && subcategories2.length > 0}
					<ul class="list-none pl-0 space-y-2">
						{#each subcategories2 as { name2: subName2, link2: subLink2 }}
							<li class="flex flex-wrap">
								<a
									href={subLink2}
									class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
									>{subName2}</a
								>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
	<h1
		class="text-lg p-2 m-4 text-heading border-b max-w-50 text-start font-bold pt-4 pb-2"
	>
		Documents
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each categories3 as { name3, link3, subcategories3 }}
			<div class="p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">
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
		{/each}
	</div>
	<h1
		class="text-lg p-2 m-4 text-heading border-b max-w-50 text-start font-bold pt-4 pb-2"
	>
		Resources
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each categories4 as { name4, link4, subcategories4 }}
			<div class="break-inside-avoid mb-4 p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">
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
		{/each}
	</div>
</div>
