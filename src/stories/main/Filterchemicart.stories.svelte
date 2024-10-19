<script context="module">
    import Filterchemicart from '$lib/components/Filterchemicart.svelte';
    import Chemicaldata from '$lib/data/Chemicaldata.json';
  
    export const meta = {
      title: "Filter widget",
      component: Filterchemicart,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Filterchemicart/>
  </Template>
  
  
  <Story name="Filtermain" />