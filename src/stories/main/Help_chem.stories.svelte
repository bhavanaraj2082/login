<script context="module">
  import Help_chem from "$lib/components/Help_chem.svelte";

  export const meta = {
      title: "Help_chem",
      component: Help_chem,
  };
</script>

<script>
  import { Story, Template } from "@storybook/addon-svelte-csf";
  import "../../app.css";
</script>

<Template let:args>
  <Help_chem></Help_chem>
</Template>

<Story name="Help_chem1" />
