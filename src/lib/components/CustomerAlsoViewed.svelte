<script>
    import { onMount } from 'svelte';
    import { cartState } from '$lib/stores/cartStores.js'
    import Icon from '@iconify/svelte';
    import heartOutline from '@iconify-icons/mdi/heart-outline'; 
    import heartFilled from '@iconify-icons/mdi/heart'; 

    export let fetchedProducts;
    
    let currentIndex = 0; 
    let logosPerSlide = 4; 
    let products = fetchedProducts;
    const repeatedProducts = [...products];
    let totalSlides = Math.ceil(repeatedProducts.length / logosPerSlide);
    let showModal = false;
    let isFavorite = false;
    let showSuccessMessage = false;
    let selectedProduct = {};
    let quantity = 1;
    const itemsToAdd = logosPerSlide - (repeatedProducts.length % logosPerSlide);
    for (let i = 0; i < itemsToAdd; i++) {
        repeatedProducts.push(products[i % products.length]);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
    }

    function transformPriceSizeToObject(priceSize) {
        if (Array.isArray(priceSize) && priceSize.length > 0) {
            const { price, size } = priceSize[0]; 
            return { price, size }; 
        }
        return priceSize; 
    }

    function openModal(product) {
        selectedProduct = {
            ...product,
            priceSize: transformPriceSizeToObject(product.priceSize)
        };
        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
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

        totalSlides = Math.ceil(repeatedProducts.length / logosPerSlide);
        currentIndex = Math.min(currentIndex, totalSlides - 1);
    }

    function toggleFavorite() {
        isFavorite = !isFavorite; 
    }

    function addToCart() {
        cartState.update(items => {
            const existingItemIndex = items.findIndex(item => item.partNumber === selectedProduct.partNumber);

            if (existingItemIndex !== -1) {
                items[existingItemIndex].quantity += quantity;
            } else {
                items = [...items, { ...selectedProduct, quantity }];
            }

            return items;
        });
        showSuccessMessage = true; 
        setTimeout(() => {
            showSuccessMessage = false;
            closeModal();
        }, 3000);
    }

    onMount(() => {
        updateLogosPerSlide();
        window.addEventListener('resize', updateLogosPerSlide);

        return () => {
            window.removeEventListener('resize', updateLogosPerSlide);
        };
    });
</script>

<h2 class="font-bold text-primary-500 mt-4 ml-12">Customer Also Viewed</h2>

