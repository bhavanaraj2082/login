<script context="module">
    import PrivacyNotice from "$lib/components/ChemiKartStaticPages/PrivacyNotice.svelte";

    export const meta = {
        title: "notinuse/TermsAndPrivacy",
        component: PrivacyNotice,
    };
</script>

<script>
    import "../../app.css";
    import { Story, Template } from "@storybook/addon-svelte-csf";
</script>


<Template let:args>
    <PrivacyNotice/>
</Template>

<Story name="PrivacyNotice1" />