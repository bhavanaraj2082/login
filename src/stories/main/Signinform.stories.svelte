<script context="module">
	import Signinform from './../../lib/components/SignupSigninComps/Signin.svelte';

        export const meta = {
            title: "Signinform",
            component: Signinform,
        };
    </script>
    
    <script>
        import { Story, Template } from "@storybook/addon-svelte-csf";
        import "../../app.css";
    </script>
    
    <Template let:args>
        <Signinform></Signinform>
    </Template>
    
    <Story name="Signinform1" />
    