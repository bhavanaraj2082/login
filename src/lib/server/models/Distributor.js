import mongoose from "mongoose";


const distributorSchema = new mongoose.Schema({
    distributorName:{ type:String },
    distributorEmail:{ type:String },
    status:{ type:String },
    updateFrequency:{ type:String },
    updatedBy:{ type:String },
},
{timestamps:true,collection:"distributors"}
)


const Distributor = mongoose.models.Distributor || mongoose.model("Distributor",distributorSchema)
export default Distributor