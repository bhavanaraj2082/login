<script>
  import Icon from "@iconify/svelte";
  import Card from '$lib/components/Application/Card.svelte'; 
  export let data;
  
  $: categoryData = data.categoryData;
  $: subcategories = data.categoryData.subcategories;

  // $: console.log('==++',subcategories)

  let searchTerm="";

  function clearSearch() {
      searchTerm =  ''
  }

  $: filteredSubCategories = searchTerm.trim() === "" 
  ? subcategories 
  : subcategories.filter(
      (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
</script>

<section class="w-full lg:w-11/12 mx-auto mb-3  max-w-7xl">
  <h1 class="sm:hidden block px-2.5  mb-2 sm:mb-0 font-bold text-xl text-heading">
    {categoryData.name}
  </h1>
  <div class="text-center sm:flex sm:px-0 justify-between items-center mb-2 lg:mx-0 mx-2">
    <h1 class="sm:block hidden sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-heading">
      {categoryData.name}
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
  <p class="mt-2 md:text-lg text-sm text-gray-600 sm:px-2 md:pl-0 mx-2 lg:mx-0 text-justify">{categoryData.description}</p>
  {#if filteredSubCategories.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 lg:mx-0 mx-2.5 my-6">
    {#each filteredSubCategories as subcategory}
      <Card 
        url={`/applications/${categoryData.url}/${subcategory.url}`}
        imageSrc={subcategory.image}
        altText={subcategory.name} 
        name={subcategory.name} 
        description={subcategory.description} 
      />
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
      No Search related Category available
    </h3>
    <p class="text-gray-500 max-w-md">
      We couldn't find any categories matching your search criteria. Please
      try a different search term or check back later.
    </p>
  </div>
  {/if}
</section>