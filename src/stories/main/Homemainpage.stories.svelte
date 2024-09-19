<script context="module">
    import Homemainpage from '../../lib/components/Homemainpage.svelte';
  
    export const meta = {
      title: "Homepagecomponents",
      component: Homemainpage,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Homemainpage/>
  </Template>
  
  
  <Story name="Homepage" />