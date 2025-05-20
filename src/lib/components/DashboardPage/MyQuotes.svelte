<script>
 import { onMount } from 'svelte';
import Icon from '@iconify/svelte';
import { writable } from 'svelte/store';
import Calender from '$lib/components/Calender.svelte';
  
 export let data;
  let quotes = data?.quotes || [];
//   console.log("QUOTEs in FE=>>>", quotes)

  let selectedQuote = null;

  let currentPage = writable(1);
  let itemsPerPage = writable(10);
  const DOTS = '...';
  const VISIBLE_PAGES = 7;

  let filters = {
      searchTerm: '',
      dateFrom: '',
      dateTo: ''
  };

  let calendarComponent;

  
  function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }
  
  function openQuoteDetails(quote) {
      selectedQuote = quote;
  }
  
  function closeQuoteDetails() {
      selectedQuote = null;
  }

  function filterQuotes(items, filterCriteria) {
    return items.filter((item) => {
        const searchTerm = filterCriteria.searchTerm.toLowerCase().trim();
        const matchesSearch = !searchTerm || 
            item.Customer_details?.Firstname?.toLowerCase().includes(searchTerm) ||
            item.Customer_details?.Lastname?.toLowerCase().includes(searchTerm) ||
            item.quoteId?.toString().includes(searchTerm) ||
            item.Custom_solution_type?.toLowerCase().includes(searchTerm);

        const createdDate = new Date(item.createdAt);
        createdDate.setHours(0, 0, 0, 0);

        let matchesDateRange = true;

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

        return matchesSearch && matchesDateRange;
    });
}

