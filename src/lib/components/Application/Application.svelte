<script>
  export let data;
  $: categoryData = data.categoryData
  const getTruncatedDescription = (description, maxWords = 10) => {
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'; 
    }
    return description;
  };
</script>

<section class="w-11/12 flex flex-col mx-auto mb-3 max-w-7xl">
  <h1 class="text-heading font-bold text-lg md:text-2xl">Applications</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-6 mb-3">
    {#each categoryData as category}
      <div class="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
        <a href={`/applications/${category.url}`} class="block">
          <img
            src={category.image}
            alt={category.name}
            class="w-full h-48 object-cover"/>

          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">{category.name}</h3>
            <p class="mt-2 text-sm text-gray-600">
              {getTruncatedDescription(category.description) || "No description available"}
            </p>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>
