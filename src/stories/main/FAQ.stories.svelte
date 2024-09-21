<script context="module">
    import FAQ from '$lib/components/FAQ.svelte';
    import faqData from '$lib/data/faq.json';
  
    export const meta = {
      title: "FAQ",
      component: FAQ,
      args: {
        faqs: faqData,
      },
    };
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <FAQ {...args} />
  </Template>
  
  <Story name="FAQ1" />
  