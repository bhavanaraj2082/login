<script context="module">
    import MyDetails from "../../lib/components/MyDetails.svelte";

    export const meta = {
        title: "MyDetails",
        component: MyDetails,
    };
</script>

<script>
    import { Story, Template } from "@storybook/addon-svelte-csf";
    import "../../app.css";
</script>

<Template let:args>
    <MyDetails></MyDetails>
</Template>

<Story name="MyDetails1" />
