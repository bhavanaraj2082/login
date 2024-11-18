<script context="module">
  import ServiceUnavilable from "$lib/components/ServiceUnavilable.svelte";
  export const meta ={
      title:"ServiceUnavilable-page",
      component: ServiceUnavilable
  }
</script>
<script>
      import "../../app.css";
      import {Story, Template} from '@storybook/addon-svelte-csf'
</script>
<Template let:args>
  <ServiceUnavilable></ServiceUnavilable>
</Template>
<Story name="ServiceUnavilables"/>