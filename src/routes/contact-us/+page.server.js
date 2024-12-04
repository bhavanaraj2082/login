import { submitContactInfo } from "$lib/server/mongoActions.js";
import { sendEmail } from '$lib/utils/sendEmail.js';

export const actions = {
  contactus: async ({ request },event) => {
    try {
      // console.log("x-forward",event.getClientAddress());
      //let ip = request.headers.get('x-forwarded-for') || request.connection.remoteAddress || request.socket.remoteAddress;
      //console.log("addr",ip);
      const body = Object.fromEntries(await request.formData());
      await submitContactInfo(body);

      await sendEmail(body);
  
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
