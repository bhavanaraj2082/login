<script context="module">
    import QuickOrder from '$lib/components/quickorder/QuickOrder.svelte';
  
    export const meta = {
      title: "QuickOrder",
      component: QuickOrder
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <QuickOrder >
    </QuickOrder>
  </Template>
  
  
  <Story name="QuickOrder12" />