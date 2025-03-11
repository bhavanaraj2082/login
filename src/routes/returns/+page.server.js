import { getReturnresultData } from "$lib/server/mongoActions.js";
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  returns: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    const result = await getReturnresultData(body); 

    if (result.redirectTo) {
      throw redirect(302, result.redirectTo);
    }
    if (!result || !result.orderFound) {
      return fail(400, { message: 'Order not found' });
    }
    return result;
  }
};
