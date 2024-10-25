<script>
    import { onMount } from 'svelte';
    import { searchResult, loadComponents } from '../../stores/searchStore.js';

    let searchTerm = '';
    let suggestions = [];
    let showSuggestions = false;
    let selectedIndex = -1;
    let addedItems = [];

  
    $: suggestions = $searchResult.filter(
      (component) => component.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    
    $: showSuggestions = searchTerm.length >= 1 && suggestions.length > 0;

    onMount(() => {
      loadComponents();
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

<div class="mx-auto flex items-center justify-between max-md:py-0 py-4 px-4">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <div class="relative w-full max-w-lg mx-8 max-md:hidden">
      
      <input
        type="text"
        placeholder="Search your Product"
        bind:value={searchTerm}
        on:input={handleInput}
        on:keydown={handleKeydown}
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
  
      
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
  
      
      <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-400 text-white p-1 px-3 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.6 21L13.3 14.7q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14z"/>
        </svg>
      </button>
    </div>
  </div>
  