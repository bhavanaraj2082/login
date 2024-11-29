<script>
  import { onMount, createEventDispatcher } from 'svelte';
 
 import { enhance } from '$app/forms';
 
   import Icon from '@iconify/svelte';
   import { cartState } from '$lib/stores/cartStores.js';
   const dispatch = createEventDispatcher();
  
   export let data;
   let products=data.data ||[] ;
   console.log("I am Content",products.length);
   
   let allProducts = products; 
   let pageNumbersToShow = getPageNumbers();
  import { filteredProducts, currentPage,
     totalPages,   authedUser,
      loading, error,pproducts, 
     searchQuery, selectedManufacturers, selectedCategories ,getPageNumbers
   } from '$lib/stores/filter.js';
   
   let indexToToggle = false;
   let showSDSModal=false;
   let showCOAModal=false;
   const ITEMS_PER_PAGE = 5; 
   let selectedPackSize = '';
   let selectedProduct = null;
   let cartNotification = '';
   let favoriteNotification=''
   let notificationTimeout;
   let favoriteStatus;
 
   let loginError = '';
   let email = '';
   let password = '';
   let showModal = false;
   let modalProduct = null;
   let modalOpenedForProduct = null;
   $: isLoggedIn = !!$authedUser.email;
  
   let isFavorited = [];
  function updateFilteredProducts() {
   let filtered = Array.isArray(allProducts) ? [...allProducts] : [];
 
     const query = typeof $searchQuery === 'string' ? $searchQuery.toLowerCase() : '';
    
     if (query) {
       filtered = filtered.filter(product =>
         product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.productNumber.toLowerCase().includes(searchQuery.toLowerCase())
       );
     }
 
   
     if ($selectedCategories.size > 0) {
       filtered = filtered.filter(product =>
         Array.from($selectedCategories).some(category => product.categories.includes(category))
       );
     }
 
     if ($selectedManufacturers.size > 0) {
       filtered = filtered.filter(product =>
         Array.from($selectedManufacturers).some(manufacturer => product.manufacturer === manufacturer)
       );
     }
 
    
     filteredProducts.set(filtered);
   const totalFilteredProducts = filtered.length;
     const calculatedTotalPages = Math.ceil(totalFilteredProducts / ITEMS_PER_PAGE);
     totalPages.set(calculatedTotalPages);
   }
   function updateDisplayedProducts() {
    let filtered = $filteredProducts || [];
   const currentPageValue = $currentPage || 1;
   const startIndex = (currentPageValue - 1) * ITEMS_PER_PAGE;
   const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
 
 
   const paginatedProducts = filtered.slice(startIndex, endIndex);
 
 
   pproducts.set(paginatedProducts);
 }
 
 
 // async function loadNextPage(currentPage) {
 //     const result = await loadProductsubcategory(pb, suburl, currentPage);
 //     if (result.type === 'success') {
 //         // Append new products to the displayed list
 //         displayProducts(result.records);
 //         if (result.nextPage) {
 //             loadNextPage(result.nextPage); // Continue loading if nextPage exists
 //         }
 //     } else {
 //         console.error(result.message);
 //     }
 // }
 
 
 let loadNextPage = async (currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allProducts.length);
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    if (paginatedProducts.length > 0) {
      pproducts.update((prevProducts) => [...prevProducts, ...paginatedProducts]);
    }

    if (endIndex < allProducts.length) {
      loadNextPage(currentPage + 1);
    }
  };
 
   function closeSDSModal() {
       showSDSModal = false; 
       selectedProduct = null; 
   }
   function closeCOAModal() {
       showCOAModal = false; 
       selectedProduct = null; 
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
   function closeModal() {
       showModal = false;
       modalOpenedForProduct = null;
   }
   function showSDS(product) {
       selectedProduct = product; 
       showSDSModal = true; 
   }
   function showCOA(product) {
       selectedProduct = product; 
       showCOAModal = true; 
   }
   // function toggleFavorite(index) {
   //     const product = allProducts[index];
   //     isFavorited[index] = !isFavorited[index];
   //     modalProduct = product;
   //     showModal = true;
   //     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
   //     const existingProductIndex = favorites.findIndex(item => item.id === product.id);
 
   //     if (isFavorited[index] && existingProductIndex === -1) {
   //         favorites.push({ ...product, quantity: product.quantity || 1 });
   //         localStorage.setItem('favorites', JSON.stringify(favorites));
   //     } else if (!isFavorited[index] && existingProductIndex !== -1) {
   //         favorites = favorites.filter(item => item.id !== product.id);
   //         localStorage.setItem('favorites', JSON.stringify(favorites));
   //     }
   // }
 
 
   
  //  const incrementQuantity = (index) => {
  //      products = products.map((product, i) =>
  //          i === index ? { ...product, quantity: (product.quantity || 1) + 1 } : product
  //      );
  //  };
 
  //  const decrementQuantity = (index) => {
  //      products = products.map((product, i) =>
  //          i === index ? { ...product, quantity: Math.max(1, (product.quantity || 1) - 1) } : product
  //      );
  //  };


  const incrementQuantity = (index) => {
    products = products.map((product, i) => {
        if (i === index) {
            const newQuantity = (product.quantity || 1) + 1;
            updateLocalStorage(product.id, newQuantity);
            return { ...product, quantity: newQuantity };
        }
        return product;
    });
};

const decrementQuantity = (index) => {
    products = products.map((product, i) => {
        if (i === index) {
            const newQuantity = Math.max(1, (product.quantity || 1) - 1);
            updateLocalStorage(product.id, newQuantity); 
            return { ...product, quantity: newQuantity };
        }
        return product;
    });
};
function updateLocalStorage(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity = quantity;
    } 

    localStorage.setItem('cart', JSON.stringify(cart));
}
   function viewFavourites() {
     
     window.location.href = '/my-favourite'; 
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
 
 
 function changePage(direction) {
 let newPage = $currentPage;
  
     if (direction === 'next' && newPage <  $totalPages) {
       newPage++;
     } else if (direction === 'prev' && newPage > 1) {
       newPage--;
     } else if (typeof direction === 'number') {
       newPage = direction;
     }
      dispatch('pageChange', { newPage });
     const url = new URL(window.location);
     url.searchParams.set('page', newPage);
     window.history.pushState({}, '', url);
     
     currentPage.set(newPage);
     loadNextPage(newPage);
     updateDisplayedProducts();
     updatePageNumbersToShow($totalPages);
     scrollToTop();
 
  updateDisplayedProducts($filteredProducts);
     updatePageNumbersToShow($totalPages);
 }
 
 $: updateFilteredProducts();
 
 $: updateDisplayedProducts($filteredProducts);
 
 
 
 const filtered = $filteredProducts;
 
 
 
  
   $: updateDisplayedProducts($filteredProducts);
 
 
 $: updateDisplayedProducts();
 $: updatePageNumbersToShow($totalPages);
 
 
 function updatePageNumbersToShow() {
   const pageNumbers = [];
   const maxVisiblePages = 5; 
   const totalPageCount = $totalPages;
   const currentPageValue = $currentPage;
 
   if (totalPageCount <= maxVisiblePages) {
      
       for (let i = 1; i <= totalPageCount; i++) {
           pageNumbers.push(i);
       }
   } else {
     
       const startPage = Math.max(1, currentPageValue - 2);
       const endPage = Math.min(totalPageCount, currentPageValue + 2);
 
       if (startPage > 1) {
           pageNumbers.push(1);
           if (startPage > 2) pageNumbers.push('...');
       }
 
       for (let i = startPage; i <= endPage; i++) {
           pageNumbers.push(i);
       }
 
       if (endPage < totalPageCount) {
           if (endPage < totalPageCount - 1) pageNumbers.push('...');
           pageNumbers.push(totalPageCount);
       }
   }
 
   pageNumbersToShow = pageNumbers;
 }
 
 function scrollToTop() {
   window.scrollTo({
       top: 0,
       behavior: 'smooth'
   });
 }
 
 
 $: updateDisplayedProducts($filteredProducts);
 const applyFilters = () => {
  
  let filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.categoryName);
    const matchesManufacturer = selectedManufacturers.size === 0 || selectedManufacturers.has(product.manufacturerName);
    return matchesSearch && matchesCategory && matchesManufacturer;
  });
 
 
  filteredProducts = filteredProducts.sort((a, b) => {
   const fieldA = sortBy === 'price' ? parseFloat(a[sortBy]) : a[sortBy];
   const fieldB = sortBy === 'price' ? parseFloat(b[sortBy]) : b[sortBy];
 
   if (sortOrder === 'asc') {
     return fieldA - fieldB; 
   } else {
     return fieldB - fieldA; 
   }
 });
 
 
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
 
  return paginatedProducts;
 };
 
 products.priceSize = Array.isArray(products.priceSize) ? products.priceSize : [];
 
 
 
 
