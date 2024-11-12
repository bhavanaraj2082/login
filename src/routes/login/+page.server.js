import { signinActions } from '$lib/server/actions.js';
import { pb, authenticate } from '$lib/server/pocketbase.js';  
export const actions = {
  login: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    console.log("form entries data:", data);

    const authResult = await authenticate();

    if (authResult.status === 400) {
      return {
        type: "error",
        message: authResult.error || "Authentication failed. Please try again later.",
      };
    }

    try {
      const result = await signinActions.login(data.email, data.password, pb);
      return result;  
    } catch (error) {
      console.error("Error during sign-in:", error);
      return {
        type: "error",
        message: error.response?.data?.message || "Invalid credentials. Please try again.",
      };
    }
  },
};