import Contact from '$lib/server/models/Contact.js';
import Order from '$lib/server/models/Order.js';
import Product from '$lib/server/models/Product.js';
import CopyConsent from '$lib/server/models/CopyConsent.js'; // Adjust the path to your model
import Register from '$lib/server/models/Register.js';
import Profile from '$lib/server/models/Profile.js';
import MyFavourite from '$lib/server/models/MyFavourite.js';
import Stock from '$lib/server/models/Stock.js';
import StockLog from '$lib/server/models/StockLog.js';
import Solution from '$lib/server/models/Solution.js';
import Quotes from '$lib/server/models/Quotes.js';
import Products from '$lib/server/models/Product.js';
import Helpsupport from '$lib/server/models/Helpsupport.js';
import  User from '$lib/server/models/User.js'
import Cart from '$lib/server/models/cart.js';
import TokenVerification from '$lib/server/models/TokenVerification.js';
import MyFavourites from '$lib/server/models/MyFavourite.js';
import SearchQueries from '$lib/server/models/SearchQueries.js';
import Curconversion from "$lib/server/models/Curconversion.js";
import Feedback from '$lib/server/models/Feedback.js'
import { redirect, error } from '@sveltejs/kit';
import Distributor from "$lib/server/models/Distributor.js"
import { v4 as uuidv4 } from 'uuid';
import { auth, authErrorMessages } from '$lib/server/lucia.js';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
// import { lucia } from 'lucia';
import { LuciaError } from 'lucia';
import {
	APP_URL,
	SENDER_EMAIL,
	SENDER_PASSWORD,
	WEBSITE_NAME,
	MAIL_HOST
} from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public'; 
import Return from '$lib/server/models/Return.js';
import Counter from '$lib/server/models/Counter.js';
import { sendEmail } from '$lib/server/utils/sendEmail.js';

async function conversionRates() {
	const rates = await Curconversion.find().exec();
	const currentRates = {};
	rates.forEach(rate => {
	  currentRates[rate.currency] = rate.rate;
	});
	return currentRates;
  }
  
  export async function convertToINR(pricing) {
	if (!Array.isArray(pricing)) return [];
	const currentRates = await conversionRates();
  
	return pricing.map((priceItem) => {
	  const { break: breakPoint, offer, ...currencies } = priceItem;
	  const newPriceItem = {
		break: breakPoint,
		...(offer !== undefined && { offer }),
	  };
  
	  if (currencies.INR) {
		newPriceItem.INR = currencies.INR;
		return newPriceItem;
	  }
  
	  for (const [currency, amount] of Object.entries(currencies)) {
		if (currentRates[currency]) {
		  newPriceItem.INR = Number(amount * currentRates[currency]);
		  return newPriceItem;
		}
	  }
	  return priceItem;
	});
  }

export const createOrder = async (body) => {
	try {
		const record = JSON.parse(JSON.stringify(await Order.create(body)));
		console.log('Order created successfully:', record);
		return record;
	} catch (error) {
		console.error('Error creating order:', error);
		throw error;
	}
};
export const updateTransactionDetails = async (body) => {
	// console.log('------updateTransactionDetails-----', body, Number(body.productinfo), body.txnid);
	try {
		// Find the document and update it in one operation
		const updatedOrder = JSON.parse(
			JSON.stringify(
				await Order.findOneAndUpdate(
					{ orderid: Number(body.productinfo), transactionid: body.txnid }, // Query criteria
					{ $set: { transdetails: body } }, // Update operation
					{ new: true } // Return the updated document
				)
			)
		);

		// Check if the document was found and updated
		if (!updatedOrder) {
			return { success: false, message: 'Order not found or transaction ID mismatch.' };
		}

		return { success: true, updatedOrder };
	} catch (error) {
		console.error('Error updating transaction details:', error);
		return { success: false, message: 'An error occurred while updating transaction details.' };
	}
};

export const submitContactInfo = async (data) => {
	try {
		const newContact = new Contact(data); // Create a new instance of the ContactUS model
		const savedContact = await newContact.save(); // Save the document to the database
		return savedContact; // Return the saved document
	} catch (error) {
		console.error('Error saving contact info:', error);
		throw new Error('Failed to save contact information');
	}
};

export const getOrderresultData = async (body) => {
	try {
		const records = await Order.findOne({ orderid: body.orderNumber });
		if (records) {
			return {
				success: true,
				msg: 'Success',
				order: JSON.parse(JSON.stringify(records))
			};
		} else {
			return { success: false, message: 'Order not found' };
		}
	} catch (error) {
		console.error('Error getting order data:', error);
		throw new Error('Failed to get order information');
	}
};

export const CancelOrder = async (body) => {
	const { recordId, status } = body;
	console.log('body', body);

	const updatedOrder = await Order.findByIdAndUpdate(recordId, { status: status }, { new: true });

	if (updatedOrder) {
		return { message: 'Order Cancellation Submitted' };
	} else {
		return { message: 'Order not found' };
	}
};

// export async function checkavailabilityproduct(data) {
// 	// console.log(data);
// 	const stockRecord = await Stock.findOne({ productNumber: data.ProductId }).exec();
// 	// console.log('stockRecord:', stockRecord);
// 	const stockQuantity = stockRecord.stock;
// 	// console.log(stockQuantity,"stockQuantity");

// 	if (!stockRecord) {
// 		return { message: 'Out of stock', type: 'error' };
// 	}

// 	if (stockQuantity > 0) {
// 		return { message: `${stockQuantity} Quantity is Available to ship.`, type: 'success' };
// 	} else {
// 		return { message: `Out of Stock`, type: 'error' };
// 	}
// }


export async function checkavailabilityproduct(data) {
	const { ProductId, quantity } = data;

	if (!ProductId || !quantity) {
		return {
			type: 'error',
			message: 'Product and Quantity are required'
		};
	}
	const requestedQuantity = parseInt(quantity, 10);

	try {
		const stockRecord = await Stock.findOne({ productNumber: ProductId }).exec();
		if (!stockRecord) {
			console.log(`No stock record found for ProductId: ${ProductId}`);
			return {
				message: 'Out of stock',
				stock: 'Unavailable',
				type: 'error'
			};
		}

		const totalStock = stockRecord.stock ?? 0;
		const orderedQty = stockRecord.orderedQty ?? 0;
		const availableStock = totalStock - orderedQty;
		if (availableStock <= 0) {
			return {
				message: 'Out of Stock',
				stock: 'Unavailable',
				type: 'error'
			};
		}
		if (requestedQuantity <= availableStock) {
			return {
				message: 'In Stock',
				stock: 'Available',
				type: 'success'
			};
		} else if(requestedQuantity > availableStock){
			return {
				message: `Only ${availableStock} units are available to ship out of the requested ${requestedQuantity}`,
				stock: 'Available',
				type: 'success'
			};
		} else {
			return {
				message: `Only ${availableStock} units are available, requested ${requestedQuantity}`,
				stock: 'Limited Stock',
				type: 'success'
			};
		}
	} catch (error) {
		console.error('Error during stock check:', error);
		return {
			message: 'Something went wrong with the stock check.',
			stock: 'Unavailable',
			type: 'error'
		};
	}
}

export async function favorite(favdata) {
	const authedUser = favdata.authedEmail;
  
	if (authedUser) {
	  const chemiDashProfileId = await Profile.findOne({ email: authedUser });
	  const userId = chemiDashProfileId.userId;
	  
	  const existingRecord = await MyFavourite.findOne({ userId: userId });
  
	  // Initialize favoriteItem object
	  const favoriteItem = {
		productId: favdata.productId,
		manufacturerId: favdata.manufacturerId,
		stockId: favdata.stockId,
		distributorId: favdata.distributorId,
		productNumber: favdata.productNumber,
		quantity: favdata.quantity,
		stock: favdata.stock,
	  };
  
	  if (existingRecord) {
		if (!Array.isArray(existingRecord.favorite)) {
		  existingRecord.favorite = [];
		}
  
		// Check if product already exists in favorites
		const productIndex = existingRecord.favorite.findIndex(
		  (item) => item.productId.toString() === favdata.productId
		);
  
		if (productIndex !== -1) {
		  // Product exists, remove it
		  existingRecord.favorite.splice(productIndex, 1);
		  await existingRecord.save();
		  return {
			success: true,
			type: "success",
			message: "Product Removed from favorites!",
		  };
		} else {
		  // Product does not exist, add it
		  existingRecord.favorite.push(favoriteItem);
		  await existingRecord.save();
		  return {
			success: true,
			type: "success",
			message: "Product Added to favorites!",
		  };
		}
	  } else {
		// If no existing favorite list, create a new record
		await MyFavourite.create({
		  userId: chemiDashProfileId.userId,
		  userEmail: chemiDashProfileId.email,
		  favorite: [favoriteItem],
		});
  
		return {
		  success: true,
		  type: "success",
		  message: "Product Added to favorites!",
		};
	  }
	}
}



// export async function register(body, cookies) {
// 	const data = body;
// 	let isRedirect = false;

// 	// Default site preferences
// 	let sitePreferences = {
// 		noOfOrdersPerPage: 3,
// 		noOfQuickOrderFields: 3,
// 		noOfQuotesPerPage: 3,
// 		productEntryType: 'Manual Entry'
// 	};

// 	try {
// 		const findUser = await Register.findOne({
// 			email: data.email,
// 			password: data.password
// 		});
// 		if (findUser !== null) {
// 			return { success: false, message: 'User already exist' };
// 		}

// 		const user = await Register.create(data);
// 		const profile = await Profile.create({
// 			userId: user._id,
// 			email: user.email,
// 			sitePreferences
// 		});

// 		user.chemiDashProfileId = profile._id;
// 		await user.save();

// 		cookies.set(
// 			'token',
// 			JSON.stringify({
// 				email: user.email,
// 				profileId: profile._id,
// 				userId: user._id
// 			}),
// 			{
// 				path: '/',
// 				httpOnly: true,
// 				sameSite: 'strict',
// 				maxAge: 60 * 60 * 24 * 1000 // 1 day
// 			}
// 		);
// 		isRedirect = true;

// 		// if (verificationResult.success) {
// 		//     return { success: true, message: "Check your email to verify your email address" };
// 		// } else {
// 		//     return { success: false, message: "Verification email was not sent" };
// 		// }
// 	} catch (error) {
// 		console.log('Error during registration:', error);
// 		return { success: false, message: 'An error occurred during registration' };
// 	}
// 	if (isRedirect) {
// 		return redirect(302, '/profile');
// 	}
// }

export const checkoutOrder = async (order) => {
	try {
        let orderid 
		const counter = await Counter.findOne({})
		if(counter?._id){
			orderid = await Counter.findOneAndUpdate({_id:counter._id},{$inc:{counter:1}},{new:true})
		}else{
			orderid = await Counter.create({counter:1})
		}
		order.orderid = orderid.counter
		const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
		order.currentUsdRate = currency.rate
		const newOrder = await Order.create(order);
        for(let rec of order.orderdetails){
			const stock = await Stock.findOneAndUpdate({_id:rec.stockId},{$inc:{orderedQty:rec.orderQty}},{new:true})
			//console.log(stock);
			await StockLog.create({
                 productId:rec.productId,
				 manufacturerId:rec.manufacturerId,
				 distributorId:rec.distributorId,
				 quantity:rec.orderQty,
				 totalStock:stock.stock - rec.orderQty,
				 actionType:"-",
				 actionName:"Ordered"
			})
		}
		await Cart.findOneAndUpdate({userId:order.userId,isActiveCart:true},{isActiveCart:false})
		
		if (newOrder._id) {
			return { success: true, message: 'Successfully Ordered' };
		} else {
			return {
				success: false,
				message: 'Something went wrong while creating order'
			};
		}
	} catch (error) {
		//console.error('Error creating order:', error);
		return { success: false, message: 'Something went wrong',error };
	}
};

