
<script>
    import {FeaturedData} from '$lib/data/FeaturedData.json'
</script>

<section class="w-11/12 mx-auto">
    <div>
        <h1 class="font-bold text-xl pb-4">Featured Links</h1>
        <p class="text-sm text-gray-700 ">Access our Card for essential information at your fingertips, reach out to us for prompt assistence with any quations, and explore our comprehensive Documentation for detailed guidance and support.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10  mt-8">
        {#each FeaturedData as FeaturedLink}
          <div class="shadow-sm flex flex-col items-center border rounded-lg overflow-hidden pb-2 text-center">
            <img src={FeaturedLink.image} alt={FeaturedLink.name} class="w-60 h-52 object-cover p-4">
            <div class="space-y-4 w-4/6 md:w-full mx-auto">
              <h3 class="text-xl font-semibold mb-2">{FeaturedLink.name}</h3>
              <p class="text-gray-600 mb-4 sm:h-20 lg:h-14 h-16">{FeaturedLink.description}</p>
              <button class="text-orange-500 border border-orange-500 w-5/6 py-2 rounded hover:bg-orange-500 hover:text-gray-100 transform duration-500 transition-colors">
                {FeaturedLink.buttonLabel}
              </button>
            </div>
          </div>
        {/each}
    </div>
</section>