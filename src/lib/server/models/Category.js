import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId, 
      ref: "SubCategory",           
      required: false,             
    },
    urlName: {
      type: String,
      required: false,
      trim: true,
    },
    componentsCount: {
      type: Number,
      required: false,  
      min: 0,           
      max: 10000,       
    },
    filterCount: {
      type: Schema.Types.Mixed,  
      required: false,           
    },
    leadTime: {
      type: Number,
      required: false,  
      min: 0,           
    },
  },
  {
    timestamps: true,      
    collection: "categories", 
  }
);

categorySchema.index({ name: 1 });
categorySchema.index({ subCategory: 1 });
categorySchema.index({ urlName: 1 });
categorySchema.index({ componentsCount: 1 });


const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
