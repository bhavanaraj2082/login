<script context="module">
    import CartSlider from '$lib/components/ChemiKartSlider/Slider.svelte';
    import carts from '$lib/data/images.json';
  
    export const meta = {
      title: "CartSlider",
      component: CartSlider,
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
      <CartSlider> </CartSlider>
    </Template>
    
    
    <Story name="CartSlider1" />