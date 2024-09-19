<script context="module">
    import Footer from "../../lib/components/Footer.svelte";
    export const meta ={
        title:"Footer",
        component: Footer
    }
    </script>
    <script>
        import "../../app.css";
        import {Story, Template} from '@storybook/addon-svelte-csf'
    </script>
    
    <Template let:args>
        <Footer ></Footer>
    </Template>
    
    <Story name="Footer1"/>