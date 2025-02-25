import { submitContactData } from "$lib/server/mongoActions.js";
import { sanitizeFormData } from '$lib/utils/sanitize.js';
export const actions = {
  contactus: async ({ request }) => {
    try {
      const rawData = Object.fromEntries(await request.formData());
      const body = sanitizeFormData(rawData);
      // console.log("bodybody",body);
      
      await submitContactData(body);
      return {
        type: "success",
        data: {
          message: "Contact details submitted successfully!",
        },
      };
    } catch (error) {
      console.error("Error creating contact:", error);
      return {
        type: "error",
        data: {
          error: "Error submitting your data. Please try again later!",
        },
      };
    }
  },
};