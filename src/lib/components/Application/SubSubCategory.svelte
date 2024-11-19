<script>
  export let data;
  
  import RelatedProductss from "$lib/components/RelatedProductss.svelte";
  let subsubcategoryData = data?.subsubcategoryData;
</script>

<section class="w-11/12 mx-auto mb-3 max-w-7xl">
  <div class="flex flex-col md:flex-row items-center lg:items-start gap-8 mt-8">
    <div class="flex-shrink-0 w-full md:w-1/3">
      <img
        src="/PopularProductsImg1.jpeg"
        alt={subsubcategoryData.name}
        class="w-full h-auto rounded-lg shadow-lg"
      />
    </div>

    <div class="flex-grow w-full lg:w-2/3">
      <h1 class="text-4xl font-semibold text-primary-400">
        {subsubcategoryData.name}
      </h1>
      <p class="mt-2 text-lg text-gray-600">{subsubcategoryData.description}</p>
    </div>
  </div>

  <RelatedProductss />
  {#if subsubcategoryData.additionalInfo}
    <div class="mt-8">
      <h2 class="text-2xl font-semibold text-gray-800">More Information</h2>
      <p class="mt-4 text-gray-600">{subsubcategoryData.additionalInfo}</p>
    </div>
  {/if}
</section>
