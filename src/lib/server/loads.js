
import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"
import PocketBase from 'pocketbase'

const pb = new PocketBase(`${DB_URL}`)


export const getChemicalProducts = async()=>{
    try {
      await pb.admins.authWithPassword(`${DB_USER}`,`${DB_PASS}`)
      const products = await pb.collection("SampleChemiComponent").getList(1,10,{fields:"productName,productNumber,priceSize,prodDesc"})
     // console.log(products.items);
      return {products:products.items}
    } catch (error) {
        console.log(error);
    }
}

export async function loadProducts() {
  try {
      // Fetch all products from the PocketBase 'products' collection
      const products = await pb.collection('products').getFullList();
      return products; // Return the list of products
  } catch (error) {
      console.error('Error loading products:', error);
      return [];
  }
}

// Function to load a specific product by ID (for details page)
export async function loadProductById(productId) {
  try {
      // Fetch a single product by its ID
      const product = await pb.collection('products').getOne(productId);
      return product; // Return the product data
  } catch (error) {
      console.error('Error loading product by ID:', error);
      return null;
  }
}

