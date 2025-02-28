
import { getSearchData } from '$lib/server/mongoLoads.js'
import { saveMailId } from '$lib/server/mongoActions.js';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';

// export const load = async ({url,locals}) => {
//   try {
//     const search = url.searchParams.get('query')
//     const result= await getSearchData(search);
//     return {result}
//   } catch (error) {
//     console.log(error)
//     return {message:error.response.message}
//   } 
// }


export const load = async ({ url, locals }) => {
	try {
		const search = url.searchParams.get('query');

		const result = await getSearchData(search);
		const userId = locals?.authedUser?.id;

		if (userId) {
			try {
				// console.log('userId:', userId);
				const userProfile = await Profile.findOne({ userId });

				if (userProfile) {
					return {
						result,
						userProfile: {
							firstname: userProfile.firstname,
							email: userProfile.email,
							isEmailVerified: userProfile.isEmailVerified,
							isPhoneVerified: userProfile.isPhoneVerified,
							userId: userProfile.userId,
						}
					};
				} else {
					console.log('No profile found for userId:', userId);
				}
			} catch (profileError) {
				console.error('Error fetching user profile:', profileError);
			}
		} else {
			console.log('No userId found in locals, skipping profile fetch.');
		}
		return { result };
	} catch (error) {
		console.error('Error in load function:', error);
		return {
			message: error.response?.message || 'An error occurred while processing your request',
			status: error.response?.status || 500
		};
	}
};


