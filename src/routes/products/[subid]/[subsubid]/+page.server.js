import {authenticate} from "$lib/server/pocketbase"
import { getSubSubCategoryDatas } from "$lib/server/loads"

export const load = async({params}) =>{

    const pb = await authenticate();
    const data = await getSubSubCategoryDatas(pb,params.subsubid);
    return data;

}
