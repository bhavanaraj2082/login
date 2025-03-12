<script>
	import { onMount } from "svelte";
	import data1 from "$lib/data/sitemap.json";
  
	let showMore = false;
	let showMoreCategories2 = false;
  
	let categories1 = [];
	let categories2 = [];
	let categories3 = [];
	let categories4 = [];
  
	// Reactive update for name1
	function updateCategoryNames(categories) {
	  return categories.map(category => {
		if (category.name1 === "Molecular Biology And Functional Genomics") {
		  category.name1 = "Molecular BioGen";  
		}
		if (category.name1 === "Pharma And Biopharma Manufacturing") {
		  category.name1 = "Pharma & BioTech";  
		}
		if (category.name2 === "Cell Culture & Cell Culture Analysis") {
		  category.name2 = "Cell Culture Tech";  
		}
		if (category.name2 === "Clinical Testing & Diagnostics Manufacturing") {
		  category.name2 = "Clinical Test MFG";  
		}
		if (category.name2 === "Environmental Testing & Industrial Hygiene") {
		  category.name2 = "EcoHygiene & Testing";  
		}
		if (category.name2 === "Food & Beverage Testing & Manufacturing") {
		  category.name2 = "Food & Beverage Test MFG";  
		}
		if (category.name2 === "Materials Science and Engineering") {
		  category.name2 = "Material Tech";  
		}
		if (category.name2 === "Pharmaceutical & Biopharmaceutical Manufacturing") {
		  category.name2 = "Pharma BioPharma MFG";  
		}
		return category;
	  });
	}
  
	onMount(() => {
	  categories1 = updateCategoryNames(data1.categories1);
	  categories2 = updateCategoryNames(data1.categories2);
	  categories3 = data1.categories3;
	  categories4 = data1.categories4;
	});
  </script>
  
  <div class="font-sans mx-auto w-11/12 max-w-7xl">
	<h1 class="text-black sm:text-2xl text-lg px-2 font-bold">
	  Chemikart Site Map
	</h1>
	<h1
	  class="text-lg m-4 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
	>
	  Products
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-1 gap-0">
	  {#each categories1 as { name1, link1, subcategories1 }}
		<div class="break-inside-avoid mb-4 p-4">
		  <h2 class="text-sm font-semibold mb-4 border-b-1 border-description">
			<p class="text-gray-600 w-fit p-2 font-bold">{name1}</p>
		  </h2>
  
		  {#if subcategories1 && subcategories1.length > 0}
			<ul class="list-none pl-0 space-y-2">
			  {#each subcategories1.slice(0, showMore ? subcategories1.length : 3) as { name1: subName1, link1: subLink1 }}
				<li class="flex flex-wrap">
				  <a
					href={subLink1}
					class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
				  >
					{subName1.length > 40 ? subName1.slice(0, 40) + '...' : subName1}
				  </a>
				</li>
			  {/each}
			</ul>
  
			{#if subcategories1.length > 3}
			  <button
				on:click={() => showMore = !showMore}
				class="mt-2 ml-2 text-xs text-primary-400 hover:underline"
			  >
				{showMore ? 'Show Less' : 'See More...'}
			  </button>
			{/if}
		  {/if}
		</div>
	  {/each}
	</div>
	<h1
		class="text-lg m-4 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
	>
		Applications
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-0">
		{#each categories2 as { name2, link2, subcategories2 }}
  <div class="break-inside-avoid mb-4 p-4">
    <h2 class="text-sm font-semibold mb-4 border-b-1 border-description">
      <p class="text-gray-600 w-fit p-2 font-bold">{name2}</p>
    </h2>

    {#if subcategories2 && subcategories2.length > 0}
      <ul class="list-none pl-0 space-y-2">
        {#each subcategories2.slice(0, showMoreCategories2 ? subcategories2.length : 3) as { name2: subName2, link2: subLink2 }}
          <li class="flex flex-wrap">
            <a
              href={subLink2}
              class="px-2 text-gray-700 hover:underline text-xs break-words transition-transform transform hover:scale-105 hover:text-gray-800 hover:font-semibold ease-in-out duration-100 visited:text-primary-600 visited:hover:text-primary-600"
            >
              {subName2}
            </a>
          </li>
        {/each}
      </ul>

      {#if subcategories2.length > 3}
        <button
          on:click={() => showMoreCategories2 = !showMoreCategories2}
          class="mt-2 ml-2 text-xs text-primary-400 hover:underline"
        >
          {showMoreCategories2 ? 'Show Less' : 'See More...'}
        </button>
      {/if}
    {/if}
  </div>
{/each}
	</div>
	<h1
		class="text-lg m-4 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
	>
		Documents
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-0">
		{#each categories3 as { name3, link3, subcategories3 }}
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
		{/each}
	</div>
	<h1
		class="text-lg m-4 text-heading border-b-2 border-primary-500 max-w-50 text-start font-bold"
	>
		Resources
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-0">
		{#each categories4 as { name4, link4, subcategories4 }}
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
		{/each}
	</div>
</div>
