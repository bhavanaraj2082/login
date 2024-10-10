<script context="module">
    import Doc from '$lib/components/Document/Doc.svelte';
    
  
    export const meta = {
      title: "Document",
      component: Doc,
      
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Doc/>
  </Template>
  
  <Story name="Doc1" />
  