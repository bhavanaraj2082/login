<script>
    import { FeaturedData } from '$lib/data/FeaturedData.json';
  </script>
  
  <section class="w-11/12 mx-auto py-12 max-w-7xl">
    <div>
        <h1 class="font-bold text-xl pb-4">Featured Links</h1>
        <p class="sm:text-sm text-xs text-justify text-gray-700">
            Access our card for essential information at your fingertips, reach out to us for prompt assistance with any questions, and explore our comprehensive documentation for detailed guidance and support.
        </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
        {#each FeaturedData as { name, description, image, buttonLabel, link }}
            <div class="shadow flex flex-col  bg-white justify-between items-center rounded-lg overflow-hidden p-6 text-center hover:shadow-md">
                <img src={image} alt={name} class="w-8/12 h-auto object-cover rounded mb-4">
                <div class="flex-1">
                    <h3 class="text-xl font-semibold mb-2">{name}</h3>
                    <p class="text-gray-600 m-2 text-sm justify-center">{description}</p>
                </div>
                <a href={link} class="text-primary-500 border border-primary-500 w-11/12 py-1.5 my-2 rounded-md hover:bg-primary-500 hover:text-gray-100 transition-colors font-medium duration-500">
                    {buttonLabel}
                </a>
            </div>
        {/each}
    </div>
  </section>
  