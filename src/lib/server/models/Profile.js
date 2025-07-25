import mongoose from "mongoose";

const jsonSchema = {
  type: mongoose.Schema.Types.Mixed,
  default: null,
};
const chemiDashProfileSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: false, unique: false },
    companytype: { type: String, required: false, unique: false },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    alternatePhone: {
      type: Number,
      required: false,
    },
    cellPhone: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: false,
    },
    tanNumber: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
    jobtitle: {
      type: String,
      required: false,
    },
    needsPasswordSetup: { type: Boolean, default: false },
    linkOrganization: jsonSchema,
    sitePreferences: jsonSchema,
    shippingAddress: jsonSchema,
    billingAddress: jsonSchema,
    organizationAddress: jsonSchema,
    paymentAddress: jsonSchema,
    emailPreferences: jsonSchema,
    paymentMethods: jsonSchema,
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

const Profile = mongoose.models.Profile || mongoose.model("Profile", chemiDashProfileSchema);

export default Profile;
