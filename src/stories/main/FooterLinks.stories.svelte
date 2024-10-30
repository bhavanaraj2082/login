<script context="module">
    import FooterLinks from '$lib/components/FooterLinks.svelte';
  
    export const meta = {
      title: "FooterLinks",
      component: FooterLinks
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <FooterLinks /> 
    </Template>
    
    
    <Story name="FooterLinks12" />