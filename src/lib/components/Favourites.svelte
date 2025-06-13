<script>
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import { sendMessage } from '$lib/utils.js';
	import { myFavorites } from '$lib/stores/favorites.js';
	import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import { toast, Toaster } from "svelte-sonner";
    import { writable } from 'svelte/store';
    import { authedUser, cartTotalComps, currencyState } from '$lib/stores/mainStores.js'
    import Icon, { addAPIProvider } from "@iconify/svelte";
    import Calender from '$lib/components/Calender.svelte';

    export let data;
    // console.log('favdata==>>', data)
    let form;
    let fav = writable([])
    // $: isAuthenticated = !!data?.locals?.user?.email;
    
    const fetchMyFav = ()=>{
        const formdata = new FormData()
		sendMessage("/?/getFavorites",formdata,async(result)=>{
			console.log(result.favorite);
			myFavorites.set(result.favorite)
			localStorage.setItem("myfavorites",JSON.stringify(result.favorite))
		})
    }

    $: favData = data?.favorites?.length ? data.favorites.map(item => {
    if (!item?.productInfo?.productId) return null;		
        return {
            id: item.productInfo.productId,
            name: item.productInfo.productName,
            description: Array.isArray(item.productInfo.description) 
                ? item.productInfo.description[0] 
                : typeof item.productInfo.description === 'string'
                ? item.productInfo.description
                : 'No description available',
            partNumber: item.productInfo.productNumber,
            image: item.productInfo.image || '/default-product-image.jpg',
            manufacturerName: item.manufacturerInfo?.name || 'Unknown Manufacturer',
            distributorName: item.distributorInfo?.aliasName || 'Direct Supply',
            stockInfo: item.stockInfo,
            manufacturerInfo: {
                id: item.manufacturerInfo?.manufacturerId
            },
            distributorInfo: {
                id: item.distributorInfo?.distributorId,
            },
            specIndex:0,
            quantity: parseInt(item.quantity) || 1,
            createdAt: item.createdDate || new Date(),
        };
    }).filter(Boolean) : [];
    // $:console.log("favData====>",favData)

    let calendarComponent;

    let currentPage = writable(1);
    let itemsPerPage = writable(10);
    const DOTS = '...';
    const VISIBLE_PAGES = 7;
    let tog = null
    let isDeleteAll = false

    let filters = {
        searchTerm: '',
        dateFrom: '',
        dateTo: ''
    };


