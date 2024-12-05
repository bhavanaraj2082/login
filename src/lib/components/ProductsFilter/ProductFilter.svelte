<script>
	import { page } from '$app/stores';
	import { cartState,updateCartState } from '$lib/stores/cartStores.js';
	import { goto } from '$app/navigation';
    import { toast } from 'svelte-sonner';
    import Icon from "@iconify/svelte";

    export let products
    export let manufacturers
    export let productCount
    export let subSubCategory

    //console.log(products);

    $: paginatedProducts = products.map(x=>x)
    let categoryName = products[0]?.categoryDetails.urlName
    let subCategoryName = products[0]?.subCategoryDetails.urlName

    let searchManufacture = manufacturers
    
	let showSearchDropdown = false;
	let showCategoryDropdown = false;
	let showManufacturerDropdown = false;
	let showSortByDropdown = false;
    let toggleFilter = false
    let currentPage = parseInt($page.url.searchParams.get('page')) || 1;
    let search = parseInt($page.url.searchParams.get('search')) || null
    let selectedManufacturer = $page.url.searchParams.get('manufacturer') || null;
    let totalPages = parseInt(productCount/10);

    let selectedSort =''

    const sortBy = (checked, sortType) => {
    let sortedBy;
    selectedSort = sortType
    const productsCopy = [...products];

    if (checked) { 
        switch (sortType) {
            case "desc":
                sortedBy = productsCopy.sort((a, b) => b.pricing.INR - a.pricing.INR);
                break;
            case "asc":
                sortedBy = productsCopy.sort((a, b) => a.pricing.INR - b.pricing.INR);
                break;
            case "name":
                sortedBy = productsCopy.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            default:
                sortedBy = [...products]; 
        }
    } else {
        sortedBy = [...products];
    }

    paginatedProducts = sortedBy;
    };

    
    const handleManufacturer = (searchTerm) => {
        if (!searchTerm) {
            searchManufacture = manufacturers;
        return;
        }
        searchManufacture = manufacturers.filter(mfr => 
            mfr.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    let loading = false;
    const handleManufacturerSelect = async (manufacturerName, checked) => {
    try {
        loading = true;
        const newUrl = new URL(window.location.href);
        
        if (checked) {
            selectedManufacturer = manufacturerName;
            newUrl.searchParams.set('manufacturer', manufacturerName);
        } else {
            selectedManufacturer = null;
            newUrl.searchParams.delete('manufacturer');
        }
        
        newUrl.searchParams.set('page', '1');
        
        await goto(newUrl.toString(), {
            invalidateAll: true, 
            keepfocus: true, 
            replaceState: true, 
            noScroll: true 
        });

        currentPage = 1;
        
    } catch (error) {
        console.error('Error filtering products:', error);
    } finally {
        loading = false;
    }
};    
    const decrementQuantity = (id) => {
    products = products.map(product => {
        if (product._id === id) {
            if (product.quantity > 1) {
                return {
                    ...product,
                    quantity:product.quantity - product.orderMultiple,
                    totalPrice:product.pricing.INR*(product.quantity-product.orderMultiple)
                    
                };
            }
            return product;
        }
        return product;
    });
};


    const incrementQuantity = (id, quantity) => {
    products = products.map(product => {
        if (product._id === id) {
            return {
                ...product, // Copy the product object
                quantity: product.quantity + product.orderMultiple, // Increment the quantity
                totalPrice:product.pricing.INR*(product.quantity+product.orderMultiple)
            };
        }
        return product; // Keep other products unchanged
    });
};


  const goToPage = async (page) => {
    if (page > 0 && page <= totalPages) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', page.toString());
        if (selectedManufacturer) {
            newUrl.searchParams.set('manufacturer', selectedManufacturer);
        }
        if(search){
            newUrl.searchParams.set('search', search);
        }
        currentPage = page
        await goto(newUrl.toString());
    }
};
  
  const getPageNumbers = () => {
    let pageNumbers = [];
  
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  // Add pages to the array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
  };

  const addToCart = (product) =>{
    let priceSize = {
        price:product.pricing.INR,
        size:product.pricing.break
    }
     const addCart = {
        description:product.prodDesc,
        id:product._id,
        image:product.imageSrc,
        name:product.productName,
        partNumber:product.productNumber,
        priceSize,
        quantity:product.quantity,
        stock:product.stock
     }
     if(!$cartState.length){
        updateCartState([addCart])
        toast.success("Item added to Cart")
        return
     }
     const filtered = $cartState.find(cart=>(cart._id === product._id && cart.priceSize.break === product.pricing.break))
     if(filtered === undefined){
        $cartState.push(addCart)
     }else{
        filtered.quantity = product.quantity
        let selectedPrice = product.pricing.find(x=>x.break === filtered.priceSize.break)
        filtered.priceSize = selectedPrice
     }
     updateCartState($cartState)
     toast.info("Item quantity updated")
  }

let typingTimeout;
let searchLoading = false
const handleSearch = (searchName) => {
    try{
    clearTimeout(typingTimeout);
    const newUrl = new URL(window.location.href);
    typingTimeout = setTimeout( async() => {
    searchLoading = true
        if (searchName.length >= 3) {
            newUrl.searchParams.set('search', searchName);
        } else {
            newUrl.searchParams.delete('search');
        }
        newUrl.searchParams.set('page', '1');

        await goto(newUrl.toString(), {
            invalidateAll: true, 
            keepfocus: true, 
            replaceState: true, 
            noScroll: true 
        });
        currentPage = 1;
        searchLoading = false;
    }, 1000)
} catch (error) {
        console.error('Error filtering products:', error);
    } finally {
        searchLoading = false;
    }
};


</script>

<!-- <div>
    product filter
</div> -->
<section class=" space-y-3 lg:flex items-start gap-4">
    <!-- filters -->
    <div class=" w-full h-fit sticky top-0 lg:w-1/4">
        <div class="p-4 border-1 bg-white border-gray-300 rounded space-y-3 mt-3">
            
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click={()=>(toggleFilter = !toggleFilter)} class=" flex gap-2 justify-center lg:justify-start items-center text-xl font-semibold font-montserrat">
                <Icon icon="ic:sharp-segment" class="text-3xl text-primary-500" />
                <h1>Filter</h1>
            </div>
            <div class=" space-y-3 {toggleFilter ? "block":" hidden lg:block"}">
             <!-- svelte-ignore a11y-click-events-have-key-events -->
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div on:click={()=>showSearchDropdown = !showSearchDropdown} class=" cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <div class=" flex items-center gap-2">
                    <span>Search </span>
                    {#if searchLoading}
                    <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-500"></div>
                    {/if}
                   </div>
                <button type="button" on:click={()=>showSearchDropdown = !showSearchDropdown}>
                     <Icon icon={showSearchDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
            </div>
            <div class="p-3 border-1 rounded {showSearchDropdown ? "block" : "hidden"}">
                <input type="text" placeholder="Search..." on:input={e=>handleSearch(e.target.value)} class=" w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
             </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click={() => showManufacturerDropdown = !showManufacturerDropdown} 
                class="cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300">
               <div class=" flex items-center gap-2">
                <span>Manufacturers </span>
                {#if loading}
                <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-500"></div>
                {/if}
               </div>
               <button type="button" 
                       on:click={() => showManufacturerDropdown = !showManufacturerDropdown}>
                   <Icon icon={showManufacturerDropdown ? "iconamoon:arrow-up-2-duotone" : "iconamoon:arrow-down-2-duotone"} 
                         class="text-2xl"/>
               </button>
           </div>
           <div class="p-3 border-1 rounded {showManufacturerDropdown ? 'block' : 'hidden'}">
               <input type="text" 
                      placeholder="Search manufacturers..." 
                      on:input={e => handleManufacturer(e.target.value)} 
                      class="w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
               <div class="space-y-2.5 py-2.5 h-40 overflow-y-scroll my-1 scroll">
                   {#if !searchManufacture.length}
                       <p class="text-sm text-center">No manufacturer found</p>
                   {:else}
                       {#each searchManufacture as {name}}
                           <div class="flex items-center gap-2 text-xs font-medium">
                               <input 
                                   type="checkbox" 
                                   checked={name === selectedManufacturer}
                                   on:change={(e) => handleManufacturerSelect(name, e.target.checked)}
                                   class="cursor-pointer text-primary-500 focus:ring-0">
                               <p>{name}</p>
                           </div>
                       {/each}
                   {/if}
               </div>
           </div>
            
             <!-- svelte-ignore a11y-click-events-have-key-events -->
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div on:click={()=>showCategoryDropdown = !showCategoryDropdown} class=" {!subSubCategory.length ? "hidden" : "flex"} cursor-pointer font-semibold text-sm items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <span>Categories</span>
                <button type="button" on:click={()=>showCategoryDropdown = !showCategoryDropdown}>
                     <Icon icon={showCategoryDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
             </div>
             <div class="p-3 border-1 rounded {showCategoryDropdown ? "block" : "hidden"}">
                <input type="text" placeholder="Search..." on:input={e=>handleManufacturer(e.target.value)} class=" w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
                <div class=" space-y-2.5 py-2.5 h-40 overflow-y-scroll my-1 scroll">
                    {#if !subSubCategory.length}
                        <p class=" text-sm text-center">No maunfacturer found</p>
                    {:else}
                        {#each subSubCategory as {name}}
                            <div class=" flex items-center gap-2 text-xs font-medium">
                                <input type="checkbox" class=" cursor-pointer text-primary-500 focus:ring-0">
                                <p>{name}</p>
                            </div>
                        {/each}
                    {/if}
                </div>
             </div>
             
             <!-- svelte-ignore a11y-click-events-have-key-events -->
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div on:click={()=>showSortByDropdown = !showSortByDropdown} class=" cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <span>Sort By</span>
                <button type="button" on:click={()=>showSortByDropdown = !showSortByDropdown}>
                     <Icon icon={showSortByDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
             </div>
             <div class="p-3 border-1 rounded {showSortByDropdown ? "block" : "hidden"}">
                <div class=" space-y-2.5 py-2.5 h-auto">
                    <div class=" flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"name")} checked={selectedSort === "name"} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Product Name</p>
                    </div>
                    <div class=" flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"asc")} checked={selectedSort === "asc"} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Price Ascending </p>
                    </div>
                    <div class=" flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"desc")} checked={selectedSort === "desc"} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Price Descending </p>
                    </div>
                </div>
             </div>
            </div>
        </div>
    </div>
    <!-- products -->
    <div class=" w-full h-auto space-y-3 lg:w-3/4">
        {#if paginatedProducts.length === 0}
        <div>
            <p class=" text-center font-medium">No Product Found</p>
        </div>
        {:else}
       {#each paginatedProducts as product}
        <div class=" bg-white border-1 border-gray-300 p-4 space-y-2 rounded">
            <div>
                <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`} class=" text-sm font-semibold text-primary-500 hover:underline">{product?.productName  || ""}</a>
            </div>
            <div class=" flex items-start gap-3">
                <img src={product?.imageSrc} class=" w-36 h-36 object-contain" alt="">
                <div class=" text-xs md:text-sm space-y-1 grow font-semibold">
                    <p>Product Number : <span class=" font-medium">{product?.productNumber || ""}</span></p>
                    <p>Category : <span class=" font-medium">{product?.categoryDetails.name || ""}</span></p>
                    <p>Sub Category : <span class=" font-medium">{product?.subCategoryDetails.name || ""}</span></p>
                    <p>Manufacturer : <span class=" font-medium">{product?.manufacturerDetails.name || ""}</span></p>
                    <p>Price : <span class=" font-medium">₹{product?.pricing.INR || ""}</span></p>
                    <p>Size : <span class=" font-medium">{product?.pricing.break || ""}</span></p>
                    <div class=" hidden sm:flex items-center justify-between">
                        <p class=" font-bold text-sm">₹{product?.totalPrice}</p>
                        <div class="flex items-center">
                            <div class="flex items-center border-1 rounded">
                                <button on:click={() => decrementQuantity(product._id)} class=" border-r-1 p-2.5 text-primary-500"
                                    ><Icon icon="rivet-icons:minus" class="text-sm"/></button
                                >
                                <p class="w-fit mx-3 text-sm font-medium outline-none text-center">{product?.quantity}</p>
                                <button on:click={() => incrementQuantity(product._id)} class=" border-l-1 p-2.5 text-primary-500"
                                    ><Icon icon="rivet-icons:plus" class="text-sm"/></button
                                >
                            </div>
                        </div>
                        <button type="button" on:click={()=>addToCart(product)} class=" border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 px-5 py-1.5 rounded ">Add to Cart</button>
                    </div>
                </div>
            </div>
            <div class=" flex sm:hidden items-center justify-between">
                <p class=" font-bold">₹{product?.totalPrice}</p>
                <div class="flex items-center">
                    <div class="flex items-center border-1 rounded">
                        <button on:click={() => decrementQuantity(product._id,product.quantity)} class=" border-r-1 p-2.5 text-primary-500"
                            ><Icon icon="rivet-icons:minus" class="text-sm"/></button
                        >
                        <p class="w-fit mx-3 text-sm font-medium outline-none text-center">{product?.quantity}</p>
                        <button on:click={() => incrementQuantity(product._id,product.quantity)} class=" border-l-1 p-2.5 text-primary-500"
                            ><Icon icon="rivet-icons:plus" class="text-sm"/></button
                        >
                    </div>
                </div>
                <button type="button" on:click={()=>addToCart(product)} class=" border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 px-5 py-1.5 rounded ">Add to Cart</button>
            </div>
        </div>
       {/each}
       {/if}
       
       <!-- pagination -->
       <div class=" w-fit  mx-auto {products.length< 10 ? "hidden": "flex"}">
        <button class=" border-1 bg-white border-primary-500 rounded p-1.5 hover:bg-primary-500"
          on:click={() => goToPage(currentPage - 1)} 
          disabled={currentPage <= 1}
        >
        <Icon icon="ic:round-chevron-left" class=" text-primary-500 hover:text-white" width="24" height="24" />
        </button>
      
        {#each getPageNumbers(currentPage,totalPages) as page}
          <button
            on:click={() => goToPage(page)}
            class="{page === currentPage ? "text-primary-500 border-primary-500" : ""} bg-white mx-0.5 border-1 border-gray-300 rounded w-10 font-medium"
          >
            {page}
          </button>
        {/each}
      
        <button class=" border-1 bg-white border-primary-500 rounded p-1.5 hover:bg-primary-500"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
        <Icon icon="ic:round-chevron-right" class=" text-primary-500 hover:text-white" width="24" height="24" />
        </button>
      </div>
    </div>

</section>