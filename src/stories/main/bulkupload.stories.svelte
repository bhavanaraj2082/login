<script context="module">
    import BulkUpload from "$lib/components/BulkUpload.svelte";

    export const meta = {
        title: "BulkUpload",
        component: BulkUpload,
    };
</script>

<script>
    import { Story, Template } from "@storybook/addon-svelte-csf";
    import "../../app.css";
</script>

<Template let:args>
    <BulkUpload></BulkUpload>
</Template>

<Story name="BulkUpload1" />
