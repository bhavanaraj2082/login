<script>
    export let data;
    const categories = data.records;
	// console.log("=======>cat",categories)
</script>

<div class="w-full mb-10 lg:px-8 md:w-11/12 mx-auto max-w-7xl">
    <div class="p-4 md:pl-0">
        <p class="mt-2 text-base text-content">
            Explore our high-quality chemical products, Classified into various categories, each playing a
            vital role in innovation and transformation.
        </p>
    </div>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0">
        {#each categories as category}
            {#if category.productCount > 0}
                <div class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300">
                    <div 
                        class="absolute inset-0 bg-gray-400 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none">
                    </div>
                    <a href="/products/{category.urlName}" class="block relative z-10">
                        <div class="relative">
                            <img 
                                src="/category/{category.name}.webp" 
                                alt="{category.name}" 
                                class="w-full h-60 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100" />
                        </div>
                        <div class="p-4">
                            <div class="flex justify-between items-center">
                                <h4 
                                    class="font-semibold text-sm text-gray-500 hover:underline truncate" 
                                    title="{category.name}"> 
                                    {category.name}
                                </h4>
                                {#if category.productCount}
                                    <span class="text-1s text-gray-400">
                                        ({category.productCount})
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </a>
                </div>
            {/if}
        {/each}
    </div>
</div>
