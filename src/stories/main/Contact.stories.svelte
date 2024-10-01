<script context="module">
    import Contactus from '$lib/components/Contactus/Contactus.svelte';
  
    export const meta = {
      title: "Contactus_page",
      component: Contactus
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Contactus>
    </Contactus>
  </Template>
  
  
  <Story name="LoginPage1" />