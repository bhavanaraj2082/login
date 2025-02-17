import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    productName: { 
        type: String, 
        required: true 
    },
    prodDesc: { 
        type: String, 
        required: false 
    },
    description: { 
        type: Schema.Types.Mixed, 
        required: false 
    },
    properties: {
        type: Schema.Types.Mixed,
        required: false,
        default: {}
    },
    manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
    productNumber: { type: String, required: true },
    priceSize: { type:Schema.Types.Mixed, default: [], required:false},
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: false },
    subsubCategory: { type: Schema.Types.ObjectId, ref: 'SubSubCategory' },
    subsubsubCategory: { type: Schema.Types.ObjectId, ref: 'SubSubSubCategory' },
    imageSrc: { type: String, required: false },
    returnPolicy: { type: Boolean, default: false },
    filteredProductData: { type: Schema.Types.Mixed, required:false },
    safetyDatasheet: { type: String, trim: true },
    safetyInfo: { type: [String], default: [] },
    encompass: { type: String, default: null },
    CAS:{ type: String, default: null },
    currency: { type: String, default: 'USD' },
    variants: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    prefixes: { type: Schema.Types.Mixed, required:false },
    cleanedName: { type: String, required: false },
}, { timestamps: false, collection: "products" });

productSchema.index({ productName: 1 }); // Matches PocketBase index
productSchema.index({ productNumber: 1 });
productSchema.index({ manufacturerName: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ subsubCategory: 1 });


// Fixed model definition
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;