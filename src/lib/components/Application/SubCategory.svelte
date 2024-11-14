<script>
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import Card from '$lib/components/Application/Card.svelte'; 
    export let data;
    
    let categoryData = data.categoryData;
    let subcategoryData = data.subcategoryData;
    let subsubcategories = data.subsubcategories || {};   
  </script>
  
  <section class="w-11/12 mx-auto mb-3">
    <h1 class="text-2xl font-semibold text-primary-400">
      {subcategoryData.name}
    </h1>
    <p class="mt-2 text-lg text-gray-600">{subcategoryData.description}</p>
  
    {#if subsubcategories.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 ">
        {#each subsubcategories as subsubcategory}
        <Card 
        url={`/applications/${categoryData.url}/${subcategoryData.url}/${subsubcategory.url}`}
        imageSrc="/PopularProductsImg1.jpeg" 
        altText={subsubcategory.name} 
        name={subsubcategory.name} 
        description={subsubcategory.description} 
      />
        {/each}
      </div>
    {:else}
      <div
        class="flex flex-col md:flex-row items-center lg:items-start gap-8 mt-8"
      >
        <div class="flex-shrink-0 w-full md:w-1/3">
          <img
            src="/PopularProductsImg1.jpeg"
            alt={subcategoryData.name}
            class="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
  
        <div class="flex-grow w-full md:w-2/3">
          <h2 class="text-2xl font-semibold text-gray-800">
            {subcategoryData.name}
          </h2>
          <p class="mt-2 text-lg text-gray-600">{subcategoryData.description}</p>
        </div>
      </div>
      <RelatedProductss />
      {#if subcategoryData.additionalInfo}
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-gray-800">More Information</h3>
          <p class="mt-4 text-gray-600">{subcategoryData.additionalInfo}</p>
        </div>
      {/if}
    {/if}
  </section>
  