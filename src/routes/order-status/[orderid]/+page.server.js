import { getOrderStatusData } from "$lib/server/mongoLoads.js";
import { CancelOrder } from "$lib/server/mongoActions.js";

export const load = async ({ params,url }) => {
  let Email = url.searchParams.get('email');
  return await getOrderStatusData(params.orderid, Email);
};

export const actions = {
  cancelOrder: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    const result = await CancelOrder(body);
    return result;
  },
};