//  onMount(() => {
//    const storedFavorites = localStorage.getItem('isFavorited');
//      if (storedFavorites) {
//        isFavorited = JSON.parse(storedFavorites);
//      } else {
//        isFavorited = new Array(products.length).fill(false); 
//      }
   
//    products = products.map(product => ({
//            ...product,
//            quantity: product.quantity || 1,  
//        }));
    
//     const urlParams = new URLSearchParams(window.location.search);
//      const pageParam = urlParams.get('page');
//      const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
//      currentPage.set(initialPage);
//      allProducts = data.data;
//      currentPage.set(1);
//    initializeProducts();
//    updateFilteredProducts();
//    updateDisplayedProducts();
//    updatePageNumbersToShow($totalPages);
//  });



onMount(() => {
   
    const storedFavorites = localStorage.getItem('isFavorited');
    isFavorited = storedFavorites ? JSON.parse(storedFavorites) : new Array(products.length).fill(false);

   
    products = products.map(product => {
        
        const price = Array.isArray(product.priceSize) && product.priceSize.length > 0
            ? product.priceSize[0].price  
            : 0;  

        return {
            ...product,
            quantity: product.quantity || 1, 
            price,  
        };
    });

    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
    currentPage.set(initialPage);

    allProducts = data.data;
    currentPage.set(1);
    initializeProducts();
    updateFilteredProducts();
    updateDisplayedProducts();
    updatePageNumbersToShow($totalPages);
});

 function initializeProducts() {
    
     allProducts = data.data;  
     updateFilteredProducts();
     updateDisplayedProducts(); 
   }
 

