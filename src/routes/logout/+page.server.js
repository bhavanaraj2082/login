import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies }) {
  try {

    let sessionIdToInvalidate = null;

    if (locals.authedUser) {

      sessionIdToInvalidate = locals.session?.sessionId;

      if (sessionIdToInvalidate) {
        await auth.invalidateSession(sessionIdToInvalidate);
        const authCookies = cookies.getAll();
        for (const cookie of authCookies) {
          if (cookie.name.startsWith('auth_')) {
            cookies.delete(cookie.name, { path: '/' });
            // console.log(`Deleted cookie: ${cookie.name}`);
          }
        }

        cookies.delete('auth_session', { path: '/' });
      }
    }

    locals.authedUser = undefined;
    locals.session = undefined;

    console.log('Redirecting to login page');
    throw redirect(302, '/login');
  } catch (err) {
    if (err.status === 302) {
      throw err;
    }
    // console.error('Error during logout:', err.message);
    throw redirect(302, '/login');
  }
}