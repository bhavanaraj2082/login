import { pb, authenticate } from "$lib/server/pocketbase.js";
import { submitContactData } from "$lib/server/actions";
export const actions = {
  contactus: async ({ request }) => {
    try {
      const authenticatedPb = await authenticate();
      if (!authenticatedPb) {
        return {
          type: "error",
          data: {
            error: "Authentication failed. Please try again later!",
          },
        };
      }
      const body = Object.fromEntries(await request.formData());
      await submitContactData(body, authenticatedPb);
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