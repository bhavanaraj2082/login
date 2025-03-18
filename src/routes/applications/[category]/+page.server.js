import data from '$lib/data/applications.json';  

export async function load({ params }) {
  const { category } = params;

  const categoryData = data.find(cate => cate.url === category)
  
  if (!categoryData) {
    throw { status: 404, error: 'Category not found' };
  }

  const subcategories = categoryData.subcategories;
  
  return {
      categoryData,
      subcategories,
  };
}
