<script context="module">
    import CustomerAlsoViewed from '$lib/components/CustomerAlsoViewed.svelte';
    import ViewedProducts from '$lib/data/AlsoViewedProducts.json';
  
    export const meta = {
      title: "CustomerAlsoViewed",
      component: CustomerAlsoViewed,
      args: {
        fetchedProducts: ViewedProducts,
      },
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <CustomerAlsoViewed {...args} />
  </Template>
  
  <Story name="CustomerAlsoViewed1" />
  