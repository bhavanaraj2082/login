import mongoose from 'mongoose';

const CopyConsentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    postalcode: {
      type: Number,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      match: /.+\@.+\..+/,
    },
    url: {
      type: String,
      required: false,
      match: /^(ftp|http|https):\/\/[^ "]+$/,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default:'unread'
    },
    image: {
      type: String, 
      required: false,
    },
    ExtractedData: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, 
    collection: 'copyconsent', 
  }
);

const CopyConsent = mongoose.models.CopyConsent || mongoose.model('CopyConsent', CopyConsentSchema);

export default CopyConsent;
