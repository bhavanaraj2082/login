import mongoose from 'mongoose';

const returnsSchema = new mongoose.Schema({
  returnItems: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  invoiceNumber: {
    type: String,
    required: false,
  },
  orderNumber: {
    type: String,
    required: false,
  },
  status: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  returnOrderid: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
  collection: 'returns'
});

const Returns = mongoose.models.returns || mongoose.model('returns', returnsSchema);
export default Returns;