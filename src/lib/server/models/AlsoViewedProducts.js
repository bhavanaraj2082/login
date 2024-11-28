import mongoose from "mongoose";

const { Schema } = mongoose;

const viewedProductSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
      trim: true, 
    },
    brand: {
      type: String,
      required: false,
      trim: true,
    },
    code: {
      type: String,
      required: false,
      trim: true,
    },
    name1: {
      type: String,
      required: false,
      trim: true,
    },
    name2: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    estimatedShipping: {
      type: Date,
      required: false,
    },
    warehouse: {
      type: String,
      required: false,
      trim: true,
    },
    volume: {
      type: String,
      required: false,
      trim: true,
    },
    sku: {
      type: String,
      required: false,
      trim: true,
    },
    price1: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "viewedproducts",
  }
);

const ViewedProduct = mongoose.models.ViewedProduct || mongoose.model("ViewedProducts", viewedProductSchema);

export default ViewedProduct;
