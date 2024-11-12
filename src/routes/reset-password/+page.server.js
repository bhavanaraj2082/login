import { passwordActions } from '$lib/server/actions.js';
import { pb, authenticate } from '$lib/server/pocketbase.js';  

export const actions = {
  resetpassword: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const email = data.email;

    const authResult = await authenticate();
    if (authResult.status === 400) {
      return {
        type: "error",
        message: authResult.error || "Authentication failed. Please try again later.",
      };
    }

    try {
      const result = await passwordActions.resetpassword(email, pb);
      console.log("Password reset request result:", result);
      return result; 
    } catch (error) {
      return {
        type: "error",
        message: error.response?.data?.message || "Failed to send password reset request. Please try again."
      };
    }
  }
};
