<script>
    import { onMount } from 'svelte';
    import FavoritesList from '$lib/components/FavoritesList.svelte';
    
    let favorites = [];
    // let user_id = '123'; //we hav to  replace with actual user ID from authentication
  
    onMount(async () => {
    //   const res = await fetch(`/api/favorites?user_id=${user_id}`);
      const res = await fetch('/static/data/favorites.json');
      favorites = await res.json();
    });
  
    function handleRemoveFavorite(event) {
    const { itemId } = event.detail;
    favorites = favorites.filter(fav => fav.item_id !== itemId);
  }
    // async function handleRemoveFavorite(event) {
    //   const { itemId } = event.detail;
    //   const response = await fetch(`/api/favorites?user_id=${user_id}&item_id=${itemId}`, {
    //     method: 'DELETE'
    //   });
  
    //   if (response.ok) {
    //     favorites = favorites.filter(fav => fav.item_id !== itemId);
    //   }
    // }
  </script>
  
  <FavoritesList {favorites} on:remove-favorite={handleRemoveFavorite} />
  