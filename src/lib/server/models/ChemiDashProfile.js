import { Schema,model,models } from "mongoose";

const jsonSchema = {
  type: Schema.Types.Mixed,
  required: false,
  default: {}
};

const chemiDashProfileSchema = new Schema({
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
    required: false,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'Register', 
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
  collection:"chemidashprofile"
});

// Create and export the Mongoose model
const ChemiDashProfile = models.ChemiDashProfile || model('ChemiDashProfile', chemiDashProfileSchema);

export default ChemiDashProfile
