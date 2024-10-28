<script>
  import { onMount } from 'svelte';
  import { searchResult, loadComponents } from '../../../stores/searchStore';
  import chemicalProducts from '../../data/chemicalProducts.json';

  let searchTerm = '';
  let suggestions = [];
  let showSuggestions = false;
  let selectedIndex = -1;
  let addedItems = [];

  let accountMenuVisible = false;
  let navVisible = false;
  let products = chemicalProducts.chemicalProducts;

  function toggleNavMenu() {
      navVisible = !navVisible;
  }

  function closeNavMenu() {
      navVisible = false;
  }

  function handleClickOutside(event) {
      if (!event.target.closest('.nav-button') && !event.target.closest('.sidebar')) {
          navVisible = false;
      }
  }

  $: suggestions = $searchResult.filter(
      (component) => component.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  $: showSuggestions = searchTerm.length >= 1 && suggestions.length > 0;

  onMount(() => {
      loadComponents();
      window.addEventListener('click', handleClickOutside);
      return () => {
          window.removeEventListener('click', handleClickOutside);
      };
  });

  const handleInput = (e) => {
      searchTerm = e.target.value;
  };

  const handleKeydown = (event) => {
      if (event.key === 'ArrowDown') {
          event.preventDefault();
          selectedIndex = (selectedIndex + 1) % suggestions.length;
      } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
      } else if (event.key === 'Enter' && selectedIndex !== -1) {
          addComponentToList(suggestions[selectedIndex]);
          searchTerm = suggestions[selectedIndex].name;
          showSuggestions = false;
      } else if (event.key === 'Escape') {
          showSuggestions = false;
      }
  };

  const addComponentToList = (component) => {
      if (!addedItems.some(item => item.name === component.name)) {
          addedItems = [...addedItems, component];
      }
  };

  const selectSuggestion = (suggestion) => {
      addComponentToList(suggestion);
      searchTerm = suggestion.name;
      showSuggestions = false;
  };
</script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<header class="bg-white border-b">
  <div class="container mx-auto flex items-center justify-between py-4 px-4">
      <div class="text-3xl font-bold text-orange-500">Chemikart</div>

      <button class="md:hidden text-gray-500 nav-button" on:click={toggleNavMenu}>
          <i class="fa-solid fa-bars fa-2x"></i>
      </button>

      <div class="relative w-full max-w-lg mx-8 hidden md:block">
          <input
              type="text"
              placeholder="Search your Product"
              bind:value={searchTerm}
              on:input={handleInput}
              on:keydown={handleKeydown}
              class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
              <i class="fa-solid fa-magnifying-glass"></i>
          </button>

          {#if showSuggestions}
              <ul class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 flex flex-col">
                  {#each suggestions as suggestion, index}
                      <li class="flex justify-between items-center py-2 border-b border-gray-300">
                          <button
                              class="flex-1 text-left p-2 hover:bg-gray-200 focus:bg-gray-300 rounded-md {index === selectedIndex ? 'bg-gray-200' : ''}"
                              on:click={() => selectSuggestion(suggestion)}
                              type="button"
                          >
                              {suggestion.name}
                          </button>
                      </li>
                  {/each}
              </ul>
          {/if}
      </div>

      <div class="hidden md:flex items-center space-x-6 text-orange-500">
          <a href="/login" class="hover:text-orange-500">Login</a>
          <span>|</span>
          <a href="/register" class="hover:text-orange-500">Register</a>
      </div>
  </div>

  <div class="hidden md:flex container mx-auto justify-between py-2">
      <nav class="flex space-x-8 text-gray-600">
          <div class="relative group">
              <a href="#" class="hover:text-orange-500 flex items-center">
                  Products <i class="fa-solid fa-chevron-down ml-1 text-xs"></i>
              </a>
              <div class="absolute hidden group-hover:block bg-white text-gray-800 shadow-sm border-gray-200 border w-64">
                  <ul class="p-4">
                      {#each products as product}
                          <li><a href="/products/{product.id}" class="block px-2 py-2 hover:bg-gray-200">{product.name}</a></li>
                      {/each}
                  </ul>
              </div>
          </div>
          <div class="relative group">
              <a href="#" class="hover:text-orange-500 flex items-center">
                  Application <i class="fa-solid fa-chevron-down ml-1 text-xs"></i>
              </a>
              <div class="absolute hidden group-hover:block bg-white text-gray-800 shadow-sm border-gray-200 border w-64">
                  <ul class="p-4">
                      {#each products as product}
                          <li><a href="/products/{product.id}" class="block px-2 py-2 hover:bg-gray-200">{product.name}</a></li>
                      {/each}
                  </ul>
              </div>
          </div>
          <div class="relative group">
              <a href="/services" class="hover:text-orange-500 flex items-center">Services</a>
          </div>
          <div class="relative group">
              <a href="/documents" class="hover:text-orange-500 flex items-center">Documents</a>
          </div>
          <div class="relative group">
              <a href="#" class="hover:text-orange-500 flex items-center">
                  Support <i class="fa-solid fa-chevron-down ml-1 text-xs"></i>
              </a>
              <div class="absolute hidden group-hover:block bg-white text-gray-800 shadow-sm border-gray-200 border w-64">
                  <ul class="p-4">
                      <li><a href="#" class="block px-2 py-2 hover:bg-gray-200">FAQ</a></li>
                      <li><a href="#" class="block px-2 py-2 hover:bg-gray-200">Contact Us</a></li>
                  </ul>
              </div>
          </div>
      </nav>

      <div class="flex space-x-4 text-gray-600">
          <a href="#" class="hover:text-orange-500">Bulk Order</a>
          <a href="#" class="hover:text-orange-500">Order Status</a>
          <a href="#" class="hover:text-orange-500">
              <i class="fa-solid fa-cart-shopping"></i>
          </a>
      </div>
  </div>

  {#if navVisible}
      <div class="md:hidden sidebar fixed inset-y-0 left-0 bg-white w-full shadow-lg transition-transform duration-300 z-50 translate-x-0">
          <div class="flex justify-between border-b border-gray-300 p-4">
              <div class="text-xl font-bold text-orange-500">Chemikart</div>
              <button on:click={closeNavMenu} class="p-4">
                  <i class="fa-regular fa-circle-xmark fa-xl text-gray-600"></i>
              </button>
          </div>
          <nav class="flex flex-col p-4 space-y-2 text-gray-600">
              <a href="#" class="p-2 hover:bg-gray-200">Products</a>
              <a href="#" class="p-2 hover:bg-gray-200">Application</a>
              <a href="#" class="p-2 hover:bg-gray-200">Services</a>
              <a href="#" class="p-2 hover:bg-gray-200">Documents</a>
              <a href="#" class="p-2 hover:bg-gray-200">Support</a>
          </nav>
          <div class="flex flex-col p-4 space-y-2">
              <a href="#" class="p-2 hover:bg-gray-200">Login</a>
              <a href="#" class="p-2 hover:bg-gray-200">Register</a>
              <a href="#" class="p-2 hover:bg-gray-200">Bulk Order</a>
          </div>
      </div>
  {/if}
</header>

<slot />
