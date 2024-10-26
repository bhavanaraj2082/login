<script context="module">
	import Resetpassword from './../../lib/components/SignupSigninComps/Resetpassword.svelte';    
        export const meta = {
            title: "Resetpassword",
            component: Resetpassword,
        };
    </script>
    
    <script>
        import { Story, Template } from "@storybook/addon-svelte-csf";
        import "../../app.css";
    </script>
    
    <Template let:args>
        <Resetpassword></Resetpassword>
    </Template>
    
    <Story name="Resetpassword1" />
    