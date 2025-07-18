import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema(
  {
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
  },
  {
    timestamps: true, 
    collection:"users"
  }
);

// Create the model based on the schema
const Register = mongoose.models.Register || mongoose.model('Register', registerSchema);

export default Register;
