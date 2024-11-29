import Contact from "$lib/server/models/Contact.js";
import Order from "$lib/server/models/Order.js"
import Products from "$lib/server/models/Products";
import Solutions from "$lib/server/models/Solutions.js";
import Quotes from "$lib/server/models/Quotes.js";
import Helpsupport from "$lib/server/models/Helpsupport.js";


export const submitContactInfo = async (data) => {
  try {
    const newContact = new Contact(data); // Create a new instance of the ContactUS model
    const savedContact = await newContact.save(); // Save the document to the database
    return savedContact; // Return the saved document
  } catch (error) {
    console.error("Error saving contact info:", error);
    throw new Error("Failed to save contact information");
  }
};


export const getOrderresultData = async (body) => {
  const records = await Order.findOne({ ordernumber: body.orderNumber });
  if (records) {
    return {
      success: true,
      msg: "Success",
      order: JSON.parse(JSON.stringify(records)),
    };
  } else {
    return { success: false, message: "Order not found" };
  }
};


export const CancelOrder = async (body) => {
  const { recordId, status } = body;
  console.log("body",body)

  const updatedOrder = await Order.findByIdAndUpdate(
    recordId, 
    { status: status },
    { new: true } 
  );

  if (updatedOrder) {
    return { message: "Order Cancellation Submitted" };
  } else {
    return { message: "Order not found" }; 
  }
};

export async function checkavailabilityproduct(data) {
  const { ProductId, quantity: requestedQuantity } = data;
  const requestedQty = parseInt(requestedQuantity, 10);

    // Find the stock record for the given productId (partNumber)
    const stockRecord = await Stock.findOne({ partNumber: ProductId }).exec();
    console.log('stockRecord:', stockRecord);

    if (!stockRecord) {
      return {
        message: 'Out of stock',
        message1: '',
        stock: 'Unavailable',
        type: 'error',
      };
    }

    const { stockQuantity, estimatedDate } = stockRecord;
    const estimatedDateObj = new Date(estimatedDate);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(estimatedDateObj);

    if (stockQuantity > 0) {
      if (requestedQty <= stockQuantity) {
        return {
          message: `${requestedQty} Available to ship on ${formattedDate}.`,
          message1: '',
          stock: 'Available',
          type: 'success',
        };
      } else {
        const unavailableQuantity = requestedQty - stockQuantity;

        // Adding 15 days for the lead time
        const leadTimeDate = new Date(estimatedDateObj);
        leadTimeDate.setDate(leadTimeDate.getDate() + 15);

        const formattedLeadTimeDate = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(leadTimeDate);

        return {
          message: `${stockQuantity} Available to ship on ${formattedDate}.`,
          message1: ` ${unavailableQuantity} Available to ship on ${formattedLeadTimeDate}.`,
          stock: 'Partial Availability',
          type: 'success',
        };
      }
    }
}

export const checkoutOrder = async (order) => {
  try {
    const newOrder = await Order.create(order);

    if (newOrder._id) {
      return { success: true, message: 'Successfully Ordered' };
    } else {
      return { success: false, message: 'Something went wrong while creating order' };
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
      const record = await Products.findOne({ productNumber: num }, { productNumber: 1, priceSize: 1, _id: 0 });
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

//CHEMIKART SOLUTIONS
export const submitContactData = async (data) => {
  try {
    const newSolutions = new Solutions(data); 
    const savedSolutions = await newSolutions.save();
    return savedSolutions; 
  } catch (error) {
    console.error("Error saving Solutions info:", error);
    throw new Error("Failed to save Solutions information");
  }
};

//QUOTES
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
            analyticalTechnique: data.analyticalTechnique,
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
            number: data.number,
        },
        Delivery_information: {
            Address1: data.address1,
            Address2: data.address2,
            Country1: data.country1,
            County: data.county,
            City: data.city,
            Post: data.post,
        },
    };
    const newQuote = new Quotes(formattedData);
    try {
        await newQuote.save();
        return { success: true, message: "Quote added successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

//DOCUMENTS
/**
 * Fetch a product's certificate data from MongoDB based on productNumber.
 *
 * @param {string} inputValue - The product number to search for.
 * @returns {Promise<Object|null>} The product record or null if not found.
 */
export async function fetchcertificate(inputValue) {
    try {
        const record = JSON.parse(JSON.stringify(await Products.findOne(
            { productNumber: inputValue }, 
            'safetyDatasheet productNumber'      
        ).lean())); 
        return record || null;
    } catch (error) {
        console.error("Error fetching certificate:", error);
        throw new Error("Unable to fetch certificate.");
    }
}

//HELP & SUPPORT
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
  console.log("Raw Form Data:", formData);
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
    status: "unread", 
  };
  console.log("Processed Final Data:", finalData);
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
