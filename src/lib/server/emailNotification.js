import nodemailer from 'nodemailer';
import { SENDER_EMAIL, MAIL_HOST, NOTIFICATION_TARGET_EMAIL, SENDER_PASSWORD } from '$env/static/private';

export const sendEmailToUser = async (subject, content, userEmail) => {
    const transporter = nodemailer.createTransport({
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
        to: userEmail,
        subject,
        html: content,
    };

    try {
        const result = await transporter.sendMail(mailOptions);

        if (result.accepted && result.accepted.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

export const sendNotificationEmail = async (subject, content, userEmail = null) => {
    const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD,
        },
    });

    let toEmail = NOTIFICATION_TARGET_EMAIL; 
    if (userEmail) {
        toEmail = `${NOTIFICATION_TARGET_EMAIL}`;
    }

    const mailOptions = {
        from: SENDER_EMAIL,
        to: toEmail,
        subject,
        html: content,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
};

