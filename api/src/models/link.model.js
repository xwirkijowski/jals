import mongoose from 'mongoose';

export default mongoose.model('Links', new mongoose.Schema({
	target: {
		type: String,
		required: true,
		index: true
	},
	flags: [{
		note: {
			type: String,
			required: true
		},
		createdBy: {
			type: mongoose.ObjectId,
		},
		createdAt: {
			type: String,
		},
	}],
	active: {
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
},{
	versionKey: false
}));