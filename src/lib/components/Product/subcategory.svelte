<script>
  export let data;
  $: subcategories = data.records;
  import Icon from "@iconify/svelte";

  let searchTerm = "";

  $: filteredSubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.productCount > 0 &&
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="w-full mb-8 px-6 lg:px-8 md:w-11/12 mx-auto">
  <div class="pl-4 md:pl-0">
    <div class="text-center lg:flex px-6 lg:px-0 justify-between items-center mb-2">
      <p class="text-heading font-bold text-xl lg:text-2xl mb-2 lg:mb-0">
        {subcategories[0]?.category?.name}
      </p>

      <div class="relative">
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search subcategories..."
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
      Precision-driven laboratory chemicals perfect for research, analysis, and
      experiments, with top-tier quality and reliability.
    </p>
  </div>

  {#if filteredSubcategories.length > 0}
    <div
      class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0"
    >
      {#each filteredSubcategories as subcategory}
        <div
          class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300"
        >
          <div
            class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"
          ></div>
          <a
            href="/products/{subcategory.category
              .urlName}/{subcategory.urlName}"
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
        No subcategories available
      </h3>
      <p class="text-gray-500 max-w-md">
        We couldn't find any subcategories matching your search criteria. Please
        try a different search term or check back later.
      </p>
    </div>
  {/if}
</div>
