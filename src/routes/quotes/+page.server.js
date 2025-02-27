import { Addquotes } from '$lib/server/mongoActions.js';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
import { fail } from '@sveltejs/kit';
import { APP_URL } from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import sendemail from '$lib/data/sendemail.json';
import { sendNotificationEmail, sendEmailToUser } from '$lib/server/emailNotification.js';
export const actions = {
    qoutes: async ({ request }) => {
        try {
            const data = Object.fromEntries(await request.formData());
            console.log(data, "data");
        

            const record = await Addquotes(data);
            return {
                type: "success",
                data: {
                    message: "Quote request submitted successfully!",
                    record,
                },
            };
        } catch (error) {
            console.error("Error creating quote:", error);
            return {
                type: "error",
                data: {
                    error: "Error submitting your data. Please try again later!",
                },
            };
        }
    },
    verifyemail: async ({ request }) => {
        const rawData = Object.fromEntries(await request.formData());
        console.log(rawData, "rawData");

        const email = rawData.email;

        console.log('Received email:', email);

        if (!email) {
            console.log('No email provided in the request.');
            return {
                status: 500,
                message: 'Please provide a valid email address',
                success: false,
                isEmailVerified: false
            };
        }

        try {
            const tokenVerificationRecord = await TokenVerification.findOne({ email });
            console.log('TokenVerification record:', tokenVerificationRecord);
            if (tokenVerificationRecord && tokenVerificationRecord.isEmailVerified) {
                console.log('Email is already verified in TokenVerification.');
                return {
                    status: 200,
                    message: 'Email is already verified',
                    success: true,
                    isEmailVerified: true
                };
            }
            const user = await Profile.findOne({ email });
            console.log('Profile record:', user);

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
                    console.log('Error: Failed to send verification email.');
                    throw new Error('Email sending failed');
                }
            }

            console.log('User exists and email is already verified in Profile.');
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
                // console.log("Missing email or OTP.");
                return {
                    status: 500,
                    message: 'Please provide both email and OTP to verify.',
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
};


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
	console.log(finalResult, "finalResult quotes");
  
	return finalResult;
  };