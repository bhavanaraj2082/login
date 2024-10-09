<script context="module">
    import Aboutus from '$lib/components/Aboutus.svelte';
    
    export const meta = {
      title: "Aboutus",
      component: Aboutus,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Aboutus />
  </Template>
  
  
  <Story name="Aboutus1" />
  