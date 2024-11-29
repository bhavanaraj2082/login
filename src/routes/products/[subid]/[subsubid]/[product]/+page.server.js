import { checkavailabilityproduct,favorite } from "$lib/server/mongoActions.js";
import { loadProductsInfo,isProductFavorite } from "$lib/server/mongoLoads.js";

export async function load({ params, cookies }) {
 const productNumber= params.product;
  try {
    const productData = await loadProductsInfo(params.product);
    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }
    // const relatedProducts = await RelatedProduct.find({ productId: params.product });
    // const differentProducts = await DifferentProduct.find({ productId: params.product });
    // const isFavorite = await isProductFavorite(productNumber, cookies);
// return data;
return productData
  // isFavorite,
  // relatedProducts,
  // differentProducts,
;} catch (error) {
    console.error("Error loading product data:", error);
    return {
      error: "Failed to load product data.",
    };
  }
}


export const actions = {
  checkavailabilityproduct: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      // console.log("Formatted Data:", formData);
      const record = await checkavailabilityproduct(formData);
      return {
        record: record,
      };
    } catch (error) {
      console.error("Error in action:", error);
      return {
        type: "error",
        message: "An error occurred while processing the request.",
      };
    }
  },

  favorite: async ({ request, cookies }) => {
    const favdata = Object.fromEntries(await request.formData());
    // console.log("Form Data Received:", favdata);
    const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
    const dataforfavorite = {productDesc,id,imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,};
    try {
      const result = await favorite(favdata,cookies);
      return result; 
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
      return {
        type: 'error',
        message:'An error occurred while updating favorites.',
      };
    }
  },
};