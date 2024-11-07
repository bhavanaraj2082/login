<script>
    import FavoriteButton from '$lib/components/FavoriteWidget/FavoriteButton.svelte';
    let items = [
      { id: 1, name: "Item 1", isFavorite: false },
      { id: 2, name: "Item 2", isFavorite: false },
      { id: 3, name: "Item 3", isFavorite: false }
    ];
    function handleToggleFavorite(event) {
      const { itemId } = event.detail;
      items = items.map(item => {
        if (item.id === itemId) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      });
    }
  </script>
  <div class="items-list">
    {#each items as item}
      <div class="item-card">
        <h2>{item.name}</h2>
        <FavoriteButton 
          isFavorite={item.isFavorite} 
          itemId={item.id}
          on:toggle-favorite={handleToggleFavorite}
        />
      </div>
    {/each}
  </div>
  
  <style>
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
    .item-card {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
      background-color: #fff;
      width: 300px;
    }
  </style>
  