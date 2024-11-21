<script>
  export let data;
  const categories = data.records;
</script>

<div class="max-w-7xl mx-auto mb-10 lg:px-8">
  <div class="pl-4">
    <p class="mt-2 text-base text-content">
      Explore our high-quality chemical products, Classified into various
      categories, each playing a vital role in innovation and transformation.
    </p>
  </div>
  <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as category}
      <div class="bg-white shadow-lg rounded-md overflow-hidden">
        <img
          src="image/category.jpeg"
          alt="img"
          class="w-full h-44 object-cover"
        />
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
