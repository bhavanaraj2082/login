<script>
  import Icon from '@iconify/svelte';
  import { products } from '$lib/data/PopularProducts.json';
</script>

<section class="w-11/12 mx-auto py-12 max-w-7xl border rounded-lg p-8">
  <div class="flex flex-wrap w-full justify-between py-6">
      <div class="sm:w-3/6 w-full">
          <h1 class="text-xl font-bold pb-4">Most Popular Products</h1>
          <p class="text-xs">Choose Chemikart for your chemical needs and experience the difference that quality and service can make in your scientific endeavors.</p>
      </div>
      <div class="flex items-center justify-evenly sm:mr-10 mr-0 sm:mt-0 mt-2">
          <a href="https://chemikart.partskeys.com/products" target="_blank" rel="noopener noreferrer"
             class="flex text-sm justify-center items-center font-semibold rounded-md bg-primary-400 text-gray-100 px-4 p-2">
              View All
              <Icon icon="formkit:right" width="1.2em" height="1.2em" />
          </a>
      </div>
  </div>
  <div class="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
      {#each products as product}
          <div class="shadow-sm flex flex-col justify-between border bg-white rounded-lg pb-6 overflow-hidden h-96">
              <img src={product.image} alt={product.name} class="w-48 h-48 rounded-t-lg mx-auto object-contain mb-4">
              <div class="flex-1 gap-2">
                  <h3 class="text-xl font-semibold">{product.name}</h3>
                  <p class="text-gray-600 h-16 p-2">{product.description}</p>
              </div>
              <a href={product.link || '#'} target="_blank" rel="noopener noreferrer"
                 class="bg-primary-400 text-white w-5/6 mx-auto  py-2.5 rounded hover:bg-primary-500 mt-4">
                  {product.buttonLabel}
              </a>
          </div>
      {/each}
  </div>
</section>
