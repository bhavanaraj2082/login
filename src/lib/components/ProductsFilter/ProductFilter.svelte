<script>
	import { page } from '$app/stores';
	import { cartState,updateCartState } from '$lib/stores/cartStores.js';
	import { goto } from '$app/navigation';
    import Icon from "@iconify/svelte";

    export let products
    export let manufacturers

    $: paginatedProducts = products.map(x=>x)
    let categoryName = products[0].categoryDetails.urlName
    let subCategoryName = products[0].subCategoryDetails.urlName
//    console.log(data,"-----------------");

    let searchManufacture = manufacturers
    
	let showSearchDropdown = false;
	let showCategoryDropdown = false;
	let showManufacturerDropdown = false;
	let showSortByDropdown = false;
    let currentPage = parseInt($page.url.searchParams.get('page')) || 1;
    let totalPages = products.length;

    const sortBy = (checked,sortType)=>{
        let sortedBy
        console.log(checked);
        
       if(checked === true){
        if(sortType === "desc") sortedBy = products.sort((a, b) => b.pricing[0].USD - a.pricing[0].USD);
        if(sortType === "asc") sortedBy = products.sort((a, b) => a.pricing[0].USD - b.pricing[0].USD);
        if(sortType == "name") sortedBy = products.sort((a, b) => a.productName.localeCompare(b.productName));
        }else{
            sortedBy = products.map(x=>x)
        }
        paginatedProducts = sortedBy
    }

    const handleManufacturer = (manufacturer)=>{
        searchManufacture = manufacturers
        const filteredData = searchManufacture.filter(mfr=> mfr.name.toLowerCase().includes(manufacturer) )
        console.log(filteredData,"----");
        searchManufacture = filteredData
    }
    
    const decrementQuantity = (id) => {
    products = products.map(product => {
        if (product._id === id) {
            if (product.quantity > 1) {
                return {
                    ...product,
                    quantity:product.quantity - product.orderMultiple,
                    totalPrice:product.pricing[0].INR*(product.quantity-product.orderMultiple)
                    
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
                totalPrice:product.pricing[0].INR*(product.quantity+product.orderMultiple)
            };
        }
        return product; // Keep other products unchanged
    });
};

    
  const onPageChange = (page) => {
    currentPage = page;
    goto(`/products/${categoryName}/${subCategoryName}?page=${currentPage}`)
    // Load the data for the new page (you can replace this with a real API request)
    console.log(`Current page: ${currentPage}`);
  };

  const goToPage = (page) => {
    console.log(page);
    if (page > 0 && page <= totalPages){
      onPageChange(page)      
    }
  }
  
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
    console.log('object');
     const addCart = {
        description:product.prodDesc,
        _id:product._id,
        image:product.imageSrc,
        name:product.productName,
        partNumber:product.productNumber,
        priceSize:product.pricing[0],
        quantity:product.quantity,
        stock:product.stock
     }
     if(!$cartState.length){
        updateCartState([addCart])
     }
     const filtered = $cartState.find(cart=>(cart._id === product._id && cart.priceSize.break === product.pricing[0].break))
     if(filtered === undefined){
        $cartState.push(addCart)
     }else{
        filtered.quantity = product.quantity
        let selectedPrice = product.pricing.find(x=>x.break === filtered.priceSize.break)
        filtered.priceSize = selectedPrice
     }
     //console.log(filtered,"------");
     updateCartState($cartState)
  }
    //const handleSearchChange = ()=>{}
</script>