export const getUpdatedCartData = async (product) => {
	const productNumbers = product.split(',');
	let productObj = [];
	for (let num of productNumbers) {
		try {
			const record = await Product.findOne(
				{ productNumber: num },
				{ productNumber: 1, priceSize: 1, _id: 0 }
			);
			if (record) {
				productObj.push(record);
			}
		} catch (error) {
			console.error('Error fetching product:', error);
		}
	}

	//console.log(productObj);
	return JSON.stringify(productObj);
};

export async function login(body, cookies) {
	const { email, password } = body;

	const user = await Register.findOne({ email, password });

	if (user) {
		const profile = await Profile.findOne({ userId: user._id });
		console.log('profile', profile);
		if (profile) {
			cookies.set(
				'token',
				JSON.stringify({
					email: user.email,
					profileId: profile._id,
					userId: user._id
				}),
				{
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 * 1000 // 1 day
				}
			);

			const redirectUrl = cookies.get('redirectUrl');
			const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/dashboard/profile';
			if (redirectUrl) {
				cookies.delete('redirectUrl', { path: '/' });
			}
			// Redirect to the profile page
			return redirect(302, targetUrl);
		} else {
			return { success: false, message: 'Profile not found' };
		}
	} else {
		return {
			success: false,
			message: 'Failed to login, please check your email and password'
		};
	}
}

// export async function register(body, cookies) {
// 	const data = body;
// 	let isRedirect = false;

// 	// Default site preferences
// 	let sitePreferences = {
// 		noOfOrdersPerPage: 3,
// 		noOfQuickOrderFields: 3,
// 		noOfQuotesPerPage: 3,
// 		productEntryType: 'Manual Entry'
// 	};

// 	try {
// 		const findUser = await Register.findOne({
// 			email: data.email,
// 			password: data.password
// 		});
// 		if (findUser !== null) {
// 			return { success: false, message: 'User already exist' };
// 		}

// 		const user = await Register.create(data);
// 		const profile = await Profile.create({
// 			userId: user._id,
// 			email: user.email,
// 			sitePreferences
// 		});

// 		user.chemiDashProfileId = profile._id;
// 		await user.save();

// 		cookies.set(
// 			'token',
// 			JSON.stringify({
// 				email: user.email,
// 				profileId: profile._id,
// 				userId: user._id
// 			}),
// 			{
// 				path: '/',
// 				httpOnly: true,
// 				sameSite: 'strict',
// 				maxAge: 60 * 60 * 24 * 1000 // 1 day
// 			}
// 		);
// 		isRedirect = true;

// 		// if (verificationResult.success) {
// 		//     return { success: true, message: "Check your email to verify your email address" };
// 		// } else {
// 		//     return { success: false, message: "Verification email was not sent" };
// 		// }
// 	} catch (error) {
// 		console.log('Error during registration:', error);
// 		return { success: false, message: 'An error occurred during registration' };
// 	}
// 	if (isRedirect) {
// 		return redirect(302, '/profile');
// 	}
// }


export const signUp = async (body, cookies) => {
	// console.log(body, "bodysignUp");
	const existingUser = await auth.getKey("email", body.email).catch(() => null);
	// const existingPhoneKey = await auth
	//   .getKey("phone", body.phone)
	//   .catch(() => null);
  
	if (existingUser) {
	  return {
		success: false,
		message: "This email already exists. Please login or try with another.",
	  };
	}
  
	// if (existingPhoneKey) {
	//   return {
	// 	success: false,
	// 	message: "This phone already exists. Please login or try with another.",
	//   };
	// }
  
	const luciaUser = await auth.createUser({
	  key: {
		providerId: "email",
		providerUserId: body.email,
		password: body.password,
	  },
	  attributes: {
		username: body.username,
		email: body.email,
		// phone: body.phone,
	  },
	});
  
	// if (!existingPhoneKey) {
	//   await auth.createKey({
	// 	userId: luciaUser.userId,
	// 	providerId: "phone",
	// 	providerUserId: body.phone,
	// 	password: "Password123",
	//   });
	// }
	console.log(luciaUser, "luciaUser");
  
	const newProfile = new Profile({
		userId: luciaUser.userId,
      firstName:body.firstName,
	  lastName : body.lastName,
        cellPhone: body.phone,
        companyname: body.companyname,
        companytype: body.companytype,
        jobTitle: body.jobTitle,
        email: body.email,
        isPhoneVerified: body.isPhoneVerified,
        isEmailVerified: body.isEmailVerified,
        gstNumber: body.gstNumber,
        tanNumber: body.tanNumber,
        country: body.country,
        currency: body.currency,
		sitePreferences: {
			productEntryType : "Manual Entry",
			noOfQuickOrderFields: 3,
			noOfOrdersPerPage: 3,
			noOfQuotesPerPage: 3
		}
	});
  
	const savedProfile = JSON.parse(JSON.stringify(await newProfile.save()));
	console.log(savedProfile, "savedProfile");
  
	const key = await auth.useKey("email", body.email, body.password);
	console.log("key.userId",key);
	
	const user = await auth.getUser(key.userId);
	const session = await auth.createSession({
	  userId: user.userId,
	  attributes: {},
	});
  
	const sessionCookie = auth.createSessionCookie(session);
	cookies.set(
	  sessionCookie.name,
	  sessionCookie.value,
	  sessionCookie.attributes
	);
	console.log("Session created successfully");
  
	return {
	  success: true,
	  message: "Signup successful",
	};
  };

  export const loginWithLinkedIn = async (userData, cookies) => {
	// console.log(userData, 'linkedinluciauser');
	try {
		const existingUser = await auth.getKey('email', userData.email);
		if (existingUser) {
			console.log('Existing Lucia user found:', existingUser);

			let existingUserProfile;
			try {
				existingUserProfile = await auth.getUser(existingUser.userId);
				console.log('Existing Lucia user profile:', existingUserProfile);
			} catch (userProfileError) {
				console.error("Error retrieving the existing user's profile:", userProfileError);
				throw new Error('Failed to fetch user profile.');
			}

			let session;
			try {
				session = await auth.createSession({
					userId: existingUser.userId, 
					attributes: {}
				});
				console.log('Session created:', session);
			} catch (sessionError) {
				console.error('Error creating session:', sessionError);
				throw new Error('Failed to create session for the user.');
			}

			try {
				if (!cookies || typeof cookies.set !== 'function') {
					console.error('Cookies object is not defined or invalid.');
					throw new Error('Cookies object is undefined or does not have a set method.');
				}

				const sessionCookie = auth.createSessionCookie(session);
				cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
				console.log('Session cookie set:', sessionCookie);
			} catch (cookieError) {
				console.error('Error setting session cookie:', cookieError);
				// throw redirect(302, '/dashboard');
			}
		}
	} catch (error) {
		console.error('Existing Lucia user not found:', error.code === 'AUTH_INVALID_KEY_ID');
		console.log('error in new user:', error);

		const luciaUser = await auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: userData.email,
				password: 'Password123'
			},
			attributes: {
				username: userData.username,
				email: userData.email,
				// phone: 'N/A'
			}
		});

		// Step 3: Add another key for phone-based login
		// await auth.createKey({
		// userId: luciaUser.userId, 
		// providerId: 'phone', 
		// providerUserId: 'N/A', 
		// password: 'Password123', // Use the same password or leave null for OTP-based login
		// });
		console.log('Lucia user created:', luciaUser);

		const newProfile = new Profile({
			userId: luciaUser.userId,
			firstName: userData.firstname,
			lastName: userData.lastname,
			email: userData.email,
			isEmailVerified: userData.isEmailVerified,
			country: 'N/A',
			sitePreferences: {
				productEntryType : "Manual Entry",
				noOfQuickOrderFields: 3,
				noOfOrdersPerPage: 3,
				noOfQuotesPerPage: 3
			}
			// phone:'N/A'
		});
		console.log('New Profile:', newProfile);
		const savedProfile = JSON.parse(JSON.stringify(await newProfile.save()));
		console.log('Saved Profile:', savedProfile);

		const session = await auth.createSession({
			userId: luciaUser.userId,
			attributes: {}
		});

		const sessionCookie = auth.createSessionCookie(session);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		console.log('Signup successful');
		// throw redirect(302, '/dashboard');
	}
};

const sendVerificationEmail = async (email, verificationUrl) => {
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
		subject: 'Email Verification for Your Account',
		html: `
		<html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
				<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
					<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
						Hi there,<br/><br/>
						Welcome to ${PUBLIC_WEBSITE_NAME}! Please verify your email address by clicking the button below.
					</p>
					<div style="text-align: center;">
						<a href="${APP_URL}/verify-email?token=${verificationUrl}" style="display: inline-block; background-color: #6c67f4; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
							Verify Email
						</a>
					</div>
					<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
						If you didn't sign up for this account, you can ignore this email.
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
		console.log('Verification email sent: ', result);
		return true;
	} catch (error) {
		console.error('Error sending verification email:', error);
		return false;
	}
};


const sendVerificationEmailSignup = async (email, verificationUrl) => {
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
		subject: 'Email Verification for Your Account',
		html: `
		<html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
				<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
					<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
						Hi there,<br/><br/>
						Welcome to ${PUBLIC_WEBSITE_NAME}! Please verify your email address by using the OTP below.
					</p>
					<div style="text-align: center; margin: 20px 0;">
						<span style="display: inline-block; font-size: 20px; font-weight: bold; color: #333333; padding: 10px 20px; background-color: #f0f0f0; border-radius: 4px;">
							${verificationUrl}
						</span>
					</div>
					<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
						If you didn't sign up for this account, you can ignore this email.
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
		console.log('Verification email sent: ', result);
		return true;
	} catch (error) {
		console.error('Error sending verification email:', error);
		return false;
	}
};


