<script context="module">
  import SubCategory from "$lib/components/Application/SubCategory.svelte";
  import data from "$lib/data/applications.json";

  export const meta = {
    title: "Application",
    component: SubCategory,
    args: {
      data: (() => {
        const categoryData = data.find(cate => cate.url === "analytical-chemistry");
        if (categoryData) {
          const subcategoryData = categoryData.subcategories.find(sub => sub.url === "liquid-chromatography");

          if (subcategoryData) {
            return {
              categoryData,
              subcategoryData,
              subsubcategories: subcategoryData.subsubcategories || []  
            };
          }
        }

        return {
          categoryData: {},
          subcategoryData: {},
          subsubcategories: []
        };
      })()
    }
  };
</script>

<script>
  import { Story, Template } from "@storybook/addon-svelte-csf";
  import "../../app.css";
</script>

<Template let:args>
  <SubCategory {...args} />
</Template>

<Story name="SubCategory_page" />
