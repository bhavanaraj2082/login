import mongoose from "mongoose";

const jsonSchema = {
  type: mongoose.Schema.Types.Mixed,
  default: null
};

const chemiDashProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  primaryPhone: {
    type: Number,
    required: false
  },
  cellPhone: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'register', 
    required: false
  },
  linkOrganization: jsonSchema, 
  sitePreferences: jsonSchema,
  shippingAddress: jsonSchema,
  billingAddress: jsonSchema,
  organizationAddress: jsonSchema,
  paymentAddress: jsonSchema,
  emailPreferences: jsonSchema,
  paymentMethods: jsonSchema
}, {
  timestamps: true,
  collection:"profiles"
});

const Profiles = mongoose.models.Profiles || mongoose.model('Profiles', chemiDashProfileSchema);

export default Profiles
