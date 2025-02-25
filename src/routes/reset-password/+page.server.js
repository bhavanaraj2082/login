
// import { passwordVerificationToken,userUpdatePassword } from '$lib/server/mongoActions.js';
// import { verifyPasswordToken } from '$lib/server/mongoLoads.js';

// export const load = async({url})=>{
//   const token = await url.searchParams.get('token')
//   if(token === null){
//     return {success:null}
//   }
//   return await verifyPasswordToken(token)
// }

// export const actions = {
//   resetpassword: async ({ request }) => {
//     const body = Object.fromEntries(await request.formData());
//     return await passwordVerificationToken(body,"Password");
//   },
//   updatePassword:async({request})=>{
//     const body = Object.fromEntries(await request.formData());
//     return await userUpdatePassword(body);
//   }
// };

import { passwordVerificationToken, ResetPassword } from '$lib/server/mongoActions.js';
import { verifyPasswordToken } from '$lib/server/mongoLoads.js';
import TokenVerification from '$lib/server/models/TokenVerification.js';

// export const load = async ({ url }) => {
// 	const token = url.searchParams.get('token');
// // console.log(token,"token")
// 	if (!token) {
// 		return {
// 			status: 400,
// 			body: { success: false, error: 'Token not found in the URL' }
// 		};
// 	} else {
// 		return { token };
// 		// return await verifyPasswordToken(token);
// 	}
// };





export const load = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {

		return { success: false, message: 'Token not found in the URL' };
	}

	const tokenRecord = await TokenVerification.findOne({ token });

	if (!tokenRecord) {

		return { success: false, message: 'Invalid or expired token' };
	}

	const currentTime = new Date();
	if (currentTime > tokenRecord.expiry) {
		await TokenVerification.deleteOne({ token });

		return { success: false, message: 'Token has expired' };
	}

	if (tokenRecord.used) {

		return { success: false, message: 'Token has already been used' };
	}

	return {
		success: true,
		token
	};
};




// export const actions = {
// 	passwordreset: async ({ request, locals }) => {
// 		const body = Object.fromEntries(await request.formData());
// 		// console.log('----body--', body);
// 		try {
// 			const response = await resetpassword(locals.pb, body);
// 			return response;
// 		} catch (error) {
// 			return {
// 				status: 400,
// 				body: { success: false, error: error.message }
// 			};
// 		}
// 	}
// };

export const actions = {
	resetpassword: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
		return await passwordVerificationToken(body, 'Password');
	},
	updatePassword: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
		// console.log("updatePassword body",body);

		// body.userId = "";
		return await ResetPassword(body);
	}
};
