// favourites redirection
import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia.js";
import { LuciaError } from "lucia";
import { authErrorMessages } from "$lib/server/lucia.js";
import Profile from "$lib/server/models/Profile.js";
import { sendEmailOTP, verifyOtp } from "$lib/server/emailOtpHandler.js";
export const actions = {
  login: async ({ request, cookies }) => {
    const redirectUrls = cookies.get("redirectUrl") || "/dashboard";
    const formData = Object.fromEntries(await request.formData());

    const input = formData.emailOrUsername?.trim();
    const password = formData.password;

    if (!input) {
      return fail(400, {
        success: false,
        errorMsg: "Please provide your registered email or username.",
      });
    }

    if (!password) {
      return fail(400, {
        success: false,
        errorMsg: "Please provide the password.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const keyType = emailRegex.test(input) ? "email" : "username";

    try {
      const key = await auth.useKey(keyType, input, password);
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
          authErrorMessages[error.message] || "Invalid credentials.";
        return fail(400, { success: false, errorMsg: errorMessage });
      } else {
        console.error("Unexpected error during login:", error);
        return fail(400, {
          success: false,
          errorMsg: "An unexpected error occurred.",
        });
      }
    }
    throw redirect(302, redirectUrls);
  },

  // login: async ({ request, cookies }) => {
  // 	const redirectUrls =
  // 		cookies.get('redirectUrl') || "/dashboard";
  // 	const formData = Object.fromEntries(await request.formData());
  // 	// console.log('formData', formData);

  // 	if (!formData.email) {
  // 	  return fail(400, {
  // 		success: false,
  // 		errorMsg: "Please provide your registered email address",
  // 	  });
  // 	}

  // 	if (!formData.password) {
  // 	  return fail(400, {
  // 		success: false,
  // 		errorMsg: "Please provide the password.",
  // 	  });
  // 	}

  // 	const { email, password } = formData;

  // 	try {
  // 	  const key = await auth.useKey("email", email, password);
  // 	  const user = await auth.getUser(key.userId);
  // 	  const session = await auth.createSession({
  // 		userId: user.userId,
  // 		attributes: {},
  // 	  });
  // 	  const sessionCookie = auth.createSessionCookie(session);
  // 	  cookies.set(
  // 		sessionCookie.name,
  // 		sessionCookie.value,
  // 		sessionCookie.attributes
  // 	  );
  // 	} catch (error) {
  // 	  if (error instanceof LuciaError) {
  // 		const errorMessage =
  // 		  authErrorMessages[error.message] || "An unknown error occurred.";
  // 		console.error(errorMessage);
  // 		return fail(400, { success: false, errorMsg: errorMessage });
  // 	  } else {
  // 		console.error("An unexpected error occurred:", error);
  // 		return fail(400, {
  // 		  success: false,
  // 		  errorMsg: "An unexpected error occurred:",
  // 		  error,
  // 		});
  // 	  }
  // 	}
  // 	// const redirectTo = "/dashboard";
  // 	throw redirect(302, redirectUrls);
  // },

  /************** Login with email OTP ***************/

  sendOtp: async ({ request }) => {
    try {
      const body = Object.fromEntries(await request.formData());
      const { email } = body;

      if (!email || typeof email !== "string" || email.trim().length === 0) {
        return fail(400, {
          error: "Invalid email",
          errorMsg: "Please provide a valid email to receive the OTP.",
        });
      }

      let user;
      try {
        const key = await auth.useKey("email", email, "Password123");
        user = await auth.getUserAttributes(key.userId);
      } catch (err) {
        if (err.message === "AUTH_INVALID_KEY_ID") {
          const existingKey = await auth
            .getKey("email", email)
            .catch(() => null);

          const name = email
            .trim()
            .split("@")[0]
            .replace(/[^a-zA-Z]/g, "");

          const formattedName =
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

          if (!existingKey) {
            const luciaUser = await auth.createUser({
              key: {
                providerId: "email",
                providerUserId: email,
                password: null,
              },
              attributes: { email, username: formattedName },
            });
            user = luciaUser;
            await new Profile({
              userId: luciaUser.userId,
              email,
              firstName: formattedName,
              needsPasswordSetup: true,
              sitePreferences: {
                productEntryType: "Manual Entry",
                noOfQuickOrderFields: 3,
                noOfOrdersPerPage: 3,
                noOfQuotesPerPage: 3,
              },
            }).save();
          } else {
            user = await auth.getUserAttributes(existingKey.userId);
          }
        } else if (err.message !== "AUTH_INVALID_PASSWORD") {
          return fail(500, {
            error: "Unexpected error",
            errorMsg: "An error occurred during authentication.",
          });
        }
      }

      await sendEmailOTP(email);
      return { success: true, errorMsg: "OTP has been sent to your email." };
    } catch (error) {
      return fail(500, {
        error: "Unexpected error",
        errorMsg: "Email could not be sent. Double-check your email address.",
      });
    }
  },

  verifyOtp: async ({ request, cookies }) => {
    const body = Object.fromEntries(await request.formData());
    const { email, enteredOtp } = body;
    if (!email) {
      console.log("Missing email");
      return fail(400, {
        error: "Missing email",
        errorMsg: "Email is required.",
      });
    }

    if (!enteredOtp) {
      console.log("Missing OTP");
      return fail(400, { error: "Missing OTP", errorMsg: "OTP is required." });
    }
    if (!verifyOtp(email, enteredOtp)) {
      console.log("OTP verification failed.");
      return fail(400, {
        error: "Invalid OTP",
        errorMsg: "Incorrect or expired OTP. Please try again.",
      });
    }
    await Profile.findOneAndUpdate(
      { email: email },
      { isEmailVerified: true },
      { new: true, upsert: false }
    );

    try {
      let user;
      try {
        const key = await auth.useKey("email", email);
        user = await auth.getUserAttributes(key.userId);
      } catch (error) {
        console.error("Authentication error:", error.message);

        if (error.message === "AUTH_INVALID_PASSWORD") {
          try {
            const existingKey = await auth.getKey("email", email);
            // await auth.updateKeyPassword('email', email, 'Password123');
            user = await auth.getUser(existingKey.userId);
            console.log(user, "**********");
            if (existingKey.passwordDefined) {
              await Profile.findOneAndUpdate(
                { email: email },
                { needsPasswordSetup: false },
                { new: true, upsert: false }
              );
            } else {
              await Profile.findOneAndUpdate(
                { email: email },
                { needsPasswordSetup: true },
                { new: true, upsert: false }
              );
            }
          } catch (err) {
            console.error("Error handling invalid password case:", err);
            return fail(500, {
              errorMsg: "Authentication failed. Please try again later",
            });
          }
        } else {
          return fail(500, {
            errorMsg: "Authentication failed. Please try again later",
          });
        }
      }

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

      const redirectUrls = cookies.get("redirectUrl") || "/dashboard";
      const redirectTo = redirectUrls;

      return { type: "success", redirectTo };
    } catch (error) {
      console.error("Unexpected error in verifyOtp:", error);
      return fail(500, {
        errorMsg: "An unexpected error occurred. Please try again later.",
      });
    }
  },
};
