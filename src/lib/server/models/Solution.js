import mongoose from 'mongoose';
const chemikartSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: false,
      trim: true,
    },
    lname: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation
      trim: true,
    },
    number: {
      type: Number,
      required: false,
      min: null,
      max: null,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    details: {
      type: String,
      required: false,
      trim: true,
    },
    company: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      required: false,
      trim: true,
    },
    query: {
      type: mongoose.Schema.Types.Mixed, 
      required: false,
      maxSize: 2000000, 
    },
    status: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'chemikartsolutions', 
  }
);
const ChemikartSolution = mongoose.models.ChemikartSolution || mongoose.model('ChemikartSolution', chemikartSchema);
export default ChemikartSolution;