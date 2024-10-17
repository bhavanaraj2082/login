<script context="module">
    import Contactupdated from '$lib/components/Contactupdated.svelte';
  
    export const meta = {
      title: "Contactupdated",
      component: Contactupdated
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template >
      <Contactupdated /> 
    </Template>
    
    
    <Story name="Contactupdated12" />