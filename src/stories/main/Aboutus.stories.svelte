<script context="module">
    import AboutSection from '$lib/components/AboutSection.svelte';
    
    export const meta = {
      title: "Aboutus",
      component: AboutSection,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <AboutSection />
  </Template>
  
  
  <Story name="AboutusSection" />
  