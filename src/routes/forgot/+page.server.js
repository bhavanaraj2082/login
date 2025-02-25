// import { auth } from '$lib/server/lucia.js';

// export async function load({ locals }) {
// 	try {
// 		if (locals.authedUser) {
// 			const sessionId = locals.session?.sessionId;
// 			if (sessionId) {
// 				await auth.invalidateSession(sessionId);
// 			}
// 		}

// 		locals.authedUser = undefined;
// 	} catch (err) {
// 		console.error('Error during logout:', err.message);
// 	}
// 	return;
// }


import { auth } from '$lib/server/lucia.js';

export async function load({ locals }) {
  try {
    console.log('Load function started');
    
    if (locals.authedUser) {
      console.log('User is authenticated:', locals.authedUser);
      
      const sessionId = locals.session?.sessionId;
      console.log('Session ID:', sessionId);

      if (sessionId) {
        await auth.invalidateSession(sessionId);
        console.log('Session invalidated');
      } else {
        console.log('No session ID found');
      }
    } else {
      console.log('No authenticated user found');
    }

    locals.authedUser = undefined;
    console.log('Authed user set to undefined:', locals.authedUser);
  } catch (err) {
    console.error('Error during logout:', err.message);
  }

  console.log('Returning from load function');
  return;
}
