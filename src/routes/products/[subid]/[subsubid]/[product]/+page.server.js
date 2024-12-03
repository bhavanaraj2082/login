import { DifferentProds } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";
import { CreateProductQuote } from "$lib/server/mongoActions.js";

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

export const actions = {
  createQuote: async ({ request }) => {
      try {
          const data = Object.fromEntries(await request.formData());
          // console.log("quotee data in server js",data);
          const components={
            productName:data.productName,
            productNumber:data.productNumber
          }
          const formattedData = {
            Configure_custom_solution: {
              components: components,
              units: data.units
            },
            Additional_notes: data.futherdetails,
            status: data.status,
            Customer_details: {
              Firstname: data.Firstname,
              Lastname: data.lastname,
              organisation: data.organisation,
              email: data.email,
              number: data.phone
            }
          };
          
          const record = await CreateProductQuote(formattedData);
          return record
      } catch (error) {
          console.error("Error creating quote:", error);
      }
  },
};