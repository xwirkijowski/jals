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
	flags: [{
		note: {
			type: String,
			required: true
		},
		time: {
			type: Date,
			required: true
		}
	}]
},{
	id: false,
	versionKey: false
}));