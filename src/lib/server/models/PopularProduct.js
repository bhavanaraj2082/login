import mongoose from "mongoose";

const popularProductSchema = new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',              
        required: false               
      },
      order: {
        type: Number,                
        required: false,              
        min: 0,                      
        max: 100,                    
      }
    },
    { timestamps: true } 
  );


  const PopularProduct = mongoose.models.PopularProduct || mongoose.model('PopularProduct', popularProductSchema);
  
  export default PopularProduct;