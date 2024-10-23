<script>
	import { onMount } from 'svelte';
	import data1 from '../data/sitemap.json';

	let categories1 = [];
	let categories2 = [];
	let categories3 = [];

	onMount(() => {
		categories1 = data1.categories1;
		categories2 = data1.categories2;
		categories3 = data1.categories3;
	});
</script>

<div class="font-sans mx-auto">
	<h1 class="text-3xl p-4 text-heading font-bold">Chemikart Site Map</h1>
	<h1 class="text-lg p-2 m-4 text-primary-400 border-b max-w-50 text-start font-bold">
        Prodcuts
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
		{#each categories1 as { name1, link1, subcategories1 }}
			<div class=" p-4">
				<h2 class="text-sm font-semibold mb-4 border-b-1 border-description">
					<p class="text-heading w-fit p-2 font-bold">{name1}</p>
				</h2>
				{#if subcategories1 && subcategories1.length > 0}
					<ul class="list-none pl-0">
						{#each subcategories1 as { name1: subName1, link1: subLink1 }}
							<li>
								<a href={subLink1} class="px-2 text-primary-600 hover:underline text-xs">{subName1}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
	<h1 class="text-lg p-2 m-4 text-primary-400 border-b max-w-50 text-start font-bold">
        Application
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
		{#each categories2 as { name2, link2, subcategories2 }}
			<div class="p-4">
				<h2 class="text-sm font-semibold mb-4 border-b-1 border-description">
					<p class="text-heading rounded-t-md w-fit p-2 font-bold">{name2}</p>
                </h2>
				{#if subcategories2 && subcategories2.length > 0}
					<ul class="list-none pl-0">
						{#each subcategories2 as { name2: subName2, link2: subLink2 }}
							<li>
								<a href={subLink2} class="px-2  text-primary-600 hover:underline text-xs">{subName2}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
    <h1 class="text-lg p-2 m-4 text-primary-400 border-b max-w-50 text-start font-bold">
       Document 
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
		{#each categories3 as { name2, link2, subcategories2 }}
			<div class="p-4">
				<h2 class="text-sm font-semibold mb-4 border-b-1 border-description">
					<p class="text-heading rounded-t-md w-fit p-2 font-bold">{name2}</p>
                </h2>
				{#if subcategories2 && subcategories2.length > 0}
					<ul class="list-none pl-0">
						{#each subcategories2 as { name2: subName2, link2: subLink2 }}
							<li>
								<a href={subLink2} class="px-2  text-primary-600 hover:underline text-xs">{subName2}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>
