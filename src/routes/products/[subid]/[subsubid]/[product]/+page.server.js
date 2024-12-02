import { DifferentProds } from "$lib/server/mongoLoads.js";
export async function load({ params}) {
 const productNumber= params.product;
  try {
    const productData = await DifferentProds(params.product);
    // console.log("productData#####",productData);
    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }
return productData
;} catch (error) {  
    console.error("Error loading product data:", error);
    return {
      error: "Failed to load product data.",
    };
  }
}