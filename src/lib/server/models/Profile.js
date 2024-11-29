import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		lastname: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		email: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		userId: {
			type: String, //mongoose.Schema.Types.ObjectId,
			ref: 'User', // Referencing the User model
			required: false,
			unique: false
		},
		country: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		currency: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		mailstop: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		city: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		state: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		postalcode: {
			type: Number,
			required: false,
			unique: false,
			min: null,
			max: null
		},
		address1: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		address2: {
			type: String,
			required: false,
			unique: false,
			minlength: null,
			maxlength: null,
			match: /.*/
		},
		shippingAddress: {
			type: String,
			required: false
		},
		billingAddress: {
			type: String,
			required: false
		}
	},
	{
		timestamps: true // Automatically manage createdAt and updatedAt fields
	}
);

export default mongoose.model('Profile', profileSchema);
