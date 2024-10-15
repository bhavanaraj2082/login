<script>
    import { onMount } from 'svelte';
    import productsData from '$lib/data/Subsubcategory.json';

    let category = [];

    onMount(() => {
        
        category = Array.isArray(productsData.products) ? productsData.products : [];
       // console.log(category); 
    });
</script>

<div class="container mx-auto px-4">
    <div class="flex flex-col">
        {#each category as product, index}
            <div class="flex flex-col md:flex-row bg-white p-6 shadow-sm transition-transform duration-300">
                {#if index % 2 === 0}
                    <img 
                        src={product.image_path} 
                        alt={product.type} 
                        class="w-full h-auto object-contain mb-4 md:mb-0 md:w-24 lg:w-1/4 mx-auto" 
                    />
                    <div class="flex-1 text-center md:text-left mt-4 md:mt-0 md:ml-4">
                        <h2 class="font-semibold text-lg mb-2 text-orange-500">{product.type}</h2>
                        <p class="text-base mb-2">{product.description}</p>
                    </div>
                {:else}
                    <div class="flex-1 text-center md:text-left mt-4 md:mt-0 md:mr-4">
                        <h2 class="font-semibold text-lg mb-2 text-orange-500">{product.type}</h2>
                        <p class="text-base mb-2">{product.description}</p>
                    </div>
                    <img 
                        src={product.image_path} 
                        alt={product.type} 
                        class="w-full h-auto object-contain mb-4 md:mb-0 md:w-24 lg:w-1/4 mx-auto" 
                    />
                {/if}
            </div>
        {/each}
    </div>
</div>
