import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for Myfavourites
const myFavouritesSchema = new Schema(
  {
    favorite: {
      type: Schema.Types.Mixed, 
      required: false,
    },
    userProfileId: {
      type: Schema.Types.ObjectId, 
      ref: "Profile", 
      required: false, 
  }
},
  {
    timestamps: true, 
    collection: "myfavourites", 
  }
);


// Create the model
const MyFavourite = mongoose.models.MyFavourite || mongoose.model("MyFavourite", myFavouritesSchema);

export default MyFavourite;