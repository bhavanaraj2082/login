import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    urlName: {
      type: String,
      required: false,
      trim: true,
    },
    manufacturerIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manufacturer', // Reference to the Seller model
      default:[]
    }],
    subCategoryIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory', // Reference to the Seller model
      default:[]
    }]

  },
  {
    timestamps: true,      
    collection: "categories", 
  }
);

categorySchema.index({ name: 1 });
categorySchema.index({ urlName: 1 });


const Category =mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
