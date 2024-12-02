import { getreturnstatusdata, getReturnSavedData } from '$lib/server/mongoLoads.js';
import { getreturnsOrderData, getcancelreturnData } from '$lib/server/mongoActions.js';

export const load = async ({ params }) => {
  const [returndata, returnstatus] = await Promise.all([
    getreturnstatusdata(params.invoiceid),
    getReturnSavedData(params.invoiceid)
  ]);
  

  return {
    returndata,
    returnstatus
  };
};

export const actions = {
  returns: async ({ request }) => {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    const result = await getreturnsOrderData({ body });
    return result;
  },

  cancelreturn: async ({ request }) => {
    const formData = await request.formData();
    const { id } = Object.fromEntries(formData);
    const result = await getcancelreturnData(id);
    return result;
  }
};
