import data from '$lib/data/applications.json';
import { authenticate } from '$lib/server/pocketbase.js';
import { RelatedApplicationData } from '$lib/server/loads.js';

const pb = await authenticate();

async function findSubcategoryData(categoryData, subcategory, subsubcategory) {
  const subcategoryData = categoryData.subcategories.find(sub => sub.url === subcategory);
  if (!subcategoryData) {
    throw { status: 404, error: 'Subcategory not found' };
  }

  if (subsubcategory) {
    const subsubcategoryData = subcategoryData.subsubcategories?.find(subsub => subsub.url === subsubcategory);
    if (!subsubcategoryData) {
      throw { status: 404, error: 'Subsubcategory not found' };
    }
    return subsubcategoryData;
  }

  return subcategoryData;
}

export async function load({ params }) {
  try {
    const { category, subcategory, subsubcategory } = params;
    const categoryData = data.find(cate => cate.url === category);
    if (!categoryData) {
      return { status: 404, error: 'Category not found' };
    }

    const subsubcategoryData = await findSubcategoryData(categoryData, subcategory, subsubcategory);
    const relatedProducts = await RelatedApplicationData(pb, subsubcategoryData.name);

    return {
      subsubcategoryData,
      relatedProducts,
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return { status: error.status || 500, error: error.error || 'Internal Server Error' };
  }
}
