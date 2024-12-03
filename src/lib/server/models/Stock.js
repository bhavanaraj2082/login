import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const pricingSchema = new Schema(
    {
        break: { type: String, required: true },
        usd: { type: Number, required: true },
        offer: { type: String, default: '0' }
    },
    { _id: false }
); // Embedded schema, _id not required

const stockSchema = new Schema(
    {
        manufacturer: { type: Types.ObjectId, ref: 'Manufacturer', required: true },
        productName: { type: String, required: true },
        productNumber: { type: String, required: true },
        stock: { type: Number, default: 0 },
        minqtypurchase: { type: Number, default: 1 },
        buylinkurl: { type: String },
        distributor: { type: Types.ObjectId, ref: 'distributors', required: true },
        distibutorName: { type: String },
        distributorAlias: { type: String },
        pricing: { type: [pricingSchema], default: [] },
        orderMultiple: { type: Number },
        priceone: { type: Number }
    },
    {
        timestamps: true,
        collection: 'stocks'
    }
);

delete mongoose.models.Stock
export const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);
export default Stock;