import Pocketbase from 'pocketbase';
//import { DB_URL, DB_USER, DB_PASS } from '$env/static/private';
//const pb = new Pocketbase(`${DB_URL}`);

export const myDetails = async (request, pb) => {
	const data = await request.formData();
	const details = {
		title: data.get('title'),
		firstname: data.get('firstname'),
		lastname: data.get('lastname'),
		mobilenumber: data.get('mobilenumber'),
		email: data.get('email'),
		organizationname: data.get('organizationname'),
		chemikartaccountno: data.get('chemikartaccountno'),
		billingaddress1: data.get('billingaddress1'),
		billingaddress2: data.get('billingaddress2'),
		country: data.get('country'),
		state: data.get('state'),
		city: data.get('city'),
		postcode: data.get('postcode'),
		delivetryaddress1: data.get('delivetryaddress1'),
		delivetryaddress2: data.get('delivetryaddress2')
	};

	try {
		//await pb.admins.authWithPassword(`${DB_USER}`, `${DB_PASS}`);
		const record = await pb.collection('chemikart_mydetails').create(details);
		return { mydetails: { record } };
	} catch (error) {
		console.log(error);
	}
};

//ACTION FUNCTION FOR QUOTES PAGE
export const Addquotes = async (data, pb) => {
	const componentsArray = data['components[]'].split('\n');
	const formattedData = {
		Custom_solution_type: data.solutionValue,
		Custom_format: data.selectedColor,
		Configure_custom_solution: {
			components: componentsArray,
			solvent: data.solvent,
			packagingType: data.packagingType,
			volume: data.volume,
			units: data.units,
			qualityLevel: data.qualityLevel,
			analyticalTechnique: data.analyticalTechnique
		},
		Additional_notes: data.futherdetails,
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
	return await pb.collection('Quote').create(formattedData);
};

export const submitContactForm = async (pb, formData) => {
	const contactData = {
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		email: formData.get('email'),
		phone: formData.get('phone'),
		company: formData.get('company'),
		role: formData.get('role'),
		details: formData.get('details'),
		location: formData.get('location')
	};

	try {
		const record = await pb.collection('ContactRequests').create(contactData);
		return {
			success: true,
			record
		};
	} catch (error) {
		console.log(error.response.data);
		return {
			success: false,
			error: error.response.data || 'An error occurred while submitting your form.'
		};
	}
};

export async function load({}) {
	// await pb.admins.authWithPassword(email, password);
	// const records = await pb.collection('Cart').getFullList(200, {
	// 	sort: '-created'
	// });
	// const results = records.map((record) => {
	// 	return {
	// 		id: record.id,
	// 		name: record.name,
	// 		code: record.code,
	// 		description: record.description,
	// 		price: record.price,
	// 		image: record.image
	// 	};
	// });
	// return {
	// 	records: results
	// };
}

//ORDER STATUS ACTION FUNCTION
export async function fetchorderstatus(orderNumber, pb) {
	const query = orderNumber ? `order_number="${orderNumber}"` : '';
	const record = await pb.collection('order').getFirstListItem(query, {
		fields: 'order_number, order_status'
	});
	return record;
}

//DOCUMENT ACTION FUNCTION
export async function fetchcertificate(inputValue, pb) {
	const records = await pb
		.collection('Products')
		.getFirstListItem(`productNumber="${inputValue}"`, {
			fields: 'safetyDatasheet, productNumber'
		});
	return records;
}

// CONTACT US ACTION FUNCTION
export const submitContactInfo = async (data, pb) => {
	return await pb.collection('ContactUS').create(data);
};

//CHEMIKART SOLUTIONS PAGE CONTACT ACTION FUNCTION
export const submitContactData = async (data, pb) => {
	return await pb.collection('ChemikartSolutions').create(data);
};

// profile page action function

export async function updateprofile1(pb, body) {
	await pb.collection('Register').update(body.userId, body);
	return {
		status: 200
	};
}

export async function updateOrganization1(pb, body) {
	await pb.collection('ChemiDashProfile').update(body.userId, body);
	return {
		status: 200
	};
}

export async function updateShipping1(pb, body) {
	await pb.collection('ChemiDashProfile').update(body.userId, body);
	return {
		status: 200
	};
}

export async function updatedOrder1(pb, body) {
	await pb.collection('ChemiDashProfile').update(body.userId, body);
	return {
		status: 200
	};
}

export async function updatePreferences(pb, body) {
	const preferences = body.preferences;
	const ccAddresses = body.ccAddresses;
	await pb.collection('ChemiDashProfile').update(body.userId, { preferences, ccAddresses });
	return {
		status: 200
	};
}

export async function updatedMethod1(pb, body) {
	await pb.collection('ChemiDashProfile').update(body.userId, body);
	return {
		status: 200
	};
}

export async function checkData(pb, body) {
	const filterString = `${body.transactionType}="${body.transactionValue}" && phone="${body.phone}"`;
	try {
		const linkData = await pb.collection('ChemiDashProfile').getFirstListItem(filterString);
		return linkData;
	} catch (error) {
		if (error.status === 404) {
			return null;
		} else {
			console.error('Unexpected error retrieving data:', error);
			throw error;
		}
	}
}

// profile page end

//CHEMIKART PRODUCTS PAGE FINDING DIFFRENCES  ACTION FUNCTION
export async function fetchProds(pb) {
	const resultList = await pb.collection('Products').getList(1, 10);
	const results = resultList.items.map((record) => ({
		productName: record.productName,
		productNumber: record.productNumber,
		imageSrc: record.imageSrc,
		qualityLevel: record.properties?.QualityLevel,
		form: record.properties?.Form,
		ph: record.properties?.PH,
		priceSize: record.priceSize,
		BiologicalSource: record.properties?.BiologicalSource
	}));
	return results;
}

// Help and Support Page
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

	const finalData = {
		technical_issue: formData.technical_issue,
		issueName: formData.issueName,
		documentRequired: formData.documentRequired,
		currentEmail: formData.currentEmail,
		newEmail: formData.newEmail,
		resetemail: formData.resetemail,
		primaryAddress: formData.primaryAddress,
		updateAddress: formData.updateAddress,
		issue: formData.issue,
		assistance: formData.assistance || '',
		items: items,
		exportMaterial: formData.exportMaterial,
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
		files: formData.files
	};
	return finalData;
}
export const saveContactInfo = async (pb, data) => {
	let finalData = finalformdata(data);
	const record = await pb.collection('helpandSupport').create(finalData);
	return { success: true, record };
};
// Help and Support page end

