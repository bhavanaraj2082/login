<script context="module">
    import About from '$lib/components/About.svelte';
    
    export const meta = {
      title: "About",
      component: About,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <About />
  </Template>
  
  
  <Story name="AboutPage" />
  