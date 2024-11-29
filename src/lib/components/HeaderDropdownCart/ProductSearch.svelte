<script>
	import SearchSection from '$lib/components/HeaderDropdownCart/SearchSection.svelte';
	export let data;
	let components, categories, subcategories, manufacturers;
	$: {
		components = data?.result?.components || [];
		categories = data?.result?.categories || [];
		subcategories = data?.result?.subcategories || [];
	}
</script>

<section class="mx-auto pt-3">
	<div class="w-full p-5 space-y-6">
		{#if components?.length > 0 || categories?.length > 0 || subcategories?.length > 0 || manufacturers?.length > 0}
			<h3 class="text-2xl font-semibold mb-4">Matched Results</h3>
		{:else}
			<h3 class="text-2xl font-semibold mb-4">No results found</h3>
		{/if}

		{#if components && components.length > 0}
			<h3 class="text-xl font-bold">Products</h3>
			<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each components as item}
					<a href="/products/{item?.category?.urlName}/{item?.subCategory?.urlName}/{item?.productNumber}" class="block">
						<div
							class="flex gap-3 border rounded p-4 cursor-pointer hover:border-gray-400"
						>
							<img
								src={item?.imageSrc}
								class="w-20 h-20 object-cover rounded-md text-sm"
								alt={item?.productName}
							/>
							<div class="">
								<p class="text-sm font-medium">{item?.productName}</p>
								<p class="text-sm">{item?.productNumber}</p>
							</div>
						</div>
					</a>
				{/each}
			</section>
		{/if}

		<SearchSection
			title="Categories"
			items={categories}
			linkPrefix="/products/"
			isSubcategory={false}
		/>
		<SearchSection
			title="Sub Categories"
			items={subcategories}
			linkPrefix="/products/"
			isSubcategory={true}
		/>
	</div>
</section>
