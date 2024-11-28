import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    productName: { type: String, trim: true },
    productNumber: { type: String, trim: true },
    manufacturerName: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' },
    prodDesc: { type: String, trim: true },
    priceSize: { type: Schema.Types.Mixed }, // JSON type
    Category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    subsubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
    imageSrc: { type: String, trim: true },
    filteredProductData: { type: Schema.Types.Mixed }, // JSON type
    properties: { type: Schema.Types.Mixed }, // JSON type
    description: { type: Schema.Types.Mixed }, // JSON type
    safetyDatasheet: { type: String, trim: true },
    safetyInfo: { type: Schema.Types.Mixed }, // JSON type
    image: { type: String }, // Use a file storage mechanism or URL
    currency: { type: String, enum: ['USD', 'INR', 'EUR'], trim: true },
    return: { type: Boolean },
    source: { type: String, trim: true },
    variants: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    encompass: { type: String, trim: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: 'products', // Ensure the name matches the PocketBase collection
  }
);

ProductSchema.index({ productName: 1 }); // Matches PocketBase index
ProductSchema.index({ productNumber: 1 });
ProductSchema.index({ manufacturerName: 1 });
ProductSchema.index({ Category: 1 });
ProductSchema.index({ subCategory: 1 });
ProductSchema.index({ subsubCategory: 1 });

// Fixed model definition
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
