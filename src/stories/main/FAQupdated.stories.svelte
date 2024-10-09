<script context="module">
    import Faqupdated from '$lib/components/FAQupdated.svelte'
    
  
    export const meta = {
      title: "Faqupdated",
      component: Faqupdated
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Faqupdated />
  </Template>
  
  
  <Story name="Faq_section" />
  