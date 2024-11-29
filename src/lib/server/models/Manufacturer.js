import mongoose from 'mongoose';

const { Schema } = mongoose;

const manufacturerSchema = new Schema(
  {
    name: {
      type: String,
      required: false, 
      trim: true,
    },
    urlName: {
      type: String,
      required: false, 
    }
  },
  {
    timestamps: true, 
    collection: 'manufacturers', 
  }
);

const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);

export default Manufacturer;
