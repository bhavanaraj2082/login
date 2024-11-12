import { confirmpasswordreset } from '$lib/server/actions.js';
import { pb, authenticate } from '$lib/server/pocketbase.js';  

export async function load({ params }) {
  console.log("Received parameters in +page.server.js:", params); 
  const token = params.token;
  console.log("Token in +page.server.js:", token); 
  return {
      token
  };
}

export const actions = {
  confirmpasswordreset: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const token = data.token;
    const newPassword = data.newPassword;
    const newConfirmPassword = data.newConfirmPassword;

    const authResult = await authenticate();
    if (authResult.status === 400) {
      return {
        type: "error",
        message: authResult.error || "Authentication failed. Please try again later.",
      };
    }

    try {
      console.log("Processing password reset confirmation...");
      const result = await confirmpasswordreset(token, newPassword, newConfirmPassword, pb);
      return result;  
    } catch (error) {
      console.error("Error during password reset confirmation process:", error);
      return {
        type: "error",
        message: "Failed to reset password. Please try again.",  
      };
    }
  },
};