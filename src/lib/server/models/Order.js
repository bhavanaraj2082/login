import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    ordernumber: {
      type: Number,
      required: false,
      unique: false,
    },
    Invoice: {
      type: Number,
      required: false,
      unique: false,
    },
    totalprice: {
      type: Number,
      required: false,
      unique: false,
    },
    subtotalprice: {
      type: Number,
      required: false,
      unique: false,
    },
    shippingprice: {
      type: Number,
      required: false,
      unique: false,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',  // Replace 'Product' with the appropriate model name for the product collection
      required: false,
    }],
    orderdetails: {
      type: mongoose.Schema.Types.Mixed, // For JSON type fields
      required: false,
    },
    shipdetails: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipments', // Replace 'ShipDetail' with the appropriate model name for the ship details collection
      required: false,
    }],
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'INR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'CNY', 'HKD', 'NZD'],
      required: false,
    },
    dashuserprofileid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChemiDashProfile', // Replace 'UserProfile' with the appropriate model name for the user profile collection
      required: false,
    },
    deliveryaddress: {
      type: String,
      required: false,
    },
    billingaddress: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'completed', 'pending cancellation', 'cancelled'],
      required: false,
    },
  },
  { 
    timestamps: true,
    collection:"orders"
  }
);

// Create a model based on the schema
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
