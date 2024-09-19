<script context="module">
    import ContactUs from '$lib/components/ContactUs.svelte';
  
    export const meta = {
      title: "ContactUs_form",
      component: ContactUs
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <ContactUs /> 
    </Template>
    
    
    <Story name="Contact_us" />