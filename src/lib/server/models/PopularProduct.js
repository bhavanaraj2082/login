import mongoose from "mongoose";

const popularProductSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    product: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
     },
  },
  {
    timestamps: true,  
    collection: 'popularproducts', 
  }
  );

  const PopularProduct = mongoose.models.PopularProduct || mongoose.model('PopularProduct', popularProductSchema);
  
  export default PopularProduct;