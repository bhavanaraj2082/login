import mongoose from "mongoose";

const { Schema } = mongoose;

const myFavouritesSchema = new Schema(
  {
    favorite: {
      type: Schema.Types.Mixed, 
      required: false,
    },
    userId: {
      type: Schema.Types.String, 
      ref: "Profile", 
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