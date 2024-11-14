<script context="module">
    import Category from '$lib/components/Application/Category.svelte';
    import data from "$lib/data/applications.json";

    
    export const meta = {
      title: "Application",
      component: Category,
      args: { data:{
      categoryData: data.find((cate) => cate.url === 'analytical-chemistry'), // Get the category by URL or ID
      subcategories: data.find((cate) => cate.url === 'analytical-chemistry')?.subcategories} // Extract subcategories
    }
    }
  </script>
  
  <script>
    import { Story, Template } from '@storybook/addon-svelte-csf';
    import '../../app.css';
  </script>
  
  <Template let:args>
    <Category {...args}/>
  </Template>
  
  
  <Story name="Category_page" />
  