const sendVerificationEmailform = async (email, verificationUrl) => {
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
		subject: 'Email Verification for Your Account',
		html: `
		<html>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
				<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
					<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
						Hi there,<br/><br/>
						Welcome to ${PUBLIC_WEBSITE_NAME}! Please verify your email address by using the OTP below.
					</p>
					<div style="text-align: center; margin: 20px 0;">
						<span style="display: inline-block; font-size: 20px; font-weight: bold; color: #333333; padding: 10px 20px; background-color: #f0f0f0; border-radius: 4px;">
							${verificationUrl}
						</span>
					</div>
					<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
						If you didn't sign up for this account, you can ignore this email.
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
		console.log('Verification email sent: ', result);
		return true;
	} catch (error) {
		console.error('Error sending verification email:', error);
		return false;
	}
};

export const sendemailOtp = async (email) => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	console.log(otp,"OTP");
	
    // const token = uuidv4();
	const expiry = new Date(Date.now() + 5 * 60 * 1000);
    const existingRecord = await TokenVerification.findOne({ email });

    if (existingRecord) {
        existingRecord.token = otp;
        existingRecord.expiry = expiry;
        await existingRecord.save(); 
    } else {
        await TokenVerification.create({
            email,
            token: otp,
            verificationType: 'Non-Registered Users',
            expiry
        });
    }

    const verificationUrl = otp;
    const emailSent = await sendVerificationEmailform(email, verificationUrl);
    return emailSent ? verificationUrl : null;
};

export async function verifyemailOtp(email, enteredOtp) {
	try {
	  const tokenVerificationRecord = await TokenVerification.findOne({ email, token: enteredOtp });
	  console.log(tokenVerificationRecord, "tokenVerificationRecord");
  
	  if (!tokenVerificationRecord) {
		console.log("Invalid OTP or email.");
		return { success: false, message: "The OTP entered is incorrect or has expired. Please try again." };
	  }
  
	  if (Date.now() >= tokenVerificationRecord.expiry.getTime()) {
		console.log("Token has expired.");
		return { success: false, message: "Token has expired. Please verify your email again." };
	  }
  
	  const profileRecord = await Profile.findOne({ email });
  
	  if (profileRecord) {
		if (!profileRecord.isEmailVerified) {
		  const profileUpdate = await Profile.updateOne(
			{ email },
			{ $set: { isEmailVerified: true } }
		  );
		  console.log(profileUpdate, "profileUpdate");
  
		  if (profileUpdate.matchedCount === 0) {
			console.log("Failed to update the Profile record.");
			return { success: false, message: "Failed to update the Profile record." };
		  }
  
		  return { success: true, message: "Email verified successfully in Profile." };
		} else {
		  return { success: true, message: "Email is already verified in Profile." };
		}
	  } else {
		const tokenUpdate = await TokenVerification.updateOne(
		  { email, token: enteredOtp },
		  { $set: { isEmailVerified: true } }
		);
		console.log(tokenUpdate, "tokenUpdate");
  
		if (tokenUpdate.matchedCount === 0) {
		  console.log("Failed to update the TokenVerification record.");
		  return { success: false, message: "Failed to update the TokenVerification record." };
		}
  
		return { success: true, message: "Email verified successfully" };
	  }
	} catch (error) {
	  console.error("Error verifying OTP:", error);
	  return { success: false, message: "An unexpected error occurred while verifying the OTP." };
	}
};

// profile action functions
export async function editProfileContact(body) {
	const { recordId, companyName, gstNumber, ...contact } = body;

	try {
		const result = await Profile.findByIdAndUpdate(recordId, { ...contact, companyName, gstNumber }, {
			new: true, // Return the updated document
			runValidators: true // Ensure that validation is run
		});

		// Check if a record was updated
		if (result) {
			return { success: true, message: 'Updated contact information' };
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any potential errors that might occur
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export async function editProfileLinkOrganization(body) {
	const { recordId, ...linkOrganization } = body;

	try {
		// Find the record by recordId and update the linkOrganization field
		const result = await Profile.findByIdAndUpdate(
			recordId,
			{ linkOrganization }, // Set the linkOrganization field
			{ new: true, runValidators: true } // Return the updated document and run validation
		);

		// Check if a record was found and updated
		if (result) {
			return { success: true, message: 'Updated organization link' };
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any potential errors
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export async function editProfileAddresses(body) {
	const { recordId, addressType, ...address } = body;
	let updateField;

	// Determine the update field based on addressType
	switch (addressType) {
		case 'organization':
			updateField = { organizationAddress: address };
			break;
		case 'shipping':
			updateField = { shippingAddress: address };
			break;
		case 'billing':
			updateField = { billingAddress: address };
			break;
		case 'payment':
			updateField = { paymentAddress: address };
			break;
		default:
			return { success: false, message: 'Invalid address type' };
	}

	try {
		// Perform the update based on the addressType
		const result = await Profile.findByIdAndUpdate(
			recordId,
			updateField, // Update the correct address field
			{ new: true, runValidators: true } // Return the updated document and validate
		);

		// Check if the record was updated
		if (result) {
			return {
				success: true,
				message: `Updated ${addressType} address successfully`
			};
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any errors
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export async function editProfileSitePreferences(body) {
	const { recordId, preferences } = body;

	// Parse the preferences string into a JavaScript object
	let sitePreferences;
	try {
		sitePreferences = JSON.parse(preferences);
	} catch (error) {
		return { success: false, message: 'Invalid preferences format' };
	}

	try {
		// Perform the update in the Profile collection
		const result = await Profile.findByIdAndUpdate(
			recordId,
			{ sitePreferences }, // Update the sitePreferences field with the parsed object
			{ new: true, runValidators: true } // Return the updated document and apply schema validation
		);

		// Check if the record was updated
		if (result) {
			return { success: true, message: 'Updated site preferences' };
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any errors that occur during the update
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export async function editProfilePaymentMethod(body) {
	const { recordId, ...paymentMethods } = body;

	try {
		// Perform the update in the Profile collection
		const result = await Profile.findByIdAndUpdate(
			recordId,
			{ paymentMethods }, // Update the paymentMethods field
			{ new: true, runValidators: true } // Return the updated document and apply schema validation
		);

		// Check if the record was updated
		if (result) {
			return { success: true, message: 'Updated payment methods' };
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any errors that occur during the update
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export async function editProfileEmailPreferences(body) {
	const { recordId, preference } = body;

	// Parse the preference string into a JavaScript object
	let emailPreferences;
	try {
		emailPreferences = JSON.parse(preference);
	} catch (error) {
		return { success: false, message: 'Invalid preference format' };
	}

	try {
		// Perform the update in the Profile collection
		const result = await Profile.findByIdAndUpdate(
			recordId,
			{ emailPreferences }, // Update the emailPreferences field
			{ new: true, runValidators: true } // Return the updated document and apply schema validation
		);

		// Check if the record was updated
		if (result) {
			return { success: true, message: 'Updated email preferences' };
		} else {
			return { success: false, message: 'Record not found' };
		}
	} catch (error) {
		// Handle any errors that occur during the update
		return {
			success: false,
			message: 'Something went wrong',
			error: error.message
		};
	}
}

export const searchByQuery = async (body) => {
	// console.log("body.query",body.query);
let cleanedQuery = body.query.replace(/[^\w]/g, "").toLowerCase();;
// console.log("body.query",body.query);

	const queryFilter = {
		$or: [
		{ cleanedName: { $eq: cleanedQuery } },
		{ $text: { $search: cleanedQuery } },
		{ CAS: { $eq: body.query } }
		]
	  };
	  
	try {
		const result = await Product.find(queryFilter)
			.limit(10)
			.populate('category')
			.populate('subCategory')
			.exec();
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.log(error);
		return { success: false, message: 'something went wrong' };
	}
};

export async function submitForm(data) {
	try {

	  const formEntries = data;  
	  const response = await CopyConsent.create(formEntries);

	  return { status: 200, success: true };
	} catch (error) {
	  console.error("Error saving form data:", error);
	  return { status: 500, body: { success: false, error: error.message } };
	}
  }

//CHEMIKART SOLUTIONS
export const submitContactData = async (data) => {
	try {
		const newSolutions = new Solution(data);
		const savedSolutions = await newSolutions.save();
		return savedSolutions;
	} catch (error) {
		console.error('Error saving Solution info:', error);
		throw new Error('Failed to save Solution information');
	}
};

//CHEMIKART QUOTES
export const Addquotes = async (data) => {
    const components = JSON.parse(data.components);
    const formattedData = {
        Custom_solution_type: data.solutionValue,
        Custom_format: data.selectedColor,
        Configure_custom_solution: {
            components: components,
            solvent: data.solvent,
            packagingType: data.packagingType,
            volume: data.volume,
            units: data.units,
            qualityLevel: data.qualityLevel,
            analyticalTechnique: data.analyticalTechnique
        },
        Additional_notes: data.futherdetails,
        status: data.status,
        Customer_details: {
            Title: data.title,
            Firstname: data.first,
            Lastname: data.last,
            organisation: data.organisation,
			country: data.country,
            // invoiceNumber: data.lgc,
            email: data.email,
            number: data.number
			// userId: data.userId
        },
		Delivery_information: {
            Address1: data.address1,
            Address2: data.address2,
			Country1: data.country1,
            GST: data.county,
            City: data.city,
            Post: data.post
        }
    };
    const quoteCount = await Quotes.countDocuments();
    formattedData.quoteId = quoteCount + 1;  
	formattedData.userId = data.userId;  
    const newQuote = new Quotes(formattedData);
    console.log("mongoactions newQuote",newQuote);
    try {
        await newQuote.save();
        return { success: true, message: 'Quote added successfully', quoteId: formattedData.quoteId };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//CHEMIKART DOCUMENTS
/**
 * Fetch a product's certificate data from MongoDB based on productNumber.
 *
 * @param {string} inputValue - The product number to search for.
 * @returns {Promise<Object|null>} The product record or null if not found.
 */
export async function fetchcertificate(inputValue) {
	try {
		const record = JSON.parse(
			JSON.stringify(
				await Products.findOne(
					{ productNumber: inputValue },
					'safetyDatasheet productNumber'
				).lean()
			)
		);
		return record || null;
	} catch (error) {
		console.error('Error fetching certificate:', error);
		throw new Error('Unable to fetch certificate.');
	}
}

//CHEMIKART HELP & SUPPORT
function finalformdata(formData) {
	let poNumber = '';
	let orderNumber = '';
	let invoiceNumber = '';

	if (formData.reference === 'PO Number') {
		poNumber = formData.selectOptionNumber;
	} else if (formData.reference === 'Order Number') {
		orderNumber = formData.selectOptionNumber;
	} else if (formData.reference === 'Invoice Number') {
		invoiceNumber = formData.selectOptionNumber;
	}
	let items = {};
	if (formData.products) {
		items = JSON.parse(formData.products);
	}
	console.log('Raw Form Data:', formData);
	const finalData = {
		technical_issue: formData.technical_issue || '',
		issueName: formData.issueName || '',
		documentRequired: formData.documentRequired || '',
		currentEmail: formData.currentEmail || '',
		newEmail: formData.newEmail || '',
		resetemail: formData.resetemail || '',
		primaryAddress: formData.primaryAddress || '',
		updateAddress: formData.updateAddress || '',
		issue: formData.issue || '',
		assistance: formData.assistance || '',
		items: items,
		exportMaterial: formData.exportMaterial || '',
		poNumber: formData.poNumber || poNumber,
		orderNumber: orderNumber || '',
		invoiceNumber: formData.invoiceNumber || invoiceNumber,
		confirmationNumber: formData.confirmationNumber || '',
		itemNumber: formData.itemNumber || '',
		firstName: formData.firstName || '',
		lastName: formData.lastName || '',
		email: formData.email || '',
		phoneNumber: formData.phoneNumber || '',
		companyName: formData.companyName || '',
		location: formData.location || '',
		accountNumber: formData.accountNumber || '',
		shippingStreetAddress: formData.streetAddress || '',
		shippingCity: formData.city || '',
		shippinglocation: formData.shippinglocation || '',
		shippingPostalCode: formData.postalCode || '',
		billingStreetAddress: formData.billingStreetAddress || '',
		billingCity: formData.billingCity || '',
		billingLocation: formData.billingLocation || '',
		billingPostalCode: formData.billingPostalCode || '',
		files: formData.files || [],
		status: 'unread'
	};
	console.log('Processed Final Data:', finalData);
	return finalData;
}
export const saveContactInfo = async (data) => {
	try {
		let finalData = finalformdata(data);
		const record = await Helpsupport.create(finalData);
		return { success: true, message:"Details Submittied Succesfully" };
	} catch (error) {
		console.error('Error saving contact info:', error);
		return { success: false, error: error.message };
	}
};

export const emailVerificationToken = async (body, verifyType) => {
	const { email, userId } = body;
	//console.log(email);
	const token = uuidv4();
	// Set the expiry time (5 minutes from now)
	const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
	//console.log(token,expiry);
	// Store the token and expiry in the database
	const verification = await TokenVerification.create({
		email,
		token,
		expiry,
		verificationType: verifyType,
		userId
	});
	//console.log("-------",verification);
	// Send the email with the verification link
	const transporter = nodemailer.createTransport({
		service: 'gmail', // Use your email service here (SendGrid, Mailgun, etc.)
		auth: {
			user: SENDER_EMAIL, // Replace with your email
			pass: SENDER_PASSWORD // Replace with your email password or an app-specific password
		}
	});
	//console.log('=======',transporter);
	const mailOptions = {
		from: SENDER_EMAIL,
		to: email,
		subject: `Email Verification request from ${WEBSITE_NAME} `,
		html: `
	  <html>
		<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
		  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
			<h2 style="color: #333333; text-align: center; font-size: 24px;">Verify Your Email Address</h2>
			<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
			  Hi there,<br/><br/>
			  Thanks for signing up! To complete your registration, please click the button below to verify your email address.
			</p>
			<div style="text-align: center;">
			  <a href="${APP_URL}/verify?token=${token}" style="display: inline-block; background-color: #fe5939; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
				Verify Your Email
			  </a>
			</div>
			<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
			  If you didn't sign up for this account, you can ignore this email.
			</p>
			<p style="font-size: 14px; color: #777777; text-align: center;">
			  Thanks,<br/>
			  The ${WEBSITE_NAME} Team
			</p>
		  </div>
		</body>
	  </html>
	`
	};

	//console.log("+++++++",mailOptions);
	try {
		const res = await transporter.sendMail(mailOptions);
		//console.log("mail response",res);
		return {
			success: true,
			title: 'Email Verification Sent',
			message: 'Email verification token is sent to your email. Please verify.'
		};
	} catch (err) {
		console.error(err);
		throw error(500, {
			title: 'Failed to send email',
			message: 'Something went wrong. try again later'
		});
	}
};

export const passwordVerificationToken = async (body, verifyType) => {
	const { email, userId } = body;
	// console.log(body, 'Body from actions');
	// console.log(email, 'Email received');
	const user = await User.findOne({ email });
	if (!user) {
		return {
			success: false,
			message: 'Please provide your registered email address to proceed with resetting your password'
		};
	}

	console.log(user, 'User fetched');
	const token = uuidv4();
	const expiry = new Date(Date.now() + 15 * 60 * 1000);
	console.log(token,expiry);
	const verification = await TokenVerification.create({
		email,
		token,
		expiry,
		verificationType: 'reset',
		userId
	});
	console.log('-------', verification);
	const transporter = nodemailer.createTransport({
		service: 'partskeys', 
		host: 'mail.partskeys.com',
		port: 587, 
		secure: false,
		auth: {
			user: SENDER_EMAIL, 
			pass: SENDER_PASSWORD 
		}
	});
	console.log('=======',transporter);
	const mailOptions = {
		from: SENDER_EMAIL,
		to: email,
		subject: `Password Reset Request for Your ${PUBLIC_WEBSITE_NAME} Account `,
		html: `
	  <html>
		<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
		  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
			<h2 style="color: #333333; text-align: center; font-size: 24px;">Reset Your Password</h2>
			<p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
			  Hi there,<br/><br/>
			  We received a request to reset your password. To proceed, please click the button below to reset your password.
			</p>
			<div style="text-align: center;">
			  <a href="${APP_URL}/reset-password?token=${token}" style="display: inline-block; background-color: #e87a3f; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
				Reset Password
			  </a>
			</div>
			<p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
			  If you didn't sign up for this account, you can ignore this email.
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
	console.log("+++++++",mailOptions);
	try {
		const res = await transporter.sendMail(mailOptions);
		console.log('mail response', res);
		return {
			success: true,
			message: 'Password verification token is sent to your email. Please verify.'
		};
	} catch (err) {
		// return {
		// 	success: false,
		// 	message: 'Something went wrong. try again later:',err
		// };
		console.error(err);
		throw error(500, { message: 'Something went wrong. try again later' });
	}
};


