<script context="module">
    import Favourite from '$lib/components/FavPage/Favourite.svelte';
    
  
    export const meta = {
      title: "MyFavourite Page",
      component: Favourite,
      
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Favourite/>
  </Template>
  
  <Story name="MyFav Page1" />
  