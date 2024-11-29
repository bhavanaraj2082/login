import { submitContactData } from "$lib/server/mongoActions.js";
export const actions = {
  contactus: async ({ request }) => {
    try {
      const body = Object.fromEntries(await request.formData());
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