<div class="relative mt-1">
    <div class="flex items-center">
        <button on:click={prevSlide} class="text-primary-500 rounded-full p-2 transition hover:bg-primary-100">‹‹</button>

        <div class="overflow-hidden flex-1">
            <div
                class="flex transition-transform duration-300"
                style={`transform: translateX(-${currentIndex * 100}%)`}
            >
                {#each repeatedProducts as { image, brand, partNumber, name, description, priceSize, quantity}}
                    <div class="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden p-2 flex flex-col h-full">
                            
                            <div class="flex flex-grow">
                                
                                <div class="w-20 h-20 object-contain mr-3 flex-shrink-0">
                                    <img src={image} alt={name} class="object-cover w-full h-full rounded-lg" />
                                </div>
                                
                                <div class="flex flex-col justify-between flex-grow">
                                    <p class="font-semibold text-gray-600">{brand}</p>
                                    <p class="text-primary-500 font-semibold">{partNumber}</p>
                                    <p class="text-gray-800 font-semibold">
                                        <span class="block">{name}<sup class="font-semibold">®</sup></span>
                                        </p>
                                    <p class="text-gray-600 text-sm flex-grow">{description}</p>
                                </div>
                            </div>
                            
                            <button 
                                on:click={() => openModal({ image, brand, partNumber, name, description, priceSize, quantity})} 
                                class="w-full text-primary-500 py-2 mt-3 rounded border border-primary-500 hover:bg-primary-500 hover:text-white transition flex items-center justify-center"
                            >
                                View Price & Availability
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <button on:click={nextSlide} class="text-orange-500 rounded-full p-2 ml-2 transition hover:bg-orange-100">››</button>
    </div>

    <div class="flex justify-center mt-4">
        {#each Array(totalSlides).fill(0) as _, slideIndex}
            <button 
                on:click={() => (currentIndex = slideIndex)} 
                class={`w-2 h-2 rounded-full mx-1 transition ${currentIndex === slideIndex ? 'bg-orange-500' : 'bg-gray-400 hover:bg-gray-600'}`}
            ></button>
        {/each}
    </div>
</div>

{#if showModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md sm:max-w-md w-full relative border border-primary-100">
            <button class="absolute top-3 right-3 text-primary-400 hover:text-primary-600 text-3xl font-medium" on:click={closeModal} aria-label="Close">&times;</button>

            {#if showSuccessMessage}
                <div class="text-green-500 p-0 mb-4 z-50">
                    Item added to cart successfully!
                </div>
            {/if}
            
            <!-- <p class="mt-8 text-sm text-gray-600 border-2 rounded p-2 text-center mb-6 border-green-600">
                <a href="/login" class="text-primary-500 hover:underline">Sign In</a> to view organizational & contact pricing.
            </p> -->

            <div class="flex flex-col sm:flex-row mt-8">
                <img src={selectedProduct.image} alt={selectedProduct.name} class="w-28 h-28 rounded-lg mr-4 sm:mr-6 mb-4 sm:mb-0 object-cover" />
                
                <div class="flex-1">
                    <p class="text-sm md:text-md font-semibold text-gray-500">{selectedProduct.brand}</p>
                    <p class="text-sm md:text-lg font-semibold text-primary-500">{selectedProduct.partNumber}</p>
                    <h3 class="text-sm md:text-lg font-bold text-black">{selectedProduct.name}®</h3>
                    <p class="text-sm md:text-md text-gray-600">Volume: {selectedProduct.quantity}</p>
                </div>
            </div>

            <div class="mt-4">
                <div class="flex items-center justify-between">
                    <!-- <p class="text-lg">SKU: {selectedProduct.sku}</p> -->
                    <!-- <button 
                        on:click={toggleFavorite} 
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        class={`py-2 px-2 rounded-full transition-all duration-500 ease-in-out relative overflow-hidden ${isFavorite ? 'bg-white' : 'bg-transparent'}`}
                    >
                    <Icon 
                      icon={isFavorite ? heartFilled : heartOutline} 
                      width="28" 
                      height="28" 
                      class={`transition-colors duration-500 ease-in-out ${isFavorite ? 'text-primary-500' : 'text-primary-500'}`} 
                    />
                  </button> -->
                </div> 
                <hr class="my-2 border-gray-300" />

                <div class="flex items-center justify-between w-full">
                    <span class="rounded-full px-5 py-1 inline-block border text-primary-500 bg-orange-50 border-primary-400 text-sm">
                        {selectedProduct.partNumber}
                    </span>
                        <p class="text-lg font-semibold text-black md:text-md">
                            {#if selectedProduct.priceSize && selectedProduct.priceSize.price}
                                <div class="text-primary-500">
                                    {selectedProduct.priceSize.price} for {selectedProduct.priceSize.size}
                                </div>
                            {:else}
                                <span class="text-gray-500">No price available</span>
                            {/if}
                        </p>
                </div>

                <form class="mt-4 flex flex-col md:flex-row md:items-center">
                    <div class="flex justify-between items-center w-full mb-2 md:mb-0">
                        <div class="flex items-center border border-primary-400 rounded-md overflow-hidden bg-primary-50 mr-2 text-md py-1 px-1 w-32 h-8">
                            <button type="button" on:click={() => quantity > 1 && (quantity--)} class="px-3 text-primary-500 hover:bg-primary-100">–</button>
                            <input id="quantity" value={quantity} min="1" on:input={updateQuantity} class="text-center w-12 p-1 border-none outline-none h-full bg-primary-50" />
                            <button type="button" on:click={() => quantity++} class="px-3 text-primary-500 hover:bg-primary-100">+</button>
                        </div>
                    
                        <div class="lg:ml-32 sm:ml-12">
                            <button type="submit" on:click={addToCart} class="text-primary-500 border border-primary-500 hover:bg-primary-400 hover:text-white transition py-1 px-4 rounded-md font-semibold text-md w-32 h-8">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    <!-- <div class="mt-2 md:mt-0 md:flex md:justify-end w-10/12 ml-4">
                        <a href="/check-availability" class="text-primary-500 hover:underline text-xl md:text-sm block text-center">
                            Check Availability
                        </a>
                    </div> -->
                </form>

                <!-- <div class="flex items-center mt-2">
                    <Icon icon="teenyicons:tick-circle-outline" class="text-primary-500 mr-2" />
                    <p class="text-gray-600 text-sm md:text-base ml-1 flex-1">
                        <span class="font-medium">Estimated</span> to ship on {selectedProduct.estimatedShipping} from <span class="font-medium">{selectedProduct.warehouse}</span>
                    </p>
                </div> -->
            </div>
        </div>
    </div>
{/if}
