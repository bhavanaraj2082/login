<script>
  import Icon from '@iconify/svelte';
  import cartIcon from '@iconify-icons/mdi/cart';
  import trashIcon from '@iconify-icons/mdi/trash';
  import removeCircleIcon from '@iconify-icons/mdi/delete-circle-outline';
  // import favorite from '$lib/data/favorites.json'

   export let favorites = [];
   
   $: console.log('Favorites in component:', favorites);

  function removeFavorite(itemId) {
    favorites = favorites.filter(fav => fav.item_id !== itemId);
  }
  function clearAllFavorites() {
    favorites = [];
  }
  function incrementQuantity(itemId) {
    favorites = favorites.map(favorite => {
      if (favorite.item_id === itemId) {
        return { ...favorite, quantity: favorite.quantity + 1 };
      }
      return favorite;
    });
  }
  function decrementQuantity(itemId) {
    favorites = favorites.map(favorite => {
      if (favorite.item_id === itemId && favorite.quantity > 1) {
        return { ...favorite, quantity: favorite.quantity - 1 };
      }
      return favorite;
    });
  }
  function updateQuantity(itemId, newQuantity) {
    favorites = favorites.map(favorite => {
      if (favorite.item_id === itemId) {
        const validQuantity = newQuantity > 0 ? newQuantity : 1;
        return { ...favorite, quantity: validQuantity };
      }
      return favorite;
    });
  }
  function handleInput(e, itemId) {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    updateQuantity(itemId, parseInt(inputValue) || 1);
  }
</script>

<section class="m-6 bg-gray-100 p-8 md:m-24 md:p-6">
  <h1 class="text-2xl md:text-3xl font-bold mb-6">My Favourites</h1>
  <!-- Action Buttons -->
  <div class="flex flex-wrap space-x-2 md:space-x-4 mb-4 md:mb-6">
    <button class="bg-gray-200 px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-gray-300">
      <Icon icon={cartIcon} width="20" height="20" />
      <span>Add list to cart</span>
    </button>
    <button
      class="bg-gray-200 px-3 py-2 flex items-center space-x-2 rounded-md hover:bg-gray-300"
      on:click={clearAllFavorites}
    >
      <Icon icon={trashIcon} width="20" height="20" />
      <span>Clear all</span>
    </button>
  </div>
  <!-- Favourites List -->
  <ul class="space-y-4">
    {#each favorites as favorite (favorite.item_id)}
      <li class="h-auto flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-md rounded animate-fadeIn">  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <!-- Image Section with Zoom Effect on Hover -->
          <div class="flex justify-center p-2">
            <img 
              src={favorite.item_image} 
              alt={favorite.item_name} 
              class="w-28 h-auto object-cover rounded transition-transform duration-300 ease-in-out transform hover:scale-110" 
            />
          </div>      
          <!-- Product Details Section -->
          <div class="flex flex-col justify-center text-center md:text-left">
            <h2 class="font-bold text-sm">{favorite.item_name}</h2>
            <p class="text-sm text-gray-600">Product Code: {favorite.product_code}</p>
          </div> 
          <!-- CAS Number Section with Improved Responsiveness -->
          <div class="flex flex-col justify-center text-center md:text-right md:self-end md:mr-12">
            <p class="text-sm text-gray-600 mb-4">
              CAS Number: <span class="font-semibold">{favorite.cas_number}</span>
            </p>
          </div>
        </div>
        <!-- Quantity and Actions Section -->
        <div class="flex mr-4 items-center space-x-4 w-full md:w-auto justify-evenly mt-4 md:mt-0">
          <!-- Quantity Controls -->
          <div class="flex items-center">
            <button 
              class="bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300" 
              on:click={() => decrementQuantity(favorite.item_id)}>
              -
            </button>
            <input
              type="text"
              class="border border-gray-300 rounded-md px-2 py-1 w-16 text-center"
              bind:value={favorite.quantity}
              on:input={(e) => handleInput(e, favorite.item_id)} 
              min="1"
              on:blur={(e) => updateQuantity(favorite.item_id, +e.target.value || 1)}
            />
            <button 
              class="bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300" 
              on:click={() => incrementQuantity(favorite.item_id)}>
              +
            </button>
          </div>        
          <!-- Price & Cart Button -->
          <div class="flex flex-col items-center m-2">
            <div class='flex-wrap mb-2'>
              <span class="font-bold text-xs">{favorite.amount} mg</span>
              <span class="font-bold text-xl text-gray-800"> ₹{favorite.price.toFixed(2)}</span>
            </div>  
            <button class="flex bg-blue-500 text-white px-2 py-2 rounded-2xl hover:bg-blue-600">
              <Icon icon={cartIcon} width="20" height="20" />
              <span class="hidden sm:inline text-wrap text-xs ml-2">Add to cart</span>
            </button>
            <button
              on:click={() => removeFavorite(favorite.item_id)}
              class="text-blue-500 mt-2 hover:underline flex items-center space-x-2"
            >
              <Icon icon={removeCircleIcon} width="20" height="20" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</section>
<style>
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
</style>