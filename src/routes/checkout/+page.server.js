import { checkoutOrder,updateBillingAddress,updateShippingAddress } from "$lib/server/mongoActions.js";
import { getProfileDetails,getCart } from "$lib/server/mongoLoads.js";
// import { authedUser } from "$lib/stores/mainStores.js";

// created authed user object to send userId
let authedUser={
    userId:"67af35cb27b8020af0d7aab7"
}

export const load = async ({depends}) => {
    try {
       const result = await getProfileDetails(authedUser.userId);
       const cart =  await getCart(authedUser.userId)
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
            const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
            const body = Object.fromEntries(await request.formData())
            const parsedBody = JSON.parse(body.order)
            parsedBody.userId = userId
            console.log(parsedBody);
            return await checkoutOrder(parsedBody)   
        } catch (error) {
            console.log(error.response.data);
            return { success:false,message:"Something went wrong in db"}
        }  
    },
    shippingaddress: async ({ request }) => {
      try {
        let body = Object.fromEntries(await request.formData());
        console.log(" in shipping", body);
        return await updateShippingAddress(body)  
      } catch (error) {
        console.log(error);
      }
  },
    billingaddress: async ({ request }) => {
      try {
        let body = Object.fromEntries(await request.formData());
         console.log("in billing", body);
        return await updateBillingAddress(body)
      } catch (error) {
        console.log(error);
      }
    }
}