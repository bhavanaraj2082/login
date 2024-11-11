<script context="module">
  import FavoriteList from '$lib/components/FavoriteWidget/FavoriteList.svelte';
  import favoriteData from '$lib/data/favorites.json';

  export const meta = {
    title: "notinuse/FavoriteList",
    component: FavoriteList,
    argsTypes: {
      favorites:{control: 'object'}
    } 
  };

</script>

<script>
   import '../../app.css';
   import { Story, Template } from '@storybook/addon-svelte-csf';

   let favorites = favoriteData.favorite || [];
</script>

<Template let:args>
    <FavoriteList favorites={args.favorites} />
  </Template>
  
  
  <Story name="FavoriteList1" args={{ favorites }} />