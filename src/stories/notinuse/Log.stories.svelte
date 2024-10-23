<script context="module">
    import Log from '$lib/components/LoginPage/Log.svelte';
  
    export const meta = {
      title: "notinuse/LoginPage",
      component: Log
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Log >
    </Log>
  </Template>
  
  
  <Story name="LoginPage1" />