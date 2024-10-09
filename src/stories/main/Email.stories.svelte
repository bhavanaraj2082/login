<script context="module">
    import Email from '$lib/components/Email.svelte';
    
    export const meta = {
      title: "Email",
      component: Email,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Email />
  </Template>
  
  
  <Story name="Email1" />
  