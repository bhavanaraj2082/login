<script>
  import Icon from "@iconify/svelte";
  export let data;
  import { PUBLIC_COMPBUY_IMAGE_PATH } from "$env/static/public";
  import { onMount } from "svelte";

  let items = [...data.newsrooms];
  let currentPage = 0;
  let itemsPerPage = 16;
  let filteredItems = items;
  let searchQuery = "";

  $: paginatedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  onMount(() => {
    // Initialize any necessary setup when component mounts
  });

  function filterItems() {
    if (!searchQuery.trim()) {
      filteredItems = items;
    } else {
      const query = searchQuery.toLowerCase();
      filteredItems = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.previewText && item.previewText.toLowerCase().includes(query))
      );
    }
    currentPage = 0; // Reset to first page when filtering
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

  function goToPage(page) {
    if (page >= 0 && page < totalPages) {
      currentPage = page;
      scrollToTop();
    }
  }

  function getPageNumbers() {
    let pageNumbers = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

<div class="w-full max-w-7xl mx-auto px-4 py-4">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
  >
    <h1 class="font-bold text-3xl mb-4 md:mb-0">News Room</h1>

    <div class="w-full md:w-64 relative">
      <input
        type="text"
        bind:value={searchQuery}
        on:input={filterItems}
        placeholder="Search news..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Search news"
      />
      <Icon
        icon="fa:search"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        width="16"
        height="16"
      />
    </div>
  </div>

  {#if filteredItems.length === 0}
    <div class="text-center py-12">
      <p class="text-xl text-gray-600">
        No news items found matching your search.
      </p>
    </div>
  {:else}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10"
    >
      {#each paginatedItems as item (item.newsLink)}
        <a
          href={`newsroom/${item.newsLink}`}
          class="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          aria-label={item.title}
        >
          <div class="relative aspect-[4/3] overflow-hidden">
            <img
              src={`${PUBLIC_COMPBUY_IMAGE_PATH}/prod/${item.image}`}
              onerror="this.src='/fallback.webp'"
              alt={item.title || "News image"}
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div class="p-4">
            <h2 class="font-semibold text-lg mb-2 line-clamp-2">
              {item.title}
            </h2>
            <p class="text-sm text-gray-600 mb-2 line-clamp-3">
              {truncateText(item.previewText, 120)}
            </p>
            <div
              class="pt-3 border-t border-gray-200 flex items-center text-sm text-gray-500"
            >
              <Icon
                icon="uil:calendar-alt"
                class="mr-1"
                width="16"
                height="16"
              />
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>

    {#if totalPages > 1}
      <nav aria-label="Pagination" class="flex justify-center mt-10 mb-5">
        <ul class="flex items-center gap-1">
          <li>
            <button
              class="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              on:click={() => goToPage(0)}
              disabled={currentPage === 0}
              aria-label="Go to first page"
            >
              <Icon icon="charm:chevrons-left" width="18" height="18" />
            </button>
          </li>
          <li>
            <button
              class="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              on:click={previousPage}
              disabled={currentPage === 0}
              aria-label="Go to previous page"
            >
              <Icon icon="ic:round-chevron-left" width="18" height="18" />
            </button>
          </li>

          {#each getPageNumbers() as page}
            <li>
              <button
                on:click={() => goToPage(page)}
                class={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                                ${
                                  page === currentPage
                                    ? "bg-primary-500 text-white border border-primary-500"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                aria-label={`Page ${page + 1}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page + 1}
              </button>
            </li>
          {/each}

          <li>
            <button
              class="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              on:click={nextPage}
              disabled={currentPage >= totalPages - 1}
              aria-label="Go to next page"
            >
              <Icon icon="charm:chevron-right" width="18" height="18" />
            </button>
          </li>
          <li>
            <button
              class="p-2 rounded-md border bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              on:click={() => goToPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Go to last page"
            >
              <Icon icon="charm:chevrons-right" width="18" height="18" />
            </button>
          </li>
        </ul>
      </nav>
    {/if}
  {/if}
</div>
