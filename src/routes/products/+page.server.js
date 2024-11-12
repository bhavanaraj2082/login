import {authenticate} from "$lib/server/pocketbase"
import { getProductdatas } from "$lib/server/loads"

export const load = async()=>{
    const pb = await authenticate();
    const data = await getProductdatas(pb);
    return data;
}