function getEarliestQuoteDate(items) {
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
    const { dates } = event.detail;
    updateFilters('dateFrom', dates.from);
    updateFilters('dateTo', dates.to);
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
            console.error('From date cannot be later than To date');
            return;
        }
    }

    if (key === 'dateTo' && filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(value);
        if (toDate < fromDate) {
            console.error('To date cannot be earlier than From date');
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

    if (start > 2) range.push(DOTS);
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push(DOTS);
    if (totalPages > 1) range.push(totalPages);
    
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

$: filteredQuotes = filterQuotes(quotes, filters);
$: totalPages = Math.ceil(filteredQuotes.length / $itemsPerPage);
$: pageNumbers = getPageRange($currentPage, filteredQuotes.length);
$: paginatedQuotes = getPaginatedData(filteredQuotes, $currentPage, $itemsPerPage);

onMount(() => {
    const earliestDate = getEarliestQuoteDate(quotes);
});

function getStatusColor (status) {
        switch(status?.toLowerCase()) {
            case 'responded':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'spam':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'unread':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    function getStatusIcon (status) {
        switch(status?.toLowerCase()) {
            case 'responded':
                return 'ri:checkbox-circle-line';
            case 'spam':
                return 'ri:close-circle-line';
            case 'unread':
                return 'ri:time-line';
            default:
                return 'ri:question-line';
        }
    };
</script>

<div class="w-full lg:w-11/12 mx-auto max-w-7xl p-4 space-y-4">
  <h1 class="text-2xl font-bold text-gray-900">My Quote</h1>
  <div class="flex flex-col lg:flex-row lg:gap-6 gap-4 mb-6 w-full">
    <div class="w-full relative">
        <Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
        <input 
            type="text" 
            placeholder="Search by Name, Quote ID, or Solution Type" 
            class="w-full h-10 border border-gray-400 focus:ring-0 focus:border-primary-500 rounded-md px-4 py-2 pl-10 text-sm outline-none transition-all duration-200" 
            value={filters.searchTerm} 
            on:input={handleSearch}/>
        {#if filters.searchTerm}
            <button 
                type="button" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-50 hover:bg-red-100  " 
                on:click={clearSearch}>
                <Icon icon="oui:cross" class="text-xl p-0.5 font-bold  text-red-500" />
            </button>
        {/if}
    </div>
    <div class="flex flex-col lg:flex-row w-full lg:w-2/3 sm:flex-row gap-2 lg:items-center">
        <div class="relative w-full">
            <Calender
                bind:this={calendarComponent}
                minDate={getEarliestQuoteDate(quotes)}
                on:dateChange={handleDateChange}
                initialFilters={{
                    firstTimeOnly: false,
                    dateRange: 'custom'
                }}
            />
        </div>
    </div>
    <div class="pt-2">
        <a href="/quotes" class="whitespace-nowrap justify-start items-center py-2.5 px-4 rounded-md text-white bg-primary-500 hover:bg-primary-600 transition-all duration-300">
           + Create Quote
        </a>
    </div>
</div>
  <div class="overflow-x-auto bg-white shadow rounded overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-primary-400 to-primary-500 text-white">
              <tr>
                  <th class="px-3 py-4 text-center text-xs font-medium uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Solution Details</th>
                  <th class="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Created</th>
                  <th class="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Status</th>
              </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
              {#if !paginatedQuotes.length}
                  <tr>
                      <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                          <p class="text-lg">No quotes found</p>
                          <p class="text-sm text-gray-400">New quotes will appear here</p>
                      </td>
                  </tr>
              {:else}
                  {#each paginatedQuotes as quote}
                      <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150" 
                          on:click={() => openQuoteDetails(quote)}>
                          <td class="px-3 py-4 whitespace-nowrap text-center">
                              <div class="text-sm font-medium text-primary-600">#{quote.quoteId}</div>
                          </td>
                          <td class="px-6 py-4">
                              <div class="text-sm font-medium text-gray-900">
                                  {quote.Customer_details?.Title} {quote.Customer_details?.Firstname} {quote.Customer_details?.Lastname}
                              </div>
                              <div class="text-sm text-gray-500">{quote.Customer_details?.organisation}</div>
                          </td>
                          <td class="px-6 py-4">
                              <div class="text-sm text-gray-900">{quote?.Custom_solution_type}</div>
                              <div class="text-sm text-gray-500">{quote?.Custom_format}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                              <div class="text-sm text-gray-900">{formatDate(quote?.createdAt) || 'N/A'}</div>
                          </td>
                          <td class="px-6 py-4 flex justify-center whitespace-nowrap">
                            <!-- <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getTransactionStatusClass(quote.status )}`}>
                              <Icon icon={getTransactionStatusIcon(quote.status )} width="16" height="16" />
                          </span> -->
                              <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold  rounded-full {getStatusColor(quote.status)}">
                                <Icon icon={getStatusIcon(quote.status )} class="text-lg mr-0.5"/>
                                  {quote?.status || 'N/A'}
                              </span>
                          </td>
                      </tr>
                  {/each}
              {/if}
          </tbody>
      </table>
  </div>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
  {#if totalPages > 1}
    <div
      class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-around border bg-white shadow px-4 py-4 rounded-b-md mt-4"
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
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          on:click={() => handlePageChange(totalPages)}
          disabled={$currentPage === totalPages}
          aria-label="Last page">
          <Icon icon="charm:chevrons-right" class="w-4 h-4" />
      </button>
  </div>
  <!-- <div class="text-sm text-gray-500">
      Showing {Math.min(($currentPage - 1) * $itemsPerPage + 1, filteredQuotes.length)} to {Math.min($currentPage * $itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} entries
  </div> -->
    </div>
 {/if}
</div>

{#if selectedQuote}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm overflow-y-auto hide h-full w-full z-50" on:click|self={closeQuoteDetails}>
      <div class="relative top-20 mx-auto p-5 w-full max-w-6xl">
          <div class="bg-white rounded-lg shadow-xl">
              <div class="px-6 py-4 border-b border-gray-200">
                  <div class="flex justify-between items-center">
                      <div>
                          <h2 class="text-2xl font-bold text-gray-900 mb-2">QuoteID #{selectedQuote?.quoteId || 'N/A'}</h2>
                          <p class="text-xs text-gray-500">Created on {formatDate(selectedQuote.createdAt) || 'N/A'}</p>
                      </div>
                      <button 
                          class="p-1 hover:bg-primary-50 rounded transition-all hover:border duration-300"
                          on:click={closeQuoteDetails}>
                          <Icon icon="mdi:close" class="text-xl text-gray-600 hover:text-primary-700" />
                      </button>
                  </div>
              </div>
              <div class="p-6 space-y-6">
                  <section>
                      <h3 class="text-lg font-semibold text-heading mb-4">Customer Information</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div class="bg-gray-50 p-4 rounded-lg">
                              <p class="text-sm font-semibold text-heading">Contact Details</p>
                              <p class="mt-2 text-sm text-gray-900">{selectedQuote.Customer_details?.Title || ''} {selectedQuote.Customer_details?.Firstname || 'N/A'} {selectedQuote.Customer_details?.Lastname || 'N/A'}</p>
                              <p class="mt-1 text-sm text-gray-600">{selectedQuote.Customer_details?.email || 'N/A'}</p>
                              <p class="mt-1 text-sm text-gray-600">{selectedQuote.Customer_details?.number || 'N/A'}</p>
                          </div>
                          <div class="bg-gray-50 p-4 rounded-lg">
                              <p class="text-sm font-semibold text-heading">Organization</p>
                              <p class="mt-2 text-sm text-gray-900">{selectedQuote?.Customer_details?.organisation || 'N/A'}</p>
                              <p class="mt-1 text-sm text-gray-600">{selectedQuote?.Customer_details?.country || 'N/A'}</p>
                          </div>
                          <div class="bg-gray-50 p-4 rounded-lg">
                              <p class="text-sm font-semibold text-heading">Delivery Address</p>
                              <p class="mt-2 text-sm text-gray-900">{selectedQuote?.Delivery_information?.Address1 || 'N/A'}</p>
                              <p class="mt-1 text-sm text-gray-600">
                                  {selectedQuote.Delivery_information?.City}, {selectedQuote?.Delivery_information?.State || ''}
                              </p>
                              <p class="text-sm text-gray-600">{selectedQuote.Delivery_information?.Post || 'N/A'}</p>
                          </div>
                      </div>
                  </section>
                 <section class="lg:block hidden">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Solution Specifications</h3>
                    <div class="w-full gap-2">
                      <div class="bg-gray-50 p-6 rounded">
                        <div class="mb-4">
                          <p class="text-sm font-semibold text-heading">Solution Type</p>
                          <p class="mt-1 text-sm text-gray-900">{selectedQuote?.Custom_solution_type || 'N/A'}</p>
                        </div>
                        <div class="grid grid-cols-3 gap-6">
                          <div>
                            <p class="text-sm font-semibold text-heading">Format</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote?.Custom_format || 'N/A'}</p>
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-heading">Quality Level</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote?.Configure_custom_solution?.qualityLevel || 'N/A' }</p>
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-heading">Volume</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote.Configure_custom_solution?.volume || '0 ml'}</p>
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-heading">Analytical Technique</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote.Configure_custom_solution?.analyticalTechnique || 'N/A'}</p>
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-heading">Packaging Type</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote.Configure_custom_solution?.packagingType || 'N/A'}</p>
                          </div>
                          <div>
                            <p class="text-sm font-semibold text-heading">Units</p>
                            <p class="mt-1 text-sm text-gray-900">{selectedQuote.Configure_custom_solution?.units || 0 }</p>
                          </div>
                        </div>
                      </div>
                      <div class="overflow-x-auto mt-6 bg-white">
                        <table class="w-full table-auto">
                          <thead class="bg-gradient-to-r from-primary-400 to-primary-500 text-white border-b">
                            <tr>
                              <th class="px-4 py-2 text-sm text-left font-semibold rounded-tl-md">Components</th>
                              <th class="px-4 py-2 text-sm text-center font-semibold">CAS</th>
                              <th class="px-4 py-2 text-sm text-center font-semibold rounded-tr-md">Concentration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each selectedQuote.Configure_custom_solution.components as component}
                            <tr class="border-b rounded-b-md">
                              <td class="px-4 py-2 text-left border-l">{component["Component Name"]}</td>
                              <td class="px-4 py-2 text-center">{component?.CasNumber || 'N/A'}</td>
                              <td class="px-4 py-2 text-center border-r">{component?.Concentration || 0}%</td>
                            </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 </section>
                 <section class="lg:hidden block">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Solution Specifications</h3>
                    <div class="overflow-x-auto bg-white rounded border">
                      <table class="min-w-full table-auto">
                        <tbody>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Solution Type</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote?.Custom_solution_type || 'N/A'}</td>
                          </tr>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Format</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote?.Custom_format || 'N/A'}</td>
                          </tr>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Quality Level</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote?.Configure_custom_solution?.qualityLevel || 'N/A' }</td>
                          </tr>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Volume</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote.Configure_custom_solution?.volume || '0 ml'}</td>
                          </tr>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Analytical Technique</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote.Configure_custom_solution?.analyticalTechnique || '0 ml'}</td>
                          </tr>
                          <tr class="border-b border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Packaging Type</td>
                            <td class="text-sm text-gray-900 py-2 px-4 capitalize">{selectedQuote.Configure_custom_solution?.packagingType || ''}</td>
                          </tr>
                          <tr class="border-gray-200">
                            <td class="text-sm font-semibold text-heading py-2 px-4">Units</td>
                            <td class="text-sm text-gray-900 py-2 px-4">{selectedQuote.Configure_custom_solution?.units || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="border p-4 rounded mt-6">
                      <p class="text-heading font-medium mb-3 border-b">Components</p>
                      <div class="space-y-3">
                        {#each selectedQuote.Configure_custom_solution.components as component}
                        <div class="border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                          <div class="flex justify-between items-center">
                            <div>
                              <p class="text-sm font-semibold text-heading mb-2">{component["Component Name"]}</p>
                              <p class="text-xs text-primary-500"><strong class="text-heading mt-2">CAS :</strong> {component?.CasNumber || 'N/A'}</p>
                            </div>
                            <span class="text-sm font-medium text-blue-600">{component?.Concentration || 0}%</span>
                          </div>
                        </div>
                        {/each}
                      </div>
                    </div>
                 </section>
                  {#if selectedQuote.Additional_notes}
                      <section>
                          <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                          <div class="bg-gray-50 p-4 rounded-lg">
                              <p class="text-sm text-gray-700">{selectedQuote?.Additional_notes || 'not available'}</p>
                          </div>
                      </section>
                  {/if}
              </div>
          </div>
      </div>
  </div>
{/if}