import nodemailer from 'nodemailer';
import {
  APP_URL,
  SENDER_EMAIL,
  SENDER_PASSWORD,
  MAIL_HOST
} from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public';
import { PUBLIC_WEBSITE_URL } from '$env/static/public'
export const sendRegistrationSuccessEmail = async (email, username = null) => {
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

  const customerName = username || email.split('@')[0].replace(/\d+/g, '');

  const mailOptions = {
    from: `"PARTSKEYS" <${SENDER_EMAIL}>`,
    to: email,
    subject: `Welcome to ${PUBLIC_WEBSITE_NAME} - Registration Successful! `,
    html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background-color: #FF6A00; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px;">
           Welcome to ${PUBLIC_WEBSITE_NAME}!
        </h2>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #333333; text-align: start; font-size: 24px;">Dear ${customerName},</h2>
        
        <p style="font-size: 16px; text-align: start; margin: 0 0 15px 0;">
          Congratulations! Your registration with <strong>${PUBLIC_WEBSITE_NAME}</strong> has been completed successfully.
        </p>
        
        <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin: 0 0 10px 0;">Registration Complete!</h3>
          <p style="font-size: 16px; color: #333333; margin: 0;">
            You can now access all features of our electronics components platform.
          </p>
        </div>
        
        <div style="margin: 25px 0;">
          <h3 style="color: #333333; font-size: 18px; margin-bottom: 15px;">What's Next?</h3>
          <ul style="color: #555555; font-size: 16px; line-height: 1.6; padding-left: 20px;">
            <li>Browse our extensive catalog of electronic components</li>
            <li>Add products to your favorites for quick access</li>
            <li>Enjoy competitive pricing and fast shipping</li>
            <li>Access technical specifications and datasheets</li>
            <li>Get support from our technical team</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${PUBLIC_WEBSITE_URL}" style="display: inline-block; background-color: #FF6A00; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
            Start Shopping Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #777777; text-align: center; margin: 20px 0 0 0;">
          Need help? Contact our support team at any time. We're here to assist you with all your electronic component needs.
        </p>
      </div>
      
      <div style="background-color: #f1f1f1; padding: 15px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #777777; margin: 0;">Best regards,</p>
        <p style="font-size: 14px; color: #777777; margin: 0; font-weight: bold;">Team ${PUBLIC_WEBSITE_NAME}</p>
        <p style="font-size: 14px; color: #777777; margin: 10px 0 0 0;">
          <a href="${PUBLIC_WEBSITE_URL}" style="color: #0073e6; text-decoration: none;">${PUBLIC_WEBSITE_URL}</a>
        </p>
      </div>
    </div>
  </body>
</html>`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Registration success email sent successfully:', result);
    return true;
  } catch (error) {
    // console.error('Error sending registration success email:', error);
    return false;
  }
};