export const userUpdatePassword = async (body) => {
	const { userId, email, newPassword } = body;
	console.log(body);

	try {
		await auth.updateKeyPassword('email', email, newPassword);

		await auth.invalidateSession(userId);

		console.log('Password updated successfully.');

		return { success: true, message: 'Password reset successfully.' };

		// throw redirect(302, '/dashboard'); // You can return a redirect message here if needed
	} catch (error) {
		console.error('Error updating password:', error);

		if (error instanceof LuciaError) {
			return { success: false, message: 'Failed to update password: ' + error.message };
		} else {
			return { success: false, message: 'An unexpected error occurred.' };
		}
	}
};

export const ResetPassword = async (body) => {
	try {
		const { email, newPassword, token } = body;
		// console.log("Request body:", body);

		// Case 1: If token is provided, verify it
		if (token) {
			const tokenRecord = await TokenVerification.findOne({ token });

			// If token is not found or expired, return an error
			if (!tokenRecord) {
				return { success: false, message: 'Invalid or expired token.' };
			}

			const currentTime = new Date();
			if (currentTime > tokenRecord.expiry) {
				await TokenVerification.deleteOne({ token });
				return { success: false, message: 'Token has expired' };
			}

			// If token is already used, prevent reuse
			if (tokenRecord.used) {
				return { success: false, message: 'Token has already been used' };
			}

			// Mark token as used and get the associated email
			await TokenVerification.updateOne({ token }, { $set: { used: true } });
			const email = tokenRecord.email;

			// Reset password using the email
			await auth.updateKeyPassword('email', email, newPassword);
			
			// Invalidate session and delete token record
			await auth.invalidateSession(email);
			await TokenVerification.deleteOne({ token });

			return { success: true, message: 'Password reset successfull' };
		}

		// Case 2: If no token but userEmail is provided, reset password directly
		if (email) {
			await auth.updateKeyPassword('email', email, newPassword);
			// Invalidate user session
			await auth.invalidateSession(email);

			return { success: true, message: 'Password reset successfull' };
		}

		// Case 3: If neither token nor userEmail is provided, return an error
		return { success: false, message: 'Token has expired or is missing.' };

	} catch (error) {
		console.log("Error during password reset:", error);
		// Handle LuciaError separately
		if (error instanceof LuciaError) {
			console.log("LuciaError:", error.message);
			return { success: false, message: 'Failed to update the password' };
		}
		return { success: false, message: 'Failed to reset the password' };
	}
};

  export const generateVerificationUrl = async (email, userId) => {
	const token = uuidv4();

	await TokenVerification.create({
		email,
		token,
		verificationType: 'email',
		userId: userId,
		expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
	});

	const verificationUrl = token;

	const emailSent = await sendVerificationEmail(email, verificationUrl);

	return emailSent ? verificationUrl : null;
};


//returns starts
export const getReturnresultData = async (body) => {
	// console.log('returnsbody-->',body)
	try {
		const invoiceNumber = body.invoiceNumber;
		const record = await Order.findOne({ invoice: invoiceNumber }).populate('profileId');

		if (!record) {
			return { message: 'Order not found' };
		}

		if (record.profileId.email !== body.email) {
			return { message: 'Email does not match the profile associated with this order' };
		}

		return {
			redirectTo: `/returns/${record.invoice}`,
			order: {
				invoiceNumber: record.invoice
			}
		};
	} catch (error) {
		console.error('Error fetching return result:', error);
		return { message: 'Error occurred while fetching the order' };
	}
};

export const getreturnsOrderData = async ({ body }) => {
	// console.log("-----", body);
	try {
		const {
			orderNumber,
			invoiceNumber,
			returnOrderId,
			userId,
			selectall,
			reason: entireOrderReason,
			entireOrderResolution,
			description: entireOrderInfo,
			...otherFields
		} = body;

		const isEntireOrder = selectall === 'on';

		const selectedItems = [];
		const itemsByIndex = {};

		Object.entries(otherFields).forEach(([key, value]) => {
			const match = key.match(/^selectedItems\[(\d+)\]\.(\w+)$/);
			if (match) {
				const index = parseInt(match[1], 10);
				const field = match[2];

				if (!itemsByIndex[index]) {
					itemsByIndex[index] = {};
				}
				itemsByIndex[index][field] = value;
			}
		});

		Object.values(itemsByIndex).forEach((item) => {
			// console.log('item', item);

			if (item.productNumber) {
				const processedItem = {
					productNumber: item.productNumber,
					productName: item.productName,
					manufacturerName: item.manufacturerName,
					orderQty: parseInt(item.orderQty, 10),
					returnqty: parseInt(item.returnqty, 10),
					reason: isEntireOrder ? entireOrderReason : item.reason,
					resolution: isEntireOrder ? entireOrderResolution : item.resolution,
					additionalInfo: isEntireOrder ? entireOrderInfo : item.additionalInfo
				};
				selectedItems.push(processedItem);
			}
		});

		const returnData = {
			returnItems: {
				selectedItems
			},
			invoiceNumber,
			userId: userId,
			orderNumber,
			returnOrderid: returnOrderId,
			status: 'Pending'
		};

		const newReturn = new Return(returnData);
		const savedReturn = await newReturn.save();

		return {
			status: 200,
			record: JSON.parse(JSON.stringify(savedReturn))
		};
	} catch (error) {
		console.error('Error processing return order:', error);
		return {
			status: 500,
			message: 'Error processing return order'
		};
	}
};


export const getcancelreturnData = async (id) => {
	try {
		const deletedRecord = await Return.findByIdAndDelete({ _id: id });
		if (!deletedRecord) {
			return { status: 404, message: 'Return order not found.' };
		}
		return { status: 200, message: 'Return order cancelled successfully.' };
	} catch (error) {
		console.error('Error deleting return order:', error);
		return { status: 500, message: 'An error occurred while canceling the return.' };
	}
};

export const getcancelreturn = async (id) => {
	try {
		const deletedRecord = await Return.deleteOne({ _id: id });
		// console.log("Delete operation result:", deletedRecord);
		if (!deletedRecord) {
			return { status: 404, message: 'Return order not found.' };
		}
		return { status: 200, message: 'Return order cancelled successfully.' };
	} catch (error) {
		console.error('Error deleting return order:', error);
		return { status: 500, message: 'An error occurred while canceling the return.' };
	}
};
//returns ends

