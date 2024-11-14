import data from '$lib/data/applications.json';

export async function load({ params }) {
  const { category, subcategory, subsubcategory } = params;

  const categoryData = data.find(cate => cate.url === category);
  if (!categoryData) {
    return { status: 404, error: 'Category not found' };
  }

  const subcategoryData = categoryData.subcategories.find(sub => sub.url === subcategory);
  if (!subcategoryData) {
    return { status: 404, error: 'Subcategory not found' };
  }

  let subsubcategoryData = null;
  if (Array.isArray(subcategoryData.subsubcategories)) {
    subsubcategoryData = subcategoryData.subsubcategories.find(subsub => subsub.url === subsubcategory);
  }

  if (!subsubcategoryData) {
    return { status: 404, error: 'Subsubcategory not found' };
  }

  return {
    subsubcategoryData,
  };
}
