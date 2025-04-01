<script>
    import Icon from '@iconify/svelte';
</script>
<div class="w-ful sm:w-11/12 mx-auto py-12 max-w-7xl ">
    <section class="flex items-center justify-center flex-wrap-reverse md:flex-nowrap gap-4 mx-3 sm:mx-0">
        <div class="text-left mx-2 w-full md:w-1/2">
            <h1 class="my-2 sm:m-0 md:mt-14 sm:mt-10 font-bold md:text-3xl text-2xl">
                Empowering Science with Quality Chemicals.
            </h1>
            <p class="my-2 text-gray-400 text-xs md:text-base font-medium text-justify">
                Welcome to Chemikart, your premier destination for high-quality chemicals and laboratory supplies.
            </p>
            <div class="flex md:justify-start justify-center gap-8 mt-3">
                <a
                href="/products"
                class="flex text-sm sm:px-12 px-10 justify-center items-center font-medium rounded-md bg-primary-400 text-gray-100 hover:bg-primary-500 sm:py-2.5 py-2 transition-all duration-300">
                Shop Now
                <Icon icon="zondicons:cheveron-right" class=" text-lg"/>
            </a>
            <!-- <a href="/products" 
                class="px-6 rounded border border-primary-500 text-primary-400 bg-primary-50 text-xs py-2 font-semibold hover:bg-primary-500 hover:text-primary-50 transition-all duration-300 " >
                View All
            </a> -->
        </div>
        </div>
            <div class="mx-4 w-7/12 md:w-5/12">
                <img 
                    src="/hero.webp"
                    class="w-full "  
                    alt="CHEMIKART" />
            </div>
    </section>
</div>