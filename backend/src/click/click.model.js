import mongoose from 'mongoose';

export default mongoose.model('Click', new mongoose.Schema({
	link: {
		type: mongoose.ObjectId,
		ref: "Link",
		required: true,
		index: true
	},
	time: {
		type: Date,
		required: true
	},
	platform: {
		type: String,
		required: true,
		index: true
	},
	isMobile: {
		type: Boolean,
		required: true,
	}
},{
	id: false,
	versionKey: false
}));