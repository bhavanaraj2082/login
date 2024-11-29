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
    category: {
      type: Schema.Types.ObjectId,  
      ref: "Category",              
      required: false,              
    },
    specificationHeadings: {
      type: Schema.Types.Mixed,  
      required: false,           
    },
    componentsCount: {
      type: Number,
      required: false,  
      min: 0,           
    },
    subSubCategories: {
      type: [Schema.Types.ObjectId],  
      ref: "SubSubCategory",          
      required: false,
    },
    filterCount: {
      type: Schema.Types.Mixed,  
      required: false,           
    },
  },
  {
    timestamps: true,       
    collection: "subcategories", 
  }
);

subCategorySchema.index({ name: 1 });
subCategorySchema.index({ urlName: 1 });
subCategorySchema.index({ category: 1 });
subCategorySchema.index({ specificationHeadings: 1 });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
