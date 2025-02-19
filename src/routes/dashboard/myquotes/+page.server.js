import { getUserProfileData } from '$lib/server/mongoLoads.js';

export const load = async ({ locals, parent }) => {
	await parent();
	// console.log("==+",locals)
	
	try {
		const userData = await getUserProfileData(locals.authedUser);
		// const userData = await getUserProfileData(authedUser);
		// console.log('orders====>', userData);

		return userData;
	} catch (error) {
		return error.response;
	}
};
