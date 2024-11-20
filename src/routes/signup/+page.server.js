import { register } from '$lib/server/actions.js';
import { authenticate } from '$lib/server/pocketbase.js';  

const pb = await authenticate()

export const actions = {
  register: async ({ request,cookies }) => {
    try {
      const body = Object.fromEntries(await request.formData());
      return await register(pb,body,cookies);  
    } catch (error) {
      return {
        success:false,
        message:"Username or email already exists. Please use a different username or email" 
      };
    }
  },
};