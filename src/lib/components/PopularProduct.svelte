
<script>
	import Icon from '@iconify/svelte';
    import {products} from '$lib/data/PopularProducts.json'    
</script>

<section class="w-11/12 mx-auto shadow-md  p-8">
    <div class="flex flex-wrap w-full justify-between py-6">
        <div class="sm:w-3/6  w-full">
            <h1 class="text-xl font-bold pb-4">Most popular Products</h1>
            <p class="text-xs">Choose Chemicart for your chemical needs and experience the different that quality and service can make in your scientific endeavors</p>
        </div>
        <div class="flex items-center justify-evenly sm:mr-10 mr-0 sm:mt-0 mt-2">
            <button class="flex text-sm justify-center items-center font-semibold rounded-md bg-orange-600 text-gray-100 px-4 p-2 ">
                view All 
                <Icon icon="formkit:right" width="1.2em" height="1.2em" />
            </button>
        </div>
    </div>  
    <div class=" my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {#each products as product}
          <div class="shadow-sm border rounded-lg overflow-hidden pb-2 ">
            <img src={product.image} alt={product.name} class="w-full h-48 object-cover pb-4">
            <div class="space-y-4">
              <h3 class="text-xl font-semibold mb-2">{product.name}</h3>
              <p class="text-gray-600 mb-4 h-16">{product.description}</p>
              <button class="bg-orange-500 text-white w-5/6 py-2 rounded hover:bg-orange-600">
                {product.buttonLabel}
              </button>
            </div>
          </div>
        {/each}
      </div>
</section>