// export async function quickcheck(data) {
// 	const { ProductId, quantity } = data;

// 	// console.log('ProductId from actions:', ProductId);

// 	if (!ProductId || !quantity) {
// 		return {
// 			type: 'error',
// 			message: 'Product ID and Quantity are required.'
// 		};
// 	}

// 	const requestedQuantity = parseInt(quantity, 10);

// 	try {
	
// 		// console.log(`Querying stock with ProductId: ${ProductId}`);

	
// 		const stockRecord = await Stock.findOne({ productNumber: ProductId }).exec();

// 		// console.log('Stock Record:', stockRecord);

// 		if (!stockRecord) {
// 			console.log(`No stock record found for ProductId: ${ProductId}`);
// 			return {
// 				message: 'Out of stock',
// 				stock: 'Unavailable',
// 				type: 'error'
// 			};
// 		}

// 		const stockQuantity = stockRecord.stock;

// 		if (stockQuantity > 0) {
// 			if (requestedQuantity <= stockQuantity) {
// 				return {
// 					message: `${stockQuantity} is avilable to ship`,
// 					stock: 'Available',
// 					type: 'success'
// 				};
// 			} else {
// 				return {
// 					message: `Only ${stockQuantity} units available.`,
// 					stock: 'Limited Availability',
// 					type: 'error'
// 				};
// 			}
// 		} else {
// 			return {
// 				message: 'Out of Stock',
// 				stock: 'Unavailable',
// 				type: 'error'
// 			};
// 		}
// 	} catch (error) {
// 		console.error('Error during stock check:', error);
// 		return {
// 			message: 'Something went wrong with the stock check.',
// 			stock: 'Unavailable',
// 			type: 'error'
// 		};
// 	}
// }




export async function quickcheck(data) {
	const { ProductId, quantity } = data;

	if (!ProductId || !quantity) {
		return {
			type: 'error',
			message: 'Product ID and Quantity are required.'
		};
	}

	const requestedQuantity = parseInt(quantity, 10);

	try {
		const stockRecord = await Stock.findOne({ productNumber: ProductId }).exec();

		if (!stockRecord) {
			console.log(`No stock record found for ProductId: ${ProductId}`);
			return {
				message: 'Out of stock',
				stock: 'Unavailable',
				type: 'error'
			};
		}

		const totalStock = stockRecord.stock;
		const orderedQty = stockRecord.orderedQty || 0;
		const availableStock = totalStock - orderedQty;

		if (availableStock > 0) {
			if (requestedQuantity <= availableStock) {
				return {
					message: `${availableStock} is available to ship`,
					stock: 'Available',
					type: 'success'
				};
			} else {
				return {
					message: `Only ${availableStock} units available.`,
					stock: 'Limited Availability',
					type: 'error'
				};
			}
		} else {
			return {
				message: 'Out of Stock',
				stock: 'Unavailable',
				type: 'error'
			};
		}
	} catch (error) {
		console.error('Error during stock check:', error);
		return {
			message: 'Something went wrong with the stock check.',
			stock: 'Unavailable',
			type: 'error'
		};
	}
}

export const validateProductDetails = async (productNumber, size, quantity) => {
	try {
		const product = await Products.findOne({ productNumber });

		if (!product) {
			return {
				isValid: false,
				message: 'Invalid product number'
			};
		}
		const normalizedSizes = product.priceSize?.map((ps) => ps.size.replace(/\s+/g, ''));
		const normalizedSize = size ? size.replace(/\s+/g, '') : null;

		if (normalizedSizes && normalizedSizes.includes(normalizedSize)) {
			if (product.stockQuantity >= quantity) {
				return {
					isValid: true,
					message: `Valid (${quantity} unit${quantity > 1 ? 's' : ''})`
				};
			} else {
				return {
					isValid: false,
					message: `Insufficient stock. Only ${product.stockQuantity} unit${product.stockQuantity > 1 ? 's' : ''} available.`
				};
			}
		} else {
			return {
				isValid: false,
				message: 'Size is invalid or missing'
			};
		}
	} catch (error) {
		console.error('Error validating product details:', error);
		return {
			isValid: false,
			message: 'Error validating product details. Please try again later.'
		};
	}
};

export const handleFileUpload = async (fileData) => {
	const rows = fileData.split('\n');
	const validationResults = [];

	for (let row of rows) {
		const columns = row.split(',');
		const productNumberAndSize = columns[0]?.trim();
		const quantity = columns[1] ? parseInt(columns[1].trim(), 10) : 1;

		if (!productNumberAndSize) {
			validationResults.push({
				productNumber: 'Unknown',
				message: 'Invalid input format',
				isValid: false
			});
			continue;
		}

		const [productNumber, uploadedSize] = productNumberAndSize.split('-');
		const validationResult = await validateProductDetails(productNumber, uploadedSize, quantity);

		validationResults.push({
			productNumber: productNumberAndSize,
			message: validationResult.message,
			isValid: validationResult.isValid
		});
	}

	return validationResults;
};

//Myfavouries actions starts
// export const deleteFavoriteItem = async (itemId, userId) => {
// 	try {
// 		const updatedDoc = await MyFavourites.findOneAndDelete(
// 			{ userId: userId },
// 			{ $pull: { favorite: { id: itemId } } },
// 			{ new: true }
// 		);
// 		if (!updatedDoc) {
// 			throw new Error('User favorites not found');
// 		}
// 		return {
// 			status: 'success',
// 			message: 'Item deleted successfully',
// 			favorite: updatedDoc.favorite
// 		};
// 	} catch (error) {
// 		console.error('Error deleting favorite item:', error);
// 		throw error;
// 	}
// };

// export const clearAllFavorites = async (userId) => {
// 	try {
// 		const updatedDoc = await MyFavourites.findOneAndDelete(
// 			{ userId: userId },
// 			{ $set: { favorite: [] } },
// 			{ new: true }
// 		);
// 		if (!updatedDoc) {
// 			throw new Error('User favorites not found');
// 		}
// 		return {
// 			status: 'success',
// 			message: 'All favorite items deleted successfully',
// 			favorite: []
// 		};
// 	} catch (error) {
// 		console.error('Error deleting all favorite items:', error);
// 		throw error;
// 	}
// };

// export const deleteFavoriteItem = async (itemId, userId) => {
//     try {
//         const updatedDoc = await MyFavourites.findOne(
//             { userId: userId },
//             { $pull: { favorite: { productId: itemId } } },
//             { new: true }
//         );
        
//         if (!updatedDoc) {
//             throw new Error('User favorites not found');
//         }
        
//         return {
//             status: 'success',
//             message: 'Item deleted successfully',
//             favorite: updatedDoc.favorite
//         };
//     } catch (error) {
//         console.error('Error deleting favorite item:', error);
//         throw error;
//     }
// };
export const deleteFavoriteItem = async (itemId, userId) => {
    try {
        const existingFavorites = await MyFavourites.findOne({ userId });
        
        if (!existingFavorites) {
            return {
                status: 'error',
                message: 'No favorites found for this user'
            };
        }

        const updatedDoc = await MyFavourites.findOneAndUpdate(
            { userId },
            { $pull: { favorite: { productId: itemId } } },
            { new: true }
        );
        
        if (!updatedDoc) {
            return {
                status: 'error',
                message: 'Failed to remove item from favorites'
            };
        }
        
        return {
            status: 'success',
            message: 'Item removed successfully',
            favorite: JSON.parse(JSON.stringify(updatedDoc.favorite))
        };
    } catch (error) {
        console.error('Error deleting favorite item:', error);
        return {
            status: 'error',
            message: 'An error occurred while removing the item'
        };
    }
};


// export const clearAllFavorites = async (userId) => {
//     try {
//         const updatedDoc = await MyFavourites.findOneAndUpdate(
//             { userId: userId },
//             { $set: { favorite: [] } },
//             { new: true }
//         );
        
//         if (!updatedDoc) {
//             throw new Error('User favorites not found');
//         }
        
//         return {
//             status: 'success',
//             message: 'All favorite items deleted successfully',
//             favorite: []
//         };
//     } catch (error) {
//         console.error('Error deleting all favorite items:', error);
//         throw error;
//     }
// };

export const clearAllFavorites = async (userId) => {
    try {
        const existingFavorites = await MyFavourites.findOne({ userId });
        
        if (!existingFavorites) {
            return {
                status: 'error',
                message: 'No favorites found for this user'
            };
        }

        const updatedDoc = await MyFavourites.findOneAndUpdate(
            { userId },
            { $set: { favorite: [] } },
            { new: true }
        );
        
        if (!updatedDoc) {
            return {
                status: 'error',
                message: 'Failed to clear favorites'
            };
        }
        
        return {
            status: 'success',
            message: 'All favorites cleared successfully',
            favorite: []
        };
    } catch (error) {
        console.error('Error clearing favorites:', error);
        return {
            status: 'error',
            message: 'An error occurred while clearing favorites'
        };
    }
};

// export const favaddToCart = async (cartData, userId, userEmail) => {
//     try {
//         if (!cartData || !userId || !userEmail) {
//             throw new Error('Missing required data for cart operation');
//         }

//         const cartItem = {
//             productId: cartData.productId,
//             stockId: cartData.stockId,
//             manufacturerId: cartData.manufacturerId,
//             distributorId: cartData.distributorId,
//             quantity: parseInt(cartData.quantity) || 1,
//             backOrder: 0,
//             isCart: false, 
//             isQuote: false,
//             quoteOfferPrice: {
//                 INR: 0,
//                 USD: 0
//             },
//             cartOfferPrice: {
//                 INR: 0,
//                 USD: 0
//             }
//         };

//         let existingCart = await Cart.findOne({
//             userId: userId,
//             isActiveCart: true,
//             isDeleted: false
//         });

//         if (existingCart) {
//             const itemIndex = existingCart.cartItems.findIndex(
//                 item => item.productId.toString() === cartData.productId.toString()
//             );

//             if (itemIndex > -1) {
//                 existingCart.cartItems[itemIndex].quantity += parseInt(cartData.quantity) || 1;
//                 const updatedCart = await existingCart.save();
//                 return {
//                     status: 'success',
//                     message: 'Cart item quantity updated successfully',
//                     cart: updatedCart
//                 };
//             } else {
//                 existingCart.cartItems.push(cartItem);
//                 const updatedCart = await existingCart.save();
//                 return {
//                     status: 'success',
//                     message: 'Item added to cart successfully',
//                     cart: updatedCart
//                 };
//             }
//         } else {
//             const newCart = await Cart.create({
//                 cartId: nanoid(8),
//                 cartName: `mycart`,
//                 cartItems: [cartItem],
//                 userId: userId,
//                 userEmail: userEmail,
//                 isDeleted: false,
//                 isActiveCart: true
//             });

//             return {
//                 status: 'success',
//                 message: 'New cart created with item successfully',
//                 cart: newCart
//             };
//         }
//     } catch (error) {
//         console.error('Error adding item to cart:', error);
//         throw new Error(`Failed to add item to cart: ${error.message}`);
//     }
// };

