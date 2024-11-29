<script>
  import RelatedProductss from "$lib/components/RelatedProductss.svelte";
  export let data;
  let subsubcategoryData = data.subsubcategoryData;
  let relatedProducts = data?.relatedProducts;
  //console.log("form subsubcategory",relatedProducts);

</script>

<section class="w-11/12 mx-auto mb-3 max-w-7xl">
  <div class="flex flex-col md:flex-row items-center lg:items-start gap-2 mt-8">
    <div class="flex-shrink-0 w-full md:w-1/3">
      <img
        src={subsubcategoryData?.image}
        alt={subsubcategoryData?.name}
        class=" md:h-80 rounded-lg shadow-lg"
      />
    </div>

    <div class="flex-grow w-full lg:w-2/3">
      <h1 class="text-3xl font-semibold text-primary-400">
        {subsubcategoryData?.name}
      </h1>
      <p class="mt-2 text-md text-gray-600">
        {subsubcategoryData?.description}
      </p>
    </div>
  </div>
  {#if relatedProducts && relatedProducts?.length > 0}
    <RelatedProductss {relatedProducts} />
  {/if}
  {#if subsubcategoryData?.additionalInfo && subsubcategoryData?.additionalInfo.length > 0}
    <div class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-800">Overview</h2>
      <div class="mt-4 text-gray-600">
        {#each subsubcategoryData?.additionalInfo as info}
          <div class="mb-4">
            <h3 class="text-md font-medium text-gray-800">{info?.title}</h3>
            <p class="mt-2 text-sm">{@html info?.content}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</section>
