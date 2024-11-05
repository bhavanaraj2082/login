<script context="module">
    import ProductFilter from '$lib/components/ProductFilter.svelte';
   
  
    export const meta = {
      title: "ProductFilter",
      component: ProductFilter,
    
  
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  <ProductFilter/>
    
    
    <Story name="ProductFilter1" />