import { verifyEmailToken } from '$lib/server/mongoLoads.js';


export const load = async ({url}) => {
    try {
        const token = await url.searchParams.get('token')
        //console.log(token);
        return await verifyEmailToken(token)
    } catch (error) {
        return {success:false,message:"Email verification is failed try again with a valid email"}
    }
}

