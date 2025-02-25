import { DifferentProds, isProductFavorite } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";
import { CreateProductQuote } from "$lib/server/mongoActions.js";
import { CompareSimilarityData } from "$lib/server/mongoLoads.js";

import {
  favorite,
  checkavailabilityproduct,
} from "$lib/server/mongoActions.js";

export async function load({ params, locals }) {
  let authedUser = {};
  if (locals.authedUser && locals.authedUser?.username) {
    authedUser = locals.authedUser;
  }
  try {
    const results = await Promise.allSettled([
      DifferentProds(params.product),
      RelatedProductData(params.product),
      CompareSimilarityData(params.product),
      isProductFavorite(params.product, locals),
    ]);

    const [productData, relatedProducts, compareSimilarity, isFavorite] =
      results.map((result) =>
        result.status === "fulfilled" ? result.value : []
      );

    if (productData.type === "error") {
      return {
        error: productData.message,
      };
    }
    return {
      productData,
      relatedProducts,
      compareSimilarity,
      isFavorite,
      authedUser,
    };
  } catch (error) {
    console.error("Error loading product data:", error);
    return {
      error: "Failed to load product data.",
    };
  }
}

export const actions = {
  favorite: async ({ request }) => {
    const favdata = Object.fromEntries(await request.formData());
    // console.log("Form Data Received:", favdata);
    // const {productDesc, id, imgUrl,productName,productNumber,priceSize,quantity,stock,size,price,} = favdata;
    try {
      const result = await favorite(favdata);
      return result;
    } catch (error) {
      console.error("Error adding to favourites:", error.message);
      return {
        success: false,
        type: "error",
        message: "Something went wrong please try again later!",
      };
    }
  },

  createQuote: async ({ request }) => {
    try {
      const data = Object.fromEntries(await request.formData());
      // console.log("quotee data in server js",data);
      const components = {
        productName: data.productName,
        productNumber: data.productNumber,
      };
      const formattedData = {
        Configure_custom_solution: {
          components: components,
          units: data.units,
        },
        Additional_notes: data.futherdetails,
        status: data.status,
        Customer_details: {
          Firstname: data.Firstname,
          Lastname: data.lastname,
          organisation: data.organisation,
          email: data.email,
          number: data.phone,
        },
      };

      const record = await CreateProductQuote(formattedData);
      return record;
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  },
  checkavailabilityproduct: async ({ request }) => {
    try {
      const formData = Object.fromEntries(await request.formData());
      // console.log("Formatted Data:", formData);
      const record = await checkavailabilityproduct(formData);
      return record;
    } catch (error) {
      console.error("Error in action:", error);
      return {
        type: "error",
        message: "An error occurred while processing the request.",
      };
    }
  },
};
