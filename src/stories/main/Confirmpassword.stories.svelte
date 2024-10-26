<script context="module">
	import Confirmpassword from './../../lib/components/SignupSigninComps/Confirmpassword.svelte';
        export const meta = {
            title: "Confirmpassword",
            component: Confirmpassword,
        };
    </script>
    
    <script>
        import { Story, Template } from "@storybook/addon-svelte-csf";
        import "../../app.css";
    </script>
    
    <Template let:args>
        <Confirmpassword></Confirmpassword>
    </Template>
    
    <Story name="Confirmpassword1" />
    