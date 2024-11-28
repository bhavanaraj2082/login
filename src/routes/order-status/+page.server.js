import { getOrderresultData } from "$lib/server/mongoActions";
export const actions = {
  orderStatus:async({request})=>{
    const body = Object.fromEntries(await request.formData()) 
      const result = await getOrderresultData(body)
      return result 
    }
}