<section class=" space-y-3 lg:flex items-start gap-4">
    <!-- filters -->
    <div class=" w-full h-fit sticky top-0 lg:w-1/4">
        <div class="p-4 border-1 bg-white border-gray-300 rounded space-y-3 mt-3">
            <div  class=" flex gap-2 justify-center lg:justify-start items-center text-xl font-semibold font-montserrat">
                <Icon icon="ic:sharp-segment" class="text-3xl text-primary-500" />
                <h1>Filter</h1>
            </div>
            <div class=" space-y-3">
             <!-- svelte-ignore a11y-click-events-have-key-events -->
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div on:click={()=>showSearchDropdown = !showSearchDropdown} class=" cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <span>Search</span>
                <button type="button" on:click={()=>showSearchDropdown = !showSearchDropdown}>
                     <Icon icon={showSearchDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
            </div>
            <div class="p-3 border-1 rounded {showSearchDropdown ? "block" : "hidden"}">
                <input type="text" placeholder="Search..." on:input={e=>handleManufacturer(e.target.value)} class=" w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
             </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click={()=>showManufacturerDropdown = !showManufacturerDropdown} class=" cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <span>Manufacturers</span>
                <button type="button" on:click={()=>showManufacturerDropdown = !showManufacturerDropdown}>
                     <Icon icon={showManufacturerDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
            </div>
            <div class="p-3 border-1 rounded {showManufacturerDropdown ? "block" : "hidden"}">
                <input type="text" placeholder="Search..." on:input={e=>handleManufacturer(e.target.value)} class=" w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
                <div class=" space-y-2.5 py-2.5 h-40 overflow-y-scroll my-1 scroll">
                    {#if !searchManufacture.length}
                        <p class=" text-sm text-center">No maunfacturer found</p>
                    {:else}
                        {#each searchManufacture as {name}}
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
             <div on:click={()=>showCategoryDropdown = !showCategoryDropdown} class=" cursor-pointer font-semibold text-sm flex items-center justify-between p-2 rounded border-1 border-gray-300 ">
                <span>Categories</span>
                <button type="button" on:click={()=>showCategoryDropdown = !showCategoryDropdown}>
                     <Icon icon={showCategoryDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
             </div>
             <div class="p-3 border-1 rounded {showCategoryDropdown ? "block" : "hidden"}">
                <input type="text" placeholder="Search..." on:input={e=>handleManufacturer(e.target.value)} class=" w-full rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
                <div class=" space-y-2.5 py-2.5 h-40 overflow-y-scroll my-1 scroll">
                    {#if !searchManufacture.length}
                        <p class=" text-sm text-center">No maunfacturer found</p>
                    {:else}
                        {#each searchManufacture as {name}}
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
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"name")} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Product Name</p>
                    </div>
                    <div class=" flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"asc")} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Price Ascending </p>
                    </div>
                    <div class=" flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" on:change={(e)=>sortBy(e.target.checked,"desc")} class=" cursor-pointer text-primary-500 focus:ring-0">
                        <p>Price Descending </p>
                    </div>
                </div>
             </div>
            </div>
        </div>
    </div>
    <!-- products -->
    <div class=" w-full h-auto space-y-3 lg:w-3/4">
       {#each paginatedProducts as product}
        <div class=" bg-white border-1 border-gray-300 p-4 space-y-2 rounded">
            <div>
                <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`} class=" text-sm font-semibold hover:text-primary-500 hover:underline">{product?.productName  || ""}</a>
            </div>
            <div class=" flex items-start gap-3">
                <img src={product?.imageSrc} class=" w-36 h-36 object-contain" alt="">
                <div class=" text-xs md:text-sm space-y-1 grow font-semibold">
                    <p>Product Number : <span class=" font-medium">{product?.productNumber || ""}</span></p>
                    <p>Category : <span class=" font-medium">{product?.categoryDetails.name || ""}</span></p>
                    <p>Sub Category : <span class=" font-medium">{product?.subCategoryDetails.name || ""}</span></p>
                    <p>Manufacturer : <span class=" font-medium">{product?.manufacturerDetails.name || ""}</span></p>
                    <p>Price : <span class=" font-medium">₹{product?.pricing[0].INR || ""}</span></p>
                    <p>Size : <span class=" font-medium">{product?.pricing[0].break || ""}</span></p>
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
                <p class=" font-bold">${product?.totalPrice}</p>
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
       
       <!-- pagination -->
       <div class=" flex w-fit bg-white mx-auto">
        <button class=" border-1 border-primary-500 rounded p-1.5 hover:bg-primary-500"
          on:click={() => goToPage(currentPage - 1)} 
          disabled={currentPage <= 1}
        >
        <Icon icon="ic:round-chevron-left" class=" text-primary-500 hover:text-white" width="24" height="24" />
        </button>
      
        {#each getPageNumbers(currentPage,totalPages) as page}
          <button
            on:click={() => goToPage(page)}
            class="{page === currentPage ? "text-primary-500" : ""} w-10 font-medium"
          >
            {page}
          </button>
        {/each}
      
        <button class=" border-1 border-primary-500 rounded p-1.5 hover:bg-primary-500"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
        <Icon icon="ic:round-chevron-right" class=" text-primary-500 hover:text-white" width="24" height="24" />
        </button>
      </div>
    </div>

</section>