import { checkoutOrder,getUpdatedCartData } from "$lib/server/mongoActions.js";

export const actions = {
    checkout:async({request})=>{
        try {
            const body = Object.fromEntries(await request.formData())
            const parsedBody = JSON.parse(body.order)
            console.log(parsedBody);
            return await checkoutOrder(parsedBody)   
        } catch (error) {
            console.log(error.response.data);
            return { success:false,message:"Something went wrong in db"}
        }  
    },
    updatedCart:async({request})=>{
        try {
        const {product} = Object.fromEntries(await request.formData())
        return await getUpdatedCartData(product)
        } catch (error) {
            console.log(error);
           // return { success:false,message:"Something went wrong"}
        }
       
    }
}