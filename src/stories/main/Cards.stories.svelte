<script context="module">
    import Cards from '../../lib/components/Homepagecomponents/Cards.svelte';
  
    export const meta = {
      title: "Homepagecomponents",
      component: Cards,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Cards/>
  </Template>
  
  
  <Story name="Cardshome" />