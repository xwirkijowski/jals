import mongoose from "mongoose";

export default mongoose.model('User',	new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	isAdmin: {
		type: Boolean,
	},
	createdAt: {
		type: String,
	},
	createdBy: {
		type: mongoose.ObjectId,
	},
	updatedAt: {
		type: String,
	},
	updatedBy: {
		type: mongoose.ObjectId
	},
	version: {
		type: Number,
		default: 0
	},
}, {
	versionKey: false
}));

