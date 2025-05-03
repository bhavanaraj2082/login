import { getUserProfileData, getProfileDetails } from '$lib/server/mongoLoads.js';
import { getcancelreturn } from '$lib/server/mongoActions.js';

export const load = async ({ locals }) => {
  try {
    if (!locals.authedUser?.id) {
      return {
        authedUser: null,
        error: 'Not authenticated'
      };
    }

    const profileData = await getProfileDetails(locals.authedUser.id);
    
    
    if (!profileData.success && !profileData.profileData) {
      return {
        authedUser: {
          id: locals.authedUser.id,
          email: locals.authedUser.email,
          username: locals.authedUser.username
        },
        error: 'Profile not found'
      };
    }

    const userData = await getUserProfileData(locals.authedUser.id);
    return {
      returns: userData.returnsData || []
    };
  } catch (error) {
    console.error('Dashboard load error:', error);
    return {
      authedUser: null,
      error: 'Failed to load dashboard data'
    };
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
