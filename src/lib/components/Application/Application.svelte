<script>
  export let data;
  let categoryData = data.categoryData;
</script>

<section class="w-11/12 flex flex-col mx-auto mb-3 max-w-7xl">
  <h1 class="text-2xl font-bold text-primary-400">Applications</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 mb-3">
    {#each categoryData as category}
      <div class="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
        <a href={`/applications/${category.url}`} class="block">
          <img
            src="/PopularProductsImg1.jpeg"
            alt={category.name}
            class="w-full h-48 object-cover"
          />

          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">{category.name}</h3>
            <p class="mt-2 text-sm text-gray-600">
              {category.description || "No description available"}
            </p>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>
