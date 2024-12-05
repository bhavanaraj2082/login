import mongoose from 'mongoose';

const curconversionSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  rate: {
    type: Number,
    required: false,
    unique: false,
    min: null,
    max: null, 
  },
}, {
  timestamps: true,
  collection: "currencyconversion"
});

const Curconversion = mongoose.models.Curconversion || mongoose.model('currencyconversion', curconversionSchema);

export default Curconversion;
