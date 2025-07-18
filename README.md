# 🔐 Login & Registration System with Email Verification & OTP

A secure authentication system built with **Lucia**, **MongoDB**, and **Nodemailer**.

## ⚙️ Features

- ✅ User registration with email & password
- ✅ Email verification via secure link (sent using Nodemailer)
- ✅ Login with email & password
- ✅ OTP-based login (One-Time Password sent to email)
- ✅ Secure session management using **Lucia**
- ✅ MongoDB integration via **Mongoose** or native driver
- ✅ Customizable email templates

---

## 🛠️ Tech Stack

- **Lucia** – Authentication & session handling
- **MongoDB** – Database for user and token storage
- **Nodemailer** – Email service (SMTP)
- **Node.js + Express** – Server-side logic
- **Mongoose** – (Optional) ODM for MongoDB
- **JavaScript**


## 📬 Email Verification Flow

1. User registers with email and password.
2. A verification email is sent using **Nodemailer**.
3. The user clicks the unique token link to verify their account.
4. Token is stored in MongoDB with an expiration time.

## 🔢 OTP Login Flow

- User enters their email to receive an OTP.
- An OTP is generated and stored in MongoDB.
- OTP is sent to the user's email using Nodemailer.
- User submits the OTP to log in (no password required).
- OTP expires after a short time (e.g., 5 minutes).
