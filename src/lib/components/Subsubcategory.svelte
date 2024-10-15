<script>
    import { onMount } from 'svelte';
    import productsData from '$lib/data/Subsubcategory.json';

    let category = [];

    onMount(() => {
        category = productsData.products || [];
    });
   
</script>

<div class="container mx-auto px-4">
    <div class="flex flex-col ">
        {#each category as product, index}
            <div class="bg-white p-6 shadow-sm transition-transform duration-300 w-full flex flex-col md:flex-row">
                {#if index % 2 === 0}
                    <div class="w-full md:w-1/3 mb-4 md:mb-0">
                        <img src={product.image_path} alt={product.type} class="w-full h-auto object-contain" />
                    </div>
                    <div class="flex-1 text-center md:text-left md:ml-8"> 
                        <h2 class="font-semibold text-lg mb-2 text-orange-500">{product.type}</h2>
                        <p class="text-base mb-2">{product.description}</p>
                    </div>
                {:else}
                    <div class="flex-1 text-center md:text-left md:mr-8 hidden md:block"> 
                        <h2 class="font-semibold text-lg mb-2 text-orange-500">{product.type}</h2>
                        <p class="text-base mb-2">{product.description}</p>
                    </div>
                    <div class="w-full md:w-1/3 mb-4 md:mb-0">
                        <img src={product.image_path} alt={product.type} class="w-full h-auto object-contain" />
                    </div>
                    <div class="flex-1 text-center md:hidden"> 
                        <h2 class="font-semibold text-lg mb-2 text-orange-500">{product.type}</h2>
                        <p class="text-base mb-2">{product.description}</p>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
