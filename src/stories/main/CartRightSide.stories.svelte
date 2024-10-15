<script context="module">
    import CartRightSide from '$lib/components/ChemikartRightCart/cart.svelte';
  
    export const meta = {
      title: "CartRightSide",
      component: CartRightSide
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <CartRightSide> </CartRightSide>
    </Template>
    
    
    <Story name="CartRightSide1" />