function filterFavorites(items, filterCriteria) {
    return items.filter((item) => {
        const searchTerm = filterCriteria.searchTerm.toLowerCase().trim();
        const matchesSearch =
            !searchTerm ||
            (item.name && item.name.toLowerCase().includes(searchTerm)) ||
            (item.partNumber && item.partNumber.toLowerCase().includes(searchTerm)) ||
            (item.manufacturerName && item.manufacturerName.toLowerCase().includes(searchTerm));

        let matchesDateRange = true;

        if (item.createdAt) {
            const createdDate = new Date(item.createdAt);
            
            if (filterCriteria.dateFrom) {
                const fromDate = new Date(filterCriteria.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                matchesDateRange = matchesDateRange && createdDate >= fromDate;
            }

            if (filterCriteria.dateTo) {
                const toDate = new Date(filterCriteria.dateTo);
                toDate.setHours(23, 59, 59, 999);
                matchesDateRange = matchesDateRange && createdDate <= toDate;
            }
        }

        return matchesSearch && matchesDateRange;
    });
}

function getEarliestFavoriteDate(items) {
    if (!items || items.length === 0) {
        return new Date('2024-01-01');
    }

    const earliestDate = items.reduce((earliest, current) => {
        const currentDate = new Date(current.createdAt);
        return !earliest || currentDate < earliest ? currentDate : earliest;
    }, null);

    if (earliestDate) {
        earliestDate.setHours(0, 0, 0, 0);
    }
    return earliestDate;
}

function handleDateChange(event) {
    // console.log("Date change event:", event.detail);
    const { dates } = event.detail;
    
    if (dates) {
        updateFilters('dateFrom', dates.from);
        updateFilters('dateTo', dates.to);
    }
}

function updateFilters(key, value) {
    if (!value) {
        filters[key] = '';
        currentPage.set(1);
        return;
    }

    if (key === 'dateFrom' && filters.dateTo) {
        const fromDate = new Date(value);
        const toDate = new Date(filters.dateTo);
        if (fromDate > toDate) {
            // toast.error('From date cannot be later than To date');
            return;
        }
    }

    if (key === 'dateTo' && filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(value);
        if (toDate < fromDate) {
            toast.error('To date cannot be earlier than From date');
            return;
        }
    }

    filters[key] = value;
    currentPage.set(1);
}

function handleSearch(event) {
    const searchValue = event.target.value.trim() || '';
    filters.searchTerm = searchValue;
    currentPage.set(1);
}

function clearSearch() {
    filters.searchTerm = '';
    currentPage.set(1);
}

function getPageRange(current, total) {
    const range = [];
    const totalPages = Math.ceil(total / $itemsPerPage);

    if (totalPages <= VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    let start = Math.max(2, current - Math.floor(VISIBLE_PAGES / 2));
    let end = Math.min(totalPages - 1, start + VISIBLE_PAGES - 3);

    if (current > totalPages - 2) {
        start = totalPages - VISIBLE_PAGES + 1;
        end = totalPages - 1;
    }
    if (current <= 2) {
        start = 2;
        end = Math.min(VISIBLE_PAGES - 1, totalPages - 1);
    }

    if (start > 2) {
        range.push(DOTS);
    }
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    if (end < totalPages - 1) {
        range.push(DOTS);
    }
    if (totalPages > 1) {
        range.push(totalPages);
    }
    return range;
}

function getPaginatedData(items, currentPageNum, itemsPerPageNum) {
    const startIndex = (currentPageNum - 1) * itemsPerPageNum;
    const endIndex = startIndex + itemsPerPageNum;
    return items.slice(startIndex, endIndex);
}

function handlePageChange(page) {
    if (page >= 1 && page <= totalPages && page !== $currentPage) {
        currentPage.set(page);
    }
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' && $currentPage > 1) {
        handlePageChange($currentPage - 1);
    } else if (event.key === 'ArrowRight' && $currentPage < totalPages) {
        handlePageChange($currentPage + 1);
    }
}

$: filteredFavorites = filterFavorites(favData, filters);
$: totalPages = Math.ceil(favData.length / $itemsPerPage);
$: pageNumbers = getPageRange($currentPage, filteredFavorites.length);
$: paginatedFavorites = getPaginatedData(filteredFavorites, $currentPage, $itemsPerPage);
$:fav.set(paginatedFavorites)

function calculateTotalPrice(price, quantity) {
    if (!price || price === 'Price not available') return 'N/A';
    
    let numericPrice;
    if (typeof price === 'number') {
        numericPrice = price;
    } else if (typeof price === 'string') {
        numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    } else {
        return 'N/A';
    }
    
    return isNaN(numericPrice) ? 'N/A' : (numericPrice * quantity).toLocaleString("en-IN");
}

    let timeout,hid = false
    function handleQty(item,quantity){
        clearTimeout(timeout)
            hid =true
        if(isNaN(quantity) || quantity <= 0){
            quantity = 1
        }
        if(quantity >= 100) quantity = 100
         timeout = setTimeout(()=>{
            let selectedQty = Math.ceil(quantity/ item.stockInfo[0].orderMultiple) * item.stockInfo[0].orderMultiple;
        //if(selectedQty >= 100) selectedQty = 100
        console.log(selectedQty,"qty");
         item.quantity = selectedQty
         favData = [...favData];
         tog = null
         hid = false
         },1200);
    }

    function increaseQuantity(item,orderMultiple) {
               if(item.quantity >= 100){
                return
               }
              item.quantity = parseInt(item.quantity) + orderMultiple;
            favData = [...favData];
    }

    function decreaseQuantity(item,orderMultiple) {
        
        if (item.quantity > orderMultiple) {
            item.quantity = parseInt(item.quantity) - orderMultiple;
            favData = [...favData];
        }
    }

    function handleAddAllToCart() {
        // const availableItems = favData.filter(item => item.stockInfo.stock > 0);
        
        // if (availableItems.length === 0) {
        //     toast.info("No Available Items", { 
        //         description: "All favourite items are out of stock" 
        //     });
        //     return;
        // }
       
    }

    function handleRemoveItem() {
    return async ({ result }) => {
        console.log(result);
        try{
        if (result.type === 'success') {
            toast.success('Item removed', {
                description: `Product removed from favourites`
            });
        }
        fetchMyFav()
        invalidate("data:fav")
    }
        catch (error) {
            toast.error("Cart Error", { 
                description: result.data?.message || "Failed to add item to cart"  
            });
        }
    };
    }
    function handleDataCart() {
    return async ({ result }) => {
        const totalComps = result.data?.cart[0]?.cartItems.length;
        localStorage.setItem("totalCompsChemi", totalComps);        
        syncLocalStorageToStore();
    };
    }

    function syncLocalStorageToStore() {
    if (typeof window !== "undefined") {
        const storedTotalComps = localStorage.getItem("totalCompsChemi");
        if (storedTotalComps) {
            cartTotalComps.set(Number(storedTotalComps));
        }
    }
    }

    function handleClearAll() {
    return async ({ result }) => {
        if (result.type === 'success') {
            favData = [];
            toast.success('Favourites cleared', {
                description: 'All items removed from favourites'
            });
        } else {
            toast.error('Clear Failed', {
                description: result.data?.message || 'Failed to clear favourites'
            });
        }
        isDeleteAll = false
        fetchMyFav()
        invalidate("data:fav")
    };
    }
    let selectedImage = null;
	let showimage=false;
	function imagemodal(imageSrc) {
		selectedImage = imageSrc;
		showimage=true;
	}
	function closePopup() {
		showimage = false;
		selectedImage = null;
	}

onMount(() => {
    const earliestDate = getEarliestFavoriteDate(favData);
});


</script> 

<form
	method="POST"
	action="/?/getCartData"
	bind:this={form}
	use:enhance={handleDataCart}>
	<input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>
<div class="pb-10 max-w-7xl mx-auto w-11/12">
    <h1 class="sm:text-2xl text-xl font-bold mb-4 md:mb-6">My Favourites</h1>
    {#if !favData || favData.length === 0}
    <div class="flex flex-col items-center justify-center py-12 px-4 border bg-white border-primary-200 rounded-md pb-6">
        <Icon icon="bi:calendar-heart-fill" class="text-primary-300 mb-4 sm:text-5xl font-bold text-3xl" />
        <h2 class="sm:text-xl text-base font-semibold flex justify-center items-center text-gray-700 mb-2">
            Your favourites list is empty
        </h2>
        <p class="text-gray-500 sm:text-sm text-xs text-center mb-6">
            Browse our products and add items to your favourites to see them here.
        </p>
        <a href="/products" 
           class="flex items-center justify-center sm:px-4 sm:py-2 px-2 py-1 sm:text-sm text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
            <Icon icon="game-icons:chemical-tank" class="mr-2 sm:text-xl text-xs" />
            Browse Products
        </a>
    </div>
    {:else}
    <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-4 w-full">
        <div class="w-full lg:w-4/12 xl:w-1/3 relative">
            <Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
            <input 
                type="text" 
                placeholder="Search by Name, Prouduct Number, or Manufacturer" 
                class="w-full h-10 border border-gray-400 focus:ring-0 focus:border-primary-500 rounded-md px-4 py-2 pl-10 text-sm outline-none transition-all duration-200" 
                value={filters.searchTerm} 
                on:input={handleSearch}/>
            {#if filters.searchTerm}
                <button 
                    type="button" 
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded-md" 
                    style="color: #cb1919" 
                    on:click={clearSearch}>
                    <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
                </button>
            {/if}
        </div>
        <div class="flex flex-col lg:flex-row lg:w-3/12 xl:w-1/3 w-full sm:flex-row gap-2 lg:items-center">
            <div class="relative w-full">
                <Calender
                    bind:this={calendarComponent}
                    minDate={getEarliestFavoriteDate(favData)}
                    on:dateChange={handleDateChange}
                    initialFilters={{
                        firstTimeOnly: false,
                        dateRange: 'custom',
                        from: filters.dateFrom || '',
                        to: filters.dateTo || ''
                    }}/>
            </div>
        </div>
        <div class="flex w-fit self-end space-x-4 items-center text-primary-400 overflow-hidden font-semibold">
            <form 
                method="POST" 
                action="?/addalltocart"
                use:enhance={({formData})=>{
                    formData.append("items",JSON.stringify(
                    favData.map(item => ({
                            productId: item.id,
                            stockId: item.stockInfo[item.specIndex]._id,
                            manufacturerId: item.manufacturerInfo.id,
                            distributorId: item.distributorInfo.id,
                            quantity: isNaN(item.quantity)|| item.quantity === 0 ? 1 : item.quantity
                        }))))
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            toast.success(result.data.message);
                        } else {
                            toast.error("Cart Error", { 
                                description: result.data?.message || "Failed to add items to cart" 
                            });
                        }
                        form.requestSubmit();
                    };
                }}>
                <button 
                    type="submit"
                    disabled={hid}
                    class="flex w-full bg-primary-500 items-center space-x-1 text-white hover:scale-95 transition-all duration-300 hover:bg-primary-500 border-primary-500 px-5 py-2.5 rounded-md whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <Icon icon="heroicons-solid:shopping-cart" width="20" />
                    <span class=" md:text-sm font-medium text-xs">Add All to Cart</span>
                </button>
            </form>
                <button 
                    type="button" on:click={()=>isDeleteAll = true}
                    class="{$fav.length === 0 ? "hidden" : ""} flex w-full bg-red-600 items-center space-x-1 text-white hover:scale-95 transition-all duration-300 border-red-500 px-5 py-2.5 rounded-md whitespace-nowrap">
                    <Icon icon="mdi:delete-forever" width="20" />
                    <span class=" font-medium md:text-sm text-xs">Remove All</span>
                </button>
        </div>
    </div>
    <div class="space-y-2">
        {#if !$fav.length}
            <div class="w-full md:w-full border rounded-md border-primary-400 bg-white items-center px-4 py-8 md:col-span-2">
                <p class="text-center text-gray-500">No related items found</p>
            </div>
		{:else}
            {#each $fav as item,index}
                <div class="flex w-full flex-col sm:flex-row gap-2 items-start xs:px-[30%] justify-between p-6 sm:p-3 md:p-6 border bg-white border-gray-200 rounded-md shadow">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img 
                    src="{PUBLIC_IMAGE_URL}/{item.image}"
                  onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
                  on:click={() => imagemodal(item.image)}
                    alt={item.name} 
                    class=" w-32 h-32 sm:w-20 sm:h-20 md:w-28 md:h-28 xl:w-32 xl:h-32 object-contain rounded-md-md mb-3 md:mb-0 md:mr-4"/>
                     
                <div class="flex-1 w-fit text-start md:text-left space-y-1">
                    <h2 class=" text-sm sm:text-2s md:text-xs lg:text-sm font-bold text-gray-800">
                        <a href={`/products/details/${item?.partNumber}`} class=" text-sm sm:text-2s md:text-xs lg:text-sm font-semibold text-primary-500 hover:underline transition-all duration-300">{item?.name || ""}</a>
                    </h2>
                    <!-- <div class=" w-10/12 ">
                        <a href={`/products/details/${item?.partNumber}`} class=" text-xs sm: text2sm sm:text-2s md:text-xs lg:text-sm font-semibold text-primary-500 hover:underline">{item?.partNumber || ""}</a>
                    </div> -->
                    <p class=" text-sm sm:text-2s md:text-xs lg:text-sm">
                        <span class="font-semibold">Product Number:</span> <a href={`/products/details/${item?.partNumber}`} class="text-sm sm:text-2s md:text-xs lg:text-sm font-semibold hover:text-primary-500 hover:underline transition-all duration-300">{item?.partNumber || ""}</a>
                    </p>
                    <p class=" text-sm sm:text-2s md:text-xs lg:text-sm">
                        <span class="font-semibold">Manufacturer:</span> {item?.manufacturerName || ''}
                    </p>
                    <p class=" text-sm sm:text-2s md:text-xs lg:text-sm">
                        <span class="font-semibold">Distributor:</span> {item?.distributorName || ''}
                    </p>
                    <p class=" text-sm sm:text-2s md:text-xs lg:text-sm font-semibold">
                        Price: <span class="text-black">
                            { $currencyState === "usd" 
                                ? `$${item.stockInfo[item.specIndex].pricing.USD.toLocaleString("en-IN")}` 
                                : item.stockInfo[item.specIndex].pricing?.INR 
                                    ? `₹${item.stockInfo[item.specIndex].pricing.INR.toLocaleString("en-IN")}` 
                                    : 'Price not available'}
                        </span>
                    </p>
                        <div class=" text-sm sm:text-2s md:text-xs lg:text-sm font-semibold flex gap-2">
                            Specification: 
                            {#each item.stockInfo as spec,index }
                            <button on:click={()=>{
                                   let search = $fav.find(x=>x.id === item.id)
                                   console.log(search);
                                   search.specIndex = index
                                   fav.set($fav)
                            }} class=" {index === item.specIndex ? " bg-primary-300" : " bg-gray-200"} text-xs sm:text-2s md:text-xs px-2 py-1 rounded">{spec.specification}</button>
                            {/each}
                        </div>
                </div>
                <div class="flex sm:pl-2 justify-start md:w-1/4 sm:items-center sm:p-2 rounded-md sm:justify-center">
                    <div class="flex flex-col items-start">
                        <p class="font-semibold" 
                           class:text-green-600={item.stockInfo[item.specIndex].stock > 0} 
                           class:text-red-600={item.stockInfo[item.specIndex].stock === 0}>
                            <span class="text-gray-500 text-xs sm:text-2s md:text-xs">Available Stock:</span> {item.stockInfo[item.specIndex]?.stock || 0}
                        </p>
                        <p class="{item.quantity > item.stockInfo[item.specIndex].stock ? "" : "hidden"} text-xs font-semibold text-gray-500">Back Order: <span class=" text-sm text-red-500">{item.quantity > item.stockInfo[item.specIndex].stock ? item.quantity - item.stockInfo[item.specIndex].stock : 0}</span></p>
                        {#if item.stockInfo[item.specIndex].orderMultiple > 1}
                            <p class="text-xs sm:text-2s md:text-xs text-gray-500">
                                Order Multiple: {item.stockInfo[item.specIndex]?.orderMultiple}
                            </p>
                        {/if}
                    </div>
                </div>
                <div class="flex flex-col md:items-end items-center mt-4 md:mt-0 space-y-4">
                    <div class="flex lg:flex-row gap-3 space-x-4 relative">
                   <form 
                        method="POST" 
                        action="?/addItemToCart"
                        use:enhance={({formData})=>{
                            formData.append("itemData",JSON.stringify({
                                productId: item.id,
                                stockId: item.stockInfo[item.specIndex]._id,
                                manufacturerId: item.manufacturerInfo.id,
                                distributorId: item.distributorInfo.id,
                                quantity: isNaN(item.quantity)|| item.quantity === 0 ? 1 : item.quantity,
                                backOrder:item.quantity > item.stockInfo[item.specIndex].stock ? item.quantity - item.stockInfo[item.specIndex].stock : 0
                            }))
                            return async ({ result }) => {
                                try {
                                     console.log(result);
                                    if (result.type === 'success') {
                                        toast.success(result.data.message);
                                    }
                                form.requestSubmit();
                                } catch (error) {
                                    toast.error("Cart Error", { 
                                        description: result.data?.message || "Failed to add item to cart" 
                                    });
                                }
                            };
                        }}>
                        <button 
                            type="submit" 
                            disabled={hid}
                            class="flex bg-primary-500 items-center text-white hover:scale-95 transition-all duration-300 border-primary-500 px-2.5 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                            <Icon 
                            icon="heroicons-solid:shopping-cart" 
                            class="text-xl sm:text-lg md:text-xl" 
                            aria-label="Add to Cart Icon" />
                            <span class="hidden text-xs font-medium lg:inline">Add to Cart</span>
                           
                        </button>
                    </form>
                        <form 
                            method="POST" 
                            action="?/removeItem"
                            use:enhance={({formData})=>{
                                formData.append("itemId",item.id)
                                 return async ({ result }) => {
                                     console.log(result);
                                    try{
                                        if (result.type === 'success') {
                                            toast.success('Item removed', {
                                                description: `Product removed from favourites`
                                            });
                                        }
                                        fetchMyFav()
                                        invalidate("data:fav")
                                    }
                                    catch (error) {
                                        toast.error("Cart Error", { 
                                            description: result.data?.message || "Failed to add item to cart"  
                                        });
                                    }
                                };
                            }}>
                            <button 
                                type="submit" 
                                class="flex bg-red-600 items-center text-white hover:scale-95 transition-all duration-300 border-red-600 px-2.5 py-2 rounded-md">
                                <Icon icon="mdi:delete-forever" class="text-xl sm:text-lg md:text-xl" aria-label="Remove Icon" />
                                <span class="hidden text-xs font-medium lg:inline">Remove</span>
                            </button>
                        </form>
                    </div>
                    <div class="flex items-center">
                    <input type="number" bind:value={item.quantity}
                     on:input={e=>handleQty(item,parseInt(e.target.value))}
                    class="{tog === index ? "" : "hidden"} border-1 w-40 border-gray-200 rounded-md outline-none text-xs p-2 font-medium focus:ring-0 focus:border-primary-400" min="1" max="100">   
                    <div class=" {tog === index ? "hidden" : ""} flex items-center w-40 justify-center md:justify-start border-1 rounded-md">
                        <button 
                            on:click={() => decreaseQuantity(item,item.stockInfo[item.specIndex].orderMultiple)} 
                            class="px-2 py-1.5 rounded-md text-primary-500 disabled:opacity-50"
                            disabled={item.quantity <= item.stockInfo[item.specIndex].orderMultiple}>
                            <Icon icon="rivet-icons:minus" class="text-xs" />
                        </button>
                        <button on:click={()=>tog = index} class="text-sm py-1.5 w-24 font-medium">{item.quantity}</button>
                        <button 
                            on:click={() => increaseQuantity(item,item.stockInfo[item.specIndex].orderMultiple)} 
                            class="px-2 py-1.5 rounded-md text-primary-500 disabled:opacity-50">
                            <Icon icon="rivet-icons:plus" class="text-xs" />
                        </button>
                    </div>
                    </div>
                    {#if item.stockInfo[item.specIndex].pricing}
                        <p class="text-sm sm:text-xs md:text-sm font-semibold text-gray-800">
                            Total: { $currencyState === "usd" 
                                ? `$${(item.stockInfo[item.specIndex].pricing.USD * item.quantity).toLocaleString("en-IN")}`
                                : `₹${(item.stockInfo[item.specIndex].pricing.INR * item.quantity).toLocaleString("en-IN")}`}
                        </p>
                    {:else}
                        <p class="text-sm sm:text-xs md:text-sm font-semibold text-gray-800">
                            Total: Price not available
                        </p>
                    {/if}
                </div>
                </div> 
            {/each}
        {/if}
    </div>
    {#if totalPages > 1}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-around border bg-white shadow px-4 py-4 rounded-b-md md:mt-2 my-1 md:m-0"
        aria-label="pagination"
        on:keydown={handleKeyDown}>
        <div class="flex items-center justify-center gap-2 flex-wrap">
            <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                on:click={() => handlePageChange(1)}
                disabled={$currentPage === 1}
                aria-label="First page">
                <Icon icon="charm:chevrons-left" class="w-4 h-4" />
            </button>
            <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                on:click={() => handlePageChange($currentPage - 1)}
                disabled={$currentPage === 1}
                aria-label="Previous page">
                <Icon icon="charm:chevron-left" class="w-4 h-4" />
            </button>
            {#each pageNumbers as page}
                {#if page === DOTS}
                    <span class="px-2 text-gray-500 text-sm font-medium">{DOTS}</span>
                {:else}
                    <button
                        class={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm shadow-sm border transition-all duration-200 transform ${
                            page === $currentPage
                                ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
                                : 'bg-white text-primary-700 border-gray-300 hover:bg-primary-500 hover:text-white active:scale-110'
                        }`}
                        on:click={() => handlePageChange(page)}
                        disabled={page === $currentPage}
                        aria-label="Go to page {page}"
                        aria-current={page === $currentPage ? 'page' : undefined}>
                        {page}
                    </button>
                {/if}
            {/each}
            <button
				class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
				on:click={() => handlePageChange($currentPage + 1)}
				disabled={$currentPage === totalPages}
				aria-label="Next page">
				<Icon icon="charm:chevron-right" class="w-4 h-4" />
			</button>
			<button
				class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
				on:click={() => handlePageChange(totalPages)}
				disabled={$currentPage === totalPages}
				aria-label="Last page">
				<Icon icon="charm:chevrons-right" class="w-4 h-4" />
			</button>
        </div>
     </div>
     {/if}
    {/if}
    <Toaster position="bottom-right" richColors />
</div>


{#if showimage}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={(e) => {
	if (e.target === e.currentTarget) {
	showimage = false;}
	}} class="fixed inset-0 bg-black shadow-xl bg-opacity-75 flex items-center justify-center z-50">
	<div class="bg-white rounded-lg shadow-lg p-6 mx-4 w-full md:w-1/2 lg:w-1/3">
	<div class="flex justify-end items-center mb-2">
		<button
		class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
		on:click={closePopup}>
		<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
	  </button>
   </div>
<img src="{PUBLIC_IMAGE_URL}/{selectedImage}" onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'"  alt="" class=" w-72 h-72 md:w-96 md:h-96 mx-auto bject-cover " /></div>
</div>
{/if}

{#if isDeleteAll}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={(e) => {
			if (e.target === e.currentTarget) {
				isDeleteAll = false;
			}
		}}
		class="fixed inset-0 bg-gray-400 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
		<div
			class="bg-white py-6 px-4 rounded-md flex flex-col shadow-lg w-11/12 sm:w-2/4 lg:w-96 space-y-2">
			<p class=" font-medium">Are you sure you want to delete all the components?</p>
			<div class="flex items-center gap-5">
                <form class=" w-full"
                method="POST" 
                action="?/removeAllItem"
                use:enhance={handleClearAll}>
                <button 
                    type="submit" 
                    class="flex justify-center w-full bg-red-600 space-x-1 text-white hover:scale-95 transition-all duration-300 border-red-500 px-5 py-2 rounded-md whitespace-nowrap">
                    Delete
                </button>
            </form>
				<button class=" w-full py-1.5 border-1 border-primary-500 text-primary-500 bg-white rounded" on:click={() => (isDeleteAll = false)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

