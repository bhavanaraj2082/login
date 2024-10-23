<script context="module">
	import SiteMap from '$lib/components/SiteMap.svelte'

  export const meta = {
    title: "SiteMap",
    component: SiteMap
  }
</script>

<script>
   import '../../app.css';
   import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
    <SiteMap></SiteMap>
  </Template>
  
  
  <Story name="SiteMap1" />