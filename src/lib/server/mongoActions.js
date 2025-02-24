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
import TokenVerification from '$lib/server/models/TokenVerification.js';
import MyFavourites from '$lib/server/models/MyFavourite.js';
import ChemiDashProfile from '$lib/server/models/ChemiDashProfile.js';
import Curconversion from "$lib/server/models/Curconversion.js";
import { redirect, error } from '@sveltejs/kit';
import Cart from "$lib/server/models/Cart.js"
import Distributor from "$lib/server/models/Distributor.js"
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
// import { lucia } from 'lucia';
import {
	APP_URL,
	SENDER_EMAIL,
	SENDER_PASSWORD,
	WEBSITE_NAME,
	MAIL_HOST
} from '$env/static/private';
import Return from '$lib/server/models/Return.js';
import { auth } from '$lib/server/lucia.js';


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

export async function checkavailabilityproduct(data) {
	// console.log(data);
	const stockRecord = await Stock.findOne({ productNumber: data.ProductId }).exec();
	// console.log('stockRecord:', stockRecord);
	const stockQuantity = stockRecord.stock;
	// console.log(stockQuantity,"stockQuantity");

	if (!stockRecord) {
		return { message: 'Out of stock', type: 'error' };
	}

	if (stockQuantity > 0) {
		return { message: `${stockQuantity} Quantity is Available to ship.`, type: 'success' };
	} else {
		return { message: `Out of Stock`, type: 'error' };
	}
}

export async function favorite(favdata) {
	const authedUser = favdata.authedEmail;
  
	if (authedUser) {
		const chemiDashProfileId = await Profile.findOne({ email: authedUser });
		const userId = chemiDashProfileId.userId;
		// console.log(userId, "userId");
		const existingRecord = await MyFavourite.findOne({ userId: userId });
		// console.log("existingRecord", existingRecord);
  
		const favoriteItem = {
		  productDesc: favdata.productDesc,
		  id: favdata.id,
		  imgUrl: favdata.imgUrl,
		  productName: favdata.productName,
		  productNumber: favdata.productNumber,
		  priceSize: { price: favdata.price, size: favdata.size },
		  quantity: favdata.quantity,
		  stock: favdata.stock,
		};
		let updatedFavorites = [];
		let isFavorite = false;
		if (existingRecord) {
		  if (!Array.isArray(existingRecord.favorite)) {
			existingRecord.favorite = [];
		  }
		  updatedFavorites = existingRecord.favorite.filter(
			(item) => item.id !== favdata.id
		  );
		  isFavorite =
			updatedFavorites.length !== existingRecord.favorite.length;
  
		  if (isFavorite) {
			existingRecord.favorite = updatedFavorites;
			await existingRecord.save();
			return { type: "success", message: "Removed from favorites!" };
		  } else {
			updatedFavorites = [...existingRecord.favorite, favoriteItem];
			existingRecord.favorite = updatedFavorites;
			await existingRecord.save();
		  }
		} else {
		  await MyFavourite.create({
			userId: chemiDashProfileId.userId,
			favorite: [favoriteItem],
		  });
		}
		return { type: "success", message: "Added to favorites!" };
	}
}

