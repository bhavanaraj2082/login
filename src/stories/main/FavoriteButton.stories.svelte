<script context="module">
    import Fav from '$lib/components/FavoriteWidget/Fav.svelte';
    
    export const meta = {
      title: "notinuse/Fav",
      component: Fav,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Fav />
  </Template>
  
  
  <Story name="Fav1" />
  