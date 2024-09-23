<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import cartIcon from '@iconify-icons/mdi/cart';
  import trashIcon from '@iconify-icons/mdi/trash';
  import removeCircleIcon from '@iconify-icons/mdi/delete-circle-outline';

   export let favorites= [];
   console.log(favorites)

  onMount(async () => {
  try {
    const res = await fetch('/data/favorites.json');
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);   
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const text = await res.text();
    console.log('Response text:', text); 
    const data = JSON.parse(text);
    console.log('Parsed data:', data);
    if (data && data.favorite) {
      favorites = data.favorite;
      console.log('Favorites set:', favorites);
    } else {
      console.error('Data structure is not as expected:', data);
    }
  } catch (error) {
    console.error("Failed to fetch favorites data:", error);
  }
});
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
      <li class="h-56 flex flex-col md:flex-row justify-evenly items-center p-2 bg-white shadow-md rounded animate-fadeIn">
        <div class="flex items-center space-x-6 mb-4 overflow-auto md:mb-0">
          <div class="p-2 justify-end">
            <img src={favorite.item_image} alt={favorite.item_name} class="w-26 h-auto object-cover" />
          </div>
          <div>
            <h2 class="font-bold text-sm">{favorite.item_name}</h2>
            <p class="text-sm text-gray-600">Product Code: {favorite.product_code}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-3">CAS Number: <span class="font-semibold">{favorite.cas_number}</span></p>
          </div>
        </div>

        <div class="flex items-center space-x-4 w-full md:w-auto justify-evenly">
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
          <div class="flex flex-col items-center">
            <div class='flex-wrap mb-2'>
              <span class="font-bold text-xs">{favorite.amount} mg</span>
              <span class="font-bold text-xl text-gray-800"> ₹{favorite.price.toFixed(2)}</span>
            </div>  
            <button class="flex bg-blue-500 text-white px-2 py-2 rounded-2xl hover:bg-blue-600">
              <Icon icon={cartIcon} width="20" height="20" />
              <span class="hidden sm:inline ml-2 ">Add to cart</span>
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
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
</style>