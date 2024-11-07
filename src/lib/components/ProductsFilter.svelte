<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    import { authedUser } from '$lib/stores/solution_stores.js';

    export let data;
    let products = data?.data || [];
    let error = null;
    let currentPage = 1;
    const itemsPerPage = 5;
    let selectedProduct = null;
    let isFavorited = [];  
    let allProducts = products;
    let searchQuery = '';
    let selectedCategories = new Set();
    let selectedManufacturers = new Set();
    let categories = [];
    let manufacturers = [];
    let email = '';
    let password = '';
    let showFilters = false;
    let showModal = false;
    let showSDSModal = false;
    let showCOAModal = false;
    let isLoggedIn = false;
    let loading = false;
    let showSearchDropdown = false;
    let showCategoryDropdown = false;
    let showManufacturerDropdown = false;
    let indexToToggle = false;
   
    let modalOpenedForProduct = null;
    let loginError = ''; 
    let selectedPackSize='';
    let modalProduct = null;
    let cartNotification = ''; 
let notificationTimeout = null; 
   
    $: isLoggedIn = !!$authedUser.email;
   
    onMount(() => {
        if (isLoggedIn) {
            email = $authedUser.email; 
        }
        initializeProducts();
    });
   
    function initializeProducts() {
   
    allProducts = products.map(product => ({
        ...product, 
        quantity: product.quantity || 1 
    }));

 
    isFavorited = new Array(allProducts.length).fill(false);


    updateDisplayedProducts();


    extractCategories(allProducts);
    extractManufacturers(allProducts);
}


    function extractCategories(products) {
        categories = [...new Set(products.map(product => product.categoryName))];
    }

    function extractManufacturers(products) {
        manufacturers = [...new Set(products.map(product => product.manufacturerName))];
    }



function toggleFavorite(index) {
        const product = allProducts[index];
         isFavorited[index] = !isFavorited[index];
         modalProduct = product;
        showModal = true;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const existingProductIndex = favorites.findIndex(item => item.id === product.id);
    
        if (isFavorited[index] && existingProductIndex === -1) {
           
            favorites.push({ ...product, quantity: product.quantity || 1 });
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } else if (!isFavorited[index] && existingProductIndex !== -1) {
        
            favorites = favorites.filter(item => item.id !== product.id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    function closeModal() {
        showModal = false;
        modalOpenedForProduct = null; 
    }
    function closeSDSModal() {
        showSDSModal = false; 
        selectedProduct = null; 
    }
    function closeCOAModal() {
        showCOAModal = false; 
        selectedProduct = null; 
    }
 function viewFavourites() {
      
        window.location.href = '/favourites'; 
    }
function updateDisplayedProducts() {
        const filteredProducts = allProducts.filter(product => {
            const matchesSearch = searchQuery === '' || product.productName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.categoryName);
            const matchesManufacturer = selectedManufacturers.size === 0 || selectedManufacturers.has(product.manufacturerName);
            return matchesSearch && matchesCategory && matchesManufacturer;
        });

        products = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }
function changePage(direction) {
        const totalProducts = allProducts.filter(product => {
            const matchesSearch = searchQuery === '' || product.productName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.categoryName);
            const matchesManufacturer = selectedManufacturers.size === 0 || selectedManufacturers.has(product.manufacturerName);
            return matchesSearch && matchesCategory && matchesManufacturer;
        }).length;

        const totalPages = Math.ceil(totalProducts / itemsPerPage);

        if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
            updateDisplayedProducts();
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
            updateDisplayedProducts();
        }
    }
    function showSDS(product) {
        selectedProduct = product; 
        showSDSModal = true; 
    }
    function showCOA(product) {
        selectedProduct = product; 
        showCOAModal = true; 
    }

   

   
    function handleSearchChange(event) {
        searchQuery = event.target.value;
        currentPage = 1;
        updateDisplayedProducts();
    }


    function toggleCategory(category) {
        selectedCategories.has(category) ? selectedCategories.delete(category) : selectedCategories.add(category);
        currentPage = 1;
        updateDisplayedProducts();
    }


    function toggleManufacturer(manufacturer) {
        selectedManufacturers.has(manufacturer) ? selectedManufacturers.delete(manufacturer) : selectedManufacturers.add(manufacturer);
        currentPage = 1;
        updateDisplayedProducts();
    }

   
    function validateLogin() {
    if (email && password) {
        isLoggedIn = true;
        showModal = false;
        loginError = '';  
    } else {
      loginError = 'Please enter valid credentials.';
    }
}
function downloadPDFSDS(url) {
        if (!url) {
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = `SDS_${selectedProduct.productNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function downloadPDFCOA(url) {
        if (!url) {
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = `SDS_${selectedProduct.productNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += product.quantity || 1;
    } else {
        cart.push({ ...product, quantity: product.quantity || 1 });
    }


    localStorage.setItem('cart', JSON.stringify(cart));

  
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);


    cartNotification = `You have ${totalQuantity} item(s) in your cart.`;


    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        cartNotification = ''; 
    }, 3000);

    console.log(`${product.productName} has been added to the cart!`);
}
const incrementQuantity = (index) => {
        products = products.map((product, i) =>
            i === index ? { ...product, quantity: (product.quantity || 1) + 1 } : product
        );
    };

    const decrementQuantity = (index) => {
        products = products.map((product, i) =>
            i === index ? { ...product, quantity: Math.max(1, (product.quantity || 1) - 1) } : product
        );
    };

