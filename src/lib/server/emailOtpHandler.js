import nodemailer from 'nodemailer';
import {
	APP_URL,
	SENDER_EMAIL,
	SENDER_PASSWORD,
	MAIL_HOST
} from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';

// Store OTP temporarily in memory
const otpStore = new Map();

// Send OTP via email
export const sendEmailOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

    // Store OTP for the email
    otpStore.set(email, otp);
    setTimeout(() => otpStore.delete(email), 1 * 60 * 1000); // OTP expires in 1 minutes

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
        subject: 'Your OTP for Email Login',
        html: `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
                    <p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
                        Hi there,<br/><br/>
                        Welcome to ${PUBLIC_WEBSITE_NAME}! Please verify your email address by entering the OTP below.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #333333; padding: 10px 20px; background-color: #f0f0f0; border-radius: 4px;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
                        If you didn't request this, you can ignore this email.
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
        console.log('Verification email sent successfully:', result);
        console.log('OTP sent successfully:', otp);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

// Function to verify OTP for email authentication
export function verifyOtp(email, enteredOtp) {
    const storedOtp = otpStore.get(email);
    return storedOtp === enteredOtp;
}
