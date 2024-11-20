
import { authenticate } from '$lib/server/pocketbase.js';  

const pb = await authenticate()

export const load = async ({url}) => {
    try {
    const token = await url.searchParams.get('token')
   const record =  await pb.collection("Register").confirmVerification(`${token}`)
   console.log(record);
    return {success:true,message:" Your email is verified successfully"}
    } catch (error) {
    return {success:false,message:"Email verification is failed try again with a valid email"}
    }
}

