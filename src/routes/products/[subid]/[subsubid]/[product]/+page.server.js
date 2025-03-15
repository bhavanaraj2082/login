import { DifferentProds, isProductFavorite } from "$lib/server/mongoLoads.js";
import { RelatedProductData } from "$lib/server/mongoLoads.js";
import { CreateProductQuote,addToCart } from "$lib/server/mongoActions.js";
import { CompareSimilarityData } from "$lib/server/mongoLoads.js";
import { sendemailOtp, verifyemailOtp } from "$lib/server/mongoActions.js";
import { sanitizeFormData } from "$lib/utils/sanitize.js";
import Profile from "$lib/server/models/Profile.js";
import TokenVerification from "$lib/server/models/TokenVerification.js";
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
      console.log("quotee data in server js",data);
      async function getClientIP() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      }
      const ipAddress = await getClientIP();
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
          units: data.units
        },
      };


      const record = await CreateProductQuote(formattedData);
      const targetEmailContent = sendemail.emailTemplatequote
      .replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
      .replaceAll('{{APP_URL}}', APP_URL)
      .replaceAll('{{productName}}', formattedData.Configure_custom_solution.components.productName || '')
      .replaceAll('{{productNumber}}', formattedData.Configure_custom_solution.components.productNumber || '')
      .replaceAll('{{units}}', formattedData.Configure_custom_solution.units || '')
      .replaceAll('{{Firstname}}', formattedData.Customer_details.Firstname || '')
      .replaceAll('{{Lastname}}', formattedData.Customer_details.Lastname || '')
      .replaceAll('{{organisation}}', formattedData.Customer_details.organisation || '')
      .replaceAll('{{email}}', formattedData.Customer_details.email || '')
      .replaceAll('{{phone}}', formattedData.Customer_details.number || '')
      .replaceAll('{{futherdetails}}', formattedData.Additional_notes || '')
      .replaceAll('{{ipAddress}}', formattedData.ipAddress || ''); 

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
      .replaceAll('{{productName}}', formattedData.Configure_custom_solution.components.productName || '')
      .replaceAll('{{productNumber}}', formattedData.Configure_custom_solution.components.productNumber || '')
      .replaceAll('{{units}}', formattedData.Configure_custom_solution.units || '')
      .replaceAll('{{Firstname}}', formattedData.Customer_details.Firstname || '')
      .replaceAll('{{Lastname}}', formattedData.Customer_details.Lastname || '')
      .replaceAll('{{organisation}}', formattedData.Customer_details.organisation || '')
      .replaceAll('{{email}}', formattedData.Customer_details.email || '')
      .replaceAll('{{phone}}', formattedData.Customer_details.number || '')
      .replaceAll('{{futherdetails}}', formattedData.Additional_notes || '');

    try {
      await sendEmailToUser(
        `Your Quote Confirmation – ${PUBLIC_WEBSITE_NAME}`,
        userEmailContent,
        formattedData.Customer_details.email
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

  verifyemail: async ({ request }) => {
    const rawData = Object.fromEntries(await request.formData());
    const body = sanitizeFormData(rawData);
    // const body=rawData;
    const email = body.email;
    console.log(body, "body");

    if (!email) {
      return {
        status: 400,
        message: "Please provide a valid email address",
        success: false,
        isEmailVerified: false,
      };
    }

    try {
      const tokenVerificationRecord = await TokenVerification.findOne({
        email,
      });
      // console.log('TokenVerification record:', tokenVerificationRecord);
      if (tokenVerificationRecord && tokenVerificationRecord.isEmailVerified) {
        return {
          status: 200,
          message: "Email is already verified",
          success: true,
          isEmailVerified: true,
        };
      }
      const user = await Profile.findOne({ email });
      console.log(user);

      if (!user) {
        const result = await sendemailOtp(email);
        if (result) {
          return {
            status: 200,
            message:
              "Verification email sent successfully. Please check your inbox.",
            success: true,
            isEmailVerified: false,
          };
        } else {
          throw new Error("Email sending failed");
        }
      }

      if (!user.isEmailVerified) {
        const result = await sendemailOtp(email);
        if (result) {
          return {
            status: 200,
            message:
              "Verification email sent successfully. Please check your inbox.",
            success: true,
            isEmailVerified: false,
          };
        } else {
          throw new Error("Email sending failed");
        }
      }
      return {
        status: 200,
        message: "User already exists and email is verified.",
        success: true,
        isEmailVerified: true,
      };
    } catch (error) {
      console.log("error sending email:", error);

      return {
        status: 500,
        message:
          "Verification mail could not be sent. Double-Check your email again",
        success: false,
        isEmailVerified: false,
      };
    }
  },

  verifyOtp: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    console.log("verifyOtp body", body);
    const { email, enteredOtp } = body;

    try {
      if (!email) {
        return {
          status: 500,
          message: "Please provide email to verify.",
          success: false,
          isEmailVerified: false,
        };
      }

      if (!enteredOtp) {
        return {
          status: 500,
          message: "Please provide OTP to verify.",
          success: false,
          isEmailVerified: false,
        };
      }

      const verificationResult = await verifyemailOtp(email, enteredOtp);
      if (!verificationResult.success) {
        // console.log("OTP verification failed:", verificationResult.message);
        return {
          status: 500,
          message: verificationResult.message,
          success: false,
          isEmailVerified: false,
        };
      } else {
        // console.log("OTP verification successful:", verificationResult.message);
        return {
          status: 200,
          message: verificationResult.message,
          success: true,
          isEmailVerified: true,
        };
      }
    } catch (error) {
      console.error("Error in verifyOtp handler:", error);
      return {
        status: 500,
        message:
          "An unexpected error occurred while verifying the OTP. Please try again later.",
        success: false,
        isEmailVerified: false,
      };
    }
  },
};
