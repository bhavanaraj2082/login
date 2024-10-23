<script context="module">
    import CartWidget from '$lib/components/ChemiKartWidget/CartWidget.svelte';
  
    export const meta = {
      title: "notinuse/CartWidget",
      component: CartWidget
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <CartWidget> </CartWidget>
    </Template>
    
    
    <Story name="CartWidget1" />