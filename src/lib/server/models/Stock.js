import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const stockSchema = new Schema(
    {
        productid:{ type: Types.ObjectId, ref: 'Product', required: true},
        productName: { type: String, required: true },
        productNumber: { type: String, required: true },
        manufacturer: { type: Types.ObjectId, ref: 'Manufacturer', required: true },
        distributor: { type: Types.ObjectId, ref: 'distributors', required: true },
        pricing: { type: Schema.Types.Mixed, default: [] },
        stock: { type: Number, default: 0 },
        orderedQty: { type: Number, default: 0 },
        orderMultiple: { type: Number },
        specifications:{type: String},
        sku:{type:String}
    },
    {
        timestamps: true,
        collection: 'stocks'
    }
);
//delete mongoose.models.Stock
export const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);
export default Stock;