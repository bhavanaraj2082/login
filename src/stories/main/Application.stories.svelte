<script context="module">
    import Application from '$lib/components/Application/Application.svelte';
    import data from "$lib/data/applications.json"
    
    export const meta = {
      title: "Application",
      component: Application,
      args:{
        data:{categoryData:data},
      }
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Application {...args}/>
  </Template>
  
  
  <Story name="Application_page" />
  