// import { checkoutOrder } from "$lib/server/mongoActions.js";
import { getProfileDetails } from "$lib/server/mongoLoads.js";
// import { authedUser } from "$lib/stores/mainStores.js";

// created authed user object to send userId
let authedUser={
    userId:"53yg6yyw63yhw7tbg3twb"
}

export const load = async () => {
    try {
       const result= await getProfileDetails(authedUser.userId);
       return result  
    } catch (error) {
      console.log('error',error);
        return { 
        error: 'Failed to load data'}
    }
  };




// export const actions = {
//     checkout:async({request})=>{
//         try {
//             const body = Object.fromEntries(await request.formData())
//             const parsedBody = JSON.parse(body.order)
//             console.log(parsedBody);
//             // return await checkoutOrder(parsedBody)   
//         } catch (error) {
//             console.log(error.response.data);
//             return { success:false,message:"Something went wrong in db"}
//         }  
//     },
// }