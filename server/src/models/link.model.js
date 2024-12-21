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
		createdAt: {
			type: String,
		},
		createdBy: {
			type: mongoose.ObjectId,
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