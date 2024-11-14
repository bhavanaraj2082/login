import {authenticate} from "$lib/server/pocketbase"
import { getorderstatusdata } from "$lib/server/loads"

export const load = async({params})=>{
    const pb = await authenticate()
    return await getorderstatusdata(pb,params.orderid)
}

