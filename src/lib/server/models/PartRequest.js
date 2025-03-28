import mongoose from 'mongoose';

// Define the schema for the data
const productSchema = new mongoose.Schema(
  {
    productName: String,
    productNumber: String,
    status: String,
    units: Number,
    Firstname: String,
    lastname: String,
    organisation: String,
    phone: String,
    email: String,
    futherdetails: String
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create the Mongoose model with the specified collection name 'partsrequests'
const PartRequest = mongoose.models.PartRequest || mongoose.model("PartRequest", productSchema, 'partsrequests');

export default PartRequest;
