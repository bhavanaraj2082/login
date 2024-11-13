<script>
  import { FeaturedData } from '$lib/data/FeaturedData.json';
</script>

<section class="w-11/12 mx-auto py-12 max-w-7xl">
  <div>
      <h1 class="font-bold text-xl pb-4">Featured Links</h1>
      <p class="text-sm text-gray-700">
          Access our card for essential information at your fingertips, reach out to us for prompt assistance with any questions, and explore our comprehensive documentation for detailed guidance and support.
      </p>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
      {#each FeaturedData as { name, description, image, buttonLabel, link }}
          <div class="shadow-sm flex flex-col  bg-white justify-between items-center border rounded-lg overflow-hidden p-6 text-center min-h-96">
              <img src={image} alt={name} class="w-full h-52 object-cover rounded mb-4">
              <div class="flex-1">
                  <h3 class="text-xl font-semibold mb-2">{name}</h3>
                  <p class="text-gray-600 mb-4 justify-center">{description}</p>
              </div>
              <a href={link} class="text-primary-400 border border-primary-400 w-full py-2 rounded hover:bg-orange-600 hover:text-gray-100 transition-colors duration-500">
                  {buttonLabel}
              </a>
          </div>
      {/each}
  </div>
</section>
