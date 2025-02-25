import { getUserProfileData } from '$lib/server/mongoLoads.js';
import { getcancelreturn } from '$lib/server/mongoActions.js';

export const load = async ({ locals, parent }) => {
	await parent();
	// console.log("==+",locals)
	
	try {
		const userData = await getUserProfileData(locals.authedUser);
		// const userData = await getUserProfileData(authedUser);
		// console.log('======>>>>returns', userData);

		return userData;
	} catch (error) {
		return error.response;
	}
};

export const actions = {
cancelreturn: async ({ request }) => {
    const formData = await request.formData();
    const { id } = Object.fromEntries(formData);
    const result = await getcancelreturn(id);
    if (result.status === 200) {
      return {
        type: 'success',
        status: 200
      };
    } else {
      return {
        type: 'error',
        status: result.status,
        error: result.message
      };
    }
  }
}
