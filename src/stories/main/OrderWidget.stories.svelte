<script context="module">
  import OrderWidget from '$lib/components/Widget/OrderWidget.svelte';

  export const meta = {
    title: "Widget",
    component:OrderWidget
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  
</script>

<Template let:args>
  <OrderWidget>
  </OrderWidget>
</Template>


<Story name="OrderWidget1" />
