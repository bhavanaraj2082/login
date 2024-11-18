<script context="module">
    import PageNotFound from "$lib/components/PageNotFound.svelte";
    export const meta ={
        title:"PageNotFound-page",
        component: PageNotFound
    }
  </script>
  <script>
        import "../../app.css";
        import {Story, Template} from '@storybook/addon-svelte-csf'
  </script>
  <Template let:args>
    <PageNotFound></PageNotFound>
  </Template>
  <Story name="PageNotFounds"/>