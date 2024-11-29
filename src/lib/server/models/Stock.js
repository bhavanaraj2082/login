import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Stocks schema
const stocksSchema = new Schema(
  {
    partNumber: {
      type: Schema.Types.ObjectId, // Assuming partNumber refers to another collection, use ObjectId reference
      ref: 'products', // The name of the related collection (adjust as needed)
      required: false,
    },
    unitOfMeasure: {
      type: String,
      required: false,
    },
    deliveryUnit: {
      type: String,
      required: false,
    },
    stockQuantity: {
      type: Number,
      required: false,
    },
    pricingUnit: {
      type: String,
      required: false,
    },
    priceQty1: {
      type: String,
      required: false,
    },
    price1USD: {
      type: String,
      required: false,
    },
    priceQtyLast: {
      type: String,
      required: false,
    },
    priceLastUSD: {
      type: String,
      required: false,
    },
    specPricingUnit: {
      type: String,
      required: false,
    },
    specPriceQty1: {
      type: String,
      required: false,
    },
    specPrice1USD: {
      type: String,
      required: false,
    },
    specPriceQty2: {
      type: String,
      required: false,
    },
    specPrice2USD: {
      type: String,
      required: false,
    },
    estimatedDate: {
      type: Date,
      required: false,
    },
    leadTime: {
      type: Number,
      required: false,
    },
    supplier: {
      type: Schema.Types.ObjectId, // Assuming supplier refers to another collection, use ObjectId reference
      ref: 'Supplier', // The name of the related collection (adjust as needed)
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Stocks model
const Stock = mongoose.model('stock', stocksSchema);

export default Stock;
