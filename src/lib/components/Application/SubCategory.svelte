<script>
  import Icon from "@iconify/svelte";
  import RelatedProductss from "$lib/components/RelatedProductss.svelte";
  import Card from "$lib/components/Application/Card.svelte";
  export let data;
  export let profile;
  // console.log("profile",profile);
  
  $: categoryData = data?.categoryData ||{};
  $: subcategoryData = data?.subcategoryData||{};
  $: subsubcategories = data?.subsubcategories || [];
  $: relatedProducts = data?.relatedProducts ||{};
//  console.log("categoryData",categoryData);
//  console.log("subcategoryData",subcategoryData);
//  $: console.log("subsubcategories",subsubcategories);
//  console.log("relatedProducts",relatedProducts);

  $: filteredSubsubCategories = searchTerm.trim() === "" 
    ? subsubcategories 
    : subsubcategories.filter(
        (subsubcategories) => subsubcategories.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  let searchTerm="";

  function clearSearch() {
      searchTerm =  ''
  }

</script>

<section class="lg:w-11/12 w-full mx-auto my-3 max-w-7xl px-4 sm:px-0">
  {#if subsubcategories && subsubcategories.length > 0}
    <h1 class="sm:hidden block sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-heading">
      {subcategoryData?.name}
    </h1>
    <div class="text-center sm:flex sm:px-0 justify-between items-center mb-2">
      <h1 class="sm:block hidden px-6 sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-heading">
        {subcategoryData?.name}
      </h1>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon icon="si:search-line" width="15" height="15" />
        </div>
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search Sub Sub categories..."
          class="w-full pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent placeholder:text-xs text-xs p-3"/>
        {#if searchTerm}
          <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-50 p-1" style="color: #cb1919" on:click={clearSearch}>
            <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
          </button>
        {/if}
      </div>
    </div>
    
    {#if filteredSubsubCategories.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 my-6">
        {#each filteredSubsubCategories as subsubcategory}
          <Card
            url={`/applications/${categoryData.url}/${subcategoryData.url}/${subsubcategory.url}`}
            imageSrc={subsubcategory.image}
            altText={subsubcategory?.name}
            name={subsubcategory?.name}
            description={subsubcategory?.description}
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
          No Search related sub sub Category available
        </h3>
        <p class="text-gray-500 max-w-md">
          We couldn't find any categories matching your search criteria. Please
          try a different search term or check back later.
        </p>
      </div>
    {/if}
  {:else}
    <div class="flex flex-col md:flex-row items-center lg:items-start gap-2 my-8">
      <div class="flex-shrink-0 w-full md:w-1/3">
        <img
          src={subcategoryData?.image}
          alt={subcategoryData?.name}
          class="h-80 rounded-lg shadow"/>
      </div>
      <div class="flex-grow w-full md:w-2/3">
        <h2 class="sm:text-2xl text-xl text-heading font-semibold">
          {subcategoryData?.name}
        </h2>
        <p class="mt-2 sm:text-md  text-gray-600 text-justify">{subcategoryData?.description}</p>
      </div>
    </div>
    {#if subcategoryData.additionalInfo && subcategoryData.additionalInfo.length > 0}
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800">Overview</h3>
        <div class="mt-4 text-gray-600">
          {#each subcategoryData?.additionalInfo as info}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-800">{info?.title}</h4>
              <p class="mt-2 sm:text-sm text-xs text-justify">{@html info?.content}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if relatedProducts && relatedProducts.length > 0}
    <RelatedProductss {relatedProducts} {profile} />
  {/if}
  {/if}
</section>
