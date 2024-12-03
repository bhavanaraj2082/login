import { DifferentProds } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";

export async function load({ params }) {
  const productNumber = params.product;
  try {
    const [productData, relatedProducts] = await Promise.all([
      DifferentProds(params.product),
      RelatedProductData(params.product)
    ]);

    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }

    return { productData, relatedProducts };
  } catch (error) {
    console.error("Error loading product data:", error);
    return {
      error: "Failed to load product data.",
    };
  }
}