<script context="module">
    import RecentlyViewed from '$lib/components/RecentlyViewed.svelte';
  
    export const meta = {
      title: "RecentlyViewed",
      component: RecentlyViewed,
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <RecentlyViewed/>
  </Template>
  
  
  <Story name="RecentlyViewed1"/>