import { pb, authenticate } from '$lib/server/pocketbase.js'; 
import { loadProductsInfo } from '$lib/server/loads.js';
import { checkavailabilityproduct } from '$lib/server/actions.js';

export async function load({ params }) {
  const { product } = params;

  try {
    const authResponse = await authenticate();
    if (authResponse?.status === 400) {
      return {
        error: authResponse.error,
      };
    }

    const productData = await loadProductsInfo(pb, { ProductId: product });

    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }

    const PartNumber = productData.records[0]?.productId;
    // console.log("PartNumber for stock data:", PartNumber);

    // console.log("Product Records:", productData);

    return productData;
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
      console.log("Formatted Data:", formData);
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
};