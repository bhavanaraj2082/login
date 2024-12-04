import {getUpdatedCartData } from "$lib/server/mongoActions.js";

export const actions = {
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