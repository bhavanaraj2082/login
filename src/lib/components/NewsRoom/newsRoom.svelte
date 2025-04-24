<script>
    import Icon from "@iconify/svelte";
    export let data;

    let items = [...data.newsrooms];
    let currentPage = 0;
    let itemsPerPage = 16;
    let filteredItems = items;
    
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

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const goToPage = async (page) => {
        if (page >= 0 && page < totalPages) {
            currentPage = page;
        }
    };

    const getPageNumbers = () => {
        let pageNumbers = [];
        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
</script>

<div class="w-full lg:w-11/12  mx-auto max-w-7xl ">
    <h1 class="font-bold text-2xl mb-6 mx-2">News Room</h1>
    <div class="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {#each paginatedItems as item}
        <a href={`newsroom/${item.newsLink}`} class=" hover:scale-105 transform transition-all duration-300 rounded-md p-4 shadow">
            <div>
                <img src={item.image} alt="img" class="w-full h-40 object-cover mx-auto rounded-md" />
                <div class="flex flex-col justify-between space-y-1 sm:space-y-3 md:space-y-5">
                    <h2 class="font-semibold sm:text-md text-sm mt-2 h-10">{item.title}</h2>
                    <p class="sm:text-sm text-xs  text-gray-600 h-14 overflow-hidden text-ellipsis">{truncateText(item.previewText, 90)}</p>
                    <hr class="border-t-2 border-gray-300">
                    <h2 class="font-medium text-heading flex h-10 sm:text-sm text-xs">DATE :
                    <p class="sm:text-md sm:text-sm text-xs text-gray-600 h-14 overflow-hidden text-ellipsis ml-1"> {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p></h2>
                </div>
            </div>
        </a>
        {/each}
    </div>
    {#if totalPages > 1}
    <div class="w-fit gap-1 sm:gap-1.5 mx-auto flex mt-10 mb-5">
        <button class="border shadow bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={() => { goToPage(0); setTimeout(scrollToTop, 100); }}
            disabled={currentPage === 0}>
            <Icon icon="charm:chevrons-left" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded" />
        </button>
        <button class="border shadow bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-400 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={() => { previousPage(); setTimeout(scrollToTop, 100); }}
            disabled={currentPage === 0}>
            <Icon icon="ic:round-chevron-left" class="p-1 sm:p-2 text-2xl sm:text-4xl rounded" />
        </button>
    
        {#each getPageNumbers() as page}
            <button on:click={() => { goToPage(page); setTimeout(scrollToTop, 100); }}
                class={`border shadow rounded-md px-3 py-1 text-sm font-medium 
                ${page === currentPage ? 'text-white bg-primary-500 border-primary-500' : 'border-gray-300 bg-white hover:bg-gray-100'}`}>
                {page + 1}
            </button>
        {/each}
    
        <button class="border shadow bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={() => { nextPage(); setTimeout(scrollToTop, 100); }}
            disabled={currentPage >= totalPages - 1}>
            <Icon icon="charm:chevron-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded" />
        </button>
    
        <button class="border shadow bg-white border-gray-300 rounded-md text-gray-400 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200"
            on:click={() => { goToPage(totalPages - 1); setTimeout(scrollToTop, 100); }}
            disabled={currentPage >= totalPages - 1}>
            <Icon icon="charm:chevrons-right" class="p-1 sm:p-2.5 text-2xl sm:text-4xl rounded" />
        </button>
    </div>
    {/if}
</div>