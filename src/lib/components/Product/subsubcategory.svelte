<script>
    export let data;
    const subsubcategories = data.records
</script>

<div>
    <div class="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        <div class="pl-4">
            <p class="mt-2 text-base text-content">
                Powerful cleaning solutions for industrial, commercial, and household needs, formulated to meet high hygiene and safety standards.
            </p>
        </div>
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {#each subsubcategories as subsubcategory}
                <div class="bg-white shadow-lg rounded-md overflow-hidden">
                    <img src="/image/category.jpeg" alt="img" class="w-full h-44 object-cover" />
                    <div class="p-4">
                        <a href="/products/{subsubcategory.expand.category.urlName}/{subsubcategory.expand.subCategory.urlName}/{subsubcategory.urlName}">
                            <h3 class="text-lg font-semibold text-heading hover:underline">{subsubcategory.name}</h3>
                        </a>
                    </div>
                </div>
            {/each} 
        </div>
    </div>
</div> 