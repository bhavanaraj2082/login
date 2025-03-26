<script>
	import { browser } from '$app/environment';
    import { writable } from 'svelte/store';
	import { addLocalToFavorites,myFavorites } from '$lib/stores/favorites.js';
	import { addItemToCart,cart,guestCart } from '$lib/stores/cart.js';
	import { sendMessage } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { goto,invalidateAll } from '$app/navigation';
    import { toast } from 'svelte-sonner';
    import Icon from "@iconify/svelte";
	import { authedUser,currencyState,cartTotalComps } from '$lib/stores/mainStores.js';
    import { enhance } from "$app/forms";
    import { onMount } from 'svelte';
    import ShowQuoteModal from "$lib/components/productInfoPopups/showQuoteModal.svelte";
    import {PUBLIC_IMAGE_URL} from "$env/static/public"

    export let products
    export let manufacturers
    export let productCount
    export let subSubCategory
    export let specifications
    export let profile

	let isLoggedIn = $authedUser?.id ? true : false

    let hoveredItem = null; 
    function handleMouseEnter(imageSrc, index) {
    hoveredItem = { imageSrc, index }; 
  }
  let showQuoteModal= false;
  let productQuote=null;
  let form5;
  let data = { records: [] };
  function toggleQuoteModal(selectedProduct) {
    showQuoteModal = !showQuoteModal;
    productQuote = selectedProduct;
    data.records=[productQuote]
  }
