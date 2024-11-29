import { saveContactInfo } from '$lib/server/mongoActions.js'
export const actions = {
    contact: async ({ request }) => {
      try {
        const body = Object.fromEntries(await request.formData());
        console.log('Form Data:', body); // Log for debugging
        const output = await saveContactInfo(body);
        console.log("outputttttttttt",output);
        
        return output;
      } catch (error) {
        console.error('Error handling form submission:', error);
        return { success: false, error: error.message };
      }
    }
  };