import mongoose from "mongoose";

const { Schema } = mongoose;

const myFavouritesSchema = new Schema(
  {
    favorite: {
      type: Array, 
      default: [], 
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId, 
      ref: "profiles", 
      required: false, 
  }
},
  {
    timestamps: true, 
    collection: "myfavourites", 
  }
);

const MyFavourite = mongoose.models.MyFavourite || mongoose.model("MyFavourite", myFavouritesSchema);

export default MyFavourite;