function handleMouseLeave() {
  hoveredItem = null; 
}
    const guestCartFetch = () => {
		// const formdata = new FormData();
		// formdata.append('guestCart', JSON.stringify($guestCart));
		// sendMessage('/cart?/guestCart', formdata, async (result) => {
		// 	cart.set(result.cart);
		// });
        const storedTotalComps = JSON.parse(localStorage.getItem('cart'));;
		localStorage.setItem('totalCompsChemi', storedTotalComps.length);
		syncLocalStorageToStore();	
	};

    $: paginatedProducts = products?.length ? products.map(x=>x) : []
    let categoryName = products[0]?.categoryDetails.urlName
    let subCategoryName = products[0]?.subCategoryDetails.urlName

    let searchManufacture = manufacturers
    
	let arr
	let showSortByDropdown = false;
    let toggleFilter = false
    let currentPage = parseInt($page.url.searchParams.get('page')) || 1;
    let search = $page.url.searchParams.get('search') || null
    let selectedManufacturer = $page.url.searchParams.get('manufacturer') || null;
    $: totalPages = Math.ceil(productCount/10);
    let tog= null
    let form;
    let selectedSort =''
	let selectedImage = null;
	let showimage = false;

	function imagemodal(imageSrc) {
		selectedImage = imageSrc;
		showimage = true;
	}
	function closePopup() {
		showimage = false;
		selectedImage = null;
	}

    const fetchMyFav = ()=>{
        const formdata = new FormData()
		sendMessage("/?/getFavorites",formdata,async(result)=>{
			console.log(result.favorite);
			myFavorites.set(result.favorite)
			localStorage.setItem("myfavorites",JSON.stringify(result.favorite))
		})
    }

    onMount(()=>{
        if($authedUser?.id){
        fetchMyFav()
        }
    })
 
    const handleManufacturer = (searchTerm) => {
        if (!searchTerm) {
            searchManufacture = manufacturers;
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('manufacturer')
            goto(newUrl.toString(), {
            invalidateAll: true, 
            keepfocus: true, 
            replaceState: true, 
            noScroll: true 
            });
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
    let timeout
    const handleQty = (id,quantity) =>{
        if(isNaN(quantity)){
            return
        }
        if(quantity >10000000) quantity = 10000000
         clearTimeout(timeout)
         timeout = setTimeout(()=>{
            products = products.map(product => {
        if (product._id === id) {
            let selectedQty = Math.ceil(quantity/ product.orderMultiple) * product.orderMultiple;
            let priceINR = product.pricing.INR*selectedQty
            let priceUSD = product.pricing.USD*selectedQty
            return {
                ...product, // Copy the product object
                quantity:selectedQty, // Increment the quantity
                totalPrice:{priceINR,priceUSD}
            };
        }
        return product; 
         })
         tog = null
         },1000);
    }

    const decrementQuantity = (id) => {
    products = products.map(product => {
        if (product._id === id) {
          if (product.quantity > product.orderMultiple) {
            let priceINR = product.pricing.INR*(product.quantity-product.orderMultiple)
            let priceUSD = product.pricing.USD*(product.quantity-product.orderMultiple)
                return {
                    ...product,
                    quantity:product.quantity - product.orderMultiple,
                    totalPrice:{priceINR,priceUSD}
                    
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
            let priceINR = product.pricing.INR*(product.quantity+product.orderMultiple)
            let priceUSD = product.pricing.USD*(product.quantity+product.orderMultiple)
            return {
                ...product, // Copy the product object
                quantity: product.quantity + product.orderMultiple, // Increment the quantity
                totalPrice:{priceINR,priceUSD}
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
    //console.log(product,"============");
    const backOrder = product.quantity > product.stock ? product.quantity - product.stock : 0
    if(isLoggedIn === false){
        const addCart = {
        productId:product._id,
        manufacturerId:product.manufacturerDetails._id,
        distributorId:product.distributorId,
        stockId:product.stockId,
        quantity:product.quantity,
        backOrder
     }
     addItemToCart(addCart)
     toast.success("product added to cart")
     guestCartFetch()
     return
    }

    const formdata = new FormData()
    formdata.append("item",JSON.stringify({
        productId:product._id,
        manufacturerId:product.manufacturerDetails._id,
        distributorId:product.distributorId,
        stockId:product.stockId,
        quantity:product.quantity,
        backOrder
    }))
    sendMessage("?/addtocart",formdata,async(result)=>{
        if (result.success) {
        await submitForm();	
      }
        await invalidateAll()

        toast.success(result.message)
    })
     
  }

  function handleData() {
		return async ({ result }) => {
			// console.log("resultresultresultresultresultresultresult",result);
			const totalComps  = result?.data?.cartData?.cartItems.length 
			localStorage.setItem('totalCompsChemi', totalComps);
			syncLocalStorageToStore();
		};
  }

  function syncLocalStorageToStore() {
		const storedTotalComps = localStorage.getItem('totalCompsChemi');

		if (storedTotalComps ) {
			cartTotalComps.set(Number(storedTotalComps));
		}
  }
  async function submitForm() {
		form.requestSubmit();
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

  const handleFavorites = (product)=>{
    try {
     console.log(product);
    addLocalToFavorites(product.stockId)
    let formdata = new FormData()
    formdata.append("authedEmail",$authedUser.email)
    formdata.append("productId",product._id)
    formdata.append("manufacturerId",product.manufacturerDetails._id)
    formdata.append("stockId",product.stockId)
    formdata.append("distributorId",product.distributorId)
    formdata.append("quantity",product.orderMultiple)
    formdata.append("stock",product.stock)
    sendMessage("?/favorite",formdata,async(result)=>{
        console.log(result);
        toast.success(result.message)
    }) 
    } catch (error) {
        console.log(error);
        // toast.error(error.message)
    }
    
  }

  const handlePrice = async(checked,price)=>{
    const newUrl = new URL(window.location.href);
        selectedSort = price
        if (checked) {
            newUrl.searchParams.set('price', price);
        } else {
            newUrl.searchParams.delete('price');
        }
        
        newUrl.searchParams.set('page', '1');
        
        await goto(newUrl.toString(), {
            invalidateAll: true, 
            keepfocus: true, 
            replaceState: true, 
            noScroll: true 
        });

        currentPage = 1;
  }

  const handleFilters = (num)=>{
    if(arr === num){
      arr = null
    }else{
      arr = num
    }
  }
  let selectedValues = browser && localStorage.getItem("specs") ? JSON.parse(localStorage.getItem("specs")) : {}
  function handleCheckboxChange(index, value,key, event) {
    const newUrl = new URL(window.location.href);
    
    if (event.target.checked) {
      if (!selectedValues[key]) {
        selectedValues[key] = [];
      }
      selectedValues[key] = [value];
    } else {
      selectedValues[key] = selectedValues[key].filter(item => item !== value);
      newUrl.searchParams.delete(key); 
      
    }
    browser ? localStorage.setItem("specs",JSON.stringify(selectedValues)) : ""
    Object.entries(selectedValues).forEach(([key, value]) => {
        //searchParams.append(key, value);

      if (Array.isArray(value)) {
        value.forEach(item => {
          newUrl.searchParams.set(key, item); 
        });
      } else{
        newUrl.searchParams.set(key, value);
      }
  })
  goto(newUrl.toString(),{
        invalidateAll:true,
        keepfocus: true, 
        replaceState: true, 
        noScroll: true 
      })
  }
</script>

<!-- <div>
    product filter
</div> -->
<form method="POST" action="/?/getCartValue" bind:this={form} use:enhance={handleData}>
    <input type="hidden" name="loggedInUser" value={$authedUser?.id} />
  </form>
<section class=" space-y-3 lg:flex items-start gap-4">
    <!-- filters -->
    <div class=" w-full h-fit sticky top-0 z-20 lg:w-1/4">
        <div class=" p-2 sm:p-4 bg-white shadow rounded space-y-2 mt-3">
            
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click={()=>(toggleFilter = !toggleFilter)} class=" flex items-center justify-between text-lg md:text-xl font-semibold font-montserrat">
               <div class=" flex gap-2 items-center">
                <Icon icon="ic:sharp-segment" class="text-2xl text-primary-500" />
                <h1>Filter</h1>
               </div>
               <Icon icon={toggleFilter ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-3xl p-0.5 rounded-full hover:bg-gray-100 xl:hidden"/>
            </div>
            <div class=" h-[84vh] overflow-y-scroll scroll space-y-2 {toggleFilter ? "block":" hidden lg:block"}">
            <div class="relative pr-1">
                <input type="text" placeholder="Search..." bind:value={search} on:input={e=>handleSearch(e.target.value)} class=" w-full text-xs font-medium rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500"/>
                {#if searchLoading}
                    <Icon icon="line-md:loading-loop" class=" absolute right-2 top-2.5 text-xl text-primary-500"/>
                {/if}
             </div>
            <p class=" font-semibold text-xs">Manufacturer</p>
           <div class="relative pr-1">
               <input type="text" bind:value={selectedManufacturer}
                      placeholder="Search manufacturers..." 
                      on:input={e => handleManufacturer(e.target.value)} 
                      class="w-full text-xs rounded border-1 border-gray-300 focus:ring-0 focus:border-primary-500">
                      {#if loading}
                        <Icon icon="line-md:loading-loop" class=" absolute right-2 top-2.5 text-xl text-primary-500"/>
                      {/if}
               <div class="space-y-2.5 py-2.5 max-h-48 px-2 overflow-y-auto my-1 scroll">
                   {#if !searchManufacture.length}
                       <p class="text-sm text-center">No manufacturer found</p>
                   {:else}
                       {#each searchManufacture as {name}}
                           <label for={name} class="flex cursor-pointer items-center gap-2 text-xs font-medium">
                               <input 
                                   id={name}
                                   name={name}
                                   type="checkbox" 
                                   checked={name === selectedManufacturer}
                                   on:change={(e) => handleManufacturerSelect(name, e.target.checked)}
                                   class="cursor-pointer rounded-full text-primary-500 focus:ring-0 outline-none">
                               {name}
                           </label>
                       {/each}
                   {/if}
               </div>
           </div>
             
             <!-- svelte-ignore a11y-click-events-have-key-events -->
             <!-- svelte-ignore a11y-no-static-element-interactions -->
             <div on:click={()=>showSortByDropdown = !showSortByDropdown} class="mr-1 cursor-pointer font-semibold text-xs flex items-center justify-between p-1 rounded border-1 border-gray-300 ">
                <span class="ml-2">Sort By</span>
                <Icon icon={showSortByDropdown ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
             </div>
             <div class="p-3 mr-1 border-1 rounded {showSortByDropdown ? "block" : "hidden"}">
                <div class=" space-y-2.5 py-2.5 h-auto">
                    <label for="asc" class=" cursor-pointer flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" id='asc' on:change={(e)=>handlePrice(e.target.checked,"asc")} checked={selectedSort === "asc"} class=" cursor-pointer outline-none rounded-full text-primary-500 focus:ring-0">
                        <p>Price Ascending </p>
                    </label>
                    <label for="desc" class=" cursor-pointer flex items-center gap-2 text-xs font-medium">
                        <input type="checkbox" id="desc" on:change={(e)=>handlePrice(e.target.checked,"desc")} checked={selectedSort === "desc"} class=" cursor-pointer outline-none rounded-full text-primary-500 focus:ring-0">
                        <p>Price Descending </p>
                    </label>
                </div>
             </div>
             <div class="mr-1 space-y-2">
                {#each Object.entries(specifications) as [key,values],index }
                <button on:click={()=>handleFilters(index)} class="cursor-pointer w-full font-semibold text-xs flex items-center justify-between p-1 rounded border-1 border-gray-300 ">
                    <div class="ml-2 flex items-center gap-1.5">{key}
                      {#if selectedValues[key] && selectedValues[key].length > 0}
                        <Icon icon="icomoon-free:checkbox-checked" class="text-sm text-primary-600"/>
                      {/if}
                     </div>
                    <Icon icon={arr === index ? "iconamoon:arrow-up-2-duotone":"iconamoon:arrow-down-2-duotone"} class="text-2xl"/>
                </button>
                <div class="p-3 border-1 rounded { arr === index ? "block" : "hidden"}">
                    {#each values as value }
                       <div class=" py-1 h-auto">
                          <label for={value.replaceAll(" ","-")} class=" cursor-pointer flex items-center gap-2 text-xs font-medium">
                            <input type="checkbox" id={value.replaceAll(" ","-")}
                            on:change={(e) => handleCheckboxChange(index, value,key, e)}
                            checked={selectedValues[key] && selectedValues[key].includes(value)} 
                            class=" cursor-pointer outline-none rounded-full text-primary-500 focus:ring-0">
                            <p>{value}</p>
                           </label>
                       </div>
                    {/each}
                   
                 </div>
                {/each}
                
            </div>
            </div>
           
        </div>
    </div>
    <!-- products -->
    <div class=" w-full h-auto space-y-3 lg:w-3/4">
        {#if paginatedProducts.length === 0}
        <div>
            <p class=" text-center font-medium pt-44">No Product Found</p>
        </div>
        {:else}
       {#each paginatedProducts as product,index}
        <div class=" relative bg-white shadow p-2 sm:p-4 md:px-8 space-y-2 rounded">
            <button on:click={()=>handleFavorites(product)} class="{$authedUser?.id && Object.keys(product.pricing).length > 0 ? "" : "hidden"} absolute top-6 right-6">
                <Icon icon={$myFavorites.find(x=> x === product.stockId) ? "mdi:heart" : "mdi:heart-outline"} class="text-2xl text-primary-500"/>
            </button>
            <div class=" w-10/12 ">
                <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`} class=" text-xs sm:text-sm font-semibold text-primary-500 hover:underline">{product?.productName  || ""}</a>
            </div>
            <div class=" flex items-start gap-2 md:gap-8">
                <!-- <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`}> -->
                <div class="relative">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img 
                src="{PUBLIC_IMAGE_URL}/{product?.image}"
                onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
                class="cursor-pointer w-32 h-32 sm:w-40 sm:h-40 object-contain" 
                alt=""
                on:click={() => imagemodal(product?.image)}
                on:mouseenter={() => handleMouseEnter(product?.image , index)}
                on:mouseleave={handleMouseLeave}
              />
            
               {#if hoveredItem && hoveredItem.image === product?.image && hoveredItem.index === index}
                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 whitespace-nowrap text-xs text-description font-medium py-1 px-4 rounded-md shadow-lg border leading-snug bg-black text-white"
                >
                  Click to view <br />larger image
                  <div
                    class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"
                  ></div>
                </div>
              {/if}

                {#if showimage}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						on:click={(e) => {
							if (e.target === e.currentTarget) {
								showimage = false;
							}
						}}
						class="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-xs flex items-center justify-center z-50">
						<div class="bg-white rounded-lg shadow-md p-6 mx-4 w-full xs:w-2/3 md:w-1/2 lg:w-2/5">
							<div class="flex justify-end items-center mb-2">
								<button
									on:click={closePopup}
									class="rounded hover:bg-slate-200 duration-200"
								>
									<Icon icon="si:close-duotone" class="text-3xl text-red-600" />
								</button>
							</div>
							<!-- svelte-ignore a11y-img-redundant-alt -->
							<img src="{PUBLIC_IMAGE_URL}/{selectedImage}" alt="image" class=" w-56 h-56 md:w-96 md:h-96 mx-auto object-contain" />
						</div>
					</div>
				{/if}
                <!-- </a> -->
                </div>
                <div class=" text-xs md:text-sm space-y-1 grow font-medium">
                    <p>Product Number : <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`} class=" font-semibold hover:text-primary-500 hover:underline">{product?.productNumber || ""}</a></p>
                    <p>Category : <a href={`/products/${categoryName}`} class=" font-semibold hover:text-primary-500 hover:underline">{product?.categoryDetails.name || ""}</a></p>
                    <p>Sub Category : <span class=" font-semibold ">{product?.subCategoryDetails.name || ""}</span></p>
                    <p>Manufacturer : <span class=" font-semibold ">{product?.manufacturerDetails.name || ""}</span></p>
                    <!-- <p>Price : <span class=" font-semibold">{$currencyState === "inr" ? "₹" + product?.pricing.INR.toLocaleString("en-IN"): "$"+ product?.pricing.USD.toLocaleString("en-IN")}</span></p> -->
                    {#if product?.pricing && Object.keys(product.pricing).length > 0}
                    <p>Size : <span class=" font-semibold">{product?.pricing?.break || ""}</span></p>
                    <div class=" hidden sm:flex items-center justify-between">
                        <p class=" font-bold text-4s">{$currencyState === "inr" ? "₹" + product?.totalPrice?.priceINR?.toLocaleString("en-IN"): "$"+ product?.totalPrice?.priceUSD?.toLocaleString("en-IN")}</p>
                        <div class="flex items-center">
                            <div class="flex items-center">
                                <input type="number" bind:value={product.quantity}
					            on:input={e=>handleQty(product._id,parseInt(e.target.value))}
					            class="{tog === index ? "" : "hidden"} border-1 border-gray-200 rounded outline-none text-xs p-2 font-medium focus:ring-0 focus:border-primary-400" min="1" max="10000000">
					        <div class=" {tog === index ? "hidden" : ""} flex items-center border-1 border-primary-300 rounded">
						    <button
							on:click={() => decrementQuantity(product._id)}
							class=" p-2.5 disabled:bg-gray-200 disabled:text-white text-primary-500"
							><Icon icon="rivet-icons:minus" class="text-xs" /></button>
						    <button on:click={async()=>{
                                tog = index
                                }} class="w-fit px-3 py-1 text-sm font-medium outline-none text-center">
							    {product.quantity}
						    </button>
						    <button
							    on:click={() => incrementQuantity(product._id)}
							    class=" p-2.5 disabled:bg-gray-200 disabled:text-white text-primary-500">
							    <Icon icon="rivet-icons:plus" class="text-xs" />
						    </button>
					        </div>
                            </div>
                        </div>
                        <button type="button" on:click={()=>addToCart(product)} class="text-xs flex items-center gap-1 sm:text-sm px-3 py-1 sm:p-1.5 sm:px-5 border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 rounded transition ease-in-out duration-300">
                            <Icon icon="mdi:cart" class="text-xl" />
                            Add to Cart
                        </button>
                    </div>
                    {:else if product?.variants?.length > 0}
                    <a href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`}>
                        <button class="bg-primary-500 py-2 px-3 hover:bg-primary-500 rounded text-sm text-white mt-2">
                          View variants
                        </button>
                      </a>                      
                    {:else}
                    <div>
                        <p class="text-gray-700 text-sm">
                          The price for this product is unavailable. Please request a quote
                        </p>
                        <button
                          on:click={() => toggleQuoteModal(product)}
                          class="bg-primary-500 py-2 px-3 hover:bg-primary-500 rounded text-sm text-white mt-2"
                        >
                          Request Quote
                        </button>
                      </div>
                    {/if}
                </div>
            </div>
            {#if product?.pricing && Object.keys(product.pricing).length > 0}
            <div class=" flex sm:hidden items-center justify-between">
                <p class=" text-xs font-bold">{$currencyState === "inr" ? "₹" + product?.totalPrice?.priceINR?.toLocaleString("en-IN"): "$"+ product?.totalPrice?.priceUSD?.toLocaleString("en-IN")}</p>
                <div class="flex items-center">
                    <div class="flex items-center">
                        <input type="number" bind:value={product.quantity}
					on:input={e=>handleQty(product._id,parseInt(e.target.value))}
					class="{tog === index ? "" : "hidden"} border-1 border-gray-200 rounded outline-none text-xs p-2 font-medium focus:ring-0 focus:border-primary-400" min="1" max="10000000">
					<div class=" {tog === index ? "hidden" : ""} flex items-center border-1 rounded">
						<button
							on:click={() => decrementQuantity(product._id)}
							class=" border-r-1 p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500"
							><Icon icon="rivet-icons:minus" class="text-xs" /></button
						>
						<button on:click={async()=>{
                            tog = index
                        }} class="w-fit px-3 py-0.5 text-sm font-medium outline-none text-center">
							{product.quantity}
						</button>
						<button
							on:click={() => incrementQuantity(product._id)}
							class=" border-l-1 p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500">
							<Icon icon="rivet-icons:plus" class="text-xs" />
						</button>
					</div>
                    </div>
                </div>
                <button type="button" on:click={()=>addToCart(product)} class=" text-xs sm:text-sm px-3 py-1 flex items-center gap-1 sm:p-1.5 border-1 border-primary-500 text-primary-500 bg-white font-medium hover:text-white hover:bg-primary-500 rounded ">
                    <Icon icon="mdi:cart" class="text-xl" />
                    <span class="hidden xs:block">Add to Cart</span>
                </button>
            </div>
              {/if}
        </div>
       {/each}
       {/if}
       
       <!-- pagination -->
       <div class=" w-fit gap-1 sm:gap-1.5  mx-auto {totalPages <= 1 || productCount <= 10 ? "hidden": "flex"}">
      <button class="border shadow-md  bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        on:click={() => goToPage(1)} 
        disabled={currentPage == 1}
      >
      <Icon icon="charm:chevrons-left" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
      </button>
        <button class="border shadow-md  bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          on:click={() => goToPage(currentPage - 1)} 
          disabled={currentPage == 1}
        >
        <Icon icon="ic:round-chevron-left" class="p-1 sm:p-2 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
      
        {#each getPageNumbers(currentPage,totalPages) as page}
          <button
            on:click={() => goToPage(page)}
            class="{page === currentPage ? "text-white bg-primary-500 border-primary-500" : "border-gray-300 bg-white"}  border shadow-md  rounded-md px-2.5 sm:px-3.5 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {page}
          </button>
        {/each}
      
        <button class=" border shadow-md bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage == totalPages}
        >
        <Icon icon="charm:chevron-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
        <button class=" border shadow-md bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          on:click={() => goToPage(totalPages)}
          disabled={currentPage == totalPages}
        >
        <Icon icon="charm:chevrons-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
      </div>
    </div>

</section>
{#if showQuoteModal}
  <ShowQuoteModal {data} {profile} {toggleQuoteModal} {form5} {productQuote} />
{/if}