import {authenticate} from "$lib/server/pocketbase"
import { getOrderresultData } from "$lib/server/actions";
const pb = await authenticate();
export const actions = {
  orderStatus:async({request})=>{
    const body = Object.fromEntries(await request.formData()) 
      const result = await getOrderresultData(pb,body)
      return result 
    }
}