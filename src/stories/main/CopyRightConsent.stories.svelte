<script context="module">
    import CopyRightConsent from '$lib/components/CopyRightConsent.svelte';
   
  
    export const meta = {
      title: "notinuse/CopyRightConsent",
      component: CopyRightConsent,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template >
    <CopyRightConsent/>
  </Template>
  
  
  <Story name="CopyRightConsent12" />