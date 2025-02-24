import {
    getUpdatedCartData,
    updateItemQty,
    deleteAllFromCart,
    deleteOneFromCart,
    getGuestCart,
    addItemsToExistingCart,
    addItemsToNewCart,
    addRecurrence,
    deleteRecurrence
} from "$lib/server/mongoActions.js";
import { getCart } from "$lib/server/mongoLoads.js";

export const load = async({locals,depends})=>{
    const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
    depends("data:cart")
    return await getCart(userId)
}

export const actions = {
    updatedCart:async({request})=>{
        try {
        const {product} = Object.fromEntries(await request.formData())
        return await getUpdatedCartData(product)
        } catch (error) {
            console.log(error);
           // return { success:false,message:"Something went wrong"}
        } 
    },
    updateQty:async({request,locals})=>{
        try {
           const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
           const body = Object.fromEntries(await request.formData())
           return await updateItemQty(body,userId)
        } catch (error) {
           return { success:false,message:"Something went wrong"} 
        }
    },
    deleteOne:async({request,locals})=>{
        try {
            const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
            const body = Object.fromEntries(await request.formData())
            return await deleteOneFromCart(body,userId)
        } catch (error) {
           return { success:false,message:"Something went wrong"} 
        }
    },
    deleteAll:async({request,locals})=>{
        try {
            const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
            const body = Object.fromEntries(await request.formData())
            return await deleteAllFromCart(body,userId)
        } catch (error) {
           return { success:false,message:"Something went wrong"} 
        }
    },
    guestCart:async({request})=>{
		try {
		const body = Object.fromEntries(await request.formData());
		// console.log("getiing cart got guest in cart server",body);
		
		const parsedBody = JSON.parse(body.guestCart);
		return await getGuestCart(parsedBody);
		} catch (error) {
			console.log(error);
		}
	},
    existingcart:async({request})=>{
		try {
		const body = Object.fromEntries(await request.formData());
		const parsedBody = JSON.parse(body.guestCart);
		console.log(parsedBody);
		return await addItemsToExistingCart(parsedBody,body.cartId)
		} catch (error) {
			console.log(error);
			return {message:"something went wrong"}
		}
	},
	newcart:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
			const userEmail = locals?.authedUser?.email || "yusuf@partskeys.com"
			const body = Object.fromEntries(await request.formData());
			const parsedBody = JSON.parse(body.guestCart);
			return await addItemsToNewCart(parsedBody,userId,userEmail)
		} catch (error) {
			console.log(error);
		}			
	},
    recurrence:async({request,locals})=>{
		try {
			const userId = locals?.authedUser?.id || "67af35cb27b8020af0d7aab7"
			const userEmail = locals?.authedUser?.email || "yusuf@partskeys.com"
			const body = Object.fromEntries(await request.formData());
		    const parsedBody = JSON.parse(body.dates);
			return await addRecurrence(parsedBody,userId,userEmail)
		} catch (error) {
			console.log(error);
		}			
	},
    deleteRecurring:async({request,locals})=>{
		try {
			const body = Object.fromEntries(await request.formData());
			const parsedBody = JSON.parse(body.dates);
			return await deleteRecurrence(parsedBody)
		} catch (error) {
			console.log(error);
		}
	}
    
}