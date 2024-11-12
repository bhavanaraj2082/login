import { actions as registerActions } from '$lib/server/actions.js';
import { pb, authenticate } from '$lib/server/pocketbase.js';  
export const actions = {
  register: async ({ request }) => {
    const userData = Object.fromEntries(await request.formData());
    const { username, email, language, location, password, passwordConfirm } = userData;
    const data = {
      username,
      email,
      language,
      location,
      password,
      passwordConfirm,
    };

    const authResult = await authenticate();
    if (authResult.status === 400) {
      return {
        type: "error",
        message: authResult.error || "Authentication failed. Please try again later.",
      };
    }

    try {
      const result = await registerActions.register(data, pb);
      return result;  
    } catch (error) {
      return {
        type: "error",
        message: error.response?.data?.message || "Username or email already exists. Please use a different username or email, and ensure the passwords match.",
      };
    }
  },
};