export function addToCart(product, quantity) {
    const cartProduct = {
        description: product.prodDesc,
        id: product.id,
        image: product.imageSrc,
        name: product.productName,
        partNumber: product.productNumber, 
        // priceSize: {
        //     // price: product.priceSize[0].price,
        //     // size: product.priceSize[0].size
        // },


        priceSize: {
            price: product.priceSize && product.priceSize[0] ? product.priceSize[0].price : 0, 
            size: product.priceSize && product.priceSize[0] ? product.priceSize[0].size : 0   
        },
        quantity: quantity,
        stock: product.stockQuantity
    };

    cartState.update((cart) => {

        const existingProductIndex = cart.findIndex((item) => item.partNumber === cartProduct.partNumber);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += cartProduct.quantity;
            updateLocalStorage(cartProduct.partNumber, cart[existingProductIndex].quantity);
        } else {
            cart.push(cartProduct);
            updateLocalStorage(cartProduct.partNumber, cartProduct.quantity);
        }

        return cart;
    });

    const totalItems = JSON.parse(localStorage.getItem('cart')).length;

    cartNotification = `You have ${totalItems} item(s) in your cart.`;  

    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        cartNotification = '';
    }, 3000);
}




 
 $: updateFilteredProducts();
   $: updateDisplayedProducts();
   $: updateDisplayedProducts($filteredProducts);
   $: $currentPage, $totalPages;
   $: updatePageNumbersToShow($totalPages);
   filteredProducts.set(filtered || []);
   
   
   const handleFavoriteToggle = (productId) => {
     isFavorited[productId] = !isFavorited[productId];
   };
   const handleSubmit = async ({ result, productId }) => {
     let status = '';
     console.log(result);
     status = result.type;
     favoriteNotification = result.data.message;
     favoriteStatus = status;
     handleFavoriteToggle(productId); 
   };
 </script>
 
 
 
 
 <div class="w-full md:p-2  sm:p-2 md:w-full lg:w-full  flex flex-col">
  
   {#if $loading}
     <div class="flex items-center justify-center h-full">
       <div class="border-4 border-gray-300 border-t-primary-400 rounded-full w-10 h-10 animate-spin"></div>
       <h3 class="ml-4 text-lg">Loading...</h3>
     </div>
   {:else if $error}
     <p class="text-red-500 text-center">Error: {$error}</p>
   {:else if $filteredProducts.length === 0}
     <p class="text-center">No products found.</p>
   {:else}
     <div class="flex flex-col space-y-4 flex-grow">
       {#each $pproducts as product, index}
       <div class="border rounded-lg p-4 shadow-lg w-full flex flex-col relative">
         <p class="text-md font-bold">
           <!-- svelte-ignore a11y-invalid-attribute -->
           <a 
           href={typeof window !== 'undefined' ? `${window.location.pathname}/${encodeURIComponent(product.productNumber)}` : '#'}
           on:click|preventDefault={() => {
             if (typeof window !== 'undefined') {
               const currentPath = window.location.pathname;
               const productPageUrl = `${currentPath}/${encodeURIComponent(product.productNumber)}`;
               window.location.href = productPageUrl;
             }
           }}
           class="text-gray-700 hover:text-primary-500">
           {product.productName}
         </a>
         </p>
         
           
           
           
            <div class="relative">
             {#if isLoggedIn}
               <form
                 action="?/favorite"
                 method="POST"
                 class="text-end"
                 use:enhance={() => {
                   return async ({ result }) => {
                     let status = '';
                     console.log(result);
                     status = result.type;
                     favoriteNotification = result.data.message;
                     favoriteStatus = status;
                     handleFavoriteToggle(index);  
                    
                   
                   };
                 }}
               >
                 <input type="hidden" name="id" value={product.id} />
                 <input type="hidden" name="imgUrl" value={product.imageSrc} />
                 <input type="hidden" name="priceSize" />
                 <input type="hidden" name="price" value={product.priceSize[0].price} />
                 <input type="hidden" name="size" value={product.priceSize[0].size} />
                 <input type="hidden" name="productDesc" value={product.prodDesc} />
                 <input type="hidden" name="productName" value={product.productName} />
                 <input type="hidden" name="productNumber" value={product.productNumber} />
                 <input type="hidden" name="quantity" value={product.quantity || 1} />
                 <input type="hidden" name="stock" value={product.stockQuantity} />
                 <button type="submit" class="absolute -top-8 right-0 bg-transparent border-none p-0" aria-label="Toggle favorite">
                   <!-- <Icon
                     icon={isFavorited[index] ? 'prime:heart-fill' : 'prime:heart'}
                     class={`text-3xl ${isFavorited[index] ? 'text-primary-600' : 'text-primary-400'}`}
                   /> -->
                 </button>
               </form>
             {:else}
          
               <button
                 on:click={() => {
                   showModal = true;
                   indexToToggle = index;
                   handleFavoriteToggle(index);  
                 }}
                 class="absolute -top-8 right-0 bg-transparent border-none p-0"
                 aria-label="Toggle favorite"
               >
                 <!-- <Icon
                   icon={isFavorited[index] ? 'prime:heart-fill' : 'prime:heart'}
                   class={`text-3xl ${isFavorited[index] ? 'text-primary-600' : 'text-primary-400'}`}
                 /> -->
               </button>
             {/if}
           </div>
           
           
           
            <div class="flex items-start mt-4">
             <img 
             src={product.imageSrc} 
             alt={product.productNumber}  
           class="  w-24 h-36   md:w-36 md:h-28 rounded-lg " />
           
             <div class="flex-grow lg:ml-5 ml-3">
               <p>
               <span class="text-gray-600   mt-1">Code: </span>
               <span class="font-semibold text-gray-600  "> {product.productNumber} </span>
             </p>
             <p>
               <span class="text-gray-600  mt-1">Manufacturer:
                 <span class="font-semibold text-gray-600"> {product.manufacturerName}</span> </p>
                 <p>
               <span class="text-gray-600 mt-1">Category:</span><span class="font-semibold text-gray-600"> {product.category}</span>  </p>

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
                   <div class="flex flex-col  lg:ml-16 md:ml-16    md:flex-row lg:flex-row items-start justify-between">
                     <div class="hidden md:flex  items-center">
                       <p class="text-gray-600 font-semibold inline-block"> 
                    
                           {#if product.priceSize  && product.priceSize.length > 0}
                             {product.priceSize[0].price} 
                           {:else}
                             Price not available 
                           {/if}
                         </p>
                         
                         
                       <div class="flex items-center px-3    w-full lg:ml-2 md:ml-5">
                         <div class="border text-primary-400 flex items-center rounded">
                           <button 
                             on:click={() => decrementQuantity(index)} 
                             class="font-bold w-8 h-8  rounded text-primary-400 ">-</button>
                             <input 
                             type="text" 
                             class="w-10 h-8 text-center rounded font-medium text-primary-400 border-none bg-transparent  focus:outline-none focus:ring-0 focus:border-transparent mx-1" 
                             bind:value={products[index].quantity} 
                             readonly />
                           
                           <button 
                             on:click={() => incrementQuantity(index)} 
                             class="font-bold w-8 h-8  text-primary-400 rounded">+</button>
                         </div>
                         <button 
                         on:click={() => addToCart(product, products[index].quantity)} 
                         class="text-primary-400 hover:bg-primary-500 hover:text-white border border-primary-400  px-2 py-1 ml-3 rounded text-md lg:ml-4">Add To Cart</button>
                       </div>
                     </div>
                   </div>
                 </div>
                
                 
               </div>
            
                 
             </div>
             
           </div>
           <div class="  flex items-center   md:hidden space-x-1">
             <span class="text-gray-600 text-lg font-medium"> {#if product.priceSize && Array.isArray(product.priceSize) && product.priceSize.length > 0}
                             {product.priceSize[0].price} 
                           {:else}
                             Price not available 
                           {/if}</span>
             <div class="border text-primary-400 flex items-center ml-2   rounded">
               <button 
                 on:click={() => decrementQuantity(index)} 
                 class="font-bold w-6 h-6 rounded text-primary-400 ">-</button>
               <input 
                 type="text" 
                 class="w-10 h-8 text-center rounded font-medium text-primary-400 border-none bg-transparent focus:outline-none focus:ring-0 focus:border-transparent" 
                 bind:value={products[index].quantity} 
                 readonly />
               <button 
                 on:click={() => incrementQuantity(index)} 
                 class="font-bold w-6 h-6 rounded text-primary-400">+</button>
             </div>
 
              <button 
             on:click={() => addToCart(product, products[index].quantity)} 
             class="text-primary-400 hover:bg-primary-500 hover:text-white border border-primary-400  px-2 py-1 ml-3 rounded text-md lg:ml-4">Add To Cart</button> 
         
            
           </div>
          
         </div>
         
       {/each}
 
       <!-- Pagination  -->
       <div class="flex justify-center   mt-10 ml-20 space-x-2 sm:space-x-1">
           <button 
           on:click={() => changePage('prev')} 
           class={`bg-primary-400 text-white px-2 lg:px-4 py-2 rounded-full ${currentPage === 1 ? 'disabled' : ''}`} 
           disabled={$currentPage === 1}>
           <Icon icon="mdi:chevron-left" class="w-5 h-5" />
         </button>
         
        
         <div class=" pagination flex items-center space-x-2">
            
             {#each pageNumbersToShow as pageNumber}
               {#if pageNumber === '...'}
                 <span class="text-primary-500">...</span>
               {:else}
                 <button 
                   on:click={() => changePage(pageNumber)} 
                   class={`text-lg lg:px-4 px-3 py-2 rounded-full ${currentPage === pageNumber ? 'bg-primary-400 text-white' : 'bg-white text-primary-500 border-primary-400'} 
                   ${pageNumber !== $currentPage ? 'hidden sm:block' : ''}`} 
                   aria-current={$currentPage === pageNumber ? 'page' : ''}>
                   {pageNumber}
                 </button>
               {/if}
             {/each}
           </div>
           
         
        
         <button 
           on:click={() => changePage('next')} 
           class={`bg-primary-400 text-white px-2 lg:px-4 py-2 rounded-full ${currentPage === totalPages ? 'disabled' : ''}`} 
           disabled={$currentPage === totalPages}>
           <Icon icon="mdi:chevron-right" class="w-5 h-5" />
         </button>
       
       </div>
       
       
     </div>
   {/if}
 </div>
 {#if cartNotification}
   <div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
       {cartNotification}
   </div>
 {/if}
 {#if showModal}
           <!-- {#if isLoggedIn}
               <div class="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-70">
                   <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                       <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                           <Icon icon="mdi:close" class="text-xl hover:text-primary-400" />
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
                           <button on:click={closeModal} class="bg-primary-400 text-white p-1  rounded w-1/3 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                               Continue Shopping
                           </button>
                           <button on:click={viewFavourites} class="bg-primary-400 text-white p-1 rounded w-1/3 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-400">
                               View Favourites
                           </button>
                       </div>
                   </div>
               </div>
           {:else} -->
               <div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80">
                   <div class="bg-white rounded-lg p-6 w-11/12 max-w-sm md:max-w-lg lg:max-w-xl relative">
                       <button on:click={closeModal} class="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Close">
                           <Icon icon="mdi:close" class="text-xl hover:text-primary-400" />
                       </button>
       
                       <h2 class="text-xl  text-center font-bold mb-1">Please Login or Register to continue</h2>
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
                           <a href="/" class="text-primary-400" on:click|preventDefault={closeModal}>Continue browsing</a>
                           <a href="/signup" class="text-primary-400">Register</a>
                       </div>
                   </div>
               </div>
           {/if}
       <!-- {/if} -->
 {#if showSDSModal}
   
 <div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80">
     <div class="bg-white rounded-lg p-6 w-11/12 md:w-5/12 lg:w-1/2 relative"> 
         <button
             on:click={ closeSDSModal}
             class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
             aria-label="Close">
             <Icon icon="mdi:close" class="text-xl hover:text-primary-400" />
         </button>
         <h2 class="text-xl font-bold mb-4 text-center">Safety Data Sheet</h2>
         {#if selectedProduct}
             <!-- <p class="text-center">
                 <strong>Pack Size:</strong>
                 <select bind:value={selectedPackSize} class="border w-1/4 p-2 inline-block rounded bg-gray-100 ml-2 hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0">
                   
                     <option value="" disabled selected>Select size</option>
                      {#each selectedProduct.priceSize as size}
                         <option value={size.size}>{size.size}</option>
                     {/each} 
                 </select></p> -->
             
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
 
             <div class="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-80">
                 <div class="bg-white rounded-lg p-6 w-11/12 md:w-5/12 lg:w-1/2 relative"> 
                     <button
                         on:click={ closeCOAModal}
                         class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                         aria-label="Close">
                         <Icon icon="mdi:close" class="text-xlhover:text-primary-400" />
                     </button>
                     <h2 class="text-xl font-bold mb-4 text-center">Certificate of Analysis</h2>
                     {#if selectedProduct}
                         <!-- <p class="text-center">
                             <strong>Pack Size:</strong>
                             <select bind:value={selectedPackSize} class="border w-1/4 p-2 inline-block rounded bg-gray-100 ml-2 hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0">
 
                                 <option value="" disabled selected>Select size</option>
                                 {#each selectedProduct.priceSize as size}
                                     <option value={size.size}>{size.size}</option>
                                 {/each}
                             </select></p> -->
                         
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