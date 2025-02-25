<script>
	// import { PUBLIC_COMPBUY_IMAGE_PATH } from '$env/static/public'
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	// import Popup from '$lib/components/AccountPage/Tabs/TooltipPopup.svelte';
	import { writable } from 'svelte/store';
	import Calender from '$lib/components/Calender.svelte';

	export let data;

	let initialOrders = [];
	let orders = [];
	// console.log("=========>",orders)
	let isInfoPopupOpen = false;
	let userOrderType = null;
	let calendarComponent;

	let filters = {
		status: '',
		searchTerm: '',
		orderType: null,
		firstTimeOnly: false,
        dateRange: 'custom'
	};

	$: isAnyFilterActive =
		filters.dateRange !== '' ||
		filters.status !== '' ||
		filters.searchTerm !== '';

	$: {
        if (data?.orders) {
            initialOrders = data.orders;
            const currentOrder = data.orders[0];
            if (currentOrder) {
                userOrderType = currentOrder.orderType;
                filters.orderType = currentOrder.orderType;
            }
            filterOrders();
        }
    }
	const handleOrderTypeChange = (type) => {
        if (type === userOrderType) {
            filters.orderType = type;
            filterOrders();
        }
    };

	const getEarliestOrderDate = (orders) => {
        if (!orders || orders.length === 0) return null;
        return new Date(Math.min(...orders.map(order => new Date(order.createdAt))));
    };

    const handleDateChange = (event) => {
        const { dates } = event.detail;
        filters.dateFrom = dates.from;
        filters.dateTo = dates.to;
        filterOrders();
    };

    const handleFilterChange = (event) => {
        const { filters: newFilters } = event.detail;
        filters = {
            ...filters,
            ...newFilters
        };
        filterOrders();
    };

	let currentPage = writable(1);
	let itemsPerPage = writable(3);
	let totalItems;

	const DOTS = '...';
	const VISIBLE_PAGES = 7;

	$: totalItems = orders.length;
	$: paginatedItems = getPaginatedData($currentPage, $itemsPerPage, orders);
	$: pageNumbers = getPageRange($currentPage, totalItems);
	$: totalPages = Math.ceil(totalItems / $itemsPerPage);

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

	function getPaginatedData(currentPageValue, itemsPerPageValue, tableData) {
		const startIndex = (currentPageValue - 1) * itemsPerPageValue;
		const endIndex = startIndex + itemsPerPageValue;
		return tableData.slice(startIndex, endIndex);
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

	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-IN', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			});
		} catch (e) {
			return 'Invalid Date';
		}
	};
	const isDateInRange = (date, fromDate, toDate) => {
		const checkDate = new Date(date);
		const start = fromDate ? new Date(fromDate) : null;
		const end = toDate ? new Date(toDate) : null;
		if (start) start.setHours(0, 0, 0, 0);
		if (end) end.setHours(23, 59, 59, 999);
		checkDate.setHours(0, 0, 0, 0);

		if (start && end) {
			return checkDate >= start && checkDate <= end;
		} else if (start) {
			return checkDate >= start;
		} else if (end) {
			return checkDate <= end;
		}
		return true;
	};

	const filterOrders = () => {
		let filteredOrders = [...initialOrders];

		if (filters.orderType) {
            filteredOrders = filteredOrders.filter(order => 
                order.orderType === filters.orderType
            );
        }

		if (filters.searchTerm && filters.searchTerm.trim() !== '') {
			const searchTermLower = filters.searchTerm.toLowerCase().trim();
			filteredOrders = filteredOrders.filter((order) => {
				const orderIdMatch = order.orderid?.toString().toLowerCase().includes(searchTermLower);
				const purchaseOrderMatch = order.purchaseorder
					?.toString()
					.toLowerCase()
					.includes(searchTermLower);
				const transactionIdMatch = order.transactionid
					?.toString()
					.toLowerCase()
					.includes(searchTermLower);

				return orderIdMatch || purchaseOrderMatch || transactionIdMatch;
			});
		}

		if (filters.dateFrom || filters.dateTo) {
			filteredOrders = filteredOrders.filter((order) =>
				isDateInRange(order.createdAt, filters.dateFrom, filters.dateTo)
			);
		}

		if (filters.status) {
			filteredOrders = filteredOrders.filter(
				(order) => order.status?.toLowerCase() === filters.status.toLowerCase()
			);
		}

		orders = filteredOrders;
		currentPage.set(1);
	};

	const updateFilters = (key, value) => {
		filters[key] = value;
		filterOrders();
	};
	const handleSearch = (event) => {
		filters.searchTerm = event.target.value;
		filterOrders();
	};

	const getProductUrl = (component) => {
		return `/products/details/${component.partUrl || component._id}`;
	};

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

	const clearFilters = () => {
		filters = {
			dateFrom: '',
			dateTo: '',
			status: '',
			searchTerm: '',
			orderType: filters.orderType
		};
		filterOrders();
	};

	function clearSearch() {
		filters = {
			searchTerm: ''
		};
        filterOrders();
	}

	onMount(() => {
		filterOrders();
	});
	function openInfoPopup() {
		isInfoPopupOpen = true;
	}
	function closeInfoPopup() {
		isInfoPopupOpen = false;
	}

	let hoveredImageId = null; 
	let hoveredimageindex = null;

  	function handleMouseEnter(imageId, imgidx) {
  	  hoveredImageId = imageId;
		hoveredimageindex = imgidx;
  	}

  	function handleMouseLeave() {
  	  hoveredImageId = null;
		hoveredimageindex = null;
  	}
