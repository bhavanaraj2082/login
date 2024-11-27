import Contact from "$lib/server/models/Contact.js";
import Order from "$lib/server/models/Order";

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
