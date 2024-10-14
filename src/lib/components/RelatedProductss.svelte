<script>
    import { onMount } from 'svelte';
    import products from '$lib/data/products.json'; 

    let currentIndex = 0;
    let logosPerSlide = 4; 
    let logos = products;
    const repeatedLogos = [...logos, ...logos];
    let totalSlides;

    let showModal = false;
    let selectedProduct = {};
    let quantity = 1;

    function updateLogosPerSlide() {
        if (window.innerWidth < 640) {
            logosPerSlide = 1;
        } else if (window.innerWidth < 768) {
            logosPerSlide = 2;
        } else {
            logosPerSlide = 4;
        }
        totalSlides = Math.ceil(repeatedLogos.length / logosPerSlide);
        currentIndex = Math.min(currentIndex, totalSlides - 1);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
    }

    function openModal(product) {
        selectedProduct = product;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    function updateQuantity(event) {
        quantity = event.target.value;
    }

    onMount(() => {
        updateLogosPerSlide();
        window.addEventListener('resize', updateLogosPerSlide);
        return () => {
            window.removeEventListener('resize', updateLogosPerSlide);
        };
    });
</script>

<!-- Slider -->
<h2 class="font-bold text-orange-500 mt-4">Related Products</h2>

<div class="relative mt-1">
    <div class="overflow-hidden">
        <div
            class="flex transition-transform duration-300"
            style={`transform: translateX(-${(currentIndex * (100 / logosPerSlide))}%)`}
        >
            {#each Array(totalSlides).fill(0) as _, slideIndex}
                <div class="flex-shrink-0 w-full ml-4 flex gap-6 p-1 ">
                    {#each repeatedLogos.slice(slideIndex * logosPerSlide, (slideIndex + 1) * logosPerSlide) as { src, brand, id, name, category, price, estimatedShipping, warehouse, volume, sku }}
                        <div class="flex-1 min-w-[200px] w-full sm:max-w-[calc(50%-24px)] lg:max-w-[calc(25%-24px)]">
                            <div class="flex flex-col w-full bg-white rounded-lg shadow-lg overflow-hidden">
                                <div class="flex items-center p-2">
                                    <img src={src} alt={name} class="w-20 h-20 object-contain" />
                                    <div class="ml-2 text-left flex-1">
                                        <p class="font-semibold">{brand}</p>
                                        <p class="text-gray-600 text-sm">{id}</p>
                                        <p class="text-gray-800">{name}</p>
                                        <p class="text-gray-800">{category}</p>
                                    </div>
                                </div>
                                <button 
                                    on:click={() => openModal({ src, brand, id, name, price, estimatedShipping, warehouse, volume, sku })} 
                                    class="w-11/12 max-w-xs text-orange-500 ml-3 py-2 rounded border border-orange-500 hover:bg-orange-500 hover:text-white transition p-2 mb-4"
                                >
                                    View Price & Availability
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    
     <!-- Separate button container -->
<div class="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 z-10 ">
    <button on:click={prevSlide} class=" text-orange-500 rounded-full p-2   transition">‹‹</button>
    <button on:click={nextSlide} class=" text-orange-500 rounded-full p-2   transition">››</button>
</div>

   

    <!-- Slide Indicator -->
    <div class="flex justify-center mt-4 relative z-10">
        {#each Array(totalSlides).fill(0) as _, slideIndex}
            <button on:click={() => (currentIndex = slideIndex)} class={`w-1.5 h-1.5 rounded-full mx-1 bg-gray-400 hover:bg-gray-600 ${currentIndex === slideIndex ? 'bg-gray-800' : ''}`}></button>
        {/each}
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg lg:max-w-2xl w-full relative">
            <button class="absolute top-3 right-3 text-black text-2xl" on:click={closeModal} aria-label="Close">&times;</button>
            <div class="flex flex-col sm:flex-row">
                <img src={selectedProduct.src} alt={selectedProduct.name} class="w-28 h-28 mr-4 sm:mr-6 mb-4 sm:mb-0" />
                <div class="flex-1">
                    <p class="text-gray-700 font-semibold">{selectedProduct.brand}</p>
                    <h3 class="text-lg font-bold">{selectedProduct.name}</h3>
                    <p class="text-gray-600">Volume: {selectedProduct.volume}</p>
                    <p class="mt-4 text-sm text-gray-600 border bg-orange-100 p-2">
                        <a href="/sign-in" class="text-orange-500 hover:underline">Sign In</a> to view organizational & contact pricing.
                    </p>
                    <p class="text-lg mt-3">SKU</p>
                    <hr class="my-2 border-gray-300" />
                    <span class="bg-gray-100 rounded-lg p-2 inline-block border border-orange-400">
                        <p class="m-0">{selectedProduct.id}</p>
                    </span>
                    <p class="text-xl font-semibold text-black mt-3">Price: {selectedProduct.price}</p>
                    <p class="text-gray-600">Estimated to ship on {selectedProduct.estimatedShipping} from <span class="font-medium">{selectedProduct.warehouse}</span></p>

                    <form class="mt-4 flex items-center flex-wrap">
                        <label for="quantity" class="block text-sm font-medium mr-2">Quantity:</label>
                        <input type="number" id="quantity" value={quantity} min="1" on:input={updateQuantity} class="border border-gray-300 rounded-md shadow-sm p-2 w-20" />
                        <button type="submit" class="ml-2 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition">Add to Cart</button>
                    </form>

                    <a href="/check-availability" class={`mt-2 ${quantity > 1 ? 'text-orange-500' : 'text-gray-500'} hover:underline`}>
                        Check Availability
                    </a>
                </div>
            </div>
        </div>
    </div>
{/if}
 



