
import { passwordVerificationToken,userUpdatePassword } from '$lib/server/mongoActions.js';
import { verifyPasswordToken } from '$lib/server/mongoLoads.js';

export const load = async({url})=>{
  const token = await url.searchParams.get('token')
  if(token === null){
    return {success:null}
  }
  return await verifyPasswordToken(token)
}

export const actions = {
  resetpassword: async ({ request }) => {
    const body = Object.fromEntries(await request.formData());
    return await passwordVerificationToken(body,"Password");
  },
  updatePassword:async({request})=>{
    const body = Object.fromEntries(await request.formData());
    return await userUpdatePassword(body);
  }
};