//******** */ Recommended products
export const fetchrecommended = async (data, pb) => {
	const productsFulldata = await pb.collection('Products').getList(1, 15, {
		filter: `productName="${data.productName}" `,
		expand: `manufacturerName`
	});

	// console.log(productsFulldata);
	const products = productsFulldata.items.map((product) => ({
		productName: product.productName,
		productNumber: product.productNumber,
		manufacturerName: product.expand?.manufacturerName?.name,
		imageSrc: product.imageSrc,
		prodDesc: product.prodDesc || '',
		priceSize: product.priceSize,
		productSynonym: product.filteredProductData[`Synonym(S)`] || ''
	}));
	return products;
};

export const checkavailability = async (data, pb) => {
	const result = await pb
		.collection('Stocks')
		.getFirstListItem(`partNumber.productNumber="${data.productNumber}"`, {
			expand: `partNumber`
		});
	if (result) {
		if (result.stockQuantity >= data.quantity) return result;
	}
};
// *****************/Recommended products end

//shopping cart
export const addItemToCart = async ({ request }) => {
	const { id, quantity } = await request.json();

	let cart = getCartFromSession(request);
	const existingItem = cart.items.find((item) => item.id === id);

	if (existingItem) {
		existingItem.quantity += quantity;
	} else {
		cart.items.push({ id, quantity });
	}

	updateCartSession(request, cart);
	return { status: 200, body: { cart } };
};

export const removeItemFromCart = async ({ request }) => {
	const { id } = await request.json();

	let cart = getCartFromSession(request);
	cart.items = cart.items.filter((item) => item.id !== id);

	updateCartSession(request, cart);
	return { status: 200, body: { cart } };
};

export const emptyCart = async ({ request }) => {
	let cart = { items: [] };
	updateCartSession(request, cart);
	return { status: 200, body: { cart } };
};

function getCartFromSession(request) {
	// Simulate session cart fetching logic
	return request.locals.cart || { items: [] };
}

function updateCartSession(request, cart) {
	// Simulate session cart update logic
	request.locals.cart = cart;
}

//Document action function
export async function fetchJobRecords(productNumberFilter = '') {
	const records = await pb.collection('Documents').getFullList(200 /* batch size */, {
		sort: '-created',
		filter: productNumberFilter ? `productNumber = "${productNumberFilter}"` : ''
	});
	const results = records.map((record) => {
		return { certificate: record.certificate, productNumber: record.productNumber };
	});
	return results;
}

export async function submitProduct(product) {
	try {
		const response = await pb.collection('products').create({
			name: product.name,
			description: product.description
		});
		return response; // Return the response from PocketBase
	} catch (error) {
		console.error('Error submitting product to PocketBase:', error);
		return null;
	}
}

// Function to update an existing product in PocketBase
export async function updateProduct(productId, productData) {
	try {
		const response = await pb.collection('products').update(productId, {
			name: productData.name,
			description: productData.description
		});
		return response;
	} catch (error) {
		console.error('Error updating product:', error);
		return null;
	}
}

// Function to delete a product from PocketBase
export async function deleteProduct(productId) {
	try {
		await pb.collection('products').delete(productId);
		console.log('Product deleted successfully');
	} catch (error) {
		console.error('Error deleting product:', error);
	}
}

//*******SignUP*********/
export async function register(data, pb) {
	if (data.passwordConfirm !== data.password) {
		return {
			type: 'error',
			message: 'Passwords do not match. Please try again.'
		};
	}
	await pb.collection('Register').create(data);
	return {
		type: 'success',
		message: 'Registration successful!'
	};
}

