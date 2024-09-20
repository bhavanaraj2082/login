<script context="module">
    import Youtubecomponent from '../../lib/components/Homepagecomponents/Youtubecomponent.svelte';
  
    export const meta = {
      title: "Homepagecomponents",
      component: Youtubecomponent,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Youtubecomponent/>
  </Template>
  
  
  <Story name="Youtubecomponenthome" />