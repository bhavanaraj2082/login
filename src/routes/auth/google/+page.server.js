import { redirect } from "@sveltejs/kit";
import {
  VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_CLIENT_SECRET,
  VITE_GOOGLE_CALLBACK_URL,
} from "$env/static/private";

import { loginWithGoogle } from "$lib/server/mongoActions"; 

export const load = async ({ url, cookies }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    throw new Error("Missing authorization code");
  }

  // Step 1: Exchange code for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: VITE_GOOGLE_CLIENT_ID,
      client_secret: VITE_GOOGLE_CLIENT_SECRET,
      redirect_uri: VITE_GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  const access_token = tokenData?.access_token;

  if (!access_token) {
    throw new Error("Failed to get access token from Google");
  }

  // Step 2: Get user profile
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const profile = await profileRes.json();
  const {
    email,
    email_verified,
    name,
    given_name,
    family_name,
    picture,
    locale,
    sub,
  } = profile;

  const user = {
    firstname: given_name,
    lastname: family_name,
    username: name,
    email,
    profilePicture: picture,
    isEmailVerified: email_verified,
    country: locale,
    googleId: sub,
  };

  console.log("Google OAuth: Final user object =>", user);

  // Step 3: Store user in DB and set auth cookie
  await loginWithGoogle(user, cookies);

  // Step 4: Redirect to app/dashboard
  const redirectTo =
    cookies.get("redirectUrl") ||
    cookies.get("targetUrl") ||
    cookies.get("cartUrl") ||
    "/dashboard";

  console.log("Google OAuth: Redirecting to =>", redirectTo);
  throw redirect(302, redirectTo);
};
