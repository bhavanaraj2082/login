import { redirect } from '@sveltejs/kit';
import Profile from '$lib/server/models/Profile.js';
export const load = async ({ url, cookies, locals, depends }) => {
  try {
    if (url.pathname === '/logout') {
      cookies.delete('token', { path: '/' });
      redirect(302, '/signin');
    }
    depends("data:load");
    let authedUser = {};
    if (locals.authedUser && locals.authedUser?.username) {
      authedUser = locals.authedUser;
    }
    if (authedUser.id) {
      const userProfile = await Profile.findOne({ userId: authedUser.id });
      // console.log(userProfile, "userProfile");
      if (!userProfile) {
        // console.log('User profile not found');
        return { authedUser: null, error: 'Profile not found' };
      }
      const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));
      // console.log(finalResult, "finalResult");
      return {
        authedUser,
        profile: finalResult.profile,
      };
    }
    return {
      authedUser: null,
      error: 'Not authenticated',
    };
  } catch (error) {
    // console.log(error);
    return {
      authedUser: null,
      error: 'Failed to load data',
    };
  }
};