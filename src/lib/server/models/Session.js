import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
	{
		// _id: { type: String, required: true, unique: true },
		// userId: { type: String, required: true },
		// expires: { type: Date, required: true },
		// createdAt: { type: Date, default: Date.now }

		_id: {
			type: String,
			required: true
		},
		user_iad: {
			type: String,
			required: true
		},
		active_expires: {
			type: Number,
			required: true
		},
		idle_expires: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export default Session;
