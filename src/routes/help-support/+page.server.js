import { saveContactInfo } from '$lib/server/mongoActions.js'
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import Order from '$lib/server/models/Order.js';
import User from '$lib/server/models/User.js';
import { fail } from '@sveltejs/kit';
export const actions = {
  contact: async ({ request }) => {
    try {
      const body = Object.fromEntries(await request.formData());
      // console.log('Form Data:', body); // Log for debugging
      const response = await saveContactInfo(body);
      // console.log("outputttttttttt",response);

      return response;
    } catch (error) {
      console.error('Error handling form submission:', error);
      return { success: false, error: error.message };
    }
  },
  validatepo: async ({ request, locals }) => {
    const formData = await request.formData();
    console.log('Received form data:', formData);
    const orderid = formData.get('poNumber');
    const email = formData.get('email');
    console.log('Extracted orderid:', orderid);
    console.log('Extracted email:', email);

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        console.log('No user found with email:', email);
        return fail(400, { success: false, message: 'No order found with this order number for your account' });
      }

      const userId = user._id;
      console.log('Found userId:', userId);
      const matchingOrder = await Order.findOne({
        userId: userId,
        orderid: orderid
      });

      if (!matchingOrder) {
        console.log('No order found with orderid:', orderid, 'for userId:', userId);
        return fail(400, { success: false, message: 'No order found with this order number for your account' });
      }

      const response = {
        success: true,
        order: {

          orderid: matchingOrder.orderid || 'N/A',

          createdAt: matchingOrder.createdAt,
        }
      };

      console.log('Returning the following response:', response);
      return response;

    } catch (error) {
      console.error('Error during invoice validation:', error);
      return fail(500, { success: false, message: 'Internal Server Error' });
    }
  }
};



export const load = async ({ locals }) => {
  // Check if there's an authenticated user
  if (!locals.user) {
    console.log('No authenticated user found');
    return null;
  }

  // Create authedUser object with userId
  const authedUser = { id: locals.user.userId };
  console.log(authedUser, "authedUser");

  // Fetch the user profile from the database
  const userProfile = await Profile.findOne({ userId: authedUser.id });
  console.log(userProfile, "userProfile");

  // If no profile is found, return null
  if (!userProfile) {
    console.log('User profile not found');
    return null;
  }

  // Final result to return
  const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));
  console.log(finalResult, "finalResult");

  return finalResult;
};


