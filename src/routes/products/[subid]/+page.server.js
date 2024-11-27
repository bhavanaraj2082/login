import { getSubCategoryDatas } from "$lib/server/mongoLoads.js"

export const load = async({params}) =>{

    const data = await getSubCategoryDatas(params.subid);
    return data;

}
