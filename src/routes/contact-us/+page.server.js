import { submitContactInfo } from "$lib/server/mongoActions.js";
import { sendEmail } from "$lib/utils/sendEmail.js";
import { sanitizeFormData } from '$lib/utils/sanitize.js';

export const actions = {
  contactus: async ({ request },event) => {
    try {
      const rawData = Object.fromEntries(await request.formData());
      const body = sanitizeFormData(rawData);
      // console.log("body",body);
      
      await submitContactInfo(body);

      const subject = `New contact from ${body.name}`;
      const content = `
                <h2>New Contact Information</h2>
                <p><strong>Name:</strong> ${body.name}</p>
                <p><strong>Email:</strong> ${body.email}</p>
                <p><strong>country:</strong> ${body.country}</p>
                <p><strong>Phone:</strong> ${body.phone}</p>
                <p><strong>Subject:</strong> ${body.subject}</p>
                <p><strong>Message:</strong> ${body.message}</p>
                <p><strong>Status:</strong> ${body.status}</p>`;     
      await sendEmail(subject, content);

      return {
        type: "success",
        data: {
          message: "Contact details submitted successfully!",
        },
      };
    } catch (error) {
      // console.error("Error creating contact:", error);
      return {
        type: "error",
        data: {
          error: "Error submitting your data. Please try again later!",
        },
      };
    }
  },
};
