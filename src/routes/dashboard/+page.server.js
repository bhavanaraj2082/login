import { getUserProfileData, getProfileDetails } from '$lib/server/mongoLoads.js';

export const load = async ({ locals }) => {
  try {
    // Ensure we have a valid user
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
      authedUser: {
        id: locals.authedUser.id,
        email: locals.authedUser.email,
        username: locals.authedUser.username,
        firstname: profileData.profileData?.firstName || '',
        lastname: profileData.profileData?.lastName || '',
        phone: profileData.profileData?.cellPhone || ''
      },
      // profile: profileData.profileData,
      orders: userData.orders || [],
      // quotes: userData.quotes || [],
	    // favourites: userData.favourites || [],
      // cart: userData.cart || null,
    //   error: null
    };
  } catch (error) {
    console.error('Dashboard load error:', error);
    return {
      authedUser: null,
      error: 'Failed to load dashboard data'
    };
  }
};