</script>

<div  class="p-4 flex flex-col lg:flex-row ">
    <!-- Filters for smaller devices -->
    <div class="w-full    lg:hidden  mb-4 md:mb-0">
        <div class=" border md:ml-10 md: mb-5 flex flex-col border-gray-300 rounded-lg shadow-md p-4 w-full">
           <!-- svelte-ignore a11y-click-events-have-key-events -->
           <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
           <h3 class="text-lg font-bold mb-2 text-gray-700 flex items-center" on:click={() => showFilters = !showFilters}>
                <Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
                Filters
            </h3>
            <hr class="border-gray-300 my-4" />
            {#if showFilters}
                <!-- Search Bar -->
                <div class="filter-group border border-gray-300 rounded mb-3">
                    <div class="flex items-center justify-between">
                        <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Search</h4>
                        <button class="text-primary-500" on:click={() => showSearchDropdown = !showSearchDropdown}>
                            <Icon icon={showSearchDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                        </button>
                    </div>
                    {#if showSearchDropdown}
                        <input
                            type="text"
                            placeholder="Search..."
                            class="border rounded p-2 items-center ml-4 w-10/12 text-sm"
                            on:input={handleSearchChange}
                        />
                    {/if}
                </div>
                <!-- Categories Filter -->
                <div class="filter-group border border-gray-300 rounded mb-3">
                    <div class="flex items-center justify-between">
                        <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Categories</h4>
                        <button class="text-primary-500" on:click={() => showCategoryDropdown = !showCategoryDropdown}>
                            <Icon icon={showCategoryDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                        </button>
                    </div>
                    <div class={showCategoryDropdown ? "space-y-2" : "hidden"}>
                        {#each categories as category}
                            <label class="flex items-center mb-2 ml-3 text-gray-600">
                                <input 
                                    type="checkbox" 
                                    on:change={() => toggleCategory(category)}
                                    checked={selectedCategories.has(category)}
                                />
                                <span class="ml-2">{category}</span>
                            </label>
                        {/each}
                    </div>
                </div>
            <!-- Manufacturers Filter -->
                <div class="filter-group border border-gray-300 rounded mb-3">
                    <div class="flex items-center justify-between">
                        <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Manufacturers</h4>
                        <button class="text-primary-500" on:click={() => showManufacturerDropdown = !showManufacturerDropdown}>
                            <Icon icon={showManufacturerDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                        </button>
                    </div>
                    <div class={showManufacturerDropdown ? "space-y-2" : "hidden"}>
                        {#each manufacturers as manufacturer}
                            <label class="flex items-center mb-2 text-gray-600 ml-3 text-sm">
                                <input 
                                    type="checkbox" 
                                    on:change={() => toggleManufacturer(manufacturer)}
                                    checked={selectedManufacturers.has(manufacturer)}
                                />
                                <span class="ml-2">{manufacturer}</span>
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
<!-- Filters for larger devices -->
 <div class="hidden md:hidden lg:w-1/3 lg:block mb-4 md:mb-0">
        <div class="filter-widget border border-gray-300 rounded-lg shadow-md p-4 w-full">
            <h3 class="text-lg font-bold mb-2 text-gray-700 flex items-center">
                <Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
                Filters</h3>
            <hr class="border-gray-300 my-4" />
            <!-- Search Bar -->
            <div class="filter-group border border-gray-300 rounded mb-3">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2 ">Search</h4>
                    <button class="text-primary-500" on:click={() => showSearchDropdown = !showSearchDropdown}>
                        <Icon icon={showSearchDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                    </button>
                </div>
                {#if showSearchDropdown}
                    <input
                        type="text"
                        placeholder="Search..."
                        class="border rounded p-2 items-center ml-4 mb-2 w-10/12 text-sm"
                        on:input={handleSearchChange}
                    />
                {/if}
            </div>

            <!-- Categories Filter -->
            <div class="filter-group border border-gray-300 rounded mb-3">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2 ">Categories</h4>
                    <button class="text-primary-500" on:click={() => showCategoryDropdown = !showCategoryDropdown}>
                        <Icon icon={showCategoryDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                    </button>
                </div>
                <div class={showCategoryDropdown ? "space-y-2" : "hidden"}>
                    {#each categories as category}
                        <label class="flex items-center mb-2 ml-3 text-gray-600 ">
                            <input 
                                type="checkbox" 
                                on:change={() => toggleCategory(category)}
                                checked={selectedCategories.has(category)}
                            />
                            <span class="ml-2">{category}</span>
                        </label>
                    {/each}
                </div>
            </div>
            <!-- Manufacturers Filter -->
            <div class="filter-group border border-gray-300 rounded mb-3">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2 ">Manufacturers</h4>
                    <button class="text-primary-500" on:click={() => showManufacturerDropdown = !showManufacturerDropdown}>
                        <Icon icon={showManufacturerDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
                    </button>
                </div>
                <div class= {showManufacturerDropdown ? "space-y-2" : "hidden"}>
                    {#each manufacturers as manufacturer}
                        <label class="flex items-center mb-2 text-gray-600 ml-3 text-sm">
                            <input 
                                type="checkbox" 
                                on:change={() => toggleManufacturer(manufacturer)}
                                checked={selectedManufacturers.has(manufacturer)}
                            />
                            <span class="ml-2">{manufacturer}</span>
                        </label>
                    {/each}
                </div>
            </div>
    </div>
    </div>
 <!-- Main Content -->
 <div class="w-full  md:ml-10  md:w-full lg:w-full md:mr-4 flex flex-col">
    {#if loading}
        <div class="flex items-center justify-center h-full">
            <div class="border-4 border-gray-300 border-t-primary-400 rounded-full w-10 h-10 animate-spin"></div>
            <h3 class="ml-4 text-lg">Loading...</h3>
        </div>
    {:else if error}
        <p class="text-red-500 text-center">Error: {error}</p>
    {:else if products && products.length === 0} 
        <p class="text-center">No products found.</p>
    {:else}
        <div class="flex flex-col space-y-4 flex-grow ">
            {#each products as product, index}
                <div class="border rounded-lg p-4 shadow-lg w-full flex flex-col relative">
                    <p class="text-md font-bold">{product.productName}</p>
                    <div class="relative">
                        <button
                            on:click={() => {
                                if (!isLoggedIn) {
                                    showModal = true;
                                    indexToToggle = index;
                                } else {
                                    toggleFavorite(index);
                                }
                            }}
                            class="absolute -top-8 right-0 bg-transparent border-none p-0"
                            aria-label="Toggle favorite">
                            <Icon 
                                icon={isFavorited[index] ? 'prime:heart-fill' : 'prime:heart'} 
                                class={`text-3xl ${isFavorited[index] ? 'text-primary-600' : 'text-primary-400'}`} />
                        </button>
                    </div>
                    <div class="flex items-start mt-4">
                        <img 
                        src={product.imageSrc}                          
                        alt={product.productNumber}  
                         class="w-24 h-40 sm:w-28 sm:h-32 md:w-36 md:h-40 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded" />


                        <div class="flex-grow ml-5">
                            <p class="text-gray-600 mt-1 "><strong>Code:</strong> {product.productNumber}</p>
                            <p class="text-gray-600 mt-1 "><strong>Manufacturer:</strong> {product.manufacturerName}</p>
                            <p class="text-gray-600 mt-1"><strong>Category:</strong> {product.categoryName}</p>
                            <p class="text-gray-600 md:block hidden"><strong>Description:</strong> {product.prodDesc}</p>
                            <div class="flex flex-col md:flex-row items-start justify-between mt-2">
                                <div class="flex items-center mb-2 md:mb-0">
                                    <Icon icon="mdi:file-document" class="text-primary-400 w-4 h-4 mr-1" />
                                    <button 
                                        on:click={() => showCOA(product)} 
                                        class="text-primary-400 rounded" 
                                        aria-label="View Certificate of Analysis for {product.productName}">CoA</button>
                                    <Icon icon="mdi:file-document" class="text-primary-400 w-4 h-4 mr-1 ml-5" />
                                    <button 
                                        on:click={() => showSDS(product)} 
                                        class="text-primary-400 rounded" 
                                        aria-label="View Safety Data Sheet for {product.productName}">SDS</button>
                                        <div class="flex flex-col md:flex-row lg:flex-row items-start justify-between ">
                                            <div class="hidden md:flex items-center">
                                                <p class="text-gray-600 font-bold inline-block lg:ml-16 md:ml-10">Price: </p>
                                                <p class="text-gray-600 text-lg inline-block">{product.priceSize[0].price}</p>
                                                
                                                <!-- <p class="mr-5  text-gray-600 "><strong>Size:</strong> {product.priceSize[0].size}</p>  -->
                                                <div class="flex items-center w-full lg:ml-3 md:ml-4 ">
                                                    <div class="border text-primary-400 flex items-center py-1 rounded">
                                                        <button 
                                                            on:click={() => decrementQuantity(index)} 
                                                            class="font-bold w-8 h-8 bg-gray-100 rounded hover:bg-primary-500 hover:text-white">-</button>
                                                        
                                                        <input 
                                                            type="text" 
                                                            class="w-10 h-8 text-center rounded text-base border-none bg-gray-100 mx-1" 
                                                            bind:value={products[index].quantity} 
                                                            readonly />
                                                        
                                                        <button 
                                                            on:click={() => incrementQuantity(index)} 
                                                            class="font-bold w-8 h-8 bg-gray-100 rounded hover:bg-primary-500 hover:text-white">+</button>
                                                    </div>
                                                    <button 
                                                        on:click={() => addToCart(product)} 
                                                        class="text-primary-400 hover:bg-primary-700 hover:text-white border border-primary-400 px-3 py-2 ml-4 rounded text-sm lg:ml-10">Add To Cart</button>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div></div>
                        </div>
                   <!-- Smaller -->
    <div class="flex flex-col items-center justify-between md:hidden mt-2 mx-5">
    <div class="flex justify-between items-center mb-2 w-full">
        <p class="text-gray-600"><strong>Price:</strong> {product.priceSize[0].price}</p>
       </div><div class="flex items-center justify-between w-full mb-2">
        <div class="border text-primary-400 flex items-center">
            <button 
                on:click={() => decrementQuantity(index)} 
                class="font-bold w-8 h-8 bg-gray-100 rounded hover:bg-primary-500 hover:text-white">-</button>
            <input 
                type="text" 
                class="w-8 h-8 text-center rounded text-base border-none bg-gray-100 mx-2" 
                value={product.quantity || 1} 
                readonly />
            <button 
                on:click={() => incrementQuantity(index)} 
                class="font-bold w-8 h-8 rounded bg-gray-100 hover:bg-primary-500 hover:text-white">+</button>
        </div>
        <button 
            on:click={() => addToCart(product)} 
            class="text-primary-400 hover:bg-primary-700 hover:text-white border border-primary-400 w-[70px] rounded text-sm ml-4">Add To Cart</button>
    </div>
</div></div>
            {/each}
        </div>
        <div class="flex justify-center mt-4 space-x-4">
            <button 
                on:click={() => changePage('prev')} 
                class={`bg-primary-400 text-white px-4 py-2 rounded ${currentPage === 1 ? 'disabled' : ''}`} 
                disabled={currentPage === 1 || loading}>
                Previous
            </button>
            <span class="flex items-center bg-primary-400 px-1   text-white text-sm"> {currentPage}</span>
            <button 
                on:click={() => changePage('next')} 
                class={`bg-primary-400 text-white px-4 py-2 rounded ${currentPage >= Math.ceil(allProducts.length / itemsPerPage) ? 'disabled' : ''}`} 
                disabled={currentPage >= Math.ceil(allProducts.length / itemsPerPage) || loading}>
                Next
            </button>
        </div>
    {/if}
</div>
{#if cartNotification}
    <div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
        {cartNotification}
    </div>
{/if}

 

            <!-- {#if showModal}
            {#if isLoggedIn}
         
            <div class="fixed inset-0 flex items-center justify-center bg-neutral-60 bg-opacity-20">
                <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                    <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                    <h2 class="text-xl font-bold mb-1 text-center">Item added to your favourites!</h2>
                <p class="mb-4 text-center">You can continue shopping or view your favourites.</p>
                <p class="mb-4 text-center">
                    <span class="font-bold">{products.productName}</span> is added to the favourites
                    </p>

                    <div class="flex justify-between">
                        <button 
                        on:click={closeModal} 
                        class="bg-primary-400 text-white p-2 mt-2 rounded w-1/3 mr-2 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                        Continue Shopping
                    </button>
                    <button 
                        on:click={() => viewFavourites(allProducts)} 
                        class="bg-primary-400 text-white p-2 rounded w-1/3 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                        View Favourites
                    </button>
                    
                    </div>
                </div>
            </div>
          
            {:else}
                <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
                    <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                        <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                            <Icon icon="mdi:close" class="text-xl" />
                        </button>
                        <h2 class="text-xl font-bold mb-1">Please login to continue</h2>
                        <label for="email" class="block font-bold text-gray-600 mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            class="border border-gray-300 p-2 rounded w-full"
                            bind:value={email}
                        />
                        <label for="password" class="block font-bold text-gray-600 mb-2 mt-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            class="border border-gray-300 p-2 rounded w-full"
                            bind:value={password}
                        />
                        <button on:click={validateLogin} class="bg-primary-400 text-white p-2 rounded w-full mt-4 mb-4">Login</button>
                        <div class="flex justify-between">
                            <a href="/" class="text-gray-500" on:click|preventDefault={closeModal}>Continue browsing</a>
                            <a href="/signup" class="text-primary-400">Register</a>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
            -->
        
            {#if showModal}
            {#if isLoggedIn}
                <div class="fixed inset-0 flex items-center justify-center bg-neutral-60 bg-opacity-20">
                    <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                        <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                            <Icon icon="mdi:close" class="text-xl" />
                        </button>
        
                        <h2 class="text-xl font-bold mb-1 text-center">
                            {#if isFavorited[allProducts.indexOf(modalProduct)]}
                                Item added to your favourites!
                            {:else}
                                Item removed from your favourites.
                            {/if}
                        </h2>
                        <p class="mb-4 text-center">You can continue shopping or view your favourites.</p>
                        <p class="mb-4 text-center">
                            <span class="font-bold">{modalProduct ? modalProduct.productName : 'Product'}</span> 
                            {#if isFavorited[allProducts.indexOf(modalProduct)]}
                                is added to the favourites.
                            {:else}
                                is removed from the favourites.
                            {/if}
                        </p>
        
                        <div class="flex justify-between">
                            <button on:click={closeModal} class="bg-primary-400 text-white p-2 mt-2 rounded w-1/3 mr-2 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                                Continue Shopping
                            </button>
                            <button on:click={viewFavourites} class="bg-primary-400 text-white p-2 rounded w-1/3 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                                View Favourites
                            </button>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
                    <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                        <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                            <Icon icon="mdi:close" class="text-xl" />
                        </button>
        
                        <h2 class="text-xl font-bold mb-1">Please login to continue</h2>
                        {#if loginError}
                            <p class="text-red-500 mb-2">{loginError}</p>
                        {/if}
                        
                        <label for="email" class="block font-bold text-gray-600 mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            class="border border-gray-300 p-2 rounded w-full"
                            bind:value={email}
                        />
                        
                        <label for="password" class="block font-bold text-gray-600 mb-2 mt-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            class="border border-gray-300 p-2 rounded w-full"
                            bind:value={password}
                        />
                        
                        <button on:click={validateLogin} class="bg-primary-400 text-white p-2 rounded w-full mt-4 mb-4">Login</button>
        
                        <div class="flex justify-between">
                            <a href="/" class="text-gray-500" on:click|preventDefault={closeModal}>Continue browsing</a>
                            <a href="/signup" class="text-primary-400">Register</a>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}
        
       
     {#if showSDSModal}
    
    <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
        <div class="bg-white rounded-lg p-6 w-11/12 md:w-5/12 lg:w-1/2 relative"> 
            <button
                on:click={ closeSDSModal}
                class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                aria-label="Close">
                <Icon icon="mdi:close" class="text-xl" />
            </button>
            <h2 class="text-xl font-bold mb-4 text-center">Safety Data Sheet</h2>
            {#if selectedProduct}
                <p class="text-center">
                    <strong>Pack Size:</strong>
                    <select bind:value={selectedPackSize} class="border p-2 inline-block rounded bg-gray-100 ml-2">
                        <!-- Placeholder option -->
                        <option value="" disabled selected>Select size</option>
                        {#each selectedProduct.priceSize as size}
                            <option value={size.size}>{size.size}</option>
                        {/each}
                    </select></p>
                
                <div class="flex items-center justify-center mt-5">
                    <span class="font-semibold text-primary-400">{selectedProduct.productName}</span>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <span on:click={() => downloadPDFSDS(selectedProduct.safetyDatasheet)} class="cursor-pointer">
                        <Icon icon="mynaui:download" class="text-primary-400 w-8 h-8 text-2xl" />
                    </span>
                </div>
                {/if} 
            </div>
            
            </div>
          
          
                {/if} 

                <!---------COAA---------->
                
                {#if showCOAModal}
    
                <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
                    <div class="bg-white rounded-lg p-6 w-11/12 md:w-5/12 lg:w-1/2 relative"> 
                        <button
                            on:click={ closeCOAModal}
                            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            aria-label="Close">
                            <Icon icon="mdi:close" class="text-xl" />
                        </button>
                        <h2 class="text-xl font-bold mb-4 text-center">Certificate of Analysis</h2>
                        {#if selectedProduct}
                            <p class="text-center">
                                <strong>Pack Size:</strong>
                                <select bind:value={selectedPackSize} class="border p-2 inline-block rounded bg-gray-100 ml-2">
                                    <option value="" disabled selected>Select size</option>
                                    {#each selectedProduct.priceSize as size}
                                        <option value={size.size}>{size.size}</option>
                                    {/each}
                                </select></p>
                            
                            <div class="flex items-center justify-center mt-5">
                                <span class="font-semibold text-primary-400">{selectedProduct.productName}</span>
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span on:click={() => downloadPDFCOA(selectedProduct.certicateofAnalysis)} class="cursor-pointer">
                                    <Icon icon="mynaui:download" class="text-primary-400 w-8 h-8 text-2xl" />
                                </span>
                            </div>
                            {/if} 
                        </div>
                        </div>
            {/if} 
         </div>