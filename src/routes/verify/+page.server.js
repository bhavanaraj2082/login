
import { authenticate } from '$lib/server/pocketbase.js';  

const pb = await authenticate()

export const load = async ({url,cookies}) => {
    try {
        const token = await url.searchParams.get('token')
        const record =  await pb.collection("Register").confirmVerification(`${token}`)
        console.log(record);
        return {success:true,message:" Your email is verified successfully"}
    } catch (error) {
        const user = JSON.parse(cookies.get('token'))
        await pb.collection("Register").delete(`${user.userId}`)
        await pb.collection("ChemiDashProfile").delete(`${user.profileId}`)
        cookies.delete('token',{path:'/'})
        return {success:false,message:"Email verification is failed try again with a valid email"}
    }
}

