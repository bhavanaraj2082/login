<script>
    export let data;
    const subcategories = data.records
</script>

<div>
    <div class="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        <div class="pl-4">
            <p class="mt-2 text-base text-content">
                Precision-driven laboratory chemicals perfect for research, analysis, and experiments, with top-tier quality and reliability.
            </p>
        </div>
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {#each subcategories as subcategory}
                <div class="bg-white shadow-lg rounded-md overflow-hidden">
                    <img src="/image/category.jpeg" alt="img" class="w-full h-44 object-cover" />
                    <div class="p-4">
                        <a href="/products/{subcategory.expand.category.urlName}/{subcategory.urlName}">
                            <h3 class="text-lg font-semibold text-heading hover:underline">{subcategory.name}</h3>
                        </a>
                    </div>
                </div>
            {/each} 
        </div>
    </div>
</div>