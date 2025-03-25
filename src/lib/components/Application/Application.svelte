<script>
    import Icon from "@iconify/svelte";
  export let data;

  $: categoryData = data.categoryData 

  $: filteredCategories = searchTerm.trim() === "" 
  ? categoryData 
  : categoryData.filter(
      (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const getTruncatedDescription = (description, maxWords = 10) => {
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'; 
    }
    return description;
  };

  let searchTerm="";

  function clearSearch() {
			searchTerm =  ''
	}
</script>

<section class="w-11/12 flex flex-col mx-auto mb-3 max-w-7xl">
  <h1 class="sm:hidden block sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-heading">
    Applications
  </h1>
  <div class="text-center sm:flex sm:px-0 justify-between items-center mb-2">
    <h1 class="sm:block hidden px-6 sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-heading">
      Applications
    </h1>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon icon="si:search-line" width="15" height="15" />
      </div>
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search categories..."
        class="w-full pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent placeholder:text-xs text-xs p-3"
      />
      {#if searchTerm}
      <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-50 p-1" style="color: #cb1919" on:click={clearSearch}>
        <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
      </button>
    {/if}
    </div>
  </div>
  {#if filteredCategories.length > 0}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mt-6 mb-3">
    {#each filteredCategories as category}
      <div class="group relative max-w-sm rounded-lg overflow-hidden shadow-md bg-white transition-shadow duration-300 hover:shadow-xl">
        <a href={`/applications/${category?.url}`} class="block relative z-10">
          <div class="relative">
            <img
              src={category.image}
              alt={category.name}
              class="w-full h-48 object-cover opacity-90 transition-transform duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100"
            />
          </div>
          <div class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"></div>
          <div class="p-4 bg-white">
            <h3 class="sm:text-xl text-md font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-500">
              {category?.name}
            </h3>
            <p class="mt-2 sm:text-sm text-xs text-gray-600 text-justify">
              {getTruncatedDescription(category?.description) || "No description available"}
            </p>
          </div>
        </a>
      </div>
    {/each}
  </div>
  {:else}
  <div class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center">
    <Icon
      icon="ph:package-duotone"
      width="64"
      height="64"
      class="text-primary-400 mb-4"
    />
    <h3 class="text-xl font-medium text-gray-900 mb-2">
      No Applications categories available
    </h3>
    <p class="text-gray-500 max-w-md">
      We couldn't find any categories matching your search criteria. Please
      try a different search term or check back later.
    </p>
  </div>
  {/if}
</section>
