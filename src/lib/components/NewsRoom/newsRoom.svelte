<script>
  import Icon from "@iconify/svelte";
  import { PUBLIC_COMPBUY_IMAGE_PATH } from "$env/static/public";
  
  export let data;

  let items = Array.isArray(data?.newsrooms) ? [...data.newsrooms] : [];
  let currentPage = 0; 
  let itemsPerPage = 12;
  let filteredItems = items;
  let searchQuery = "";
  let searchTimeout;
  
  const DOTS = '...';
  const VISIBLE_PAGES = 5;

  $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  $: pageNumbers = getPageRange(currentPage, totalPages);
  $: paginatedItems = getPaginatedData(filteredItems, currentPage, itemsPerPage);

  $: {
    if (items && items.length > 0) {
      filterItems();
    }
  }

  function getPaginatedData(items, currentPageNum, itemsPerPageNum) {
    const startIndex = currentPageNum * itemsPerPageNum;
    const endIndex = startIndex + itemsPerPageNum;
    return items.slice(startIndex, endIndex);
  }

  function filterItems() {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      if (!searchQuery || searchQuery.trim() === "") {
        filteredItems = items;
      } else {
        const query = searchQuery.toLowerCase().trim();
        filteredItems = items.filter(item => 
          item && item.title && item.title.toLowerCase().includes(query)
        );
      }
      currentPage = 0;
    }, 100);
  }

  function handlePageChange(page) {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      currentPage = page;
      scrollToTop();
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage += 1;
      scrollToTop();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage -= 1;
      scrollToTop();
    }
  }

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getPageRange(currentPageNum, totalPageCount) {
    const totalPageNumbers = VISIBLE_PAGES;
    
    if (totalPageCount === 0) return [];
    
    if (totalPageNumbers >= totalPageCount) {
      return range(0, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPageNum - Math.floor(VISIBLE_PAGES / 2), 0);
    const rightSiblingIndex = Math.min(leftSiblingIndex + VISIBLE_PAGES - 1, totalPageCount - 1);
    
    const adjustedLeftSiblingIndex = Math.max(
      rightSiblingIndex - VISIBLE_PAGES + 1,
      0
    );
    
    const shouldShowLeftDots = adjustedLeftSiblingIndex > 1;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = VISIBLE_PAGES - 1;
      const leftRange = range(0, leftItemCount);
      return [...leftRange, DOTS, totalPageCount - 1];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = VISIBLE_PAGES - 1;
      const rightRange = range(totalPageCount - rightItemCount, totalPageCount);
      return [0, DOTS, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(adjustedLeftSiblingIndex, rightSiblingIndex + 1);
      return [0, DOTS, ...middleRange, DOTS, totalPageCount - 1];
    }

    return range(adjustedLeftSiblingIndex, rightSiblingIndex + 1);
  }

  function range(start, end) {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return "";
    }
  }
  
  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
      previousPage();
    } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
      nextPage();
    }
  }

  function clearSearch() {
    searchQuery = "";
    filterItems(); 
  }
</script>

<div class="w-full max-w-7xl lg:w-11/12 mx-auto px-4 py-4">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
    <h1 class="font-bold sm:text-2xl text-xl mb-4 md:mb-0">News Room</h1>
    <div class="w-full md:w-64 relative">
      <div class="relative flex items-center">
        <Icon
          icon="fa:search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="16"
          height="16"/>
        <input
          type="text"
          bind:value={searchQuery}
          on:input={filterItems}
          placeholder="Search by title..."
          class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-primary-500"
          aria-label="Search news by title" />
        {#if searchQuery}
          <button
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-100 p-1"
            style="color: #cb1919"
            on:click={clearSearch}
            aria-label="Clear search">
            <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
          </button>
        {/if}
      </div>
    </div>
  </div>
  {#if !items || items.length === 0}
    <div class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center">
      <Icon icon="ph:package-duotone" width="64" height="64" class="text-primary-400 mb-4"/>
      <h3 class="text-xl font-medium text-gray-900 mb-2">
        No news available
      </h3>
      <p class="text-gray-500 max-w-md">
        There are currently no news items to display. Please check back later.
      </p>
    </div>
  {:else if filteredItems.length === 0}
    <div class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center">
      <Icon icon="fluent-mdl2:news-search" width="64" height="64" class="text-primary-400 mb-4"/>
      <h3 class="text-xl font-medium text-gray-900 mb-2">
        No news found matching your search.
      </h3>
      <p class="text-gray-500 max-w-md">
        We couldn't find news with titles matching "{searchQuery}". Please
        try a different search term or 
        <button 
          class="text-primary-500 hover:underline" 
          on:click={clearSearch}>
          clear your search
        </button>.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
      {#each paginatedItems as item (item._id)}
        <a
          href={`newsroom/${item.newsLink}`}
          class="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          aria-label={item.title}>
          <div class="relative aspect-[4/3] overflow-hidden">
            {#if item.image}
            <img
              src={`${PUBLIC_COMPBUY_IMAGE_PATH}/prod/${item.image}`}
              onerror="this.src='/fallback.webp'"
              alt={item.title || "News image"}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"/>
              <!-- <img
                src={`${PUBLIC_COMPBUY_IMAGE_PATH}/prod/${item.image}`}
                onerror="this.onerror=null; this.src='/fallback.webp'"
                alt={item.title || "News image"}
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"/> -->
            {:else}
              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                <Icon icon="ph:image-duotone" width="48" height="48" class="text-gray-400" />
              </div>
            {/if}
          </div>
          <div class="p-4">
            <h2 class="font-semibold text-lg mb-2 line-clamp-2">
              {item.title || "Untitled"}
            </h2>
            <p class="text-sm text-gray-600 mb-2 line-clamp-3">
              {truncateText(item.previewText || "No description available", 120)}
            </p>
            <div class="pt-3 border-t border-gray-200 flex items-center text-sm text-gray-500">
              <Icon icon="uil:calendar-alt" class="mr-1" width="16" height="16"/>
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
    {#if totalPages > 1}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <nav 
        aria-label="Pagination" 
        class="flex justify-center mt-10 mb-5"
        on:keydown={handleKeyDown}>
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <button 
            class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            on:click={() => handlePageChange(0)}
            disabled={currentPage === 0}
            aria-label="First page">
            <Icon icon="charm:chevrons-left" class="w-4 h-4" />
          </button>
          <button 
            class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            on:click={previousPage}
            disabled={currentPage === 0}
            aria-label="Previous page">
            <Icon icon="charm:chevron-left" class="w-4 h-4" />
          </button>
          {#each pageNumbers as page}
            {#if page === DOTS}
              <span class="px-2 text-gray-500 text-sm font-medium">{DOTS}</span>
            {:else}
              <button
                on:click={() => handlePageChange(page)}
                class={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm shadow-sm border transition-all duration-200 transform ${
                  page === currentPage
                    ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-500 hover:text-white active:scale-95'
                }`}
                disabled={page === currentPage}
                aria-label={`Page ${page + 1}`}
                aria-current={page === currentPage ? "page" : undefined}>
                {page + 1}
              </button>
            {/if}
          {/each}
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            on:click={nextPage}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page">
            <Icon icon="charm:chevron-right" class="w-4 h-4" />
          </button>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            on:click={() => handlePageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Last page">
            <Icon icon="charm:chevrons-right" class="w-4 h-4" />
          </button>
        </div>
      </nav>
    {/if}
  {/if}
</div>