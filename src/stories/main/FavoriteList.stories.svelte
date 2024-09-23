<script context="module">
  import FavoriteList from '$lib/components/FavoriteWidget/FavoriteList.svelte';
  import favoriteData from '../../lib/data/favorites.json';

  export const meta = {
    title: "FavoriteList",
    component: FavoriteList,
    args: {
      favorites:favoriteData.favorite,
    },

  }
</script>

<script>
   import '../../app.css';
   import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
    <FavoriteList {...args} />
  </Template>
  
  
  <Story name="FavoriteList1" />