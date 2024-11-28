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
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    language: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    chemiDashProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChemiDashProfile',
      required: false,
    },
    termsAndConditions: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // Optional: add createdAt and updatedAt fields
  }
);

// Create the model based on the schema
const Register = mongoose.model('Register', registerSchema);

export default Register;
