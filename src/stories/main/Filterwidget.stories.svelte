<script context="module">
    import Filterwidget from '../../lib/components/Fiterwidgets/Filterwidget.svelte';
  
    export const meta = {
      title: "Filter widget",
      component: Filterwidget,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Filterwidget/>
  </Template>
  
  
  <Story name="Filterwidget1" />