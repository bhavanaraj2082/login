import mongoose from 'mongoose';

// Define the schema for Application
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  
});

// Create the model from the schema
const Application = mongoose.model('Application', applicationSchema);

export default Application;
