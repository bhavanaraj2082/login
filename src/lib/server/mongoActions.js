import Contact from "$lib/server/models/Contact.js";

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