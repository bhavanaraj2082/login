<script context="module">
    import SubSubCategory from "$lib/components/Application/SubSubCategory.svelte";

    export const meta = {
        title: "Application",
        component: SubSubCategory,
        args: {
            data: {
                subsubcategoryData: {
                    name: "Low Pressure Liquid Chromatography",
                    description:
                        "A form of liquid chromatography that operates at lower pressures compared to traditional HPLC, used for simpler separations.",
                    image: "path/to/hplc-low-pressure-image.jpg",
                    url: "hplc-low-pressure",
                    additionalInfo:
                        "Low Pressure Liquid Chromatography (LPLC) is a variant of traditional HPLC that uses lower pressures and is generally applied to simpler separations or preparative-scale chromatography. It is widely used for the isolation of large quantities of compounds, especially in the field of organic synthesis and natural product isolation. LPLC is also helpful when analyzing less complex samples or when working with more fragile compounds that could degrade under the high pressures of conventional HPLC.",
                },
            },
        },
    };
</script>

<script>
    import { Story, Template } from "@storybook/addon-svelte-csf";
    import "../../app.css";
</script>

<Template let:args>
    <SubSubCategory {...args} />
</Template>

<Story name="SubSubCategory_page" />
