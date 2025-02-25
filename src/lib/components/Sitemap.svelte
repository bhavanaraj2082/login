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
	<h1 class="text-Black md:text-2xl text-2xl py-4 px-2 font-bold">
		Chemikart Site Map
	</h1>

	<!-- Products Section -->
	<h1
		class="text-lg p-2 m-4 text-Heading border-b max-w-50 text-start font-bold header-spacing"
	>
		Products
	</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
		{#each categories1 as { name1, link1, subcategories1 }}
			<div class="p-4">
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
									class="px-2 text-gray-700 hover:underline text-xs w-full break-words"
								>
									{subName1}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Applications Section -->
	<h1
		class="text-lg p-2 m-4 text-Heading border-b max-w-50 text-start font-bold header-spacing"
	>
		Applications
	</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
		{#each categories2 as { name2, link2, subcategories2 }}
			<div class="p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">{name2}</p>
				</h2>
				{#if subcategories2 && subcategories2.length > 0}
					<ul class="list-none pl-0 space-y-2">
						{#each subcategories2 as { name2: subName2, link2: subLink2 }}
							<li class="flex flex-wrap">
								<a
									href={subLink2}
									class="px-2 text-gray-700 hover:underline text-xs w-full break-words"
								>
									{subName2}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Documents Section -->
	<h1
		class="text-lg p-2 m-4 text-Heading border-b max-w-50 text-start font-bold header-spacing"
	>
		Documents
	</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
		{#each categories3 as { name3, link3, subcategories3 }}
			<div class="p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">{name3}</p>
				</h2>
				{#if subcategories3 && subcategories3.length > 0}
					<ul class="list-none pl-0 space-y-2">
						{#each subcategories3 as { name3: subName3, link3: subLink3 }}
							<li class="flex flex-wrap">
								<a
									href={subLink3}
									class="px-2 text-gray-700 hover:underline text-xs w-full break-words"
								>
									{subName3}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Resources Section -->
	<h1
		class="text-lg p-2 m-4 mt-12 text-Heading border-b max-w-50 text-start font-bold header-spacing"
	>
		Resources
	</h1>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
		{#each categories4 as { name4, link4, subcategories4 }}
			<div class="p-4">
				<h2
					class="text-sm font-semibold mb-4 border-b-1 border-description"
				>
					<p class="text-primary-400 w-fit p-2 font-bold">{name4}</p>
				</h2>
				{#if subcategories4 && subcategories4.length > 0}
					<ul class="list-none pl-0 space-y-2">
						{#each subcategories4 as { name4: subName4, link4: subLink4 }}
							<li class="flex flex-wrap">
								<a
									href={subLink4}
									class="px-2 text-gray-700 hover:underline text-xs w-full break-words"
								>
									{subName4}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.header-spacing {
		padding-top: 16px; /* Adjust the top padding to give consistent space */
		padding-bottom: 8px; /* Adjust the bottom padding */
	}
</style>
