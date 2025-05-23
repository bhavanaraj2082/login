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
curconversionSchema.index({currency : 1 });
const Curcurrency = mongoose.models.Curcurrency || mongoose.model('Curcurrency', curconversionSchema);

export default Curcurrency;
