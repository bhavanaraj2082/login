<script>
	export let data;
	const categories = data.records;
	// console.log('=======>cat', categories);
</script>

<div class="w-11/12 mx-auto mb-10 lg:px-8">
	<div class="pl-4">
		<p class="mt-2 text-base text-content">
			Explore our high-quality chemical products, Classified into various categories, each playing a
			vital role in innovation and transformation.
		</p>
	</div>
	<div
		class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 sm:mx-0"
	>
		{#each categories as category}
			<div class="bg-white shadow rounded-md overflow-hidden">
				<img src="/category/{category.name}.webp" alt="img" class=" w-full h-60 object-center" />
				<div class="p-4">
					<a href="/products/{category.urlName}">
						<h3 class="text-lg font-semibold text-heading hover:underline">
							{category.name}
						</h3>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
