import data from '$lib/data/applications.json';  
import { RelatedApplicationData } from '$lib/server/mongoLoads.js';
import { CreateProductQuote, addToCart } from '$lib/server/mongoActions.js';


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

    const categoryData = findData(data, 'url', category);
    if (categoryData.status === 404) return categoryData; 
    
    const subcategoryData = findData(categoryData.subcategories, 'url', subcategory);
    if (subcategoryData.status === 404) return subcategoryData; 

    const subsubcategories = subcategoryData.subsubcategories || [];
    let relatedProducts = [];
    if (subsubcategories.length ===0) {
     relatedProducts = await RelatedApplicationData(subcategoryData.name);
    //  console.log(relatedProducts);
     
    }

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
export const actions = {
  addtocart:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || ""
			const userEmail = locals?.authedUser?.email ||""
			const body = Object.fromEntries(await request.formData())
      console.log(body);
      
			const data = JSON.parse(body.items)
			return await addToCart(data,userId,userEmail)
		} catch (error) {
			console.log(error);
			return {success:false,message:"Something went wrong"}
		}
	},


};