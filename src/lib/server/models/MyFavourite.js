import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const favoriteItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    stockId: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
    },
    manufacturerId: {
      type: Schema.Types.ObjectId,
      ref: "Manufacturer",
    },
    distributorId: {
      type: Schema.Types.ObjectId,
      ref: "Distributor",
    },
    productNumber: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      default: 0,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevents creating an extra `_id` for subdocuments
);

const myFavouritesSchema = new Schema(
  {
    favorite: [favoriteItemSchema],
    userId: {
      type: String,
      required: false,
    },
    userEmail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "myfavourites",
  }
);

const MyFavourite = models.MyFavourite || model("MyFavourite", myFavouritesSchema);

export default MyFavourite;