export const favaddToCart = async (cartData, userId, userEmail) => {
    try {
        if (!cartData || !userId || !userEmail) {
            return {
                status: 'error',
                message: 'Missing required data for cart operation'
            };
        }

        const existingCart = await Cart.findOne({
            userId,
            isActiveCart: true,
            isDeleted: false
        });

        // const cartItem = {
        //     productId: cartData.productId,
        //     stockId: cartData.stockId,
        //     manufacturerId: cartData.manufacturerId,
        //     distributorId: cartData.distributorId,
        //     quantity: parseInt(cartData.quantity) || 1,
        //     backOrder: cartData.backOrder,
        //     isCart: false,
        //     isQuote: false,
        //     quoteOfferPrice: { INR: 0, USD: 0 },
        //     cartOfferPrice: { INR: 0, USD: 0 }
        // };
        //console.log(cartData,"opopopop");
        if (existingCart) {
            const itemIndex = existingCart.cartItems.findIndex(
                item => item.productId.toString() === cartData.productId
            );

            if (itemIndex > -1) {
                existingCart.cartItems[itemIndex].quantity += parseInt(cartData.quantity) || 1;
                await existingCart.save();
                return {
                    status: 'success',
                    message: 'Item quantity updated in cart'
                };
            } else {
                existingCart.cartItems.push(cartData);
                await existingCart.save();
                return {
                    status: 'success',
                    message: 'Item added to cart'
                };
            }
        } else {
            await Cart.create({
                cartId: nanoid(8),
                cartName: 'mycart',
                cartItems: [cartData],
                userId,
                userEmail,
                isDeleted: false,
                isActiveCart: true
            });

            return {
                status: 'success',
                message: 'Item added to new cart'
            };
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return {
            status: 'error',
            message: 'Failed to add item to cart'
        };
    }
};

export const addAllToCart = async (items, userId, userEmail) => {
    try {
        const cartItems = items.map(item => ({
            productId: item.productId,
            stockId: item.stockId,
            manufacturerId: item.manufacturerId,
            distributorId: item.distributorId,
            quantity: item.quantity,
            backOrder: 0,
            isCart: false,
            isQuote: false,
            quoteOfferPrice: { INR: 0, USD: 0 },
            cartOfferPrice: { INR: 0, USD: 0 }
        }));

        const existingCart = await Cart.findOne({
            userId: userId,
            isActiveCart: true,
            isDeleted: false
        });

        if (existingCart) {
            for (const newItem of cartItems) {
                const existingItemIndex = existingCart.cartItems.findIndex(
                    item => item.productId.toString() === newItem.productId.toString()
                );

                if (existingItemIndex > -1) {
                    existingCart.cartItems[existingItemIndex].quantity += newItem.quantity;
                } else {
                    existingCart.cartItems.push(newItem);
                }
            }

            const updatedCart = await existingCart.save();
            return {
                status: 'success',
                message: 'All items added to existing cart',
                cart: updatedCart
            };
        } else {
            const newCart = await Cart.create({
                cartId: nanoid(8),
                cartName: `mycart`,
                cartItems: cartItems,
                userId: userId,
                userEmail: userEmail,
                isDeleted: false,
                isActiveCart: true
            });

            return {
                status: 'success',
                message: 'New cart created with all items',
                cart: newCart
            };
        }
    } catch (error) {
        console.error('Error adding all items to cart:', error);
        throw error;
    }
};

//Myfavouries actions ends


export const quicksearch = async ({ query }) => {
	try {
	  const baseProducts = await Product.find({
		productNumber: { $regex: query, $options: 'i' }
	  })
		.select('_id productName productNumber prodDesc image')
		.limit(20)
		.lean()
		.exec();
	  const enrichedProducts = [];
	  for (const baseProduct of baseProducts) {
		const stockEntries = await Stock.find({ 
		  productNumber: baseProduct.productNumber 
		})
		  .select('_id stock pricing distributor manufacturer')
		  .lean()
		  .exec();
  
		if (!stockEntries || stockEntries.length === 0) {
		  enrichedProducts.push({
			id: baseProduct._id.toString(),
			image: baseProduct.image || null,
			description: baseProduct.prodDesc || null,
			productName: baseProduct.productName,
			productNumber: baseProduct.productNumber,
			stockId: null,
			manufacturer: null,
			distributer: null,
			stock: 0,
			priceone: "",
			pricing: []
		  });
		  continue;
		}
		for (const entry of stockEntries) {

		  
		  let processedPricing = [];
		  let priceoneValue = "";
		  
		  if (entry.pricing) {
			const originalPricing = Array.isArray(entry.pricing) ? entry.pricing : [entry.pricing];
			const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
		
			if (originalPricing[0]?.INR !== undefined && originalPricing[0]?.INR !== null) {
				processedPricing = originalPricing.map(price => {
					const inrValue = price.INR;
					const usdValue = inrValue / currency.rate; 
					return {
						...price,
						USD: usdValue.toFixed(2) 
					};
				});
		
				priceoneValue = originalPricing[0]?.INR || "";
		
			} else if (originalPricing[0]?.USD !== undefined && originalPricing[0]?.USD !== null) {
				processedPricing = originalPricing.map(price => {
					const usdValue = price.USD;
					const inrValue = usdValue * currency.rate; 
					return {
						...price,
						INR: inrValue.toFixed(2) 
					};
				});
		
				priceoneValue = originalPricing[0]?.USD || "";
			} else {
				processedPricing = originalPricing;
			}
		}
		
  
		  const productEntry = {
			id: baseProduct._id.toString(),
			image: baseProduct.image || null,
			description: baseProduct.prodDesc || null,
			productName: baseProduct.productName,
			productNumber: baseProduct.productNumber,
			stockId: entry._id.toString(),
			manufacturer: entry.manufacturer ? entry.manufacturer.toString() : null,
			distributer: entry.distributor ? entry.distributor.toString() : null,
			stock: entry.stock || 0,
			priceone: priceoneValue, 
			pricing: processedPricing
		  };
		  
		  console.log('Final product entry structure:', JSON.stringify({
			id: productEntry.id,
			productName: productEntry.productName,
			priceone: productEntry.priceone,
			pricing: productEntry.pricing
		  }, null, 2));
		  
		  enrichedProducts.push(productEntry);
		}
	  }
  
	  return enrichedProducts;
	} catch (error) {
	  throw new Error('An error occurred while processing the quicksearch.');
	}
  };




// export const uploadFile = async ({ query }) => {
// 	const validQueries = query.filter(([productNumberAndSize, quantity]) =>
// 		productNumberAndSize?.trim() && String(quantity)?.trim()
// 	);
// 	console.log(validQueries, "validone");

// 	if (validQueries.length === 0) {
// 		return validQueries.map(() => ({
// 			productNumber: "Unknown",
// 			isValid: false,
// 			message: "Product number is invalid",
// 		}));
// 	}

// 	const results = [];

// 	for (const [productNumberAndSize, quantity] of validQueries) {
// 		const parts = productNumberAndSize.split('-');
// 		const productNumber = parts.slice(0, parts.length - 1).join('-');
// 		const size = parts[parts.length - 1];
// 		const product = await Product.findOne({ 
// 			productNumber: new RegExp('^' + productNumber.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') 
// 		}).exec();

// 		if (product) {
// 			const stockInfo = await Stock.find({ 
// 				productNumber: product.productNumber 
// 			}).select('id stock pricing distributor manufacturer');
			
// 			console.log(stockInfo, "asadsdsfsdfxdrdr********************8");

// 			let convertedPricing = [];
// 			for (let stock of stockInfo) {
// 				const { pricing = [], distributor, manufacturer } = stock || [];

// 				if (pricing && pricing[0] && pricing[0].INR) {
// 					convertedPricing = convertedPricing.concat(pricing);
// 				} else {
// 					const converted = await convertToINR([pricing] || []);
// 					convertedPricing = convertedPricing.concat(converted);
// 				}

// 				console.log('Distributor:', distributor);
// 				console.log('Manufacturer:', manufacturer);
// 			}

// 			if (stockInfo.length === 0) {
// 				results.push({
// 					productNumber,
// 					quantity: parseInt(quantity),
// 					isValid: false,
// 					message: "Stock information missing",
// 				});
// 				continue;
// 			}
// 			const normalizedUserSize = size.replace(/\s+/g, '').toLowerCase();
// 			const validSizePrice = convertedPricing.find(item => {
// 				const normalizedItemSize = (item.break || '').replace(/\s+/g, '').toLowerCase();
// 				return normalizedItemSize === normalizedUserSize;
// 			});

// 			if (!validSizePrice) {
// 				console.log(`Size ${size} is invalid or not available for product ${productNumber}`);
// 				results.push({
// 					productNumber,
// 					quantity: parseInt(quantity),
// 					isValid: false,
// 					message: `Size ${size} is invalid or not available for product ${productNumber}`,
// 				});
// 				continue;
// 			}

// 			let availableStock = Number(stockInfo[0]?.stock) || 0;
// 			results.push({
// 				id: product._id.toString(),
// 				image: product.imageSrc || "No image available",
// 				description: product.prodDesc || "No description available",
// 				productName: product.productName || "No product name available",
// 				productNumber: product.productNumber, 
// 				quantity: parseInt(quantity),
// 				stockId: stockInfo[0]?.id.toString() || null,
// 				stock: availableStock,
// 				manufacturer: stockInfo[0]?.manufacturer?.toString() || null,
// 				distributer: stockInfo[0]?.distributor?.toString() || null,
// 				isValid: true,
// 				message: "Product number and size are valid",
// 				pricing: [{
// 					break: validSizePrice.break, // Keep the original case for display
// 					price: validSizePrice.INR || "N/A",
// 				}],
// 			});
// 		} else {
// 			results.push({
// 				productNumber: productNumberAndSize,
// 				quantity: parseInt(quantity),
// 				isValid: false,
// 				message: "Product number is invalid",
// 			});
// 		}
// 	}
// 	console.log(results, "results");

// 	return results;
// };
export const uploadFile = async ({ query }) => {
	const validQueries = query.filter(([productNumberAndSize, quantity]) =>
		productNumberAndSize?.trim() && String(quantity)?.trim()
	);
	console.log(validQueries, "validone");

	if (validQueries.length === 0) {
		return validQueries.map(() => ({
			productNumber: "Unknown",
			isValid: false,
			message: "Product number is invalid",
		}));
	}

	const results = [];

	for (const [productNumberAndSize, quantity] of validQueries) {
		let inputStr = productNumberAndSize.trim();
		let productNumber, size;
		const spaceHyphenPattern = /^(.*?)\s+-\s+(.+)$/;
		const spaceHyphenMatch = inputStr.match(spaceHyphenPattern);
		const complexSizePattern = /^([A-Za-z0-9.]+(?:-[A-Za-z0-9.]+)*)-(\d+(?:-[A-Za-z]+)(?:-\d+)?)$/;
		const complexSizeMatch = inputStr.match(complexSizePattern);
		const measurementPattern = /^(.*?)-(\d+[-]?[A-Za-z]+)$/;
		const measurementMatch = inputStr.match(measurementPattern);

		// Updated pattern to handle both "each" and "case" with more flexibility
		const quantityPatterns = [
			/^(.*?)[-\s]+(each\s*(?:of)?\s*[-\s]*\d+|each[-\s]*of[-\s]*\d+|\d+\s*(?:each|pcs|units|items))$/i,
			/^(.*?)[-\s]+(case\s*(?:of)?\s*[-\s]*\d+|case[-\s]*of[-\s]*\d+|\d+\s*(?:case|pcs|units|items))$/i,
			/^(.*?)[-\s]+(pack\s*(?:of)?\s*[-\s]*\d+|pack[-\s]*of[-\s]*\d+|\d+\s*(?:pack|pcs|units|items))$/i

		];

		let eachMatch = null;
		for (const pattern of quantityPatterns) {
			const match = inputStr.match(pattern);
			if (match) {
				eachMatch = match;
				break;
			}
		}

		if (spaceHyphenMatch) {
			productNumber = spaceHyphenMatch[1].trim();
			size = spaceHyphenMatch[2].trim();
		} else if (complexSizeMatch) {
			productNumber = complexSizeMatch[1].trim();
			size = complexSizeMatch[2].trim();
		} else if (measurementMatch) {
			productNumber = measurementMatch[1].trim();
			size = measurementMatch[2].trim();
		} else if (eachMatch) {
			productNumber = eachMatch[1].trim();
			size = eachMatch[2].trim();
		} else {
			const parts = inputStr.split('-');
			if (parts.length >= 2) {
				productNumber = parts.slice(0, parts.length - 1).join('-');
				size = parts[parts.length - 1];
			} else {
				productNumber = inputStr;
				size = "";
			}
		}

		const sizeWithQuantityPattern = /^(.*?)(\d+)$/;
		const sizeWithQuantityMatch = size.match(sizeWithQuantityPattern);

		if (sizeWithQuantityMatch && !quantity) {
			size = sizeWithQuantityMatch[1].trim();
		}

		console.log(`Parsed: Product Number = "${productNumber}", Size = "${size}"`);

		const product = await Product.findOne({
			productNumber: new RegExp('^' + productNumber.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
		}).exec();

		if (product) {
			const stockInfo = await Stock.find({
				productNumber: product.productNumber
			}).select('id stock pricing distributor manufacturer');

			console.log(stockInfo, "asadsdsfsdfxdrdr********************8");

			let convertedPricing = [];
			for (let stock of stockInfo) {
				const { pricing = [], distributor, manufacturer } = stock || [];

				if (pricing && pricing[0] && pricing[0].INR) {
					convertedPricing = convertedPricing.concat(pricing);
				} else {
					const converted = await convertToINR([pricing] || []);
					convertedPricing = convertedPricing.concat(converted);
				}

				console.log('Distributor:', distributor);
				console.log('Manufacturer:', manufacturer);
			}

			if (stockInfo.length === 0) {
				results.push({
					productNumber,
					quantity: parseInt(quantity),
					isValid: false,
					message: "Stock information missing",
				});
				continue;
			}
			const normalizedUserSize = size
				.toLowerCase()
				.replace(/\s+/g, '')
				.replace(/[-_]/g, '')
				.replace(/of/g, '')
				.replace(/each/g, 'each')
				.replace(/ea/g, 'each')
				.replace(/pack/g, 'pack')
				.replace(/pa/g, 'pack')
				.replace(/case/g, 'case')
				.replace(/ca/g, 'case');

			let validSizePrice = convertedPricing.find(item => {
				const normalizedItemSize = (item.break || '')
					.toLowerCase()
					.replace(/\s+/g, '')
					.replace(/[-_]/g, '')
					.replace(/of/g, '')
					.replace(/each/g, 'each')
					.replace(/ea/g, 'each')
					.replace(/pack/g, 'pack')
					.replace(/pa/g, 'pack')
					.replace(/case/g, 'case')
					.replace(/ca/g, 'case');

				return normalizedItemSize === normalizedUserSize;
			});

			if (!validSizePrice && normalizedUserSize) {
				console.log(`No exact size match for ${size}, trying partial match...`);
				const partialMatch = convertedPricing.find(item => {
					const normalizedItemSize = (item.break || '')
						.toLowerCase()
						.replace(/\s+/g, '')
						.replace(/[-_]/g, '')
						.replace(/of/g, '')
						.replace(/each/g, 'each')
						.replace(/ea/g, 'each')
						.replace(/pack/g, 'pack')
						.replace(/pa/g, 'pack')
						.replace(/case/g, 'case')
						.replace(/ca/g, 'case');
					return normalizedItemSize.includes(normalizedUserSize) ||
						normalizedUserSize.includes(normalizedItemSize);
				});

				if (partialMatch) {
					console.log(`Found partial match: ${partialMatch.break}`);
					validSizePrice = partialMatch;
				}
			}

			if (!validSizePrice) {
				console.log(`Size ${size} is invalid or not available for product ${productNumber}`);
				results.push({
					productNumber,
					quantity: parseInt(quantity),
					isValid: false,
					message: `Size ${size} is invalid or not available for product ${productNumber}`,
				});
				continue;
			}

			let availableStock = Number(stockInfo[0]?.stock) || 0;
			results.push({
				id: product._id.toString(),
				image: product.image || "No image available",
				description: product.prodDesc || "No description available",
				productName: product.productName || "No product name available",
				productNumber: product.productNumber,
				quantity: parseInt(quantity),
				stockId: stockInfo[0]?.id.toString() || null,
				stock: availableStock,
				manufacturer: stockInfo[0]?.manufacturer?.toString() || null,
				distributer: stockInfo[0]?.distributor?.toString() || null,
				isValid: true,
				message: "Product number and size are valid",
				pricing: [{
					break: validSizePrice.break,
					price: validSizePrice.INR || "N/A",
				}],
			});
		} else {
			results.push({
				productNumber: productNumberAndSize,
				quantity: parseInt(quantity),
				isValid: false,
				message: "Product number is invalid",
			});
		}
	}
	console.log(results, "results");

	return results;
};

export const CreateProductQuote = async (formattedData) => {
	const newQuote = new Quotes(formattedData);
	await newQuote.save();
	return { status: 200 };
};


export const saveMailId = async (body) => {
	// console.log(body);
	
	const newSearchQuery = new SearchQueries(body);
	// console.log(newSearchQuery);
	
	await newSearchQuery.save();
	return { status: 200 };
};

export const addToCart = async(item,userId,userEmail)=>{
	const search = await Cart.findOne({userId,userEmail,isActiveCart:true}).lean()
	// const id = await Stock.findOne({productid:item.productId,manufacturer:item.manufacturerId},{distributor:1})
    // item.distributorId = id.distributor
	let cart
	if(search === null){
		cart = await Cart.create({cartId:nanoid(8),cartName:"mycart",cartItems:item,userId,userEmail,isActiveCart:true})
		return {success:true,message:"Product is added to cart2"}
	}else{
		const findItem = search.cartItems.find(x=>x.stockId.toString() === item.stockId)
	   console.log(item,"sdffffffffff",findItem);
		if(findItem === undefined){
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$push:{cartItems:item}},{new:true})
		return {success:true,message:"Product is added to cart"}
		}else{
		 findItem.quantity = item.quantity
		 findItem.backOrder = item.backOrder
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$set:{cartItems:search.cartItems}},{new:true})
		return {success:true,message:"Product quantity is updated in cart"}
		}
	}
} 

