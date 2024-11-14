import data from '$lib/data/applications.json';  

export async function load({ params }) {
  const { category, subcategory } = params;

  const categoryData = data.find(cate => cate.url === category)
  if (!categoryData) {
    return { status: 404, error: 'Category not found' };
  }

  const subcategoryData = categoryData.subcategories.find(sub => sub.url === subcategory);
  if (!subcategoryData) {
    return { status: 404, error: 'Subcategory not found' };
  }
  const subsubcategories = subcategoryData.subsubcategories || {};

  return {
    categoryData,
    subcategoryData,
    subsubcategories,
  };
}
