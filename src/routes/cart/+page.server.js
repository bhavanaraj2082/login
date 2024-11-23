import { authenticate } from "$lib/server/pocketbase.js";
import { checkoutOrder,getUpdatedCartData } from "$lib/server/actions.js";
const pb = await authenticate()

export const actions = {
    checkout:async({request})=>{
        try {
            const body = Object.fromEntries(await request.formData())
            const parsedBody = JSON.parse(body.order)
            console.log(parsedBody);
            return await checkoutOrder(pb,parsedBody)   
        } catch (error) {
            console.log(error.response.data);
            return { success:false,message:"Something went wrong"}
        }  
    },
    updatedCart:async({request})=>{
        try {
        const {product} = Object.fromEntries(await request.formData())
        return await getUpdatedCartData(pb,product)
        } catch (error) {
            console.log(error);
           // return { success:false,message:"Something went wrong"}
        }
       
    }
}