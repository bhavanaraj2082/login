import {authenticate} from "$lib/server/pocketbase"
import { getReturnresultData } from "$lib/server/actions.js";

const pb = await authenticate()

export const actions = {
  returns:async({request})=>{
    const body = Object.fromEntries(await request.formData()) 
      const result = await getReturnresultData(pb,body)   
      return result 
    }
}