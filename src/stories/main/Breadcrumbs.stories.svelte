<script context="module">
    import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  
    export const meta = {
      title: "Breadcrumbs_bar",
      component: Breadcrumbs
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <Breadcrumbs /> 
    </Template>
    
    
    <Story name="Breadcrumbs_" />