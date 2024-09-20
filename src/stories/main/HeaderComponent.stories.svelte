<script context="module">
  import HeaderComponent from '../../lib/components/HeaderComponent/HeaderComponent.svelte';

  export const meta = {
    title: "Header Section",
    component: HeaderComponent,
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import '../../app.css';
</script>

<Template let:args>
  <HeaderComponent/>
</Template>


<Story name="HeaderComponentt" />