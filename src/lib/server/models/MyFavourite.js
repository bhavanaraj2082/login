import mongoose from "mongoose";

const { Schema } = mongoose;

const myFavouritesSchema = new Schema(
  {
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          default:[]
    },
    userId: {
      type: String,
      required:true
  }
},
  {
    timestamps: true,
    collection: "myfavourites",
  }
);

const MyFavourite = mongoose.models.MyFavourite || mongoose.model("MyFavourite", myFavouritesSchema);

export default MyFavourite;