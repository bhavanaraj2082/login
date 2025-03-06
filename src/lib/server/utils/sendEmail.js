import nodemailer from "nodemailer";
import { SENDER_EMAIL, SENDER_PASSWORD, APP_URL, NOTIFICATION_EMAIL_ADDRESS  } from "$env/static/private";

export async function sendEmail(subject,content) {
  const transporter = nodemailer.createTransport({
    host: APP_URL,
    port: 587,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: SENDER_EMAIL,
    to: NOTIFICATION_EMAIL_ADDRESS,
    subject: subject,
    html: content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
}
