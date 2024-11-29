import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		_id: { type: String, required: true, unique: true },
		hashed_password: { type: String, required: false }, // or 'null' if not required
		email: { type: String, required: true, unique: true },

		username: { type: String, required: true, unique: true },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now }
	},
	{
		timestamps: true,
		collection: 'users'
	}
);

export const User = mongoose.model('User', userSchema);
export default User;
