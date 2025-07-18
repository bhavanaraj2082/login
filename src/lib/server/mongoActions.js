import { PUBLIC_SDS_URL } from "$env/static/public";


import Register from '$lib/server/models/Register.js';
import Profile from '$lib/server/models/Profile.js';

import User from '$lib/server/models/User.js'

import TokenVerification from '$lib/server/models/TokenVerification.js';

import { redirect, error } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { auth, authErrorMessages } from '$lib/server/lucia.js';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
// import { lucia } from 'lucia';
import { LuciaError } from 'lucia';
import {
	APP_URL,
	SENDER_EMAIL,
	SENDER_PASSWORD,
	WEBSITE_NAME,
	NOTIFICATION_TARGET_EMAIL,
	MAIL_HOST
} from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';

import { sendEmail } from '$lib/server/utils/sendEmail.js';






export async function login(body, cookies) {
	const { email, password } = body;

	const user = await Register.findOne({ email, password });

	if (user) {
		const profile = await Profile.findOne({ userId: user._id });
		console.log('profile', profile);
		if (profile) {
			cookies.set(
				'token',
				JSON.stringify({
					email: user.email,
					profileId: profile._id,
					userId: user._id
				}),
				{
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 * 1000 // 1 day
				}
			);

			const redirectUrl = cookies.get('redirectUrl');
			const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/dashboard/profile';
			if (redirectUrl) {
				cookies.delete('redirectUrl', { path: '/' });
			}
			// Redirect to the profile page
			return redirect(302, targetUrl);
		} else {
			return { success: false, message: 'Profile not found' };
		}
	} else {
		return {
			success: false,
			message: 'Failed to login, please check your email and password'
		};
	}
}



export const signUp = async (body, cookies) => {
	// console.log(body, "bodysignUp");
	const existingUser = await auth.getKey("email", body.email).catch(() => null);
	const existingUsernameKey = await auth.getKey('username', body.username).catch(() => null);
	// const existingPhoneKey = await auth
	//   .getKey("phone", body.phone)
	//   .catch(() => null);

	if (existingUser) {
		return {
			success: false,
			message: "This email already exists. Please login or try with another.",
		};
	}

	if (existingUsernameKey) {
		return {
			success: false,
			message: "This username already exists. Please login or try with another.",
		};
	}

	// if (existingPhoneKey) {
	//   return {
	// 	success: false,
	// 	message: "This phone already exists. Please login or try with another.",
	//   };
	// }

	const luciaUser = await auth.createUser({
		key: {
			providerId: "email",
			providerUserId: body.email,
			password: body.password,
		},
		attributes: {
			username: body.username,
			email: body.email,
			// phone: body.phone,
		},
	});

	// if (!existingPhoneKey) {
	//   await auth.createKey({
	// 	userId: luciaUser.userId,
	// 	providerId: "phone",
	// 	providerUserId: body.phone,
	// 	password: "Password123",
	//   });
	// }

	if (!existingUsernameKey) {
		await auth.createKey({
			userId: luciaUser.userId,
			providerId: "username",
			providerUserId: body.username,
			password: body.password,
		});
	}
	console.log(luciaUser, "luciaUser");

	const newProfile = new Profile({
		userId: luciaUser.userId,
		firstName: body.firstName,
		lastName: body.lastName,
		cellPhone: body.phone,
		companyname: body.companyname,
		companytype: body.companytype,
		jobTitle: body.jobTitle,
		email: body.email,
		isPhoneVerified: body.isPhoneVerified,
		isEmailVerified: body.isEmailVerified,
		gstNumber: body.gstNumber,
		tanNumber: body.tanNumber,
		country: body.country,
		currency: body.currency,
		sitePreferences: {
			productEntryType: "Manual Entry",
			noOfQuickOrderFields: 3,
			noOfOrdersPerPage: 3,
			noOfQuotesPerPage: 3
		}
	});

	const savedProfile = JSON.parse(JSON.stringify(await newProfile.save()));
	console.log(savedProfile, "savedProfile");

	const key = await auth.useKey("email", body.email, body.password);
	console.log("key.userId", key);

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
	console.log("Session created successfully");

	return {
		success: true,
		message: "Signup successful",
	};
};



const sendVerificationEmail = async (email, verificationUrl) => {
	const transporter = nodemailer.createTransport({
		service: 'partskeys',
		host: MAIL_HOST,
		port: 587,
		secure: false,
		auth: {
			user: SENDER_EMAIL,
			pass: SENDER_PASSWORD
		}
	});

	const mailOptions = {
		from: SENDER_EMAIL,
		to: email,
		subject: 'Email Verification for Your Account',
		html: `
		<html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
				<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
					<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
						Hi there,<br/><br/>
						Welcome to ${PUBLIC_WEBSITE_NAME}! Please verify your email address by clicking the button below.
					</p>
					<div style="text-align: center;">
						<a href="${APP_URL}/verify-email?token=${verificationUrl}" style="display: inline-block; background-color: #6c67f4; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
							Verify Email
						</a>
					</div>
					<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
						If you didn't sign up for this account, you can ignore this email.
					</p>
					<p style="font-size: 14px; color: #777777; text-align: center;">
						Thanks,<br/>
						The ${PUBLIC_WEBSITE_NAME} Team
					</p>
				</div>
			</body>
		</html>
		`
	};

	try {
		const result = await transporter.sendMail(mailOptions);
		console.log('Verification email sent: ', result);
		return true;
	} catch (error) {
		console.error('Error sending verification email:', error);
		return false;
	}
};

