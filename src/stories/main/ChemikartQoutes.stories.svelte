<script context="module">
    import Qoutescomponents from '$lib/components/ChemikartQoutes/Qoutescomponents.svelte';
  
    export const meta = {
      title: "Qoutescomponents",
      component: Qoutescomponents,
   
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  
  <Template let:args>
    <Qoutescomponents>
    </Qoutescomponents>
  </Template>
  
  
  <Story name="Qoutescomponents1" />
  