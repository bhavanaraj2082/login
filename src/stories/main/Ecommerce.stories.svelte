<script context="module">
    import Ecom from '$lib/components/Ecommerce.svelte';
    
    export const meta = {
      title: "Ecom",
      component: Ecom,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Ecom />
  </Template>
  
  
  <Story name="Ecom1" />
  