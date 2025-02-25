import { redirect } from "@sveltejs/kit";
import { loginWithLinkedIn } from "$lib/server/mongoActions.js";
import {
  VITE_LINKEDIN_CLIENT_ID,
  VITE_LINKEDIN_CLIENT_SECRET,
  VITE_LINKEDIN_CALLBACK_URL,
} from "$env/static/private";

export const load = async ({ url, cookies }) => {
  const code = url.searchParams.get("code");
  // console.log(code, "******linkedin token");
  // try {
  if (code) {
    // Step 1: Exchange authorization code for access token
    const accessTokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: VITE_LINKEDIN_CALLBACK_URL,
          client_id: VITE_LINKEDIN_CLIENT_ID,
          client_secret: VITE_LINKEDIN_CLIENT_SECRET,
        }),
      }
    );

    const accessTokenData = await accessTokenResponse.json();

    if (accessTokenData.error) {
      // Handle error (e.g., unauthorized scope or invalid code)
      throw new Error(accessTokenData.error_description);
    }

    const { access_token } = accessTokenData;

    // Step 2: Fetch user details using the 'userinfo' endpoint
    const userInfoResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (userInfoResponse.status === 403) {
      throw new Error(
        "Permission denied. Please check your app permissions and OAuth scopes."
      );
    }

    const userData = await userInfoResponse.json();
    // console.log('User data from userinfo endpoint:', userData);

    // Step 3: Extract necessary data from the response
    const {
      given_name,
      family_name,
      email,
      picture,
      email_verified,
      locale,
      name,
    } = userData;

    // Combine user data into a user object
    const user = {
      firstname: given_name,
      lastname: family_name,
      username: name,
      email,
      profilePicture: picture,
      isEmailVerified: email_verified,
      country: locale?.country,
    };

    // console.log(user);

    // Step 4: Save user data to MongoDB
    await loginWithLinkedIn(user, cookies);

    // Step 5: Redirect the user to their dashboard
    const redirectTo =
      cookies.get("redirectUrl") ||
      cookies.get("targetUrl") ||
      cookies.get("cartUrl") ||
      "/dashboard";
    throw redirect(302, redirectTo);
  }
  // } catch(e) {
  //     console.log("error in server:",e);
  //     throw new Error('Authorization code not found');
  //   }
};
    