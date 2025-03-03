import { getCart } from '$lib/server/mongoLoads.js'
import { createShareCart } from '$lib/server/mongoActions.js'

export const load = async ({params,locals}) => {
    try {
    const cartId = params.sharecart
    const userId = locals?.authedUser?.id || ""	 
    const cart =  await getCart("",cartId) || []
    return {cart}
    } catch (error) {
        console.log(error);
    }
    
}

export const actions = {
    sharecart:async({request,locals})=>{
        try {
            console.log('object');
            const userId = locals?.authedUser?.id || ""
            const userEmail = locals?.authedUser?.email || ""
            const {cartId} = Object.fromEntries(await request.formData())
		    return await createShareCart(userId,userEmail,cartId)
        } catch (error) {
            console.log(error);
        }
    }
}