export const checkoutOrder = async (order) => {
	try {
		const newOrder = await Order.create(order);
        for(let rec of order.orderdetails){
			const stock = await Stock.findOneAndUpdate({_id:rec.stockId},{$inc:{orderedQty:rec.orderQty}},{new:true})
			console.log(stock);
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
		console.error('Error creating order:', error);
		return { success: false, message: 'Something went wrong' };
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

	console.log(productObj);
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
			const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/profile';
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

export async function register(body, cookies) {
	const data = body;
	let isRedirect = false;

	// Default site preferences
	let sitePreferences = {
		noOfOrdersPerPage: 3,
		noOfQuickOrderFields: 3,
		noOfQuotesPerPage: 3,
		productEntryType: 'Manual Entry'
	};

	try {
		const findUser = await Register.findOne({
			email: data.email,
			password: data.password
		});
		if (findUser !== null) {
			return { success: false, message: 'User already exist' };
		}

		const user = await Register.create(data);
		const profile = await Profile.create({
			userId: user._id,
			email: user.email,
			sitePreferences
		});

		user.chemiDashProfileId = profile._id;
		await user.save();

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
		isRedirect = true;

		// if (verificationResult.success) {
		//     return { success: true, message: "Check your email to verify your email address" };
		// } else {
		//     return { success: false, message: "Verification email was not sent" };
		// }
	} catch (error) {
		console.log('Error during registration:', error);
		return { success: false, message: 'An error occurred during registration' };
	}
	if (isRedirect) {
		return redirect(302, '/profile');
	}
}

// profile action functions
export async function editProfileContact(body) {
	const { recordId, ...contact } = body;

	try {
		const result = await Profile.findByIdAndUpdate(recordId, contact, {
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
	const queryFilter = {
		$or: [
			{ productName: { $regex: body.query, $options: 'i' } },
			{ productNumber: { $regex: body.query, $options: 'i' } },
			{ CAS: { $regex: body.query, $options: 'i' } }
		]
	};

	try {
		const result = await Product.find(queryFilter)
			.limit(5)
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
		const formData = await data.formData();
		const formEntries = Object.fromEntries(formData.entries());
		const response = await CopyConsent.create(formEntries);
		return { status: 200, body: { success: true, response } };
	} catch (error) {
		console.error('Error saving form data:', error);
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
			lgc: data.lgc,
			email: data.email,
			number: data.number
		},
		Delivery_information: {
			Address1: data.address1,
			Address2: data.address2,
			Country1: data.country1,
			County: data.county,
			City: data.city,
			Post: data.post
		}
	};
	const newQuote = new Quotes(formattedData);
	try {
		await newQuote.save();
		return { success: true, message: 'Quote added successfully' };
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
		return { success: true, record };
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
	//console.log(email);
	const token = uuidv4();
	// Set the expiry time (5 minutes from now)
	const expiry = new Date(Date.now() + 15 * 60 * 1000);
	//console.log(token,expiry);
	// Store the token and expiry in the database
	const verification = await TokenVerification.create({
		email,
		token,
		expiry,
		verificationType: verifyType,
		userId
	});
	console.log('-------', verification, body);
	// Send the email with the verification link
	const transporter = nodemailer.createTransport({
		host: MAIL_HOST, // Replace with your email provider's SMTP host
		port: 587, // Typically 587 for TLS, or 465 for SSL
		secure: false, // Set true for port 465 (SSL), false for other ports
		auth: {
			user: SENDER_EMAIL, // Replace with your email address
			pass: SENDER_PASSWORD // Replace with your email account's password
		}
	});
	//console.log('=======',transporter);
	const mailOptions = {
		from: SENDER_EMAIL,
		to: email,
		subject: `Password Reset Request for Your ${WEBSITE_NAME} Account `,
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
			  <a href="${APP_URL}/reset-password?token=${token}" style="display: inline-block; background-color: #fe5939; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
				Reset Password
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
			message: 'Password verification token is sent to your email. Please verify.'
		};
	} catch (err) {
		console.error(err);
		throw error(500, { message: 'Something went wrong. try again later' });
	}
};

export const userUpdatePassword = async (body) => {
	const { userId, email, newPassword } = body;
	console.log(email, newPassword);
	//Initialize Lucia with Mongoose adapter
	// const auth = new Lucia({
	// 	adapter: 'mongoose',
	// 	database: '' // MongoDB URL
	// });

	try {
		// Update the password using Lucia's built-in method
		await auth.updateKeyPassword('email', email, newPassword);

		// Optionally, invalidate any existing sessions after password change
		await auth.invalidateSession(userId); // Optional, for security
		console.log('Password updated successfully.');
		throw redirect(302, '/profile');
	} catch (error) {
		console.error('Error updating password:', error);
	}
};

//returns starts
export const getReturnresultData = async (body) => {
	try {
		const invoiceNumber = parseInt(body.invoiceNumber);
		const record = await Order.findOne({ invoice: invoiceNumber });
		if (record) {
			return {
				redirectTo: `/returns/${record.invoice}`
			};
		} else {
			return { message: 'Return-Order not found' };
		}
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
			console.log('item', item);

			if (item.productNumber) {
				const processedItem = {
					productNumber: item.productNumber,
					productName: item.productName,
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

export const getcancelreturnData = async ({ id }) => {
	try {
		const deletedRecord = await Return.findByIdAndDelete(id);
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

export async function quickcheck(data) {
	const { ProductId, quantity } = data;

	// console.log('ProductId from actions:', ProductId);

	if (!ProductId || !quantity) {
		return {
			type: 'error',
			message: 'Product ID and Quantity are required.'
		};
	}

	const requestedQuantity = parseInt(quantity, 10);

	try {
	
		// console.log(`Querying stock with ProductId: ${ProductId}`);

	
		const stockRecord = await Stock.findOne({ productNumber: ProductId }).exec();

		// console.log('Stock Record:', stockRecord);

		if (!stockRecord) {
			console.log(`No stock record found for ProductId: ${ProductId}`);
			return {
				message: 'Out of stock',
				stock: 'Unavailable',
				type: 'error'
			};
		}

		const stockQuantity = stockRecord.stock;

		if (stockQuantity > 0) {
			if (requestedQuantity <= stockQuantity) {
				return {
					message: `${stockQuantity} is avilable to ship`,
					stock: 'Available',
					type: 'success'
				};
			} else {
				return {
					message: `Only ${stockQuantity} units available.`,
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
export const deleteFavoriteItem = async (itemId, userId) => {
	try {
		const updatedDoc = await MyFavourite.findOneAndDelete(
			{ userId: userId },
			{ $pull: { favorite: { id: itemId } } },
			{ new: true }
		);
		if (!updatedDoc) {
			throw new Error('User favorites not found');
		}
		return {
			status: 'success',
			message: 'Item deleted successfully',
			favorite: updatedDoc.favorite
		};
	} catch (error) {
		console.error('Error deleting favorite item:', error);
		throw error;
	}
};

export const clearAllFavorites = async (userId) => {
	try {
		const updatedDoc = await MyFavourite.findOneAndDelete(
			{ userId: userId },
			{ $set: { favorite: [] } },
			{ new: true }
		);
		if (!updatedDoc) {
			throw new Error('User favorites not found');
		}
		return {
			status: 'success',
			message: 'All favorite items deleted successfully',
			favorite: []
		};
	} catch (error) {
		console.error('Error deleting all favorite items:', error);
		throw error;
	}
};
//Myfavouries actions ends

export const quicksearch = async ({ query }) => {
	try {
   
	  const queryFilter = { productNumber: { $regex: query, $options: 'i' } };
	  const products = await Product.find(queryFilter)
		.select('productName productNumber prodDesc _id imageSrc')
		.limit(20)
		.exec();
  
	  const enrichedProducts = [];
	  for (let product of products) {
		const stockInfo = await Stock.findOne({ productNumber: product.productNumber }).select('stock pricing');
		const convertedPricing = await convertToINR(stockInfo?.pricing || []);
  
		
  
		const enrichedProduct = {
		  id: product._id.toString(),
		  image: product.imageSrc,
		  description: product.prodDesc,
		  productName: product.productName,
		  productNumber: product.productNumber,
		  stock: stockInfo?.stock || 0,
		  pricing: convertedPricing,
		};
  
		enrichedProducts.push(enrichedProduct);
	  }
	//   console.log(enrichedProducts);
	  
  
	  return enrichedProducts;
	} catch (error) {
	  // console.error('An error occurred while processing the quicksearch:', error);
	  throw new Error('An error occurred while processing the quicksearch.');
	}
  };




  export const uploadFile = async ({ query }) => {
	// console.log("Received queries:", query);
  
	const validQueries = query.filter(([productNumberAndSize, quantity]) =>
	  productNumberAndSize?.trim() && quantity?.trim()
	);
  
	if (validQueries.length === 0) {
	  return validQueries.map(() => ({
		productNumber: "Unknown",
		isValid: false,
		message: "Product number is invalid",
	  }));
	}
  
	const queryFilter = {
	  productNumber: { $in: validQueries.map(([productNumberAndSize]) => new RegExp(productNumberAndSize.split('-')[0], "i")) },
	};
  
	try {
	  const products = await Product.find(queryFilter).exec();
	  const results = [];
  
	  for (const [productNumberAndSize, quantity] of validQueries) {
		const [productNumber, size] = productNumberAndSize.split('-');
		const product = products.find(
		  (p) => p.productNumber.toLowerCase() === productNumber.toLowerCase()
		);
  
		if (product) {
		//   console.log("Searching for stock for product number:", product.productNumber); 
  
		  const stockInfo = await Stock.findOne({
			productNumber: product.productNumber,
		  }).select("stock pricing");
  
		//   console.log("Found stock info:", stockInfo); // Log the found stock info
  
		  if (!stockInfo) {
			results.push({
			  productNumber,
			  isValid: false,
			  message: "Stock information missing",
			});
			continue;
		  }
  
		  let stockMessage = "";
		  let availableStock = Number(stockInfo.stock) || 0; 
		  let sizeFound = false;
		  const normalizedSize = size.replace(/\s+/g, '').toUpperCase();
  

		  const convertedPricing = await convertToINR(stockInfo.pricing || []);
		  const validSizePrice = convertedPricing.find(item => 
			item.break.replace(/\s+/g, '').toUpperCase() === normalizedSize
		  );
  
		  if (!validSizePrice) {
			results.push({
			  productNumber,
			  isValid: false,
			  message: `Size ${size} is invalid or not available for product ${productNumber}`,
			});
			continue;
		  }

		  const uploadedQuantity = parseInt(quantity);  // Directly use quantity from query
		//   console.log("Uploaded Quantity for", productNumberAndSize, ":", uploadedQuantity); // Debugging uploaded quantity
  
		 
		//   console.log(`Comparing uploadedQuantity (${uploadedQuantity}) with availableStock (${availableStock}) for product ${productNumber}`);
  
		  if (uploadedQuantity > availableStock) {
			stockMessage = `Only ${availableStock} units are available for product ${productNumber}. Uploaded quantity: ${uploadedQuantity}`;
			results.push({
			  productNumber,
			  isValid: false,
			  message: stockMessage,  
			});
			continue;
		  } else if (availableStock === 0) {
			stockMessage = `No stock available for product ${productNumber}. Available stock: ${availableStock}`;
			results.push({
			  productNumber,
			  isValid: false,
			  message: stockMessage,  
			});
			continue;
		  } else {
			stockMessage = `Stock is sufficient for product ${productNumber}. Uploaded quantity: ${uploadedQuantity}, Available stock: ${availableStock}`;
		  }

		  results.push({
			id: product._id.toString(),
			image: product.imageSrc || "No image available",
			description: product.prodDesc || "No description available",
			productName: product.productName || "No product name available",
			productNumber,
			isValid: true,
			message: "Product number is valid",
			stock: availableStock,
			pricing: [{
			  break: validSizePrice.break,
			  price: validSizePrice.INR || "N/A",  
			}],
			stockMessage: stockMessage, 
		  });
		} else {
		  results.push({
			productNumber,
			isValid: false,
			message: "Product number is invalid",
		  });
		}
	  }
  
	//   console.log("Final Results:", results); 
	  return results;
	} catch (error) {
	//   console.error("Error fetching products or stock/pricing:", error);
	  return query.map(() => ({
		productNumber: "Unknown",
		isValid: false,
		message: "Error processing the product",
	  }));
	}
  };

export const CreateProductQuote = async (formattedData) => {
	const newQuote = new Quotes(formattedData);
	await newQuote.save();
	return { status: 200 };
};

export const addToCart = async(item,userId,userEmail)=>{
	const search = await Cart.findOne({userId,userEmail,isActiveCart:true}).lean()
	// const id = await Stock.findOne({productid:item.productId,manufacturer:item.manufacturerId},{distributor:1})
    // item.distributorId = id.distributor
	let cart
	if(search === null){
		cart = await Cart.create({cartId:nanoid(8),cartName:"mycart",cartItems:item,userId,userEmail,isActiveCart:true})
		return {success:true,message:"Product is added to cart"}
	}else{
		const findItem = search.cartItems.find(x=>x.productId.toString() === item.productId)
		//console.log(searchsssss,"sdffffffffff");
		if(findItem === undefined){
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$push:{cartItems:item}},{new:true})
		return {success:true,message:"Product is added to cart"}
		}else{
		cart = await Cart.findOneAndUpdate({userId,userEmail,isActiveCart:true},{$set:{cartItems:item}},{new:true})
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
	console.log(result);
	return {success:true, message: `${productNumber} is removed from Cart` };
};

export const getGuestCart = async(body)=>{
	const arr = []
	for(let {productId,manufacturerId,distributorId,quantity} of body){
	const productDetails = await Product.findOne({_id:productId},{imageSrc:1,productName:1,productNumber:1,_id:0})
	const stockDetails = await Stock.findOne({productid:productId,distributor:distributorId},{_id:0,stock:1,orderMultiple:1,pricing:1})
	const currency = await Curconversion.findOne({ currency: 'USD' }).sort({ createdAt: -1 }).exec();
	let pricing = stockDetails.pricing
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
		pricing,
		itemTotalPrice:{totalINR,totalUSD}
	  }
      arr.push(result)
	}
	console.log(arr);
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
	console.log(updatedCart);
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
	const { userId, addAlternate, ...shippingDetails } = body;
	shippingDetails.isDefault = shippingDetails.isDefault === 'true';
	const addAlternateBoolean = addAlternate === 'true';
	console.log(shippingDetails,"details");
	try {
		const userProfile = await Profile.findById(userId).select('shippingAddress');
		if (!userProfile) {
			return { field: 'shipping', success: false, message: 'User not found' };
		}
		let shippingAddressArray;
		if (addAlternateBoolean) {
			if (!userProfile.shippingAddress || userProfile.shippingAddress.length === 0) {
				const newAddress = {
					...shippingDetails,
					addressId: nanoid(8),
					isDefault: true
				};
				shippingAddressArray = [newAddress];
			} else {
				shippingAddressArray = [...userProfile.shippingAddress];
				const newAddress = {
					...shippingDetails,
					addressId: nanoid(8),
					isDefault: shippingDetails.isDefault
				};
				if (newAddress.isDefault) {
					shippingAddressArray = shippingAddressArray.map((addr) => ({
						...addr,
						isDefault: false
					}));
				}
				shippingAddressArray.push(newAddress);
			}
		} else {
			shippingAddressArray = userProfile.shippingAddress.map((adr) => {
				if (adr.addressId === shippingDetails.addressId) {
					return { ...shippingDetails, isDefault: shippingDetails.isDefault };
				} else if (shippingDetails.isDefault) {
					return { ...adr, isDefault: false };
				}
				return adr;
			});
		}
		userProfile.shippingAddress = shippingAddressArray;
		await userProfile.save();
		return {
			field: 'shipping',
			success: true,
			message: addAlternateBoolean ? 'Added address successfully' : 'Updated successfully'
		};
	} catch (error) {
		console.error('Error updating shipping address:', error);
		return { field: 'shipping', success: false, message: 'Something went wrong' };
	}
};

export const updateBillingAddress = async (body) => {
	const { userId, addAlternate, ...billingDetails } = body;
	billingDetails.isDefault = billingDetails.isDefault === 'true';
	const addAlternateBoolean = addAlternate === 'true';
	try {
		const userProfile = await Profile.findById(userId).select('billingAddress');
		if (!userProfile) {
			return { field: 'billing', success: false, message: 'User not found' };
		}
		let billingAddressArray;
		if (addAlternateBoolean) {
			if (!userProfile.billingAddress || userProfile.billingAddress.length === 0) {
				const newAddress = { ...billingDetails, addressId: nanoid(8),isDefault:true};
				billingAddressArray = [newAddress];
			} else {
				billingAddressArray = [...userProfile.billingAddress];
				const newAddress = { ...billingDetails, addressId: nanoid(8),isDefault:billingDetails.isDefault };
				if (newAddress.isDefault) {
					billingAddressArray = billingAddressArray.map((addr) => ({
						...addr,
						isDefault: false
					}));
				}
				billingAddressArray.push(newAddress);
			}
		} else {
			billingAddressArray = userProfile.billingAddress.map((adr) => {
				if (adr.addressId === billingDetails.addressId) {
					return { ...billingDetails, isDefault: billingDetails.isDefault };
				} else if (billingDetails.isDefault) {
					return { ...adr, isDefault: false };
				}
				return adr;
			});
		}
		console.log('object',billingAddressArray);
		userProfile.billingAddress = billingAddressArray;
		await userProfile.save();
		return {
			field: 'billing',
			success: true,
			message: addAlternateBoolean ? 'Added address successfully' : 'Updated successfully'
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
	console.log(deleteRecurrence,"fff");   
	return { success: true, msg: `Recurrence deleted successfully` };
}
