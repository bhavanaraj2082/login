// src/models/EmailVerification.js
import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiry: { type: Date, required: true },
  verificationType:{ type:String, required:true },
  userId:{type:String,required:true}
},
{
  timestamps:true,
  collection:"tokenverifications"
}
);

const TokenVerification = mongoose.models.TokenVerification || mongoose.model('TokenVerification', emailVerificationSchema);

export default TokenVerification;
