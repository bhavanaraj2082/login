<script context="module">
    import Catolog from '../../lib/components/Homepagecomponents/catolog.svelte';
  
    export const meta = {
      title: "Homepagecomponents",
      component: Catolog,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Catolog/>
  </Template>
  
  
  <Story name="Catologhome" />