import { pb, authenticate } from '$lib/server/pocketbase.js'; 
import { loadProductsInfo } from '$lib/server/loads.js';
import { checkavailabilityproduct,favorite } from '$lib/server/actions.js';
import { RelatedProductData } from '$lib/server/loads';
import { DifferentProductData } from '$lib/server/loads';


export async function load({ params }) {
  // const { product } = params;

  try {
    const authResponse = await authenticate();
    if (authResponse?.status === 400) {
      return {
        error: authResponse.error,
      };
    }

    const productData = await loadProductsInfo(pb,params.product);
    const relatedProducts  = await RelatedProductData(pb,params.product);
    const differentProducts = await DifferentProductData(pb, params.product);

    

    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }

    const PartNumber = productData.records[0]?.productId;
    // console.log("PartNumber for stock data:", PartNumber);

    // console.log("Product Records:", productData);

    return { productData , relatedProducts , differentProducts}
  } catch (error) {
    console.error("Error loading product data:", error);
    return {
      error: "Failed to load product data.",
    };
  }
}


/********************checkavailabilityproduct**********************/
export const actions = {
  checkavailabilityproduct: async ({ request }) => {
    const authResponse = await authenticate();
    if (authResponse?.status === 400) {
      return {
        type: "error",
        message: authResponse.error,
      };
    }

    try {
      const formData = Object.fromEntries(await request.formData());
      // console.log("Formatted Data:", formData);
      const record = await checkavailabilityproduct(formData, pb);
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

  favorite: async ({ request }) => {
    const favdata = Object.fromEntries(await request.formData());
    // console.log("Form Data Received:", favdata);
    const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
    const dataforfavorite = {productDesc,id,imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,};
    try {
      const result = await favorite(favdata,pb);
      return result; 
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
      return {
        type: 'error',
        message:'Invalid Credentials!',
      };
    }
  },
};