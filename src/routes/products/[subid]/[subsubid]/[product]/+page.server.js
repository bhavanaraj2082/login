import { DifferentProds, isProductFavorite } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";
import { CreateProductQuote,addToCart } from "$lib/server/mongoActions.js";
import { CompareSimilarityData } from "$lib/server/mongoLoads.js";
import { favorite, checkavailabilityproduct } from "$lib/server/mongoActions.js";
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
  let authedUser = {};
  if (locals.authedUser?.username) {
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
      results.map((result) => (result.status === "fulfilled" ? result.value : []));

    if (!productData || productData.type === "error" || Object.keys(productData).length === 0) {
      throw error(404, "Product not found");
    }
    // console.log(compareSimilarity,"compareSimilarity from server");
    
    return {
      productData,
      relatedProducts,
      compareSimilarity,
      isFavorite,
      authedUser,
    };
  } catch (err) {
    console.error("Error loading product data:", err);
    if (err.status === 404) {
      throw err;
    }
    throw error(500, "Failed to load product data.");
  }
}

export const actions = {
  favorite: async ({ request }) => {
    const favdata = Object.fromEntries(await request.formData());
    // console.log("Form Data Received:", favdata);
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
      async function getClientIP() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      }
      const ipAddress = await getClientIP();
      const record = await CreateProductQuote(data);
      const targetEmailContent = sendemail.emailTemplatequote
      .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
      .replaceAll('{{APP_URL}}', APP_URL)
      .replaceAll('{{productName}}', data.productName || '')
      .replaceAll('{{productNumber}}', data.productNumber || '')
      .replaceAll('{{units}}', data.units || '')
      .replaceAll('{{Firstname}}', data.Firstname || '')
      .replaceAll('{{Lastname}}', data.lastname || '')
      .replaceAll('{{organisation}}', data.organisation || '')
      .replaceAll('{{email}}', data.email || '')
      .replaceAll('{{phone}}', data.phone || '')
      .replaceAll('{{futherdetails}}', data.futherdetails || '')
      .replaceAll('{{ipAddress}}', ipAddress || ''); 

    try {
      await sendNotificationEmail(
        `New Quote Created – ${PUBLIC_WEBSITE_NAME}`,
        targetEmailContent
      );
    } catch (error) {
      console.error('Error sending notification email to the team:', error);
    }
    const userEmailContent = sendemail.emailTemplatequoteuser
      .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME) 
      .replaceAll('{{APP_URL}}', APP_URL)
      .replaceAll('{{productName}}', data.productName || '')
      .replaceAll('{{productNumber}}', data.productNumber || '')
      .replaceAll('{{units}}', data.units || '')
      .replaceAll('{{Firstname}}', data.Firstname || '')
      .replaceAll('{{Lastname}}', data.lastname || '')
      .replaceAll('{{organisation}}', data.organisation || '')
      .replaceAll('{{email}}', data.email || '')
      .replaceAll('{{phone}}', data.phone || '')
      .replaceAll('{{futherdetails}}', data.futherdetails || '');

    try {
      await sendEmailToUser(
        `Your Quote Confirmation – ${PUBLIC_WEBSITE_NAME}`,
        userEmailContent,
        data.email
      );
    } catch (error) {
      console.error('Error sending confirmation email to the user:', error);
    }
      return {
        success: true,
        message: "Submitted the quotes successfully!.",
      };    
    } catch (error) {
      console.error("Error creating quote:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again later",
      };
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
        message: "Something went wrong. Please try again later",
      };
    }
  },

  addtocart:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || ""
			const userEmail = locals?.authedUser?.email ||""
			const body = Object.fromEntries(await request.formData())
			const data = JSON.parse(body.items)
			return await addToCart(data,userId,userEmail)
		} catch (error) {
			console.log(error);
			return {success:false,message:"Something went wrong"}
		}
	},
};