import { submitForm } from '$lib/server/mongoActions.js';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
import { fail } from '@sveltejs/kit';
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';
export const actions = {

	copyconsent: async ({ request }) => {
		try {
			const formData = await request.formData();
			const rawData = Object.fromEntries(formData);
			const updatedBody = { ...rawData };
			if (formData.has('image')) {
				const imageFile = formData.get('image');
				const imageUrl = await uploadImage(imageFile);
				updatedBody.image = imageUrl;
			}
			const result = await submitForm(updatedBody);
			async function getClientIP() {
				const response = await fetch('https://api.ipify.org?format=json');
				const data = await response.json();
				return data.ip;
			}
			const ipAddress = await getClientIP();
			const updatedBodyWithIP = { ...updatedBody, ipAddress };
			let emailContent = sendemail.emailTemplatecopy
				.replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
				.replaceAll('{{APP_URL}}', APP_URL)
				.replaceAll('{{title}}', updatedBodyWithIP.title || '')
				.replaceAll('{{firstname}}', updatedBodyWithIP.firstname || '')
				.replaceAll('{{lastname}}', updatedBodyWithIP.lastname || '')
				.replaceAll('{{company}}', updatedBodyWithIP.company || '')
				.replaceAll('{{street}}', updatedBodyWithIP.street || '')
				.replaceAll('{{city}}', updatedBodyWithIP.city || '')
				.replaceAll('{{country}}', updatedBodyWithIP.country || '')
				.replaceAll('{{phone}}', updatedBodyWithIP.phone || '')
				.replaceAll('{{email}}', updatedBodyWithIP.email || '')
				.replaceAll('{{description}}', updatedBodyWithIP.description || '')
				.replaceAll('{{ipAddress}}', ipAddress);
				if (updatedBodyWithIP.url) {
					emailContent = emailContent.replaceAll('{{url}}', '');
				}
		
			try {
				await sendNotificationEmail(
					`New Customer Inquiry – ${PUBLIC_WEBSITE_NAME}`,
					emailContent
				);
			} catch (error) {
				console.error('Error sending notification email to admin:', error);
			}
			let userEmailContent = sendemail.emailTemplatecopyuser
				.replaceAll('{{PUBLIC_WEBSITE_NAME}}', PUBLIC_WEBSITE_NAME)
				.replaceAll('{{APP_URL}}', APP_URL)
				.replaceAll('{{title}}', updatedBodyWithIP.title || '')
				.replaceAll('{{firstname}}', updatedBodyWithIP.firstname || '')
				.replaceAll('{{lastname}}', updatedBodyWithIP.lastname || '')
				.replaceAll('{{company}}', updatedBodyWithIP.company || '')
				.replaceAll('{{street}}', updatedBodyWithIP.street || '')
				.replaceAll('{{city}}', updatedBodyWithIP.city || '')
				.replaceAll('{{country}}', updatedBodyWithIP.country || '')
				.replaceAll('{{phone}}', updatedBodyWithIP.phone || '')
				.replaceAll('{{email}}', updatedBodyWithIP.email || '')
				.replaceAll('{{description}}', updatedBodyWithIP.description || '')




		
			if (updatedBodyWithIP.url) {
				userEmailContent = userEmailContent.replaceAll('{{url}}', '');
			}

			try {
				await sendEmailToUser(
					`Your Customer Inquiry Confirmation - ${PUBLIC_WEBSITE_NAME}`,
					userEmailContent,
					updatedBodyWithIP.email
				);
			} catch (error) {
				// console.error('Error sending confirmation email to the user:', error);
        return { success: false, message: 'Something went wrong', error: error.message };
			}

			return result;

		} catch (error) {
			return { success: false, message: 'Something went wrong', error: error.message };
		}
	},



	verifyemail: async ({ request }) => {
		const rawData = Object.fromEntries(await request.formData());


		const email = rawData.email;



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
			// console.error('Error during email verification:', error);
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
			if (!email ) {
	
				return {
					status: 500,
					message: 'Please provide email  verify.',
					success: false,
					isEmailVerified: false
				};
			}
      if (!enteredOtp ) {   
	
				return {
					status: 500,
					message: 'Please provide OTP to verify.',
					success: false,
					isEmailVerified: false
				};
			}

			//   console.log(`Verifying OTP for email: ${email}`);
			const verificationResult = await verifyemailOtp(email, enteredOtp);

			//   console.log(verificationResult, "verificationResult");

			if (!verificationResult.success) {
				// console.log("OTP verification failed:", verificationResult.message);
				return {
					status: 500,
					message: verificationResult.message,
					success: false,
					isEmailVerified: false
				};
			} else {
				// console.log("OTP verification successful:", verificationResult.message);
				return {
					status: 200,
					message: verificationResult.message,
					success: true,
					isEmailVerified: true
				};
			}
		} catch (error) {
			//   console.error("Error in verifyOtp handler:", error);
			return {
				status: 500,
				message: 'An unexpected error occurred while verifying the OTP. Please try again later.',
				success: false,
				isEmailVerified: false
			};
		}
	},
}

async function uploadImage(file) {
	const filePath = `${file.name}`;

	return filePath;
}




// export const load = async ({ locals }) => {
// 	if (!locals.user) {
// 		return null;
// 	}
// 	const authedUser = { id: locals.user.userId };
// 	console.log(authedUser,"authedUser");
	
// 	const userProfile = await Profile.findOne({ userId: authedUser.id });
// 	console.log(userProfile,"userProfile");
	

// 	if (!userProfile) {
// 		return null;
// 	}
// 	return JSON.parse(JSON.stringify({ profile: userProfile }));
// };



export const load = async ({ locals }) => {
	// Check if there's an authenticated user
	if (!locals.user) {
	  console.log('No authenticated user found');
	  return null;
	}
  
	// Create authedUser object with userId
	const authedUser = { id: locals.user.userId };
	console.log(authedUser, "authedUser");
  
	// Fetch the user profile from the database
	const userProfile = await Profile.findOne({ userId: authedUser.id });
	console.log(userProfile, "userProfile");
  
	// If no profile is found, return null
	if (!userProfile) {
	  console.log('User profile not found');
	  return null;
	}
  
	// Final result to return
	const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));
	console.log(finalResult, "finalResult");
  
	return finalResult;
  };
  



