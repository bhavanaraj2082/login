import mongoose from 'mongoose';

// import mongooseSequence from 'mongoose-sequence';

// const AutoIncrement = mongooseSequence(mongoose);

const orderDetailsSchema = new mongoose.Schema({

	productId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Product"
	},
  stockId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Stock"
	},
  manufacturerId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Manufacturer"
	},
  distributorId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Distributor"
	},
  backOrder:{
		type:Number
	},
	orderQty:{
		type:Number,
	},
	readyToShip:{
		type:Number,
	},
	unitPrice:{
		type:Number,
	},
  extendedPrice:{
		type:Number,
	},
	productName:{
		type:String
	},
	manufacturerName:{
		type:String
	},
	
	_id:false
})

const orderSchema = new mongoose.Schema(
  {
    orderid: {
      type: Number,
      required: false,
      unique: true,
    },
    invoice: {
      type: String,
      required: false,
      unique: false,
    },
    totalprice: {
      type: Number,
      required: true
    },
    subtotalprice: {
      type: Number,
      required: true
    },
    shippingprice: {
      type: Number,
      required: true
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    orderdetails:[orderDetailsSchema],
    shipdetails: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment'
    }],
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'INR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'CNY', 'HKD', 'NZD'],
      required: false,
    },
    userId: {
      type:String
    },
    userEmail: {
      type:String
    },
    shippingaddress: {
      type: String,
      required: false,
    },
    billingaddress: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'completed', 'pending cancellation', 'cancelled'],
      default: 'pending',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'orders'
  }
);
delete mongoose.models.Order

// Create a model based on the schema
// if (!mongoose.models.Order && !orderSchema.paths.orderid.options.autoIncrement) {
// 	orderSchema.plugin(AutoIncrement, { inc_field: 'orderid' });
// }

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
