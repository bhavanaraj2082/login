import { submitFeedback } from "$lib/server/mongoActions.js";
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
// import { sanitizeFormData } from '$lib/utils/sanitize.js';
export const actions = {
  feedbacks: async ({ request }) => {
    try {
      // const rawData = await request.formData();
      // const formData = sanitizeFormData(rawData);

      const formData = await request.formData();
      console.log(formData,"formData");
      
      const body = {};
      for (const [key, value] of formData.entries()) {
        if (key === 'issue') {
          if (!body[key]) {
            body[key] = [value];
          }
          else if (Array.isArray(body[key])) {
            body[key].push(value);
          }
        } else {
          body[key] = value;
        }
      }
      await submitFeedback(body);
      return {
        type: "success",
        data: {
          message: "Contact details submitted successfully!",
        },
      };
    } catch (error) {
      console.error("Error creating contact:", error);
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

console.log("rawDatarawData",rawData);

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
	console.log(finalResult, "finalResult");
  
	return finalResult;
  };
