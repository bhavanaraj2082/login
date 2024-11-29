import mongoose from 'mongoose';

const { Schema } = mongoose;

const subSubCategorySchema = new Schema(
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
    subCategory: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'SubCategory', 
      required: false, 
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: false, 
    },
  },
  {
    timestamps: true, 
    collection: 'subsubcategories', 
  }
);


const SubSubCategory = mongoose.model('SubSubCategory', subSubCategorySchema);

export default SubSubCategory;




