<script context="module">
    import RelatedProductss from '$lib/components/RelatedProductss.svelte';
  
    export const meta = {
      title: "RelatedProductss",
      component: RelatedProductss,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <RelatedProductss/>
  </Template>
  
  
  <Story name="RelatedProductss1"/>