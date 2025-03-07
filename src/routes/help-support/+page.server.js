import { saveContactInfo } from '$lib/server/mongoActions.js'
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
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
  
    
