// import { auth } from '$lib/server';
// const adapter = new MongodbAdapter(Session.collection, User.collection);

// // Export helper functions to manage users
// export const signIn = async (username, password) => {
// 	try {
// 		const { user } = await auth.validateUser({ identifier: username, password });
// 		return { user };
// 	} catch (error) {
// 		return { error: 'Invalid credentials' };
// 	}
// };

// export const signOut = async (sessionId) => {
// 	try {
// 		await auth.invalidateSession(sessionId);
// 	} catch (error) {
// 		console.error('Error logging out:', error);
// 	}
// };

// // Lucia authentication configuration
// export const auth = Lucia({
// 	adapter: adapter,
// 	env: 'PROD',
// 	secret: LUCIA_SECRET
// });
import { lucia } from 'lucia';
import { mongoose as mongooseAdapter } from '@lucia-auth/adapter-mongoose';
//import mongoose from 'mongoose';
import { User } from '$lib/server/models/User.js'; // Your User schema
import { Session } from '$lib/server/models/Session.js'; // Your Session schema
import { Key } from '$lib/server/models/Key.js';
import { LUCIA_SECRET } from '$env/static/private';

export const authErrorMessages = {
	AUTH_INVALID_KEY_ID: 'The provided key Email/Username is invalid.',
	AUTH_INVALID_KEY: 'The authentication Email/Username is invalid.',
	AUTH_INVALID_PASSWORD: 'The password is incorrect.',
	AUTH_DUPLICATE_KEY_ID: 'This username already exists.',
	AUTH_EXPIRED_SESSION: 'The session has expired. Please log in again.',
	AUTH_INVALID_SESSION_ID: 'The session ID is invalid.',
	AUTH_NOT_AUTHENTICATED: 'You are not authenticated. Please log in.',
	AUTH_INVALID_USER_ID: 'The provided user ID is invalid.',
	AUTH_INVALID_PROVIDER_ID: 'The provider ID is invalid.',
	AUTH_DUPLICATE_USER_ID: 'A user with this ID already exists.',
	AUTH_PROVIDER_NOT_SUPPORTED: 'The authentication provider is not supported.',
	AUTH_TOKEN_INVALID: 'The provided token is invalid.',
	AUTH_TOKEN_EXPIRED: 'The token has expired.',
	AUTH_MISSING_KEY_ID: 'Key ID is missing from the request.',
	AUTH_MISSING_PASSWORD: 'Password is missing from the request.',
	AUTH_MISSING_USER_ID: 'User ID is missing from the request.',
	AUTH_UNSUPPORTED_OPERATION: 'This operation is not supported.',
	AUTH_INVALID_INPUT: 'The input provided is invalid.',
	AUTH_INVALID_METADATA: 'The metadata is invalid.'
};

// Configure Lucia authentication
export const auth = lucia({
	adapter: mongooseAdapter({ User, Key, Session }), // Pass the required models
	env: 'PROD', // Change to 'DEV' if in development
	secret: LUCIA_SECRET,
	cookies: {
		secure: true // Use `false` for local development with HTTP
	},
	transformUser: (user) => ({
		id: user.id.toString(),
		username: user.username,
		email: user.email
	}),
	getUserAttributes: (databaseUser) => {
		return {
			username: databaseUser.username,
			email: databaseUser.email
		};
	}
});

export default auth;
