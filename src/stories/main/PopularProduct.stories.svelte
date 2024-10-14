<script context="module">
    import PopularProduct from '../../lib/components/PopularProduct.svelte';
    
    export const meta = {
      title: "PopularProduct",
      component: PopularProduct,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <PopularProduct />
  </Template>
  
  
  <Story name="PopularProduct1" />
  