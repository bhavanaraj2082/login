<script>
	export let data;
	const subcategories = data.records;
</script>

<div class="w-full mb-8 px-6 lg:px-8 md:w-11/12 mx-auto">
	<div class="pl-4 md:pl-0">
		<p class="text-primary-400 font-semibold text-xl">
			{subcategories[0]?.category?.name}
		</p>
		<p class="mt-2 text-base text-content">
			Precision-driven laboratory chemicals perfect for research, analysis, and experiments, with
			top-tier quality and reliability.
		</p>
	</div>
	<div
		class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0"
	>
		{#each subcategories as subcategory}
			{#if subcategory.productCount > 0}
				<div
					class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300"
				>
					<div
						class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"
					></div>
					<a
						href="/products/{subcategory.category.urlName}/{subcategory.urlName}"
						class="block relative z-10"
					>
						<div class="relative">
							<img
								src="/image/category.jpeg"
								alt={subcategory.name}
								class="w-full h-60 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
							/>
						</div>
						<div class="p-4">
							<div class="flex justify-between items-center">
								<h4
									class="text-sm font-semibold text-gray-500 hover:underline truncate"
									title={subcategory.name}
								>
									{subcategory.name}
								</h4>
								{#if subcategory.productCount}
									<span class="text-xs text-gray-400">
										({subcategory.productCount})
									</span>
								{/if}
							</div>
						</div>
					</a>
				</div>
			{/if}
		{/each}
	</div>
</div>
