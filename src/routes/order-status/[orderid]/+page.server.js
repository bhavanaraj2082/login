import { getOrderStatusData } from "$lib/server/mongoLoads.js";
import { CancelOrder } from "$lib/server/mongoActions.js";

export const load = async ({ params }) => {
  return await getOrderStatusData(params.orderid);
};

export const actions = {
  cancelOrder: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    const result = await CancelOrder(body);
    return result;
  },
};
