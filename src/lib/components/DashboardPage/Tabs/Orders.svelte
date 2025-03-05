<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    import * as XLSX from 'xlsx';
    import { slide,fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import Calender from '$lib/components/Calender.svelte';
	import { toast, Toaster } from 'svelte-sonner';
    
    export let data;
    // console.log("data=>",data)
    let initialOrders = [];
    let orders = [];
    let expandedOrderId = null;
    let isInfoPopupOpen = false;
    let userOrderType = null;
    let userEmail = data.authedUser.email
    let calendarComponent;
    
    let filters = {
        status: '',
        searchTerm: '',
        orderType: null,
        firstTimeOnly: false,
        dateRange: 'custom'
    };
    let order = initialOrders.map((item) => ({
		...item,
		productList: item.productList || []
	}));

    $: isAnyFilterActive = filters.dateRange !== '' || 
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

    $: {
        if (data?.orders) {
            initialOrders = data.orders;
            orders = [...initialOrders];
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

    $: totalItems = orders.length;
    $: pageNumbers = getPageRange($currentPage, totalItems);
    $: totalPages = Math.ceil(totalItems / $itemsPerPage);
    $: paginatedOrders = getPaginatedData($currentPage, $itemsPerPage, orders).map(order => ({
    ...order,
    orderid: order.orderid || 'N/A',
    purchaseorder: order.purchaseorder || 'N/A',
    status: getOrderStatus(order),
    currency: order.currency || 'INR',
    totalprice: order.totalprice || 0,
    subtotalprice: order.subtotalprice || 0,
    shippingprice: order.shippingprice || 0,
    transactionid: order.transactionid || 'N/A',
    Invoice: order.invoice || 'N/A',
    orderType: order.orderType || 'personal',
    orderdetails: (order.orderdetails || []).map(item => ({
        customerReference: item.customerReference || '--',
        productName: item.productName || 'N/A',
        orderQty: item.orderQty || 0,
        readyToShip: item.readyToShip || 0,
        backOrder: item.backOrder || 0,
        unitPrice: item.unitPrice || 0,
        extendedPrice: item.extendedPrice || 0,
        currency: item.currency || order.currency || 'INR'
    }))
}));;

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

    const formatAddress = (addressData) => {
         if (typeof addressData === 'string') {
            const parts = addressData.split(',').map(part => part.trim());
            return [
                parts[0] || '',
                parts[1] || '',
                parts.slice(2).join(', ') || ''
            ];
        } else if (addressData && typeof addressData === 'object') {
            const addressLine1 = addressData.address || '';
            const addressLine2 = `${addressData.city || ''}, ${addressData.state || ''}`.trim();
            const addressLine3 = `${addressData.country || ''}, ${addressData.postalcode || ''}`.trim();
            return [
                addressLine1,
                addressLine2,
                addressLine3
            ].map(line => line.trim()).filter(line => line.length > 0); 
        }
        return ['N/A'];
    };


    const getOrderStatus = (order) => {
    return order?.status || 'pending'; 
    };

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
            const orderIdMatch = order.orderid?.toString().toLowerCase().includes(searchTermLower);
            const purchaseOrderMatch = order.purchaseorder?.toString().toLowerCase().includes(searchTermLower);
            const transactionIdMatch = order.transactionid?.toString().toLowerCase().includes(searchTermLower);
            
            return orderIdMatch || purchaseOrderMatch || transactionIdMatch;
        });
    }
    
    if (filters.dateFrom || filters.dateTo) {
        filteredOrders = filteredOrders.filter(order => 
            isDateInRange(order.createdAt, filters.dateFrom, filters.dateTo)
        );
    }
    
    if (filters.status) {
        filteredOrders = filteredOrders.filter(order => 
            order.status?.toLowerCase() === filters.status.toLowerCase()
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
// const handlePageChange = (event) => {
//     currentPage = event.detail.page;
// };
// const applyFilters = () => {
//     filterOrders();
// };

const toggleOrderDetails = (orderId) => {
    expandedOrderId = expandedOrderId === orderId ? null : orderId;
};
const clearFilters = () => {
    filters = {
        dateRange: '',
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
function openInfoPopup() { isInfoPopupOpen = true;}
function closeInfoPopup() { isInfoPopupOpen = false;}

const getTransactionStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'failure':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTransactionStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'success':
                return 'ri:checkbox-circle-line';
            case 'failure':
                return 'ri:close-circle-line';
            case 'pending':
                return 'ri:time-line';
            default:
                return 'ri:question-line';
        }
    };

function downloadAsExcel(order) {
    if (!order || Object.keys(order).length === 0) {
        toast.error("No order data to export.");
        return;
    }

    try {
        const workbook = XLSX.utils.book_new();

        // Helper to add styled headers
        const createStyledHeader = (title) => ({
            v: title,
            t: 's',
            s: {
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" }
                },
                fill: {
                    fgColor: { rgb: "4A90E2" }
                },
                alignment: { horizontal: "center" }
            }
        });

        const excelData = [
            [createStyledHeader("Order Summary")],
            [],
            ["Order ID", order.orderid || 'N/A'],
            ["Order Date", new Date(order.createdAt).toLocaleDateString()],
            ["Order Type", order.orderType || 'N/A'],
            ["Status", order.status || 'N/A'],
            [],
            [createStyledHeader("Financial Summary")],
            [],
            ["Subtotal", formatCurrency(order.subtotalprice || 0, order.currency)],
            ["Shipping", formatCurrency(order.shippingprice || 0, order.currency)],
            ["Total", formatCurrency(order.totalprice || 0, order.currency)],
            [],
            [createStyledHeader("Transaction Details")],
            [],
            ["Transaction ID", order.transactionid || '-'],
            ["Invoice Number", order.invoice || '-'],
            ["Payment Status", order.transdetails?.status || '-'],
            ["Payment Mode", order.transdetails?.mode || order.transdetails?.payment_source || '-'],
            [],
            [createStyledHeader("Order Items")],
            [],
            ["Product Name", "Order Qty", "Ready to Ship", "Back Order", "Customer Ref", "Unit Price", "Extended Price"]
        ];

        if (order.orderdetails && order.orderdetails.length > 0) {
            order.orderdetails.forEach(item => {
                excelData.push([
                    item.manufacturerProductName || 'N/A',
                    item.orderQty || 0,
                    item.readyToShip || 0,
                    item.backOrder || 0,
                    // item.customerReference || '--',
                    formatCurrency(item.unitPrice || 0, order.currency),
                    formatCurrency(item.extendedPrice || 0, order.currency)
                ]);
            });
        }

        excelData.push(
            [],
            [createStyledHeader("Shipping Details")],
            []
        );

        const shippingAddress = formatAddress(order.shippingAddress || order.shipmentAddress);
        const billingAddress = formatAddress(order.billingAddress);

        excelData.push(
            ["Shipping Address"],
            ...shippingAddress.map(line => [line]),
            [],
            ["Billing Address"],
            ...billingAddress.map(line => [line])
        );

        const worksheet = XLSX.utils.aoa_to_sheet(excelData);

        worksheet['!cols'] = [
            { wch: 20 },  
            { wch: 30 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");

        const filename = `Order_${order.orderid || order.transactionid || "Details"}.xlsx`;
        XLSX.writeFile(workbook, filename);

    } catch (error) {
        console.error('Error downloading Excel:', error);
        toast.error('Failed to download Excel file');
    }
}


</script>

<div class="my-6">
    <div class="flex flex-wrap gap-4 mb-6 items-center">
        <div class="flex flex-col lg:flex-row w-full">
            <div class="w-full lg:w-1/3">
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
            <!-- <div class="flex flex-col sm:flex-row lg:flex-row w-full lg:w-2/5 my-2 md:my-2 lg:my-0 lg:ml-2"> -->
            <div class="flex flex-col sm:flex-row lg:flex-row w-full lg:w-2/5 my-2 md:my-2 lg:my-0 lg:ml-2">
                <div class="relative w-full md:max-w-80">
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
                <div class="flex-1 sm:max-w-[400px] mt-2 md:mt-0 md:ml-2">
                    <select class="border w-full h-10 rounded focus:ring-0 focus:border-primary-500 transition-all outline-none duration-200 pb-2"
                            bind:value={filters.status}
                            on:change={() => updateFilters('status', filters.status)}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="canceled">Canceled</option>
                        <option value="shipped">Shipped</option>
                        <option value="received">Received</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row w-full lg:w-1/4 flex-1 lg:ml-2 md:mt-0 mt-2">
                <!-- <button class="bg-primary-500 w-full h-10 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" on:click={applyFilters}
                    disabled={!isAnyFilterActive}>
                    Apply Filters
                </button> -->
                <button class="border border-primary-500 flex items-center justify-center  md:mt-0 mt-2  w-1/2 h-10 px-2 py-2 rounded hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" on:click={clearFilters} disabled={!isAnyFilterActive}>
                    <Icon icon="hugeicons:filter-remove" class="mr-2 hover:text-white" width="20" height="20" />
                    <span class="text-sm">Clear</span>
                </button>
            </div>
        </div>
    </div>
   <!--   <div class="mb-6 flex items-center gap-6">
       <label class="inline-flex items-center {userOrderType === 'company' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
            <input 
                type="radio" 
                class="form-radio text-primary-600 h-4 w-4" 
                name="orderType" 
                checked={filters.orderType === 'my'}
                disabled={userOrderType === 'company'}
                on:change={() => handleOrderTypeChange('my')}/>
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
    </div>-->
    <div class="overflow-x-auto rounded">
        <table class="w-full border-collapse border border-gray-100">
            <thead class="bg-gradient-to-r from-primary-500 to-primary-600 text-white uppercase text-xs tracking-wider">
                <tr>
                    <th class="px-4 py-2 text-sm font-semibold">DATE</th>
                    <th class="px-4 py-2 text-sm font-semibold">ORDER NUMBER</th>
                    <th class="px-4 py-2 text-sm font-semibold">PURCHASE ORDER NUMBER</th>
                    <th class="px-4 py-2 text-sm font-semibold">TOTAL</th>
                    <th class="px-4 py-2 text-sm font-semibold">STATUS</th>
                    <th class="px-4 py-2 text-sm font-semibold">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
            {#if !paginatedOrders.length}
                <tr>
                    <td colspan="6" class="border px-4 py-8 text-center text-gray-500">
                        Search related Order is not found
                    </td>
                </tr>
			{:else}
                {#each paginatedOrders as order}
                    <tr class="mr-6 bg-white text-center border-b cursor-pointer transition-colors duration-150" in:fade={{duration: 200}} on:click={() => toggleOrderDetails(order?._id)}>
                        <td class="px-4 py-2 text-xs">{formatDate(order?.createdAt) || 'N/A'}</td>
                        <td class="px-4 py-2 text-xs">{order?.orderid || 'N/A'}</td>
                        <td class="px-4 py-2 text-xs font-semibold">{order?.purchaseorder || 'N/A'}</td>
                        <td class="px-4 py-2 text-xs">{formatCurrency(order?.totalprice || 0, order?.currency || 'INR')}</td>
                        <td class="px-4 py-2 text-xs">
                            <a href={`/order-status/${order?.orderid}?email=${userEmail}`} class="text-blue-500 hover:text-blue-700">
                                <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                    order?.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    order?.status === 'canceled' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    order?.status === 'pending cancellation' ? 'bg-red-100 text-red-600 border border-red-100' :
                                    order?.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    order?.status === 'received' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                    <Icon icon={order?.status === 'pending' ? 'ri:time-line' :
                                        order?.status === 'canceled' ? 'ri:close-circle-line' :
                                        order?.status === 'pending cancellation' ? 'fluent:calendar-cancel-20-regular' :
                                        order?.status === 'shipped' ? 'la:shipping-fast' :
                                        order?.status === 'received' ? 'ri:checkbox-circle-line' :
                                        'ri:question-line'
                                    } width="16" height="16" />
                                    {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
                             </span>
                            </a>
                        </td>
                        <td class="px-4 py-2">
                            <button class="text-primary-500 text-xs hover:text-primary-700 transition-colors duration-200">
                                {expandedOrderId === order?._id ? 'Hide Details' : 'Show Details'}
                            </button>
                        </td>
                    </tr>
                    {#if expandedOrderId === order?._id}
                        <tr class="bg-white" >
                            <td colspan="6" class="border p-0">
                                <div transition:slide={{duration: 300, easing: quintOut}} 
                                     class="transition-all duration-300">
                                    <div class="p-4 space-y-4">
                                    <div class="bg-white p-4 rounded  shadow">
                                        <h4 class="text-heading font-bold mb-2">Order Summary</h4>
                                        <div class="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p class="text-heading font-semibold">Subtotal</p>
                                                <p>{formatCurrency(order?.subtotalprice, order?.currency)}</p>
                                            </div>
                                            <div>
                                                <p class="text-heading font-semibold">Shipping</p>
                                                <p>{formatCurrency(order?.shippingprice || 0, order?.currency || 'INR' )}</p>
                                            </div>
                                            <div>
                                                <p class="text-heading font-semibold">Total</p>
                                                <p>{formatCurrency(order?.totalprice || 0 , order?.currency || 0)}</p>
                                            </div>
                                            <div>
                                                <p class="text-heading font-semibold">Transation ID</p>
                                                <p>{order?.transactionid || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p class="text-heading font-semibold">Invoice Number</p>
                                                <p class="text-xs">{order?.invoice || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-white p-4 rounded shadow">
                                        <div class="flex justify-between items-center">
                                            <h4 class="font-bold text-heading mb-2">Order Items</h4>
                                          </div>
                                        <!-- <h4 class="font-bold text-heading mb-2">Order Items</h4> -->
                                        <div class="overflow-x-auto">
                                            <table class="w-full text-sm rounded">
                                                <thead class="rounded">
                                                    <tr class="bg-white">
                                                        <th class="border px-2 py-1 text-left">Product Name</th>
                                                        <th class="border px-2 py-1 text-center">Order Qty</th>
                                                        <!-- <th class="border px-2 py-1 text-center">Available</th> -->
                                                        <th class="border px-2 py-1 text-center">Ready</th>
                                                        <th class="border px-2 py-1 text-center">Back Order</th>
                                                        <th class="border px-2 py-1 text-center">Lead Time</th>
                                                        <!-- <th class="border px-2 py-1 text-center">Customer Ref</th> -->
                                                        <th class="border px-2 py-1 text-right">Unit Price</th>
                                                        <th class="border px-2 py-1 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each order?.orderdetails || [] as item}
                                                        <tr class="hover:bg-gray-50">
                                                            <td class="border px-2 py-1 text-left">{item?.productName || 'N/A'}</td>
                                                            <td class="border px-2 py-1 text-center">{item?.orderQty || 0 }</td>
                                                            <!-- <td class="border px-2 py-1 text-center">{item?.availableStock}</td> -->
                                                            <td class="border px-2 py-1 text-center">{item?.readyToShip || 0 }</td>
                                                            <td class="border px-2 py-1 text-center">{item?.backOrder || 0 }</td>
                                                            <td class="border px-2 py-1 text-center">{item?.leadtime || '--' }</td>
                                                            <!-- <td class="border px-2 py-1 text-center">{item?.customerReference || '--'}</td> -->
                                                            <td class="border px-2 py-1 text-right">{formatCurrency(item?.unitPrice || 0, item?.currency || 'INR')}</td>
                                                            <td class="border px-2 py-1 text-right">{formatCurrency(item?.extendedPrice || 0, item?.currency || 'INR')}</td>
                                                        </tr>
                                                    {/each}
                                                </tbody>                                                                                  
                                            </table>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded shadow p-4">
                                        <h3 class="font-bold mb-2 text-heading">Shipping Details</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                                                <div class="text-sm">
                                                    {#each formatAddress(order?.shippingAddress || order?.shipmentAddress) as line}
                                                        <p class="flex flex-wrap mb-1">{line}</p>
                                                    {/each}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-500 mb-2">Billing Address</h4>
                                                <div class="text-sm">
                                                    {#each formatAddress(order?.billingAddress) as line}
                                                        <p class="flex flex-wrap mb-1">{line}</p>
                                                    {/each}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {#if order?.transactionid && order?.transdetails}
                                        <div class="bg-white p-4 rounded shadow">
                                        <h4 class="text-heading font-bold mb-2">Transaction Details</h4>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getTransactionStatusClass(order.transdetails.status)}`}>
                                                    <Icon icon={getTransactionStatusIcon(order.transdetails.status)} width="16" height="16" />
                                                    {order.transdetails.status.charAt(0).toUpperCase() + order.transdetails.status.slice(1)}
                                                </span>
                                                {#if order.transdetails.error_Message}
                                                    <p class="text-xs text-red-600 mt-2">{order.transdetails.error_Message}</p>
                                                {/if}
                                            </div>
                                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 col-span-2">
                                                <div>
                                                    <p class="text-sm text-gray-600">Payment ID</p>
                                                    <p class="text-sm font-medium">{order.transdetails.mihpayid || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p class="text-sm text-gray-600">Bank Reference</p>
                                                    <p class="text-sm font-medium">{order.transdetails.bank_ref_num || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p class="text-sm text-gray-600">Payment Mode</p>
                                                    <p class="text-sm font-medium">{order.transdetails.mode || order.transdetails.payment_source || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p class="text-sm text-gray-600">Amount</p>
                                                    <p class="text-sm font-medium">{formatCurrency(order.transdetails.amount, order.currency)}</p>
                                                </div>
                                                <div>
                                                    <p class="text-sm text-gray-600">Transaction Date</p>
                                                    <p class="text-sm font-medium">{order.transdetails.addedon || 'N/A'}</p>
                                                </div>
                                                {#if order.transdetails.status === 'success'}
                                                    <div>
                                                        <p class="text-sm text-gray-600">Net Amount Debited</p>
                                                        <p class="text-sm font-medium">{formatCurrency(order.transdetails.net_amount_debit, order.currency)}</p>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                        </div>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                        {/if}
                        {#if expandedOrderId === order?._id}
                            <tr>
                                <td colspan="6" class="border px-4 py-1 text-end bg-white">
                                    <button 
                                        on:click={() => downloadAsExcel(order)} 
                                        class="bg-white text-heading px-3 py-1 border rounded shadow my-1 md:text-sm text-2s hover:text-white hover:bg-green-700 transition-all">
                                        Download as Excel
                                    </button>
                                </td>
                            </tr>
                        {/if}
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

       <Toaster position="bottom-right" richColors />
</div>