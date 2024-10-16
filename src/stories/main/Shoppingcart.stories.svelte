<script context="module">
    import ShoppingCart from '$lib/components/Cart/ShoppingCart.svelte';
  
    export const meta = {
      title: "ShoppingCart",
      component: ShoppingCart
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <ShoppingCart> </ShoppingCart>
    </Template>
    
    
    <Story name="ShoppingCart1" />