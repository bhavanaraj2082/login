import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia.js";
import { LuciaError } from "lucia";
import { authErrorMessages } from "$lib/server/lucia.js";
import Profile from '$lib/server/models/Profile.js';
import { sendEmailOTP, verifyOtp } from '$lib/server/emailOtpHandler.js';
export const actions = {
  login: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    // console.log('formData', formData);

    if (!formData.email) {
      return fail(400, {
        success: false,
        errorMsg: "Please provide your registered email address",
      });
    }

    if (!formData.password) {
      return fail(400, {
        success: false,
        errorMsg: "Please provide the password.",
      });
    }

    const { email, password } = formData;

    try {
      const key = await auth.useKey("email", email, password);
      const user = await auth.getUser(key.userId);
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);
      cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    } catch (error) {
      if (error instanceof LuciaError) {
        const errorMessage =
          authErrorMessages[error.message] || "An unknown error occurred.";
        console.error(errorMessage);
        return fail(400, { success: false, errorMsg: errorMessage });
      } else {
        console.error("An unexpected error occurred:", error);
        return fail(400, {
          success: false,
          errorMsg: "An unexpected error occurred:",
          error,
        });
      }
    }
    const redirectTo = "/dashboard/profile";
    throw redirect(302, redirectTo);
  },

  	/************** Login with email OTP ***************/

	sendOtp: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const { email } = body;

			if (!email || typeof email !== 'string' || email.trim().length === 0) {
				return fail(400, {
					error: 'Invalid email',
					errorMsg: 'Please provide a valid email to receive the OTP.'
				});
			}

			let user;
			try {
				const key = await auth.useKey('email', email, 'Password123');
				user = await auth.getUserAttributes(key.userId);
			} catch (err) {
				if (err.message === 'AUTH_INVALID_KEY_ID') {
					const existingKey = await auth.getKey('email', email).catch(() => null);
					if (!existingKey) {
						const luciaUser = await auth.createUser({
							key: { providerId: 'email', providerUserId: email, password: 'Password123' },
							attributes: { email, username: `${email.split('@')[0]}` }
						});
						user = luciaUser;
						await new Profile({ userId: luciaUser.userId, email }).save();
					} else {
						user = await auth.getUserAttributes(existingKey.userId);
					}
				} else if (err.message !== 'AUTH_INVALID_PASSWORD') {
					return fail(500, {
						error: 'Unexpected error',
						errorMsg: 'An error occurred during authentication.'
					});
				}
			}

			await sendEmailOTP(email);
			return { success: true, errorMsg: 'OTP has been sent to your email.' };
		} catch (error) {
			return fail(500, {
				error: 'Unexpected error',
				errorMsg: 'Email could not be sent. Double-check your email address.'
			});
		}
	},

	verifyOtp: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());
		const { email, enteredOtp } = body;

		console.log(body, 'body verifyOtp');

		// Check if email and OTP are provided
		if (!email) {
			console.log('Missing email');
			return fail(400, { error: 'Missing email', errorMsg: 'Email is required.' });
		}

		if (!enteredOtp) {
			console.log('Missing OTP');
			return fail(400, { error: 'Missing OTP', errorMsg: 'OTP is required.' });
		}

		console.log('Checking OTP for email:', email, 'Entered OTP:', enteredOtp);
		if (!verifyOtp(email, enteredOtp)) {
			console.log('OTP verification failed.');
			return fail(400, {
				error: 'Invalid OTP',
				errorMsg: 'Incorrect or expired OTP. Please try again.'
			});
		}
		console.log('OTP verification successful.');

		try {
			let user;
			try {
				const key = await auth.useKey('email', email);
				console.log('Authentication successful, key:', key);

				user = await auth.getUserAttributes(key.userId);
				console.log('Fetched user attributes:', user);
			} catch (error) {
				console.error('Authentication error:', error.message);

				if (error.message === 'AUTH_INVALID_PASSWORD') {
					try {
						const existingKey = await auth.getKey('email', email);
						console.log('Existing key found:', existingKey);

						await auth.updateKeyPassword('email', email, 'Password123');
						console.log('Password updated successfully.');

						user = await auth.getUser(existingKey.userId);
						console.log('Fetched user after password update:', user);
					} catch (err) {
						console.error('Error handling invalid password case:', err);
						return fail(500, { errorMsg: 'Failed to update password. Please try again later.' });
					}
				} else {
					return fail(500, { errorMsg: 'Authentication failed. Please try again later.' });
				}
			}

			console.log('Creating session for user:', user?.userId);
			const session = await auth.createSession({ userId: user.userId, attributes: {} });
			console.log('Session created:', session);

			const sessionCookie = auth.createSessionCookie(session);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

			const redirectTo = '/dashborad/profile';
			console.log('Redirecting user to:', redirectTo);

			return { type: 'success', redirectTo };
		} catch (error) {
			console.error('Unexpected error in verifyOtp:', error);
			return fail(500, { errorMsg: 'An unexpected error occurred. Please try again later.' });
		}
	}
};