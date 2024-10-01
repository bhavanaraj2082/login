<script context="module">
    import Footerupdated from '$lib/components/Footerupdated.svelte';
  
    export const meta = {
      title: "Footerupdated",
      component: Footerupdated
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <Footerupdated /> 
    </Template>
    
    
    <Story name="Footerupdated1" />