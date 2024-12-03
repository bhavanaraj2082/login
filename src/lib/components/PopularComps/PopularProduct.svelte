<script>
    import Icon from "@iconify/svelte";
    import ProductCard from "$lib/components/PopularComps/ProductCard.svelte";
    export let PopularProducts;
</script>

<section class="w-11/12 mx-auto py-12 max-w-7xl rounded-lg">
    <div class="flex flex-wrap w-full justify-between py-6">
        <div class="sm:w-3/6 w-full">
            <h1 class="text-xl font-bold pb-4">Most Popular Products</h1>
            <p class="text-xs md:text-sm">
                Choose Chemikart for your chemical needs and experience the
                difference that quality and service can make in your scientific
                endeavors.
            </p>
        </div>
        <div
            class="flex items-center gap-2">
            <a
                href="/products"
                class="flex text-sm justify-center items-center font-medium rounded-md bg-primary-400 text-gray-100 px-10 hover:bg-primary-500 p-2">
                View All
                <Icon icon="zondicons:cheveron-right" class=" text-lg"/>
            </a>
        </div>
    </div>
    <div
        class="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {#each PopularProducts as {product}}
            <ProductCard {product} />
        {/each}
    </div>
</section>
