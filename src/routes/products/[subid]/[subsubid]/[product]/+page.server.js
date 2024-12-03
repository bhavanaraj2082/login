import { DifferentProds } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";
import { favorite } from "$lib/server/mongoActions.js";

export async function load({ params }) {
  try {
      const results = await Promise.allSettled([
          DifferentProds(params.product),
          RelatedProductData(params.product)
      ]);

  const [productData, relatedProducts] = results.map((result) =>
      result.status === 'fulfilled' ? result.value : []
  );

  if (productData.type === 'error') {
      return {
          error: productData.message
      };
  }
  return { productData ,relatedProducts};
} catch (error) {
  console.error('Error loading product data:', error);
  return {
      error: 'Failed to load product data.'
  };
}
}

export const actions = {
  favorite: async ({ request }) => {
    const favdata = Object.fromEntries(await request.formData());
    // console.log("Form Data Received:", favdata);
    const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
    try {
      const result = await favorite(favdata);
      return result; 
    } catch (error) {
      console.error("Error adding to favourites:", error.message);
      return {
        type: 'error',
        message:'Please login to add to favourites!.',
      };
    }
  },
};