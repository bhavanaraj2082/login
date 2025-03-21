<script>
	import { sendMessage } from '$lib/utils.js';
	import { myFavorites } from '$lib/stores/favorites.js';
	import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    import { toast, Toaster } from "svelte-sonner";
    import { writable } from 'svelte/store';
    import { authedUser, cartTotalComps, currencyState } from '$lib/stores/mainStores.js'
    import Icon from "@iconify/svelte";
    import Calender from '$lib/components/Calender.svelte';

    export let data;
    // console.log('favdata==>>', data)
    let form;
    
    $: isAuthenticated = !!data?.locals?.user?.email;
    
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
            image: item.productInfo.imageSrc || '/default-product-image.jpg',
            manufacturerName: item.manufacturerInfo?.name || 'Unknown Manufacturer',
            distributorName: item.distributorInfo?.aliasName || 'Direct Supply',
            stockInfo: {
                id: item.stockInfo?.stockId,
                pricing: item.stockInfo?.pricing,
                specification: item.stockInfo?.specification,
                orderMultiple: item.stockInfo?.orderMultiple || 1,
                stock: parseInt(item.stockInfo?.stock) || 0
            },
            manufacturerInfo: {
                id: item.manufacturerInfo?.manufacturerId
            },
            distributorInfo: {
                id: item.distributorInfo?.distributorId,
            },
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
            toast.error('From date cannot be later than To date');
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
$: totalPages = Math.ceil(filteredFavorites.length / $itemsPerPage);
$: pageNumbers = getPageRange($currentPage, filteredFavorites.length);
$: paginatedFavorites = getPaginatedData(filteredFavorites, $currentPage, $itemsPerPage);

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

    let timeout
    function handleQty(item,quantity){
        if(isNaN(quantity)){
            return
        }
        if(quantity >10000000) quantity = 10000000
         clearTimeout(timeout)
         timeout = setTimeout(()=>{
         let selectedQty = Math.ceil(quantity/ item.stockInfo.orderMultiple) * item.stockInfo.orderMultiple;
         console.log(quantity);
         item.quantity = selectedQty
         tog = null
         },1400);
    }

    function increaseQuantity(item) {
       // const maxQuantity = Math.floor(item.stockInfo.stock / item.stockInfo.orderMultiple) * item.stockInfo.orderMultiple;
       // if (item.quantity + item.stockInfo.orderMultiple <= maxQuantity) {
            item.quantity += item.stockInfo.orderMultiple;
            favData = [...favData];
        // } else {
        //     toast.warning("Maximum stock reached", { 
        //         description: `Only ${maxQuantity} items available in multiples of ${item.stockInfo.orderMultiple}` 
        //     });
        // }
    }

    function decreaseQuantity(item) {
        if (item.quantity > item.stockInfo.orderMultiple) {
            item.quantity -= item.stockInfo.orderMultiple;
            favData = [...favData];
        }
    }

    function handleAddToCart() {

    return async ({ result }) => {
        try {
            // console.log(result);
            if (result.type === 'success') {
                toast.success("Added to Cart", { 
                    description: `Product added successfully` 
                });
            }
        //await update();
        form.requestSubmit();
        } catch (error) {
            // console.error('Error handling cart update:', error);
            toast.error("Cart Error", { 
                description: result.data?.message || "Failed to add item to cart" 
                // description: "Failed to process cart update" 
            });
        }
    };
}

    function handleAddAllToCart() {
        // const availableItems = favData.filter(item => item.stockInfo.stock > 0);
        
        // if (availableItems.length === 0) {
        //     toast.info("No Available Items", { 
        //         description: "All favourite items are out of stock" 
        //     });
        //     return;
        // }
        return async ({ result, update }) => {
            
            if (result.type === 'success') {
                toast.success("All available items added to cart", { 
                    description: "Added all items that are in stock to your cart" 
                });
            } else {
                toast.error("Cart Error", { 
                    description: result.data?.message || "Failed to add items to cart" 
                });
            }
            form.requestSubmit();
        };
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
           // console.error('Error handling cart update:', error);
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
        fetchMyFav()
        invalidate("data:fav")
    };
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
<!-- {#if !isAuthenticated}
<div class="p-6 max-w-7xl mx-auto w-11/12">
    <div class="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg shadow-sm">
        <div class="flex items-center">
            <div class="ml-4">
                <h3 class="text-lg font-medium text-primary-800">
                    Login Required
                </h3>
                <p class="mt-1 text-sm text-primary-600">
                    Please login to view and manage your favorites list.
                </p>
                <div class="mt-4">
                    <a href="/login"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        Login to continue
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
{:else} -->
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
                class="w-full h-10 border border-gray-400 focus:ring-0 focus:border-primary-500 rounded px-4 py-2 pl-10 text-sm outline-none transition-all duration-200" 
                value={filters.searchTerm} 
                on:input={handleSearch}/>
            {#if filters.searchTerm}
                <button 
                    type="button" 
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded" 
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
                action="?/addAllToCart"
                use:enhance={handleAddAllToCart}>
                <input type="hidden" name="items" value={JSON.stringify(
                    favData
                        .filter(item => item.stockInfo.stock > 0)
                        .map(item => ({
                            productId: item.id,
                            stockId: item.stockInfo.id,
                            manufacturerId: item.manufacturerInfo.id,
                            distributorId: item.distributorInfo.id,
                            quantity: item.quantity
                        })))} />
                <button 
                    type="submit"
                    class="flex w-full bg-primary-500 items-center space-x-1 text-white hover:scale-95 transition-all duration-300 hover:bg-primary-500 border-primary-500 px-5 py-2.5 rounded whitespace-nowrap">
                    <Icon icon="heroicons-solid:shopping-cart" width="20" />
                    <span class=" md:text-sm font-medium text-xs">Add All to Cart</span>
                </button>
            </form>
            <form 
                method="POST" 
                action="?/removeAllItem"
                use:enhance={handleClearAll}>
                <button 
                    type="submit" 
                    class="flex w-full bg-red-600 items-center space-x-1 text-white hover:scale-95 transition-all duration-300 border-red-500 px-5 py-2.5 rounded whitespace-nowrap">
                    <Icon icon="mdi:delete-forever" width="20" />
                    <span class=" font-medium md:text-sm text-xs">Remove All</span>
                </button>
            </form>
        </div>
    </div>
    <div class="space-y-2">
        {#if !paginatedFavorites.length}
            <div class="w-full md:w-full border rounded border-primary-400 bg-white items-center px-4 py-8 md:col-span-2">
                <p class="text-center text-gray-500">No related items found</p>
            </div>
		{:else}
            {#each paginatedFavorites as item,index}
                <div class="flex flex-col md:flex-row items-center justify-between p-6 border bg-white border-gray-200 rounded w-full shadow">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    class=" w-32 h-32 object-cover rounded-md mb-3 md:mb-0 md:mr-4"/>
                
                <div class="flex-1 text-center md:text-left space-y-0.5">
                    <h2 class="text-sm font-bold text-gray-800">{item?.name || ''}</h2>
                    <!-- <div class=" w-10/12 ">
                        <a href={`/products/details/${item?.partNumber}`} class=" text-xs sm:text-sm font-semibold text-primary-500 hover:underline">{item?.partNumber || ""}</a>
                    </div> -->
                    <p class="text-sm">
                        <span class="font-semibold">Product Number:</span> <a href={`/products/details/${item?.partNumber}`} class=" text-xs sm:text-sm font-semibold text-primary-500 hover:underline">{item?.partNumber || ""}</a>
                    </p>
                    <p class="text-sm">
                        <span class="font-semibold">Manufacturer:</span> {item?.manufacturerName || ''}
                    </p>
                    <p class="text-sm">
                        <span class="font-semibold">Distributor:</span> {item?.distributorName || ''}
                    </p>
                    <p class="text-sm font-semibold">
                        Price: <span class="text-black">
                            { $currencyState === "usd" 
                                ? `$${item.stockInfo.pricing.USD.toLocaleString("en-IN")}` 
                                : item.stockInfo.pricing?.INR 
                                    ? `₹${item.stockInfo.pricing.INR.toLocaleString("en-IN")}` 
                                    : 'Price not available'}
                        </span>
                    </p>
                    {#if item.stockInfo.specification}
                        <p class="text-sm font-semibold">
                            Specification: <span class=" font-normal">{item.stockInfo?.specification}</span>
                        </p>
                    {/if}
                </div>
                <div class="flex pl-2 justify-start md:w-1/4 sm:items-center m-1 p-2 rounded sm:justify-center">
                    <div class="flex flex-col items-start">
                        <p class="font-semibold" 
                           class:text-green-600={item.stockInfo.stock > 0} 
                           class:text-red-600={item.stockInfo.stock === 0}>
                            <span class="text-gray-500 text-xs">Available Stock:</span> {item.stockInfo?.stock || 0}
                        </p>
                        <p class="{item.quantity > item.stockInfo.stock ? "" : "hidden"} text-xs font-semibold text-gray-500">Back Order: <span class=" text-sm text-red-500">{item.quantity > item.stockInfo.stock ? item.quantity - item.stockInfo.stock : 0}</span></p>
                        {#if item.stockInfo.orderMultiple > 1}
                            <p class="text-xs text-gray-500">
                                Order Multiple: {item.stockInfo?.orderMultiple}
                            </p>
                        {/if}
                    </div>
                </div>
                <div class="flex flex-col md:items-end items-center mt-4 md:mt-0 space-y-4">
                    <div class="flex md:flex-col lg:flex-row gap-3 space-x-4 relative">
                     {#if item.stockInfo.stock > 0}
                        <form 
                        method="POST" 
                        action="?/addItemToCart"
                        use:enhance={handleAddToCart}>
                        <input type="hidden" name="itemData" value={JSON.stringify({
                        productId: item.id,
                        stockId: item.stockInfo.id,
                        manufacturerId: item.manufacturerInfo.id,
                        distributorId: item.distributorInfo.id,
                        quantity: item.quantity,
                        backOrder:item.quantity > item.stockInfo.stock ? item.quantity - item.stockInfo.stock : 0
                    })} />
                        <button 
                            type="submit" 
                            class="flex bg-primary-500 items-center text-white hover:scale-95 transition-all duration-300 border-primary-500 px-2.5 py-2 rounded"
                            disabled={item.stockInfo.stock <= 0}>
                            <Icon 
                            icon="heroicons-solid:shopping-cart" 
                            class="text-xl" 
                            aria-label="Add to Cart Icon" />
                            <span class="hidden text-xs font-medium md:inline">Add to Cart</span>
                           
                        </button>
                    </form>
                        {/if}
                        <form 
                            method="POST" 
                            action="?/removeItem"
                            use:enhance={handleRemoveItem}>
                            <input type="hidden" name="itemId" value={item.id} />
                            <button 
                                type="submit" 
                                class="flex bg-red-600 items-center text-white hover:scale-95 transition-all duration-300 border-red-600 px-2.5 py-2 rounded">
                                <Icon icon="mdi:delete-forever" class="text-xl" aria-label="Remove Icon" />
                                <span class="hidden text-xs font-medium md:inline">Remove</span>
                            </button>
                        </form>
                    </div>
                    <div class="flex items-center">
                    <input type="number" bind:value={item.quantity}
                    
                    class="{tog === index ? "" : "hidden"} border-1 border-gray-200 rounded outline-none text-xs p-2 font-medium focus:ring-0 focus:border-primary-400" min="1" max="10000000">   
                    <div class=" {tog === index ? "hidden" : ""} flex items-center justify-center md:justify-start space-x-4">
                        <button 
                            on:click={() => decreaseQuantity(item)} 
                            class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            disabled={item.quantity <= item.stockInfo.orderMultiple}>
                            -
                        </button>
                        <button class="text-sm font-medium">{item.quantity}</button>
                        <button 
                            on:click={() => increaseQuantity(item)} 
                            class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            +
                        </button>
                    </div>
                    </div>
                    {#if item.stockInfo.pricing}
                        <p class="text-sm font-semibold text-gray-800">
                            Total: { $currencyState === "usd" 
                                ? `$${(item.stockInfo.pricing.USD * item.quantity).toLocaleString("en-IN")}`
                                : `₹${(item.stockInfo.pricing.INR * item.quantity).toLocaleString("en-IN")}`}
                        </p>
                    {:else}
                        <p class="text-sm font-semibold text-gray-800">
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
<!-- {/if} -->