export const updateItemQty = async(body,userId)=>{
	const {quantity,_id,cartId,stock} = body
	const backOrder = quantity > stock ? quantity - stock : 0;
	const cart = await Cart.findOneAndUpdate(
		{userId,cartId,isActiveCart:true,'cartItems._id': _id},
		{ $set: { 'cartItems.$.quantity': quantity, 'cartItems.$.backOrder': backOrder }},
		{new:true}
	)
	return {success:true}
}

export const deleteAllFromCart = async (body, userId) => {
	const { cartId } = body;
	const result = await Cart.findOneAndUpdate(
		{ userId, cartId,isActiveCart:true },
		{ $set: { cartItems: [] } },
		{ new: true }
	);
	console.log(result);
	return { success:true, message: `All components are deleted` };
};

export const deleteOneFromCart = async (body, userId) => {
	const {productNumber,_id,cartId} = body;
	const result = await Cart.findOneAndUpdate(
		{ userId, cartId },
		{ $pull: { cartItems: { _id }}},
		{ new: true }
	);
	//console.log(result);
	return {success:true, message: `${productNumber} is removed from Cart` };
};

export const getGuestCart = async(body)=>{
	const arr = []
	for(let {productId,manufacturerId,distributorId,quantity} of body){
	const productDetails = await Product.findOne({_id:productId},{imageSrc:1,productName:1,productNumber:1,_id:0})
	const stockDetails = await Stock.findOne({productid:productId,distributor:distributorId},{_id:0,stock:1,orderMultiple:1,pricing:1})
	const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
	console.log(stockDetails);
	let pricing = stockDetails?.pricing
	if(pricing.INR !== undefined && pricing.INR !== null){
		pricing.USD = pricing.INR/currency.rate
	  }else{
	   pricing.INR = pricing.USD * currency.rate;
	  }
	 let totalINR = pricing.INR * quantity;
	 let totalUSD = pricing.USD * quantity;

	  let result ={
		productDetails,
		stockDetails,
		manufacturerId,
		quantity,
		currentPrice:{INR:pricing.INR,USD:pricing.USD},
		normalPrice:{INR:pricing.INR,USD:pricing.USD},
		pricing,
		itemTotalPrice:{totalINR,totalUSD}
	  }
      arr.push(result)
	}
	///console.log(arr);
	return {cart:JSON.parse(JSON.stringify(arr))}
}

export const addItemsToExistingCart = async(body,cartId)=>{
	const updatedCart = await Cart.findOneAndUpdate(
		{ cartId:cartId },  // Find the cart by its ID
		{
		  $addToSet: {
			cartItems: { $each: body }  // Add multiple items only if they don't already exist in the array
		  }
		},
		{ new: true }  // Return the updated document
	)
	//console.log(updatedCart);
	return { success:true}
}

export const addItemsToNewCart = async(body,userId,userEmail)=>{
		const cartId = nanoid(8)
		const cartName = ""
		await Cart.updateMany(
			{ userId: userId }, 	
			{ $set: { isActiveCart: false } } 
		);
		const newCart = await Cart.create({
			userId,
			userEmail,
			cartId,
			cartName,
			isActiveCart:true,
			cartItems:body
		})
	return { success:true}
}

export const updateShippingAddress = async (body) => {
	const { userId, addAlternate, ...shippingDetails } = body
	try {
		const userProfile = await Profile.findById(userId).select('shippingAddress');
		if (!userProfile) {
			return { field: 'shipping', success: false, message: 'User not found' };
		}

		userProfile.shippingAddress = shippingDetails;
		await userProfile.save();
		return {
			field: 'shipping',
			success: true,
			message: 'Added address successfully'
		};
	} catch (error) {
		console.error('Error updating shipping address:', error);
		return { field: 'shipping', success: false, message: 'Something went wrong' };
	}
};

