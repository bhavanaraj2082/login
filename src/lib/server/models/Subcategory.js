import mongoose from "mongoose";

const { Schema } = mongoose;

const subCategorySchema = new Schema(
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
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category"
    },
    manufacturerIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manufacturer', // Reference to the Seller model
      default:[]
    }],
    subSubCategoryIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSubCategory', // Reference to the Seller model
      default:[]
    }]

  },
  {
    timestamps: true,       
    collection: "subcategories", 
  }
);

subCategorySchema.index({ name: 1 });
subCategorySchema.index({ urlName: 1 });
subCategorySchema.index({ category: 1 });

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
