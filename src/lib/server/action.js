// action.js
import { PUBLIC_PB_EMAIL, PUBLIC_PB_PASSWORD, PUBLIC_PB_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
const pb = new PocketBase(`${PUBLIC_PB_URL}`);

async function adminLogin() {
    try {
        await pb.admins.authWithPassword(`${PUBLIC_PB_EMAIL}`, `${PUBLIC_PB_PASSWORD}`);
        console.log("Admin login successful");
    } catch (error) {
        console.error("Admin login failed:", error);
        throw new Error("Admin login failed");
    }
}
// Contact us form submisson #112
export async function handleFormSubmission(data) {
    await adminLogin(); // Log in before performing any actions

    try {
        // Prepare the data object from the form submission
        const submissionData = {
            enquiryType: data.enquiryType,
            preferredLang: data.preferredLanguage,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneCode: data.countryCode,
            phoneNum: data.phoneNumber,
            invoiceNum: data.invoiceNumber,
            orgName: data.organizationName,
            location: data.location,
            postCode: data.postCode,
            comment: data.comments,
            consent: data.consent === 'on'
        };

        // Create a new record in the PocketBase collection
        const record = await pb.collection('chemi_contactUs').create(submissionData);

        return { success: true, message: "Form submitted successfully!", record };
    } catch (error) {
        console.error("Error submitting form:", error);
        return { success: false, message: "Error processing form." };
    }
}
// #112 end

//#105 register/login widget
export async function createLogin({ request }) {
    const form = await request.formData();
    const email = form.get('email') ?? '';
    const password = form.get('password') ?? '';
    const data = {
      email,
      password
    };
    await pb.collection('login').create(data);
  }
  export async function createAccount({ request }) {
    const form = await request.formData();
    const title = form.get('title') ?? '';
    const fname = form.get('fname') ?? '';
    const lname = form.get('lname') ?? '';
    const email = form.get('email') ?? '';
    const titles = form.get('titles') ?? '';
    const phone = form.get('phone') ?? '';
    const countryregistration = form.get('countryregistration') ?? '';
    const state = form.get('state') ?? '';
    const organisation = form.get('organisation') ?? '';
    const jobtitle = form.get('jobtitle') ?? '';
    const primaryfield = form.get('primaryfield') ?? '';
    const role = form.get('role') ?? '';
    const password = form.get('password') ?? '';
    const confirmpassword = form.get('confirmpassword') ?? '';
    const data = {
      title,
      fname,
      lname,
      email,
      titles,
      phone,
      countryregistration,
      state,
      organisation,
      jobtitle,
      primaryfield,
      role,
      password,
      confirmpassword
    };
    await pb.collection('account').create(data);
  }
  // #201 Order Status form
export async function checkOrderStatus({ request }) {
    const form = await request.formData();
    const orderNumber = form.get('orderNumber') ?? '';
    const postalCode = form.get('postalCode') ?? '';

    await adminLogin(); 
    try {
        const orderData = {
            orderNumber,
            postalCode,
            status: 'Pending' 
        };

       
        const record = await pb.collection('orderstatus').create(orderData);

        return { success: true, message: "Order status saved successfully!", record };
    } catch (error) {
        console.error("Error submitting order status:", error);
        return { success: false, message: "Error processing order status." };
    }
}
//189 create document component
export async function handleSDSForm({ request }) {
    const data = await request.formData();
    const productNumber = data.get('product-number-sds');

  
    console.log("SDS Product Number Submitted:", productNumber);
    return { success: true };
}

export async function handleCOAForm({ request }) {
    const data = await request.formData();
    const productNumber = data.get('product-number-coa');
    const lotNumber = data.get('lot-number-coa');


    console.log("COA Product Number Submitted:", productNumber);
    console.log("COA Lot Number Submitted:", lotNumber);
    return { success: true };
}

export async function handleCOOForm({ request }) {
    const data = await request.formData();
    const productNumber = data.get('product-number-coo');
    const lotNumber = data.get('lot-number-coo');

    
    console.log("COO Product Number Submitted:", productNumber);
    console.log("COO Lot Number Submitted:", lotNumber);
    return { success: true };
}

export async function handleCQForm({ request }) {
    const data = await request.formData();
    const productNumber = data.get('product-number-cq');
    const lotNumber = data.get('lot-number-cq');


    console.log("CQ Product Number Submitted:", productNumber);
    console.log("CQ Lot Number Submitted:", lotNumber);
    return { success: true };
}

export async function getProducts() {
    const res = await import('$lib/data/products.json');
    return res.default;
  }
  
  // Fetch sub-products based on product ID
  export async function getSubProducts(productId) {
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);
    return product.subProducts;
  }
  
  // Fetch product information based on product and sub-product ID
  export async function getProductInfo(productId, subProductId) {
    const subProducts = await getSubProducts(productId);
    const subProduct = subProducts.find((s) => s.id === subProductId);
    return subProduct;
  }


  export const addItemToCart = async ({ request }) => {
    const { id, quantity } = await request.json();
    
    let cart = getCartFromSession(request);
    const existingItem = cart.items.find(item => item.id === id);
  
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
    cart.items = cart.items.filter(item => item.id !== id);
  
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



  ////contactus
  export const actions = {
    submitForm: async ({ request }) => {
       
        try {
            await authenticate();
        } catch (error) {
            return { success: false, error: error.message };
        }

        const formData = await request.formData();

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const record = await pb.collection('ContactUS').create(data); // Using PocketBase SDK to create a record
            console.log("Record created:", record);
            return { success: true, message: 'Message sent successfully!', data: record };
        } catch (error) {
            console.error('Error sending data to PocketBase:', error);
            return { success: false, error: 'Failed to send message. Please try again.' };
        }
    }
};