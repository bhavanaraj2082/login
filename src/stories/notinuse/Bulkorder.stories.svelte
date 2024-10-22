<script context="module">
    import Bulkorder from '../../lib/components/Homepagecomponents/Bulkorder.svelte';
  
    export const meta = {
      title: "notinuse/Homepagecomponents",
      component: Bulkorder,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Bulkorder/>
  </Template>
  
  
  <Story name="Bulkorderhome" />