<script>
    import Icon from '@iconify/svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import ExcelJS from 'exceljs';
    import  pkg  from 'file-saver';
    import Calender from '$lib/components/Calender.svelte';
    import { toast, Toaster } from 'svelte-sonner';
    
    export let data;
    console.log("ordersdata=>", data);
    let initialOrders = [];
    let orders = [];
    let expandedOrderId = null;
    let isInfoPopupOpen = false;
    let userOrderType = null;
    let userEmail = data?.authedUser?.email;
    let calendarComponent;
    let isLoading = false;
    
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

    // $: isAnyFilterActive = filters.dateRange !== '' || 
    //    filters.status !== '' || 
    //    filters.searchTerm !== '';
    
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
        
        const earliestDate = orders.reduce((earliest, order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate < earliest ? orderDate : earliest;
        }, new Date(orders[0].createdAt));

        earliestDate.setHours(0, 0, 0, 0);
        return earliestDate;
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
        orderid: order?.orderid || 'N/A',
        purchaseorder: order?.purchaseorder || 'N/A',
        status: getOrderStatus(order),
        currency: order?.currency || 'INR',
        totalprice: order?.totalprice || 0,
        subtotalprice: order?.subtotalprice || 0,
        shippingprice: order?.shippingprice || 0,
        transactionid: order?.transactionid || 'N/A',
        Invoice: order?.invoice || 'N/A',
        orderType: order?.orderType || 'personal',
        orderdetails: (order?.orderdetails || []).map(item => ({
            customerReference: item?.customerReference || '--',
            productName: item?.productName || item?.manufacturerProductName || 'N/A',
            orderQty: item?.orderQty || 0,
            readyToShip: item?.readyToShip || 0,
            backOrder: item?.backOrder || 0,
            unitPrice: item?.unitPrice || 0,
            extendedPrice: item?.extendedPrice || 0,
            leadtime: item?.leadtime || '--',
            currency: item?.currency || order.currency || 'INR'
        }))
    }));

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
            if (parts.length >= 3) {
                return [
                    parts[0] || '',
                    parts[1] || '',
                    parts.slice(2).join(', ') || ''
                ].filter(Boolean); 
            }
            return parts.filter(Boolean); 
        } 
        else if (addressData && typeof addressData === 'object') {
            const addressLine1 = addressData.organizationName ? 
                `${addressData.attentionTo || ''}, ${addressData.organizationName || ''}`.trim() :
                addressData.address || '';
                
            const addressLine2 = addressData.street ? 
                `${addressData.department || ''}, ${addressData.building || ''}, ${addressData.street || ''}`.trim() :
                `${addressData.city || ''}, ${addressData.state || ''}`.trim();
                
            const addressLine3 = addressData.location ?
                `${addressData.city || ''}, ${addressData.state || ''}, ${addressData.location || ''}, ${addressData.postalCode || ''}`.trim() :
                `${addressData.country || ''}, ${addressData.postalcode || ''}`.trim();
                
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
        if (!date) return false;
        
        const checkDate = new Date(date);
        if (isNaN(checkDate.getTime())) return false;
        
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
                const invoiceMatch = order.invoice?.toString().toLowerCase().includes(searchTermLower);
                
                return orderIdMatch || purchaseOrderMatch || transactionIdMatch || invoiceMatch;
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

    const toggleOrderDetails = (orderId) => {
        expandedOrderId = expandedOrderId === orderId ? null : orderId;
    };
    

    function clearSearch() {
        filters.searchTerm = '';
        filterOrders();
    }

    function clearStatus() {
        filters.status = '';
        updateFilters('status', '');
    }

 
    
    function openInfoPopup() { isInfoPopupOpen = true; }
    function closeInfoPopup() { isInfoPopupOpen = false; }

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

    async function downloadAsExcel(order) {
        if (!order || Object.keys(order).length === 0) {
            toast.error("No order data to export.");
            return;
        }

        try {
            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet("Order Details");

            const headerStyle = {
                font: { bold: true, color: { argb: '000000' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DFDFDF' } },
                alignment: { horizontal: 'center' },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            };

            const addHeaderRow = (title) => {
                const row = ws.addRow([title]);
                row.eachCell(cell => {
                    cell.style = headerStyle;
                });
            };

            const addKeyValue = (key, value) => ws.addRow([key, value || '--']);

            addHeaderRow("Order Summary");
            ws.addRow([]);
            addKeyValue("Order ID", order.orderid);
            addKeyValue("Order Date", formatDate(order.createdAt));
            addKeyValue("Invoice Number", order.invoice);
            addKeyValue("Status", order.status);
            ws.addRow([]);

            addHeaderRow("Financial Summary");
            ws.addRow([]);
            addKeyValue("Subtotal", formatCurrency(order.subtotalprice, order.currency));
            addKeyValue("Shipping", formatCurrency(order.shippingprice, order.currency));
            addKeyValue("Total", formatCurrency(order.totalprice, order.currency));
            ws.addRow([]);

            if (order.transactionid || order.transdetails) {
                addHeaderRow("Transaction Details");
                ws.addRow([]);
                addKeyValue("Transaction ID", order.transactionid);
                addKeyValue("Payment Status", order.transdetails?.status);
                addKeyValue("Payment Mode", order.transdetails?.mode || order.transdetails?.payment_source);
                ws.addRow([]);
            }

            addHeaderRow("Order Items");
            ws.addRow([]);
            const itemHeaderRow = ws.addRow([
                "Product Name", "Order Qty", "Ready to Ship", "Back Order",
                "Customer Ref", "Unit Price", "Extended Price"
            ]);
            itemHeaderRow.eachCell(cell => cell.style = headerStyle);

            if (order.orderdetails?.length > 0) {
                order.orderdetails.forEach(item => {
                    ws.addRow([
                        item.productName || '--',
                        item.orderQty || 0,
                        item.readyToShip || 0,
                        item.backOrder || 0,
                        item.customerReference || '--',
                        formatCurrency(item.unitPrice || 0, order.currency),
                        formatCurrency(item.extendedPrice || 0, order.currency)
                    ]);
                });
            }

            ws.addRow([]);
            addHeaderRow("Address Details");
            ws.addRow([]);

            const shippingAddress = formatAddress(order.shippingaddress);
            const billingAddress = formatAddress(order.billingaddress);

            ws.addRow(["Shipping Address:"]);
            shippingAddress.forEach(line => ws.addRow(["  " + line]));
            ws.addRow([]);
            ws.addRow(["Billing Address:"]);
            billingAddress.forEach(line => ws.addRow(["  " + line]));

            ws.columns = [
                { width: 25 },
                { width: 30 },
                { width: 15 },
                { width: 15 },
                { width: 20 },
                { width: 15 },
                { width: 15 }
            ];

            const buffer = await wb.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const filename = `Order_${order.orderid || order.invoice || "Details"}.xlsx`;
            pkg(blob, filename);
        } catch (error) {
            console.error("Error downloading Excel:", error);
            toast.error("Failed to download Excel file");
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
                        placeholder="Search by Order Number or Invoice"
                        class="w-full border rounded-md px-4 py-3 pl-10 focus:ring-0 focus:border-primary-500 text-xs transition-all outline-none duration-200"
                        value={filters.searchTerm}
                        on:input={handleSearch}/>
                        {#if filters.searchTerm}
                        <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-50 hover:bg-red-100" on:click={clearSearch}>
                            <Icon icon="oui:cross" class="text-xl p-0.5 font-bold  text-red-500" />
                        </button>
                    {/if}  
                </div>
            </div>
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
                <div class="relative flex-1 sm:max-w-[400px] mt-2 md:mt-0 md:ml-2">
                    <select 
                        class="border w-full h-10 text-xs rounded-md focus:ring-0 focus:border-primary-500 transition-all outline-none duration-200 pr-10" 
                        bind:value={filters.status}
                        on:change={() => updateFilters('status', filters.status)}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                    </select>
                    {#if filters.status}
                        <button 
                            type="button" 
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-50 hover:bg-red-100  " 
                            on:click={clearStatus}>
                            <Icon icon="oui:cross" class="text-xl p-0.5 font-bold  text-red-500" />
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="hidden lg:block rounded-md shadow hide">
        <table class="w-full border-collapse border border-gray-100">
            <thead class="bg-gradient-to-r from-primary-500 to-primary-600 text-white uppercase text-xs tracking-wider">
                <tr>
                    <th class="px-4 py-2 text-sm font-medium rounded-tl">DATE</th>
                    <th class="px-4 py-2 text-sm font-medium">ORDER NUMBER</th>
                        {#if order.some(order => order?.purchaseorder)}
                            <th class="px-4 py-2 text-sm font-medium">PURCHASE ORDER NUMBER</th>
                        {/if}
                    <th class="px-4 py-2 text-sm font-medium">TOTAL</th>
                    <th class="px-4 py-2 text-sm font-medium">STATUS</th>
                    <th class="px-4 py-2 text-sm font-medium rounded-tr">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
            {#if !paginatedOrders.length}
                <tr>
                    <td colspan="6" class="text-center text-red-500">
                        <div class="flex items-center justify-center p-4 bg-white">
                            <span class="bg-primary-50 rounded-full items-center">
                              <Icon icon="mdi:box-alert-outline" class="text-primary-500 md:text-xl text-sm m-2 "/>
                            </span>
                            <p class="md:text-content font-light ml-1 text-xs">Order is not found</p>
                        </div>
                    </td>
                </tr>
			{:else}
                {#each paginatedOrders as order}
                    <tr class="mr-6 bg-white text-center border-b cursor-pointer transition-colors duration-150" in:fade={{duration: 200}} on:click={() => toggleOrderDetails(order?._id)}>
                        <td class="px-4 py-2 text-xs">{formatDate(order?.createdAt) || 'N/A'}</td>
                        <td class="px-4 py-2 text-xs">{order?.orderid || 'N/A'}</td>
                        <!-- {#if order?.purchaseorder}
                            <td class="px-4 py-2 text-xs font-semibold">{order?.purchaseorder || 'N/A'}</td>
                        {/if} -->
                        <td class="px-4 py-2 text-xs">{formatCurrency(order?.totalprice || 0, order?.currency || 'INR')}</td>
                        <td class="px-4 py-2 text-xs">
                            <!-- <a href={`/order-status/${order?.orderid}?email=${userEmail}`} class="text-blue-500 hover:text-blue-700"> -->
                                <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                                    order?.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    order?.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                                    order?.status === 'pending cancellation' ? 'bg-red-100 text-red-600 border border-red-100' :
                                    order?.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    order?.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                    <Icon icon={order?.status === 'pending' ? 'ri:time-line' :
                                        order?.status === 'cancelled' ? 'ri:close-circle-line' :
                                        order?.status === 'pending cancellation' ? 'fluent:calendar-cancel-20-regular' :
                                        order?.status === 'shipped' ? 'la:shipping-fast' :
                                        order?.status === 'completed' ? 'ri:checkbox-circle-line' :
                                        'ri:question-line'
                                    } width="16" height="16" />
                                    {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
                             </span>
                            <!-- </a> -->
                        </td>
                        <td class="text-center px-1 py-1.5 flex justify-center gap-1">
                            <button
                              type="button"
                              disabled={isLoading}
                              on:click={() => toggleOrderDetails(order?._id)}
                              class=" border text-primary-500 hover:text-white rounded hover:bg-primary-600 transition-all duration-300 flex items-center gap-1 relative group">
                              <!-- svelte-ignore a11y-click-events-have-key-events -->
                              <!-- svelte-ignore a11y-no-static-element-interactions -->
                              <span class="relative" on:click={() => toggleOrderDetails(order?._id)}>
                                <Icon
                                  icon={isLoading ? 'mdi:loading' : (expandedOrderId === order?._id ? 'mdi:chevron-up' : 'mdi:chevron-down')}
                                  class="text-4xl px-2 {isLoading ? 'animate-spin' : ''}"/>
                                  <span class="absolute left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap top-full mt-1 px-2 bg-gray-200 text-gray-600 text-2s py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      {expandedOrderId === order?._id ? 'Hide Details' : 'Show Details'}
                                    </span>
                              </span>
                            </button>
                              <span class="text-gray-400 px-2 py-2">|</span>
                              <a href={`/order-status/${order?.orderid}?email=${userEmail}`} >
                                  <button
                                      type="button"
                                      class="px-2 py-2 border text-primary-500 hover:text-white rounded hover:bg-primary-600 transition-all duration-300 flex items-center gap-1 relative group">
                                      <span class="relative">
                                          <Icon icon="fluent:open-24-filled" class="text-xl" />
                                          <span class="absolute left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap top-full mt-2.5 px-2 bg-gray-200 text-gray-600 text-2s py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                              Order Status
                                          </span>
                                      </span>
                                  </button>
                              </a>
                          </td>
                    </tr>
                    {#if expandedOrderId === order?._id}
                        <tr class="bg-white" >
                            <td colspan="6" class="border p-0">
                                <div transition:slide={{duration: 300, easing: quintOut}} 
                                     class="transition-all duration-300">
                                    <div class="p-4 space-y-4">
                                    <div class="bg-white p-4 rounded-md  shadow">
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
                                            {#if order?.transactionid && order?.transdetails}
                                                <div>
                                                    <p class="text-heading font-semibold">Transation ID</p>
                                                    <p>{order?.transactionid || '--'}</p>
                                                </div>
                                            {/if}
                                            <div>
                                                <p class="text-heading font-semibold">Invoice Number</p>
                                                <p class="text-xs">{order?.invoice || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-white p-4 rounded-md shadow">
                                        <div class="flex justify-between items-center">
                                            <h4 class="font-bold text-heading mb-2">Order Items</h4>
                                          </div>
                                        <div class="overflow-x-auto rounded-t-md">
                                            <table class="w-full sm:text-sm text-xs ">
                                                <thead class="rounded-md ">
                                                    <tr class="bg-gradient-to-r from-primary-500 to-primary-600 text-white uppercase text-xs tracking-wider">
                                                        <th class="border px-2 py-1 text-left whitespace-nowrap">Product Name</th>
                                                        <th class="border px-2 py-1 text-center whitespace-nowrap">Order Qty</th>
                                                        <!-- <th class="border px-2 py-1 text-center">Available</th> -->
                                                        <th class="border px-2 py-1 text-center">Ready</th>
                                                        <th class="border px-2 py-1 text-center whitespace-nowrap">Back Order</th>
                                                        <!-- <th class="border px-2 py-1 text-center whitespace-nowrap">Lead Time</th> -->
                                                        <!-- <th class="border px-2 py-1 text-center">Customer Ref</th> -->
                                                        <th class="border px-2 py-1 text-right whitespace-nowrap">Unit Price</th>
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
                                                            <!-- <td class="border px-2 py-1 text-center">{item?.leadtime || '--' }</td> -->
                                                            <!-- <td class="border px-2 py-1 text-center">{item?.customerReference || '--'}</td> -->
                                                            <td class="border px-2 py-1 text-right">{formatCurrency(item?.unitPrice || 0, item?.currency || 'INR')}</td>
                                                            <td class="border px-2 py-1 text-right">{formatCurrency(item?.extendedPrice || 0, item?.currency || 'INR')}</td>
                                                        </tr>
                                                    {/each}
                                                </tbody>                                                                                  
                                            </table>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-md shadow p-4">
                                        <h3 class="font-bold mb-2 text-heading">Address Details</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                                                <div class="text-sm">
                                                    {#each formatAddress(order?.shippingaddress || order?.shipmentAddress) as line}
                                                        <p class="flex flex-wrap mb-1">{line}</p>
                                                    {/each}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-500 mb-2">Billing Address</h4>
                                                <div class="text-sm">
                                                    {#each formatAddress(order?.billingaddress) as line}
                                                        <p class="flex flex-wrap mb-1">{line}</p>
                                                    {/each}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {#if order?.transactionid && order?.transdetails}
                                        <div class="bg-white p-4 rounded-md shadow">
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
                                        class="bg-primary-500 text-white px-3 py-1.5 border rounded-md shadow my-1 md:text-sm text-2s hover:bg-primary-600 inline-flex transition-all duration-300">
                                        <Icon icon="basil:download-solid" class="text-xl mr-2" />
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
    <div class="lg:hidden space-y-4">
        {#if !paginatedOrders.length}
            <div class="flex items-center justify-center shadow rounded-md py-4 bg-white">
                <span class="bg-primary-50 rounded-full items-center">
                  <Icon icon="mdi:box-alert-outline" class="text-primary-500 md:text-xl text-sm m-2 "/>
                </span>
                <p class="md:text-content font-light ml-1 text-xs">Order is not found</p>
            </div>
        {:else}
            {#each paginatedOrders as order}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="bg-white rounded-lg shadow p-4 space-y-2" on:click={() => toggleOrderDetails(order?._id)}>
                    <div class="flex justify-between items-center">
                        <div class="text-sm font-semibold">{formatDate(order?.createdAt) || 'N/A'}</div>
                        <div class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                            order?.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            order?.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                            order?.status === 'pending cancellation' ? 'bg-red-100 text-red-600 border border-red-100' :
                            order?.status === 'shipped' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            order?.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                            <Icon icon={order?.status === 'pending' ? 'ri:time-line' :
                                order?.status === 'cancelled' ? 'ri:close-circle-line' :
                                order?.status === 'pending cancellation' ? 'fluent:calendar-cancel-20-regular' :
                                order?.status === 'shipped' ? 'la:shipping-fast' :
                                order?.status === 'completed' ? 'ri:checkbox-circle-line' :
                                'ri:question-line'
                            } width="16" height="16" />
                            {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
                        </div>
                    </div>
                    <div class="text-xs text-gray-600">Order ID: <span class="font-medium">{order?.orderid || 'N/A'}</span></div>
                    <div class="text-xs text-gray-600">Total: <span class="font-medium">{formatCurrency(order?.totalprice || 0, order?.currency || 'INR')}</span></div>
                    <div class="flex gap-2 pt-2 sm:max-w-sm">
                        <button 
                            type="button"
                            disabled={isLoading}
                            class="flex-1 text-primary-500 border border-primary-500 rounded-md py-1 text-xs flex items-center justify-center gap-1 hover:bg-primary-600 hover:text-white transition-all"
                            on:click|stopPropagation={() => toggleOrderDetails(order?._id)}>
                            <Icon icon={isLoading ? 'mdi:loading' : (expandedOrderId === order?._id ? 'mdi:chevron-up' : 'mdi:chevron-down')} class={`text-base ${isLoading ? 'animate-spin' : ''}`} />
                            {expandedOrderId === order?._id ? 'Hide Details' : 'Show Details'}
                        </button>
                        <a href={`/order-status/${order?.orderid}?email=${userEmail}`} class="flex-1">
                            <button class="w-full text-primary-500 border border-primary-500 rounded-md py-1 text-xs flex items-center justify-center gap-1 hover:bg-primary-600 hover:text-white transition-all">
                                <Icon icon="fluent:open-24-filled" class="text-base" />
                                Order Status
                            </button>
                        </a>
                    </div>
    
                    {#if expandedOrderId === order?._id}
                        <div transition:slide={{ duration: 300, easing: quintOut }} class="pt-4 space-y-4">
                            <div class="bg-white p-4 rounded-md shadow border">
                                <h4 class="text-heading font-bold mb-2 text-sm">Order Summary</h4>
                                <div class="grid grid-cols-2 gap-3 text-xs">
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
                                    {#if order?.transactionid && order?.transdetails}
                                        <div>
                                            <p class="text-heading font-semibold">Transaction ID</p>
                                            <p class="break-words">{order?.transactionid || '--'}</p>
                                        </div>
                                    {/if}
                                    <div class="col-span-2">
                                        <p class="text-heading font-semibold">Invoice Number</p>
                                        <p class="text-xs break-words">{order?.invoice || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white p-4 rounded-md shadow border">
                                <h4 class="font-bold text-heading mb-3 text-sm">Order Items</h4>
                                {#each order?.orderdetails || [] as item}
                                    <div class="border rounded mb-2 p-2">
                                        <div class="font-medium text-xs">{item?.productName || 'N/A'}</div>
                                        <div class="grid grid-cols-2 gap-2 text-xs mt-1">
                                            <div>
                                                <span class="text-gray-500">Qty:</span> {item?.orderQty || 0}
                                            </div>
                                            <div>
                                                <span class="text-gray-500">Ready:</span> {item?.readyToShip || 0}
                                            </div>
                                            <div>
                                                <span class="text-gray-500">Back Order:</span> {item?.backOrder || 0}
                                            </div>
                                            <div>
                                                <span class="text-gray-500">Unit Price:</span> {formatCurrency(item?.unitPrice || 0, item?.currency || 'INR')}
                                            </div>
                                            <div class="col-span-2 text-right font-medium">
                                                Total: {formatCurrency(item?.extendedPrice || 0, item?.currency || 'INR')}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div class="bg-white rounded-md shadow border p-4">
                                <h3 class="font-bold mb-3 text-heading text-sm">Address Details</h3>
                                <div class="flex justify-between">
                                    <div>
                                        <h4 class="text-xs font-medium text-gray-500 mb-1">Shipping Address</h4>
                                        <div class="text-xs">
                                            {#each formatAddress(order?.shippingaddress || order?.shipmentAddress) as line}
                                                <p class="mb-1">{line}</p>
                                            {/each}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="text-xs font-medium text-gray-500 mb-1">Billing Address</h4>
                                        <div class="text-xs">
                                            {#each formatAddress(order?.billingaddress) as line}
                                                <p class="mb-1">{line}</p>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if order?.transactionid && order?.transdetails}
                                <div class="bg-white p-4 rounded-md shadow border">
                                    <h4 class="text-heading font-bold mb-3 text-sm">Transaction Details</h4>
                                    <div class="mb-3">
                                        <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getTransactionStatusClass(order.transdetails.status)}`}>
                                            <Icon icon={getTransactionStatusIcon(order.transdetails.status)} width="16" height="16" />
                                            {order.transdetails.status.charAt(0).toUpperCase() + order.transdetails.status.slice(1)}
                                        </span>
                                        {#if order.transdetails.error_Message}
                                            <p class="text-xs text-red-600 mt-2">{order.transdetails.error_Message}</p>
                                        {/if}
                                    </div>
                                    <div class="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <p class="text-gray-600">Payment ID</p>
                                            <p class="font-medium break-words">{order.transdetails.mihpayid || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">Bank Reference</p>
                                            <p class="font-medium break-words">{order.transdetails.bank_ref_num || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">Payment Mode</p>
                                            <p class="font-medium">{order.transdetails.mode || order.transdetails.payment_source || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">Amount</p>
                                            <p class="font-medium">{formatCurrency(order.transdetails.amount, order.currency)}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-600">Transaction Date</p>
                                            <p class="font-medium">{order.transdetails.addedon || 'N/A'}</p>
                                        </div>
                                        {#if order.transdetails.status === 'success'}
                                            <div>
                                                <p class="text-gray-600">Net Amount Debited</p>
                                                <p class="font-medium">{formatCurrency(order.transdetails.net_amount_debit, order.currency)}</p>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                            <div class="text-right pt-2">
                                <button 
                                    on:click|stopPropagation={() => downloadAsExcel(order)} 
                                    class="bg-primary-500 text-white px-3 py-1 rounded shadow text-xs hover:bg-primary-600 transition-all duration-300 inline-flex items-center gap-1">
                                    <Icon icon="basil:download-solid" width="16" height="16" />
                                    Download as Excel
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if totalPages > 1}
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
     {/if}  
    <Toaster position="bottom-right" richColors />
</div>