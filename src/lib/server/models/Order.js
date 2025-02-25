import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema(
  {
    orderid: {
      type: Number,
      required: true
    },
    invoice: {
      type: Number,
      required: false
    },
    totalprice: {
      type: Number,
      required: true
    },
    subtotalprice: {
      type: Number,
      required: true
    },
    shippingprice: {
      type: Number,
      required: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    orderdetails: {
      type: mongoose.Schema.Types.Mixed, // For JSON type fields
      required: false,
    },
    shipdetails: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment'
    }],
    dashuserprofileid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'completed', 'pending cancellation', 'cancelled'],
      default: 'pending',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'orders'
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
