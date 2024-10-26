<script context="module">
    import SearchBar from '$lib/components/SearchComponent/SearchBar.svelte';
    
  
    export const meta = {
      title: "Search Bar",
      component: SearchBar,
      
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <SearchBar/>
  </Template>
  
  <Story name="SearchBar1" />
  