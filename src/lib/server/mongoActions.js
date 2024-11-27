import Contact from "$lib/server/models/Contact.js";
import Products from "$lib/server/models/Products";
import Order from "$lib/server/models/Order.js";

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
      const record = await Products.findOne({ productNumber:num },{productNumber:1,priceSize:1,_id:0});
      if (record) {
        productObj.push(record);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  console.log(productObj);
  return JSON.stringify(productObj); // Return the result as a JSON string
};
