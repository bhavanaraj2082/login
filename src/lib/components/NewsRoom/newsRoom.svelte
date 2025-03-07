<script>
    import Icon from "@iconify/svelte";
    import { goto } from '$app/navigation';
    export let data;
    
    let items = [...data.newsrooms];
    
    let currentPage = 0;
    let itemsPerPage = 16;

    let filteredItems = items;

    // Pagination Logic
    $: paginatedItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    
    $:{
        console.log("paginatedItems",paginatedItems);
    }

    $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage += 1;
        }
    }

    function previousPage() {
        if (currentPage > 0) {
            currentPage -= 1;
        }
    }

    function truncateText(text, maxLength) {
        return text && text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    const goToPage = async (page) => {
    if (page > 0 && page <= totalPages) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', page.toString());
        if (selectedManufacturer) {
            newUrl.searchParams.set('manufacturer', selectedManufacturer);
        }
        if (search) {
            newUrl.searchParams.set('search', search);
        }
        currentPage = page;
        await goto(newUrl.toString());
    }
};

  
  const getPageNumbers = () => {
    let pageNumbers = [];
  
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  // Add pages to the array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
  };

</script>

<div class="p-4 w-10/12 mx-auto">
    <h1 class="font-bold text-2xl mb-4">News Room</h1>
    
    <!-- News Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each paginatedItems as item}
        <a href={`newsroom/${item.newsLink}`} class="bg-white shadow rounded p-4 block hover:scale-105 transform transition-all duration-300">
            <div>
          <img src={item.image} alt="img" class="w-full h-1/2 object-cover mx-auto" />
                <h2 class="font-semibold text-lg mb-2">{item.title}</h2>
                <p class="text-sm text-gray-600">{truncateText(item.previewText, 50)}</p>
            </div>
        </a>
        {/each}
    </div>

    <!-- Pagination Controls -->
    <!-- <div class="flex justify-center mt-6">
        <button 
            on:click={previousPage} 
            disabled={currentPage === 0} 
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50">
            Previous
        </button>
        
        <span class="mx-4">
            Page {currentPage + 1} of {totalPages}
        </span>
        
        <button 
            on:click={nextPage} 
            disabled={currentPage >= totalPages - 1} 
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50">
            Next
        </button>
    </div> -->
    <div class="w-fit gap-1 sm:gap-1.5 mx-auto flex mt-10 mb-5">
        <!-- Previous Buttons -->
        <button class="border shadow-md bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={previousPage}
            disabled={currentPage === 0}>
            <Icon icon="charm:chevrons-left" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
        
        <button class="border shadow-md bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={previousPage}
            disabled={currentPage === 0}>
            <Icon icon="ic:round-chevron-left" class="p-1 sm:p-2 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
        
        <!-- Display page numbers -->
        {#each getPageNumbers(currentPage, totalPages) as page}
            <button on:click={() => goToPage(page)}
                class="{page === currentPage ? 'text-white bg-primary-500 border-primary-500' : 'border-gray-300 bg-white'} border shadow-md rounded-md px-2.5 sm:px-3.5 text-xs sm:text-sm font-medium">
                {page}
            </button>
        {/each}
    
        <!-- Next Buttons -->
        <button class="border shadow-md bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={nextPage}
            disabled={currentPage >= totalPages - 1}>
            <Icon icon="charm:chevron-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
        
        <button class="border shadow-md bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={() => goToPage(totalPages)}>
            <Icon icon="charm:chevrons-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded disabled:text-gray-300" />
        </button>
    </div>
    
    

</div>
