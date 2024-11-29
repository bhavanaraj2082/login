import mongoose from 'mongoose';

const { Schema } = mongoose;

const shipmentSchema = new Schema({
    shipmentId: {
        type: String,
        required: false,
        unique: false,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: false,
    }],
    shippedDate: {
        type: Date,
        required: false,
    },
    estDeliveryDate: {
        type: Date,
        required: false,
    },
    deliveredDate: {
        type: Date,
        required: false,
    },
    shipMethod: {
        type: String,
        required: false,
    },
    shipDetails: {
        type: Schema.Types.Mixed, // For JSON data
        required: false,
    },
    invoice: {
        type: String,
        required: false,
    },
    shippingAddress: {
        type: Schema.Types.Mixed, // For JSON data
        required: false,
    },
    billingAddress: {
        type: Schema.Types.Mixed, // For JSON data
        required: false,
    },
    status: {
        type: String,
        required: false,
    }
}, {
    timestamps: true ,
    collection:"shipments"
});
// if(mongoose.models.Shipments){
// delete mongoose.models.Shipments
// }
// Create the Shipment model
const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);

export default Shipment;