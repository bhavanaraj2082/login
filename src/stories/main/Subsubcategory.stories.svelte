<script context="module">
    import Subsubcategory from "$lib/components/Subsubcategory.svelte";

    export const meta = {
        title: "Subsubcategory",
        component: Subsubcategory,
    };
</script>

<script>
    import "../../app.css";
    import { Story, Template } from "@storybook/addon-svelte-csf";
</script>

<Template>
    <Subsubcategory />
</Template>

<Story name="Subsubcategory12"/>
