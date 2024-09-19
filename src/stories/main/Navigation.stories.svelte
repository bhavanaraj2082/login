<script context="module">
    import Navigation from '$lib/components/Navigation.svelte';
  
    export const meta = {
      title: "Navigation",
      component: Navigation
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
      <Navigation> </Navigation>
    </Template>
    
    
    <Story name="Navigation1" />