import { login } from '$lib/server/actions.js';
import {authenticate } from '$lib/server/pocketbase.js';

const pb = await authenticate();

export const actions = {
  login: async ({ request,cookies }) => {
      const body = Object.fromEntries(await request.formData());
      //console.log("form entries data:", data)
      return await login(pb,body,cookies); 
  }
};