import { RelatedApplicationData } from '$lib/server/mongoLoads.js';
import { CreateProductQuote, addToCart } from '$lib/server/mongoActions.js';
import data from '$lib/data/applications.json';  
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';

function findData(items, key, value) {
  const found = items.find(item => item[key] === value);
  if (!found) {
    throw { status: 404, error: `${key.charAt(0).toUpperCase() + key.slice(1)} not found` };
  }
  return found;
}

export async function load({ params }) {
  try {
    const { category, subcategory } = params;

    const categoryData = findData(data, 'url', category);
    if (categoryData.status === 404) return categoryData; 
    
    const subcategoryData = findData(categoryData.subcategories, 'url', subcategory);
    if (subcategoryData.status === 404) return subcategoryData; 

    const subsubcategories = subcategoryData.subsubcategories || [];
    let relatedProducts = [];
    if (subsubcategories.length ===0) {
    //  relatedProducts = await RelatedApplicationData(subcategoryData.name);
        relatedProducts = {}
    //  console.log(relatedProducts);
     
    }

    return {
      categoryData,
      subcategoryData,
      subsubcategories,
      relatedProducts
    };
    
  } catch (error) {
    console.error('Error loading data:', error);
    return { status: 500, error: 'Internal Server Error' };
  }
}
export const actions = {
  addtocart:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || ""
			const userEmail = locals?.authedUser?.email ||""
			const body = Object.fromEntries(await request.formData())
      console.log(body);
      
			const data = JSON.parse(body.items)
			return await addToCart(data,userId,userEmail)
		} catch (error) {
			console.log(error);
			return {success:false,message:"Something went wrong"}
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
};