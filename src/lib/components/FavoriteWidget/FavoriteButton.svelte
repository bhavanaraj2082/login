<script>
  export let isFavorite = false;
  export let itemId;

  import { createEventDispatcher } from 'svelte';
  import  Icon  from '@iconify/svelte'; 
  import heartOutline from '@iconify-icons/mdi/heart-outline'; 
  import heartFilled from '@iconify-icons/mdi/heart'; 

  const dispatch = createEventDispatcher();
  function toggleFavorite() {
    dispatch('toggle-favorite', { itemId });
  }
</script>
<button 
  on:click={toggleFavorite} 
  class="py-2 px-2 rounded-3xl transition-all duration-500 ease-in-out relative overflow-hidden {isFavorite ? 'bg-white' : 'bg-gray-300'}"
>
  <Icon 
    icon={isFavorite ? heartFilled : heartOutline} 
    width="24" 
    height="24" 
    class="transition-colors duration-500 ease-in-out {isFavorite ? 'text-red-500' : 'text-white'}"
  />
</button>

<style>
  @keyframes fadeIn {
    0% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
