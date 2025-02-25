import { signUp } from '$lib/server/mongoActions.js';

export const actions = {
  register: async ({ request,cookies }) => {
    try {
      const body = Object.fromEntries(await request.formData());
      return await signUp(body,cookies);  
    } catch (error) {
      return {
        success:false,
        message:"Username or email already exists. Please use a different username or email" 
      };
    }
  }
};