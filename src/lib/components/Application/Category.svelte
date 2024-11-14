<script>
    import Card from '$lib/components/Application/Card.svelte'; 
    export let data;
    
    let categoryData = data.categoryData;
    let subcategories = data.categoryData.subcategories;
    
  </script>
  
  <section class="w-11/12 mx-auto mb-3">
    <h1 class="text-2xl font-semibold text-primary-400">{categoryData.name}</h1>
    <p class="mt-2 text-lg text-gray-600">{categoryData.description}</p>
  
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-3 ">
      {#each subcategories as subcategory}
        <Card 
          url={`/applications/${categoryData.url}/${subcategory.url}`}
          imageSrc="/PopularProductsImg1.jpeg" 
          altText={subcategory.name} 
          name={subcategory.name} 
          description={subcategory.description} 
        />
      {/each}
    </div>
  </section>
  
  
  