<script context="module">
  import Helpsupport from '../../lib/components/Help-Support/Help-support.svelte';

  export const meta = {
    title: "Help & Support",
    component: Helpsupport,
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import '../../app.css';
</script>

<Template let:args>
  <Helpsupport/>
</Template>


<Story name="Help & Support" />