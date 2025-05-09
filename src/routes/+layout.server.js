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

      if (!userProfile) {
        return { authedUser: null, error: 'Profile not found' };
      }

      authedUser = {
        ...authedUser,
        firstname: userProfile.firstName || '',
        phone: userProfile.cellPhone || '',
      };

      const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));

      return {
        authedUser,
        firstname: userProfile.firstName || '',
        phone: userProfile.cellPhone || '',
        profile: finalResult.profile,
      };
    }

    return {
      authedUser: null,
      error: 'Not authenticated',
    };
  } catch (error) {
    return {
      authedUser: null,
      error: 'Failed to load data',
    };
  }
};
