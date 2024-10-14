<script context="module">
    import RelatedProducts from '../../lib/components/RelatedProducts.svelte';
  
    export const meta = {
      title: "RelatedProducts",
      component: RelatedProducts,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <RelatedProducts/>
  </Template>
  
  
  <Story name="RelatedProducts1" />