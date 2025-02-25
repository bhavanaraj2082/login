import { getUserProfileData, getProfileDetails } from '$lib/server/mongoLoads.js';

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
      quotes: userData.quotes || []
    };
  } catch (error) {
    console.error('Dashboard load error:', error);
    return {
      authedUser: null,
      error: 'Failed to load dashboard data'
    };
  }
};