</script>

<div class="my-6">
	<div class="flex flex-wrap gap-4 mb-6 items-center">
		<div class="flex-1 min-w-md">
			<div class="relative">
				<Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
				<input
					type="text"
					placeholder="Search by Order Number or Purchase Order Number"
					class="w-full border rounded px-4 py-2 pl-10 focus:ring-0 focus:border-primary-500 transition-all outline-none duration-200"
					value={filters.searchTerm}
					on:input={handleSearch}/>
				{#if filters.searchTerm}
					<button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded" style="color: #cb1919" on:click={clearSearch}>
						<Icon icon="oui:cross" width="16" height="16" class="font-bold" />
					</button>
				{/if} 
			</div>
		</div>
		<div class="flex-1 max-w-[290px] mr-2">
			<Calender
		bind:this={calendarComponent}
		minDate={getEarliestOrderDate(initialOrders)}
		on:dateChange={handleDateChange}
		on:filterChange={handleFilterChange}
		initialFilters={{
			firstTimeOnly: false,
			dateRange: 'custom'
		}} />
		</div> 
		<button
			class="border border-primary-500 flex items-center px-2 py-2 rounded hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			on:click={clearFilters}
			disabled={!isAnyFilterActive}>
			<Icon icon="hugeicons:filter-remove" class="mr-2 hover:text-white" width="20" height="20" />
			<span class="text-sm">Clear</span>
		</button>
	</div>
	<div class="mb-6 flex items-center gap-6">
        <label class="inline-flex items-center {userOrderType === 'company' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
            <input 
                type="radio" 
                class="form-radio text-primary-600 h-4 w-4" 
                name="orderType" 
                checked={filters.orderType === 'my'}
                disabled={userOrderType === 'company'}
                on:change={() => handleOrderTypeChange('my')} />
            <span class="m-2 md:text-md text-xs">My Orders</span>
        </label>
        <label class="inline-flex items-center {userOrderType === 'my' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
            <input 
                type="radio" 
                class="form-radio text-primary-600 h-4 w-4" 
                name="orderType"
                checked={filters.orderType === 'company'}
                disabled={userOrderType === 'my'}
                on:change={() => handleOrderTypeChange('company')}/>
            <span class="ml-2 md:text-md text-xs">Company Orders</span>
            <sup>
                <button 
                    on:click={openInfoPopup} 
                    class="text-xs" 
                    aria-label="Information"
                    disabled={userOrderType === 'my'}>
                    <Icon icon="ri:question-line" width="16" height="16"/>
                </button>
            </sup>
        </label>
    </div>
	<div class="overflow-x-auto rounded">
		<table class="w-full border-collapse border border-gray-100">
			<thead
				class="bg-gradient-to-r from-primary-500 to-primary-600 text-white uppercase text-xs tracking-wider whitespace-nowrap">
				<tr>
					<th class="px-4 py-2 text-sm font-semibold">ORDER INFORMATION</th>
					<th class="px-4 py-2 text-sm font-semibold">PRODUCT DETAILS</th>
					<th class="px-4 py-2 text-sm font-semibold">QUANTITY AVAILABLE</th>
					<th class="px-4 py-2 text-sm font-semibold">CATEGORY</th>
				</tr>
			</thead>
			<tbody>
				{#if !paginatedItems.length}
                <tr>
                    <td colspan="4" class="border px-4 py-8 text-center text-gray-500">
                        Search related Order is not found
                    </td>
                </tr>
			    {:else}
				{#each paginatedItems as order, outerIndex}
				{#each order.components as component , innerIndex  (component._id)}
				  <tr class="mr-6 bg-white hover:bg-primary-50 text-center border-b cursor-pointer transition-colors duration-150">
					<td class="px-4 py-2 border-r-gray-100 text-xs">
					  <div class="flex justify-between">
						<!-- Main Image with Fallback -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<div class="relative">
							<!-- {outerIndex * paginatedItems[0].components.length + innerIndex + 1} -->
							<!-- <img
						 src={component.image && component.image !== '-' ? `${PUBLIC_COMPBUY_IMAGE_PATH}/part/${component.image}` : '/partskeys.jpeg'} --> 
						  alt="img"
						  class="w-16 h-16 rounded border object-cover p-2 mr-2"
						  onerror="this.src='/partskeys.jpeg'" 
						  on:click={() => {
							const imageUrl = component.image && component.image !== '-' 
								// ? `${PUBLIC_COMPBUY_IMAGE_PATH}/part/${component.image}` 
								// : '/partskeys.jpeg';
							imagemodal(imageUrl);
						}}
						on:mouseenter={() => {
							// const imageUrl = `${PUBLIC_COMPBUY_IMAGE_PATH}/part/${component.image}`;
							const index = outerIndex * paginatedItems[0].components.length + innerIndex + 1;
							// handleMouseEnter(imageUrl, index);
						}}
						on:mouseleave={() => handleMouseLeave()}
						/>
						<!-- {#if hoveredimageindex === outerIndex * paginatedItems[0].components.length + innerIndex + 1 && hoveredImageId === `${PUBLIC_COMPBUY_IMAGE_PATH}/part/${component.image}`}  -->
    						<div class="absolute bottom-full left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-white text-xs text-black font-medium py-1 px-4 rounded-md shadow-lg leading-snug">
      							Click to view <br/> larger image
      						<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-white"></div>
    					</div>
  						{/if}		
						<!-- Popup Image on Hover -->
						{#if showimage}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div on:click={(e) => {
							if (e.target === e.currentTarget) {
							showimage = false;}
							}} class="fixed inset-0 shadow-xl bg-opacity-75 flex items-center justify-center z-50">
							<div class="bg-white rounded-lg shadow-lg p-6 mx-4 w-full md:w-1/2 lg:w-1/3">
							<div class="flex justify-end items-center mb-2">
								<button
								class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
								on:click={closePopup}>
								<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
							  </button>
						</div>
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img src={selectedImage} alt="image" onerror="this.src='/partskeys.jpeg'" class="" /></div>
				</div>
						{/if}
						</div>
						<div class="text-right whitespace-nowrap space-y-1">
						  <p class="text-xs font-semibold text-gray-900">{order.orderid}</p>
						  <p class="text-xs">{formatDate(order.createdAt)}</p>
						  <p class="text-xs text-gray-500">
							Quantity:{order.orderdetails.find(
							  (detail) => detail.componentId === component._id
							)?.orderQty || 0}
						  </p>
						</div>
					  </div>
					</td>
					<td class="px-4 py-2 text-xs">
					  <div class="text-left">
						<p class="m-1">
						  <strong class="pr-2 text-heading whitespace-nowrap"> Product Id:</strong>
						  <a href={getProductUrl(component)} class="text-primary-600 hover:text-primary-700 hover:underline font-semibold">
							{component.productName}
						  </a>
						</p>
						<p class="m-1">
						  <strong class="pr-2 text-heading whitespace-nowrap">Description:</strong>{component.description}
						</p>
						<p class="m-1">
						  <strong class="pr-2 text-heading whitespace-nowrap">Manufacturer:</strong>{component.manufacturerName}
						</p>
					  </div>
					</td>
					<td class="px-4 py-2 text-sm font-semibold">
					  {component.inStock}
					  <span class="text-gray-400 text-xs">In Stock</span>
					</td>
					<td class="px-4 py-2 text-xs whitespace-nowrap">
					  {#if component.categoryDetails?.name}
						<p class="mb-1">{component.categoryDetails?.name || 'N/A'}</p>
						{#if component.subCategoryDetails?.name}
						  <p class="text-gray-500">({component.subCategoryDetails.name})</p>
						{/if}
					  {/if}
					</td>
				  </tr>
				{/each}
			  {/each}
			  {/if}
			</tbody>
		</table>
	</div>
		<!-- svelte-ignore missing-declaration -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-around border bg-white shadow-sm px-4 py-4 rounded-b-md md:mt-1 m-1 md:m-0"
			aria-label="pagination"
			on:keydown={handleKeyDown}>
			<!-- <p class="text-sm text-gray-700">
				Page <span class="font-semibold">{$currentPage}</span> of
				<span class="font-semibold">{totalPages}</span>
			</p> -->
			<div class="flex items-center justify-center gap-2 flex-wrap">
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange(1)}
					disabled={$currentPage === 1}
					aria-label="First page">
					<Icon icon="charm:chevrons-left" class="w-4 h-4"/>
				</button>
				<button class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
				on:click={() => handlePageChange($currentPage - 1)}
				disabled={$currentPage === 1}
				aria-label="Previous page">
				<Icon icon="charm:chevron-left" class="w-4 h-4" />
				</button>
				<!-- svelte-ignore missing-declaration -->
				{#each pageNumbers as page}
					{#if page === DOTS}
						<span class="px-2 text-gray-500 text-sm font-medium">{DOTS}</span>
					{:else}
						<button
							class={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm shadow-sm border transition-all duration-200 transform ${page === $currentPage ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600' : 'bg-white text-primary-700 border-gray-300 hover:bg-primary-500 hover:text-white active:scale-110'}`}
							on:click={() => handlePageChange(page)}
							disabled={page === $currentPage}
							aria-label="Go to page {page}"
							aria-current={page === $currentPage ? 'page' : undefined}>
							{page}
						</button>
					{/if}
				{/each}
				<button class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange($currentPage + 1)}
					disabled={$currentPage === totalPages}
					aria-label="Next page">
					<Icon icon="charm:chevron-right" class="w-4 h-4" />
				</button>
				<!-- svelte-ignore missing-declaration -->
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange(totalPages)}
					disabled={$currentPage === totalPages}
					aria-label="Last page">
					<Icon icon="charm:chevrons-right" class="w-4 h-4" />
				</button>
			</div>
		</div>
</div>