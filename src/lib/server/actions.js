import Pocketbase from "pocketbase"
import {DB_URL,DB_USER,DB_PASS} from "$env/static/private"
const pb = new Pocketbase(`${DB_URL}`)


export const myDetails = async(request)=>{
    const data = await request.formData()
    const details ={
        title:data.get("title"),
        firstname:data.get("firstname"),
        lastname:data.get("lastname"),
        mobilenumber:data.get("mobilenumber"),
        email:data.get("email"),
        organizationname:data.get("organizationname"),
        chemikartaccountno:data.get("chemikartaccountno"),
        billingaddress1:data.get("billingaddress1"),
        billingaddress2:data.get("billingaddress2"),
        country:data.get("country"),
        state:data.get("state"),
        city:data.get("city"),
        postcode:data.get("postcode"),
        delivetryaddress1:data.get("delivetryaddress1"),
        delivetryaddress2:data.get("delivetryaddress2")
    }

    try {
       await pb.admins.authWithPassword(`${DB_USER}`,`${DB_PASS}`)
        const record = await pb.collection("chemikart_mydetails").create(details)
        return {mydetails:{record}}
    } catch (error) {
       console.log(error); 
    }
}

export async function Addqoutes({request}) {
    const formData = await request.formData();
  
    const Custom_solution_type= formData.get("solutionValue")
    const Custom_format= formData.get("selectedColor")
    const Configure_custom_solution={
      components : formData.getAll("components[]"),
      solvent : formData.get("solvent"),
      packagingType : formData.get("packagingType"),
      volume : formData.get("volume"),
      units : formData.get("units"),
      qualityLevel : formData.get("qualityLevel"),
      analyticalTechnique : formData.get("analyticalTechnique"),
    }
    const Additional_notes = formData.get("futherdetails")
    const Customer_details={
      Title : formData.get("title"),
      Firstname : formData.get("first"),
      Lastname : formData.get("last"),
      organisation : formData.get("organisation"),
      country : formData.get("country"),
      lgc : formData.get("lgc"),
      email : formData.get("email"),
      number : formData.get("number"),
    }
    const Delivery_information={
      Address1 : formData.get("address1"),
      Address2 : formData.get("address2"),
      Country1 : formData.get("country1"),
      County : formData.get("county"),
      City : formData.get("city"),
      Post : formData.get("post")
  
    }
  
    const data = {
      Custom_solution_type: Custom_solution_type,
      Custom_format: Custom_format,
      Configure_custom_solution: Configure_custom_solution,
      Additional_notes: Additional_notes,
      Customer_details: Customer_details,
      Delivery_information: Delivery_information
  };
  
  try {
    await pb.admins.authWithPassword(`${DB_USER}`, `${DB_PASS}`);
    const record = await pb.collection('Chemikart_Qoute').create(data);
    return { status: 200, body: { success: true, record } };
  } catch (error) {
    // console.error('Error updating record:', error);
    return { status: 500, body: { success: false, error: error.message } };
  }
  }

  export const submitContactForm = async (formData) => {
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        role: formData.get('role'),
        details: formData.get('details'),
        location: formData.get('location'),
    };
  
    try {
        await pb.admins.authWithPassword(`${DB_USER}`, `${DB_PASS}`)
        const record = await pb.collection('ContactRequests').create(contactData);
        return {
            success: true,
            record
        };
    } catch (error) {
      console.log(error.response.data);
        return {
            success: false,
            error: error.response.data || 'An error occurred while submitting your form.',
        };
    }
  };

  export async function load({}) {
    await pb.admins.authWithPassword(email, password);
    const records = await pb.collection('Cart').getFullList(200, {
        sort: '-created',
    });

    const results = records.map(record => {
        return {
            id: record.id,
            name: record.name,
            code: record.code,
            description: record.description,
            price: record.price,
            image: record.image
        };
    });

    return {
        records: results
    };
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
export async function fetchcertificate(inputValue,pb) {
  const records = await pb.collection('Documents').getFirstListItem(`productNumber="${inputValue}"`, {
          fields: 'certificate, productNumber', 
      });
  return records;
}

// CONTACT US ACTION FUNCTION
export const submitContactInfo = async (data,pb) => {
  return await pb.collection("ContactUS").create(data);
};

//CHEMIKART SOLUTIONS PAGE CONTACT ACTION FUNCTION
export const submitContactData = async (data,pb) => {
  return await pb.collection("ContactTeam").create(data);
};





































// Help and Support Page
function finalformdata(formData) {
  let poNumber = "";
  let orderNumber = "";
  let invoiceNumber = "";
  if (formData.reference === "PO Number") {
    poNumber = formData.selectOptionNumber;
  } else if (formData.reference === "Order Number") {
    orderNumber = formData.selectOptionNumber;
  } else if (formData.reference === "Invoice Number") {
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
    assistance: formData.assistance,
    resetemail: formData.resetemail,
    primaryAddress: formData.primaryAddress,
    updateAddress: formData.updateAddress,
    issue: formData.issue,
    assistance: formData.assistance || "",
    items: items,
    exportMaterial: formData.exportMaterial,
    poNumber: formData.poNumber || poNumber,
    orderNumber: orderNumber || "",
    invoiceNumber: formData.invoiceNumber || invoiceNumber,
    confirmationNumber: formData.confirmationNumber || "",
    itemNumber: formData.itemNumber || "",
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    email: formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    companyName: formData.companyName || "",
    location: formData.location || "",
    accountNumber: formData.accountNumber || "",
    shippingStreetAddress: formData.streetAddress || "",
    shippingCity: formData.city || "",
    shippinglocation: formData.shippinglocation || "",
    shippingPostalCode: formData.postalCode || "",
    billingStreetAddress: formData.billingStreetAddress || "",
    billingCity: formData.billingCity || "",
    billingLocation: formData.billingLocation || "",
    billingPostalCode: formData.billingPostalCode || "",
    files: formData.files,
  };
  return finalData;
}
export const saveContactInfo = async (data, pb) => {
  try {
    let finalData = finalformdata(data);
    const record = await pb.collection("helpandSupport").create(finalData);
    return { success: true, record };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Help and Support page end


//******** */ Recommended products
export const fetchrecommended = async (data, pb) => {
  const productsFulldata = await pb.collection("Products").getList(1, 15, {
    filter: `productName="${data.productName}" `,
    expand: `manufacturerName`,
  });

  // console.log(productsFulldata);
  const products = productsFulldata.items.map((product) => ({
    productName: product.productName,
    productNumber: product.productNumber,
    manufacturerName: product.expand?.manufacturerName?.name,
    imageSrc: product.imageSrc,
    prodDesc: product.prodDesc || "",
    priceSize: product.priceSize,
    productSynonym: product.filteredProductData[`Synonym(S)`] || "",
  }));
  return products;
};

export const checkavailability = async (data, pb) => {
  
  const result = await pb
    .collection("Stocks")
    .getFirstListItem(`partNumber.productNumber="${data.productNumber}"`, {
      expand: `partNumber`,
    });
if(result)
{
  if(result.stockQuantity >= data.quantity)
    return result
}
};
// *****************/Recommended products end

//shopping cart
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


//Document action function
export async function fetchJobRecords(productNumberFilter = "") {
    const records = await pb.collection('Documents').getFullList(200 /* batch size */, {
        sort: '-created',
        filter: productNumberFilter ? `productNumber = "${productNumberFilter}"` : '', 
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
export const actions = {
  register: async (userData,pb) => {
    const { username, email, language, location, password, passwordConfirm } = userData;
    const data = {
      username,
      email,
      language,
      location,
      password,
      passwordConfirm, 
    };

    if (passwordConfirm !== password) {
      return {
        type: "error",
        message: "Passwords do not match. Please try again.",
      };
    }

    const record = await pb.collection('Register').create(data);
    return {
    type: "success",
    message: "Registration successful!",
    record: record,
    };
  },
};

//********SignIn*********/
export const signinActions = {
  signin: async (email, password, pb) => {
      const authData = await pb.collection('Register').authWithPassword(email, password);
      console.log("User authentication successful:", authData);
      return {
        type: "success",
        message: "Login successful!",
      };
  }
};

/******************Reset Password*******************/
export const passwordActions = {
  resetpassword: async (email, pb) => {
      const records = await pb.collection('Register').getFullList({
        filter: `email="${email}"`
      });
      console.log("Email check records:", records); 
      
      if (records.length === 0) {
        return {
          type: "error",
          message: "Email not registered. Please check and try again."
        };
      }
      await pb.collection('Register').requestPasswordReset(email);
      console.log("Password reset request sent successfully to:", email);
      return {
        type: "success",
        message: "Password reset email sent successfully! Please check your mail."
      };
  }
};

/******************Confirm Password********************/
export async function confirmpasswordreset(token, newPassword, newConfirmPassword, pb) {
  if (newPassword !== newConfirmPassword) {
      return {
        type: "error",
        message: "Passwords do not match. Please try again!"
      };
    }
    await pb.collection('Register').confirmPasswordReset(token, newPassword, newConfirmPassword);
    return {
      type: "success",
      message: "Your password has been reset successfully! You can now log in."
    };
}
//search bar 
export async function fetchproductName() {
  try {
     
      const subCategoryRecords = await pb.collection('SubCategories').getFullList();
      const subSubCategoryRecords = await pb.collection('SubSubCategories').getFullList();
      const manufacturerRecords = await pb.collection('Manufacturers').getFullList();

      
      const allRecords = [
          ...subCategoryRecords.map(record => ({ name: record.name })),       
          ...subSubCategoryRecords.map(record => ({ name: record.name })),    
          ...manufacturerRecords.map(record => ({ name: record.name }))     
      ];

      return allRecords;
  } catch (error) {
      console.error('Error fetching product names:', error);
      return []; 
  }
}
