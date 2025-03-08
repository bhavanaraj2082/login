
import Cart from "$lib/server/models/Cart.js"
import { addNewRecurrenceDate,addRecurrenceReject,recurrenceCartActive } from "$lib/server/mongoActions.js"
import { getCart } from "$lib/server/mongoLoads.js"


export const load = async ({params}) => {
    try {
        const cartId = params.recurringId
        const cart = await getCart("",cartId)
        return {cart}
    } catch (error) {
        console.log(error);
    }
    
}

export const actions = {
    newRecurrenceDate:async({request,locals})=>{
        try {
            const userId = locals.authedUser.id || ""
            const body = Object.fromEntries(await request.formData())
            return await addNewRecurrenceDate(userId,body)
        } catch (error) {
            console.log(error);
            return {success:false,message:"Something went wrong"}
        }        
    },
    recurrenceReject:async({request,locals})=>{
        try {
            const userId = locals.authedUser.id || ""
            const body = Object.fromEntries(await request.formData())
            return await addRecurrenceReject(userId,body)
        } catch (error) {
            console.log(error);
            return {success:false,message:"Something went wrong"}
        }        
    },
    activeCart:async({request,locals})=>{
        try {
            const userId = locals.authedUser.id || ""
            const body = Object.fromEntries(await request.formData())
            return await recurrenceCartActive(userId,body)
        } catch (error) {
            console.log(error);
            return {success:false,message:"Something went wrong"}
        }        
    }
}