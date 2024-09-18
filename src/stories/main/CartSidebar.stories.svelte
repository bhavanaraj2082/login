<script context="module">
    import CartSidebar from '$lib/components/ChemiKartWidget/CartSidebar.svelte';
    import carts from '$lib/data/cart.json';
  
    export const meta = {
      title: "CartSidebar",
      component: CartSidebar,
      args: {
        data: carts,
      },
  
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <CartSidebar> </CartSidebar>
    </Template>
    
    
    <Story name="CartSidebar1" />