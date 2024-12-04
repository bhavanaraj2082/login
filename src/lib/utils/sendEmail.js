import nodemailer from "nodemailer";
import { SENDER_EMAIL, SENDER_PASSWORD, APP_URL } from "$env/static/private";

export async function sendEmail(body) {
  const transporter = nodemailer.createTransport({
    host: APP_URL,
    port: 587,
    secure: false,
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  const emailContent = `
    <h3>Thank you for contacting us!</h3>
    <p>Dear ${body.name},</p>
    
    <p>We have received your message, and one of our team members will get back to you shortly.</p>
    
    <p>If your inquiry requires immediate assistance, please don't hesitate to contact our support team directly at <a href="mailto:chemikart@gmail.com">chemikart@gmail.com</a>.</p>
    
    <p>We appreciate your interest and look forward to assisting you.</p>
    
    <p>Best regards,<br>
    ChemiKart Team<br>
    <a href="tel:+917829922222">7829922222</a><br>
    `;

  const mailOptions = {
    from: SENDER_EMAIL,
    to: body.email,
    subject: "Confirmation Mail",
    html: emailContent,
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
