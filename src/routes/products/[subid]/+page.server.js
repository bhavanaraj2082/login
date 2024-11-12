import {authenticate} from "$lib/server/pocketbase"
import { getSubCategoryDatas } from "$lib/server/loads"

export const load = async({params}) =>{

    const pb = await authenticate();
    const data = await getSubCategoryDatas(pb,params.subid);
    return data;

}
