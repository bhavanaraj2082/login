<script>
	import subcategorydatas from '$lib/data/subcategorydatas.json';
	export let data;

	const subcategories = data;
	const categoryName = subcategories[0]?.category?.name || "";
	const subCategoryName = subcategories[0]?.subCategory?.name || "";


	const findContent = (categoryName, subCategoryName) => {
		const category = subcategorydatas.find(
			(category) => category.category.name.toLowerCase() === categoryName.toLowerCase()
		);
		if (category) {
			const subCategory = category.category.subcategories.find(
				(subCategory) => subCategory.name.toLowerCase() === subCategoryName.toLowerCase()
			);
			return subCategory ? subCategory.content : 'No content available';
		}
		return 'No content available';
	};

	const content = findContent(categoryName, subCategoryName);
</script>

<div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 my-10 px-3 md:w-11/12">
	<div class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300">
		<div 
			class="absolute inset-0 bg-gray-400 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none">
		</div>
		<img
			src={`/subcategory/${categoryName}/${subCategoryName || "img"}.webp`}
			alt="img"
			class="w-full h-52 md:w-80 md:h-72 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100 rounded-lg"
		/>
	</div>
	<div class="flex flex-col">
		<h1 class="text-2xl font-semibold mb-2 text-primary-400">
			{subCategoryName}
		</h1>
		<p class="text-base text-content">{content}</p>
	</div>
</div>
