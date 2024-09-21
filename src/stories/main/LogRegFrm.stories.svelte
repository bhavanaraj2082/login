<script context="module">
  import LogRegFrm from "$lib/components/LogRegFrm.svelte";

  export const meta = {
      title: "LogRegFrm",
      component: LogRegFrm,
  };
</script>

<script>
  import { Story, Template } from "@storybook/addon-svelte-csf";
  import "../../app.css";
</script>

<Template let:args>
  <LogRegFrm></LogRegFrm>
</Template>

<Story name="LogRegFrm1" />
