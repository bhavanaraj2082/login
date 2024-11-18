import {authenticate} from "$lib/server/pocketbase.js"
import { getreturnstatusdata, getReturnSavedData } from "$lib/server/loads.js"
import { getreturnsOrderData, getcancelreturnData } from "$lib/server/actions.js";


const pb = await authenticate()
export const load = async({params})=>{

    const returndata = await getreturnstatusdata(pb,params.invoiceid)
    const returnstatus = await getReturnSavedData(pb)
    return{returndata,returnstatus}
}

export const actions = {
    returns:async({request})=>{        
      const body = Object.fromEntries(await request.formData()) 
        const pb = await authenticate()
        const result = await getreturnsOrderData({pb,body})
        return result 
      },
      cancelreturn: async ({ request }) => {
        const body = Object.fromEntries(await request.formData());
        const { id } = body; 
        const result = await getcancelreturnData({pb,id});
        return result;
      }
  }