export const actions = {
	// noresults:async({request})=>{
	// 	const body = Object.fromEntries(await request.formData());
	// 	console.log(body,"***********************");

	// 	const result = await saveMailId(body);
	// 	return  result ;
	// },
	noresults: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
		// console.log(body, "***********************");

		const userEmail = body.email;
		const query = body.query;
		async function getClientIP() {
			const response = await fetch('https://api.ipify.org?format=json');
			const data = await response.json();
			return data.ip;
		}

		const ipAddress = await getClientIP();
		let targetEmailContent = `
		  <html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
			  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
				<div style="background-color: #FF6A00; color: #ffffff; padding: 20px; text-align: center;">
				  <h2 style="margin: 0; font-size: 22px;">New Query Received - ${PUBLIC_WEBSITE_NAME}</h2>
				</div>
				<div style="padding: 20px;">
				  <p style="font-size: 16px; color: #333333;">Dear Team,</p>
				  <p style="font-size: 16px; color: #555555; line-height: 1.5;">
					A new query has been received on ${PUBLIC_WEBSITE_NAME}. Below are the details provided by the user:
				  </p>
				  <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin-top: 15px;">
				
					<p><strong>Query:</strong> ${query}</p>
						<p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>

					<p><strong>IP Address:</strong> ${ipAddress}</p>
				  </div>
				  <p style="font-size: 16px; color: #555555; margin-top: 20px;">
					Please review the inquiry and respond as necessary.
				  </p>
				  <p style="font-size: 16px; color: #555555; margin-top: 20px;">
					Thank you for your attention to this matter.
				  </p>
				</div>
				<div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
				  <p style="font-size: 14px; color: #777777; margin: 0;">Best regards,</p>
				  <p style="font-size: 14px; color: #777777; margin: 0;">The ${PUBLIC_WEBSITE_NAME} Team</p>
				  <p style="font-size: 14px; color: #777777; margin: 0; margin-top: 10px;">
					For more information, visit: <a href="${APP_URL}" style="color: #0073e6; text-decoration: none;">${APP_URL}</a>
				  </p>
				</div>
			  </div>
			</body>
		  </html>
		`;

		try {
			const emailSent = await sendNotificationEmail(
				`New Query Received - ${PUBLIC_WEBSITE_NAME}`,
				targetEmailContent
			);

		} catch (error) {

		}
		let userEmailContent = `
		  <html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
			  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
				<div style="background-color: #FF6A00; color: #ffffff; padding: 20px; text-align: center;">
				  <h2 style="margin: 0; font-size: 22px;">Thank You for Your Inquiry ${PUBLIC_WEBSITE_NAME}</h2>
				</div>
				<div style="padding: 20px;">
				  <p style="font-size: 16px; color: #333333;">Dear ${body.name || 'Customer'},</p>
				  <p style="font-size: 16px; color: #555555; line-height: 1.5;">
					Thank you for reaching out to us. We have received your query and will get back to you as soon as possible. Below are the details of your inquiry:
				  </p>
				  <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin-top: 15px;">
					<p><strong>Query:</strong> ${query}</p>
					<p><strong>Email:</strong> ${userEmail}</p>
				  </div>
				  <p style="font-size: 16px; color: #555555; margin-top: 20px;">
					We will respond to you as soon as we can. In the meantime, please feel free to browse our website for more information.
				  </p>
				</div>
				<div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
				  <p style="font-size: 14px; color: #777777; margin: 0;">Best regards,</p>
				  <p style="font-size: 14px; color: #777777; margin: 0;">The ${PUBLIC_WEBSITE_NAME} Team</p>
				  <p style="font-size: 14px; color: #777777; margin: 0; margin-top: 10px;">
					For more information, visit: <a href="${APP_URL}" style="color: #0073e6; text-decoration: none;">${APP_URL}</a>
				  </p>
				</div>
			  </div>
			</body>
		  </html>
		`;

		try {
			const userEmailSent = await sendEmailToUser(
				`Your Query Confirmation - ${PUBLIC_WEBSITE_NAME}`,
				userEmailContent,
				userEmail
			);
			console.log("Confirmation email sent to the user");
		} catch (error) {
			console.error('Error sending confirmation email to the user:', error);
		}

		const result = await saveMailId(body);
		return result;
	},
	verifyemail: async ({ request }) => {
		const rawData = Object.fromEntries(await request.formData());


		const email = rawData.email;
		console.log(email, "email");




		if (!email) {
			return {
				status: 500,
				message: 'Please provide a valid email address',
				success: false,
				isEmailVerified: false
			};
		}

		try {
			const tokenVerificationRecord = await TokenVerification.findOne({ email });

			if (tokenVerificationRecord && tokenVerificationRecord.isEmailVerified) {

				return {
					status: 200,
					message: 'Email is already verified',
					success: true,
					isEmailVerified: true
				};
			}
			const user = await Profile.findOne({ email });


			if (!user) {
				const result = await sendemailOtp(email);
				if (result) {
					return {
						status: 200,
						message: 'Verification email sent successfully. Please check your inbox.',
						success: true,
						isEmailVerified: false
					};
				} else {
					throw new Error('Email sending failed');
				}
			}

			if (!user.isEmailVerified) {
				const result = await sendemailOtp(email);
				if (result) {
					return {
						status: 200,
						message: 'Verification email sent successfully. Please check your inbox.',
						success: true,
						isEmailVerified: false
					};
				} else {

					throw new Error('Email sending failed');
				}
			}
			return {
				status: 200,
				message: 'User already exists and email is verified.',
				success: true,
				isEmailVerified: true
			};
		} catch (error) {
			console.error('Error during email verification:', error);
			return {
				status: 500,
				message: 'Verification mail could not be sent. Double-Check your email again',
				success: false,
				isEmailVerified: false
			};
		}
	},

	verifyOtpEmail: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
		console.log('verifyOtp body', body);

		const { email, enteredOtp } = body;

		try {
			if (!email || !enteredOtp) {
				return {
					status: 500,
					message: 'Please provide both email and OTP to verify.',
					success: false,
					isEmailVerified: false
				};
			}


			const verificationResult = await verifyemailOtp(email, enteredOtp);

			if (!verificationResult.success) {
				return {
					status: 500,
					message: verificationResult.message,
					success: false,
					isEmailVerified: false
				};
			} else {
				return {
					status: 200,
					message: verificationResult.message,
					success: true,
					isEmailVerified: true
				};
			}
		} catch (error) {
			return {
				status: 500,
				message: 'An unexpected error occurred while verifying the OTP. Please try again later.',
				success: false,
				isEmailVerified: false
			};
		}
	},
}
