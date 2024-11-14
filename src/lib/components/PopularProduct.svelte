<script>
    import Icon from "@iconify/svelte";
    import ProductCard from "$lib/components/ProductCard.svelte";
    export let PopularProducts;
</script>

<section class="w-11/12 mx-auto py-12 max-w-7xl border rounded-lg p-8">
    <div class="flex flex-wrap w-full justify-between py-6">
        <div class="sm:w-3/6 w-full">
            <h1 class="text-xl font-bold pb-4">Most Popular Products</h1>
            <p class="text-xs">
                Choose Chemikart for your chemical needs and experience the
                difference that quality and service can make in your scientific
                endeavors.
            </p>
        </div>
        <div
            class="flex items-center justify-evenly sm:mr-10 mr-0 sm:mt-0 mt-2"
        >
            <a
                href="/products"
                class="flex text-sm justify-center items-center font-semibold rounded-md bg-primary-400 text-gray-100 px-4 p-2"
            >
                View All
                <Icon icon="formkit:right" width="1.2em" height="1.2em" />
            </a>
        </div>
    </div>
    <div
        class="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center"
    >
        {#each PopularProducts as { expand }}
            <ProductCard product={expand?.product} />
        {/each}
    </div>
</section>
