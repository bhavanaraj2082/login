<script context="module">
    import Product from '$lib/components/Products/Product.svelte';
    
  
    export const meta = {
      title: "Products",
      component: Product,
      
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Product/>
  </Template>
  
  <Story name="Product1" />
  