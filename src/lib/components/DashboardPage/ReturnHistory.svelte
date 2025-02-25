<script>
  import { writable } from 'svelte/store';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import { slide, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { toast, Toaster } from 'svelte-sonner';
  import Calender from '$lib/components/Calender.svelte';
  
  export let data;
  
  let returns = data.returns || [];
//   console.log("returnsData======>",returns)
  let expandedReturnId = null;
  let calendarComponent;
  
  let currentPage = writable(1);
  let itemsPerPage = writable(10);
  let totalItems;
  
  let filters = {
      dateRange: '',
      searchTerm: '',
      status: '',
      firstTimeOnly: false,
      dateRange: 'custom'
  };

  const getEarliestOrderDate = (returns) => {
        if (!returns || returns.length === 0) return null;
        return new Date(Math.min(...returns.map(returns => new Date(returns.createdAt))));
    };

    const handleDateChange = (event) => {
        const { dates } = event.detail;
        filters.dateFrom = dates.from;
        filters.dateTo = dates.to;
        filterReturns();
    };

    const handleFilterChange = (event) => {
        const { filters: newFilters } = event.detail;
        filters = {
            ...filters,
            ...newFilters
        };
        filterReturns();
    };
  
  $: isAnyFilterActive = filters.dateRange !== '' ||  
      filters.searchTerm !== '' || 
      filters.status !== '' ;

  let filteredReturns = [];
  
  $: totalItems = filteredReturns.length;
  $: paginatedReturns = getPaginatedData($currentPage, $itemsPerPage, filteredReturns);
  $: totalPages = Math.ceil(totalItems / $itemsPerPage);
  
  const DOTS = '...';
  const VISIBLE_PAGES = 7;
  
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
        return 'Not Set';
    }
    const date = new Date(dateString);

    if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
        return 'Not Set';
    }  
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
  
  const isDateInRange = (date, fromDate, toDate) => {
      const checkDate = new Date(date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      checkDate.setHours(0, 0, 0, 0);
      
      if (start && end) return checkDate >= start && checkDate <= end;
      if (start) return checkDate >= start;
      if (end) return checkDate <= end;
      return true;
  };
  
  const filterReturns = () => {
      let filtered = [...returns];
      
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
          const searchTermLower = filters.searchTerm.toLowerCase().trim();
          filtered = filtered.filter(item => {
              return item.returnOrderid?.toString().toLowerCase().includes(searchTermLower) ||
                     item.invoiceNumber?.toString().toLowerCase().includes(searchTermLower) ||
                     item.orderNumber?.toString().toLowerCase().includes(searchTermLower);
          });
      }
      
      if (filters.dateFrom || filters.dateTo) {
          filtered = filtered.filter(item => 
              isDateInRange(item.createdAt, filters.dateFrom, filters.dateTo)
          );
      }
      
      if (filters.status) {
          filtered = filtered.filter(item => 
              item.status?.status?.toLowerCase() === filters.status.toLowerCase()
          );
      }
      
      filteredReturns = filtered;
      currentPage.set(1);
  };
  
  function getPaginatedData(currentPageValue, itemsPerPageValue, tableData) {
      const startIndex = (currentPageValue - 1) * itemsPerPageValue;
      const endIndex = startIndex + itemsPerPageValue;
      return tableData.slice(startIndex, endIndex);
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
  
      if (start > 2) range.push(DOTS);
      for (let i = start; i <= end; i++) range.push(i);
      if (end < totalPages - 1) range.push(DOTS);
      if (totalPages > 1) range.push(totalPages);
  
      return range;
  }
  const getStatusObject = (returnItem) => {
    if (typeof returnItem.status === 'string') {
        return {
            status: returnItem.status,
            estimation: null,
            picked: null
        };
    }
    return returnItem.status;
  };

  const getStatusClass = (status) => {
    const statusText = typeof status === 'string' ? status : status.status;
    switch (statusText) {
        case 'Received':
            return 'bg-green-100 text-green-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};
  
  function handlePageChange(page) {
      if (page >= 1 && page <= totalPages && page !== $currentPage) {
          currentPage.set(page);
      }
  }
  
  const toggleReturnDetails = (returnId) => {
      expandedReturnId = expandedReturnId === returnId ? null : returnId;
  };
  
  const clearFilters = () => {
      filters = {
          dateRange: '',
          searchTerm: '',
          status: ''
      };
      filterReturns();
  };

  function clearSearch() {
		filters = {
			searchTerm: ''
		};
        filterReturns();
	}
  
  const handleSearch = (event) => {
      filters.searchTerm = event.target.value;
      filterReturns();
  };
  
  const handleCancelReturn = () => {
    // console.log("Starting cancel return process");
    const loadingToast = toast.loading("Cancelling return...");

   return async ({ result }) => {
    // console.log("Received result:", result);
      toast.dismiss(loadingToast);

      if (result.type === "success") {
        toast.success("Successfully cancelled return request");
        setTimeout(() => { 
          location.reload(); 
        }, 2000);
      } else {
        toast.error("Failed to cancel return", {
          description: "Please try again or contact support"
        });
      }
    };
  };

  $: {
      if (returns) {
          filterReturns();
      }
  }
  </script>
  <section class="w-full lg:w-11/12 mx-auto max-w-7xl py-2 px-4">
      <h1 class="text-2xl font-bold text-heading mb-6 text-left w-full">Return Orders</h1>
      {#if !returns.length}
      <div class="border-l-8 rounded-xl shadow-sm border mb-6 border-red-600 hover:bg-red-50 p-8 text-center">
        <div class="w-full flex flex-col items-center gap-4 text-center md:m-0 mx-2 justify-center text-red-700 p-6 mb-6 rounded-2xl transition-all duration-300">
            <div class="rounded-full bg-primary-50 p-4 shadow">
                <Icon icon="carbon:document-unknown" class="text-red-600" width="48" height="48" />
            </div>
            <div class="space-y-2">
                <h3 class="text-lg font-medium text-gray-900">No Returns Found</h3>
                <p class="text-sm text-gray-500 max-w-sm mx-auto">You haven't made any return requests yet.</p>
            </div>
        </div>
      </div>
      {:else}
      <div class="flex flex-col w-full mb-4 mx-auto ">
        <div class="flex flex-col lg:flex-row">
          <div class="w-full lg:w-1/3">
            <div class="relative">
               <Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
              <input
                type="text"
                placeholder="Search by Return Order ID, Invoice Number, or Order Number"
                class="w-full h-10 border rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-primary-500"
                bind:value={filters.searchTerm}
                on:input={handleSearch}/>
                {#if filters.searchTerm}
                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded" style="color: #cb1919" on:click={clearSearch}>
                    <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
                </button>
            {/if} 
            </div>
          </div>
          <div class="flex-1 lg:w-1/3 lg:max-w-xs lg:mr-2 lg:mx-2 my-2 md:my-2 lg:my-0">
              <Calender
          bind:this={calendarComponent}
          minDate={getEarliestOrderDate(filteredReturns)}
          on:dateChange={handleDateChange}
          on:filterChange={handleFilterChange}
          initialFilters={{
              firstTimeOnly: false,
              dateRange: 'custom'
          }} />
          </div> 
        <!--  <div class="flex flex-col sm:flex-row w-full  lg:mx-2 my-2 md:my-2 lg:my-0 lg:w-2/5">
             <div class="flex-1 min-w-[150px]">
              <input
                type="date"
                class="w-full h-10 border rounded px-3 py-2 text-sm focus:outline-none"
                bind:value={filters.dateFrom}
                on:change={filterReturns}/>
            </div>
            <div class="flex items-center justify-center">
              <span class="text-sm font-medium px-2 whitespace-nowrap">To</span>
            </div>
            <div class="flex-1 min-w-[150px]">
              <input
                type="date"
                class="w-full h-10 border rounded px-3 py-2 text-sm focus:outline-none"
                bind:value={filters.dateTo}
                on:change={filterReturns}/>
            </div>
          </div> -->
          <div class="flex flex-col sm:flex-row w-full lg:w-1/4">
            <div class="flex-1 sm:max-w-[200px]">
              <select
                class="w-full h-10 border rounded px-3 py-2 text-sm appearance-none bg-white focus:outline-none focus:ring-0 focus:border-primary-500"
                bind:value={filters.status}
                on:change={filterReturns}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="processed">Processed</option>
              </select>
            </div>
            <div class="flex-1 md:ml-2 md:mt-0 mt-2">
              <button
                class="w-full h-10 border bg-white border-primary-500 rounded flex items-center justify-center px-4 text-sm hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={clearFilters}
                disabled={!isAnyFilterActive}>
                <Icon icon="hugeicons:filter-remove" class="mr-2" width="20" height="20"/>
                <span class="text-xs">Clear filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {#if filteredReturns.length === 0}
      <div class="p-8 my-2 border border-yellow-500 rounded flex justify-center bg-white items-center">
          <p class="text-yellow-800">No returns match your current filters. Try adjusting your search criteria.</p>
      </div>
      {:else}
          <div class="py-1">
              {#each paginatedReturns as item (item._id)}
                  <div class="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-no-static-element-interactions -->
                      <div class="p-4 cursor-pointer hover:bg-gray-50" 
                           on:click={() => toggleReturnDetails(item?._id)}
                           in:fade={{duration: 200}}>
                          <div class="flex flex-col md:flex-row justify-between items-center">
                              <div class="space-y-1">
                                  <div class="flex items-center gap-4">
                                      <span class="text-sm font-semibold">Return ID: {item?.returnOrderid || 'N/A'}</span>
                                      <span class="text-sm text-gray-600">Created: {formatDate(item?.createdAt) || 'N/A'}</span>
                                  </div>
                                  <div class="text-sm text-gray-600 flex md:flex-row flex-col my-1 md:my-0">
                                    <span>
                                        Invoice: {item?.invoiceNumber || 'N/A'}
                                    </span>
                                    <span class="hidden md:block lg:inline-block px-2">|</span>
                                    <span>
                                        Order: {item?.orderNumber || 'N/A'}
                                    </span>
                                  </div>
                              </div>
                              <div class="flex flex-row justify-between md:gap-6 mt-4 md:mt-0 w-44">
                                  <span class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(item?.status) || 'N/A'}`}>
                                    {typeof item.status === 'string' ? item.status : item.status.status}
                                  </span>
                                  <button class="text-primary-500 hover:text-primary-700 text-xs">
                                      {expandedReturnId === item._id ? 'Hide Details' : 'Show Details'}
                                  </button>
                              </div>
                          </div>
                      </div>
                      {#if expandedReturnId === item._id}
                          <div transition:slide={{duration: 300, easing: quintOut}} 
                               class="border-t border-gray-200 p-4">
                              <div class="space-y-6">
                                  <div>
                                      <h4 class="text-lg font-semibold text-heading mb-4">Return Items</h4>
                                      <div class="overflow-x-auto">
                                          <table class="min-w-full divide-y divide-gray-200">
                                              <thead class="bg-gray-50">
                                                  <tr>
                                                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Qty</th>
                                                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Qty</th>
                                                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                                                  </tr>
                                              </thead>
                                              <tbody class="bg-white divide-y divide-gray-200">
                                                  {#each item.returnItems?.selectedItems || [] as returnItem}
                                                      <tr class="hover:bg-gray-50">
                                                          <td class="px-6 py-4 whitespace-nowrap text-sm">{returnItem?.productName || 'N/A'}</td>
                                                          <td class="px-6 py-4 whitespace-nowrap text-sm">{returnItem?.orderQty || 0}</td>
                                                          <td class="px-6 py-4 whitespace-nowrap text-sm">{returnItem?.returnqty || 0 }</td>
                                                          <td class="px-6 py-4 whitespace-nowrap text-sm">{returnItem?.reason || 'N/A'}</td>
                                                          <td class="px-6 py-4 whitespace-nowrap text-sm">{returnItem?.resolution || 'N/A'}</td>
                                                      </tr>
                                                  {/each}
                                              </tbody>
                                          </table>
                                      </div>
                                  </div>
                                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div class="bg-gray-50 p-4 rounded">
                                          <h5 class="text-sm font-medium text-gray-500 mb-2">Estimation Date</h5>
                                          <p class="text-sm">{formatDate(getStatusObject(item).estimation)}</p>
                                      </div>
                                      <div class="bg-gray-50 p-4 rounded">
                                          <h5 class="text-sm font-medium text-gray-500 mb-2">Picked Date</h5>
                                          <p class="text-sm">{formatDate(getStatusObject(item).picked) || 'N/A'}</p>
                                      </div>
                                      <div class="bg-gray-50 p-4 rounded">
                                          <h5 class="text-sm font-medium text-gray-500 mb-2">Current Status</h5>
                                          <p class="text-sm">{getStatusObject(item).status || 'N/A'}</p>
                                      </div>
                                  </div>
                                  <form method="POST" action="?/cancelreturn" class="flex justify-end" use:enhance={handleCancelReturn}>
                                      <input type="hidden" name="id" value={item._id}>
                                      <button type="submit"
                                              class="px-4 py-2 border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white transition-colors">
                                          Cancel Return
                                      </button>
                                  </form>
                              </div>
                          </div>
                      {/if}
                  </div>
              {/each}
          </div>
          <div class="flex items-center justify-between border border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg shadow mb-2">
              <div class="flex flex-1 justify-between sm:hidden ">
                  <button class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          on:click={() => handlePageChange($currentPage - 1)}
                          disabled={$currentPage === 1}>
                      Previous
                  </button>
                  <button class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          on:click={() => handlePageChange($currentPage + 1)}
                          disabled={$currentPage === totalPages}>
                      Next
                  </button>
                </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                  <!-- <p class="text-sm text-gray-700">
                      Showing <span class="font-medium">{($currentPage - 1) * $itemsPerPage + 1}</span> to{' '}
                      <span class="font-medium">
                          {Math.min($currentPage * $itemsPerPage, totalItems)}
                      </span> of{' '}
                      <span class="font-medium">{totalItems}</span> results
                  </p> -->
              </div>
              <div class="flex items-center gap-2">
                  <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={() => handlePageChange(1)}
                      disabled={$currentPage === 1}
                      aria-label="First page">
                      <Icon icon="charm:chevrons-left" width="16" height="16" />
                  </button>                 
                  <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={() => handlePageChange($currentPage - 1)}
                      disabled={$currentPage === 1}
                      aria-label="Previous page">
                      <Icon icon="charm:chevron-left" width="16" height="16" />
                  </button>  
                  {#each getPageRange($currentPage, totalItems) as page}
                      {#if page === DOTS}
                          <span class="inline-flex h-8 w-8 items-center justify-center">...</span>
                      {:else}
                          <button
                              class={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${
                                  page === $currentPage
                                      ? 'bg-primary-500 text-white border-primary-500'
                                      : 'border-gray-300 bg-white text-gray-500 hover:bg-primary-50'
                              }`}
                              on:click={() => handlePageChange(page)}
                              disabled={page === $currentPage}
                              aria-label="Page {page}"
                              aria-current={page === $currentPage ? 'page' : undefined}>
                              {page}
                          </button>
                      {/if}
                  {/each}              
                  <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={() => handlePageChange($currentPage + 1)}
                      disabled={$currentPage === totalPages}
                      aria-label="Next page">
                      <Icon icon="charm:chevron-right" width="16" height="16" />
                  </button>           
                  <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={() => handlePageChange(totalPages)}
                      disabled={$currentPage === totalPages}
                      aria-label="Last page">
                      <Icon icon="charm:chevrons-right" width="16" height="16" />
                  </button>
              </div>
          </div>
      </div>
      {/if}
    {/if}
 <Toaster position="bottom-right" richColors />
</section>