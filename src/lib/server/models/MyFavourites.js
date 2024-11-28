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
      ref: "ChemiDashProfile", 
      required: false, 
  }
},
  {
    timestamps: true, 
    collection: "myfavourites", 
  }
);

// Create the model
const MyFavourites = mongoose.model("MyFavourites", myFavouritesSchema);

export default MyFavourites;