import data from '$lib/data/applications.json';  
import { authenticate } from '$lib/server/pocketbase.js'; 
import { RelatedApplicationData } from '$lib/server/loads.js';

const pb = await authenticate();

function findData(items, key, value) {
  const found = items.find(item => item[key] === value);
  if (!found) {
    return { status: 404, error: `${key.charAt(0).toUpperCase() + key.slice(1)} not found` };
  }
  return found;
}

export async function load({ params }) {
  try {
    const { category, subcategory } = params;
    const relatedProducts = await RelatedApplicationData(pb, subcategory);
    const categoryData = findData(data, 'url', category);
    if (categoryData.status === 404) return categoryData; 
    
    const subcategoryData = findData(categoryData.subcategories, 'url', subcategory);
    if (subcategoryData.status === 404) return subcategoryData; 

    const subsubcategories = subcategoryData.subsubcategories || [];

    return {
      categoryData,
      subcategoryData,
      subsubcategories,
      relatedProducts
    };
    
  } catch (error) {
    console.error('Error loading data:', error);
    return { status: 500, error: 'Internal Server Error' };
  }
}
