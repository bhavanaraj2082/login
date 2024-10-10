<script context="module">
    import Herosection from '$lib/components/Herosection.svelte';
    
  
    export const meta = {
      title: "Herosection",
      component: Herosection
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Herosection >
    </Herosection>
  </Template>
  
  
  <Story name="HeroSection1" />