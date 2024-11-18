<script>
  import Maincontent from './Maincontent.svelte'
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import {
    allProducts,  currentPage, searchQuery, selectedCategories, selectedManufacturers, sortBy, sortOrder,  updateFilteredProducts,
    updatePage, categories, manufacturers
  } from '$lib/stores/filter.js';


  export let data;
  let products = data?.data || [];  

  function loadCategoriesAndManufacturers(products) {
    const categorySet = new Set();
    const manufacturerSet = new Set();
    products.forEach(product => {
      if (product.categoryName) {
        categorySet.add(product.categoryName);
      }
      if (product.manufacturerName) {
        manufacturerSet.add(product.manufacturerName);
      }
    });
    categories.set(Array.from(categorySet));
    manufacturers.set(Array.from(manufacturerSet));
  }

  let showFilters = false;
  let showSearchDropdown = false;
  let showCategoryDropdown = false;
  let showManufacturerDropdown = false;
  let showSortByDropdown = false;


  onMount(() => {
    allProducts.set(products);  
    updateFilteredProducts();  
    loadFiltersFromUrl();       
    loadCategoriesAndManufacturers(products); 
  });


  function loadFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search') || '';
    const categoriesFromUrl = urlParams.get('categories') ? new Set(urlParams.get('categories').split(',')) : new Set();
    const manufacturersFromUrl = urlParams.get('manufacturers') ? new Set(urlParams.get('manufacturers').split(',')) : new Set();
    const sortByField = urlParams.get('sortBy') || 'productName';
    const sortOrderField = urlParams.get('sortOrder') || 'asc';
    const page = parseInt(urlParams.get('page')) || 1;

    searchQuery.set(search);
    selectedCategories.set(categoriesFromUrl);
    selectedManufacturers.set(manufacturersFromUrl);
    sortBy.set(sortByField);
    sortOrder.set(sortOrderField);
    currentPage.set(page);

    updateFilteredProducts(); 
  }


  function updateUrl() {
    const search = $searchQuery;
    const categoriesParam = Array.from($selectedCategories).join(',');
    const manufacturersParam = Array.from($selectedManufacturers).join(',');
    const sortByField = $sortBy;
    const sortOrderField = $sortOrder;
    const page = $currentPage;

    const urlParams = new URLSearchParams();

    if (search) urlParams.set('search', search);
    if (categoriesParam) urlParams.set('categories', categoriesParam);
    if (manufacturersParam) urlParams.set('manufacturers', manufacturersParam);
    if (sortByField) urlParams.set('sortBy', sortByField);
    if (sortOrderField) urlParams.set('sortOrder', sortOrderField);
    if (page) urlParams.set('page', page);


    window.history.pushState({}, '', '?' + urlParams.toString());
  }


  function handleSearchChange(event) {
    searchQuery.set(event.target.value);  
    updateFilteredProducts();             
    updateUrl();                          
    updatePage(1);                        
  }


  function toggleCategory(category) {
    const updatedCategories = new Set($selectedCategories);
    if (updatedCategories.has(category)) {
      updatedCategories.delete(category);
    } else {
      updatedCategories.add(category);
    }
    selectedCategories.set(updatedCategories);
    updateFilteredProducts();
    updateUrl();                         
    updatePage(1); 
  }


  function toggleManufacturer(manufacturer) {
    const updatedManufacturers = new Set($selectedManufacturers);
    if (updatedManufacturers.has(manufacturer)) {
      updatedManufacturers.delete(manufacturer);
    } else {
      updatedManufacturers.add(manufacturer);
    }
    selectedManufacturers.set(updatedManufacturers);
    console.log($selectedManufacturers)
    updateFilteredProducts();
    updateUrl();                        
    updatePage(1); 
  }


  function changeSorting(sortByField) {
    
    if ($sortBy === sortByField) {
      sortOrder.set($sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    } else {
      sortBy.set(sortByField);
      sortOrder.set('asc'); 
    }
    updateFilteredProducts(); 
    updateUrl();             
  }
  function resetFilters() {

$selectedCategories.clear();
$selectedManufacturers.clear();
$searchQuery = '';
$sortBy = '';
}

const applyFilters = () => {
  showFilters = false;
};

 
</script>

<div class="lg:pl-16  lg:pr-12  flex flex-col lg:flex-row">

  <!-- Mobile View -->
  <div class="w-full lg:hidden   p-4 mb-4 md:mb-0">
    <div class="border   flex flex-col border-gray-300 rounded-lg md:p-4 w-full">
      <h1 class="text-lg mt-4 font-bold mb-2 text-gray-700 flex items-center justify-center" on:click={() => showFilters = !showFilters}>
        <Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
        <span>Filters</span>
      </h1>
      


      {#if showFilters}
      
        <div class=" ml-4 filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Search</h4>
            <button class="text-primary-500" on:click={() => showSearchDropdown = !showSearchDropdown}>
              <Icon icon={showSearchDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          {#if showSearchDropdown}
            <input
              type="text"
              placeholder="Search..."
            class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 mb-2 rounded p-2 items-center ml-4 w-10/12 text-sm border border-transparent transition duration-200"
              bind:value={$searchQuery}
              on:input={handleSearchChange}
            />
          {/if}
        </div>

    
        <div class=" ml-4 filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Categories</h4>
            <button class="text-primary-500" on:click={() => showCategoryDropdown = !showCategoryDropdown}>
              <Icon icon={showCategoryDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showCategoryDropdown ? "space-y-2" : "hidden"}>
            {#each $categories as category}
              <label class="flex items-center mb-3 ml-3 text-gray-600">
                <input
                  type="checkbox"
                   class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 

                  on:change={() => toggleCategory(category)}
                  checked={$selectedCategories.has(category)}
                />
                <span class="ml-2">{category}</span>
              </label>
            {/each}
          </div>
        </div>

      
        <div class=" ml-4 filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-3 ml-3 mt-2">Manufacturers</h4>
            <button class="text-primary-500" on:click={() => showManufacturerDropdown = !showManufacturerDropdown}>
              <Icon icon={showManufacturerDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showManufacturerDropdown ? "space-y-2" : "hidden"}>
            {#each $manufacturers as manufacturer}
              <label class="flex items-center mb-3 text-gray-600 ml-3 text-sm">
                <input
                  type="checkbox"
                  class="form-checkbox rounded text-primary-600 mr-2 mb-1 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                  on:change={() => toggleManufacturer(manufacturer)}
                  checked={$selectedManufacturers.has(manufacturer)}
                />
                <span class="ml-2">{manufacturer}</span>
              </label>
            {/each}
          </div>
        </div>

       
        <div class=" ml-4 filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Sort By</h4>
            <button class="text-primary-500" on:click={() => showSortByDropdown = !showSortByDropdown}>
              <Icon icon={showSortByDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showSortByDropdown ? "ml-3 space-y-2" : "hidden"}>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="sortByProductName"
                class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                on:change={() => changeSorting('productName')}
                checked={$sortBy === 'productName'}
              />
              <label for="sortByProductName" class="text-gray-600 text-sm">
                Product Name
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="sortByPrice"
                class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                on:change={() => changeSorting('price')}
                checked={$sortBy === 'price'}
              />
              <label for="sortByPrice" class="text-gray-600 text-sm">
                Price
              </label>
            </div>
          </div>
          
        </div>
        <div class="flex justify-between ml-4 mb-2">
          <button
            on:click={() => applyFilters()}
            class="text-white bg-primary-500 px-4 py-2 rounded-lg text-sm"
          >
            Apply Filters
          </button>
          <button
            on:click={() => { showFilters = false; resetFilters(); }}
            class="text-gray-500 bg-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Desktop View -->
  <div class="hidden lg:block lg:w-1/3 mb-4 md:mb-0">
    <div class="filter-widget border border-gray-300 rounded-lg shadow-md p-4 w-full">
      <h3 class="text-lg font-bold mb-3 text-gray-700 flex items-center">
        <Icon icon="fluent-mdl2:sort-lines" class="mr-2 text-primary-500" />
        Filters
      </h3>
      <hr class="border-gray-300 my-4" />
      <div class="filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Search</h4>
            <button class="text-primary-500" on:click={() => showSearchDropdown = !showSearchDropdown}>
              <Icon icon={showSearchDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          {#if showSearchDropdown}
          <input
            type="text"
            placeholder="Search..."
            class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 mb-2 rounded p-2 items-center ml-4 w-10/12 text-sm border border-transparent transition duration-200"
            bind:value={$searchQuery}
            on:input={handleSearchChange}
          />
        {/if}
        
        </div>

        <div class="filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Categories</h4>
            <button class="text-primary-500" on:click={() => showCategoryDropdown = !showCategoryDropdown}>
              <Icon icon={showCategoryDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showCategoryDropdown ? "space-y-2" : "hidden"}>
            {#each $categories as category}
              <label class="flex items-center mb-3 ml-3 text-gray-600">
                <input
                  type="checkbox"
                  class="form-checkbox rounded text-primary-600 mr-2 mb-1 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                  
                  on:change={() => toggleCategory(category)}
                  checked={$selectedCategories.has(category)}
                />
                <span class="ml-2">{category}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Manufacturers</h4>
            <button class="text-primary-500" on:click={() => showManufacturerDropdown = !showManufacturerDropdown}>
              <Icon icon={showManufacturerDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showManufacturerDropdown ? "space-y-2" : "hidden"}>
            {#each $manufacturers as manufacturer}
              <label class="flex items-center mb-3 text-gray-600 ml-3 text-sm">
                <input
                  type="checkbox"
                  class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                  on:change={() => toggleManufacturer(manufacturer)}
                  checked={$selectedManufacturers.has(manufacturer)}
                />
                <span class="ml-2">{manufacturer}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="filter-group border border-gray-300 rounded mb-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-gray-700 mb-1 ml-3 mt-2">Sort By</h4>
            <button class="text-primary-500" on:click={() => showSortByDropdown = !showSortByDropdown}>
              <Icon icon={showSortByDropdown ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'} class="text-3xl" />
            </button>
          </div>
          <div class={showSortByDropdown ? "ml-3 space-y-2" : "hidden"}>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="sortByProductName"
                class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                on:change={() => changeSorting('productName')}
                checked={$sortBy === 'productName'}
              />
              <label for="sortByProductName" class="text-gray-600 text-sm">
                Product Name
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                id="sortByPrice"
                class="form-checkbox rounded text-primary-600 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-600" 
                on:change={() => changeSorting('price')}
                checked={$sortBy === 'price'}
              />
              <label for="sortByPrice" class="text-gray-600 text-sm">
                Price
              </label>
            </div>
          </div>
        </div>
    </div>
  </div>

 
  <Maincontent {data} />
</div>