export const updateBillingAddress = async (body) => {
	const { userId, addAlternate, ...billingDetails } = body;
	
	try {
		const userProfile = await Profile.findById(userId).select('billingAddress');
		if (!userProfile) {
			return { field: 'billing', success: false, message: 'User not found' };
		}
		userProfile.billingAddress = billingDetails;
		await userProfile.save();
		return {
			field: 'billing',
			success: true,
			message:'Added address successfully'
		};
	} catch (error) {
		console.error('Error updating billing address:', error);
		return { field: 'billing', success: false, message: 'Something went wrong' };
	}
};

export const addRecurrence = async (body, userId) => {
	const { cartId,recurring, startingDate,recurringDate } = body;
    let recurrence = {} 
	const search = await Cart.findOne({userId,cartId,recurrence:{$exists:true}})
	const tog = search?.recurrence ? 'updated' : 'added';
	if(search === null){
		recurrence = {
			recurring,
			recurringDate,
			previousRecurringDate:startingDate,
			addedDate: startingDate
		}
	}else{
		recurrence = {
			recurring,
			recurringDate,
			previousRecurringDate:startingDate,
			addedDate: search.recurrence.addedDate
		}
	}
	const recure = await Cart.findOneAndUpdate({ userId, cartId },{ $set: { recurrence }});
	
	if (recure) {
		return { success: true, msg: `Recurrence is ${tog} successfully` };
	}
};

export const deleteRecurrence = async(body)=>{
	const {cartId} = body
	const deleteRecurrence =  await Cart.updateOne({ cartId },{ $unset: { recurrence: 1 } });
	//console.log(deleteRecurrence,"fff");   
	return { success: true, msg: `Recurrence deleted successfully` };
}


export const addToCartquick = async(item,userId,userEmail)=>{
	const search = await Cart.findOne({userId,userEmail,isActiveCart:true}).lean()
	let cart
	if(search === null){
		cart = await Cart.create({cartId:nanoid(8),cartName:"mycart",cartItems:item,userId,userEmail,isActiveCart:true})
		return {success:true,message:"Product is added to cart2"}
	}else{
		const findItem = search.cartItems.find(x=>x.stockId.toString() === item.stockId)
	   console.log(item,"sdffffffffff",findItem);
		if(findItem === undefined){
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$push:{cartItems:item}},{new:true})
		return {success:true,message:"Product is added to cart"}
		}else{
		 findItem.quantity = item.quantity
		 findItem.backOrder = item.backOrder
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$set:{cartItems:search.cartItems}},{new:true})
		return {success:true,message:"Product quantity is updated in cart"}
		}
	}
} 

export const resumeCart = async (cartId, userId) => {
	if (!cartId || !userId) {
		throw new Error('Cart ID and User ID are required');
	}
	try {
		const result = await Cart.findOneAndUpdate(
			{ _id: cartId, userId: userId },
			{
				$set: {
					isActiveCart: true,
					updatedAt: new Date()
				}
			},
			{ new: true }
		).lean();

		if (!result) {
			throw new Error('Cart not found or unauthorized');
		}

		await Cart.updateMany(
			{ userId: userId, _id: { $ne: cartId } },
			{ $set: { isActiveCart: false } }
		);

		return { status: 200, result };
	} catch (error) {
		console.error('Error resuming cart:', error);
		throw error;
	}
};

export const updateCart = async (cartId) => {
	try {
		const result = await Cart.findByIdAndUpdate(
			cartId,
			{
				$set: {
					isDeleted: true,
					isActiveCart: false,
					updatedAt: new Date()
				}
			},
			{ new: true }
		);

		if (!result) {
			throw new Error('Cart not found');
		}

		return result;
	} catch (error) {
		console.error('Error updating cart status:', error);
		throw error;
	}
};

export const updateCartName = async (cartId, cartName) => {
	try {
	  const result = await Cart.findByIdAndUpdate(
		cartId,
		{
		  $set: {
			cartName: cartName,
			updatedAt: new Date()
		  }
		},
		{ new: true }
	  );
	   
	  if (!result) {
		throw new Error('Cart not found');
	  }
  
	  return result;
	} catch (error) {
	  console.error('Error updating cart name:', error);
	  throw error;
	}
};
export const createNewCart = async (body) => {
    try {
        const { userId, userEmail, customCartName } = body;

        if (!userId || !userEmail) {
            return { 
                success: false, 
                error: 'Missing required fields: userId or userEmail.' 
            };
        }

        const updateResult = await Cart.updateMany(
            { userId, isActiveCart: true }, 
            { $set: { isActiveCart: false } }
        );
        // console.log(`Deactivated ${updateResult.modifiedCount} cart(s)`);

        const cartId = nanoid(8);

        const cartName = customCartName && customCartName.length > 0 
		? customCartName 
		: `MyCart`;

        const newCart = await Cart.create({
            userId,
            userEmail,
            cartId,
            cartName,
            isActiveCart: true
        });

        return { 
            success: true, 
            cartId: newCart.cartId, 
            message: 'Cart created successfully.' 
        };
    } catch (err) {
        console.error('Error creating new cart:', err);
        return { 
            success: false, 
            error: 'Failed to create new cart. Please try again later.' 
        };
    }
};

export const updateRecurrence = async (body ) => {
	const { cartId, recurring, dayOfMonth, recurringDate } = body;
	
	try {
	  const existingCart = await Cart.findOne({ _id: cartId });
	  
	  if (!existingCart) {
		return {
		  success: false,
		  msg: 'Cart not found'
		};
	  }
	  
	  const currentDate = new Date();
	  
	  const recurrenceData = {
		recurring: recurring,
		recurringDate: recurringDate || calculateRecurringDate(recurring, dayOfMonth),
		previousRecurringDate: currentDate,
		addedDate: existingCart.recurrence?.addedDate || currentDate
	  };
	  
	  const updatedCart = await Cart.findOneAndUpdate(
		{ _id: cartId },
		{ $set: { recurrence: recurrenceData } },
		{ new: true }
	  );
	  
	  if (!updatedCart) {
		return {
		  success: false,
		  msg: 'Failed to update recurrence'
		};
	  }
	  
	  const action = existingCart.recurrence ? 'updated' : 'added';
	  return {
		success: true,
		msg: `Recurrence ${action} successfully`,
		data: updatedCart.recurrence
	  };
	} catch (error) {
	  console.error('Error in updateRecurrence:', error);
	  return {
		success: false,
		msg: 'An error occurred while processing recurrence'
	  };
	}
};
  
export const deleteCartRecurrence = async (cartId ) => {
	try {
	  const existingCart = await Cart.findOne({ _id: cartId });
	  
	  if (!existingCart) {
		return {
		  success: false,
		  msg: 'Cart not found'
		};
	  }
	  
	  const updatedCart = await Cart.findOneAndUpdate(
		{ _id: cartId },
		{ $unset: { recurrence: 1 } },
		{ new: true }
	  );
	  
	  if (!updatedCart) {
		return {
		  success: false,
		  msg: 'Failed to remove recurrence'
		};
	  }
	  
	  return {
		success: true,
		msg: 'Recurrence removed successfully',
		data: null
	  };
	} catch (error) {
	  console.error('Error in deleteCartRecurrence:', error);
	  return {
		success: false,
		msg: 'An error occurred while removing recurrence'
	  };
	}
};
  
function calculateRecurringDate(recurring, dayOfMonth) {
	const today = new Date();
	const futureDate = new Date();
	futureDate.setMonth(today.getMonth() + recurring);
	
	const targetDay = parseInt(dayOfMonth) || today.getDate();
	const lastDayOfTargetMonth = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0).getDate();
	const adjustedDay = Math.min(targetDay, lastDayOfTargetMonth);
	
	futureDate.setDate(adjustedDay);
	
	return futureDate;
}

export const submitFeedback = async (data) => {
	try {
	  const newFeedback = new Feedback(data); // Use the Feedback model here
	  const savedFeedback = await newFeedback.save();
	  console.log("savedFeedback",savedFeedback);
	  
	  return savedFeedback;
	} catch (error) {
	//   console.error('Error saving feedback:', error);
	  throw new Error('Failed to save feedback information');
	}
  };

  export const createShareCart = async(userId,userEmail,cartId)=>{
	const sharecart = await Cart.findOne({cartId})

	const cartItems = sharecart.cartItems.map(cart=>{
		cart.isQuote = false
		cart.isCart = false
		cart.cartOfferPrice = {INR:0,USD:0}
		cart.offerPrice = {INR:0,USD:0}
		cart.bomOfferPrice = {INR:0,USD:0}
		return cart
	})
	const newcart = await Cart.create({
		userId,
		userEmail,
		cartId:nanoid(8),
		cartName:"mycart",
		isActiveCart:true,
		cartItems
	});
	//console.log(newcart);
	const remove = await Cart.updateOne({userId,isActiveCart:true},{isActiveCart:false})
	if(newcart.userId === userId && remove.acknowledged){
		return {success:true}
	}else{
		return {success:false}
	}
}

export const addNewRecurrenceDate = async(userId,body) =>{
	const {cartId,newDate} = body
	
	const findCart = await Cart.findOne({cartId})
	let timePortion = findCart.recurrence.recurringDate.toISOString().split("T")[1]
	let updatedDateTime = newDate + "T" + timePortion;
    const findcart = await Cart.findOne({cartId,'recurrenceLogs.recurringDate':findCart.recurrence.recurringDate,'recurrenceLogs.action':"Extended Date"})
	if(findcart?._id){
	    return { success:true,message:"Recurrence date is already updated"}
	}
    await Cart.findOneAndUpdate({cartId},
		{'recurrence.recurringDate':updatedDateTime,
		$push:{recurrenceLogs:{recurringDate:findCart.recurrence.recurringDate,action:"Extended Date"}}},{new:true})
	return { success:true,message:"Recurrence date updated successfully"}
}

export const addRecurrenceReject = async(userId,body) =>{
	const {cartId,recurringDate} = body
	const findcart = await Cart.findOne({cartId,'recurrenceLogs.recurringDate':recurringDate,'recurrenceLogs.action':"Rejected"})
	console.log(findcart);
	if(findcart?._id){
	    return { success:true,message:"Recurrence is already rejected"}
	}
    await Cart.findOneAndUpdate({cartId},{$push:{recurrenceLogs:{recurringDate,action:"Rejected"}}},{new:true})
	await sendEmail("Recurrence Order Rejected","recurrence order is rejected by user","yusuf@partskeys.com")
	return { success:true,action:"reject",message:"Recurrence date updated successfully"}
}
export const recurrenceCartActive = async(userId,body) =>{
	const {cartId,recurringDate} = body
	const findcart = await Cart.findOne({cartId,'recurrenceLogs.recurringDate':recurringDate,'recurrenceLogs.action':"Accepted"})
	if(findcart?._id){
	    return { success:true,message:"Recurrence order is completed"}
	}
    await Cart.findOneAndUpdate({userId,isActiveCart:true},{isActiveCart:false})
    await Cart.findOneAndUpdate({cartId},{isActiveCart:true,$push:{recurrenceLogs:{recurringDate,action:"Accepted"}}})
	return { success:true,action:"accept",message:"Recurrence date updated successfully"}
}

export const getMyFavorites = async(userId) => {
	const myFav = await MyFavourites.findOne({userId},{favorite:1,_id:0}).lean()
	let favorite = JSON.parse(JSON.stringify(myFav.favorite.map(x=>x.stockId)))
	return {favorite}
}