const sendVerificationEmailform = async (email, verificationUrl) => {
	const transporter = nodemailer.createTransport({
		service: "partskeys",
		host: MAIL_HOST,
		port: 587,
		secure: false,
		auth: {
			user: SENDER_EMAIL,
			pass: SENDER_PASSWORD,
		},
	});

	const mailOptions = {
		from: SENDER_EMAIL,
		to: email,
		subject: "Email Verification for Your Account",
		html: `
<html>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f2f2f2;">
	  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color: #f2f2f2; padding: 20px;">
		  <tr>
			  <td align="center">
				  <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 5px; overflow: hidden;">
					  <tr>
						  <td style="background-color: #fe5939; padding: 20px; text-align: center;">
							  <p style="display: block; margin: auto;color: white;font-size: 25px;font-weight: bold;">${PUBLIC_WEBSITE_NAME}</p>
						  </td>
					  </tr>
					  <tr>
						  <td style="padding: 30px; text-align: center;">
							  <h2 style="font-size: 22px; color: #333333; margin-bottom: 10px;">Verify your email address</h2>
							  <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
								  Thank you for connecting with ${PUBLIC_WEBSITE_NAME}. To verify the email address you provided, we have sent you a verification code. Please enter the code when prompted to proceed. If you did not request this verification, you may safely ignore this message.
							  </p>
							  <h4 style="font-size: 16px; color: #333333; font-weight: bold; margin-bottom: 5px;">Verification code</h4>
							  <p style="font-size: 32px; color: #333333; font-weight: bold; margin: 0;">${verificationUrl}</p>
							  <p style="font-size: 14px; color: #777777; margin-top: 10px;">(This code is valid for 5 minutes)</p>
						  </td>
					  </tr>
					  <tr>
						  <td style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #555555;">
							  ${PUBLIC_WEBSITE_NAME} will never email you and ask you to disclose your password, credit card, or banking account number.<br>
							  Visit our website: <a href="${APP_URL}" style="color: #0281ff; text-decoration: none; font-weight: normal;">${APP_URL}</a>
						  </td>
					  </tr>
				  </table>
			  </td>
		  </tr>
	  </table>
  </body>
</html> `,
	};

	try {
		const result = await transporter.sendMail(mailOptions);
		console.log("Verification email sent: ", result);
		return true;
	} catch (error) {
		console.error("Error sending verification email:", error);
		return false;
	}
};

export const sendemailOtp = async (email) => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	const emailSent = await sendVerificationEmailform(email, otp);
	console.log(otp, "OTP sent");

	if (!emailSent) {
		console.log("Failed to send email");
		return null;
	}

	const expiry = new Date(Date.now() + 5 * 60 * 1000);
	const existingRecord = await TokenVerification.findOne({ email });

	if (existingRecord) {
		existingRecord.token = otp;
		existingRecord.expiry = expiry;
		await existingRecord.save();
	} else {
		await TokenVerification.create({
			email,
			token: otp,
			verificationType: 'Non-Registered Users',
			expiry
		});
	}

	return otp;
};

export async function verifyemailOtp(email, enteredOtp) {
	try {
		const tokenVerificationRecord = await TokenVerification.findOne({ email, token: enteredOtp });
		console.log(tokenVerificationRecord, "tokenVerificationRecord");

		if (!tokenVerificationRecord) {
			console.log("Invalid OTP or email.");
			return { success: false, message: "The OTP entered is incorrect or has expired. Please try again." };
		}

		if (Date.now() >= tokenVerificationRecord.expiry.getTime()) {
			console.log("Token has expired.");
			return { success: false, message: "Token has expired. Please verify your email again." };
		}

		const profileRecord = await Profile.findOne({ email });

		if (profileRecord) {
			if (!profileRecord.isEmailVerified) {
				const profileUpdate = await Profile.updateOne(
					{ email },
					{ $set: { isEmailVerified: true } }
				);
				console.log(profileUpdate, "profileUpdate");

				if (profileUpdate.matchedCount === 0) {
					console.log("Failed to update the Profile record.");
					return { success: false, message: "Failed to update the Profile record." };
				}

				return { success: true, message: "Email verified successfully in Profile." };
			} else {
				return { success: true, message: "Email is already verified in Profile." };
			}
		} else {
			const tokenUpdate = await TokenVerification.updateOne(
				{ email, token: enteredOtp },
				{ $set: { isEmailVerified: true } }
			);
			console.log(tokenUpdate, "tokenUpdate");

			if (tokenUpdate.matchedCount === 0) {
				console.log("Failed to update the TokenVerification record.");
				return { success: false, message: "Failed to update the TokenVerification record." };
			}

			return { success: true, message: "Email verified successfully" };
		}
	} catch (error) {
		console.error("Error verifying OTP:", error);
		return { success: false, message: "An unexpected error occurred while verifying the OTP." };
	}
};

