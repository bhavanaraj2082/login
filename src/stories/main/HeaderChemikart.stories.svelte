<script context="module">

    import Header from '$lib/components/Header/Header.svelte';
      
        export const meta = {
          title: "Header",
          component: Header,
        }
      </script>
      
      <script>
        import { Story, Template } from '@storybook/addon-svelte-csf';
        import '../../app.css';
      </script>
      
      <Template let:args>
        <Header/>
      </Template>
      
    
      <Story name="Header1" />