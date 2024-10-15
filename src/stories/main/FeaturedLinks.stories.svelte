<script context="module">
    import FeaturedLinks from '../../lib/components/FeaturedLinks.svelte';
    
    export const meta = {
      title: "FeaturedLinks",
      component: FeaturedLinks,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <FeaturedLinks />
  </Template>
  
  
  <Story name="FeaturedLinks1" />
  