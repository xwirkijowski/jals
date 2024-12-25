import mongoose from 'mongoose';

export default mongoose.model('Click', new mongoose.Schema({
	linkId: {
		type: mongoose.ObjectId,
		ref: "Link",
		required: true,
		index: true
	},
	userAgent: {
		type: String,
		index: true,
	},
	platform: {
		type: String,
		index: true,
	},
	isMobile: {
		type: Boolean,
	},
	ipAddress: {
		type: String,
		index: true,
	},
	createdAt: {
		type: String,
	},
	createdBy: {
		type: mongoose.ObjectId,
	},
},{
	versionKey: false
}));