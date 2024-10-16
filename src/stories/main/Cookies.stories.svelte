<script context="module">
    import Cookies from "$lib/components/Cookies.svelte"
    export const meta ={
        title:"Cookies",
        component: Cookies
    }
    </script>
    <script>
        import "../../app.css";
        import {Story, Template} from '@storybook/addon-svelte-csf'
    </script>
    
    <Template let:args>
        <Cookies></Cookies>
    </Template>
    
    
    <Story name="Cookiess"/>