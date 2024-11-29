import mongoose from 'mongoose';
const quoteSchema = new mongoose.Schema(
  {
    Custom_solution_type: {
      type: String,
      required: false,
    },
    Custom_format: {
      type: String,
      required: false,
    },
    Configure_custom_solution: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    Customer_details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    Delivery_information: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    Additional_notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, 
    collection: 'quotes', 
  }
);
const Quotes = mongoose.model('Quotes', quoteSchema);
export default Quotes;