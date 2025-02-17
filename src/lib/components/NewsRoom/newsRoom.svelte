<script>
    export let data;
    
    let items = [...data.newsrooms];
    
    let currentPage = 0;
    let itemsPerPage = 16;

    let filteredItems = items;

    // Pagination Logic
    $: paginatedItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
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
</script>

<div class="p-4 w-10/12 mx-auto">
    <h1 class="font-bold text-2xl mb-4">News Room</h1>
    
    <!-- News Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each paginatedItems as item}
        <a href={`newsroom/${item.newsLink}`} class="bg-white shadow rounded p-4 block hover:scale-105 transform transition-all duration-300">
            <div>
                <img src={`/path/to/images/${item.image}`} alt={item.title} class="w-full h-40 object-cover rounded-md mb-4"/>
                <h2 class="font-semibold text-lg mb-2">{item.title}</h2>
                <p class="text-sm text-gray-600">{truncateText(item.previewText, 50)}</p>
            </div>
        </a>
        {/each}
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-6">
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
    </div>
</div>
