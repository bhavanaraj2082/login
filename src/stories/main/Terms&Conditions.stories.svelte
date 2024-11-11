<script context="module">
    import TermsConditions from "$lib/components/ChemiKartStaticPages/TermsConditions.svelte";

    export const meta = {
        title: "notinuse/TermsAndPrivacy",
        component: TermsConditions,
    };
</script>

<script>
    import "../../app.css";
    import { Story, Template } from "@storybook/addon-svelte-csf";
</script>

<Template let:args>
    <TermsConditions />
</Template>

<Story name="TermsConditions1" />