//********SignIn*********/
export async function login(email, password, pb) {
	const authData = await pb.collection('Register').authWithPassword(email, password);
	return {
		type: 'success',
		message: 'Login successful!'
	};
}

/******************Reset Password*******************/
export async function resetpassword(email, pb) {
	const records = await pb.collection('Register').getFullList({
		filter: `email="${email}"`
	});
	console.log('Email check records:', records);
	if (records.length === 0) {
		return {
			type: 'error',
			message: 'Email not registered. Please check and try again.'
		};
	}
	await pb.collection('Register').requestPasswordReset(email);
	return {
		type: 'success',
		message: 'Password reset email sent successfully! Please check your mail.'
	};
}

/******************Confirm Password********************/
export async function confirmpasswordreset(token, newPassword, newConfirmPassword, pb) {
	if (newPassword !== newConfirmPassword) {
		return {
			type: 'error',
			message: 'Passwords do not match. Please try again!'
		};
	}
	await pb.collection('Register').confirmPasswordReset(token, newPassword, newConfirmPassword);
	return {
		type: 'success',
		message: 'Your password has been reset successfully! You can now log in.'
	};
}

//search bar component
export async function fetchsearchcomponent() {
	try {
		const records = await pb.collection('SubCategories').getFullList({});
		return records.map((record) => ({
			name: record.name
		}));
	} catch (error) {
		console.error('Error fetching product names:', error);
		return [];
	}
}

//My Favourite Page
export async function loadFavourites(pb) {
	try {
		const records = await pb.collection('Products').getFullList();

		return records.map((record) => ({
			productName: record.productName,
			productNumber: record.productNumber,
			description: record.description,
			quantity: record.quantity || 1,
			price: record.priceSize,
			image: record.imageSrc
		}));
	} catch (error) {
		console.error('Error fetching favourites:', error);
		return [];
	}
}

/*******************ProductsInfoPopup******************/
export const checkavailabilityproduct = async (data, pb) => {
	const ProductId = data.ProductId;
	const requestedQuantity = parseInt(data.quantity, 10);

	let stockRecord = await pb
		.collection('Stocks')
		.getFirstListItem(`partNumber="${ProductId}"`, {
			expand: 'partNumber'
		})
		.catch((error) => {
			return null;
		});

	if (!stockRecord) {
		return {
			message: 'Out of stock',
			message1: '',
			stock: 'Unavailable',
			type: 'error'
		};
	}

	const stockQuantity = stockRecord.stockQuantity;
	const estimatedDate = new Date(stockRecord.estimatedDate);
	const formattedDate = new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(estimatedDate);

	if (stockQuantity > 0) {
		if (requestedQuantity <= stockQuantity) {
			return {
				message: `${requestedQuantity} Available to ship on ${formattedDate}.`,
				message1: '',
				stock: 'Available',
				type: 'success'
			};
		} else {
			const unavailableQuantity = requestedQuantity - stockQuantity;

			const leadTimeDate = new Date(estimatedDate);
			leadTimeDate.setDate(leadTimeDate.getDate() + 15);

			const formattedLeadTimeDate = new Intl.DateTimeFormat('en-GB', {
				day: '2-digit',
				month: 'long',
				year: 'numeric'
			}).format(leadTimeDate);

			return {
				message: `${stockQuantity} Available to ship on ${formattedDate}.`,
				message1: ` ${unavailableQuantity} Available to ship on ${formattedLeadTimeDate}.`,
				stock: 'Partial Availability',
				type: 'success'
			};
		}
	}
};

export const checkoutOrder = async (pb, order) => {
	const record = await pb.collection('Orders').create(order);
	if (record.id) {
		return { success: true, message: 'Successfully Ordered' };
	} else {
		return { success: false, message: 'Something went wrong' };
	}
};

export const submitFormData = async (data, pb) => {
	const formData = await data.formData();
	const formEntries = Object.fromEntries(formData.entries());

	console.log('Form Data:', formEntries);

	const dataToSubmit = {
		...formEntries,
		url: formEntries.url ? String(formEntries.url) : undefined
	};

	const uploadData = new FormData();

	// Add form data to FormData object
	Object.entries(dataToSubmit).forEach(([key, value]) => {
		if (value) uploadData.append(key, value);
	});

	// Handle image and ExtractedData (if provided)
	const image = formData.get('image');
	if (image) {
		uploadData.append('image', image);
	}

	const ExtractedData = formData.get('ExtractedData');
	if (ExtractedData) {
		uploadData.append('ExtractedData', ExtractedData);
	}

	try {
		// Submit the form data to PocketBase
		const response = await pb.collection('CopyrightConsent').create(uploadData);
		console.log('Form submitted successfully:', response);

		return { status: 200, body: { success: true, response } };
	} catch (error) {
		console.error('Error submitting form data:', error);
		return { status: 500, body: { success: false, message: 'Form submission failed.' } };
	}
};
