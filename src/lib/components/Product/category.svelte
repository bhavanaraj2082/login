<script>
  export let data;
  const categories = data.records;
  import Icon from "@iconify/svelte";
  console.log("=======>cat", categories);

  let searchTerm = "";

  $: filteredCategories = categories.filter(
    (category) =>
      category.productCount > 0 &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="w-full mb-10 lg:px-8 md:w-11/12 mx-auto max-w-7xl">
  <div class="md:pl-0">
    <div class="text-center sm:flex px-6 sm:px-0 justify-between items-center mb-2">
      <h1 class="mb-2 sm:mb-0 font-semibold text-2xl text-primary-400">
        Our Category
      </h1>

      <div class="relative">
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search categories..."
          class="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Icon icon="si:search-line" width="20" height="20" />
        </div>
      </div>
    </div>

    <p class="mt-2 text-base text-content p-2 lg:p-0 text-center lg:text-left">
      Explore our high-quality chemical products, Classified into various
      categories, each playing a vital role in innovation and transformation.
    </p>
  </div>

  {#if filteredCategories.length > 0}
    <div
      class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0"
    >
      {#each filteredCategories as category}
        <div
          class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300"
        >
          <div
            class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"
          ></div>
          <a href="/products/{category.urlName}" class="block relative z-10">
            <div class="relative">
              <img
                src="/category/{category.name}.webp"
                alt={category.name}
                class="w-full h-60 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-center">
                <h4
                  class="font-semibold text-sm text-gray-500 hover:underline truncate"
                  title={category.name}
                >
                  {category.name}
                </h4>
                {#if category.productCount}
                  <span class="text-1s text-gray-400">
                    ({category.productCount})
                  </span>
                {/if}
              </div>
            </div>
          </a>
        </div>
      {/each}
    </div>
  {:else}
    <div class="mt-8 flex flex-col items-center justify-center p-8 text-center">
      <Icon
        icon="ph:package-duotone"
        width="64"
        height="64"
        class="text-primary-400 mb-4"
      />
      <h3 class="text-xl font-medium text-gray-900 mb-2">
        No categories available
      </h3>
      <p class="text-gray-500 max-w-md">
        We couldn't find any categories matching your search criteria. Please
        try a different search term or check back later.
      </p>
    </div>
  {/if}
</div>
