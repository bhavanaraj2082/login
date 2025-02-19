<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    import { toast, Toaster } from 'svelte-sonner';
    // import { triggerDownload } from './invoiceGenertor.js';
    // import Popup from '$lib/components/DashboardPage/Tabs/TooltipPopup.svelte';
    import { writable } from 'svelte/store';
    import Calender from '$lib/components/Calender.svelte';
    
    export let data;
    let initialOrders = [];
    let orders = [];
    let isInfoPopupOpen = false;
    let userOrderType = null;
    let userEmail = data.authedUser.email
    let calendarComponent;
    
    let filters = {
        searchTerm: '',
        orderType: null,
        firstTimeOnly: false,
        dateRange: 'custom'
    };

    function normalizeOrderData(order) {
        if (!order) return null;
        
        return {
            orderid: order.orderid || 'N/A',
            Invoice: order.Invoice || 'N/A',
            purchaseorder: order.purchaseorder || 'N/A',
            status: order.status || 'pending',
            createdAt: order.createdAt || new Date().toISOString(),
            totalprice: order.totalprice || (order.orderdetails?.[0]?.extendedPrice || 0),
            currency: order.currency || 'INR',
            orderType: order.orderType || 'personal',
            components: order.components || order.orderdetails?.[0]?.componentId ? [{
                productName: order.components?.[0]?.productName || 'N/A',
                quantity: order.orderdetails?.[0]?.orderQty || 0,
                unitPrice: order.orderdetails?.[0]?.unitPrice || 0
            }] : []
        };
    }

    $: {
        if (data?.orders) {
            initialOrders = data.orders.map(normalizeOrderData).filter(Boolean);
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
    let itemsPerPage = writable(10);
    let totalItems;

    const DOTS = '...';
    const VISIBLE_PAGES = 7;

    $: isAnyFilterActive = filters.dateFrom !== '' || 
    filters.dateTo !== '' || 
    filters.status !== '' || 
    filters.searchTerm !== '';

    $: totalItems = orders.length;
    $: paginatedOrders = getPaginatedData($currentPage, $itemsPerPage, orders);
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
                month: 'short',
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
    
    const formatCurrency = (amount, currency = 'INR') => {
        try {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency || 'INR'
            }).format(amount || 0);
        } catch (e) {
            return `${currency} ${amount || 0}`;
        }
    };

    const handleReturnRequest = (order) => {
        if (order.status === 'received' || order.status === 'Completed') {
            goto(`/returns/${order.Invoice}`);
        } else {
            toast.error('Returns can only be requested for delivered or completed orders');
        }
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
            filteredOrders = filteredOrders.filter(order => {
                return (
                    order.orderid?.toString().toLowerCase().includes(searchTermLower) ||
                    order.Invoice?.toString().toLowerCase().includes(searchTermLower) ||
                    order.purchaseorder?.toString().toLowerCase().includes(searchTermLower) ||
                    order.transactionid?.toString().toLowerCase().includes(searchTermLower)
                );
            });
        }

        if (filters.dateFrom || filters.dateTo) {
            filteredOrders = filteredOrders.filter(order => 
                isDateInRange(order.createdAt, filters.dateFrom, filters.dateTo)
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

    const clearFilters = () => {
        filters = {
            dateFrom: '',
            dateTo: '',
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

    function openInfoPopup() { isInfoPopupOpen = true; }
    function closeInfoPopup() { isInfoPopupOpen = false; }

    function statusStyles(status) {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'canceled':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'pending cancellation':
                return 'bg-red-100 text-red-600 border border-red-100';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'received':
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    }

    function statusIcon(status) {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'ri:time-line';
            case 'canceled':
                return 'ri:close-circle-line';
            case 'pending cancellation':
                return 'fluent:calendar-cancel-20-regular';
            case 'shipped':
                return 'la:shipping-fast';
            case 'received':
            case 'completed':
                return 'ri:checkbox-circle-line';
            default:
                return 'ri:question-line';
        }
    }
</script>

<div class="my-6">
    <div class="flex flex-wrap gap-4 mb-6 items-center">
        <div class="flex-1 min-w-md">
            <div class="relative">
                <Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
                <input
                    type="text"
                    placeholder="Search by Invoice Number, Order Number or Purchase Order Number"
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
        <div class="flex-1 min-w-[290px] mr-2">
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
        <button class="border border-primary-500 flex items-center px-2 py-2 rounded hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
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
                on:change={() => handleOrderTypeChange('my')}
            />
            <span class="m-2 md:text-md text-xs">My Orders</span>
        </label>
        <label class="inline-flex items-center {userOrderType === 'my' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
            <input 
                type="radio" 
                class="form-radio text-primary-600 h-4 w-4" 
                name="orderType"
                checked={filters.orderType === 'company'}
                disabled={userOrderType === 'my'}
                on:change={() => handleOrderTypeChange('company')}
            />
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
        <table class="w-full border-collapse border border-gray-200">
            <thead class="bg-gradient-to-r from-primary-500 to-primary-600 text-white uppercase text-xs tracking-wider">
                <tr>
                    <th class="px-4 text-sm font-semibold py-2 whitespace-nowrap">DATE</th>
                    <th class="px-4 text-sm font-semibold py-2 whitespace-nowrap">ORDER NUMBER</th>
                    <th class="px-4 text-sm font-semibold py-2 whitespace-nowrap">INVOICE NUMBER</th>
                    <th class="px-4 text-sm font-semibold py-2 whitespace-nowrap">Purchase ORDER NUMBER</th>
                    <th class="px-4 text-sm font-semibold py-2">TOTAL</th>
                    <th class="px-4 text-sm font-semibold py-2">STATUS</th>
                    <th class="px-4 text-sm font-semibold py-2">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {#if !paginatedOrders.length}
                <tr>
                    <td colspan="7" class="border px-4 py-8 text-center text-gray-500">
                        Search related Order is not found
                    </td>
                </tr>
			    {:else}
                {#each paginatedOrders as order}
                    <tr class="mr-6 border-b bg-white hover:bg-primary-50 text-center whitespace-nowrap">
                      <td class="px-4 py-2 text-xs">
                        {formatDate(order?.createdAt) || 'N/A'}
                      </td>
                      <td class="px-4 py-2 text-xs border-r-gray-100 text-primary-700 font-semibold">
                        {order?.orderid || 'N/A'}
                      </td>
                      <td class="px-4 py-3 text-xs text-primary-700 font-semibold flex items-center justify-center space-x-2">
                        {order?.Invoice || 'N/A'}
                        <!-- <Icon icon="vscode-icons:file-type-pdf2" class="hover:text-white" width="20" height="20" />
                        <button
                          class="text-primary-600 hover:text-primary-800 underline"
                          on:click={() => triggerDownload(order?.Invoice, order?.orderid, orders)}>
                          {order?.Invoice || 'N/A'}
                        </button> -->
                      </td>
                      <td class="px-4 py-2 text-xs border-r-gray-100 font-semibold">{order?.purchaseorder || 'N/A'}
                    </td>
                    <td class="px-4 py-2 text-xs">
                      {formatCurrency(order?.totalprice || 0, order?.currency || 'INR')}
                    </td>
                    <td class="px-4 py-2 text-xs border-r-gray-100">
                      <a href={`/order-status/${order?.orderid}?email=${userEmail}`} class="text-blue-500 hover:text-blue-700">
                      <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusStyles(order?.status)}`}>
                        <Icon icon={statusIcon(order?.status)} width="16" height="16" />
                        {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                      </span>
                      </a>
                    </td>
                    <td class="px-4 py-2 text-xs">
                      <button class={`bg-primary-500 text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors text-xs ${order?.status?.toLowerCase() !== 'received' && order?.status?.toLowerCase() !== 'completed' ? 'cursor-not-allowed opacity-50' : ''}`} 
                      on:click={() => handleReturnRequest(order)} 
                      disabled={order?.status?.toLowerCase() !== 'received' && order?.status?.toLowerCase() !== 'completed'}>
                        Request Return
                      </button>
                    </td>
                  </tr>
              {/each}
              {/if}
          </tbody>
      </table>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-around border bg-white shadow-sm px-4 py-4 rounded-b-md md:mt-1 m-1 md:m-0"
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
              <Icon icon="charm:chevrons-left" class="w-4 h-4" />
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
          <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              on:click={() => handlePageChange(totalPages)}
              disabled={$currentPage === totalPages}
              aria-label="Last page">
              <Icon icon="charm:chevrons-right" class="w-4 h-4" />
          </button>
      </div>
  </div>
  <Toaster position="bottom-right" richColors />
</div>
<!-- {#if isInfoPopupOpen}
  <Popup 
      message="Company Orders and Company Invoices include your orders along with the orders of any co-workers that have opted into sharing. If you aren't seeing a co-worker's orders, check that they are opted into Co-Worker sharing in their Preferences."
      on:close={closeInfoPopup}/>
{/if} -->