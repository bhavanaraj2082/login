import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    technical_issue: { type: String, default: '' },
    issueName: { type: String, default: '' },
    documentRequired: { type: String, default: '' },
    currentEmail: { type: String, default: '' },
    newEmail: { type: String, default: '' },
    resetemail: { type: String, default: '' },
    primaryAddress: { type: String, default: '' },
    updateAddress: { type: String, default: '' },
    issue: { type: String, default: '' },
    assistance: { type: String, default: '' },
    items: { type: Object, default: {} }, // Storing items as an object
    exportMaterial: { type: String, default: '' },
    poNumber: { type: String, default: '' },
    orderNumber: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' },
    confirmationNumber: { type: String, default: '' },
    itemNumber: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    companyName: { type: String, default: '' },
    location: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    shippingStreetAddress: { type: String, default: '' },
    shippingCity: { type: String, default: '' },
    shippingLocation: { type: String, default: '' },
    shippingPostalCode: { type: String, default: '' },
    billingStreetAddress: { type: String, default: '' },
    billingCity: { type: String, default: '' },
    billingLocation: { type: String, default: '' },
    billingPostalCode: { type: String, default: '' },
    files: { type: Array, default: [] },
    status: { type: String, default: 'unread' }, // Default status
  },
  {
    timestamps: true,
    collection: 'helpsupport',
  }
);

// Create and export the model
const Helpsupport = mongoose.model('Helpsupport', exampleSchema);

export default Helpsupport;
