<script context="module">
    import Orderstatus from '$lib/components/OrderStatus/Orderstatus.svelte';
    
  
    export const meta = {
      title: "Order Status",
      component: Orderstatus,
      
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Orderstatus/>
  </Template>
  
  <Story name="OrderStatus1" />
  