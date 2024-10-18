<script context="module">
    import HeaderDropdownCart from "../../lib/components/HeaderDropdownCart/Header.svelte";

    export const meta = {
        title: "HeaderDropdownCart",
        component: HeaderDropdownCart,
    };
</script>

<script>
    import "../../app.css";
    import { Story, Template } from "@storybook/addon-svelte-csf";
</script>

<Template>
    <HeaderDropdownCart/>
</Template>

<Story name="HeaderDropdownCart1"/>
