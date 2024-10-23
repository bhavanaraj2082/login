<script context="module">
    import CartForm from '$lib/components/ChemiKartWidget/cart.svelte';
  
    export const meta = {
      title: "notinuse/CartForm",
      component: CartForm
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <CartForm> </CartForm>
    </Template>
    
    
    <Story name="CartForm1" />