import {authenticate} from "$lib/server/pocketbase";
import { getorderstatusdata } from "$lib/server/loads";
import { CancelOrder } from "$lib/server/actions";

const pb = await authenticate();

export const load = async({params})=>{
    return await getorderstatusdata(pb,params.orderid)
}

export const actions = {
	cancelOrder: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
        const result = await CancelOrder(pb,body)
		return result;
	}
};
