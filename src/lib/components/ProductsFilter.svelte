<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
   
   
    export let data;
     let products = data?.records || [];
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
    let isLoggedIn = false;
    let loading = false;
    let  showSearchDropdown=false;
    let showCategoryDropdown=false;
    let showManufacturerDropdown=false;
    let currentProduct = null;

    onMount(() => {
        const userEmail = getCookieValue('userEmail');
    isLoggedIn = !!userEmail; 
    if (isLoggedIn) {
        email = userEmail; 
    }
        initializeProducts();
    });

    function initializeProducts() {
        allProducts = products; 
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
        const userEmail = getCookieValue('userEmail');

        if (!userEmail) {
            showModal = true;
        } else {
            
            showModal = true;
            //console.log(`Product at index ${index} has been ${isFavorited[index] ? 'added to' : 'removed from'} favorites.`);
        }
    }
    
    let isAddingToFavorites = false; 

function viewFavourites(product) {
  
    if (isAddingToFavorites) return;

    isAddingToFavorites = true; 
  //  console.log('Adding Product:', product); 

    
    const fav = JSON.parse(localStorage.getItem('fav')) || [];
   // console.log('Current Favorites:', JSON.stringify(fav, null, 2));
   // console.log('Number of Favorites:', fav.length);

  
    const existingProductIndex = fav.findIndex(item => item.id === product.id);
    
    if (existingProductIndex === -1) {
        // If not, add the product to the favorites
        fav.push(product);
        localStorage.setItem('fav', JSON.stringify(fav));
       // alert(`${product.productName} has been added to favourites!`);
    }
   
    isAddingToFavorites = false;

   
    window.location.href = 'favourites'; 
}
function closeModal() {
        showModal = false;
    }

    function showSDSDetails(product) {
        selectedProduct = product;
        showSDSModal = true; 
    }

    function closeSDSModal() {
        showSDSModal = false;
        selectedProduct = null; 
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

    function incrementQuantity(index) {
        products[index].quantity = (products[index].quantity || 0) + 1;
    }

    function decrementQuantity(index) {
        if (products[index].quantity > 0) {
            products[index].quantity--;
        }
    }

    function toggleManufacturer(manufacturer) {
        selectedManufacturers.has(manufacturer) ? selectedManufacturers.delete(manufacturer) : selectedManufacturers.add(manufacturer);
        currentPage = 1; 
        updateDisplayedProducts();
    }

    function validateLogin() {
        if (email && password) {
            isLoggedIn = true; 
            setCookie("userEmail", email, 7); 
            showModal = false; 
           
        } else {
            alert('Please enter valid credentials.');
        }
    }

    function downloadPDF(url) {
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
        alert(`${product.productName} has been added to the cart!`);
    }




// // manual setting cookies

//     function setCookie(name, value, days) {
//         if (typeof document === 'undefined') return; // Check if running in SSR
//         let expires = "";
//         if (days) {
//             const date = new Date();
//             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//             expires = "; expires=" + date.toUTCString();
//         }
//         document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
//         console.log(`Cookie set: ${name}=${value}; Expires in: ${days} days`);
//     }

//   setCookie("userEmail","123@gmail.com", 7);
    
   
function getCookieValue(cookieName) {
    if (typeof window === 'undefined') {
        return null; 
    }
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
   
}

// const userEmail = getCookieValue('userEmail');
// //console.log(userEmail);


</script>
<div  class="p-4 flex flex-col lg:flex-row ">
    <!-- Filters for smaller devices -->
    <div class="w-full    lg:hidden  mb-4 md:mb-0">
        <div class=" border md:ml-10 md: mb-5 flex flex-col border-gray-300 rounded-lg shadow-md p-4 w-full">
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
 <div class="w-full  md:ml-10 md:w-full lg:w-full md:mr-4 flex flex-col">
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
                <div class="border rounded-lg p-4 shadow-lg flex flex-col relative">
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
                        class="w-[100px] h-[170px] sm:w-[110px] sm:h-[130px] md:w-[140px] md:h-[160px] lg:w-[130px] lg:h-[130px] xl:w-35 xl:h-35  rounded" />

                        <div class="flex-grow ml-5">
                            <p class="text-gray-600 mt-1 "><strong>Code:</strong> {product.productNumber}</p>
                            <p class="text-gray-600 mt-1 "><strong>Manufacturer:</strong> {product.manufacturerName}</p>
                            <p class="text-gray-600 mt-1"><strong>Category:</strong> {product.categoryName}</p>
                            <p class="text-gray-600 md:block hidden"><strong>Description:</strong> {product.prodDesc}</p>
                            <div class="flex flex-col md:flex-row items-start justify-between mt-2">
                                <div class="flex items-center mb-2 md:mb-0">
                                    <Icon icon="mdi:file-document" class="text-primary-400 w-4 h-4 mr-1" />
                                    <button 
                                        on:click={() => showCoADetails(product)} 
                                        class="text-primary-400 rounded" 
                                        aria-label="View Certificate of Analysis for {product.productName}">CoA</button>
                                    <Icon icon="mdi:file-document" class="text-primary-400 w-4 h-4 mr-1 ml-5" />
                                    <button 
                                        on:click={() => showSDSDetails(product)} 
                                        class="text-primary-400 rounded" 
                                        aria-label="View Safety Data Sheet for {product.productName}">SDS</button>
                                        <div class="flex flex-col md:flex-row lg:flex-row items-start justify-between ">
                                            <div class="hidden md:flex items-center">
                                                <p class="text-gray-600 font-bold inline-block lg:ml-40">Price: </p>
                                                <p class="text-gray-600 text-lg inline-block">{product.priceSize[0].price}</p>
                                                
                                                <!-- <p class="mr-5  text-gray-600 "><strong>Size:</strong> {product.priceSize[0].size}</p>  -->
                                                <div class="flex items-center w-full lg:ml-5 ">
                                                    <div class="border text-primary-400 flex items-center py-1 rounded">
                                                        <button 
                                                            on:click={() => decrementQuantity(index)} 
                                                            class="font-bold w-8 h-8 bg-gray-100 rounded hover:bg-primary-500 hover:text-white">-</button>
                                                        <input 
                                                            type="text" 
                                                            class="w-10 h-8 text-center rounded text-base border-none bg-gray-100 mx-1" 
                                                            value={product.quantity || 1} 
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
                            </div>
                       
                           
                        </div>
                        
                    </div>
                   
                    <!-- Smaller -->
    <div class="flex flex-col items-center justify-between md:hidden mt-2 mx-5">
    <div class="flex justify-between items-center mb-2 w-full">
        <p class="text-gray-600"><strong>Price:</strong> {product.priceSize[0].price}</p>
        <!-- <p class="text-gray-600 ml-2"><strong>Size:</strong> {product.priceSize[0].size}</p> -->
    </div>

    <div class="flex items-center justify-between w-full mb-2">
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
</div>

                    
                </div>
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

 

            {#if showModal}
            {#if isLoggedIn}
            {#each allProducts as product}
            <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
                <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                    <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                    <h2 class="text-xl font-bold mb-1 text-center">Item added to your favourites!</h2>
                <p class="mb-4 text-center">You can continue shopping or view your favourites.</p>
                <p class="mb-4 text-center">
                    <span class="font-bold">{product.productName}</span> is added to the favourites
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
            {/each}
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
          

    {#if showSDSModal}
    
    <div class="fixed inset-0 flex items-center justify-center bg-neutral-50 bg-opacity-20">
        <div class="bg-white rounded-lg p-6 w-10/12 md:w-5/12 lg:w-4/12 relative"> 
            <button
                on:click={closeSDSModal}
                class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                aria-label="Close">
                <Icon icon="mdi:close" class="text-xl" />
            </button>
            <h2 class="text-xl font-bold mb-4 text-center">Safety Data Sheet</h2>
            {#if selectedProduct}
                <p class="text-center">
                    <strong>Pack Size:</strong>
                    <span class="border p-2 inline-block rounded bg-gray-100 ml-2">
                        {selectedProduct.priceSize[0].size}
                    </span></p>
                
                <div class="flex items-center justify-center mt-5">
                    <span class="font-semibold text-primary-400">{selectedProduct.productName}</span>
                    <span on:click={() => downloadPDF(selectedProduct.safetyDatasheet)} class="cursor-pointer">
                        <Icon icon="mynaui:download" class="text-primary-400 w-8 h-8 text-2xl" />
                    </span>
                </div>
                {/if} 
            </div>
            
            </div>
          
          
                {/if}

                <!---------COAA-->
               
            </div>