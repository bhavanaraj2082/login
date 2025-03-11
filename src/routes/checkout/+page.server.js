import { checkoutOrder,updateBillingAddress,updateShippingAddress } from "$lib/server/mongoActions.js";
import { getProfileDetails,getCart } from "$lib/server/mongoLoads.js";

export const load = async ({depends,locals}) => {
    try {
       const userId = locals?.authedUser?.id || ""
       const result = await getProfileDetails(userId);
       const cart =  await getCart(userId)
       depends("data:checkout")
       return { cart,result}  
    } catch (error) {
      console.log('error',error);
        return { 
        error: 'Failed to load data'}
    }
  };


export const actions = {
    checkout:async({request,locals})=>{
        try {
            const userId = locals?.authedUser?.id || ""
            const body = Object.fromEntries(await request.formData())
            const parsedBody = JSON.parse(body.order)
            parsedBody.userId = userId
            //console.log(parsedBody);
            return await checkoutOrder(parsedBody)   
        } catch (error) {
            console.log(error.response.data);
            return { success:false,message:"Something went wrong in db"}
        }  
    },
    shippingaddress: async ({ request }) => {
      try {
        let body = Object.fromEntries(await request.formData());
        console.log(body);
        return await updateShippingAddress(body)  
      } catch (error) {
        console.log(error);
      }
  },
    billingaddress: async ({ request }) => {
      try {
        let body = Object.fromEntries(await request.formData());
        console.log(body);
        return await updateBillingAddress(body)
      } catch (error) {
        console.log(error);
      }
    }
}