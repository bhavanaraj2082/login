import { login } from '$lib/server/mongoActions.js';

export const actions = {
  login: async ({ request,cookies }) => {
      const body = Object.fromEntries(await request.formData());
      //console.log("form entries data:", data)
      return await login(body,cookies); 
  }
};