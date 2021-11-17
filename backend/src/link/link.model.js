import mongoose from 'mongoose';

export default mongoose.model('Links', new mongoose.Schema({
	target: {
		type: String,
		required: true,
		index: true
	},
	created: {
		type: Date,
		required: true
	},
	flags: {
		type: Number,
		required: true,
		default: 0
	}
},{
	id: false,
	versionKey: false
}));