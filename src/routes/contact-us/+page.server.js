import { submitContactInfo } from "$lib/server/mongoActions.js";

export const actions = {
  contactus: async ({ request }) => {
    try {
      console.log("x-forward",await request.headers.get('x-forwarded-for'));
      console.log("addr",await request.headers.get('remote-addr'));
      const body = Object.fromEntries(await request.formData());
      //await submitContactInfo(body);
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
