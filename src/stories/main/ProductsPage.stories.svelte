<script context="module">
  import ProductsPage from '$lib/components/Products/ProductsPage.svelte';
  

  export const meta = {
    title: "Products Page",
    component: ProductsPage,
    
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import '../../app.css';
</script>

<Template let:args>
  <ProductsPage/>
</Template>

<Story name="ProductsPage1" />
