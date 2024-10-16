<script>
    import { onMount } from 'svelte';
    import products from '$lib/data/products.json'; 

    let currentIndex = 0; 
    let logosPerSlide = 4; 
    let logos = products;
    const repeatedLogos = [...logos];
    let totalSlides = Math.ceil(repeatedLogos.length / logosPerSlide);
    let showModal = false;
    let selectedProduct = {};
    let quantity = 1;
    let id={};

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

   
    function updateLogosPerSlide() {
        if (window.innerWidth < 640) { 
            logosPerSlide = 1;
        } else if (window.innerWidth < 768) { 
            logosPerSlide = 2;
        } else if (window.innerWidth < 1024) { 
            logosPerSlide = 3;
        } else { 
            logosPerSlide = 4;
        }
        
        totalSlides = Math.ceil(repeatedLogos.length / logosPerSlide);
        currentIndex = Math.min(currentIndex, totalSlides - 1);
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
<h2 class="font-bold text-orange-500 mt-4 ml-12">Related Products</h2>

<div class="relative mt-1">
    <div class="flex items-center">
        <button on:click={prevSlide} class="text-orange-500 rounded-full p-2 transition">‹‹</button>

        <div class="overflow-hidden flex-1">
            <div
                class="flex transition-transform duration-300"
                style={`transform: translateX(-${(currentIndex * 100) / logosPerSlide}%)`} 
            >
                {#each repeatedLogos as { src, brand, id, name1, name2, category, price, estimatedShipping, warehouse, volume, sku }}
                    <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-1">
                        <div class="flex flex-col w-full bg-white rounded-lg shadow-lg overflow-hidden">
                            <div class="flex items-center p-2">
                                <img src={src} alt={name1} class="w-20 h-20 object-contain" />
                                <div class="ml-2 text-left flex-1">
                                    <p class="font-semibold">{brand}</p>
                                    <p class=" text-gray-800 font-semibold">{id}</p>
                                    <p class="text-gray-800 font-semibold">{name1}<sup class="font-semibold">®</sup>{name2}</p>
                                    <p class="text-gray-800">{category}</p>
                                </div>
                            </div>
                            <button 
                                on:click={() => openModal({ src, brand, id, name1, name2, price, estimatedShipping, warehouse, volume, sku })} 
                                class="w-11/12 max-w-xs text-orange-500 ml-3 py-2 rounded border border-orange-500 hover:bg-orange-500 hover:text-white transition p-2 mb-4"
                            >
                                View Price & Availability
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <button on:click={nextSlide} class="text-orange-500 rounded-full p-2 ml-2 transition">››</button>
    </div>

    <div class="md:flex mt-2 lg:hidden justify-center">
        <div class="flex justify-center">
            <span class="text-sm text-gray-600">
                Slide {currentIndex + 1} of {totalSlides}
            </span>
        </div>
    </div>
    <!-- Slide Indicator -->
    <div class="flex justify-center mt-4 relative z-1">
        {#each Array(totalSlides).fill(0) as _, slideIndex}
            <button on:click={() => (currentIndex = slideIndex)} class={`w-1.5 h-1.5 rounded-full mx-1 bg-gray-400 hover:bg-gray-600 ${currentIndex === slideIndex ? 'bg-gray-800' : ''}`}></button>
        {/each}
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-70">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg lg:max-w-2xl w-full relative border border-orange-500">
            <button class="absolute top-3 right-3 text-black text-2xl" on:click={closeModal} aria-label="Close">&times;</button>
            <p class="mt-8 text-sm text-gray-600 border  p-2 text-center md:hidden">
                <a href="/sign-in" class="text-orange-500 hover:underline ">Sign In</a> to view organizational & contact pricing.
            </p>
            <div class="flex flex-col sm:flex-row">
                <img src={selectedProduct.src} alt={selectedProduct.name1} class="w-28 h-28 mr-4 sm:mr-6 mb-4 sm:mb-0" />
                <div class="flex-1">
                    <p class=" text-lg font-semibold">{selectedProduct.brand}</p>
                    <p class="  font-semibold text-orange-500">{selectedProduct.id}</p>
                    <h3 class="text-lg font-semibold">{selectedProduct.name1}<sup class="font-semibold">®</sup>{selectedProduct.name2}</h3>
                    <p class="text-gray-600">Volume: {selectedProduct.volume}</p>
                    <p class="mt-2 text-sm text-gray-600 border bg-orange-100 p-2 hidden md:block">
                        <a href="/sign-in" class="text-orange-500 hover:underline">Sign In</a> to view organizational & contact pricing.
                    </p>
                    <p class="text-lg mt-3">SKU</p>
                    <hr class="my-2 border-gray-300" />
                    <span class="rounded-lg px-5 inline-block border  text-orange-500 bg-orange-50 border-orange-400 text-sm">
                        <p class="m-0">{selectedProduct.id}</p>
                    </span>
                    <p class="text-xl font-semibold text-black mt-3  md:text-lg">Price: {selectedProduct.price}</p>
                    <p class="text-gray-600 text-sm md:text-base">Estimated to ship on {selectedProduct.estimatedShipping} from <span class="font-medium">{selectedProduct.warehouse}</span></p>

                    <form class="mt-4 flex items-center flex-wrap">
                        <label for="quantity" class="block text-xs font-medium mr-2">Quantity:</label>
                        <input type="number" id="quantity" value={quantity} min="1" on:input={updateQuantity} class="border border-gray-300 rounded-md shadow-sm p-1 w-20" />
                        <button type="submit" class="ml-2 border  border-orange-500 text-orange-500 py-1 px-2 rounded-md hover:bg-orange-600 hover:text-white transition text-sm md:py-2 md:px-4">Add to Cart</button>
                    </form>

                    <a href="/check-availability" class={`mt-2 ${quantity > 1 ? 'text-orange-500' : 'text-gray-500'} hover:underline text-xs md:text-sm`}>
                        Check Availability
                    </a>
                </div>
            </div>
        </div>
    </div>
{/if}
