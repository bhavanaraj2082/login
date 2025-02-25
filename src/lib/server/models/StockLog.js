import mongoose from "mongoose"

const stockLogsSchema = new mongoose.Schema({
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
    quantity:{
        type:Number
    },
    totalStock:{
        type:Number
    },
    actionType:{
        type:String
    },
    actionName:{
        type:String,
        enum:["Ordered","Cancelled","Restock"]
    }
},
{
    collection:"stocklogs",
    timestamps:true
})
delete mongoose.models.StockLog
const StockLog = mongoose.models.StockLog || mongoose.model("StockLog",stockLogsSchema)
export default StockLog
