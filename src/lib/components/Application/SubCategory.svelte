<script>
  import RelatedProductss from "$lib/components/RelatedProductss.svelte";
  import Card from "$lib/components/Application/Card.svelte";
  export let data;

  let categoryData = data.categoryData;
  let subcategoryData = data.subcategoryData;
  let subsubcategories = data.subsubcategories || {};
  let relatedProducts = data?.relatedProducts?.items;
</script>

<section class="w-11/12 mx-auto my-3 max-w-7xl">
  {#if subsubcategories.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
      {#each subsubcategories as subsubcategory}
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
    <div
      class="flex flex-col md:flex-row items-center lg:items-start gap-2 my-8"
    >
      <div class="flex-shrink-0 w-full md:w-1/3">
        <img
          src={subcategoryData?.image}
          alt={subcategoryData?.name}
          class="h-80 rounded-lg shadow-lg"
        />
      </div>
      <div class="flex-grow w-full md:w-2/3">
        <h2 class="text-2xl text-primary-400 font-semibold">
          {subcategoryData?.name}
        </h2>
        <p class="mt-2 text-md text-gray-600">{subcategoryData?.description}</p>
      </div>
    </div>
    {#if relatedProducts && relatedProducts.length > 0}
      <RelatedProductss {relatedProducts} />
    {/if}
    {#if subcategoryData.additionalInfo && subcategoryData.additionalInfo.length > 0}
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800">Overview</h3>
        <div class="mt-4 text-gray-600">
          {#each subcategoryData?.additionalInfo as info}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-800">{info?.title}</h4>
              <p class="mt-2 text-sm">{@html info?.content}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>
