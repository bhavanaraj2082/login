<script context="module">
import Signupform from "../../lib/components/SignupSigninComps/Signup.svelte";

    export const meta = {
        title: "Signupform",
        component: Signupform,
    };
</script>

<script>
    import { Story, Template } from "@storybook/addon-svelte-csf";
    import "../../app.css";
</script>

<Template let:args>
    <Signupform></Signupform>
</Template>

<Story name="Signupform1" />
