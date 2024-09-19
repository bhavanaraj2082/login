<script context="module">
    import Upcomimgevent from '../../lib/components/Homepagecomponents/upcomimgevent.svelte';
  
    export const meta = {
      title: "Homepagecomponents",
      component: Upcomimgevent,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Upcomimgevent/>
  </Template>
  
  
  <Story name="Upcomimgeventhome" />