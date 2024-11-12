<script>
    export let data;
    const categories = data.records
</script>

<div>
    <div class="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        <div class="pl-4">
            <h2 class="text-3xl font-bold text-primary-500">Our Category</h2>
            <p class="mt-2 text-base text-content">
                Explore our high-quality chemical products, designed to meet the demands of innovation, safety, and performance across various industries
            </p>
        </div>
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {#each categories as category}
                <div class="bg-white shadow-lg rounded-sm overflow-hidden">
                    <img src="image/category.jpeg" alt="img" class="w-full h-44 object-cover" />
                    <div class="p-4">
                        <a href="/products/{category.urlName}">
                            <h3 class="text-lg font-semibold text-heading hover:underline">{category.name}</h3>
                        </a>
    
                    </div>
                </div>
            {/each} 
        </div>
    </div>
</div>